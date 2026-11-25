---
task: "Garimpar Material"
order: 1
input: |
  - material: transcrição, texto ou arquivo de vídeo recebido no checkpoint anterior
  - tipo: vídeo próprio, podcast, live, artigo ou newsletter
output: |
  - encontrado: contagem por tipo de extração
  - semana: lista de posts com dia, formato, fórmula, ideia e trecho
---

# Garimpar Material

Extrai de um material longo os itens que se sustentam sozinhos e monta a
semana de posts, sem escrever os roteiros ainda.

## Process

1. Ler o material inteiro. Se for vídeo do próprio usuário, anotar a minutagem das falas fortes.
2. Listar as extrações por tipo: afirmações, números, histórias, mecanismos, erros, frases citáveis. Mostrar a contagem.
3. Se houver menos de quatro extrações utilizáveis, dizer que o material é fraco e parar.
4. Escolher o formato de cada extração e uma fórmula de gancho do `agents/ig-reel/tools/hooks.json`, sem repetir fórmula.
5. Ordenar a semana: afirmação mais forte primeiro, história no meio, mecanismo por último.
6. Entregar a semana e oferecer escrever um dia por vez. Após aprovação, gravar a semana em `_borai/_memory/instagram/{perfil}/plan.md`.

## Output Format

```yaml
origem: "título (duração ou palavras)"
encontrado:
  afirmacoes: 5
  numeros: 9
  historias: 3
  mecanismos: 4
  erros: 2
  frases: 7
semana:
  - dia: "terça"
    formato: "Reel"
    formula: "#2 Ordem Negativa"
    ideia: "..."
    trecho: "14:20-14:48"
```

## Output Example

> Use as quality reference, not as rigid template.

```
ORIGEM: "Por que acabamos com a reunião de diagnóstico" (podcast, 42 min, 8.900 palavras)

ENCONTRADO  5 afirmações, 9 números, 3 histórias, 4 mecanismos, 2 erros, 7 frases citáveis

SEMANA
TER  REEL      #2  Ordem Negativa      Para de fazer reunião de diagnóstico
                                       usar o trecho 14:20, ele ri no final
QUA  CARROSSEL legenda trabalho B      O formulário de 4 perguntas que substituiu a reunião
SEX  REEL      #21 Começo no Meio      "...e ele pediu reembolso nove dias depois"
                                       usar o trecho 27:05-27:40
DOM  REEL      #5  Tempo Encolhido     Seis horas por semana de volta com um link apagado

Diga "escreve terça" e eu escrevo esse primeiro.
```

## Quality Criteria

- [ ] Contagem antes da semana.
- [ ] Fórmulas diferentes em cada post.
- [ ] Minutagem indicada para material em vídeo.

## Veto Conditions

Reject and redo if ANY are true:
1. Algum post depende de ter visto o material original.
2. Foram entregues vários roteiros completos de uma vez.
3. Há números que não estão no material.
