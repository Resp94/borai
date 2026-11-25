# Livro de giz de cera

**Slug:** `crayon-book` · **Categoria:** Pintura e ilustração · **Filme de exemplo:** 52 s, 1920×1080

## O visual

Uma página de livro infantil feita com uma caixa pequena de giz de cera sobre papel branco-quente `#f4efe3`. O contorno é anil `#2d3263`, nunca preto, para ficar suave na hora de dormir. O traço tem a textura do giz no papel e treme de leve o tempo todo. O desenho é de criança: a menina tem cerca de 2,6 cabeças de altura e a lua tem rosto.

No exemplo, a página se desenha sozinha no começo (linhas, cor, título escrito à mão). A lua não consegue dormir: rola na cama e conta carneirinhos, que aparecem numerados. Uma menina acorda, acena, pula a janela, sobe a escada até o telhado e canta. Um pincel passa aquarela azul-ultramar pelo céu em faixas, e estrelas de giz branco, quase invisíveis antes, aparecem por baixo da tinta (o efeito de cera que repele a aquarela). A lua boceja, puxa o cobertor e dorme. No fim, a câmera recua: a página vira parte de um livro aberto sobre uma mesa com gizes, pincel e copo d'água, e aparece a página "The End".

A legenda fica embaixo, numa mancha de papel limpo, escrita à mão na mesma tinta do contorno.

## Quando usar

**Bom para:**
- livros infantis e histórias de dormir;
- educação infantil;
- mensagens carinhosas e simples, com poucas frases.

**Evite para:** dados, temas técnicos, público adulto em tom sério, ou muito texto na tela.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 52 s (`DUR = 52` em `film.js`; 72 BPM em compasso de três tempos) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `crayon.js` e `gl.js`) |
| Prévia ao vivo | ~16 fps (pesado, 15–22 fps): a prévia pode engasgar, mas o render final não é afetado |
| Fontes (OFL) | Patrick Hand (legenda e texto do livro), Gaegu (título, números, "The End"); Short Stack, Gochi Hand, Caveat Brush e Sniglet vêm na pasta mas não entram no filme |
| Cores | papel `#f4efe3`, contorno `#2d3263`, lua `#f5c63c`, telhado `#d4483c`, céu `#79acd9`, estrelas de cera `#fbfaf4` (todas em `PAL`, `pal.js`) |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração / legenda | `film.js` | `LINES` (`id`, segundo de entrada `t`, duração `d`, `text`) |
| Texto para gerar a voz | `lines.json` | `text` de cada fala (`n1`…`n7`) |
| Duração real de cada fala | `voices/dur.json` | segundos por fala |
| Título na página | `film.js` | `drawPage()` ("The Moon" e "Can't Sleep") |
| Página do livro, "The End" e assinatura | `end.js` | `endFrame()` |
| Personagens | `chars.js` | `girl()`, `sheep()`, `moon()`, `star()` |
| O que a menina faz em cada momento | `film.js` | `girlState()` |
| Cenário (casa, escada, céu, estrelas) | `world.js` | `drawWorld()`, `HOUSE`, `LAD`, `STARS`, `MOON` |
| Faixas de aquarela no céu | `world.js` | `BANDS` (início, fim e direção de cada passada) |
| Câmera | `film.js` | `camT` (segundo, centro x, y e zoom) |
| Cores | `pal.js` | `PAL` |
| Eventos de som | `film.js` | `EV` (exportado para `events.json`) |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `LINES` e em `lines.json` (os dois precisam bater). Frases curtas, uma ideia por fala.
2. **Ajuste o tempo das falas.** Com a voz pronta, ponha a duração real em `voices/dur.json` e copie para o `d` de cada item de `LINES`. A legenda fica pelo menos 1,8 s e some antes da próxima fala.
3. **Troque o título** em `drawPage()` e as frases finais em `endFrame()`. Lembre que o título usa a Gaegu, que não tem acentos (veja "Atenção").
4. **História nova:** os personagens e o cenário são desenho em código. Trocar a menina, os carneiros ou a lua exige mexer em `chars.js`; mudar o enredo mexe em `girlState()`, `camT`, `BANDS` e `EV` ao mesmo tempo.
5. **Confira os quadros** em vários segundos (página se desenhando, carneirinhos, escada, aquarela, lua dormindo, livro na mesa) antes de renderizar.

## O que não mexer

- `crayon.js` e `gl.js`: são o motor do giz (traço, preenchimento, tremor) e da aquarela sobre o papel.
- `rig.js`: monta os personagens por partes.
- O céu que revela as estrelas de cera com a passada do pincel: é o clímax do estilo.

## Atenção

- **Gaegu sem acento:** a Gaegu (título, números dos carneirinhos e "The End") não tem ç, ã, õ, á, é, í, ó, ú, â, ê, ô nem à. Essas letras caem numa fonte reserva do navegador e ficam com outro desenho no meio da palavra. Prefira títulos sem acento ou avise o usuário. A Patrick Hand, da legenda e do texto do livro, tem todos os acentos.
- **Texto em inglês:** falas, título, páginas finais e "The End" estão em inglês, em `film.js` e `end.js`. Traduza para pt-BR.
- **Assinaturas do exemplo:** a última página escreve "Crayon Picture Book" e "LemoLab × Claude Opus 5.5" (`end.js`). A folha de personagens chama a menina de "PIP" (`sheet.js`). Troque pela marca do usuário ou apague.
- **Modos especiais:** `?poster=1` escreve o título grande em amarelo (cartaz). `?test=swatch` mostra as cores do giz. `?test=model&page=girl` ou `&page=moon` abre as folhas de personagem.
