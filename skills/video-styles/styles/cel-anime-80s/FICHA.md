# Anime anos 80

**Slug:** `cel-anime-80s` · **Categoria:** Desenhos animados · **Filme de exemplo:** 59 s, 1920×1080

## O visual

Anime japonês de acetato dos anos 80, visto numa fita VHS numa TV de tubo. Personagens com contorno colorido (não preto), sombra chapada em dois tons e brilho no cabelo e nos olhos. Cidade à noite com chuva, asfalto molhado refletindo letreiros de neon rosa (`#FF3FA4`), ciano (`#35E7FF`), amarelo (`#FFD23F`) e roxo (`#B36BFF`), e depois o amanhecer.

Por cima de tudo passa um tratamento de vídeo antigo (`post.js`, em WebGL): brilho estourado nas luzes, halo, cor vazando para os lados com o vermelho deslocado, linhas de varredura, grade de pontos RGB, cantos escuros, a linha clara de quando a TV liga e o chiado de fita quando alguém aperta PLAY.

Os personagens se mexem "em dois" (12 quadros por segundo) e piscadas e detalhes "em três" (8 por segundo), como na animação limitada da época. Todos os cortes caem no compasso da música.

O exemplo: uma entregadora de moto ("Nightbird") atravessa a cidade de neon na chuva, salta uma ponte levadiça e entrega uma fita cassete ao piloto de um foguete antes do lançamento ao amanhecer.

Elementos fixos:
- título com letreiro em katakana, logotipo cromado e o ano em vermelho itálico;
- letreiros de neon na rua, em japonês (verticais) e em inglês (horizontais);
- quadro de impacto e clarão branco no salto.

A legenda fica no pé da tela, com contorno escuro: amarelo-creme (`#FFF0A0`) para a entregadora e ciano (`#8FF4FF`) com uma etiqueta "BASE" de rádio para a central.

## Quando usar

**Bom para:**
- clipes e vídeos guiados por música;
- trailers de jogo e aberturas com ação;
- nostalgia, cultura pop e estética retrô;
- histórias curtas de missão contra o relógio, com diálogo breve.

**Evite para:** explicações e dados, tom sóbrio ou corporativo, e muito texto. O estilo pede ação, luz e frases curtas.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 59 s (116 BPM, 4/4; `DUR` em `story.js`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `cel.js`) |
| Prévia ao vivo | ~60 fps (médio; usa WebGL) |
| Fontes (OFL) | Dela Gothic One (katakana do título e letreiros), Kanit itálico (logotipo, ano, neon), Barlow Semi Condensed (legenda e textos de painel) |
| Cores | neon `#FF3FA4`, `#35E7FF`, `#FFD23F`, `#FF5A3C`, `#B36BFF`, `#4DFF9A` (`NEON` em `bg.js`); cores dos personagens em `BASE` (`pal.js`), convertidas para noite e amanhecer |
| Som | o código gera só a imagem; vozes, trilha e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da legenda, quem fala e quando entra | `story.js` | `VO` (`text`, `who` = `D` central ou `G` entregadora, `t`) |
| Texto mandado para a voz | `lines.json` | campo `text` de cada fala |
| Duração de cada fala | `voices/dur.json` | segundos por fala; controla quanto tempo a legenda fica na tela |
| Ordem e duração dos planos | `story.js` | `SHOTS` (início, fim, nome) |
| Momentos-chave (salto, PLAY, decolagem) | `story.js` | `T` e `BPM` |
| Título de abertura | `scenes1.js` | `title()`: "CITY LIGHTS", "シティ・ライツ", "1987", "A NIGHTBIRD DELIVERY" |
| Etiqueta da fita | `scenes1.js` | "CITY LIGHTS" e "for the pilot — play at T-0 ♪" |
| Cartão final | `scenes4.js` | `endcard()` |
| Créditos do cartão final | `story.js` | `CREDITS` |
| Letreiros de neon | `bg.js` | `SIGNS_V` (japonês, vertical) e `SIGNS_H` (inglês, horizontal) |
| Etiqueta "BASE" do rádio | `hud.js` | `hud()` |
| Painel do foguete | `scenes4.js` | "ON-BOARD AUDIO · CH 2", "VU" |
| Personagem e moto | `head80.js`, `rider.js`, `hands.js` | cabeça em três ângulos e expressões, pose na moto, mão |
| Cores dos personagens | `pal.js` | `BASE` |
| Tratamento de VHS e TV | `post.js` | `makePost()` |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `story.js` (`VO`) e em `lines.json`, que precisam ficar iguais. Escreva em pt-BR com acentos; as três fontes têm os acentos do português. A legenda não quebra linha: frases curtas.
2. **Ajuste o tempo das falas.** Meça a nova narração em `voices/dur.json` e, se preciso, mude o `t` em `VO`. A fala anterior sai quando a próxima entra.
3. **Título e letreiros.** Troque o título em `scenes1.js` e no cartão final. Os letreiros em katakana fazem parte do clima; se quiser outra cidade, troque `SIGNS_V` e `SIGNS_H` por palavras genéricas em português.
4. **Personagem:** a entregadora, a moto e o foguete são desenhados em código. Trocar cores de roupa, cabelo e pele é fácil em `BASE` (`pal.js`); a conversão para noite e amanhecer é automática. Outro personagem, outro rosto ou outro veículo exige redesenhar `head80.js`, `rider.js` e as cenas.
5. **Confira os quadros** com `?t=` em vários segundos, `?shot=` para ver um plano pelo nome, `?test=model` para a folha do personagem e `?raw` para ver a imagem sem o tratamento de TV.

## O que não mexer

- `post.js`: o visual de fita VHS e TV de tubo. Sem ele, o filme perde a época.
- O ritmo "em dois" e "em três" (`q12`, `q8` em `story.js`).
- Os cortes presos ao compasso (`bar()` em `story.js`).
- O contorno colorido dos personagens (sem traço preto), que é a marca do acetato dos anos 80.

## Atenção

- **Assinaturas do exemplo:** o cartão final (`endcard()` em `scenes4.js`) mostra "LemoLab × Claude Opus 5.5", "80s CEL ANIME" e os créditos de `CREDITS`, que citam as vozes Kokoro. Troque pelo nome da marca do usuário ou apague.
- **Nomes fictícios:** "Nightbird", "CITY LIGHTS" e o ano 1987 aparecem no título, na fita, na moto ("NB·87") e no cartão final.
- **Texto em dois lugares:** as falas estão em `story.js` (o que aparece na tela) e em `lines.json` (o que a voz fala). Mude os dois.
- **Modos especiais:** `?t=15` abre num segundo fixo. `?nosub` tira a legenda. `?shot=` força um plano. `?raw` desliga o tratamento de TV. `?test=model`, `?test=close` e `?test=side` mostram folhas de referência do personagem.
