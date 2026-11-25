# Explicação com bonecos de palito

**Slug:** `stick-explainer` · **Categoria:** Esboço e quadro · **Filme de exemplo:** 52 s, 1920×1080

## O visual

Papel creme liso `#F3F0EA`, com um grão bem fino e sem vinheta. Os bonecos são de palito: cabeça redonda, tronco curvo, braços e pernas com uma única espessura de traço (`LW = 7`), pontas arredondadas, em grafite `#24242C`. Uma só cor de destaque, o vermelho `#EB4A2A`: é "você" e é o que corre pelos braços de quem está de mãos dadas.

O movimento é de mola: cada articulação persegue uma pose-alvo, com antecipação (agacha antes de pular) e sobra (o antebraço chega depois do braço, a cabeça depois do corpo). A câmera atravessa quatro "mundos" que se encaixam no ponto de corte:
- uma corrente de mãos de você até um desconhecido, que vira quatro correntes passando cartas;
- anéis de pessoas em volta de você, cada um 2,5 vezes maior que o anterior;
- três correntes que encurtam (6 → 4,74 → 3,57);
- a última corrente dobra sobre um globo e fecha a volta.

Os textos entram subindo e saem sumindo. A legenda fica no canto inferior esquerdo, sem caixa, com um tracinho vermelho ao lado: uma linha grande em chinês e, embaixo, uma menor em inglês.

## Quando usar

**Bom para:**
- explicar uma ideia de ciência ou de comportamento com pessoas como "unidades";
- redes, correntes, contágio, efeito dominó;
- comparar números grandes com uma imagem simples (anéis, filas, contagem);
- tom leve e claro, de aula bem feita.

**Evite para:** rostos, emoção individual, produto físico, foto ou muita cor. Os bonecos não têm expressão; a graça está no gesto e na conta.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 52 s (50 s de história + cartão final; `FILM_DUR = 52` em `full.js`), renderizado a 60 fps pelo `build.sh` |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `index.html`) |
| Prévia ao vivo | ~100 fps (leve) |
| Fontes (OFL) | Jost (texto latino), Noto Sans SC recortada (`NotoSansSC-sub.ttf`, só os caracteres de `tools/zh-chars.txt`) |
| Cores | papel `#F3F0EA`, traço `#24242C`, cinza `#9C978C`, vermelho `#EB4A2A` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Legendas (linha principal e linha de baixo) | `full.js` | `VO`: `[id, segundo de entrada, duração, texto chinês, texto inglês]` |
| Texto da narração (para gerar a voz) | `voice/lines.json` | campo `text` de cada fala (`v01`…`v10`) |
| Duração de cada fala | `voice/dur.json` e `full.js` | os segundos estão copiados à mão na 3ª coluna de `VO`; mude nos dois |
| Títulos e números de cada trecho | `full.js` | `hudS1()`, `hudS2()`, `hudS3()`, `hudW4()`, `hudS5()` |
| Rótulos "YOU / 你" e "A STRANGER / 陌生人" | `full.js` | `drawW1()` |
| Contagem dos anéis | `full.js` | `COUNT`: `['passo', 'número de pessoas', segundo de entrada]` |
| As três correntes finais | `full.js` | `ROW4`: `{ gy, steps, start, year, sub, val }` |
| Cartas do trecho de 1967 | `full.js` | `LET` (início e em qual mão a carta para) |
| Cartão final | `full.js` | `hudS5()`, função `pair()` |
| Quando cada mundo começa | `full.js` | `worldAt()` e as câmeras `camW1()`, `camW3()`, `camW4()`, `camW5()` |

**Formato dos dados.** Os números estão no próprio código, não num arquivo à parte. Exemplo de uma linha de `ROW4`:

```js
{ gy: 820, steps: 3.57, start: 40.3, year: '2016', sub: 'Facebook · 1.6 billion people', val: '3.57' }
```

`steps` define quantos bonecos a corrente tem (arredondado para cima, mais um) e o comprimento do último elo; `val` é o número escrito na ponta. Em `COUNT`, cada linha é um degrau da tabela à direita dos anéis.

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `voice/lines.json` e as legendas em `VO`. A coluna chinesa é a linha grande da legenda: ponha o texto em pt-BR nela e troque a fonte dessa linha em `drawSubs()` de `ZH` para `EN` (a Noto recortada não tem letras latinas). A coluna inglesa vira a linha menor; pode repetir em outra língua ou ficar vazia.
2. **Faça o mesmo com os rótulos em chinês** dos `hud*()` e de `drawW1()`: troque o texto e a fonte (`font: ZH` → tirar ou usar `EN`).
3. **Ajuste o tempo.** Com a nova narração, atualize `voice/dur.json` e a 3ª coluna de `VO`. Se as falas mudarem muito de tamanho, os tempos de entrada (`hud(..., tin, tout)`) e os limites de `worldAt()` também precisam andar.
4. **Troque os números** em `COUNT` e `ROW4`, e as citações de fonte escritas em `hudS2()`, `hudS3()` e `hudW4()`.
5. **Confira os quadros** com `tools/png.mjs full <segundo> <saída.png>` em vários pontos (corrente inicial, cartas, anéis, correntes, globo) antes de renderizar.

## O que não mexer

- O esqueleto e as molas em `index.html` (`joints()`, `figure()`, `SPR`, `simulate()`): é o que faz o boneco parecer vivo.
- Uma espessura de traço só (`LW`) e uma cor de destaque só (`C.sig`).
- O papel sem textura forte (`paper()`): o estilo é limpo de propósito.

## Atenção

- **Texto em chinês na tela:** a legenda principal é em chinês, e há rótulos em chinês no filme (你, 陌生人, "296 封信，送到 64 封", "中间平均 5.2 人", "比你想的更近", 隔着几只手, 火柴人讲解) e nos quadros `f1`–`f3`. Tudo precisa ser trocado. A fonte chinesa é recortada: um caractere novo vira quadrado, a não ser que seja refeito o recorte com `build.sh` a partir de `tools/zh-chars.txt`.
- **Assinaturas do exemplo:** o cartão final (`hudS5()` em `full.js`) leva "LemoLab × Claude Opus 5.5", e a abertura avulsa de `index.html` também, quando aberta com `?scene=film&sign=1`; o cartão também escreve o nome do filme "Six Hands Away" e do estilo. A abertura diz "EP. 05 · NETWORKS". Troque pela marca do usuário ou apague.
- **Dados reais:** os números citam Travers & Milgram 1969, Backstrom et al. 2012, Facebook Research 2016 e ONU 2024 (`8,200,000,000`). Se o tema mudar, troque as citações junto; não deixe fonte antiga sob número novo.
- **Letras com acento:** Jost tem acentos do português. Se aparecer quadrado, é texto que ainda está com `font: ZH`.
- **Modos especiais:** `?scene=full` (padrão) é o filme; `?scene=film` mostra só a abertura (os outros trechos viram cartões cinza); `?scene=f1`, `f2` ou `f3` mostram quadros fixos de referência; `?from=` e `?to=` recortam um trecho; `?fig=B` ou `C` trocam o jeito de desenhar o boneco (o estilo usa `A`). Não há parâmetro para tirar a legenda.
