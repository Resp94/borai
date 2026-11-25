#!/usr/bin/env python3
"""
beats.py - transforma o roteiro de um Reel numa ficha de tempo antes de gravar.
Versão pt-BR.

Estima quanto tempo cada linha leva para ser falada, empilha em timecodes e
aponta as quatro coisas que matam um Reel na edição: gancho que passa dos três
segundos, trecho longo o bastante para a pessoa sair, sequência de linhas sem
nada concreto e duração total diferente da que você queria.

Os tempos são estimativa pela contagem de palavras num ritmo de palavras por
minuto. O padrão é 150 (português falado em ritmo de Reel). Cronometre você
lendo um roteiro em voz alta e ajuste com --wpm.

Adaptado do instagram-agent-skill (MIT, Jake Schincariol) para pt-BR.

Uso
  python3 beats.py roteiro.txt
  python3 beats.py roteiro.txt --target 30
  python3 beats.py roteiro.txt --wpm 170 --target 45
  python3 beats.py - < roteiro.txt
  python3 beats.py roteiro.txt --json
"""

import argparse
import json
import re
import sys
import unicodedata

WORD_RE = re.compile(r"R\$\d[\d.]*(?:,\d+)?|[^\W_]+(?:[-'’%][^\W_]*)*", re.UNICODE)
SENT_RE = re.compile(r"[^.!?]+[.!?]*")
CONCRETE_RE = re.compile(r"R\$\s?\d|\b\d[\d,.]*\b|(?<!^)\b[A-ZÀ-Þ][a-zà-ÿ]{2,}\b", re.MULTILINE)
STOPWORDS = {
    "o", "a", "os", "as", "um", "uma", "uns", "umas", "e", "ou", "mas", "se",
    "de", "do", "da", "dos", "das", "em", "no", "na", "nos", "nas", "por",
    "pra", "para", "com", "que", "isso", "isto", "esse", "essa", "este",
    "esta", "é", "são", "foi", "era", "ser", "ter", "tem", "você", "vocês",
    "seu", "sua", "eu", "meu", "minha", "me", "nós", "a gente", "eles",
    "elas", "ele", "ela", "então", "só", "não", "sim", "fazer", "faz", "fez",
    "vai", "vou", "já", "ao", "aos", "à", "às", "pelo", "pela", "tudo", "todo",
    "toda", "mais", "muito", "lá", "aqui", "aí",
}

HOOK_WINDOW = 3.0        # segundos. Depois disso o dedão já decidiu.
MAX_BEAT = 4.0           # segundos numa ideia sem mudar nada na tela.
ABSTRACT_RUN = 3         # trechos seguidos sem nada verificável.


def words(text):
    # "R$ 18.000" é uma palavra quando falado, então é uma aqui também.
    return WORD_RE.findall(re.sub(r"R\$\s+(?=\d)", "R$", text))


def pretty(token):
    """Mostra a palavra como foi escrita."""
    return token


def tc(seconds):
    m, s = divmod(seconds, 60)
    return f"{int(m)}:{s:04.1f}"


def split_beats(raw, wps):
    """Uma linha é um trecho, a menos que seja longa demais para isso."""
    beats = []
    for line in [l.strip() for l in raw.splitlines()]:
        if not line:
            continue
        if len(words(line)) / wps <= MAX_BEAT * 1.5:
            beats.append(line)
            continue
        # Parágrafo longo: quebra nos fins de frase para os tempos fazerem
        # sentido.
        parts = [p.strip() for p in SENT_RE.findall(line) if p.strip()]
        buf = ""
        for part in parts:
            candidate = (buf + " " + part).strip()
            if buf and len(words(candidate)) / wps > MAX_BEAT:
                beats.append(buf)
                buf = part
            else:
                buf = candidate
        if buf:
            beats.append(buf)
    return beats


def analyse(raw, wpm=150, target=None):
    raw = unicodedata.normalize("NFC", raw)  # texto colado do macOS vem decomposto
    wps = wpm / 60.0
    beats = split_beats(raw, wps)
    if not beats:
        return None

    rows, clock = [], 0.0
    for i, text in enumerate(beats):
        n = len(words(text))
        dur = n / wps
        rows.append({
            "n": i + 1,
            "start": round(clock, 2),
            "dur": round(dur, 2),
            "words": n,
            "text": text,
            "concrete": len(CONCRETE_RE.findall(text)),
            "label": "",
            "flags": [],
        })
        clock += dur
    total = clock

    # Marca as posições em torno das quais um Reel é montado.
    for r in rows:
        if r["n"] == 1 or r["start"] + r["dur"] <= HOOK_WINDOW:
            r["label"] = "GANCHO"
    rows[-1]["label"] = "CTA" if rows[-1]["label"] != "GANCHO" else "GANCHO/CTA"
    half = total / 2
    for r in rows:
        if not r["label"] and r["start"] <= half < r["start"] + r["dur"]:
            r["label"] = "MEIO"

    notes = []
    if rows[0]["dur"] > HOOK_WINDOW:
        rows[0]["flags"].append(f"gancho dura {rows[0]['dur']:.1f}s, passa da marca de {HOOK_WINDOW:.0f}s")
        notes.append(f"O trecho 1 leva {rows[0]['dur']:.1f}s para ser falado. Corte para "
                     f"{int(HOOK_WINDOW * wps)} palavras ou menos, senão o gancho chega depois "
                     "que a decisão já foi tomada.")
    if rows[0]["concrete"] == 0:
        notes.append("O trecho 1 não tem número nem nome. Gancho sem nada verificável "
                     "é o que a pessoa rola.")

    for r in rows:
        if r["dur"] > MAX_BEAT:
            r["flags"].append(f"{r['dur']:.1f}s num trecho só")
    long_beats = [r["n"] for r in rows if r["dur"] > MAX_BEAT]
    if long_beats:
        notes.append(f"Trecho(s) {', '.join(map(str, long_beats))} passam de {MAX_BEAT:.0f}s. "
                     "Quebre a linha ou mude o que aparece na tela dentro dela. "
                     "Quadro parado é onde as pessoas saem.")

    run, start = 0, None
    for r in rows:
        if r["concrete"] == 0:
            run += 1
            start = start if start is not None else r["n"]
            if run == ABSTRACT_RUN:
                notes.append(f"Os trechos {start}-{r['n']} não têm nada concreto. "
                             "Ponha um número, um nome ou um preço em um deles.")
        else:
            run, start = 0, None

    # A última linha devolve para a primeira?
    first = {w.lower() for w in words(rows[0]["text"]) if w.lower() not in STOPWORDS}
    last = {w.lower() for w in words(rows[-1]["text"]) if w.lower() not in STOPWORDS}
    loop = sorted(pretty(w) for w in first & last)
    if loop:
        notes.append(f"Tem loop: o último trecho repete \"{', '.join(loop[:3])}\" do gancho. "
                     "Segunda assistida é alcance de graça.")
    else:
        notes.append("Sem loop. O último trecho não repete nenhuma palavra do gancho, então o "
                     "vídeo termina chapado. Ecoar uma palavra do trecho 1 é o replay mais barato.")

    if target:
        delta = total - target
        if abs(delta) <= target * 0.1:
            notes.append(f"Duração no alvo ({total:.1f}s para {target}s).")
        elif delta > 0:
            notes.append(f"{delta:.1f}s acima do alvo. Corte umas {int(delta * wps)} palavras.")
        else:
            notes.append(f"{-delta:.1f}s abaixo do alvo. Acrescente {int(-delta * wps)} palavras "
                         "ou grave curto mesmo. Curto costuma estar certo.")

    return {
        "wpm": wpm, "target": target,
        "total_seconds": round(total, 2),
        "total_words": sum(r["words"] for r in rows),
        "beats": rows,
        "notes": notes,
    }


def render(a, out=sys.stdout):
    head = (f"FICHA DE TEMPO  ·  {a['total_words']} palavras  ·  ~{a['total_seconds']:.1f}s "
            f"a {a['wpm']:g} palavras/min" + (f"  ·  alvo {a['target']:g}s" if a["target"] else ""))
    print("\n" + head, file=out)
    print("=" * max(len(head), 72), file=out)
    for r in a["beats"]:
        label = f"{r['label']:<8}" if r["label"] else " " * 8
        print(f"  {tc(r['start'])}  {r['dur']:4.1f}s  {label}{r['text']}", file=out)
        for f in r["flags"]:
            print(f"  {'':>6}  {'':>5}  {'':<8}^ {f}", file=out)
    print("-" * max(len(head), 72), file=out)
    for n in a["notes"]:
        print(f"  - {n}", file=out)
    print("", file=out)


def main():
    ap = argparse.ArgumentParser(description="Transforma um roteiro de Reel em pt-BR numa ficha de tempo.")
    ap.add_argument("input", nargs="?", default="-", help="arquivo do roteiro, ou - para ler da entrada padrão")
    ap.add_argument("--wpm", type=float, default=150, help="ritmo de fala em palavras por minuto (padrão 150)")
    ap.add_argument("--target", type=float, help="duração alvo em segundos")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    raw = sys.stdin.read() if args.input == "-" else open(args.input, encoding="utf-8").read()
    a = analyse(raw, wpm=args.wpm, target=args.target)
    if not a:
        print("roteiro vazio", file=sys.stderr)
        sys.exit(2)
    if args.json:
        print(json.dumps(a, indent=2, ensure_ascii=False))
    else:
        render(a)
    sys.exit(0)


if __name__ == "__main__":
    main()
