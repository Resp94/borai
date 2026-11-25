# Explicação em quadro branco

**Slug:** `whiteboard` · **Categoria:** Esboço e quadro · **Filme de exemplo:** 111 s, 1920×1080

## O visual

Um quadro branco grande, um pouco acinzentado (`#D8D3CA`), com marcas apagadas de aulas antigas ao fundo. Três canetas de quadro desenham tudo na hora, traço por traço: preta (`#23262C`), azul (`#2A5CB3`) e laranja (`#D97757`). As canetas aparecem na tela, andam até o ponto certo e voltam para o canto quando param. Um apagador passa e limpa partes do quadro.

Não há mãos nem cortes de cena. É um quadro só, enorme, e a câmera passeia por ele, aproxima e se afasta, com desfoque de movimento nas viradas rápidas. Cada desenho começa no instante exato em que o narrador fala a palavra correspondente.

O exemplo explica como o GPS do celular funciona: satélites, relógios atômicos, o atraso do sinal, círculos que se cruzam e os 38 microssegundos por dia que a relatividade acrescenta.

Elementos do quadro:
- letras de traço único, escritas à mão pela caneta (fonte EMS Tech);
- setas, círculos, linhas tracejadas, réguas e hachuras;
- contas escritas no quadro ("delay × speed of light = distance");
- um ímã em forma de alfinete marcando o lugar ("you are here").

A legenda é uma caixa branca arredondada no pé da tela, com um traço laranja no canto. Frases longas quebram sozinhas em duas linhas.

## Quando usar

**Bom para:**
- explicações passo a passo, de ciência a finanças;
- cursos online e aulas curtas;
- mostrar uma conta ou um raciocínio sendo montado;
- vídeos longos (o exemplo passa de um minuto e meio).

**Evite para:** emoção, produto bonito, ritmo de clipe, ou temas sem nada para desenhar. O estilo vive de narração e diagrama.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 111 s (120 BPM; `END = 111` em `film.js`) |
| Formato | só horizontal, 1920×1080 (medidas fixas em `engine/wb.js`) |
| Prévia ao vivo | ~60 fps (leve) |
| Fontes | EMS Tech (letras de traço único no quadro, `fonts/EMSTech.json`), Architects Daughter (legenda), ambas OFL |
| Cores | quadro `#D8D3CA`, canetas preta `#23262C`, azul `#2A5CB3`, laranja `#D97757`; também vermelho `#C8413A` e verde `#2E7A4D` (`INK` em `engine/wb.js`) |
| Som | o código gera só a imagem; narração, trilha e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração / legenda | `lines.json` | campo `text` de cada fala (`v01`…`v19`) |
| Quando cada fala entra | `film.js` | `VO` (segundo de entrada de cada fala) |
| Tempo de cada palavra falada | `voices/words.json` | lista `[palavra, início, fim]` por fala |
| Duração de cada fala | `voices/dur.json` | segundos por fala |
| O que é escrito no quadro | `film.js` | chamadas `D(caneta, T('texto', x, y, …), início, fim)` |
| Título | `film.js` | "EINSTEIN", "IN YOUR POCKET", "how GPS really works" |
| Créditos finais | `film.js` | chamadas `credit()` no bloco END CARD |
| Posição de cada desenho no quadro | `film.js` | constantes de layout (`PH`, `SAT`, `EQ`, `CLK`, `RUL`, `TRAIL`…) |
| Movimento de câmera | `film.js` | `new W.Camera([...])` (segundo, x, y, zoom, rotação, suavização) |
| Rabiscos antigos do fundo | `film.js` | lista `ghosts` |
| Peças de desenho | `engine/wb.js` | `text()`, `arrow()`, `rect()`, `arc()`, `dashed()`, `hatch()`, `zigzag()` (apagador) |

## Como adaptar

1. **Comece pela narração.** Troque as falas em `lines.json` e o texto do quadro nas chamadas `T()`. Escreva em pt-BR com acentos: a EMS Tech e a Architects Daughter têm os acentos do português.
2. **Gere os tempos das palavras.** Este é o passo mais importante. Os desenhos estão presos às palavras faladas pela função `at(id, palavra)`, que procura cada palavra em `voices/words.json`. Depois de gravar a nova narração, é preciso gerar de novo o `words.json` (tempo de início e fim de cada palavra) e trocar, em `film.js`, as palavras em inglês usadas como gancho (`atS('v01', 'meter')`, `atE('v04', 'clock')`…) pelas palavras equivalentes em português. Se uma palavra não for encontrada, o filme para com o erro "word … not in …".
3. **Ajuste os segundos** em `VO` com o início real de cada fala. A legenda é montada sozinha a partir de `lines.json` e `words.json`, quebrando nas vírgulas e pontos.
4. **Desenhos novos:** cada desenho é uma lista de traços feita com as peças de `engine/wb.js`. Trocar textos, mover e mudar cor de caneta é fácil. Um diagrama diferente (outro objeto, outro gráfico) precisa ser desenhado com essas peças e posicionado no quadro, e a câmera precisa ser ajustada para enquadrá-lo.
5. **Teste peças soltas** com `?scene=test`, que abre uma folha pequena com texto, setas, círculo, hachura e apagador.

## O que não mexer

- `engine/wb.js`: o traço de caneta, a ordem de desenho, as canetas que andam e o apagador. É o que faz parecer feito à mão na hora.
- A regra de um quadro só, sem cortes: a câmera é que se move.
- O desfoque de movimento nas viradas rápidas da câmera (função `render()` no fim de `film.js`).

## Atenção

- **Assinaturas do exemplo:** os créditos finais escrevem "Lemo-Opuscar", "LemoLab × Claude Opus 5.5", a voz Kokoro (bm_george) e os bancos de samples. Troque pelo nome da marca do usuário ou apague.
- **Fatos do exemplo:** os números (cerca de 30 satélites, 20.000 km, −7 μs, +45 μs, 38 μs, 11 km) são do tema do GPS. Num vídeo novo, troque pelos fatos do usuário e confira cada número.
- **Depende da pasta `core`:** o código importa `/core/lib.js` por caminho absoluto. Abra pelo servidor da galeria, com a raiz em `skills/video-styles/`.
- **Modos especiais:** `?nosubs` tira a legenda (com "s" no fim). `?nopens` esconde as canetas. `?poster` mostra o quadro inteiro como cartaz. `?scene=test` abre a folha de teste.
