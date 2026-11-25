# Desenho dos anos 50

**Slug:** `midcentury-toon` · **Categoria:** Desenhos animados · **Filme de exemplo:** 40 s, 1920×1080

## O visual

Um desenho animado chapado no jeito dos filmes educativos dos anos 1950. Fundo de papel creme `#F4EAD5`, contorno marrom-escuro `#2B2420` com falhas de tinta, e cores de época: mostarda `#E8B43A`, coral `#E4613F`, verde-água `#3FA7A0`, azul `#7F9CC0`. A animação anda "de dois em dois" quadros, como desenho feito à mão.

O filme de exemplo apresenta o Pip, um robô aspirador, e ensina a configurá-lo em três passos:
- abertura com a personagem June apresentando o produto, que sai da caixa sobre um fundo de raios;
- um trecho por passo: plano geral de June fazendo a ação e um círculo de detalhe onde as mãos fazem o gesto na batida;
- planta da casa vista de cima, com o Pip percorrendo os cômodos;
- cartão de dica;
- fechamento com a frase final e o cartão de créditos.

A passagem entre os passos é uma íris que abre a partir do medalhão numerado. A legenda é uma plaquinha de papel com duas estrelinhas, embaixo da tela.

## Quando usar

**Bom para:**
- guias de configuração e primeiros passos de um produto;
- central de ajuda e tutoriais curtos ("faça isto em 3 passos");
- humor leve e nostálgico.

**Evite para:** temas sérios ou tristes, assuntos que pedem foto ou dados, ou passos longos. Cada passo comporta um título curto e um detalhe de uma linha.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 40 s (132 BPM; a linha do tempo é recalculada a partir do número de passos e da duração das falas, em `setup()` de `film.js`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `film.js`; canvas fixo em `index.html`) |
| Prévia ao vivo | ~57 fps (leve) |
| Fontes (OFL) | Oleo Script (títulos), Alfa Slab One (números e rótulos), Jost (texto e legenda) |
| Cores | papel `#F4EAD5`, tinta `#2B2420`, produto `#3FA7A0`, destaque `#E4613F`; tudo em `palette` no `content.json` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

Quase tudo o que se lê na tela vem de um arquivo só: `content.json`.

| O que mudar | Arquivo | Onde |
|---|---|---|
| Nome e tipo do produto | `content.json` | `product`, `kind`, `title`, `subtitle` |
| Abertura | `content.json` | `hook.kicker` (texto grande) e `hook.line` (fala) |
| Passos | `content.json` | lista `steps`: `title`, `detail`, `icon`, `action`, `line` e, opcional, `measure` |
| Planta da casa | `content.json` | `payoff.caption` e `payoff.plan` (cômodos em `zones`, tapete em `rug`, móveis em `items`) |
| Dica | `content.json` | `tip.label`, `tip.text`, `tip.icon`, `tip.line` |
| Frase final e chamada | `content.json` | `outro.line` e `outro.cta` |
| Cores | `content.json` | `palette` |
| Cartão final | `content.json` | `film.name`, `film.style`, `film.credits` |
| Falas da narração | `lines.json` | gerado a partir do `content.json` por `tools/lines.py` |
| Duração de cada fala | `voices/dur.json` | segundos por fala; alonga os passos quando a fala é longa |
| Ícones disponíveis | `engine/icons.js` | `ICONS`: dock, phone, start, cable, wifi, plug, water, beans, cup, filter, box, clock, check, leaf, key, bulb, spark, gear |
| Gesto de cada passo | `film.js` | `action`: `place`, `tap`, `press`; qualquer outro valor cai em `actShow` (ícone grande e a mão tocando) |

## Como adaptar

1. **Edite o `content.json`.** Troque produto, passos, dica e frase final. Escreva em pt-BR com acentos. O `content_alt.json` é um segundo exemplo pronto (o robô cortador de grama "Mo", com 4 passos) e mostra que o número de passos pode mudar.
2. **Teste outro conteúdo sem apagar o original:** abra a página com `?content=content_alt.json` (ou o nome do seu arquivo).
3. **Gere as falas** com `tools/lines.py` e atualize `voices/dur.json` com a duração real de cada fala. Os passos crescem sozinhos para caber a fala.
4. **Escolha ícones e gestos** da lista acima. Com 4 passos ou mais, os medalhões ficam menores; textos longos encolhem a letra.
5. **Planta da casa:** ajuste nomes e larguras dos cômodos em `zones` e a posição dos móveis em `items` (formas `sofa`, `boomerang`, `plant`, `table`).

## O que não mexer

- `engine/toon.js`: contorno com falhas, sombra deslocada, textura de papel e o movimento "de dois em dois".
- A íris entre os passos e a grade de 132 BPM em `film.js`: o ritmo do estilo depende dela.

## Atenção

- **Personagens desenhados em código:** June (a pessoa) e o Pip (o robô redondo) estão em `engine/chars.js`. Trocar nome, cores e textos é fácil; trocar o produto por um objeto de outro formato (por exemplo, uma cafeteira) exige redesenhar `drawPip()` e `drawDock()`.
- **Assinaturas do exemplo:** o cartão final escreve "Lemo-Opuscar" e "LemoLab × Claude Opus 5.5" direto no código (`sceneEnd()` em `film.js`). Troque pela marca do usuário ou apague.
- **Crédito obrigatório da trilha original:** a bateria "MuldjordKit" (Lars Muldjord) é CC BY 4.0, por isso o crédito está em `film.credits`. Se o usuário não usar essa trilha, ajuste o texto.
- **Letras com acento:** as fontes vêm em `fonts/`. Se aparecer um quadrado no lugar de uma letra, a fonte não tem aquele caractere; avise o usuário em vez de trocar a fonte.
- **Modos especiais:** `?nosubs` tira a legenda. `?test=sheet` mostra a folha de modelo dos personagens (`sheet.js`).
