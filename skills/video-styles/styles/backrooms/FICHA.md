# Found footage liminar

**Slug:** `backrooms` · **Categoria:** Filme e fita · **Filme de exemplo:** 59,7 s, 1920×1080 (imagem 4:3 com faixas pretas nas laterais)

## O visual

Uma gravação de câmera caseira dos anos 90, achada numa fita VHS. A cena é um escritório 3D vazio e sem fim: papel de parede amarelo `#D5BD66` com listras, carpete mostarda `#8C763C`, forro de placas `#D9D3B8` e luminárias fluorescentes. Quem filma anda pelos corredores em primeira pessoa; dá para ver os próprios pés quando olha para baixo.

A imagem tem tudo o que uma fita velha tem: foco automático que "procura", cor borrada, tremida de tracking, rasgo de fita e o mostrador da câmera em letras de pontinhos (REC, bateria, relógio, data `SEP.27.1996` e o título no começo).

No exemplo, um alto-falante lê as regras do turno da noite enquanto o funcionário novo anda pelo andar. As luzes piscam três vezes, uma figura alta aparece no fim do corredor, o relógio pula três horas e uma placa EXIT surge onde não deveria.

A legenda imita o closed caption das fitas antigas: letra branca de máquina em blocos pretos, até 32 caracteres por linha, com `[PA]` para o alto-falante, itálico para os sussurros e sons entre colchetes, como `[LIGHTS FLICKER]`.

## Quando usar

**Bom para:**
- terror e suspense lento;
- mistério, jogos de realidade alternativa (ARG) e teasers de jogo;
- "regras" estranhas, avisos e treinamentos com um toque inquietante.

**Evite para:** marcas que pedem clareza e alegria, explicações com dados, ou qualquer texto longo na tela. A imagem é escura, tremida e de baixa resolução de propósito.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 59,7 s (`DUR = W(61.0)` em `story.js`; os trechos de caminhada são comprimidos por `WARP`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `main.js`); a cena é renderizada em 720×540 (4:3) e ampliada com faixas pretas nas laterais |
| Prévia ao vivo | ~57 fps (leve); usa three.js e WebGL |
| Fontes (OFL) | IBM Plex Sans, IBM Plex Sans Condensed e IBM Plex Mono (legenda e avisos); o mostrador da câmera é uma fonte de pontinhos 5×7 desenhada em `osd.js` |
| Cores | papel de parede `#D5BD66`, carpete `#8C763C`, forro `#D9D3B8`, placa EXIT `#FF2A1A` |
| Som | o código gera só a imagem; narração, música de espera e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas (alto-falante `p…` e quem filma `w…`) | `lines.json` | campo `text` de cada fala |
| Duração de cada fala | `voices/dur.json` | segundos por fala |
| Legenda | `subs.js` | lista `C` dentro de `buildCaps()`; o texto está escrito à mão aqui, separado do `lines.json` |
| Quando cada coisa acontece | `story.js` | `T0` (falas, piscadas, rasgo da fita, zoom, porta, cartão final) |
| Caminho e olhar da câmera | `story.js` | `POS`, `YAW`, `PITCH`, `FOV`, `FOCUS` |
| Regras do aviso na parede | `tex.js` | `RULES` e a função `notice()` (cabeçalho, título, rodapé) |
| Placa de saída | `tex.js` | `exitSign()` |
| Título e data no mostrador | `main.js` | `title: ['NIGHT SHIFT', 'ORIENTATION']` e `date: 'SEP.27.1996'` |
| Cartão final | `main.js` | `endCard()` |
| O escritório | `world.js` | `buildWorld()` e `buildProps()` |
| A figura no corredor | `figures.js` e `thing2d.js` | `makeThing()` e `drawThing()` |

## Como adaptar

1. **Troque as falas** em `lines.json` e repita o mesmo texto na legenda em `subs.js`. Os dois não estão ligados: se mudar um, mude o outro.
2. **Ajuste o tempo.** Atualize `voices/dur.json` e, se a fala ficar mais longa, empurre os momentos seguintes em `T0`. Os tempos de `T0` são "tempo original" e passam por `W()` antes de virar tempo do filme.
3. **Reescreva o aviso da parede** em `RULES` e os textos fixos de `notice()`. Ele é lido de perto pela câmera, então frases curtas funcionam melhor.
4. **Título e data do mostrador:** use só letras sem acento, números e `: . - / ( )`. A fonte de pontinhos de `osd.js` não tem outros caracteres.
5. **Confira os quadros** em vários segundos (título, primeira piscada, figura, rasgo da fita, porta) antes de renderizar.

## O que não mexer

- `vhs.js`: é o shader da fita (cor borrada, ruído, tracking).
- O foco automático e a profundidade de campo em `main.js`: fazem a figura aparecer só por um instante.
- A compressão de tempo `WARP` em `story.js`, a menos que mude a duração do filme inteiro.

## Atenção

- **Depende de arquivos fora da pasta:** `main.js` importa `three` (pasta `node_modules`) e `/core/three/post.js` e `/core/lib.js` da skill. A prévia precisa ser servida a partir da raiz da skill.
- **Legenda duplicada:** o texto da legenda está escrito à mão em `subs.js`. Trocar só o `lines.json` deixa a legenda antiga na tela.
- **Assinaturas do exemplo:** o cartão final escreve "NIGHT SHIFT ORIENTATION", "LIMINAL FOUND FOOTAGE" e "LemoLab × Claude Opus 5.5" (`endCard()` em `main.js`). O aviso da parede traz "FORM NS-01 (REV. 9)" e assina "Management". Troque pela marca do usuário ou apague.
- **A figura e o espaço são desenhados em código:** dá para mudar cores, textos dos avisos e a posição da figura com facilidade. Mudar o formato do escritório ou da figura exige mexer em `world.js`, `figures.js` e `thing2d.js`.
- **Letras com acento:** a legenda e os avisos usam IBM Plex. Se aparecer um quadrado no lugar de uma letra, a fonte não tem aquele caractere; avise o usuário em vez de trocar a fonte.
- **Modos especiais:** `?nosub` tira a legenda. `?raw` desliga quase todo o efeito de fita. `?sheet` abre a folha de desenho da figura (`sheet.js`).
