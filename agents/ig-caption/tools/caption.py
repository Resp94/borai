#!/usr/bin/env python3
"""
caption.py - revisa uma legenda de Instagram em pt-BR e mostra exatamente o
que o feed exibe antes do "... mais".

O feed mostra uns 125 caracteres e esconde o resto atrás de um toque. Quase
toda legenda que falha, falha aí: o gancho está na terceira frase, a primeira
linha é uma saudação ou a legenda abre com hashtag. Este script desenha a
janela visível numa caixa, para você ler como um desconhecido rolando o feed,
e confere as oito coisas que valem conferir.

O corte de 125 é aproximado: muda com o aparelho, a fonte e as quebras de
linha. Teste um corte mais apertado com --truncate.

Adaptado do instagram-agent-skill (MIT, Jake Schincariol) para pt-BR.

Uso
  python3 caption.py legenda.txt
  python3 caption.py legenda.txt --keywords "contrato de prestação,proposta comercial"
  python3 caption.py - < legenda.txt
  python3 caption.py legenda.txt --json
"""

import argparse
import json
import re
import sys
import textwrap
import unicodedata

LIMIT = 2200             # Limite de caracteres da legenda no Instagram.
TRUNCATE = 125           # Onde o feed corta para "... mais", aproximadamente.
HASHTAG_LIMIT = 5        # Limite por post/reel desde 18/12/2025 (antes 30),
                         # anunciado pela conta @Creators.

OK, ATENCAO, FALHA = "OK", "ATENÇÃO", "FALHA"

HASHTAG_RE = re.compile(r"(?:^|\s)(#[^\W_][\w]*)", re.UNICODE)
MENTION_RE = re.compile(r"(?:^|\s)(@[A-Za-z0-9_.]+)")
LINK_RE = re.compile(r"https?://\S+|\bwww\.\S+|\b[a-z0-9-]+\.(?:com|com\.br|br|co|io|net|org|ai|app)/\S*",
                     re.IGNORECASE)
EMOJI_RE = re.compile(r"[\U0001F300-\U0001FAFF☀-➿←-⇿️]")
CONCRETE_RE = re.compile(r"R\$\s?\d|\b\d[\d,.]*\b|(?<!^)\b[A-ZÀ-Þ][a-zà-ÿ]{2,}\b", re.MULTILINE)

ASKS = [
    (re.compile(r"(?i)\b(?:comenta|comente|escreve|escreva|digita|digite)\b(?: aqui)?(?: a palavra)? [\"“]?[A-ZÀ-Þ0-9]{2,}"), "comentar uma palavra"),
    (re.compile(r"(?i)\b(?:me )?(?:chama|manda|mande) (?:uma )?(?:dm|direct|mensagem)\b|\bme chama no direct\b"), "mandar DM"),
    (re.compile(r"(?i)\b(?:salva|salve)\b"), "salvar"),
    (re.compile(r"(?i)\b(?:compartilha|compartilhe|manda (?:pra|para)|envia (?:pra|para))\b"), "compartilhar"),
    (re.compile(r"(?i)\b(?:me )?(?:segue|siga)\b"), "seguir"),
    (re.compile(r"(?i)\blink na (?:minha )?bio\b"), "link na bio"),
    (re.compile(r"(?i)\b(?:arrasta|arraste|desliza|deslize|toca|toque|clica|clique)\b"), "arrastar ou tocar"),
    (re.compile(r"(?i)\bme (?:conta|diz|fala)\b|\bqual (?:você|vc)\b|\bo que (?:você|vc) (?:faria|acha)\b"), "responder pergunta"),
]

FILLER_TAGS = {"#viral", "#fyp", "#explore", "#explorepage", "#foryou", "#foryoupage",
               "#trending", "#instagood", "#love", "#follow", "#like4like", "#reels",
               "#reelsinstagram", "#viralreels", "#instadaily", "#viralizar", "#explorar",
               "#paravocê", "#paravoce", "#tbt", "#sextou", "#instabrasil"}


def visible_window(text, cut):
    """O que o feed mostra. O Instagram corta no meio da palavra, então aqui também."""
    flat = text.strip()
    return flat if len(flat) <= cut else flat[:cut]


def render_box(window, truncated, out=sys.stdout, width=52):
    print("\n  O QUE O FEED MOSTRA", file=out)
    print("  +" + "-" * (width + 2) + "+", file=out)
    lines = []
    for raw in window.split("\n"):
        lines.extend(textwrap.wrap(raw, width) or [""])
    for line in lines[:8]:
        print(f"  | {line:<{width}} |", file=out)
    tail = "... mais" if truncated else "(a legenda cabe inteira)"
    print("  +" + "-" * (width + 2 - len(tail) - 2) + f" {tail} " + "+", file=out)


def analyse(text, cut=TRUNCATE, keywords=None):
    text = unicodedata.normalize("NFC", text)  # texto colado do macOS vem decomposto
    text = text.rstrip()
    stripped = text.strip()
    chars = len(stripped)
    lines = [l for l in stripped.split("\n")]
    first_line = lines[0].strip() if lines else ""
    tags = HASHTAG_RE.findall(stripped)
    mentions = MENTION_RE.findall(stripped)
    links = LINK_RE.findall(stripped)
    emoji = EMOJI_RE.findall(stripped)
    window = visible_window(stripped, cut)
    truncated = chars > cut
    asks = [name for pattern, name in ASKS if pattern.search(stripped)]
    filler = [t for t in tags if t.lower() in FILLER_TAGS]
    keywords = [k.strip() for k in (keywords or []) if k.strip()]

    checks = []

    def add(name, status, detail):
        checks.append({"check": name, "status": status, "detail": detail})

    add("COMPRIMENTO", FALHA if chars > LIMIT else OK,
        f"{chars} / {LIMIT} caracteres" + (f", {chars - LIMIT} acima do limite"
                                           if chars > LIMIT else ""))

    if not first_line:
        add("PRIMEIRA LINHA", FALHA, "a legenda começa com uma linha em branco")
    elif first_line.startswith("#") or first_line.startswith("@"):
        add("PRIMEIRA LINHA", FALHA,
            "abre com hashtag ou menção, justo na posição que merecia uma frase")
    elif len(first_line) > cut:
        add("PRIMEIRA LINHA", ATENCAO,
            f"{len(first_line)} caracteres, então é cortada em {cut} no meio da ideia. "
            "Bom se o corte gera suspense, ruim se corta uma oração pela metade")
    else:
        add("PRIMEIRA LINHA", OK, f"{len(first_line)} caracteres, aparece inteira")

    add("GANCHO CONCRETO", OK if CONCRETE_RE.search(window) else ATENCAO,
        f"{len(CONCRETE_RE.findall(window))} número(s) ou nome(s) na parte visível"
        + ("" if CONCRETE_RE.search(window) else " - nada verificável antes do toque"))

    if len(tags) > HASHTAG_LIMIT:
        add("HASHTAGS", FALHA, f"{len(tags)} hashtags, acima do limite de {HASHTAG_LIMIT} do Instagram. "
                               "As que passam da quinta não contam e o bloco parece antigo")
    elif len(tags) == HASHTAG_LIMIT and filler:
        add("HASHTAGS", ATENCAO, f"{len(tags)} hashtags, no limite, e "
                                 f"{len(filler)} delas genéricas. Use as cinco em temas")
    elif filler:
        add("HASHTAGS", ATENCAO, f"{len(tags)} hashtags, {len(filler)} genéricas "
                                 f"({', '.join(filler[:3])}). Elas não descrevem nada")
    else:
        add("HASHTAGS", OK, f"{len(tags)} hashtag(s)" + (f": {' '.join(tags)}" if tags else ""))

    if not tags:
        add("LUGAR DAS TAGS", OK, "sem hashtags para posicionar")
    elif any(re.search(r"(?:^|\s)" + re.escape(t) + r"\b", window) for t in tags):
        add("LUGAR DAS TAGS", ATENCAO, "tem hashtag na parte visível, "
                                       "gastando espaço do feed com etiqueta")
    else:
        add("LUGAR DAS TAGS", OK, "hashtags depois do corte")

    add("LINKS", ATENCAO if links else OK,
        f"{len(links)} link(s) na legenda, e link na legenda não é clicável. "
        f"Leve para a bio ou para a DM" if links else "nenhum link morto no texto")

    if len(asks) == 1:
        add("UM PEDIDO", OK, f"um pedido de ação: {asks[0]}")
    elif not asks:
        add("UM PEDIDO", ATENCAO, "nenhum pedido de ação. Decida para que serve este post")
    else:
        add("UM PEDIDO", ATENCAO, f"{len(asks)} pedidos ({', '.join(asks)}). "
                                  "Dois pedidos é o mesmo que nenhum")

    density = len(emoji) * 100 / max(chars, 1)
    add("EMOJI", ATENCAO if density > 4 else OK,
        f"{len(emoji)} emoji, {density:.1f} por 100 caracteres"
        + (" - parece enfeite" if density > 4 else ""))

    if keywords:
        low = stripped.lower()
        found = [k for k in keywords if k.lower() in low]
        missing = [k for k in keywords if k.lower() not in low]
        in_window = [k for k in found if k.lower() in window.lower()]
        status = OK if not missing else (ATENCAO if found else FALHA)
        add("TERMOS DE BUSCA", status,
            f"{len(found)}/{len(keywords)} presentes"
            + (f", {len(in_window)} na parte visível" if found else "")
            + (f". Faltando: {', '.join(missing)}" if missing else ""))

    fails = sum(1 for c in checks if c["status"] == FALHA)
    warns = sum(1 for c in checks if c["status"] == ATENCAO)
    verdict = "CORRIGIR" if fails else ("REVISAR" if warns else "PRONTA")

    return {
        "characters": chars, "limit": LIMIT, "truncate_at": cut,
        "visible": window, "truncated": truncated,
        "first_line_chars": len(first_line),
        "hashtags": tags, "mentions": mentions, "links": links,
        "emoji": len(emoji), "asks": asks,
        "checks": checks, "verdict": verdict,
    }


def render(a, out=sys.stdout):
    head = (f"REVISÃO DA LEGENDA  ·  {a['characters']} / {a['limit']} caracteres  ·  "
            f"{len(a['hashtags'])} hashtags  ·  {len(a['asks'])} pedido(s)")
    print("\n" + head, file=out)
    print("=" * max(len(head), 62), file=out)
    render_box(a["visible"], a["truncated"], out=out)
    print("", file=out)
    for c in a["checks"]:
        print(f"  {c['status']:<7} {c['check']:<16} {c['detail']}", file=out)
    print("-" * max(len(head), 62), file=out)
    print(f"  VEREDITO  {a['verdict']}\n", file=out)


def main():
    ap = argparse.ArgumentParser(description="Revisa uma legenda de Instagram em pt-BR.")
    ap.add_argument("input", nargs="?", default="-", help="arquivo da legenda, ou - para ler da entrada padrão")
    ap.add_argument("--truncate", type=int, default=TRUNCATE,
                    help=f"caracteres mostrados antes do '... mais' (padrão {TRUNCATE})")
    ap.add_argument("--keywords", default="", help="termos pelos quais você quer ser encontrado, separados por vírgula")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    raw = sys.stdin.read() if args.input == "-" else open(args.input, encoding="utf-8").read()
    a = analyse(raw, cut=args.truncate, keywords=args.keywords.split(","))
    if args.json:
        print(json.dumps(a, indent=2, ensure_ascii=False))
    else:
        render(a)
    sys.exit(0 if a["verdict"] == "PRONTA" else 1)


if __name__ == "__main__":
    main()
