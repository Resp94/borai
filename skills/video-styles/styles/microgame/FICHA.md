# Frenesi de microgames

**Slug:** `microgame` · **Categoria:** Jogos · **Filme de exemplo:** 59,8 s, 1920×1080

## O visual

Uma sequência de minijogos de poucos segundos, cada um com uma ordem gritada na tela ("PUMP!", "DODGE!", "LAND IT!") e um pavio que queima até o fim. Entre um jogo e outro, uma "tela de palco" mostra os personagens, as vidas e o número da fase, com uma TV que liga e desliga. O ritmo acelera: 120 BPM na primeira rodada, 140 na segunda e 160 no chefão final.

O fundo do palco é roxo-escuro (`#2A0F5C`) com magenta (`#FF2E88`), dourado (`#FFC928`) e ciano (`#1FD1D1`). Letras grossas com contorno largo e sombra colorida. Mas o truque do estilo é que **cada minijogo tem um visual diferente**:
- giz de cera em livro infantil;
- aquarela de tinta nanquim;
- terminal ASCII com fósforo âmbar;
- risografia em três tintas;
- pixel art com paleta limitada;
- planta técnica azul;
- design suíço com grade e um vermelho só;
- o chefão final mistura vários desses visuais no mesmo quadro.

Dois personagens fixos, desenhados em código: o instrutor "Coach Tick", um relógio com braços que grita as ordens, e a cadete "Dot", uma astronauta atrapalhada.

A legenda é uma faixa arredondada com o ícone de quem fala, que entra com um pequeno salto. As ordens dos jogos não entram na legenda: aparecem grandes no próprio jogo.

## Quando usar

**Bom para:**
- trailers de jogo e vídeos curtos com muita energia;
- onboarding e tutoriais em passos rápidos ("faça isto, agora isto");
- mostrar vários estilos ou produtos num vídeo só, um por minijogo;
- humor e ritmo acelerado.

**Evite para:** temas sérios, explicações longas e narração calma. Cada minijogo tem só alguns segundos e uma palavra de ordem.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 59,8 s (120 → 140 → 160 BPM; `DUR` em `timeline.js`, somado dos segmentos) |
| Formato | só horizontal, 1920×1080 (medidas fixas no código, `W`, `H` em `glpass.js`) |
| Prévia ao vivo | ~58 fps (médio; alguns jogos usam WebGL) |
| Fontes (OFL) | Titan One (ordens e títulos), Lilita One (interface e legenda), VT323 (terminal ASCII), Architects Daughter (planta técnica), Gochi Hand (giz de cera), Inter (design suíço), Silkscreen (pixel) |
| Cores | palco `#2A0F5C`, magenta `#FF2E88`, violeta `#6B2BD9`, dourado `#FFC928`, ciano `#1FD1D1`, tinta `#1A1030` (paleta `P` em `toon.js`) |
| Som | o código gera só a imagem; vozes, trilha e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Sequência de jogos, palcos e ritmo | `timeline.js` | chamadas `add(id, tempos, BPM, {...})` |
| Ordem gritada em cada jogo | `timeline.js` | campo `cmd` ("PUMP!", "DON'T SNEEZE!"…) e `ok` (se o jogo dá certo ou falha) |
| Visual de cada jogo | `timeline.js` e `film.js` | campo `style` e a tabela `SCENE` (jogo → função) |
| Falas, quem fala e quando entra | `lines.json` | `text`, `who` (`tick` ou `dot`), `t`; `cmd: true` marca as ordens, `fx` os efeitos de voz |
| Duração de cada fala | `voices/dur.json` | segundos por fala; controla quanto tempo a legenda fica na tela |
| Cada minijogo | `g_crayon.js`, `g_ink.js`, `g_ascii.js`, `g_riso.js`, `g_pixel.js`, `g_blue.js`, `g_swiss.js` | uma função `scene…()` por jogo |
| Chefão final | `g_boss.js` | `sceneBoss()` |
| Tela de palco (vidas, fase, TV) | `stage.js`, `hud.js` | "A MICROGAME FRENZY", "STAGE", "OK!" |
| Cartão final | `film.js` | `endCard()` |
| Cartaz | `main.js` | `posterOverlay()` (abre com `?poster`) |
| Personagens | `chars.js` | `drawTick()`, `drawDot()` (vistas, expressões e poses) |
| Cores | `toon.js` | `P` |

## Como adaptar

1. **Comece pelas ordens e falas.** Troque o `cmd` de cada jogo em `timeline.js` e as falas em `lines.json`. Escreva em pt-BR com acentos; todas as fontes têm os acentos do português. Ordens curtas, de uma ou duas palavras ("PULA!", "SEGURA!"), cabem melhor.
2. **Ajuste o tempo.** Meça a nova narração em `voices/dur.json` e ajuste o `t` de cada fala em `lines.json`. O tamanho de cada jogo é medido em tempos de música em `timeline.js`; mudar o BPM de uma rodada muda tudo junto.
3. **Troque um minijogo.** Cada jogo é um arquivo próprio com seu visual. Trocar textos e cores dentro de um jogo é simples. Um jogo novo (outra ação, outro objeto) exige escrever uma nova função `scene…()` e registrá-la em `SCENE`, em `film.js`.
4. **Personagens:** o Tick e a Dot são desenhados em código. Cores e expressões já prontas são fáceis de trocar. Outro personagem exige redesenhar `chars.js`, que é usado em todos os palcos e no final.
5. **Confira os quadros** com `?test=chars` (folha dos personagens), `?test=fonts` e as folhas de `frames.js` (`?scene=frames.modelSheet`, `?scene=frames.styleSheet`, `?scene=frames.f1` a `f4`) antes de renderizar.

## O que não mexer

- `glpass.js`: os shaders que "imprimem" ou "pintam" cada visual (risografia, giz, nanquim, terminal). Sem eles, os jogos perdem a textura.
- A estrutura jogo → palco → jogo, com o pavio e a TV: é a gramática do gênero.
- A aceleração por rodada (120, 140, 160 BPM) definida em `timeline.js`.

## Atenção

- **Crédito obrigatório no cartão final:** `endCard()` escreve "Piano: Salamander Grand Piano V3 by Alexander Holm, CC BY 3.0" e "Drums: MuldjordKit by Lars Muldjord, CC BY 4.0". Essas licenças pedem crédito, mas só valem se a trilha do exemplo for usada, e ela não vem junto. Sem essa trilha, apague as duas linhas.
- **Assinaturas do exemplo:** o cartão final mostra "LemoLab × Claude Opus 5.5" e "Microgame Frenzy". O título "FIVE-SECOND ASTRONAUT" aparece no cartão final e no cartaz. Troque pelo nome da marca do usuário ou apague.
- **Nomes fictícios:** "Coach Tick", "Cadet Dot" e o "Five-Second Camp" aparecem nas falas.
- **Referência de gênero:** pelo `CREDITS`, o formato se inspira na série WarioWare (Nintendo), só na gramática. Não use personagens, marcas ou telas dessa série.
- **Depende da pasta `core`:** parte do código importa `/core/lib.js` por caminho absoluto. Abra pelo servidor da galeria, com a raiz em `skills/video-styles/`.
- **Modos especiais:** `?nosub` tira a legenda. `?poster` põe o título por cima. `?test=chars` e `?test=fonts` mostram folhas de referência. `?scene=arquivo.função` abre uma cena sozinha.
