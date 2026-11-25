# Filme arranhado

**Slug:** `scratch-film` · **Categoria:** Filme e fita · **Filme de exemplo:** 52 s, 1920×1080

## O visual

Uma película preta, quase pura (`#050403`), onde tudo o que brilha parece arranhado com agulha. Os traços são linhas creme `#fff4dc` que tremem, com manchas de tinta transparente em azul `#2f86ff`, vermelho `#ff3220`, amarelo `#ffc81c`, verde e verde-água. O desenho é refeito 15 vezes por segundo, então as linhas "fervem" o tempo todo. Por cima vêm poeira, granulação, um leve balanço do quadro, piscadas de luz, vinheta e brilho em volta dos traços.

Elementos do filme de exemplo:
- o horizonte, o sol e o mar visto de lado, com uma régua de profundidade em metros;
- um peixe-lanterna desenhado traço a traço, com 12 luzes na barriga que acendem uma a uma;
- um caçador que olha para cima e abre a boca;
- uma tela dividida (o peixe e a vista do caçador);
- um enxame de animais subindo e o cartão final com o título.

A legenda fica embaixo, à esquerda, sem faixa: uma linha em chinês com letra de marcador e, embaixo, a mesma fala em inglês. Ela é revelada da esquerda para a direita.

## Quando usar

**Bom para:**
- coisas que acontecem no escuro (fundo do mar, noite, espaço);
- partir de um detalhe pequeno e abrir para um sistema inteiro;
- ciência e natureza contadas com poucos elementos e muito clima;
- vinhetas curtas com ar de cinema experimental.

**Evite para:** marcas que pedem cor chapada e limpa, telas de produto, muitos números ou texto longo na tela, e qualquer coisa que precise de fundo claro.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 52 s (`DUR: 52.0` na tabela `T` de `js/shots.js`; `dur` em `timeline.json`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `js/base.js`) |
| Prévia ao vivo | ~30 fps (médio) |
| Fontes (OFL) | LXGW Marker Gothic (legenda e título em chinês), Jost (legenda em inglês e título), IBM Plex Mono SemiBold (profundidade e régua) |
| Cores | película `#050403`, traço creme `#fff4dc`, tintas `#2f86ff`, `#ff3220`, `#ffc81c` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração (texto para gerar a voz) | `vo/lines.json` | campo `text` de cada fala (`v01`…`v12`) |
| Legenda que aparece na tela | `timeline.json` | campos `zh` (linha de cima) e `en` (linha de baixo) de cada fala |
| Quando cada fala e cada legenda entram | `timeline.json` | `t0`/`t1` (voz) e `c0`/`c1` (legenda) |
| Origem desses tempos | `timeline.py` | `START` (segundo de entrada), `SUB` (texto em chinês) |
| Tempos das cenas | `js/shots.js` | tabela `T` (`s2`…`s8`, `lit0`, `card`, `DUR`) |
| Qual cena toca em cada trecho | `js/main.js` | `shotAt()` (`shot12`, `shot3`, `shot4`, `shot5`, `shot678`) |
| Cartão final | `js/shots.js` | `endCard()` (título, subtítulo, linha do estilo, crédito) |
| O peixe, o caçador e os bichos | `js/creatures.js` | `drawFish()`, `drawPredator()`, `drawCopepod()`, `drawJelly()` |
| Câmera | `js/shots.js` | `cam12()`, `cam678()` e as posições em metros (`HERO`) |
| Posição da legenda | `js/main.js` | `SUBX`, `SUBY` |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `vo/lines.json` e as legendas em `timeline.json`. A linha de cima (`zh`) usa letra de marcador e a de baixo (`en`) usa Jost: o código desenha sempre as duas linhas (`subtitle()` em `js/main.js`), então decida com o usuário o que vai em cada uma (por exemplo, a fala em pt-BR em cima e uma tradução embaixo).
2. **Ajuste o tempo.** Se a nova narração tiver outra duração, mude `t0`, `t1`, `c0` e `c1` em `timeline.json`. As cenas estão presas aos segundos da tabela `T` em `js/shots.js`; se as falas mudarem muito de lugar, mova também esses segundos.
3. **Troque o cartão final** em `endCard()`: título grande, linha em chinês, linha "Scratch Film · 胶片直刻" e o crédito.
4. **Personagem novo:** o peixe é uma lista de pontos (`F_TOP`, `F_BOT`, `F_TAIL`) e as luzes da barriga saem de `PHOTO`. Ajustar proporções e cores é fácil; trocar o peixe por outro bicho ou objeto exige redesenhar esses contornos e conferir as cenas que dependem deles (luzes acendendo, silhueta, tela dividida).
5. **Confira um trecho** abrindo a página com `?from=` e `?to=` (em segundos) antes de renderizar o filme todo.

## O que não mexer

- O passe de luz em `window.render` (`js/main.js`): brilho, poeira (`DUST`), granulação (`GRAIN`), vinheta e o balanço do quadro.
- `scratch()`, `dye()` e `makeEmulsion()` em `js/base.js`: é o que faz o traço arranhado, a tinta e a película preta.
- O passo de 15 desenhos por segundo (`t * 15` em `render`): é o que faz as linhas ferverem.

## Atenção

- **Assinaturas do exemplo:** o cartão final escreve "LemoLab × Claude Opus 5.5" e "Scratch Film · 胶片直刻" (`endCard()` em `js/shots.js`). Troque pelo nome da marca do usuário ou apague.
- **Letras com acento:** as fontes em `fonts/` foram recortadas por `make_fonts.py` só com ASCII e os caracteres chineses usados. Letras como "ç", "ã" e "é" não existem nelas e vão aparecer como quadrado. É preciso recortar as fontes de novo incluindo os acentos; avise o usuário antes de trocar a fonte.
- **Fatos do exemplo:** o `CREDITS` diz que cada fato da narração tem fonte em `demo/FACTS.md`, mas esse arquivo não veio junto. Para um tema novo, as fontes dos fatos são do usuário.
- **Modos especiais:** `?from=a&to=b` toca só o trecho entre os segundos `a` e `b`.
