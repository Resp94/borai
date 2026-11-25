#!/usr/bin/env python3
"""
hookscore.py - dá nota à primeira frase de um Reel nas cinco coisas que bons
ganchos têm em comum, e ranqueia vários ganchos entre si. Versão pt-BR.

O que é: cinco heurísticas locais, calculadas só com o texto. Medem o que
ganchos que seguram atenção costumam ter - dá para falar em menos de três
segundos, tem algo concreto, tem algo em jogo, a parte interessante vem na
frente e fala com alguém.

O que NÃO é: previsor de views. No original (em inglês) separou bem gancho
real de gancho ruim de propósito (AUC 0,83), mas quase não separa os acertos
dos erros de um mesmo criador (AUC 0,56). Use para pegar saudação, enrolação,
gancho sem nada concreto e gancho longo demais. O gráfico de retenção vale
mais que este script.

Cada checagem vai de 0 a 100. Quanto maior, melhor.

Adaptado do instagram-agent-skill (MIT, Jake Schincariol) para pt-BR.

Uso
  python3 hookscore.py ganchos.txt            # um gancho por linha, ranqueados
  python3 hookscore.py --hook "Perdi R$ 18 mil por causa de uma cláusula."
  python3 hookscore.py - < ganchos.txt
  python3 hookscore.py ganchos.txt --json
"""

import argparse
import json
import re
import statistics
import sys

# Palavras com acento contam; "R$18.000" é uma palavra só (ver words()).
WORD_RE = re.compile(r"R\$\d[\d.]*(?:,\d+)?|[^\W_]+(?:[-'’%][^\W_]*)*", re.UNICODE)
NUMBER_RE = re.compile(
    r"R\$\s?\d[\d.]*(?:,\d+)?(?:\s?(?:mil|mi|milhão|milhões|bi))?"   # dinheiro
    r"|\b\d[\d.]*(?:,\d+)?\s?"                                          # número, com
    r"(?:%|mil\b|mi\b|k\b|x\b|h\b|horas?\b|min\b|minutos?\b"            # ou sem unidade
    r"|dias?\b|semanas?\b|mês\b|meses\b|anos?\b)?",
    re.IGNORECASE)
PROPER_RE = re.compile(r"(?<!^)\b[A-ZÀ-Þ][a-zà-ÿ]{2,}\b")
HASHTAG_RE = re.compile(r"(?:^|\s)#\w+")
EMOJI_RE = re.compile(r"[\U0001F300-\U0001FAFF☀-➿]")

# Ganchos falados dizem os números por extenso. "um" e "primeiro" ficam de
# fora de propósito: quase sempre são enchimento, não quantidade.
SPOKEN_NUMBERS = {
    "zero", "dois", "duas", "três", "tres", "quatro", "cinco", "seis", "sete",
    "oito", "nove", "dez", "onze", "doze", "quinze", "vinte", "trinta",
    "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa", "cem",
    "cento", "duzentos", "trezentos", "quinhentos", "mil", "milhão", "milhões",
    "bilhão", "dúzia", "metade", "dobro", "triplo",
}
MONEY_WORDS = {
    "reais", "real", "conto", "contos", "pila", "pilas", "grana", "porcento",
    "centavos", "milionário", "milionária", "faturamento", "lucro", "salário",
    "aluguel", "prejuízo", "boleto",
}

# Palavras que põem algo em jogo. Gancho sem nenhuma é afirmação; com uma,
# é motivo para continuar assistindo.
STAKES = {
    "pare", "nunca", "errado", "errada", "erro", "erros", "perdi",
    "perde", "perder", "perdendo", "custou", "custa", "custo", "quebrei",
    "quebrou", "falhei", "falhou", "fracasso", "ninguém", "não", "nao", "nem",
    "larguei", "demitido", "demitida", "apaguei", "apague", "matou", "mata",
    "substituiu", "substitui", "cortei", "corta", "venci", "grátis", "gratis",
    "paguei", "cobrei", "cobrou", "contratei", "economizei", "primeiro",
    "proibido", "ilegal", "pior", "odeio", "odiei", "desperdicei", "golpe",
    "mentira", "menti", "verdade", "segredo", "escondido", "roubou", "roubaram",
    "antes", "até", "em vez", "mas", "exceto", "problema", "risco", "perigo",
    "cuidado", "arrependo", "arrependimento", "deveria", "ainda", "já", "só",
    "sem", "contra", "versus", "vs", "na real", "caro",
}

# Aberturas que gastam o primeiro segundo sem dizer nada.
WEAK_OPENERS = [
    "então", "entao", "bom", "ok", "oi", "olá", "ola", "gente", "galera",
    "pessoal", "fala", "e aí", "e ai", "salve", "bem-vindo", "bem-vindos",
    "bem vindos", "hoje", "basicamente", "sinceramente", "olha só", "escuta",
    "tipo", "é", "hã", "só", "deixa eu", "deixa", "vamos", "bora", "eu queria",
    "eu quero", "um dos", "uma das", "você já", "você sabia", "vocês já",
    "neste", "nesse", "no vídeo", "a coisa", "muita gente", "existe", "existem",
    "tem gente", "isso é", "esse é", "essa é", "como um", "como uma",
    "quando se", "você sabe",
]

# Ordens que merecem a primeira posição.
IMPERATIVES = {
    "para", "pare", "rouba", "roube", "copia", "copie", "apaga", "apague",
    "testa", "teste", "olha", "olhe", "assiste", "assista", "lê", "leia",
    "salva", "salve", "usa", "use", "monta", "faz", "faça", "escreve",
    "escreva", "manda", "mande", "pega", "pegue", "começa", "comece", "larga",
    "nunca", "sempre", "não", "coloca", "coloque", "confere", "confira",
}

DEALBREAKERS = [
    (re.compile(r"(?i)^\s*(?:para de rolar|pare de rolar|não rola|nao rola|não passa|espera,? não)"),
     "Abre com \"para de rolar\". Pedir atenção prova que você não a conquistou."),
    (re.compile(r"(?i)\b(?:(?:neste|nesse|no) (?:vídeo|video|reel)(?: de hoje)?|hoje eu vou te (?:mostrar|ensinar)|(?:eu )?vou te (?:mostrar|ensinar)|você vai aprender)\b"),
     "Enrolação de vídeo. Apague e abra direto na recompensa."),
    (re.compile(r"(?i)^\s*(?:oi|olá|ola|e aí|e ai|fala|salve|bem[- ]vindos?)\b[ ,!]*(?:gente|galera|pessoal|turma)?"),
     "Saudação. Ninguém veio ao feed para ser cumprimentado."),
    (HASHTAG_RE,
     "Hashtag no gancho. Hashtag vai no fim da legenda, se for."),
    (EMOJI_RE,
     "Emoji no gancho. Texto de tela no tamanho de gancho tem espaço para palavras ou para emoji, não os dois."),
]


def clamp(n):
    return max(0.0, min(100.0, n))


def words(text):
    # "R$ 18.000" é uma palavra quando falado, então é uma palavra aqui também.
    return WORD_RE.findall(re.sub(r"R\$\s+(?=\d)", "R$", text))


def check_length(text):
    """O gancho tem que chegar antes do dedão mexer. Uns dois segundos."""
    w = words(text)
    n = len(w)
    secs = n / 2.5                       # ~150 palavras por minuto, falado
    chars = len(text.strip())
    if 5 <= n <= 12:
        score = 100.0
    elif n < 5:
        score = clamp(100 - (5 - n) * 20)
    else:
        score = clamp(100 - (n - 12) * 11)
    if chars > 60:                       # duas linhas de texto grande na tela
        score -= 12
    return clamp(score), f"{n} palavras, {chars} caracteres, ~{secs:.1f}s falado (bom: 5-12 palavras)"


def check_specificity(text):
    """Uma coisa concreta vale mais que três abstratas."""
    nums = [n.strip() for n in NUMBER_RE.findall(text) if n.strip()]
    propers = set(PROPER_RE.findall(text))
    low = [w.lower().strip("'’") for w in words(text)]
    spoken = [w for w in low if w in SPOKEN_NUMBERS or w in MONEY_WORDS]
    hits = len(nums) + len(propers) + len(spoken)
    score = 15.0 if hits == 0 else clamp(45 + hits * 30)
    found = ", ".join(nums[:2] + sorted(propers)[:2] + spoken[:2])
    return score, (f"{hits} marca(s) concreta(s)" + (f": {found}" if found else
                   " - sem número, sem nome, nada verificável"))


def check_stakes(text):
    """Tensão, custo, negação. Algo que a pessoa pode perder."""
    w = [x.lower().strip("'’") for x in words(text)]
    hits = [x for x in w if x in STAKES]
    low = text.lower()
    hits += [p for p in ("em vez", "na real") if p in low]
    markers = sorted(set(hits))
    if re.search(r"R\$\s?\d", text) or any(x in MONEY_WORDS for x in w):
        markers.append("um preço")
    n = len(markers)
    score = {0: 20.0, 1: 70.0}.get(n, 100.0)
    detail = f"{n} marca(s) de tensão" + (f": {', '.join(markers[:4])}" if markers else
                                          " - nada está em jogo nesta frase")
    return clamp(score), detail


def check_frontload(text):
    """A palavra interessante não pode estar na nona posição."""
    w = words(text)
    if not w:
        return 0.0, "vazio"
    low = [x.lower().strip("'’") for x in w]
    opener = " ".join(low[:2])
    penalty = 0
    hit_opener = None
    for weak in WEAK_OPENERS:
        if opener.startswith(weak) or low[0] == weak:
            penalty, hit_opener = 30, weak
            break
    payload = None
    for i, token in enumerate(low):
        if (token in STAKES or token in SPOKEN_NUMBERS or token in MONEY_WORDS
                or NUMBER_RE.match(w[i]) or (i and PROPER_RE.match(w[i]))):
            payload = i
            break
    if payload is None:
        base = 30.0
        where = "nenhuma palavra de impacto na frase"
    elif payload <= 3:
        base = 100.0
        where = f"impacto na palavra {payload + 1}"
    elif payload <= 6:
        base = 70.0
        where = f"impacto na palavra {payload + 1}, dá para trazer para frente"
    else:
        base = 40.0
        where = f"impacto na palavra {payload + 1}, tarde demais"
    detail = where + (f"; abertura fraca \"{hit_opener}\"" if hit_opener else "")
    return clamp(base - penalty), detail


def check_address(text):
    """Mirado em uma pessoa, ou solto no ar."""
    low = text.lower()
    w = [x.lower().strip("'’") for x in words(text)]
    if re.search(r"\b(você|voce|vc|vocês|voces|te|teu|tua|seu|sua|seus|suas)\b", low):
        return 100.0, "fala com quem assiste"
    if w and w[0] in IMPERATIVES:
        return 90.0, f"abre com uma ordem (\"{w[0]}\")"
    if re.search(r"\b(eu|meu|minha|meus|minhas|me|mim|nós|nosso|nossa|a gente)\b", low) or \
            re.search(r"^\s*\w+(?:ei|i)\b", low):
        return 70.0, "primeira pessoa, sem falar com ninguém"
    return 35.0, "terceira pessoa, ninguém na sala"


CHECKS = ["COMPRIMENTO", "CONCRETUDE", "TENSÃO", "POSIÇÃO", "DESTINATÁRIO"]


def run(text):
    results = {
        "COMPRIMENTO": check_length(text),
        "CONCRETUDE": check_specificity(text),
        "TENSÃO": check_stakes(text),
        "POSIÇÃO": check_frontload(text),
        "DESTINATÁRIO": check_address(text),
    }
    flags = [msg for pattern, msg in DEALBREAKERS if pattern.search(text)]
    scores = [results[c][0] for c in CHECKS]
    # O critério mais fraco limita o gancho, mesma lógica do detect.py: um
    # ponto ruim basta para o dedão continuar rolando.
    overall = statistics.mean(scores) * 0.6 + min(scores) * 0.4 - len(flags) * 15
    overall = clamp(overall)
    verdict = "FORTE" if overall >= 70 and min(scores) >= 55 and not flags else (
        "OK" if overall >= 50 else "FRACO")
    return results, overall, verdict, flags


def bar(score, width=24):
    filled = round(score / 100 * width)
    return "#" * filled + "." * (width - filled)


def render_one(text, results, overall, verdict, flags, out=sys.stdout):
    print("\nNOTA DO GANCHO", file=out)
    print("=" * 62, file=out)
    print(f"  \"{text.strip()}\"\n", file=out)
    for name in CHECKS:
        score, detail = results[name]
        print(f"  {name:<13} {bar(score)} {score:5.1f}", file=out)
        print(f"  {'':<13} {detail}", file=out)
    print("-" * 62, file=out)
    print(f"  {'NOTA DO GANCHO':<13} {bar(overall)} {overall:5.1f}   {verdict}", file=out)
    for f in flags:
        print(f"\n  ELIMINATÓRIO  {f}", file=out)
    if verdict != "FORTE":
        weakest = min(CHECKS, key=lambda c: results[c][0])
        print(f"\n  Ponto mais fraco: {weakest}. Corrija esse e rode de novo.", file=out)
    print("", file=out)


def render_table(rows, out=sys.stdout):
    print("\nRANKING DE GANCHOS\n" + "=" * 78, file=out)
    for i, r in enumerate(rows, 1):
        mark = "->" if i == 1 else "  "
        hook = r["hook"] if len(r["hook"]) <= 62 else r["hook"][:59] + "..."
        print(f"{mark} {r['score']:5.1f} {r['verdict']:<7} {hook}", file=out)
        print(f"        mais fraco: {r['weakest']} ({r['checks'][r['weakest']]['score']:.0f})", file=out)
        for f in r["flags"]:
            print(f"        eliminatório: {f}", file=out)
    print("\nGrave o primeiro. Se o primeiro está abaixo de 50, nenhum destes é o gancho.\n",
          file=out)


def main():
    ap = argparse.ArgumentParser(description="Dá nota a ganchos de Reel em pt-BR, em cinco critérios.")
    ap.add_argument("input", nargs="?", default="-", help="arquivo com um gancho por linha, ou -")
    ap.add_argument("--hook", help="dá nota a um único gancho passado na linha de comando")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    if args.hook:
        lines = [args.hook]
    else:
        raw = sys.stdin.read() if args.input == "-" else open(args.input, encoding="utf-8").read()
        lines = [l.strip() for l in raw.splitlines() if l.strip()]
    if not lines:
        print("nada para avaliar", file=sys.stderr)
        sys.exit(2)

    payload = []
    for line in lines:
        results, overall, verdict, flags = run(line)
        payload.append({
            "hook": line,
            "checks": {k: {"score": round(v[0], 1), "detail": v[1]} for k, v in results.items()},
            "weakest": min(CHECKS, key=lambda c: results[c][0]),
            "flags": flags,
            "score": round(overall, 1),
            "verdict": verdict,
        })

    if args.json:
        print(json.dumps(payload if len(payload) > 1 else payload[0], indent=2, ensure_ascii=False))
        return

    if len(payload) == 1:
        results, overall, verdict, flags = run(lines[0])
        render_one(lines[0], results, overall, verdict, flags)
    else:
        render_table(sorted(payload, key=lambda r: -r["score"]))

    sys.exit(0 if max(p["score"] for p in payload) >= 70 else 1)


if __name__ == "__main__":
    main()
