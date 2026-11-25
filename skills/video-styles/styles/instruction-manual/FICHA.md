# Arte de manual de instruções

**Slug:** `instruction-manual` · **Categoria:** Diagramas de linha · **Filme de exemplo:** 50,6 s, 1920×1080

## O visual

Uma folha de manual de montagem, desses de móvel que chega desmontado. Papel creme `#F4F1EA`, traço preto fino `#1E1D1B` de espessura única, peças brancas com três tons chapados de sombra e, em cada passo, a peça nova pintada de amarelo de segurança `#F7D35A`. O desenho é isométrico verdadeiro (45°) e o ângulo nunca muda.

Os dez passos ficam numa página só, em zigue-zague (1→4, depois 8←5, depois 9→10) ligados por uma linha pontilhada. A câmera só desliza, aproxima e corta sobre essa página. Tem tudo o que um manual tem: número grande do passo, caixa de peças com "2×" e "8×", lupa de detalhe, setas de giro, marca de "clique", ✓ e ✗.

No exemplo, duas pessoas que nunca montaram nada montam um berço. Uma delas põe uma ponta de cabeça para baixo no passo 7, as duas riem e refazem. O passo 10 não estava no manual. O título e os créditos aparecem impressos no rodapé da própria página.

A legenda fica no canto de baixo à esquerda, sobre uma faixa da cor do papel, com um traço amarelo ao lado: chinês em cima, inglês embaixo.

## Quando usar

**Bom para:**
- guias de montagem e de configuração;
- instruções de segurança ("nunca levante sozinho");
- onboarding de produto contado passo a passo, com um toque de humor ou de emoção no fim.

**Evite para:** temas sem objeto físico, dados e gráficos, ou muito texto. O manual fala por desenho; as palavras ficam na narração e na legenda.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 50,6 s (`dur` em `timeline.json`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `film.js`). O `index.html` ajusta o canvas ao tamanho da janela, então a janela precisa ter 1920×1080 |
| Prévia ao vivo | ~49 fps (leve) |
| Fontes (OFL) | Inter (números, títulos e inglês), Noto Sans SC 500 (chinês) |
| Cores | papel `#F4F1EA`, traço `#1E1D1B`, peça nova `#F7D35A`, peça pronta `#FFFFFF`/`#ECE8DF`/`#DCD7CC`, vermelho `#D23A2E`, azul `#2C66AC` (`PAL` em `iso.js`) |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas para gerar a voz | `vo/lines.json` | campo `text` de cada fala (`a`…`j`) |
| Legenda e início das falas | `tools/timeline.py` | `SUBS` (inglês e chinês por fala), `PLAN` (segundo planejado de cada fala), `DUR` |
| Linha do tempo pronta | `timeline.json` | gerado por `tools/timeline.py` a partir de `vo/dur.json` e `vo/words.json` |
| Momentos de cada passo | `film.js` | `times()`: alguns presos a palavras da fala, como `click: word('e', 5)` |
| Desenho de cada passo | `film.js` | `step1()` … `step10()` |
| Caixa de peças | `film.js` | `INST`, `partsBoxIcons()` e as contagens "1×", "2×", "8×" |
| Movimento de câmera | `film.js` | `buildKeys()` |
| Título e créditos no rodapé | `film.js` | `footer()` ("Step Ten", "第十步", "Instruction Manual Art", assinatura) |
| O objeto montado | `crib.js` | berço em centímetros (`C`: comprimento, largura, altura, ripas) |
| As pessoas | `rig.js`, `poses.js` | boneco articulado e poses (em pé, ajoelhado, lendo, sentado) |

## Como adaptar

1. **Comece pelo roteiro.** Troque as falas em `vo/lines.json` e as legendas em `SUBS` (`tools/timeline.py`). Mantenha os mesmos `id`.
2. **Gere a voz e rode `tools/timeline.py`.** Ele lê `vo/dur.json` e `vo/words.json` e escreve o `timeline.json`. Vários gestos de `times()` estão presos a palavras exatas da fala (`word('e', 5)`, `word('g', 2)`): confira se a palavra de número indicado ainda é a certa.
3. **Troque título e créditos** em `footer()`.
4. **Outro objeto:** o berço, a caixa e as pessoas são desenhados em código. Mudar cores, contagens de peças e textos é fácil. Trocar o berço por outro móvel ou produto exige redesenhar `crib.js` e os dez `stepN()`, e refazer a câmera em `buildKeys()`.
5. **Confira os quadros** em vários segundos (caixa abrindo, passo 4, lupa do passo 5, erro do passo 7, passo 10, rodapé) antes de renderizar. `shot.mjs` salva um quadro em PNG.

## O que não mexer

- `iso.js`: a projeção isométrica, a linha única e os três tons chapados.
- O amarelo só na peça nova de cada passo: é a regra visual do manual.
- A página única: a câmera nunca troca de ângulo, só desliza e aproxima.

## Atenção

- **Assinaturas do exemplo:** o rodapé escreve "Step Ten", "第十步", "Instruction Manual Art", "说明书插画" e "LemoLab × Claude Opus 5.5" (`footer()` em `film.js`). Troque pela marca do usuário ou apague.
- **Legenda em chinês e inglês:** cada legenda tem uma linha em chinês e uma em inglês. Se o vídeo for só em português, decida com o usuário o que vai em cada linha. A fonte chinesa foi recortada só para os caracteres do exemplo; texto novo em chinês exige rodar `tools/fonts.sh` de novo.
- **Sem modo sem legenda:** o `film.js` sempre desenha a legenda; não há parâmetro de URL para tirá-la.
- **Letras com acento:** se aparecer um quadrado no lugar de uma letra, a fonte não tem aquele caractere; avise o usuário em vez de trocar a fonte.
- **Modos especiais:** `?f=figs` mostra a folha das pessoas girando; `?f=hands` mostra as mãos de perto.
