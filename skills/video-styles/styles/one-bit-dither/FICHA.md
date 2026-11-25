# Pontilhado de 1 bit

**Slug:** `one-bit-dither` · **Categoria:** Impressão e gravura · **Filme de exemplo:** 50 s, 16:9 (quadro interno de 960×540)

## O visual

Imagem de duas cores só, sem nenhum cinza: tinta quase preta (`#16161A`) sobre papel creme (`#E9E6D6`). As sombras e os tons médios viram pontilhado em grade (Bayer 8×8), como fax antigo, jornal impresso ou tela de computador dos anos 80. O pontilhado fica "grudado" nas superfícies: quando a câmera se move, o padrão anda junto com o objeto em vez de escorregar pela tela.

As cenas são 3D de verdade (three.js), desenhadas num quadro pequeno de 960×540 e ampliadas sem suavizar, com pixel duro. Há contorno nos objetos, desfoque de foco feito também em pontilhado e trocas de cena que continuam em 1 bit: um dissolve em blocos e uma "varredura de fax" que troca a imagem linha por linha.

O exemplo conta a chegada da primeira foto da superfície da Lua, em fevereiro de 1966, a um radiotelescópio inglês: anoitecer com geada e o telescópio, sala de controle, quatro cortes rápidos no tempo do sinal, o tambor que imprime a foto linha por linha, um voo sobre a Lua, as fotos secando no varal, um quadro de cortiça com o veredito, a banca de jornal e o cartão final.

Não há narração nem legenda. Todo o texto está **dentro da cena**, impresso em objetos: caderno de registro, cartão, caixote, etiquetas, quadro e primeira página de jornal, sempre em chinês e inglês.

## Quando usar

**Bom para:**
- histórias contadas por uma cadeia de mídias (sinal, fax, impressão, jornal);
- impressão, digitalização, sinais e tecnologia antiga;
- cenas noturnas, espaço e paisagens com muito contraste;
- tom de documentário histórico, sem narração.

**Evite para:** temas que dependem de cor, rostos de perto, e muito texto para ler. Letras pequenas se perdem no pontilhado.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 50 s (126 BPM; `DUR` em `timeline.js`) |
| Formato | só horizontal: quadro interno fixo de 960×540 (`RW`, `RH` em `pipe.js`), ampliado para o tamanho da janela |
| Prévia ao vivo | ~60 fps (médio; usa WebGL) |
| Fontes | Noto Serif SC e Noto Sans SC (chinês), LXGW WenKai (chinês manuscrito), Architects Daughter (manuscrito em inglês), Newsreader (jornal), Anton (manchetes e carimbos), todas OFL; Special Elite (máquina de escrever), Apache 2.0 |
| Cores | tinta `#16161A`, papel `#E9E6D6` (`INK`, `PAPER` em `main.js`) |
| Som | o código gera só a imagem; a trilha e os efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Todo o texto que aparece na tela | `texts.js` | `LOG_OLD`, `LOG_NEW`, `CARD`, `CRATE`, `OFFICIAL_TAG`, `BOARD`, `HEAD`, `NEWS_BODY`, `NEWS_SIDE`, `PHOTO_EDGE`, `END`, `END_TITLE`, `END_STYLE` |
| Tempo das cenas e do ritmo | `timeline.js` | `BPM`, `T` (início de cada cena), `CUTS`, `PRINT`, `STAMP1`, `STAMP2` |
| Ordem das cenas | `main.js` | `SHOTS` (cena, início, fim) |
| Transições | `main.js` | `DISSOLVES` (modo 1 = blocos, modo 2 = varredura de fax) |
| Anoitecer e telescópio | `dusk.js` | `buildDusk()` |
| Sala de controle e varal | `room.js` | `buildRoom()` |
| Quatro cortes rápidos | `cuts.js` | `buildCuts()` |
| Tambor que imprime | `drum.js` | `buildDrum()` |
| A Lua e a sonda | `moon.js` | `buildMoon()` |
| Quadro do veredito | `board.js` | `buildBoard()` |
| Banca e jornal | `town.js` | `buildTown()` |
| Cartão final | `endcard.js` | `buildEnd()` |

## Como adaptar

1. **Comece pelo texto.** Quase todo o texto está reunido em `texts.js`, com uma versão `cn` e outra `en` para cada item. Os dois aparecem juntos na tela. Para pt-BR, ponha o português no lugar do inglês e troque ou apague o chinês. Prefira palavras curtas e letras grandes: o pontilhado come detalhes.
2. **Regere as fontes.** As fontes foram recortadas só com os caracteres do filme e não têm acentos (veja abaixo). Depois de trocar o texto, rode `tools/subset.py`; ele varre os `.js` do filme e recorta de novo, mas precisa das fontes originais em `fonts/src/`, que não vêm junto (o `build.sh` baixa).
3. **Ajuste o tempo** em `timeline.js`. Os cortes da sala caem no pulso do sinal (`SYNC`, a cada dois tempos) e cada linha impressa dura uma semicolcheia (`PRINT`).
4. **Cenas novas:** cada cena é um cenário 3D montado em código, com formas simples e materiais em tons de cinza que o pontilhado transforma em 1 bit. Trocar textos impressos e mover objetos é fácil. Outro lugar ou outro objeto exige montar a cena de novo com as peças de `kit.js` e a câmera de cada `build…()`.
5. **Confira os quadros** com `?t=` em vários segundos e `?only=` para ver uma cena sozinha (por exemplo, `?only=room&t=8`).

## O que não mexer

- `pipe.js`: o pontilhado Bayer preso às superfícies, os contornos e o quadro interno de 960×540 ampliado sem suavizar. É o coração do estilo.
- As duas cores. Qualquer cinza ou terceira cor quebra o 1 bit.
- As transições em 1 bit (`DISSOLVES`): não troque por um esmaecido comum, que cria cinzas.

## Atenção

- **Fatos históricos:** o exemplo usa fatos reais (sonda Luna 9, telescópio de Jodrell Bank, datas e proporção da foto). O `CREDITS` aponta as fontes num arquivo `FACTS.md`, que não vem neste pacote. Num vídeo novo, troque pelos fatos do usuário e cite a fonte deles.
- **Fontes recortadas sem acentos:** as fontes latinas têm só os caracteres básicos mais o "é"; as chinesas, só os ideogramas do exemplo. "ã", "ç", "ê", "ó" e outras letras aparecem como quadrados até recortar as fontes de novo.
- **Assinaturas do exemplo:** o cartão final mostra "LemoLab × Claude Opus 5.5" (`END` em `texts.js`) e "1-bit Dither / 1-bit 点阵" (`END_STYLE`). Troque pelo nome da marca do usuário ou apague.
- **Depende da pasta `core` e do three.js:** o código importa `/core/lib.js` e carrega o three.js de `/node_modules/three/` por caminho absoluto. Abra pelo servidor da galeria, com a raiz em `skills/video-styles/` e as dependências instaladas (`npm install`).
- **Modos especiais:** `?t=` abre num segundo fixo. `?only=` desenha uma cena só (`dusk`, `room`, `cuts`, `drum`, `moon`, `board`, `town`, `end`). `?show=` mostra uma das fotos impressas geradas no carregamento.
