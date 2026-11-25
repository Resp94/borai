# Impressão risográfica

**Slug:** `risograph` · **Categoria:** Impressão e gravura · **Filme de exemplo:** 40 s, 1920×1080

## O visual

Uma impressão em risografia, a gráfica barata de fanzine. Cada quadro é feito de até três "chapas" de tinta chapada sobre papel creme (`#F6F1E6`): azul (`#0078BF`), amarelo (`#FFE800`) e rosa fluorescente (`#FF48B0`). Onde as cores se sobrepõem, nascem outras (verde, roxo, laranja). Os tons viram retícula de pontos, há grão de papel, e as chapas ficam um pouco fora de registro, com as cores levemente deslocadas umas das outras.

O desencaixe é fixo dentro de cada plano, como numa folha impressa de verdade, e só "pula" nos tempos fortes da música. Num momento sem música, as três chapas se afastam devagar e voltam ao lugar com um clique.

O exemplo é um passeio de bicicleta num domingo de manhã: rua, padaria, parque, pombos, um passageiro inesperado, o rio e uma impressora que solta a folha final. A cor cresce com a história: o filme começa só em azul, ganha o amarelo na padaria e o rosa no parque.

Elementos fixos:
- personagem e bicicleta desenhados em código, animados "em dois" (12 quadros por segundo);
- texto impresso como mais uma chapa de tinta, também fora de registro;
- cada nova tinta entra varrendo a tela, como o tambor da impressora.

A legenda é uma faixa "vazada" no papel, no pé da tela, com o texto impresso em azul.

## Quando usar

**Bom para:**
- marcas independentes, cafés, livrarias e lojas de bairro;
- fanzines, eventos culturais e cartazes animados;
- estilo de vida, cidade e passeios;
- uma história em que algo "ganha cor" aos poucos.

**Evite para:** temas sérios ou técnicos, fotos, muitos números, ou marcas com cores fixas que não sejam essas três tintas.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 40 s (120 BPM, um compasso a cada 2 s; `DUR` em `film.js`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `draw.js`) |
| Prévia ao vivo | ~60 fps (leve) |
| Fontes (OFL) | Bricolage Grotesque (título), Jost (textos e legenda) |
| Cores | papel `#F6F1E6`, tintas azul `#0078BF`, amarelo `#FFE800`, rosa `#FF48B0` (`INK` e `PAPER` em `riso.js`) |
| Som | o código gera só a imagem; narração, trilha e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração / legenda | `lines.json` | campo `text` de cada fala (`l1`…`l5`) |
| Quando cada fala entra | `lines.json` | campo `t` (segundo de entrada) |
| Duração de cada fala | `voices/dur.json` | segundos por fala; controla quanto tempo a legenda fica na tela |
| Ordem e duração dos planos | `film.js` | `SHOTS` (nome, início, fim) |
| Conteúdo de cada plano | `film.js` | objeto `SHOT` (uma função por plano) |
| Quando cada tinta entra | `film.js` | `plates()` (azul em 0 s, amarelo em 8 s, rosa em 16 s) |
| Pulos de registro | `film.js` | `KICKS` (segundo e força) e `regist()` |
| Título de abertura | `film.js` | "SUNDAY RIDE" e "a ride in three plates" no plano de abertura |
| Cartão final | `film.js` | "SUNDAY RIDE", "RISOGRAPH PRINT" e a assinatura |
| Letreiro da padaria | `scenes.js` | "BAKERY" em `bakeryFront()` |
| Texto na folha impressa | `scenes2.js` | "1 · 2 · 3" |
| Ciclista, pombo e baguete | `rider.js` | `riderBike()`, `head()`, `pigeon()`, `baguette()` |
| Rua, padaria, rio, parque | `scenes.js`, `scenes2.js` | `street()`, `river()`, `park()`, `overhead()` |
| Tintas e papel | `riso.js` | `INK`, `PAPER` |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `lines.json`, o título, o letreiro e o cartão final. Escreva em pt-BR com acentos; Jost e Bricolage têm os acentos do português. A legenda não quebra linha: frases de uma linha só.
2. **Ajuste o tempo.** Meça a nova narração em `voices/dur.json` e ajuste o `t` de cada fala em `lines.json`. Mantenha os planos em múltiplos de 0,5 s para continuar no tempo da música.
3. **Cores:** a regra é ter no máximo três tintas. Para outra marca, troque os valores de `INK` por outras tintas de risografia. Todo desenho pinta em "chapas" (`[azul, amarelo, rosa]`), não em cores livres; uma quarta cor exige mexer em `riso.js`.
4. **Personagem e cenários:** o ciclista, a bicicleta, o pombo e os cenários são desenhados em código. Trocar roupa, cabelo e expressões é possível (`head()` tem vistas e expressões). Outra pessoa, outro veículo ou outro lugar exige redesenhar as funções de `rider.js` e `scenes.js`.
5. **Confira os quadros** com `?sheet` (folha de modelo), `?test=heads` (cabeças em várias vistas), `?frame=street` e `?frame=river` antes de renderizar.

## O que não mexer

- `riso.js`: retícula, grão de papel, sobreposição das tintas e desencaixe das chapas. É o que faz parecer impresso.
- O desencaixe fixo por plano que só pula nos tempos fortes (`regist()`). Desencaixe que treme o tempo todo parece defeito, não impressão.
- A entrada das tintas uma de cada vez (`plates()`): é a espinha da história visual.

## Atenção

- **Assinaturas do exemplo:** o cartão final (`film.js`) e o cartaz (`?poster`, em `main.js`) mostram "LemoLab × Claude Opus 5.5" e "RISOGRAPH PRINT". Troque pelo nome da marca do usuário ou apague.
- **Nomes das tintas:** pelo `CREDITS`, as cores imitam os nomes públicos das tintas Riso (Blue, Yellow, Fluorescent Pink), só como referência de cor.
- **Depende da pasta `core`:** o código importa `/core/lib.js` por caminho absoluto. Abra pelo servidor da galeria, com a raiz em `skills/video-styles/`.
- **Modos especiais:** `?nosub` tira a legenda. `?poster` imprime o título no céu. `?nogrid` tira o grão da tinta. `?boil=` (de 0 a 1) muda quanto desse grão "ferve" de um quadro para o outro. `?frame=street`, `?frame=river`, `?sheet` e `?test=heads` mostram quadros fixos de referência.
