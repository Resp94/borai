# Art Déco

**Slug:** `art-deco` · **Categoria:** Gráfico e tipografia · **Filme de exemplo:** 58,4 s, 1920×1080

## O visual

Um cartaz dos anos 1930 em movimento. Fundo preto laqueado (`#0D0B09`), ouro em degradê do `#C9A24B` ao `#F3D98B`, com toques de esmeralda (`#1D6B57`), bordô (`#8E1B2E`) e marfim (`#F2E8D5`). Tudo tem filete dourado com brilho, leques de luz, arcos em degrau e perspectiva íngreme, com a câmera baixa olhando para o alto.

O exemplo é um hotel na véspera de Ano-Novo: título em arco, rua, saguão com elevadores, escada em corte de 30 andares, cozinha, telhado com letreiro de lâmpadas, salão de baile e cartão final. Um mensageiro (o "Pip") corre para entregar uma carta antes da meia-noite.

Elementos fixos do estilo:
- títulos em barra dourada com brilho que passa (`titleBar()`);
- letreiro de lâmpadas que acende letra por letra (`engine/bulbs.js`, aceita qualquer texto);
- mostradores, relógio com algarismos romanos e medalhões de andar;
- transições "dentro da cena": portas que se abrem do centro, porta giratória que varre a tela e portas de elevador que fecham no final.

A legenda é uma placa preta com borda dourada no pé da tela, com um ícone de quem fala: microfone para o locutor, quepe para o mensageiro.

## Quando usar

**Bom para:**
- hotelaria, restaurantes e marcas de luxo;
- convites, galas, festas de fim de ano e lançamentos com clima de evento;
- contagem regressiva e corrida contra o relógio;
- histórias curtas com um personagem e muito movimento de câmera.

**Evite para:** temas técnicos com muitos dados, tom casual ou infantil, e textos longos. O ouro sobre preto pede frases curtas e títulos em maiúsculas.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 58,4 s (116 BPM, a escada acelera até 138; `DUR` em `timeline.js`) |
| Formato | só horizontal, 1920×1080 (canvas fixo em `index.html` e medidas fixas no código) |
| Prévia ao vivo | ~71 fps (leve) |
| Fontes (OFL) | Limelight (títulos), Poiret One (letreiros), Josefin Sans (textos e legenda), Italiana (algarismos romanos) |
| Cores | preto `#0D0B09`, ouro `#C9A24B`→`#F3D98B`, esmeralda `#1D6B57`, bordô `#8E1B2E`, marfim `#F2E8D5` (paleta `C` em `engine/deco.js`) |
| Som | o código gera só a imagem; narração, trilha e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração / legenda | `lines.json` | campo `text` (ou `sub`, se a legenda for diferente da fala) de cada fala (`L1`…`L5`, `B1`, `B2`) |
| Duração de cada fala | `voices/dur.json` | segundos por fala; controla quanto tempo a placa fica na tela |
| Quando cada fala entra e quem fala | `timeline.js` | `LINES` (`t` = segundo de entrada, `who` = `radio` ou `boy`) |
| Ritmo, seções e pontos de sincronia | `timeline.js` | `BPM`, `SEC` (seções) e `T` (momentos nomeados) |
| Ordem e duração dos planos | `film.js` | `SHOTS` (início, fim, função do plano) |
| Transições | `film.js` | `TR` (`split`, `revolve`, `close`) |
| Título de abertura e ano | `shots_misc.js` | `titleShot()`: "MIDNIGHT", "AT THE STARLIGHT HOTEL", `yearBadge('1930')`, "NEW YEAR'S EVE" |
| Envelope | `shots_misc.js` | `envelopeInsert()`: "SPECIAL DELIVERY", "ROOFTOP BALLROOM", "BEFORE MIDNIGHT" |
| Cartão final | `shots_misc.js` | `endCard()` |
| Letreiro de lâmpadas | `scenes/roof.js` | `SIGN_TEXT` (e "THE STARLIGHT" na fachada, em `scenes/tower.js`) |
| Placas do saguão | `scenes/lobby.js` | "OUT OF ORDER" e "STAIRS" |
| Partitura no telhado | `shots_roof.js` | título e subtítulo da folha de música |
| Personagens | `chars.js` | `drawFigure()`, `drawPipHead()`, `drawDancer()`, `envelope()` |
| Cores | `engine/deco.js` | objeto `C` |

## Como adaptar

1. **Comece pelo texto.** Troque o título, o envelope, o letreiro (`SIGN_TEXT`), as placas e o cartão final. Escreva em pt-BR com acentos; o estilo pede maiúsculas nos títulos e letreiros.
2. **Troque as falas** em `lines.json` e meça a nova narração em `voices/dur.json`. Se uma fala ficar bem mais longa, ajuste o `t` dela em `LINES` para não encostar na próxima. A placa tem largura máxima de 1500 px; frases longas passam disso.
3. **Ajuste o tempo pelo `timeline.js`.** Planos, transições e falas saem dos mesmos números (`BPM`, `T`, `SEC`). Mudar o `BPM` estica ou encolhe o filme inteiro de uma vez.
4. **Personagens:** o mensageiro, os dançarinos e o envelope são desenhados em código (`chars.js`). Trocar cores e o quepe é fácil pela paleta `C`. Outra pessoa, outra roupa ou outro objeto exige redesenhar as funções de figura.
5. **Cenários:** saguão, escada, cozinha, telhado e fachada estão em `scenes/` e `shots_*.js`. Para outro lugar, é preciso reescrever a cena; os filetes, leques e brilhos de `engine/deco.js` servem de peças.
6. **Confira os quadros** com `?scene=frames.kit`, `?scene=frames.modelSheet` ou `?scene=frames.signTest` (folhas de referência em `frames.js`) e veja vários segundos do filme antes de renderizar.

## O que não mexer

- `engine/deco.js`: filete dourado (`gline()`), brilhos, leques e vinheta. É o que dá o acabamento laqueado.
- `engine/bulbs.js`: transforma qualquer texto em letreiro de lâmpadas.
- `engine/cam.js`: a câmera em perspectiva de dois e três pontos.
- As transições de porta em `film.js` (`splitOpen()`, `revolve()`): fazem parte do estilo.

## Atenção

- **Assinaturas do exemplo:** o cartão final (`endCard()` em `shots_misc.js`) mostra "LEMO-OPUSCAR" e "LemoLab × Claude Opus 5.5", além de créditos de vozes (Kokoro) e de samples de piano. Troque pelo nome da marca do usuário ou apague. A linha do piano ("Salamander Grand Piano V3", CC BY 3.0) só vale se a trilha do exemplo for usada, e ela não vem junto.
- **Nomes fictícios:** "Starlight Hotel", o ano 1930 e o mensageiro Pip aparecem no título, na fachada, no letreiro e no envelope.
- **Letras com acento:** as quatro fontes têm os acentos do português. O letreiro de lâmpadas aceita qualquer letra da fonte.
- **Modos especiais:** `?nosub` tira as placas de legenda. `?scene=arquivo.função` abre uma cena ou folha de referência sozinha (por exemplo, `?scene=frames.frameLobby`).
