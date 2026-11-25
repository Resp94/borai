# Pôster de viagem em serigrafia

**Slug:** `silkscreen-poster` · **Categoria:** Impressão e gravura · **Filme de exemplo:** 50 s, 1920×1080

## O visual

Cada cidade é um pôster de viagem em serigrafia que ocupa a tela inteira. O pôster é impresso na frente do espectador, uma tinta por vez: o rodo passa, a cor entra, a tela levanta. São poucas tintas chapadas por pôster (céu, morros, prédios, sol, luz), com o registro um pouco desalinhado e a textura de tinta sobre papel `#F3EAD8`. A câmera fica sempre dentro da imagem: não aparece mesa nem borda de papel.

No exemplo, um viajante sai de Pequim (Templo do Céu ao amanhecer), passa por Istambul (Santa Sofia), Paris (Torre Eiffel) e Buenos Aires (Obelisco e as casas coloridas de La Boca), atravessa o mar à noite e volta a Pequim ao anoitecer. Um canhoto de passagem fica sempre no mesmo lugar da tela: mostra o dia, a distância de casa e o monumento com o ano em que foi construído. Na volta, os números correm até zerar a distância de casa, e o pôster final fecha com o título.

A legenda é uma faixa impressa embaixo, centralizada, em tinta escura `#1B1F34` com letras cor de papel: chinês em cima, inglês embaixo. Cada fala entra com uma passada de tinta.

## Quando usar

**Bom para:**
- guias de destino e turismo;
- pôsteres de evento, festival ou temporada;
- roteiros com várias paradas e um número que acompanha a viagem;
- marcas que querem um ar gráfico e retrô.

**Evite para:** pessoas em close, emoção dramática, dados densos ou textos longos.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 50 s (`DUR = 50` em `film.js`; valsa a 108 BPM, compasso de três tempos) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `film.js`) |
| Prévia ao vivo | ~15 fps (pesado, 15–22 fps): a prévia pode engasgar, mas o render final não é afetado |
| Fontes (OFL) | Big Shoulders Display (números e título), Outfit (textos e legenda em inglês), Noto Sans SC (chinês) |
| Cores | papel `#F3EAD8`; uma paleta por pôster em `PAL` (`film.js`), por exemplo Pequim ao amanhecer: `#F5C978`, `#E8866A`, `#9A88AE`, `#22447C`, `#1B1F34`, sol `#D8432B` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas e legenda (fonte) | `voice/subs.json` | `t` (segundo de entrada), `en`, `zh` |
| Legenda que a página lê | `voice/cues.json` | `t0`, `t1`, `en`, `zh` (gerado por `tools/cues.py`) |
| Texto para gerar a voz | `voice/lines.json` | `text` de cada fala (`L01`…) |
| Primeira cidade | `film.js` | `PRINTS.beijing` (cidade, nome em chinês, dia, km, monumento, ano) |
| Outras cidades | `film.js` | chamadas de `drawArt()` (cabeçalho) e `stubCity()` (dia, km, monumento, ano) |
| Cidades na lista de textos | `film.js` | função `texts()`, que repete nomes e números |
| Desenho de cada lugar | `engine/scenes.js` | `temple()`, `istanbul()`, `paris()`, `boca()`, `sea()` |
| Cores de cada pôster | `film.js` | `PAL` |
| Distâncias que correm na volta | `film.js` | `TRAV0`, `TRAV1`, `FAR` |
| Tempos de cada parte | `film.js` | `P1`, `IST`, `PAR`, `BA`, `PUSH`, `SEA`, `HOME` e `SHOTS` |
| Canhoto ("FROM HOME", "TRAVELLED", "DAY", "BUILT") | `film.js`, `engine/poster.js` | `stubCity()`, `stubReturn()` e `drawStub()` |
| Pôster final | `engine/poster.js` | `drawEndCard()` |

## Como adaptar

1. **Comece pelas falas.** Troque `en` e `zh` em `voice/subs.json` e o texto da voz em `voice/lines.json`. Para pt-BR, ponha o português num dos dois campos e apague ou troque o outro.
2. **Refaça a legenda.** A página lê `voice/cues.json`. O `tools/cues.py` o refaz a partir de `voice/subs.json` e das durações em `out/voice/dur.json`, que não vem no pacote (é criado quando a voz é gerada). Sem ele, edite `voice/cues.json` à mão.
3. **Troque cidades e números.** Mude nomes, km, monumentos e anos em `PRINTS`, `drawArt()`, `stubCity()` e `texts()`. Os números aparecem também nas falas; confira se batem.
4. **Lugar novo exige desenho novo.** Cada paisagem é código em `engine/scenes.js`. Trocar o nome da cidade é fácil; trocar o monumento é trabalho de desenho. Cada pôster tem poucas tintas; mantenha a nova paleta em `PAL` com o mesmo número de cores.
5. **Confira os quadros** em vários segundos (primeira impressão, cada cidade, mar, volta, pôster final) antes de renderizar. `?a=` e `?b=` mostram só um trecho.

## O que não mexer

- `engine/silk.js`: é o motor da serigrafia (`squeegee()`, `ink()`, `inkFinish()`), com a passada do rodo, o desalinho e a textura da tinta.
- `engine/poster.js`: o desenho do pôster, do canhoto e do cartão final.
- A câmera sempre dentro do pôster, sem mesa nem borda: faz parte do estilo.

## Atenção

- **Assinaturas do exemplo:** o pôster final (`drawEndCard()` em `engine/poster.js`) escreve "LemoLab × Claude Opus 5.5". Com `?sign=1`, a mesma assinatura também é impressa no canto do primeiro pôster. O viajante e a viagem são inventados. Troque pela marca do usuário ou apague.
- **Texto em chinês fixo:** a linha `zh` das falas (`voice/subs.json` e `voice/cues.json`), os nomes das cidades ao lado do inglês (北京, 伊斯坦布尔, 巴黎, 布宜诺斯艾利斯) em `film.js`, e 绕远路回家 e 丝印旅行海报 no pôster final (`engine/poster.js`).
- **Texto em inglês fixo:** cabeçalhos das cidades, canhoto ("FROM HOME", "TRAVELLED", "DAY", "BUILT") e o pôster final ("THE LONG WAY HOME", "SILKSCREEN TRAVEL POSTER"). Traduza para pt-BR.
- **Monumentos reais:** Templo do Céu, Santa Sofia, Torre Eiffel, Obelisco e La Boca são silhuetas desenhadas em código, sem logo nem foto. As distâncias do exemplo são contadas a partir de Pequim; para outra cidade de partida, todas mudam.
- **Letras com acento:** Big Shoulders Display, Outfit e Noto Sans SC têm ç, ã, õ, á, é, í, ó, ú, â, ê, ô e à.
- **Modos especiais:** `?a=` e `?b=` renderizam só o trecho entre esses segundos. `?nocap=1` tira a legenda. `?sign=1` imprime a assinatura no canto.
