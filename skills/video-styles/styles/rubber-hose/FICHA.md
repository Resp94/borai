# Desenho anos 30

**Slug:** `rubber-hose` · **Categoria:** Desenhos animados · **Filme de exemplo:** 50 s, 1920×1080 (imagem 4:3 com faixas pretas nas laterais)

## O visual

Um desenho animado em preto e branco dos anos 1930. Os personagens têm braços e pernas de "mangueira de borracha", olhos em fatia de torta, luvas brancas e sapatões redondos. Tudo respira na batida: estica no tempo forte, encolhe no contratempo. O traço treme de leve (três desenhos que se alternam) e a animação anda a 12 quadros por segundo.

A paleta é só de cinzas, do branco `#FCFBF7` ao preto `#0E0D0C`, passando por papel `#F1EEE6` e cinza médio `#9A978F`. Os fundos são aquarelas cinza, mais claras e mais finas que os personagens. Por cima de tudo vem o efeito de filme velho: janela 4:3 com cantos arredondados, imagem que balança, brilho que pisca, riscos, poeira, um fio de cabelo de vez em quando e vinheta escura.

No exemplo, uma xícara de café acorda, acha o café amargo e persegue um cubo de açúcar fujão pela cozinha: balcão, torradeira, armário de pratos, pia. No fim, o açúcar pula na xícara por vontade própria e a cozinha inteira dança. Fecha com íris e o cartão "The End".

A legenda é uma placa preta com moldura dupla clara e letras de época, embaixo (ou em cima, quando a ação está embaixo).

## Quando usar

**Bom para:**
- comida e bebida;
- anúncios retrô e marcas com cara de antigamente;
- conteúdo infantil e humor físico.

**Evite para:** temas sérios, dados, explicações longas, ou qualquer coisa que dependa de cor (a imagem é toda cinza).

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 50 s (144 BPM, 30 compassos; `DUR = bar(NBARS + 1)` em `story.js`) |
| Formato | só horizontal, 1920×1080; o filme é desenhado numa janela 4:3 de 1440 px de largura (`GATE` em `film.js`). `?w` e `?h` em `main.js` só valem para as folhas de modelo |
| Prévia ao vivo | ~50 fps (leve) |
| Fontes (OFL) | Shrikhand (títulos gordos), Limelight (letreiros), IM Fell English SC (legenda e créditos) |
| Cores | branco `#FCFBF7`, papel `#F1EEE6`, cinza `#9A978F`, cinza-escuro `#3B3A37`, preto `#0E0D0C` (`P` em `chars.js`) |
| Som | o código gera só a imagem; narração, trilha e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas para gerar a voz | `lines.json` | campo `text` de cada fala (`v1a`…`v6`) |
| Quando cada fala entra | `story.js` | `VO` (em compassos, com `bar(compasso, tempo)`) |
| Legenda | `story.js` | `SUBS`: início, fim, texto e posição (`'b'` embaixo, `'t'` em cima); uma placa pode juntar duas falas |
| Planos | `story.js` | `SHOTS` (início, fim e nome) |
| Gestos e momentos | `story.js` | `K` (acordar, provar, correr, cair na pia, dançar…) |
| Título | `scenes.js` | `fatTitle(g, 'Coffee', …)`, `fatTitle(g, 'Cup Chase', …)` e o letreiro "A RUBBER HOSE CARTOON" |
| Cartão final | `scenes.js` | "The End", "RUBBER HOSE · 1930s CARTOON STYLE" e a assinatura |
| Xícara e açúcar | `chars.js` | `mug()` e `cube()` |
| Figurantes da cozinha | `cast.js` | objetos que dançam no fundo |
| Cozinha e armário | `bg.js` | `paintKitchen()` e `paintCupboard()` |
| Cartaz | `main.js` | bloco `poster` (abre com `?poster=1`) |

## Como adaptar

1. **Comece pelo texto.** Troque falas em `lines.json` e legendas em `SUBS`. As legendas não são geradas das falas: mude as duas. A placa tem uma linha só; frases longas passam da janela 4:3.
2. **Ajuste o tempo.** Depois de gerar a voz, confira se cada fala cabe entre seu `VO` e o fim da placa em `SUBS`. Tudo está preso à grade de 144 BPM.
3. **Troque título e cartão final** em `scenes.js`.
4. **Outros personagens ou outro lugar:** a xícara, o açúcar, os figurantes e a cozinha são desenhados em código. Trocar textos e tempos é fácil; trocar a xícara por outro produto exige redesenhar `mug()` (e as poses de cada plano em `scenes.js`).
5. **Confira os quadros** com `tools/still.mjs` em vários segundos (título, close do "amargo", armário, pia, dança, The End) antes de renderizar.

## O que não mexer

- `toon.js`: o traço que treme, as sombras chapadas e a espessura de linha constante.
- `film.js`: a janela 4:3, os riscos, a poeira e o balanço do filme.
- A respiração na batida (`breath()`) e o passo de 12 quadros por segundo (`q()`) em `story.js`: são a alma do estilo.

## Atenção

- **Assinaturas do exemplo:** o cartão final escreve "LemoLab × Claude Opus 5.5" (`scenes.js`). Troque pela marca do usuário ou apague.
- **Crédito obrigatório da trilha original:** a trilha do exemplo usa a bateria "MuldjordKit" (Lars Muldjord), licença CC BY 4.0. Se o usuário usar essa trilha, ela precisa ser creditada.
- **Depende de arquivos fora da pasta:** vários arquivos importam `/core/lib.js` da skill. A prévia precisa ser servida a partir da raiz da skill.
- **Letras com acento:** se aparecer um quadrado no lugar de uma letra, a fonte não tem aquele caractere; avise o usuário em vez de trocar a fonte.
- **Modos especiais:** `?nosub=1` tira a legenda. `?poster=1` põe o título numa placa. `?mode=sheet` e `?mode=kitchen` mostram as folhas de modelo; `?mode=test` mostra os personagens girando.
