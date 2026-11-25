---
task: "Auditar Posts"
order: 1
input: |
  - numeros: views, alcance, % não seguidores, retenção 3 s, tempo médio, envios e seguidores por post
  - periodo: datas cobertas
output: |
  - metricas: tabela com as métricas calculadas por post
  - cinco_de_cima: os cinco melhores por múltiplo e envios por alcance
  - cinco_de_baixo: os cinco piores
  - conclusoes: até quatro, com evidência e confiança
  - pare_e_faca_mais: as duas decisões
---

# Auditar Posts

Calcula as métricas que importam, compara os melhores com os piores e
transforma isso em decisões.

## Process

1. Ler os números recebidos e o `log.md` do perfil (fórmula usada em cada post).
2. Calcular a mediana de views da conta e, por post: múltiplo, % de alcance de não seguidores, retenção aos 3 s, tempo médio, envios por alcance, seguidores por alcance.
3. Ranquear por múltiplo e envios por alcance; separar os cinco de cima e os cinco de baixo.
4. Procurar o que os separa, nesta ordem: retenção aos 3 s, fórmula de gancho, formato, duração (até 15 s, 15-30, 30-60, acima de 60), tema, resposta a comentários na primeira hora e, por último, dia e horário.
5. Verificar se o problema é de perfil (alcance alto, seguidores por alcance baixo).
6. Escrever até quatro conclusões com evidência e confiança, e o PARE / FAÇA MAIS.

## Output Format

```yaml
resumo: "31 posts, 12/06 a 05/09, mediana 4.100 views"
cinco_de_cima:
  - multiplo: "18.2x"
    formula: "#3"
    views: 74600
    nao_seguidores: "62%"
    retencao_3s: "71%"
    envios: 128
conclusoes:
  - texto: "..."
    evidencia: "..."
    confianca: "alta (n=31)"
pare: "..."
faca_mais: "..."
```

## Output Example

> Use as quality reference, not as rigid template.

```
AUDITORIA  ·  31 posts  ·  12/06 a 05/09  ·  mediana 4.100 views

5 DE CIMA (por múltiplo)
  18.2x  #3  Ninguém Te Conta     74.600 views  62% não seguidores  ret.3s 71%  128 envios
   6.4x  #1  Confissão de Custo   26.300 views  48% não seguidores  ret.3s 64%   71 envios
   ...

5 DE BAIXO
   0.3x  #11 Lista Com Favorito    1.200 views   9% não seguidores  ret.3s 31%    2 envios
   ...

O QUE OS DADOS DIZEM
1. A retenção aos 3 s explica quase tudo: 66% em cima, 33% embaixo.
   O resto que te preocupa vem depois dos dois primeiros segundos.
2. Posts em que você é quem se deu mal: média 8,1x contra 0,9x do resto.
   n=5. É o sinal mais forte daqui.
3. Listas de ferramentas dão view e nada mais: alcance alto, zero envio,
   zero seguidor. Três dos cinco de baixo.
4. Dia da semana não mostra nada: terça e sexta estão dentro do ruído.

PARE: listas de ferramentas.
FAÇA MAIS: histórias com um custo que você pagou e um número junto.
```

## Quality Criteria

- [ ] Cálculos mostrados.
- [ ] Conclusões com evidência e n.
- [ ] PARE e FAÇA MAIS explícitos.

## Veto Conditions

Reject and redo if ANY are true:
1. O ranking usou views brutas.
2. Alguma conclusão não tem evidência ou confiança.
3. Dia/horário foi apontado como causa antes de checar gancho, formato e tema.
