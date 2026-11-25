# Croqui urbano com aquarela

**Slug:** `urban-sketch` · **Categoria:** Pintura e ilustração · **Filme de exemplo:** 33,4 s, 1920×1080

## O visual

Um caderno de croqui: papel de aquarela creme `#f5eede` com grão, e um parque inteiro desenhado só a caneta, em tinta sépia `#2b2520`. O traço treme de leve o tempo todo (o desenho é refeito 12 vezes por segundo). A cor não está lá desde o começo: a aguada de aquarela vai chegando aos poucos, só por onde o chapéu de palha passa.

No exemplo, uma moça está sentada no parque com um rapaz ao lado. O vento entra desenhado em linhas de caneta, arranca o chapéu dela e o leva pelo parque. O rapaz corre atrás, o chapéu passa pelo poste e pelas copas das árvores (cada uma ganha cor numa batida), sobe ao céu, para lá em cima, despenca e é apanhado num mergulho perto do lago. Ciclistas, corredor e gente de piquenique ficam só no traço até a cor chegar neles. No fim, a câmera abre para o parque inteiro e o título é escrito à mão.

Não há legenda nem narração. O único texto é escrito à mão no papel: uma anotação no começo e o título com os créditos no fim.

## Quando usar

**Bom para:**
- cidade, viagem e passeios;
- arquitetura e lugares (praça, parque, rua);
- marcas de estilo de vida com tom leve;
- histórias curtas sem fala, contadas por um objeto que atravessa a cena.

**Evite para:** muito texto, dados e números, explicações passo a passo ou temas que pedem cor forte desde o primeiro segundo.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 33,4 s (`DUR = 33.4` em `film.js`; 150 BPM em compasso de três tempos, `BAR = BEAT * 3`) |
| Formato | só horizontal, 1920×1080 (canvas fixo em `index.html`; o parque mede 5120×2880 em `world.js` e a câmera passeia por ele) |
| Prévia ao vivo | ~22 fps (pesado, 15–22 fps): a prévia pode engasgar, mas o render final não é afetado |
| Fontes (OFL) | Caveat (título e créditos), Reenie Beanie (anotação do começo) |
| Cores | papel `#f5eede`, tinta `#2b2520` (`PAPER` e `INK` em `engine.js`); cores do parque em `C` (`world.js`), das pessoas em `LOOK` (`poses.js`) |
| Som | o código gera só a imagem; a trilha e os efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Anotação do começo | `film.js` | `NOTE` ("Sun. 3:40 pm — windy") |
| Título e créditos finais | `film.js` | função `notes()` |
| Caminho do chapéu | `film.js` | `hatPath` (segundo e posição x, y no parque) |
| Por onde a cor chega | `film.js` | lista `src` (ponto, momento e raio de cada mancha de cor) |
| A moça e o rapaz | `film.js` | `HER`, `HIM0`, `herPose()` e `him()` |
| Figurantes | `film.js` | `extras` (ciclistas, corredor, pedestres, piquenique) |
| Roupa, pele e cabelo | `poses.js` | `LOOK` |
| Poses | `poses.js` | `sit`, `run`, `walk`, `stand`, `cycle`, `dive`, `prone`, `wave` |
| O parque | `world.js` | `buildWorld()`, com `PATH`, `LAMP`, `BRIDGE` e `CROWNS` |
| Movimento de câmera | `film.js` | função `camera(t)` |
| Texto para o arquivo .srt | `subs.json` | só serve ao `build.sh`; a página não lê este arquivo |

## Como adaptar

1. **Comece pelo texto.** Troque `NOTE` e as frases de `notes()`. São só três ou quatro linhas, escritas à mão; frases longas passam da área do papel.
2. **Mude o percurso.** O filme inteiro gira em torno de `hatPath`. Se mudar o caminho do objeto, revise junto a lista `src` (a cor segue o objeto), `camera(t)` (a câmera segue o objeto por uma mola) e os tempos de `herPose()` e `him()`.
3. **Pessoas:** troque cores em `LOOK` e posições em `extras`. O desenho das figuras é código (`figure()` em `engine.js`); trocar roupa e cor é fácil, trocar o tipo de corpo é trabalho de desenho.
4. **Lugar novo:** o parque é código em `world.js`. Para outro cenário, reescreva `buildWorld()` mantendo o mesmo jeito de desenhar (traço de caneta mais aguada).
5. **Confira os quadros** em vários segundos (abertura, chapéu voando, céu, mergulho, final) antes de renderizar.

## O que não mexer

- `engine.js`: é o motor do traço de caneta (`penStroke()`, `drawPen()`), da aguada e do grão do papel.
- `arrivalField()` e `compositor()`: é o que faz a cor chegar aos poucos sobre o desenho a caneta.
- O tremor do traço (`boilOf()`, 12 vezes por segundo): faz parte do estilo.

## Atenção

- **Assinaturas do exemplo:** os créditos finais em `notes()` escrevem "Urban Sketch · Pen & Wash — a Lemo-Opuscar style" e "LemoLab × Claude Opus 5.5". Troque pela marca do usuário ou apague.
- **Crédito de música na tela:** a terceira linha dos créditos fala da trilha original tocada com amostras CC0 (VSCO 2 CE, VCSL, Karoryfer). CC0 não exige crédito, e essa trilha não vem junto. Se o vídeo usar outro som, troque ou apague a linha.
- **Texto em inglês:** a anotação e o título estão em inglês. Traduza para pt-BR.
- **Letras com acento:** Caveat e Reenie Beanie têm ç, ã, õ, á, é, í, ó, ú, â, ê, ô e à.
- **Modos especiais:** `?full=1` mostra tudo colorido desde o início. `?look=1` mostra o parque parado (aceita `&cx=`, `&cy=` e `&z=`). `?sheet=1` abre a folha de personagens (`&close=1` mostra o casal de perto). `?api=1` mostra um exemplo mínimo do motor.
