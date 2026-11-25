# HUD holográfico sci-fi

**Slug:** `hologram-hud` · **Categoria:** Telas e interfaces · **Filme de exemplo:** 39 s, 1920×1080

## O visual

Fundo quase preto com um brilho suave no centro e uma grade de pontos ao longe. No meio, um produto em aramado holográfico ciano (matiz 188) é escaneado por um plano de luz e ganha volume. Caixas de mira travam em cada peça, cartões com número grande sobem ao lado, e um detalhe laranja (matiz 38) marca o que importa. Tudo em volta parece visor: cantos com coordenadas, contador de quadros, ângulo da câmera.

No exemplo, a bicicleta elétrica fictícia VOLT CE-01 é escaneada e mostra três peças, cada uma com um jeito de câmera: aproximação lenta (bateria), giro em volta (motor) e lupa em detalhe (freios). Depois o holograma fica sólido, gira 360° e fecha numa ficha com peso, preço e chamada.

A legenda fica embaixo, centralizada, sobre uma placa escura translúcida com borda fina na cor do holograma.

## Quando usar

**Bom para:**
- apresentar a ficha técnica de um produto físico;
- vídeos de lançamento e telões de feira;
- mostrar três a cinco números-chave, um por vez.

**Evite para:** pessoas, emoção, histórias com enredo ou produtos sem peças para apontar. O produto precisa existir como modelo 3D em código.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 39 s (`TL.DUR` calculado em `buildTimeline()` de `film.js`; muda com o número de peças) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `film.js`) |
| Prévia ao vivo | ~24 fps (pesado: abaixo de 30 fps, pode engasgar em máquina fraca) |
| Fontes (OFL) | Rajdhani (textos e números), Share Tech Mono (dados do visor) |
| Cores | holograma em matiz `hue: 188` e destaque em `accent: 38` (`content.json`), convertidos em `theme()` de `engine/hud.js` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Nome, código, categoria, frase | `content.json` | `product`, `model_code`, `category`, `tagline` |
| Peças apontadas | `content.json` | `callouts` (`part`, `label`, `value`, `unit`, `detail`, `vo`) |
| Ficha final | `content.json` | `footer` (`weight`, `price`, `cta`) |
| Narração de abertura e fim | `content.json` | `intro_vo` e `outro_vo` |
| Título e créditos do cartão final | `content.json` | `film_title` e `credits` |
| Cores | `content.json` | `hue` e `accent` |
| Modelo 3D | `content.json` → `models/` | `model` aponta para o `.json` gerado por `models/gen_volt.mjs` |
| Falas para a voz | `lines.json` | gerado de `content.json` por `tools/make_lines.mjs` |
| Textos fixos do visor | `film.js` | `statusText()` e o canto `tl` em `U.chrome()` (`SPEC SCAN`, `TARGET`, `RECOMPILING` etc.) |
| Ritmo | `film.js` | `buildTimeline()` (120 BPM, 1 compasso = 2 s) |

## Como adaptar

1. **Comece pelo `content.json`.** Quase todo o texto vem dele. Existe um segundo exemplo pronto, `content_alt.json` (drone KITE M2), que mostra a troca completa; abra com `?content=content_alt.json`.
2. **Gere as falas.** Rode `node tools/make_lines.mjs` para refazer `lines.json` a partir do `content.json`. Os tempos das falas são calculados sozinhos; com a voz pronta, ponha as durações em `voices/dur.json` (o código também aceita `?voices=` para outra pasta).
3. **Número de peças.** Cada peça a mais soma 4 s ao filme (a primeira tem 6 s). O jeito de câmera gira entre aproximação, giro e lupa (`modes` em `buildTimeline()`). A fala de cada peça precisa caber nesse tempo.
4. **Produto novo exige modelo novo.** O aramado é código: copie `models/gen_volt.mjs`, desenhe as peças com `M.part()`, `M.tube()` e `M.box()` de `models/mkmodel.mjs` e gere o `.json`. O nome de cada `M.part()` precisa bater com o `part` de `callouts`. Trocar só textos e cores é fácil; trocar o objeto é trabalho de desenho.
5. **Traduza o visor.** Os textos fixos de `film.js` estão em inglês, e o `part` aparece na tela em maiúsculas (`TARGET 1/3 · BATTERY`). Para pt-BR, traduza esses textos e use nomes de peça em português no modelo e no `content.json`.
6. **Confira os quadros** em vários segundos (abertura, cada peça, 360°, ficha final) antes de renderizar.

## O que não mexer

- `engine/holo.js`: é o motor do holograma (aramado, plano de varredura, brilho).
- `engine/hud.js`: caixas de mira, cartões, letras que rolam (`rollText()`) e a placa da legenda.
- A troca de jeito de câmera a cada peça e o 360° antes da ficha: fazem parte do estilo.

## Atenção

- **Assinaturas do exemplo:** o cartão final escreve "Lemo-Opuscar" e "LemoLab × Claude Opus 5.5" (`endCard()` em `film.js`) e "SCI-FI HOLOGRAM HUD". VOLT e KITE são produtos fictícios, e o preço em euros é inventado. Troque pela marca do usuário ou apague.
- **Peça com giro fixo:** `film.js` gira as peças `motor-rotor` e `motor-stator` quando a peça é `motor`. Em outro produto, esse trecho não faz nada ou precisa ser adaptado.
- **Sem `voices/dur.json` no pacote:** sem ele, a duração das falas é estimada pelo número de palavras.
- **Letras com acento:** se aparecer um quadrado no lugar de uma letra, a fonte não tem aquele caractere; avise o usuário em vez de trocar a fonte.
- **Modos especiais:** `?nosub` tira a legenda. `?content=` troca o arquivo de conteúdo. `?scene=star&t=…` mostra uma cena de teste do motor (`frames.js`).
