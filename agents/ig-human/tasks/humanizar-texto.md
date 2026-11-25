---
task: "Humanizar Texto"
order: 1
input: |
  - rascunho: o texto a limpar (roteiro, legenda, slides, post, e-mail)
output: |
  - texto_limpo: o texto final
  - relatorio: o que foi removido, o que foi reescrito à mão
  - nota: nota humana antes e depois, veredito e sinal mais fraco
---

# Humanizar Texto

Limpa a cara de IA de um rascunho em pt-BR e prova a melhora com o painel de
cinco checagens.

## Process

1. Salvar o rascunho em `rascunho.txt` e rodar `python3 agents/ig-human/tools/humanize.py rascunho.txt -o limpo.txt --report`.
2. Ler a seção "VÍCIOS DE ESTRUTURA" do relatório e reescrever cada linha apontada à mão em `limpo.txt`, mantendo o sentido.
3. Rodar `python3 agents/ig-human/tools/detect.py rascunho.txt limpo.txt`.
4. Se o veredito não for APROVADO, corrigir o sinal mais fraco indicado e rodar de novo (no máximo dois ciclos). Se ainda falhar, explicar e recomendar um novo rascunho.
5. Entregar o texto limpo, o relatório e a nota antes/depois.

## Output Format

```yaml
texto_limpo: |
  ...
relatorio:
  removidos: 6
  reescritos_a_mao: ["não é só X, é Y (linha 2)"]
nota:
  antes: 41.2
  depois: 78.5
  veredito: APROVADO
  sinal_mais_fraco: RITMO
```

## Output Example

> Use as quality reference, not as rigid template.

```
ANTES
Neste cenário em constante evolução, é fundamental mergulhar fundo e potencializar
resultados. Não é só sobre vender, é sobre construir relacionamento. Vale ressaltar
que a jornada do cliente é crucial.

DEPOIS
Vender mais começa antes da proposta. Em março eu perdi dois clientes porque
respondi o orçamento três dias depois. Hoje respondo no mesmo dia, nem que seja
pra dizer que volto amanhã. O cliente lembra de quem respondeu.

RELATÓRIO
  6 marcas de máquina removidas ou substituídas (no cenário atual, mergulhar
  fundo, potencializar, vale ressaltar, jornada, crucial)
  1 vício de estrutura reescrito à mão: "Não é só sobre X, é sobre Y"

NOTA  41.2 REPROVADO  ->  79.4 APROVADO   (+38.2)
Sinal mais fraco depois: RITMO (61). Dá para quebrar mais uma frase longa.
```

## Quality Criteria

- [ ] Relatório do `humanize.py` incluído.
- [ ] Vícios de estrutura reescritos à mão.
- [ ] Antes e depois do `detect.py` mostrados.

## Veto Conditions

Reject and redo if ANY are true:
1. Só a nota foi entregue, sem o texto limpo.
2. O sentido do texto original mudou.
3. Foi prometido que o texto é "indetectável" ou passa em detectores externos.
