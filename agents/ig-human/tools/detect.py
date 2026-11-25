#!/usr/bin/env python3
"""
detect.py - painel de cinco checagens que mede o quanto um rascunho em pt-BR
parece escrito por máquina.

O que é: cinco heurísticas locais inspiradas nos sinais que detectores de IA
medem - variação do tamanho das frases, concretude, vocabulário pronto,
marcas tipográficas e voz. Tudo é calculado na sua máquina, só com o texto.

O que NÃO é: GPTZero, Originality, Copyleaks ou Turnitin. Não chama essas
APIs e não garante o veredito deles. Pega o que todos eles observam.

Cada checagem dá uma nota HUMANA de 0 a 100. Quanto maior, melhor.

Adaptado do instagram-agent-skill (MIT, Jake Schincariol) para pt-BR.

Uso
  python3 detect.py rascunho.txt
  python3 detect.py - < rascunho.txt
  python3 detect.py rascunho.txt --json
  python3 detect.py antes.txt depois.txt      # compara dois rascunhos
"""

import argparse
import json
import os
import re
import statistics
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
LEX = os.path.join(HERE, "slop.json")
sys.path.insert(0, HERE)
from humanize import EMOJI_SEQ, lex_pattern, nfc  # noqa: E402

SENT_RE = re.compile(r"[^.!?\n]+[.!?]*")
WORD_RE = re.compile(r"[^\W_]+(?:[-'’][^\W_]+)*", re.UNICODE)
# Marcas de fala do português (o equivalente às contrações do inglês).
CONTRACTIONS = re.compile(
    r"\b(?:pra|pro|pras|pros|tá|tô|tava|né|cê|num|numa|dum|duma|tamo|bora|vamo|"
    r"daí|aí|tipo|cara|galera|beleza|valeu)\b", re.IGNORECASE)
PRONOUNS = re.compile(
    r"\b(eu|me|mim|meu|minha|meus|minhas|nós|nos|nosso|nossa|a gente|"
    r"você|vocês|te|ti|teu|tua|seu|sua)\b", re.IGNORECASE)
NUMBERS = re.compile(r"\b\d[\d,.]*%?|R\$\s?\d")
PROPER = re.compile(r"(?<![.!?]\s)(?<!^)\b[A-ZÀ-Þ][a-zà-ÿ]{2,}\b", re.MULTILINE)


def clamp(n):
    return max(0.0, min(100.0, n))


def scale(value, human, machine):
    """Map value onto 0-100 where `human` -> 100 and `machine` -> 0."""
    if human == machine:
        return 50.0
    return clamp((value - machine) / (human - machine) * 100)


def sentences(text):
    return [s.strip() for s in SENT_RE.findall(text) if len(s.split()) > 2]


def words(text):
    return WORD_RE.findall(text)


def check_burstiness(text):
    """Gente varia muito o tamanho das frases. Modelo escreve tudo igual."""
    lens = [len(s.split()) for s in sentences(text)]
    if len(lens) < 4:
        return 50.0, "curto demais para avaliar"
    mean = statistics.mean(lens)
    cv = statistics.pstdev(lens) / mean if mean else 0
    score = scale(cv, human=0.70, machine=0.22)
    return score, f"variação {cv:.2f} em {len(lens)} frases (bom: 0,55+)"


def check_specificity(text):
    """Números, nomes e coisas concretas. Texto de IA é abstrato."""
    w = words(text)
    if len(w) < 25:
        return 50.0, "curto demais para avaliar"
    per100 = 100 / len(w)
    hits = len(NUMBERS.findall(text)) + len(set(PROPER.findall(text)))
    density = hits * per100
    score = scale(density, human=6.0, machine=0.5)
    return score, f"{hits} marcas concretas, {density:.1f} por 100 palavras (bom: 4+)"


def check_slop(text, lex):
    """Densidade de vocabulário pronto, segundo o léxico."""
    w = words(text)
    if not w:
        return 50.0, "vazio"
    hits, found = 0, []
    for entry in lex["words"] + lex["phrases"]:
        n = len(lex_pattern(entry).findall(text))
        if n:
            hits += n
            found.append(entry["find"])
    density = hits * 100 / len(w)
    score = scale(density, human=0.0, machine=4.0)
    detail = f"{hits} termos prontos, {density:.1f} por 100 palavras"
    if found:
        detail += " (" + ", ".join(sorted(found)[:4]) + (", ..." if len(found) > 4 else "") + ")"
    return score, detail


def check_fingerprint(text):
    """Caracteres que o teclado do celular não produz."""
    # ZWJ e tags dentro de emoji (👨‍💻, 🏳️‍🌈) não são marca de máquina.
    invisible = sum(1 for c in EMOJI_SEQ.sub("", text) if unicodedata.category(c) == "Cf")
    em = text.count("—")
    curly = sum(text.count(c) for c in "‘’“”")
    ellip = text.count("…")
    nbsp = sum(text.count(c) for c in "   ")
    total = invisible * 4 + em * 2 + curly + ellip + nbsp
    per1k = total * 1000 / max(len(text), 1)
    score = scale(per1k, human=0.0, machine=12.0)
    detail = (f"{invisible} invisíveis, {em} travessão, {curly} aspas curvas, "
              f"{ellip} reticências, {nbsp} espaço rígido")
    return score, detail


def check_voice(text, lex):
    """Marcas de fala, pessoa e os formatos que o modelo usa por padrão."""
    w = words(text)
    if len(w) < 25:
        return 50.0, "curto demais para avaliar"
    per100 = 100 / len(w)
    contractions = len(CONTRACTIONS.findall(text)) * per100
    person = len(PRONOUNS.findall(text)) * per100
    tells = 0
    names = []
    for s in lex["structures"]:
        try:
            n = len(re.compile(s["regex"], re.MULTILINE).findall(text))
        except re.error:
            continue
        if n:
            tells += n
            names.append(s["id"])
    bullets = [len(b.split()) for b in re.findall(r"(?m)^\s*[-*•]\s+(.+)$", text)]
    uniform = (len(bullets) >= 3 and statistics.pstdev(bullets) < 1.6)
    score = (scale(contractions, human=3.0, machine=0.0) * 0.35
             + scale(person, human=8.0, machine=1.0) * 0.35
             + clamp(100 - tells * 22) * 0.30)
    if uniform:
        score -= 12
        names.append("marcadores-iguais")
    detail = (f"{contractions:.1f} marcas de fala, {person:.1f} pronomes pessoais "
              f"por 100 palavras, {tells} vício(s) de estrutura")
    if names:
        detail += " [" + ", ".join(names[:4]) + "]"
    return clamp(score), detail


CHECKS = ["RITMO", "CONCRETUDE", "TERMOS DE IA", "TIPOGRAFIA", "VOZ"]


def run(text, lex):
    text = nfc(text)
    results = {}
    results["RITMO"] = check_burstiness(text)
    results["CONCRETUDE"] = check_specificity(text)
    results["TERMOS DE IA"] = check_slop(text, lex)
    results["TIPOGRAFIA"] = check_fingerprint(text)
    results["VOZ"] = check_voice(text, lex)
    scores = [results[c][0] for c in CHECKS]
    # The weakest check drags the verdict: a detector only needs one signal.
    overall = statistics.mean(scores) * 0.6 + min(scores) * 0.4
    verdict = "APROVADO" if overall >= 70 and min(scores) >= 55 else (
        "REVISAR" if overall >= 50 else "REPROVADO")
    return results, overall, verdict


def bar(score, width=24):
    filled = round(score / 100 * width)
    return "#" * filled + "." * (width - filled)


def render(results, overall, verdict, label=None, out=sys.stdout):
    title = "PAINEL DE DETECÇÃO DE IA" + (f"  -  {label}" if label else "")
    print("\n" + title, file=out)
    print("=" * max(len(title), 62), file=out)
    for name in CHECKS:
        score, detail = results[name]
        print(f"  {name:<13} {bar(score)} {score:5.1f}", file=out)
        print(f"  {'':<13} {detail}", file=out)
    print("-" * 62, file=out)
    print(f"  {'NOTA HUMANA':<13} {bar(overall)} {overall:5.1f}   {verdict}", file=out)
    if verdict != "APROVADO":
        weakest = min(CHECKS, key=lambda c: results[c][0])
        print(f"\n  Sinal mais fraco: {weakest}. Corrija esse primeiro.", file=out)
    print("", file=out)


def main():
    ap = argparse.ArgumentParser(description="Mede o quanto um rascunho em pt-BR parece escrito por máquina.")
    ap.add_argument("input", nargs="?", default="-", help="arquivo, ou - para ler da entrada padrão")
    ap.add_argument("compare", nargs="?", help="segundo arquivo, para comparar antes/depois")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--lexicon", default=LEX)
    args = ap.parse_args()

    lex = json.load(open(args.lexicon, encoding="utf-8"))
    read = lambda p: sys.stdin.read() if p == "-" else open(p, encoding="utf-8").read()

    targets = [(args.input, read(args.input))]
    if args.compare:
        targets.append((args.compare, read(args.compare)))

    payload = []
    for name, text in targets:
        results, overall, verdict = run(text, lex)
        payload.append({
            "source": name,
            "checks": {k: {"score": round(v[0], 1), "detail": v[1]} for k, v in results.items()},
            "human_score": round(overall, 1),
            "verdict": verdict,
        })

    if args.json:
        print(json.dumps(payload if args.compare else payload[0], indent=2, ensure_ascii=False))
        return

    for (name, text), p in zip(targets, payload):
        results, overall, verdict = run(text, lex)
        render(results, overall, verdict, label=os.path.basename(name) if args.compare else None)
    if args.compare:
        a, b = payload
        delta = b["human_score"] - a["human_score"]
        print(f"  {a['human_score']:.1f} {a['verdict']}  ->  "
              f"{b['human_score']:.1f} {b['verdict']}   ({delta:+.1f})\n")

    sys.exit(0 if payload[-1]["verdict"] == "APROVADO" else 1)


if __name__ == "__main__":
    main()
