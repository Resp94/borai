# Abertura de espionagem anos 60

**Slug:** `spy-titles` · **Categoria:** Filme e fita · **Filme de exemplo:** 44,1 s, 1920×1080

## O visual

Papel recortado com tesoura e impresso em só quatro tintas: preto `#1b1714`, papel creme `#efe4c9`, vermelho `#d23a22` e mostarda `#e2a52a`. As bordas de cada peça são irregulares, como corte à mão, e cada recorte projeta uma sombra leve sobre o fundo. Os personagens são silhuetas chapadas, quase sempre de perfil, que se movem "de dois em dois" quadros, como animação antiga.

O filme é uma abertura de créditos: as palavras fazem parte do cenário. "STARRING" vira as colunas de um aeroporto, "MUSIC BY THE SAMPLER" vira os vagões de um trem, e o "O" de "THE COURIER" é uma roleta. No fim, os pedaços se juntam no título "THE VELVET CIPHER", em que o "I" é uma placa com fechadura e a chave entra nela.

A legenda é uma faixa de papel com texto em League Spartan, que entra deslizando.

## Quando usar

**Bom para:**
- aberturas e vinhetas de abertura;
- abertura de evento ou de série;
- trailers curtos com clima de mistério e humor;
- apresentar um nome ou uma marca como "título de filme".

**Evite para:** explicações com dados, muito texto, fotos, temas que pedem cores variadas ou rostos expressivos. O estilo vive de poucas palavras grandes e silhuetas.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 44,1 s (132 BPM, 25 compassos; `DUR = B(25)` em `story.js`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `paper.js`; canvas fixo em `index.html`) |
| Prévia ao vivo | ~45 fps (leve) |
| Fontes (OFL) | League Gothic (letras recortadas dos créditos) e League Spartan (legenda e textos pequenos) |
| Cores | preto `#1b1714`, papel `#efe4c9`, vermelho `#d23a22`, mostarda `#e2a52a` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração / legenda | `lines.json` | campo `text` de cada fala (`l1`…`l6`) e `t` (segundo de entrada) |
| Duração de cada fala | `voices/dur.json` | segundos por fala; a faixa fica pelo menos 1,8 s |
| Ritmo e pontos de corte | `story.js` | `BPM`, `B(compasso, tempo)`, `HIT` (cortes) e `T` (ações) |
| Palavras de abertura | `film.js` | lista `words` ("A", "LEMOLAB", "PICTURE") |
| Créditos no cenário | `scenes.js` | `'STARRING'`, `'THE AGENT'`, `['MUSIC','BY','THE','SAMPLER']`, `'THE C'` + `'URIER'` |
| Título final | `title.js` | `titleLayout()` ("THE", "VELVET", "CIPHER") e as letras em `GLYPH` |
| Cartão final | `film.js` | chamadas `label(...)` e `layout('60s SPY TITLE SEQUENCE')` |
| Faixa de legenda | `frames.js` | `subStrip()`; fundo escuro nas falas de `DARK_SUB` (`film.js`) |
| Personagens e chave | `chars.js` | `agentSide()`, `courierSide()`, `key()` e as poses `AGENT_POSE`, `COURIER_POSE` |
| Cartaz | `main.js` | bloco `poster` (abre com `?poster`) |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `lines.json` e as palavras dos créditos em `scenes.js` e `film.js`. Use maiúsculas, como no original: as letras são recortadas da League Gothic.
2. **Cuidado com palavras que viram cenário.** "STARRING" tem o tamanho das colunas do aeroporto, "MUSIC BY THE SAMPLER" vira vagões e "THE COURIER" é partido ao redor da roleta (`RW`). Palavra mais longa ou mais curta muda o desenho da cena; confira o quadro.
3. **Título final:** o título não usa fonte. Cada letra é desenhada à mão em `GLYPH`, e só existem T, H, E, V, L, C, P, R e I. Um título novo exige desenhar as letras que faltam no mesmo formato (contorno em 100 unidades de altura).
4. **Ajuste o tempo.** Se a narração mudar, atualize `voices/dur.json` e os `t` em `lines.json`. Para mudar a duração do filme, mexa em `story.js`; todo o resto lê os tempos de lá.
5. **Personagens:** o agente e o mensageiro são silhuetas em código (`chars.js`). Trocar cores ou chapéu é fácil; trocar o personagem inteiro exige redesenhar as poses. `?sheet` mostra a folha de modelo e `?test=chars` mostra todas as poses.
6. **Confira os quadros** em vários segundos (aeroporto, trem, roleta, título, cartão final) antes de renderizar.

## O que não mexer

- `paper.js`: é o motor do papel recortado (bordas de tesoura, sombra, textura).
- `glyph.js`: é o que transforma a fonte em letras de papel.
- As quatro tintas: o estilo depende de ter só essas cores.
- Os cortes no ritmo da música (`HIT` em `story.js`).

## Atenção

- **Assinaturas do exemplo:** a abertura diz "A LEMOLAB PICTURE" e o cartão final traz "LemoLab × Claude Opus 5.5" e "a LemoLab picture". A folha de modelo (`sheet.js`) cita "The Velvet Cipher". Troque pelo nome da marca do usuário ou apague.
- **Crédito de terceiros no cartão final:** o cartão final mostra "Drums: “MuldjordKit” by Lars Muldjord, CC BY 4.0". Isso credita a bateria da trilha original (CC BY 4.0, ver `CREDITS`). Se a trilha do exemplo não for usada, apague essa linha; se for usada, o crédito precisa ficar.
- **Letras com acento:** a League Gothic do exemplo pode não ter todos os acentos. Se aparecer um quadrado no lugar de uma letra, avise o usuário em vez de trocar a fonte.
- **Arquivos fora da pasta:** `paper.js` e `glyph.js` importam `/core/lib.js` (a pasta `core/` da skill). A prévia precisa ser servida a partir da raiz da skill.
- **Modos especiais:** `?frame=airport`, `train` ou `title` mostram quadros fixos de referência. `?nosub` tira a legenda.
