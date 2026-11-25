# Histórias com dados

**Slug:** `dataviz` · **Categoria:** Dados e mapas · **Filme de exemplo:** 50 s, 1920×1080

## O visual

Um gráfico de jornal desenhado ao vivo sobre papel creme `#F6F3EC` com pontilhado leve. Um lápis de madeira entra em cena, põe um ponto por ano e escreve anotações à mão ao lado dos pontos. A câmera acompanha a ponta do lápis da esquerda para a direita, aproxima e se afasta. O ritmo acelera: os primeiros anos caem devagar, os últimos caem em rajada.

Os pontos ganham cor pela temperatura, numa escala do azul `#2166AC` ao vermelho `#B2182B` (família RdBu do ColorBrewer, a mesma lógica das "listras do aquecimento"). Quando os dados sobem além do topo, o eixo "estala" e se reescala. No fim, a linha de pontos se transforma numa faixa de listras coloridas, os anos anteriores aparecem impressos da direita para a esquerda e sobra uma casa vazia tracejada para o próximo ano.

Elementos fixos:
- título e subtítulo do gráfico no topo;
- eixo de valores com a linha do zero e a nota "0 = 1951–80 average";
- anotações escritas à mão em azul `#2F5D8A` (vida) e vermelho `#A8283A` (recordes), com pequenos desenhos (onda, coração);
- legenda como texto de figura, entrando palavra por palavra, com um fio e um rótulo do período (por exemplo "1926–1958");
- cartão final com título, minilistras e créditos.

## Quando usar

**Bom para:**
- uma série temporal com uma virada clara (algo que fica parado e depois dispara);
- jornalismo de dados e relatórios que precisam de emoção sem perder o rigor;
- contar um número grande pela vida de uma pessoa ("os cem verões dela");
- clima, economia, saúde pública: qualquer dado anual com valores positivos e negativos.

**Evite para:** comparações entre muitas categorias, mapas, dados sem eixo de tempo, ou séries curtas (menos de umas 50 entradas). O filme foi montado para uma série longa, um valor por ano.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 50 s (90 BPM, 75 tempos; `DUR = T(75)` em `timeline.js`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `engine.js`) |
| Prévia ao vivo | ~94 fps (leve) |
| Fontes (OFL) | Newsreader (títulos e legenda), Caveat (letra à mão), IBM Plex Mono (números e rótulos) |
| Cores | papel `#F6F3EC`, tinta `#2B2723`, azul `#2F5D8A`, vermelho `#A8283A`; escala de dados `#2166AC`→`#F2EEE8`→`#B2182B` (`P` e `RAMP` em `engine.js`) |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Os dados | `data/jja.json` | listas `years` e `jja` (gerado a partir de `data/GLB.Ts+dSST.csv` por `tools/extract_data.py`) |
| Falas da narração / legenda | `lines.json` | `text` e `t` (segundo de entrada) de cada fala `l1`…`l5`; `hold` opcional fixa quanto tempo a legenda fica |
| Duração e tempo de cada palavra | `voices/dur.json`, `voices/words_rel.json` | segundos por fala e início de cada palavra; sem eles, o código divide o tempo por igual |
| Primeiro e último ano | `timeline.js` | `LIFE0` (1926) e `LIFE1` (2026) |
| Quando cada ano aparece | `timeline.js` | `yearK()`: faixas de anos e velocidade (semínima, colcheia, semicolcheia, fusa) |
| Momentos-chave | `timeline.js` | `K` (em tempos de 0,667 s): anotações, reescala, corte, transformação em listras, final |
| Anotações à mão | `film.js` | `ANN` (ano, texto, cor, deslocamento, desenho) e `marks` dentro de `renderFilm()` |
| Título e subtítulo | `film.js` | `'A Hundred Summers'` e a linha seguinte em `renderFilm()` |
| Textos do final | `film.js` | `'her hundred summers'`, `'Next summer?'` e a função `endCard()` |
| Câmera | `film.js` | `camAt()`, `trackPose()` e `CENTURY` |
| Escala do eixo | `timeline.js` e `film.js` | `BOX` (`vmin` = −0,9) e `vmaxAt()` (topo vai de 0,6 a 1,6) |
| Escala de cores | `engine.js` | `RAMP` e `valueColor()` (`center = .22`, `half = .85`) |

## O formato dos dados

O filme lê só `data/jja.json`. Para trocar o conteúdo, basta escrever esse arquivo no mesmo formato:

```json
{"source": "de onde vem o dado", "downloaded": "2026-09-26",
 "years": [1880, 1881, 1882],
 "jja": [-0.17, -0.08, -0.16]}
```

- `years` e `jja` têm o mesmo tamanho; a posição `i` de uma combina com a posição `i` da outra.
- Os valores são números decimais com ponto. No exemplo, são a diferença de temperatura do verão (junho a agosto) em °C em relação à média de 1951–1980. Valores negativos ficam azuis, positivos ficam vermelhos.
- O código usa os anos de 1880 a 2026: de `LIFE0` a `LIFE1` como pontos, e de 1880 a 1925 como listras "anteriores" no final. Todo ano desse intervalo precisa existir.

Se o dado vier em planilha, `tools/extract_data.py` aceita um CSV como o do exemplo: a primeira linha é um título qualquer, a segunda é o cabeçalho com uma coluna `Year` (primeira) e uma coluna `JJA`; valores ausentes vêm como `***` e são pulados. Exemplo de linha: `1880,-.19,-.26,...,-.17,-.21`. Para usar outra coluna, mude `'JJA'` no script.

## Como adaptar

1. **Comece pelos dados.** Gere o novo `data/jja.json`. Se o período não for 1926–2026, ajuste `LIFE0`, `LIFE1` e as faixas de `yearK()`; o código também supõe 101 anos em alguns pontos (a divisão por `101` na transformação em listras e o `101 * MINI.w` no cartão final).
2. **Ajuste a escala.** Veja o menor e o maior valor. Mude `BOX.vmin` e o teto final de `vmaxAt()` (1,6) para os pontos não saírem da caixa, e `center`/`half` em `valueColor()` para o meio da escala de cores cair na média do seu período de referência.
3. **Reescreva a história.** Troque as anotações em `ANN` e as marcas em `marks`, os anos das viradas em `yearK()` e nos comentários de `K`, e as falas em `lines.json`. Escreva em pt-BR com acentos; as fontes são completas.
4. **Ajuste o tempo das falas.** Com a narração nova, atualize `voices/dur.json` e `voices/words_rel.json` (lista de `{"w": palavra, "t": segundos desde o início da fala}`) ou apague-os para o código distribuir as palavras por igual. Confira se cada `t` em `lines.json` cai no momento certo do gráfico.
5. **Troque os números presos no código.** Em `camAt()` o valor `1.28` (o dado de 2026) está escrito à mão para enquadrar o último ponto; troque pelo último valor da sua série.
6. **Confira os quadros** na prévia em vários segundos: primeira anotação, reescala, corte para o último ano, listras e cartão final.

## O que não mexer

- `engine.js`: papel, lápis, pontos, traço a lápis, letra à mão e listras. É o estilo inteiro.
- O compasso fixo de 90 BPM (`B`, `T()`): todos os tempos do filme e da trilha dependem dele.
- O único corte seco (em `K.stop`): é o respiro antes do último ponto.

## Atenção

- **Fonte e licença dos dados:** NASA GISS Surface Temperature Analysis (GISTEMP v4), arquivo `GLB.Ts+dSST.csv`, coluna `JJA`. É trabalho do governo dos EUA, domínio público; foi copiado sem mudanças para `data/`. O valor de 2026 (+1,28 °C) é preliminar. Os dados estão dentro do projeto, nada é baixado. Mesmo em domínio público, mantenha o crédito da fonte no cartão final.
- **A personagem é inventada.** "Ela" nasce em 1926, vai ao mar em 1933 e tem uma filha em 1958. O próprio filme avisa no fim: "Her story is fiction. Every number is real." Se trocar os dados, troque também a história.
- **Assinaturas do exemplo:** o cartão final leva "Lemo-Opuscar · LemoLab × Claude Opus 5.5". Troque pelo nome da marca do usuário ou apague.
- **Texto em inglês na tela:** título, subtítulo, anotações, nota do eixo, legenda e cartão final estão em inglês. Tudo precisa ser traduzido.
- **A prévia depende da pasta da biblioteca:** `film.js` importa `/core/lib.js` pelo caminho absoluto, então a página precisa ser servida a partir de `skills/video-styles/`.
- **Modos especiais:** `?nosub` tira a legenda. `?engine` mostra uma página de teste do `engine.js` desenhando uma forma qualquer de três jeitos (tinta, série de dados, listras).
