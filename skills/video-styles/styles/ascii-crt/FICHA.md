# Terminal ASCII de CRT

**Slug:** `ascii-crt` · **Categoria:** Telas e interfaces · **Filme de exemplo:** 59,8 s, 1920×1080

## O visual

Um monitor antigo de fósforo âmbar sobre fundo preto. Tudo é feito de caracteres da fonte VT323: textos, molduras, a Lua e a Terra. O âmbar vai de laranja nos tons escuros (`#FF6605`) a amarelo-âmbar (`#FFB000`) e quase branco onde estoura; a Terra usa um segundo canal azul-claro (`#B8E0FF`). Por cima vem o efeito de tubo (`crt.js`): tela curva, cantos arredondados, linhas de varredura, brilho em volta das letras, reflexo do vidro, ligar e desligar com o ponto de luz no meio.

O filme anda como uma sessão de terminal:
- o título é digitado letra por letra, encolhe e vira a primeira linha de um autoteste;
- relógio que gira 40 anos, painel **LINK** com barra de sinal;
- uma mensagem chega digitada "do outro lado", com pausas de quem está escrevendo;
- a resposta é escrita grande, e as letras dela caem e se espalham até formar a imagem da Terra nascendo sobre a Lua;
- um zoom entra numa letra da Terra e mostra que ela é feita de 40 anos de registros;
- a câmera sai da tela e mostra a base vazia, com cadeira, teclado e janela redonda.

A legenda é um painel **LOG** fixo embaixo, separado por uma linha tracejada, onde a fala é digitada em maiúsculas no ritmo da voz.

## Quando usar

**Bom para:**
- ferramentas de dev, linha de comando, sistemas e dados;
- ficção científica, máquinas que "acordam", mensagens vindas de longe;
- marcas de tecnologia com tom retrô;
- revelar uma imagem que nasce de um texto.

**Evite para:** fotos, rostos, muitas cores ou textos longos. O monitor comporta frases curtas e linhas de comando, não parágrafos.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 59,8 s (100 BPM; `T.dur` em `main.js`, `dur` em `events.json`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `term.js`; canvas fixo em `index.html`) |
| Prévia ao vivo | ~100 fps (leve) |
| Fontes (OFL) | VT323 (única fonte do filme) |
| Cores | fundo preto, fósforo âmbar `#FF6605`→`#FFB000`, Terra azul-clara `#B8E0FF` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração / painel LOG | `lines.json` | campo `text` de cada fala (`l1`…`l5`) |
| Quando cada fala entra | `main.js` | `VOT` (segundo de entrada por fala) |
| Duração de cada fala | `voices/dur.json` | segundos por fala; controla quanto tempo ela fica no LOG |
| Ritmo da digitação da fala | `voices/words.json` | tempo de cada palavra (início e fim) por fala |
| Título e subtítulo de abertura | `main.js` | `TITLE` e `SUBT` |
| Linhas do autoteste | `main.js` | `BOOT` (segundo, texto) |
| Mensagem que chega | `main.js` | `MSGIN` e os tempos de cada letra em `MSG_T` |
| Comando e erros de câmera | `main.js` | `CMD` e a função `sMsg()` |
| A resposta (vira a imagem) | `main.js` | `MSG` |
| Texto dos registros no zoom | `main.js` | `logRow()` |
| Mensagens do painel LOG sem fala | `main.js` | função `strip()` (envio, "AWAITING REPLY") |
| Cartão final | `main.js` | `CARD1` e `CARD2` |
| Tempos de cada cena | `main.js` | objeto `T` |
| Lua e Terra | `art.js` | `paintEarthrise()`, contornos dos continentes em `CONT` |
| Posição da Terra e da Lua | `main.js` | `PIC` (horizonte, centro e raio da Terra) |
| A sala da base | `main.js` | `paintBase()` (janela em `PORT`, tela em `SCR`) |
| Cores e efeito de tubo | `crt.js` | `params` (`amber`, `amberLo`, `amberHi`, `earth`, curvatura, varredura) |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `lines.json` e os textos de tela (`TITLE`, `SUBT`, `BOOT`, `CMD`, `MSG`, `CARD1`). Escreva em maiúsculas: o painel LOG já converte a fala com `toUpperCase()`.
2. **Ajuste o tempo das falas.** Com a nova narração, atualize `voices/dur.json` e os segundos em `VOT`. O `voices/words.json` precisa ter uma entrada por palavra do texto, no formato `["palavra", início, fim]` em segundos a partir do começo da fala. Se o número de palavras não bater, o código ignora o arquivo e digita a fala em ritmo uniforme.
3. **A resposta (`MSG`) é a peça central.** A imagem da Terra é desenhada só com as letras dela, e são essas letras que caem para formar o quadro. Mantenha a resposta curta: ela é centralizada contando 16 caracteres de 80 px, então frases bem maiores passam da tela.
4. **A mensagem que chega (`MSGIN`) tem 16 caracteres** presos no código: `MSG_T` tem 16 tempos e `sMsg()` testa `n < 16` e `n === 16`. Para outro tamanho, ajuste os três.
5. **Imagem nova:** a Terra é calculada em `art.js` a partir de polígonos de longitude e latitude (`CONT`, pares `[lon, lat]` em graus). Para outra imagem, reescreva `paintEarthrise()` pintando em tons de cinza: o canal vermelho vira âmbar, o verde vira azul. O resto (escolha de caracteres, queda das letras) é automático.
6. **Confira os quadros** em vários segundos (abertura, mensagem, queda das letras, zoom, base) antes de renderizar.

## O que não mexer

- `crt.js`: é o shader que faz o tubo, o brilho do fósforo e o liga/desliga.
- `term.js`: monta o atlas de letras e escolhe o caractere pela densidade (`makeRamp()`, `pick()`).
- A regra de desenho aditivo (vermelho = âmbar, verde = azul da Terra): todo o colorido depende dela.

## Atenção

- **Letras com acento somem.** O atlas de letras em `term.js` (`CHARS`) só tem os caracteres ASCII de 32 a 126 mais o `×`. Um á, ç ou ã não vira quadrado: simplesmente não aparece. Escreva sem acento ou inclua os caracteres em `CHARS` e confira se aparecem.
- **A resposta precisa ter a letra M.** O zoom procura um "M" na Terra (`findTarget()`). Se a nova `MSG` não tiver M, o filme quebra nessa cena; troque a letra procurada no código.
- **Assinaturas do exemplo:** o cartão final (`CARD2`) e o cartaz levam "LemoLab × Claude Opus 5.5". O título "TRANQUILITY.LOG", a "UNIT 7 / LUNAR RELAY 7" e as datas 2051/2091 são da história fictícia. Troque pelo conteúdo do usuário.
- **Todo o texto de tela está em inglês** (autoteste, erros, painel LINK, registros "LINK CHECK ... NO SIGNAL").
- **Material de terceiros:** não há. O `CREDITS` diz que imagens, música e efeitos foram gerados pelo código e que os contornos dos continentes foram digitados à mão. A fonte VT323 (OFL) é baixada por `tools/fonts.sh` se faltar em `fonts/`.
- **Modos especiais:** `?frame=earth`, `?frame=fractal` (com `&t=` para o segundo), `?frame=poster` e `?frame=base` mostram quadros fixos. `?nosub` tira o painel LOG.
