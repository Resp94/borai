# Animação sci-fi de comédia

**Slug:** `scifi-toon` · **Categoria:** Desenhos animados · **Filme de exemplo:** 57,5 s, 1920×1080

## O visual

Desenho animado de traço grosso em `#1B1422`, cores chapadas e contorno que treme de leve, como desenho à mão. Os personagens se mexem a 12 quadros por segundo (`ANIM_FPS = 12`), enquanto câmera, portal e efeitos andam suaves. O portal é um redemoinho verde (`#3FD93A`, `#6EF24C`) que cobre a tela inteira na passagem de um universo para outro.

No exemplo, um cientista cansado (Vask) e o ajudante (Gary) atravessam universos atrás de um café: um mundo de gelatina, um onde a caneca bebe as pessoas, um só de dentes, um de pombos, um onde todos são Vask e um "completamente normal". No canto superior esquerdo, uma etiqueta de terminal diz o nome da dimensão. O título "COFFEE RUN" entra como cartão de TV dos anos 50.

A legenda fica embaixo, centralizada: letra branca arredondada com contorno preto grosso e, ao lado, um selo com o nome de quem fala na cor do personagem.

## Quando usar

**Bom para:**
- esquetes de humor com dois ou três personagens;
- marcas de tecnologia que aceitam piada e absurdo;
- vídeos curtos com diálogo rápido e cortes secos.

**Evite para:** temas sérios, explicações com dados ou muito texto na tela. O filme depende de personagens desenhados em código; sem eles o estilo perde a graça.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 57,5 s (`DUR = 57.5` em `story.js`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `toon.js`) |
| Prévia ao vivo | ~26 fps (pesado: abaixo de 30 fps, pode engasgar em máquina fraca) |
| Fontes (OFL) | Baloo 2 (legenda e textos), Titan One (letreiros), Bungee (título), VT323 (etiquetas de terminal) |
| Cores | traço `#1B1422`; selos de fala: Vask `#2A9D8F`, Gary `#EF5B3F`, Coffee `#8A5431`; fundo do cartão final `#241339` |
| Som | o código gera só a imagem; vozes, trilha e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas e quem fala | `lines.json` | `text` (o que é dito), `sub` (como aparece na legenda, se diferente) e `who` |
| Duração de cada fala | `voices/dur.json` | segundos por fala |
| Boca sincronizada | `voices/lips.json` | abertura da boca a cada 1/24 s, gerada por `voice.py` a partir do áudio |
| Quando cada fala entra | `story.js` | `VO` (segundo de entrada) |
| Lista de planos | `story.js` | `SHOTS` (início, fim, nome do plano, universo) |
| Etiquetas das dimensões | `story.js` | `TAGS` (código, descrição e cores) |
| Momentos-chave da ação | `story.js` | `T` (gotas, cliques, pulos, gole etc.) |
| Créditos do cartão final | `story.js` e `main.js` | `CREDITS`; e `endCard()` em `main.js` |
| Título | `main.js` | `titleArt()` (`'COFFEE RUN'`) |
| Cores do selo de fala | `main.js` | `WHO_COL` |
| Personagens | `chars.js` | `vask()`, `gary()`, `coffeeCup()` e a paleta `PAL` |
| Cenários e universos | `worlds.js` | `lab()`, `jelly()`, `mugWorld()`, `teethWorld()`, `pigeonWorld()`, `vaskCafe()`, `normalCafe()` |
| Cada plano | `main.js` | objeto `SH` (uma função por nome de plano) |

## Como adaptar

1. **Comece pelas falas.** Troque `text` e `sub` em `lines.json`. Se mudar os nomes em `who`, mude também as chaves de `WHO_COL`. Falas longas quebram em duas linhas sozinhas (`wrapSub()`, a partir de 1300 px).
2. **Ajuste o tempo.** Atualize `voices/dur.json` e os segundos em `VO`. A legenda é cortada no próximo corte de universo (`WORLD_CUTS` em `main.js`); se mudar os planos, mude essa lista também.
3. **Refaça a boca.** Com voz nova, rode `voice.py` de novo para gerar `voices/lips.json`. Sem esse arquivo, a boca abre e fecha num ritmo genérico.
4. **Troque os letreiros.** Etiquetas em `TAGS`, título em `titleArt()` e os textos pequenos dos cenários (`'CAFÉ GLORP'`, `'MENU'`, a lousa do laboratório em `worlds.js`, a caneca `'GENIUS'` em `chars.js`).
5. **O que é fácil e o que é difícil.** Cores de roupa e pele mudam em `PAL`. Trocar um universo por outro, criar personagem novo ou mudar o que eles fazem em cena exige desenhar em código, plano por plano, em `chars.js`, `worlds.js` e `SH`.
6. **Confira os quadros** com `?t=` (segundo do filme) em vários pontos antes de renderizar.

## O que não mexer

- `toon.js`: é o motor do traço que treme (`boil`) e do contorno grosso.
- `ANIM_FPS` e `q()`: os personagens a 12 quadros por segundo fazem parte do estilo.
- `portal()` e `WIPES`: a passagem pelo redemoinho é o corte do filme.

## Atenção

- **Assinaturas do exemplo:** o cartão final mostra "LemoLab × Claude Opus 5.5" e "SCI-FI SITCOM TOON" (`endCard()` em `main.js`). Os personagens Vask, Gary e Coffee são do exemplo. Troque pela marca do usuário ou apague.
- **Créditos em inglês:** `CREDITS` em `story.js` cita as vozes Kokoro e as fontes; se a voz mudar, atualize.
- **Letras com acento:** as fontes são o recorte latino do Google Fonts. Se aparecer um quadrado no lugar de uma letra, avise o usuário em vez de trocar a fonte.
- **Modos especiais:** o `main.js` só lê `?t=` (mostra o segundo pedido; padrão 10,5). Não há `?nosub` nem quadros fixos.
