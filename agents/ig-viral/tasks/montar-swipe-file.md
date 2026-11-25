---
task: "Montar Swipe File"
order: 1
input: |
  - contas: 6 a 12 contas aprovadas no checkpoint (diretas, adjacentes, maiores)
  - tamanho_do_perfil: seguidores do perfil do usuário
output: |
  - coleta: arquivo TSV com conta, seguidores, mediana, views, gancho
  - swipe_file: _borai/_memory/instagram/{perfil}/swipe.md
  - relatorio: fórmulas no topo, estrutura do topo, ganchos sem fórmula, amostra
  - sua_versao: três ganchos do usuário nas fórmulas vencedoras
---

# Montar Swipe File

Coleta reels das contas aprovadas, ranqueia pelo múltiplo sobre a mediana e
transforma o resultado em ganchos que o usuário pode gravar.

## Process

1. Abrir cada conta no navegador do Borai (Playwright MCP, perfil salvo). Se pedir login, parar e pedir para o usuário entrar; nunca pedir senha.
2. Para cada conta: anotar seguidores, olhar as últimas 12 views e tirar a mediana, e registrar cerca de 12 reels com views e o gancho literal (falado ou de tela).
3. Gravar `coletados.tsv` com cabeçalho `conta	seguidores	mediana	views	gancho`.
4. Rodar `python3 agents/ig-viral/tools/swipe.py coletados.tsv --out _borai/_memory/instagram/{perfil}/swipe.md`.
5. Relatar só três coisas: fórmulas que aparecem demais no terço de cima (com contagem), o que o terço de cima tem em comum, e os ganchos sem fórmula lidos à mão. Dizer amostra e confiança.
6. Escrever a versão do usuário para as três fórmulas do topo, com uma história ou número dele.

## Output Format

```yaml
amostra: "38 reels, 7 contas, base: mediana da conta"
outliers:
  - multiplo: "38.4x"
    nota_gancho: 86
    formula: "#3 Ninguém Te Conta"
    conta: "@conta_a"
formulas_no_topo:
  - "#3 Ninguém Te Conta x5"
sem_formula: "6 - dois com o mesmo formato novo"
sua_versao:
  - formula: "#3"
    gancho: "..."
```

## Output Example

> Use as quality reference, not as rigid template.

```
SWIPE  ·  38 reels  ·  7 contas  ·  base: mediana da conta

ACIMA DE 3x
  38.4x  gancho 86  #3  Ninguém Te Conta   @conta_a   412.000  (mediana 10.700)
  11.2x  gancho 79  #9  O Roubo            @conta_c   180.000  (mediana 16.100)
   6.0x  gancho 71  #2  Ordem Negativa     @conta_b    54.000  (mediana 9.000)

O QUE ESTÁ APARECENDO DEMAIS
  #3 Ninguém Te Conta   x5 no terço de cima, 0 no de baixo
  #2 Ordem Negativa     x4
  tamanho do gancho     8 palavras em cima, 19 embaixo

SEM FÓRMULA (6)
  Dois têm o mesmo formato, que não está no hooks.json: o gancho abre lendo
  em voz alta o comentário de outra pessoa. Vale acrescentar.

AMOSTRA: 38 reels em 7 contas. Dá para afirmar as duas primeiras fórmulas;
o resto é indício.

SUA VERSÃO
  #3  "Ninguém te conta que as primeiras 20 propostas são feitas para perder."
  #2  "Para de mandar proposta em PDF. Manda em uma página no corpo do e-mail."
  #9  "Rouba o meu follow-up de quatro linhas."

Swipe file gravado em _borai/_memory/instagram/{perfil}/swipe.md.
```

## Quality Criteria

- [ ] Mediana registrada por conta e múltiplo calculado pelo `swipe.py`.
- [ ] Relato com as três coisas e a amostra.
- [ ] Três ganchos na versão do usuário.

## Veto Conditions

Reject and redo if ANY are true:
1. O ranking usou seguidores ou view bruta em vez da mediana.
2. Houve login pelo usuário, pedido de senha ou coleta automatizada em volume.
3. Algum roteiro ou vídeo de terceiro foi copiado em vez da fórmula.
