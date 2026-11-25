---
task: "Avaliar Perfil"
order: 1
input: |
  - perfil: print ou texto com campo de nome, @, bio, link, destaques, fixados e nove capas
output: |
  - tabela: nota de cada um dos 12 itens com motivo
  - nota_antes: total de 0 a 100
  - reescritas: blocos prontos para copiar, na ordem dos pontos perdidos
  - nota_depois: nova nota e o que falta
---

# Avaliar Perfil

Pontua o perfil na rubrica de 12 itens e reescreve o que mais perdeu ponto.

## Process

1. Ler `agents/ig-profile/tools/rubric.json` e o `voice.md` do perfil.
2. Pontuar cada item com honestidade, com o motivo em uma linha. Somar.
3. Ordenar os itens pelos pontos perdidos e escrever as reescritas nessa ordem: campo de nome (3 opções), primeira linha da bio, fixados (qual post em cada função), destaques, link, capas.
4. Passar os textos pelo `python3 agents/ig-human/tools/humanize.py --report`.
5. Reavaliar com as reescritas aplicadas e dizer o que falta para o restante (o que não é texto).

## Output Format

```yaml
nota_antes: 38
tabela:
  - item: "campo de nome"
    nota: "2/12"
    motivo: "só o nome, nenhuma palavra que alguém busque"
reescritas:
  - item: "campo de nome"
    opcoes: ["...", "...", "..."]
nota_depois: 74
falta: "..."
```

## Output Example

> Use as quality reference, not as rigid template.

```
NOTA DO PERFIL  38/100

  campo de nome       2/12   só o nome, nenhuma palavra buscada
  primeira linha bio  3/12   "Empreendedora | Café | Mãe de pet"
  fixados             0/10   nada fixado
  destaques           2/8    "Aleatório", "Vida", "2023"
  legibilidade grade  4/8    seis das nove capas são rosto no meio da fala
  ...

REESCRITAS (do que perdeu mais para o que perdeu menos)

1. CAMPO DE NOME
   a) Ana Costa | Contratos para freelancer
   b) Ana Costa | Advogada de freelancers
   c) Ana Costa | Contrato sem calote

2. PRIMEIRA LINHA DA BIO
   Contrato que faz freelancer receber em dia.
   +300 contratos revisados. Modelo grátis no link.

3. FIXADOS
   prova:        o Reel da cláusula de R$ 18 mil
   oferta:       o carrossel "como funciona a revisão"
   apresentação: o Reel "por que eu larguei o escritório"

NOTA DEPOIS  74/100
Falta: capas legíveis (precisa regravar 6 capas) e hábito de Story diário.
Isso não é reescrita.
```

## Quality Criteria

- [ ] Doze itens pontuados com motivo.
- [ ] Reescritas na ordem dos pontos perdidos.
- [ ] Nota depois honesta.

## Veto Conditions

Reject and redo if ANY are true:
1. A nota antes foi inflada (itens com nota cheia sem cumprir a descrição da rubrica).
2. As reescritas não seguem a ordem dos pontos perdidos.
3. Algo foi alterado no Instagram ou foi pedida a senha.
