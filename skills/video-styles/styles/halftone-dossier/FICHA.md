# Dossiê em retícula

**Slug:** `halftone-dossier` · **Categoria:** Impressão e gravura · **Filme de exemplo:** 30 s, 1920×1080

## O visual

Papel creme `#F4ECDD` com textura e grão, impresso em retícula: pontos grandes e pequenos em ângulos diferentes, em azul-marinho `#1D2340`, azul `#2E55D6`, rosa `#FF5A87` e amarelo `#FFC628`, sobrepostos como numa gráfica. O traço tremido (o filtro "boil") dá cara de desenho feito à mão quadro a quadro.

O exemplo é um processo de brincadeira contra um gato laranja: capa de dossiê, ficha do "suspeito" com régua de altura e foto de fichamento, três "acusações" numeradas (01, 02, 03), o veredito e o arquivamento. Letras gigantes pulam na tela uma a uma, carimbos batem com tremor de câmera, há flashes de foto e uma pulsação leve no ritmo da música. O gato é desenhado em código, com várias poses (sentado, correndo, deitado, enrolado) e rosto que pisca e mexe a boca.

Não há narração nem legenda: toda a história é contada por textos grandes na tela.

## Quando usar

**Bom para:**
- humor e vídeos curtos de redes sociais;
- conteúdo de pets;
- "acusar" algo de brincadeira: um hábito, um produto, um mito;
- listas curtas numeradas com um veredito no fim.

**Evite para:** temas sérios, explicações longas, dados precisos ou qualquer vídeo que precise de narração sincronizada (o código não tem sistema de falas).

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 30 s, 10 cenas (`DUR = 30` e `FPS = 30` em `index.html`) |
| Formato | só horizontal, 1920×1080 (tamanho fixo no CSS, no SVG e nos canvas de `index.html`) |
| Prévia ao vivo | ~42 fps (leve) |
| Fontes (OFL) | Noto Serif SC (títulos), Noto Sans SC (legendas e carimbos), ZCOOL KuaiLe (falas fofas), Bagel Fat One (nome e números gigantes), JetBrains Mono (números de processo, relógio) |
| Cores | papel `#F4ECDD`, marinho `#1D2340`, azul `#2E55D6`, rosa `#FF5A87`, amarelo `#FFC628`, laranja do gato `#F58A34` |
| Som | o código gera só a imagem; a trilha do exemplo não vem junto. O filme original não tem voz |

## Onde está o conteúdo

Tudo fica num arquivo só: `index.html`.

| O que mudar | Onde |
|---|---|
| Cenas e seus tempos | `buildAll()`: cada `scene(início, fim, ...)` é um trecho (0–2, 2–4, 4–8 … 26–30 s) |
| Textos grandes | chamadas `chars(g, '...')` dentro de cada cena (letras que pulam uma a uma) |
| Textos pequenos (fichas, etiquetas, relógio) | chamadas `txt(..., '...')` |
| Legendas em faixa | chamadas `caption(g, [[...]])` (partes com cor própria) |
| Carimbos | `stampEl()` e `stampAnim()` |
| Barra de cima (número do processo, etapa, data) | bloco do HUD, lista `[início, fim, 'etapa', 'título']` |
| O gato | `catHead()`, `catSit()`, `catRun()`, `catLoaf()`, `catCurl()` e `setFace()` |
| Tremores de câmera | `SHAKES` (segundo, força, duração) |
| Flashes | lista `[5.0, 6.0]` dentro de `render()` |
| Cores | objeto `C` |
| Fontes | objeto `F` e `fonts.css` |

## Como adaptar

1. **Traduza os textos.** Todo o texto do exemplo está em chinês. Troque cada `chars()`, `txt()` e `caption()` por frases curtas em pt-BR. Os títulos são grandes (até 330 px); palavras longas passam da tela, então confira cada cena.
2. **Troque o personagem com cuidado.** Mudar o nome, o peso, a cor do gato (`C.orange`) ou os textos da ficha é fácil. Trocar o gato por outro bicho ou pessoa exige redesenhar as funções `cat...()` e as poses em todas as cenas.
3. **Mude a duração por cena.** Cada `scene()` tem início e fim fixos, e várias animações usam segundos absolutos dentro da cena. Para alongar um trecho, ajuste o `scene()` e os tempos internos dele, além de `SHAKES`, flashes e a lista do HUD.
4. **Fontes:** `fetch_fonts.mjs` baixa as fontes do Google Fonts para `fonts/` e gera `fonts.css`. Se trocar de fonte, rode de novo.
5. **Confira os quadros** abrindo com `?t=` em vários segundos (capa, ficha, cada acusação, veredito, final) antes de renderizar.

## O que não mexer

- `halftone()`: é o que gera a retícula; mexa só nas cores e no tamanho dos pontos.
- `buildPaper()` e `drawFx()`: textura do papel e grão.
- Os filtros SVG `boil`, `ink` e `stampInk` no topo do arquivo: dão o traço tremido e a tinta do carimbo.
- A mistura `multiply` (classe `mul`): é o que faz as cores se sobreporem como impressão.

## Atenção

- **Assinaturas do exemplo:** o cartão final diz, em chinês, que o filme foi desenhado "por Claude", e a última linha é "LemoLab × Claude Opus 5.5". A capa e o arquivo trazem "CHUBBY", "Pang Ju" e o número de processo "2026-CAT-001". Troque pelo nome da marca do usuário ou apague.
- **Sem narração:** não existe `lines.json` nem legenda de fala. Se o usuário quiser voz, os textos precisam ser cronometrados à mão com a narração.
- **Fontes pesadas:** `fonts.css` carrega mais de cem fatias de fonte (a maioria para chinês). As fatias latinas têm letras acentuadas; se aparecer um quadrado no lugar de uma letra, avise o usuário em vez de trocar a fonte.
- **Modos especiais:** só `?t=` (segundo inicial). Não há `?nosub`, `?poster` nem quadros fixos.
