# Teatro de sombras

**Slug:** `shadow-puppet` · **Categoria:** Artes tradicionais · **Filme de exemplo:** 54,4 s, 1920×1080

## O visual

Um teatro de sombras chinês filmado de frente. Uma tela de pano iluminada por lamparinas, com trama de tecido e brilho quente. Os bonecos são peças de couro recortado e tingido: a luz passa pelas cores (vermelho `#b8211a`, laranja `#d9541c`, amarelo `#dc9d1e`, verde `#236e3a`, azul `#2a5690`) e pelos furos dos recortes. Peças sobrepostas ficam mais escuras, como couro de verdade. Os bonecos se mexem presos em varetas, que aparecem na tela.

Elementos do filme de exemplo:
- moldura de palco em madeira laqueada (`#2a0d08`) com entalhes dourados (`#8a6430`) e cabeças da plateia na frente;
- placa de título recortada, subindo em varetas, com um selo vermelho;
- dez sóis recortados, cada um com um corvo no centro, que se apagam um a um;
- montanhas, chão que racha e queima, rio e árvores que voltam;
- o arqueiro Hou Yi, boneco articulado de 11 peças, com arco e flechas;
- uma cena atrás do pano, espelhada, com as mãos do bonequeiro e as lamparinas;
- placa final.

A legenda é uma plaquinha de madeira escura com filete dourado e um selo vermelho com o caractere "说", centrada embaixo.

## Quando usar

**Bom para:**
- mitos, lendas e contos populares;
- patrimônio, cultura tradicional e festas;
- uma história com herói, problema e virada, contada com poucos personagens;
- vinhetas de festival com clima de palco.

**Evite para:** temas atuais, tecnologia, dados e gráficos, rostos reais ou muito texto. A tela comporta uma frase por vez.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 54,4 s (100 BPM; `DUR = 54.4` em `story.js`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `main.js`; canvas de 1920×1080 no `index.html`) |
| Prévia ao vivo | ~27 fps (pesado: abaixo de 30, pode engasgar em máquina fraca) |
| Fontes (OFL) | Cormorant Garamond (títulos e legenda), Ma Shan Zheng (caracteres dos selos) |
| Cores | tingimentos em `DYE` (`carve.js`), moldura `#2a0d08`, selo `#b3261b`, legenda `#f3e2bf` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração (texto para gerar a voz) | `lines.json` | campo `text` de cada fala (`L1`…`L6`) |
| Legenda e quando cada fala entra | `story.js` | `VO` (segundo de entrada `t` e `text`) |
| Duração de cada fala | `voices/dur.json` | usada para calcular quanto tempo a legenda fica (`SUBS` em `main.js`) |
| Tempos de cada momento | `story.js` | `T` (título, sóis, flechas, cura, final) |
| Lista de cenas | `story.js` | `SHOTS` (`[início, fim, nome]`) |
| Ordem em que os sóis caem | `story.js` | `KILL` (o sol 0 é poupado) |
| Poses do arqueiro | `poses.js` | `POSES` (`rest`, `stride`, `liang`, `draw`, `spare`) |
| Placas de título e final | `stage.js` | `buildStage()` (textos de `title` e `end`) e o selo "后羿射日" em `plaque()` |
| Título do cartaz | `main.js` | bloco `poster` (os dois `fillText` com "HOU YI SHOOTS THE SUNS") |
| Visual da legenda | `hud.js` | `drawSub()` |
| Posição dos sóis | `suns.js` | `SUNPOS` |
| Câmera | `main.js` | `camRaw()` e `camAt()` |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `lines.json` e os mesmos textos em `VO` (`story.js`). Troque as placas em `buildStage()`. A legenda é uma linha só e não quebra: frases longas passam da largura da tela.
2. **Ajuste o tempo.** Com a voz nova, atualize `voices/dur.json` e os segundos de `VO`. Se a história mudar de ritmo, mova os tempos de `T` e de `SHOTS`, porque as cenas e os efeitos de som saem deles.
3. **Troque os selos.** O selo da legenda (`说`, em `hud.js`) e o da placa de título (`后羿射日`, em `stage.js`) são caracteres chineses. Para outra história, troque o texto ou tire o selo.
4. **Personagens:** os bonecos são desenhados em código. Trocar cores (`DYE`), poses (`POSES`), quantidade e posição dos sóis (`SUNPOS`, `KILL`) é fácil. Um personagem novo exige redesenhar as peças em `houyi.js` (cabeça, tronco, braços, pernas e juntas em `J`), usando as ferramentas de recorte de `carve.js`. Cenários novos ficam em `scenery.js`.
5. **Confira o boneco** com `?test=model`, um quadro de referência com `?test=frame` e o cartaz com `?test=poster`. Use `?t=` (em segundos) para abrir num momento específico.

## O que não mexer

- `gl.js`: é o shader que junta luz das lamparinas, couro, trama do pano e brilho.
- `carve.js`: são as ferramentas de recortar e tingir o couro (`piece()`, `cut()`, `fill()`).
- O sistema de varetas (`drawRods()`) e as cenas atrás do pano (`renderBack()`, `backstage.js`): fazem parte do estilo.

## Atenção

- **Assinaturas do exemplo:** a placa final (`buildStage()` em `stage.js`) e o cartaz (`?test=poster`, em `main.js`) escrevem "LemoLab × Claude Opus 5.5". Troque pelo nome da marca do usuário ou apague.
- **Dependência fora da pasta:** `main.js`, `suns.js`, `scenery.js`, `stage.js` e `backstage.js` importam `/core/lib.js`. A página só funciona servida a partir da pasta `skills/video-styles/` (onde está `core/`).
- **Letras com acento:** se aparecer um quadrado no lugar de uma letra, a fonte não tem aquele caractere; avise o usuário em vez de trocar a fonte.
- **Tema cultural:** o exemplo usa motivos tradicionais chineses (selos, corvo de três patas, padrões de nuvem). Para outra cultura, esses detalhes precisam ser revistos.
- **Modos especiais:** `?nosub` tira a legenda. `?test=model`, `?test=hands`, `?test=frame` (com `?f=`) e `?test=poster` mostram quadros de teste.
