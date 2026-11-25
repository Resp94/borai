# Diagrama de linha de montagem

**Slug:** `assembly-line-diagram` · **Categoria:** Diagramas de linha · **Filme de exemplo:** 54,9 s, 1920×1080

## O visual

Um corte do corpo humano desenhado como uma fábrica, no jeito dos cartazes de divulgação científica antigos. Papel creme `#F2ECE0`, contorno preto-azulado `#1D2030`, cavidade do corpo em índigo `#24345A` e quatro cores chapadas: vermelho `#E04A2F`, amarelo `#F3B23A`, verde-azulado `#2E8D87` e rosado `#EE9F87`. Cada cor fica um pouco deslocada do traço, como impressão com registro torto, e um grão de papel fica por cima de tudo.

Tudo é vetor gerado em código (um SVG por quadro). A câmera segue um sanduíche pela linha, mergulha pela boca e passa de estação em estação, com chicotes de câmera borrados e linhas de velocidade.

Elementos do filme:
- estações numeradas com placa (`CRUSHER`, `ACID DRUM`, `GATEKEEPER`, `SORTING LINE`, `WAREHOUSE`, `FURNACES`);
- trabalhadores pequenos operando as máquinas;
- três esteiras coloridas que separam os nutrientes;
- no fim, uma silhueta correndo atrás do ônibus e uma placa de encerramento.

A legenda é um cartão creme no canto de baixo, com uma aba colorida que mostra o número da estação atual, e duas linhas: chinês em cima, inglês embaixo.

## Quando usar

**Bom para:**
- mostrar um processo em etapas, do começo ao fim;
- explicar o corpo, uma cadeia de suprimentos ou um fluxo de dados como "fábrica";
- conteúdo didático com humor leve.

**Evite para:** temas sem etapas, rostos e emoção, fotos de produto ou muito texto corrido. A legenda comporta uma frase curta por vez.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 54,9 s (52,0 s de história + 2,5 s de esticada no título + 0,4 s no fim; `storyDur`, `stretch` e `tail` em `cues.json`) |
| Formato | só horizontal, 1920×1080 (fixo no `index.html` e em `frame()` no `film.js`) |
| Prévia ao vivo | ~38 fps (média) |
| Fontes (OFL) | Big Shoulders Display (títulos e números), Archivo (texto em inglês), Noto Sans SC (chinês) |
| Cores | paleta `A` em `lib.js`: papel `#F2ECE0`, traço `#1D2030`, corpo `#24345A` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração | `voice/lines.json` | campo `text` de cada fala (`v1`…`v12`; não existe `v8`) |
| Texto e tempo da legenda | `timeline.json` | lista `subs` (`t0`, `t1`, `en`, `zh`, `n` = número da estação) |
| De onde a legenda vem | `tools/timeline.py` | `SUBS` (texto) e `PLAN` (segundo de entrada de cada fala) |
| Quando cada ação acontece | `cues.json` | tempos em segundos (`sign`, `chomps`, `n1`…`n6`, `card`, etc.) |
| Placas das estações | `body.js` | chamadas de `plaqueN(x, y, 'NOME', '中文', 'n', …)` |
| Título da abertura | `paper.js` | `titleSign()` (letreiro "THE DISASSEMBLY LINE", subtítulo e faixa em chinês) |
| Placa final | `overlays.js` | `endCard()` |
| Movimento de câmera | `film.js` | `camera(t)` |
| Paleta | `lib.js` | `PALS` (três opções prontas: `A`, `B`, `C`) e `const PAL = 'A'` |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `voice/lines.json` e as legendas em `SUBS` (`tools/timeline.py`) ou direto em `timeline.json`. Cada legenda tem uma linha `zh` e uma `en`: troque as duas pelo pt-BR ou deixe uma vazia.
2. **Renomeie as estações** nas chamadas de `plaqueN()` em `body.js`. O segundo texto é a tradução em chinês embaixo do nome; troque ou apague.
3. **Ajuste o tempo.** Se a narração mudar de duração, mexa nos segundos de `PLAN` e nos tempos de `cues.json`, que a imagem e o som leem juntos.
4. **Troque a paleta** mudando `PAL` para `'B'` (fundo branco, corpo cor de pele) ou `'C'` (corpo vinho), sem tocar no desenho.
5. **Outro processo:** o corpo, as máquinas e os trabalhadores são desenhados em código (`body.js`, `lib.js`, `runner.js`). Mudar nomes e cores é fácil; trocar o corpo por outra "fábrica" exige redesenhar as funções de cada estação (`stomachFloor()`, `sortingFloor()`, `warehouse()`, `furnaceRoom()`…) e refazer a câmera.

## O que não mexer

- `REG` e `reg()` em `lib.js`: o deslocamento de cada cor é o que dá cara de impressão.
- `KS`: controla a espessura do traço conforme o zoom; sem ele o desenho deixa de parecer uma folha só.
- `STORY()` no `film.js`: converte o tempo da história no tempo do filme (esticada do título).
- `makeGrain()`: o grão de papel por cima.

## Atenção

- **Assinaturas do exemplo:** a placa final (`endCard()` em `overlays.js`) traz "LemoLab × Claude Opus 5.5" e o nome do estilo em inglês e chinês. Troque pelo nome da marca do usuário ou apague.
- **Chinês em todo lugar:** legendas, placas das estações, o letreiro do título (`paper.js`, linha com `'拆解流水线　一份午饭…'` e a placa `'装配线'`) e a placa final. A fonte chinesa é recortada só para os caracteres do exemplo.
- **Letras com acento:** as fontes latinas (BSD e ARC) foram recortadas só para os caracteres do exemplo e não têm "ç", "ã", "é" nem outros acentos. Texto em pt-BR cai numa fonte reserva do navegador nessas letras. Avise o usuário antes de usar; para corrigir, é preciso recortar a fonte de novo a partir da original (OFL) com os acentos.
- **Sem modos especiais:** o `film.js` não lê parâmetros de URL (não há `?frame`, `?nosub` nem `?poster`).
- **Material de terceiros:** o `CREDITS` diz que não há fotos nem imagens externas; tudo é desenhado em código. As referências históricas citadas lá foram só estudadas, não copiadas.
