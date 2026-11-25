# RPG em pixel 16-bit

**Slug:** `pixel-rpg` · **Categoria:** Jogos · **Filme de exemplo:** 54,5 s, 1920×1080

## O visual

Um jogo de RPG dos anos 90, pixel por pixel. A imagem é feita numa tela de 320×180 e ampliada 6 vezes, sem suavizar. Cada pixel guarda o número de uma cor da paleta ENDESGA 32; trocar a época do jogo é só trocar a tabela de cores (`LUT`), como num console de verdade.

O filme usa essas trocas para contar a história:
- **presente** desbotado em 7 tons de azul-acinzentado (`#0e0d17` a `#c3c9d6`), onde só o cachecol vermelho `#e43b44` e o cristal ciano `#2ce8f5` guardam a cor;
- **lembrança 1** em 4 tons de verde de Game Boy (`#1f2a1c` a `#d6dba6`), em meia resolução;
- **lembrança 2** com a paleta limitada de NES;
- **batalha** em 16-bit com cor cheia, e depois a cor vai sumindo em degraus (16, 8, 4, 2 cores) até o desbotado;
- **final**: a porta se abre e a cor volta num círculo que cresce a partir do herói.

Elementos de jogo desenhados em código: caixa de diálogo com retrato, menu SAVE/QUIT com cursor de mãozinha, lista de arquivos salvos com miniaturas, janela de batalha com HP, "SAVING..." e "SAVE COMPLETE", tela final com CONTINUE. As transições são de jogo: mosaico, redemoinho de encontro e corte seco.

A legenda é a própria caixa de diálogo, com o texto digitado letra por letra.

## Quando usar

**Bom para:**
- trailers e teasers de jogo;
- retrospectivas e "a jornada até aqui" (de um projeto, de uma marca, de um ano);
- nostalgia e histórias contadas como fases;
- histórias curtas com personagem, perda e virada.

**Evite para:** dados, gráficos e muito texto, temas que pedem foto ou realismo, ou falas longas. A caixa de diálogo comporta frases curtas.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 54,5 s (`dur` em `timeline.json`) |
| Formato | só horizontal, 320×180 ampliado 6× = 1920×1080 (`W`, `H`, `SCALE` fixos em `px.js`) |
| Prévia ao vivo | ~88 fps (leve) |
| Fonte | fonte de pixel própria, desenhada em código em `font.js` (não há pasta `fonts/`) |
| Cores | paleta ENDESGA 32 em `px.js` (`HEX`), mais as tabelas `LUT.faded`, `LUT.gb4`, `LUT.nes`, `LUT.c16`…`LUT.c2` |
| Som | o código gera só a imagem; narração, trilha chiptune e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração / caixa de diálogo | `lines.json` | campo `text` de cada fala (`vo1`, `vo2`, `vo4`, `vo5`, `vo6`); `sub`, se existir, é o que aparece na caixa |
| Duração de cada fala | `voices/dur.json` | segundos por fala; controla quanto tempo a caixa fica aberta |
| Quando cada fala entra e a expressão do retrato | `timeline.json` | `vo` → `t` (segundo) e `expr` (`wistful`, `smile`, `sad`, `determined`) |
| Fala da personagem na lembrança 2 | `main.js` | `WREN_LINE` |
| Mensagens da batalha | `main.js` | `B.ward` ("WREN used WARD!") e `B.fell` ("WREN fell.") |
| Arquivos salvos (nome do lugar, tempo de jogo) | `main.js` | `FILES` e o rótulo `'FILE 4  LAST DOOR'` |
| Rótulos fixos nas lembranças | `main.js` | `fileLabelGB()` e `renderCamp()` |
| Título e tela final | `memscenes.js` | `titleCard()` e `endCard()` |
| Cartaz | `main.js` | `posterFrame()` (abre com `?poster`) |
| Menu, janelas, nomes e níveis | `ui.js` | `saveMenu()`, `fileList()`, `statusWin()` (ARLO LV 42, WREN LV 38) |
| HP e comandos da batalha | `memscenes.js` | `battleUI()` |
| Ordem e tempo das cenas | `main.js` | `frame(t)`: cada cena é um intervalo de segundos fixo |
| Paletas | `px.js` | `HEX`, `FADED_RAMP`, `GB4`, `NES` |

### Os personagens e cenários são código

Não há nenhuma imagem na pasta. Tudo é desenhado por código:
- `sprites.js`: corpo dos heróis montado por peças (cápsulas para braços e pernas, sombra em degraus), com cabeças desenhadas em texto ASCII (cada letra é uma cor);
- `portraits.js`: retratos 32×32 da caixa de diálogo, também em ASCII, com expressões por cima da base;
- `memsprites.js`: as versões crianças dos heróis;
- `props.js`: cristal, pedestal, porta;
- `scenes.js` e `memscenes.js`: corredor, porta final, vila, fogueira, batalha, miniaturas.

Para mudar a cara de um personagem, edite as linhas de texto da cabeça ou do retrato: cada caractere é um pixel, e a letra diz o tom (cabelo, pele, olho, contorno). Para ver todos os personagens juntos, abra com `?sheet` (folha de modelo em `sheet.js`).

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `lines.json`, `WREN_LINE`, as mensagens de batalha e os nomes em `FILES`. Frases curtas: a caixa de diálogo tem 3 linhas, e na lembrança Game Boy só 2.
2. **Ajuste o tempo.** Atualize `voices/dur.json` com a duração real de cada fala e, se preciso, o `t` de cada fala em `timeline.json`. As cenas em `frame(t)` e muitos momentos em `main.js` são segundos fixos (ex.: `7.5`, `26.95`, `35.5`): se a nova narração não couber, mexa nesses números com cuidado.
3. **Troque nomes e títulos.** ARLO e WREN aparecem em `ui.js`, `memscenes.js` e `main.js`; o título "THE LAST SAVE POINT" está em `titleCard()`, `endCard()` e `posterFrame()`. Lugares: HOLLOWMERE, EMBER RIDGE, ASHFALL KEEP.
4. **Personagens novos:** edite as cabeças ASCII em `sprites.js` e os retratos em `portraits.js`; para cores, use as entradas de `MAT` em `sprites.js`. Confira com `?sheet`.
5. **Confira os quadros** em vários segundos (corredor, vila, fogueira, batalha, porta, tela final) antes de renderizar. Para testar só o cenário: `?frame=corridor` ou `?frame=door`, com `?lut=` para escolher a paleta.

## O que não mexer

- `px.js`: é o motor de cor por tabela. Os efeitos de desbotar, perder cor e devolver cor são só troca de `LUT`.
- As cores protegidas (`PROTECT`, índices 32 a 38): são o cachecol e o cristal, que continuam coloridos no presente desbotado. É o fio da história.
- A ampliação sem suavizar (`image-rendering: pixelated` em `index.html`) e a resolução 320×180.

## Atenção

- **Assinaturas do exemplo:** a tela final (`endCard()` em `memscenes.js`) leva "16-BIT PIXEL RPG · LEMO-OPUSCAR" e "LemoLab × Claude Opus 5.5". Troque pelo nome da marca do usuário ou apague.
- **Letras com acento:** a fonte de pixel (`font.js`) só tem A–Z, a–z, números e alguns sinais. Letras como "ã", "ç" e "é" viram "?". Para pt-BR, desenhe os caracteres que faltam com `def()` em `font.js` (cada linha é uma fileira de pixels, `#` aceso e `.` apagado), ou avise o usuário.
- **Nada de terceiros na imagem:** o `CREDITS` diz que arte, fonte, história e nomes são originais. A paleta ENDESGA 32 é pública e usada como lista de cores.
- **Modos especiais:** `?nosub` tira as caixas de diálogo e as mensagens de batalha; `?poster` mostra o cartaz; `?sheet` mostra a folha de personagens; `?frame=corridor` ou `?frame=door` mostram só o cenário (aceitam `lut`, `cam`, `hx`, `pose`, `camY`, `open`, `torch`).
