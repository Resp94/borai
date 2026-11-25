# Filme de planilha

**Slug:** `spreadsheet` · **Categoria:** Telas e interfaces · **Filme de exemplo:** 52 s, 1920×1080

## O visual

Uma planilha genérica, desenhada inteira em código, ocupa a tela. Por fora fica a moldura fixa do programa: barra de título, barra de ferramentas, barra de fórmula, cabeçalhos de linha e coluna, abas e barra de status escura `#17120a`. Só a folha dá zoom; a moldura nunca se mexe.

Tudo o que aparece é algo que uma planilha sabe fazer:
- células pintadas por formatação condicional (verde-limão `#b8f25a` para sucesso, vermelho `#e8382d` para fracasso);
- colunas escondidas que se abrem em onda, da esquerda para a direita;
- células mescladas com rótulos e resultados;
- fórmulas digitadas na barra `fx`, com referências coloridas (azul `#2f6fe0`, roxo `#b03ad6`);
- uma tabela dinâmica em que cada célula "voa" para a sua barra;
- um cursor de mouse, um menu de clique direito e um cartão final em âmbar `#ffb21f`.

Cada célula é um dado (no exemplo, 1 célula = 1 paciente). A legenda não é uma faixa: aparece como um comentário de célula amarelo-claro `#fff4c7`, com o cantinho vermelho, no canto inferior esquerdo.

## Quando usar

**Bom para:**
- explicar um número, uma média ou um paradoxo estatístico;
- mostrar que um total esconde grupos diferentes;
- custos, orçamentos e comparações em que "abrir a planilha" é a própria história;
- educação em dados para quem vive no Excel.

**Evite para:** temas sem números, emoção, pessoas e rostos, ou dados que não cabem em células (mapas, fotos, séries longas).

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 52 s (`FILM = 52.0` em `timeline.py`; `DUR = TL.dur` em `index.html`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `index.html`) |
| Prévia ao vivo | ~92 fps (leve) |
| Fontes (OFL) | Inter (interface e números), Noto Sans SC (caracteres chineses) |
| Cores | folha branca, sucesso `#b8f25a`, fracasso `#e8382d`, pedra grande `#2a2f6c`, pedra pequena `#dfe6f3`, destaque `#ffb21f` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Os dados (grupos e contagens) | `index.html` | `GROUPS` |
| Narração (o que a voz fala) | `vo/chunks.json` | campo `text` de cada trecho (`v01_0`…`v13_1`) |
| Legenda (comentário de célula) | `timeline.py` | `SUB`: duas linhas por fala (`zh` em cima, `en` embaixo) |
| Quando cada fala entra | `timeline.py` | `START` (segundo de entrada de cada fala) |
| Duração de cada trecho de voz | `vo/chunks/dur.json` | segundos por trecho |
| Momentos da animação | `index.html` | `T` (digitação, pintura, abrir colunas, tabela dinâmica, cartão) |
| Fórmulas na barra `fx` | `index.html` | `FX_A`, `FX_B`, `FX_C`, `FX_P`, `FX_W` e `formulaLine()` |
| Rótulos das células mescladas | `index.html` | `drawMerged()` (ex.: "Open surgery", "Small stones", "350 patients") |
| Título e cartão final | `index.html` | `TITLE_S`, `TITLE_Z`, `CARD_S` e o bloco `end card` em `drawMerged()` |
| Nota do paciente | `index.html` | `drawNotes()` |
| Nome do arquivo, barra de status | `index.html` | `drawChrome()` |
| Movimento de câmera | `index.html` | `CK` (tempo, centro em coluna/linha, zoom) |

`timeline.py` lê `vo/chunks.json` e `vo/chunks/dur.json` e gera `tl.js` (que a página carrega), `timeline.json` e o `.srt`. Depois de mexer em falas ou tempos, rode-o de novo.

### Formato dos dados

Os dados ficam em código, numa linha só:

```js
const GROUPS = { A: { S: [81, 87], L: [192, 263] }, B: { S: [234, 270], L: [55, 80] } };   // [sucessos, total]
```

- `A` e `B` são os dois tratamentos (os dois blocos da folha).
- `S` e `L` são os dois grupos escondidos (pedra pequena e grande).
- Cada par é `[sucessos, total de casos]`. O código cria uma célula por caso, embaralha com semente fixa (`mulberry(1986)`) e pinta 1 ou 0.
- As porcentagens da tabela dinâmica são calculadas sozinhas (`pct` em `drawMerged()`).

Limites do layout:
- cada bloco tem 14 pares de colunas × 25 linhas (`PW`, `PH`), ou seja, **no máximo 350 casos por tratamento**;
- as barras da tabela dinâmica têm largura fixa em `PIV` (`w: 4` ou `w: 12`) e crescem a partir da linha `PBOT`; um grupo grande numa barra estreita sobe demais e invade os rótulos.

## Como adaptar

1. **Troque os dados em `GROUPS`.** Mantenha dois tratamentos e dois grupos, até 350 casos por tratamento.
2. **Atualize os números escritos à mão.** Vários textos não vêm de `GROUPS`: os totais "78%" e "83%" em `drawMerged()`, "350 patients", "of 350 have large stones" e os valores `263`/`80` ao lado, a fórmula `FX_W`, os resultados depois de `after:` em `formulaLine()` ("= 78%", "= 263", "= 93%"…) e as mensagens da barra de status em `drawChrome()`. Procure cada número antigo e troque.
3. **Reescreva a narração e a legenda.** Falas em `vo/chunks.json`; legenda em `SUB` de `timeline.py`. A legenda sempre desenha as duas linhas: ponha o texto em pt-BR no primeiro campo (linha grande) e deixe o segundo vazio ou use-o para uma tradução.
4. **Ajuste os tempos.** Atualize `vo/chunks/dur.json` com a duração real de cada trecho, mexa em `START` se preciso e rode `timeline.py`. Os momentos em `T` que dependem das falas usam `P` (início de cada trecho) e acompanham sozinhos; os outros são segundos fixos.
5. **Troque rótulos e título** (`drawMerged()`, `TITLE_S`, `CARD_S`, `drawChrome()`), em pt-BR.
6. **Confira os quadros** em vários segundos (abertura, colunas abrindo, tabela dinâmica, cartão final) antes de renderizar.

## O que não mexer

- A moldura fixa (`drawChrome()`, `drawHeaders()`): só a folha dá zoom, essa é a regra do estilo.
- A regra de "só o que uma planilha faz": nada de ícones, fotos ou gráficos soltos por cima.
- `layout()` e `camera()`: a câmera anda em unidades de coluna para acompanhar as colunas que se abrem.

## Atenção

- **Assinaturas do exemplo:** o cartão final leva "LemoLab × Claude Opus 5.5" e "Spreadsheet Film · 表格动画". Troque pelo nome da marca do usuário ou apague.
- **Texto em chinês na tela:** a legenda tem uma linha em chinês em cima (`SUB` em `timeline.py`), o título mostra `TITLE_Z` ("辛普森悖论") e o cartão final mostra "藏起来的那一列". Troque ou apague todos.
- **Letras com acento:** a fonte Inter vem recortada só com caracteres básicos sem acento (lista `latin` em `tools/fonts.py`). Letras como "ã", "ç" e "é" caem numa fonte do sistema. Para corrigir, acrescente os caracteres do pt-BR à lista `latin` e rode `tools/fonts.py` de novo; o `build.sh` baixa as fontes originais em `fonts/src/` antes de recortar.
- **Dados de terceiros:** os números do exemplo vêm de um artigo científico (Charig et al., BMJ 1986), citado no `CREDITS`. Os dados estão escritos em `GROUPS`; nada é baixado. Se usar outros dados, cite a fonte do usuário no título da janela (`drawChrome()`) e na barra de status.
- **Modos especiais:** `?nosub=1` tira o comentário de legenda; `?from=20&to=30` mostra só esse trecho do filme.
