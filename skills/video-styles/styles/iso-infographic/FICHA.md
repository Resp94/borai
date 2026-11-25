# Infográfico isométrico

**Slug:** `iso-infographic` · **Categoria:** Dados e mapas · **Filme de exemplo:** 58,8 s, 1920×1080

## O visual

Um único mundo em perspectiva isométrica, como uma maquete vista de cima: montanha com terraços, estrada, porto, mar com navio, cidade, torrefação e café. Cores chapadas com três tons por face (claro, médio, escuro) sobre fundo creme `#F2E6D0`, contorno marrom-escuro `#2E2522`. Verde `#7BA75F`, azul `#3C7FB1`, vermelho `#CF5140`, mostarda `#D9A53A` e terra `#8A5B3A` são as cores principais.

A câmera percorre o mundo seguindo o caminho do produto: aproxima numa mão segurando o fruto, abre para a paisagem, acompanha o caminhão, o guindaste e o navio, mergulha dentro do contêiner e termina numa xícara. No fim, a câmera abre no mapa inteiro, a rota acende estação por estação e entra um cartão com o total de quilômetros.

Elementos do filme:
- título em letras 3D sobre uma placa (`FROM BEAN TO CUP`);
- etiquetas com alfinete em cada etapa (título, número grande e unidade);
- linha da rota que vai se desenhando um pouco à frente da história;
- cartão final com barra de ícones no estilo Isotype (cada quadrado = 1.000 km).

A legenda é uma pílula clara centralizada embaixo da tela, com uma linha só.

## Quando usar

**Bom para:**
- explicar um processo ou uma cadeia de suprimentos de ponta a ponta;
- mostrar distâncias, quantidades e etapas num mapa;
- relatórios e apresentações institucionais com tom leve.

**Evite para:** temas sem um caminho físico, rostos e emoção, ou muito texto. As etiquetas comportam uma palavra e um número.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 58,8 s (`DUR = TL.END` no `film.js`; tempos em `timeline.js`, grade de 100 BPM e depois 80 BPM) |
| Formato | só horizontal, 1920×1080 (canvas fixo no `index.html` e no `Iso` do `engine.js`) |
| Prévia ao vivo | ~35 fps (média) |
| Fonte (OFL) | Jost |
| Cores | `PAL` em `engine.js`: fundo `#F2E6D0`, papel `#FBF4E6`, traço `#2E2522`, mais verde, azul, vermelho, mostarda, terra e pedra |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração | `lines.json` | campo `text` de cada fala (`L1`…`L6`) e `t` (segundo de entrada) |
| Legendas | `timeline.js` | `SUBS` (`t0`, `t1`, `text`) |
| Quando cada ação acontece | `timeline.js` | `TL` (todos os momentos do filme, em segundos) |
| Distâncias do mapa | `timeline.js` | `KM` (`farm`, `sea`, `city`, `total`; precisam somar certo) |
| Etiquetas das etapas | `film.js` | `LAB` (`title`, `num`, `unit` de cada etapa) |
| Título de abertura | `film.js` | `titleCard()` (palavras `FROM`, `BEAN`, `TO`, `CUP` e o subtítulo) |
| Cartão final | `film.js` | `fullMap()` |
| O mundo (relevo, portos, cidade) | `world.js` | `MTN`, `BEDS`, `PORT_A`, `PORT_B`, `ROASTERY`, `CAFE`, `CITY`, `TREES` |
| Mão, fruto, xícara | `hero.js` | `palm()`, `pinch()`, `branch()`, `cherry()`, `cup()` |
| Movimento de câmera | `film.js` | `camAt(t)` |
| Paleta | `engine.js` | `PAL` |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `lines.json` e o mesmo texto em `SUBS` (`timeline.js`). A legenda é uma linha só; frases longas passam da largura.
2. **Troque as etiquetas** em `LAB` e as distâncias em `KM`. O cartão final usa `KM.total` e a barra de quadrados divide pelos trechos de `KM`.
3. **Título:** as quatro palavras do `titleCard()` entram uma por batida (`TL.TITLE_WORDS`). Se mudar o número de palavras, ajuste essa lista e a largura da placa.
4. **Ajuste o tempo.** Tudo lê `TL`; se a narração mudar de duração, mexa nos segundos ali.
5. **Outro processo:** o mundo e os personagens são desenhados em código. Trocar rótulos, números e cores é fácil; trocar o café por outro produto (outro relevo, outros veículos, outro ponto final) exige redesenhar partes de `world.js`, `hero.js` e funções como `roastery()`, `cafe()` e `machine()`, e refazer a câmera.

## O que não mexer

- `engine.js` (`Iso`): é o motor isométrico que projeta o mundo e ordena as faces.
- A regra dos três tons por face (`tri()`): é o que dá volume ao desenho chapado.
- `routeLead()`: a rota sempre um pouco à frente da história faz parte do estilo.

## Atenção

- **Assinaturas do exemplo:** o cartão final (`fullMap()`) traz "Lemo-Opuscar · LemoLab × Claude Opus 5.5" e duas linhas de créditos de voz, fonte e samples. Troque pelo nome da marca do usuário ou apague; a primeira linha do `CREDITS` também traz a assinatura.
- **Letras com acento:** Jost tem acentos, mas confira na prévia. Se aparecer um quadrado, avise o usuário em vez de trocar a fonte.
- **Texto do cartão:** "road 500" está escrito à mão no `fullMap()`, não vem de `KM`. Se mudar as distâncias, troque esse texto também.
- **Modos especiais:** `?nosub` tira a legenda; `?nocard` tira o cartão final; `?k=…&cx=…&cy=…&cz=…` fixa a câmera num ponto (útil para conferir enquadramento); `?test=…` abre os testes de `tests.js`.
- **Material de terceiros:** o `CREDITS` diz que tudo é desenhado em código e que os ícones são originais, só inspirados na gramática do Isotype.
