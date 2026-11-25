# Cena isométrica com pessoas

**Slug:** `isometric-picture-book` · **Categoria:** Desenhos animados · **Filme de exemplo:** 59,8 s, 1920×1080

## O visual

Um livro ilustrado em perspectiva isométrica: tudo visto de cima e de lado, sem ponto de fuga. Cores de papel e tons suaves: fundo creme (`#F1E8D8`), traço quase preto (`#2A2E29`), um laranja-tijolo de destaque (`#D0573A`), verde (`#3D6B59`) e mostarda (`#E2AE3A`). As pessoas são bonequinhos simples, com blusas em quatro cores apagadas, que andam, param, guardam malas e sentam.

O exemplo explica um estudo sobre embarque de avião: o pátio, o portão B12, a ponte de embarque e uma cabine de 12 fileiras cujo teto abre como uma aba de papel. Os 72 passageiros embarcam primeiro na ordem comum e depois numa ordem nova, mais rápida.

Elementos fixos:
- um mundo só, montado uma vez, e a câmera que passeia por ele (`camAt()`);
- palavras-chave e números escritos **no chão** da cena, em perspectiva, letra por letra (`floorType()`);
- placas, telas e marcações no próprio cenário (portão, filas, assentos numerados);
- barras de tempo para comparar dois resultados.

A legenda é uma caixa clara arredondada, centralizada no pé da tela, com duas linhas: chinês em cima e inglês embaixo.

## Quando usar

**Bom para:**
- explicar regras do dia a dia, filas e processos com muitas pessoas;
- comparar dois jeitos de fazer a mesma coisa ("antes e depois");
- mostrar um dado de pesquisa de um jeito leve e visual.

**Evite para:** close de rosto e emoção, temas sem um lugar físico para montar, ou textos longos na tela. As palavras no chão precisam ser poucas e curtas.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 59,8 s (`DUR` em `film.js`, calculado a partir das falas) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `kit.js`; o canvas só é esticado para caber na janela) |
| Prévia ao vivo | ~66 fps (leve) |
| Fontes (OFL) | Noto Serif SC (chinês e palavras grandes no chão), Newsreader (números, inglês e legenda em inglês) |
| Cores | fundo `#F1E8D8`, traço `#2A2E29`, destaque `#D0573A`, verde `#3D6B59`, mostarda `#E2AE3A` (paleta `C` em `kit.js`); blusas em `TOPS` |
| Som | o código gera só a imagem; narração, trilha e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Texto da legenda | `film.js` | `VO_TEXT` (um par `[chinês, inglês]` por fala) |
| Duração de cada fala | `film.js` | `VO_DUR` (segundos); a duração de cada plano sai daqui |
| Texto mandado para a voz | `lines.json` e `lines_en.json` | campo `text` (e `say`, quando a pronúncia precisa de ajuda) |
| Planos e quando cada fala entra | `film.js` | bloco que monta `S` e `VO` (um plano por fala) |
| Palavras no chão | `film.js` | `PH` (`lines` com o texto e o estilo de cada pedaço, `t0`, `t1`, posição) |
| Estilos das palavras no chão | `kit.js` | `SZ` (`A` e `B` grandes, `s` pequeno, `n` números, `en` e `e` em letra latina) |
| Ordem de embarque e passageiros | `film.js` | `WAVES`, `ORDER2` e `PAX` |
| Portão, filas, placas e telas | `places.js` | `LANES` (rótulos das filas), "B12", "GATE", "登机口", `COUNTER_SCREEN` |
| Avião e cabine | `plane.js` | `PL`, `cabinBack()`, `cabinFront()`, `lid()` |
| Pessoas | `kit.js` | `drawPerson()`, `drawSeated()`; cores em `TOPS` e `LEGS` |
| Câmera | `film.js` | `camAt()` |
| Cartão final | `film.js` | `PH.end` e `PH.endcr` |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `VO_TEXT`. A legenda sempre mostra duas linhas: para um vídeo só em pt-BR, ponha o português numa delas e deixe a outra vazia. Escreva com acentos, frases de uma linha (a legenda não quebra linha).
2. **Atualize as durações.** Meça a nova narração e ponha os segundos em `VO_DUR`. Os planos crescem ou encolhem sozinhos, porque cada plano dura a sua fala mais uma pausa.
3. **Palavras no chão.** Troque o texto em `PH`. Para português, use os estilos que vão em Newsreader (`n`, `na`, `ns`, `nsa`, `e`, `en`), que têm acentos. Os estilos `A`, `B` e `s` usam a Noto Serif SC recortada, sem acentos (veja abaixo).
4. **Pessoas e cores** mudam fácil: `TOPS`, `LEGS` e a paleta `C`. O jeito de andar e sentar está em `drawPerson()` e `drawSeated()`.
5. **Outro lugar:** o mundo é código. Trocar placas, números e cores é rápido. Um lugar diferente de um avião (uma loja, uma fila de banco, uma escola) exige construir o cenário de novo com as caixas e planos de `engine.js` e reescrever a coreografia das pessoas em `film.js`.

## O que não mexer

- `engine.js`: o motor isométrico (caixas, planos, ordem de desenho e câmera).
- O princípio de "um mundo só": a câmera se move dentro do mesmo cenário em vez de trocar de desenho.
- A troca seca de legenda, uma de cada vez, sem esmaecer (`subtitles()` em `kit.js`).

## Atenção

- **Dados reais:** os números do exemplo (6:54, 3:36, 72 passageiros, 2012) vêm de um estudo real, Steffen & Hotchkiss (2012), *Journal of Air Transport Management*, citado no `CREDITS`. Num vídeo novo, troque pelos dados do usuário e cite a fonte deles.
- **Crédito obrigatório no cartão final:** `PH.endcr` escreve "Piano samples: Salamander Grand Piano V3 by Alexander Holm, CC BY 3.0". Essa licença pede crédito, mas só vale se a trilha do exemplo for usada, e ela não vem junto. Sem essa trilha, apague a linha.
- **Assinaturas do exemplo:** o cartão final (`PH.end`) mostra "LemoLab × Claude Opus 5.5". Troque pelo nome da marca do usuário ou apague.
- **Fonte recortada:** `NotoSerifSC-sub.ttf` só tem os caracteres do exemplo e **não tem acentos**. A primeira linha da legenda e as palavras grandes no chão (`A`, `B`, `s`) usam essa fonte. Para usar português ali, troque a família para `Newsreader` em `font()` de `kit.js` ou gere a fonte de novo com `tools/subset.py` (precisa do arquivo original da Noto Serif SC, que não vem junto).
- **Voz do exemplo:** pelo `CREDITS`, a narração original foi feita com edge-tts, um serviço online da Microsoft; confira os termos antes de uso comercial.
- **Modos especiais:** `?nosub` tira a legenda. `?notype` tira as palavras escritas no chão.
