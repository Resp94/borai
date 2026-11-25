# Planta técnica

**Slug:** `blueprint` · **Categoria:** Diagramas de linha · **Filme de exemplo:** 46,7 s, 1920×1080

## O visual

Uma folha de cianotipia azul, do azul-marinho `#18336B` ao azul-claro `#2A58A6`, com textura de papel. O traço é branco e é desenhado na hora: as linhas nascem com a ponta da caneta brilhando, as cotas aparecem com setas e números, e as letras são escritas à mão. A câmera passeia pela folha, aproxima nos detalhes e corta seco entre os trechos.

Elementos fixos da folha:
- moldura com grade de referência (1–8, A–E);
- cabeçalho com o título grande;
- carimbo técnico (título, data, número do desenho, escala, assinatura);
- lista de peças numerada;
- notas.

A legenda não é uma faixa embaixo da tela: aparece como uma caixa **NOTE n** desenhada na própria folha, escrita da esquerda para a direita.

## Quando usar

**Bom para:**
- explicar como uma coisa funciona;
- apresentar um produto ou uma ideia "por dentro" (vista explodida, peças, medidas);
- contar a história de um projeto em versões, onde cada revisão é uma virada;
- humor seco no tom de documento técnico.

**Evite para:** emoção forte, rostos e pessoas, temas que pedem cor ou foto, ou muito texto corrido. A folha comporta frases curtas e rótulos, não parágrafos.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 46,7 s (108 BPM, 21 compassos; `DUR = B(22)` em `film.js`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `draw.js`) |
| Prévia ao vivo | ~47 fps (leve) |
| Fontes (OFL) | Architects Daughter (mão), B612 e B612 Mono (técnica), Allura (assinatura) |
| Cores | fundo azul `#18336B`→`#2A58A6`, traço branco-azulado `#EAF1FA` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração / legenda | `lines.json` | campo `text` de cada fala (`v1`…`v6`) |
| Duração de cada fala | `voices/dur.json` | segundos por fala; controla quanto tempo a caixa NOTE fica na tela |
| Quando cada fala entra | `film.js` | `VO` (segundo de entrada) e `SUBPOS` (posição da caixa) |
| Notas escritas na folha | `film.js` | `NOTETEXT` |
| Título, subtítulo, carimbo | `sheet.js` | funções `header()` e `titleBlock()` |
| Lista de peças | `sheet.js` | `PARTS` (número, descrição, material, quantidade) |
| A máquina desenhada | `machine.js` | `drawMachine()`, medidas em `M` |
| Movimento de câmera | `film.js` | `CAMS` (posição x, y e zoom por segundo) |
| Ritmo geral | `film.js` | `BEAT` (60/108) e `B(compasso, tempo)` |
| Cartaz | `main.js` | bloco `poster` (abre com `?poster`) |

## Como adaptar

1. **Comece pelo texto.** Troque o título no `header()` e no carimbo, as falas em `lines.json` e as notas em `NOTETEXT`. Escreva em pt-BR com acentos e em maiúsculas onde o original usa maiúsculas (cabeçalho, carimbo, lista de peças).
2. **Ajuste o tempo das falas.** Se a nova narração for mais longa ou mais curta, atualize `voices/dur.json` com a duração real de cada fala e, se preciso, os segundos em `VO`. A caixa NOTE quebra linha sozinha (largura máxima de 880 px), mas frases com mais de duas linhas tampam o desenho.
3. **Troque a lista de peças** em `PARTS`. Cabem cerca de 13 linhas; descrições longas passam da coluna.
4. **Desenho novo:** a máquina é código (`machine.js`). Para outro objeto, reescreva `drawMachine()` com `line()`, `circ()`, `rect()` e `dim()` (cotas) de `draw.js`, e confira se a câmera (`CAMS`) ainda enquadra as partes certas.
5. **Confira os quadros** com `still.mjs` em vários segundos (abertura, vista explodida, revisão, final) antes de renderizar.

## O que não mexer

- `paper.js`: é o shader que faz o papel azul e o brilho do traço.
- `nibs()` e `comp()`: é o que desenha a caneta e junta as camadas.
- Os cortes secos entre os trechos de `CAMS`: fazem parte do estilo.

## Atenção

- **Assinaturas do exemplo:** o carimbo e o cartaz levam "LemoLab × Claude Opus 5.5", e o carimbo assina como o inventor fictício "Cornelius Wrenfield". Troque pelo nome da marca do usuário ou apague.
- **Letras com acento:** as fontes são recortadas. Se aparecer um quadrado no lugar de uma letra, a fonte não tem aquele caractere; avise o usuário em vez de trocar a fonte.
- **Modos especiais:** `?frame=1`, `2` ou `3` mostram quadros fixos de referência. `?nosub` tira as caixas NOTE.
