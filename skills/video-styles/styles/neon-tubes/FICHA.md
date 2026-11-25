# Tubos de neon

**Slug:** `neon-tubes` · **Categoria:** Luz e linhas · **Filme de exemplo:** 48 s, 1920×1080

## O visual

Uma rua à noite, molhada de chuva, com fachadas escuras e letreiros de neon de verdade: cada tubo é um cilindro de vidro com a cor do gás, brilho em volta, reflexo na parede e nas poças. Os letreiros ligam como neon real (dois clarões e depois a luz sobe) e os que estão falhando piscam. As letras não são fonte: são tubos dobrados à mão, um por traço.

O personagem é um gato de neon que se move como letreiro animado: cada pose é um tubo diferente, trocado no tempo da batida, sem quadros intermediários. No exemplo, o gato mora no letreiro do café (uma taça com água) e vai até o letreiro do peixinho dourado no fim da rua, racha o aquário, a água escorre e o peixe começa a apagar. Ele leva o peixe pela chuva até a taça de casa, onde o peixe volta a acender. Depois os letreiros da rua desligam um por um, o gato dorme e entra o cartão final.

Não há legenda nem narração.

## Quando usar

**Bom para:**
- inauguração de loja, bar ou restaurante, com mascote;
- clipes de vida noturna e música;
- vinhetas de cidade e de festival à noite;
- histórias curtas e mudas com um personagem simples.

**Evite para:** muito texto, legenda longa, dados, temas diurnos ou qualquer letreiro com letras que o estilo não tem (veja "Atenção").

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 48 s (`DUR = 48.0` em `film.js`; 120 BPM, `BEAT = 0.5`) |
| Formato | segue o tamanho da janela (`W = innerWidth`, `H = innerHeight` em `film.js`, escala pela largura); os enquadramentos foram feitos para 16:9 e não há modo vertical |
| Prévia ao vivo | ~22 fps (pesado, 15–22 fps): a prévia pode engasgar, mas o render final não é afetado |
| Fontes (OFL) | Barlow Condensed Bold e Noto Sans SC recortada, só no cartão final; os letreiros não usam fonte |
| Cores | fundo preto; cor de cada gás em `GAS` (`world.js`, valores RGB de 0 a 1): `neon` vermelho-laranja, `argon` azul, `green`, `white`, `pink`, `purple`, `turq`, `yellow` |
| Som | o código gera só a imagem; o filme não tem narração e a trilha do exemplo não vem junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Letreiros da rua | `world.js` | `buildStreet()`: cada letreiro chama `hanzi()` e `latin()` com o texto, o gás e a placa de fundo (`backer`) |
| Desenho das letras de neon | `glyphs.json` | `han` (10 hanzi) e `lat` (18 letras maiúsculas) |
| Gato e peixe | `art.json` | contorno de cada pose (gerado por `tools/art.py`) |
| Quando cada coisa acontece | `film.js` | `T` (segundos de cada momento da história) |
| Quando cada letreiro liga e desliga | `film.js` | `ON` (circuito, hora de ligar, hora de desligar) e `T.offs` |
| Movimento de câmera | `film.js` | `SHOTS` (planos com chaves de posição e zoom) |
| Cartão final | `film.js` | `CARD` |
| Cores dos gases | `world.js` | `GAS` |
| Posição dos letreiros na rua | `film.js` | `SIGN_X` |

## Como adaptar

1. **Comece pelos letreiros.** Troque os textos em `buildStreet()`. Use só letras que existem em `glyphs.json` (veja "Atenção"). Nomes curtos e em maiúsculas funcionam melhor.
2. **Cartão final:** troque as linhas de `CARD`. A fonte do cartão só tem maiúsculas, números e seis hanzi.
3. **História nova:** o gato e o peixe são poses fixas em `art.json`. Trocar o enredo mexe em `T`, `ON` e `SHOTS` ao mesmo tempo. Trocar o personagem exige desenhar poses novas.
4. **Cores:** mude o gás de cada letreiro (`'pink'`, `'turq'` etc.) em `buildStreet()`, ou ajuste `GAS`.
5. **Confira os quadros** em vários segundos (primeiro acendimento, aquário rachando, chuva, letreiros apagando, cartão) antes de renderizar.

## O que não mexer

- `gl.js`: é o que faz o vidro dos tubos, o brilho na fachada, a rua molhada, as poças e a chuva.
- `strike()` e `offAt()` em `film.js`: o jeito de o neon ligar e desligar.
- A troca seca de pose do gato, sem quadros no meio: faz parte do estilo.

## Atenção

- **Letras de neon limitadas (importante):** os letreiros só têm as maiúsculas A B C D E F G H I K L M O P R S T Y e os hanzi 金 鱼 冰 室 旅 馆 歌 厅 药 房. Não existem J, N, Q, U, V, W, X, Z, minúsculas, números nem letras com acento. Se um texto pedir uma letra que falta, `latin()` em `lib.js` para com erro ("no letter") e o filme não abre. Para escrever outra palavra, é preciso desenhar o tubo da letra nova em `glyphs.json` (há ferramentas em `tools/glyphs_build.py` e `tools/glyph_check.py`).
- **Texto em chinês fixo:** os hanzi dos letreiros (药房, 冰室, 旅馆, 歌厅, 金鱼) estão em `buildStreet()` de `world.js`, ao lado dos nomes em inglês (PHARMACY, ICE CAFE, HOTEL, KARAOKE, GOLDFISH). O cartão final tem 夜宵 e 霓虹灯管 em `CARD`.
- **Fonte do cartão sem acento:** a Noto Sans SC recortada só tem maiúsculas, números, alguns sinais e os seis hanzi do cartão. Letras com acento e minúsculas caem numa fonte reserva do navegador. A Barlow Condensed tem todos os acentos.
- **Assinaturas do exemplo:** o cartão final escreve "LemoLab × Claude Opus 5.5". As lojas, a rua, o gato e o peixe são inventados. Troque pela marca do usuário ou apague.
- **Sem modos especiais:** o `film.js` não lê nenhum parâmetro de URL.
