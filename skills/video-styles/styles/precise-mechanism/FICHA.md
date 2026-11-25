# Mecanismo em cores

**Slug:** `precise-mechanism` · **Categoria:** Diagramas de linha · **Filme de exemplo:** 52 s, 1920×1080

## O visual

Uma prancha de anatomia de máquina, em 3D, sobre papel claro `#F3F0EA`. Tudo é neutro (`#DDD8CF`) até ser explicado; aí cada sistema ganha uma cor só sua: amarelo `#E6B94F` para a energia, verde `#79B09F` para a transmissão, lilás `#8A97D4` para o regulador. Um vermelho `#E8472A` marca a peça que está sendo explicada. A luz é de desenho, em dois tons suaves, sem reflexo nem sombra projetada, e cada peça tem contorno num tom mais escuro da própria cor.

No exemplo, um relógio de bolso sem bateria faz tique-taque. O mostrador é cortado em fatia e o mecanismo aparece. A cor se espalha peça por peça, na ordem em que a energia passa: mola, engrenagens, escape e balanço. A câmera segue a força pelas engrenagens, mostra a relação de 4.800 vezes, separa os sistemas em camadas no ar, deixa as engrenagens dispararem soltas, encaixa o escape de volta e mostra um tique em câmera lenta (1/40). Fecha com o relógio inteiro e um carimbo de desenho técnico com título e autoria.

Os textos na tela são de prancha técnica: linha de figura no alto ("Fig. 1 · …"), uma frase grande por vez, rótulos com linha de chamada saindo da peça e números em fonte mono. A legenda fica embaixo, à esquerda, em duas linhas: chinês em cima, inglês embaixo.

## Quando usar

**Bom para:**
- explicar como uma máquina funciona;
- produtos e engenharia "por dentro";
- ensino de ciências com partes que trabalham juntas;
- mostrar dois a quatro sistemas, um de cada vez.

**Evite para:** pessoas, emoção, temas sem peças físicas, ou produtos que não dá para modelar em código.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 52 s (`FULL = 52.0` em `timeline.js`; 150 BPM) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `film.js` e no `index.html`) |
| Prévia ao vivo | ~16 fps (pesado, 15–22 fps): a prévia pode engasgar, mas o render final não é afetado |
| Fontes (OFL) | Inter (textos e legenda em inglês), Noto Sans SC (legenda em chinês), IBM Plex Mono (números e etiquetas) |
| Cores | `PAL` em `film.js`: papel `#F3F0EA`, neutro `#DDD8CF`, tinta `#25282D`, energia `#E6B94F`, transmissão `#79B09F`, regulador `#8A97D4`, destaque `#E8472A` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas e legenda | `timeline.js` | `VO` (`id`, segundo `t`, `en`, `zh`) |
| Texto para gerar a voz | `voice/lines.json` | `text` de cada fala (`v01`…`v11`) |
| Duração de cada fala | `voice/dur.json` | segundos por fala; controla quanto tempo a legenda fica |
| Planos | `timeline.js` | `SHOTS` |
| Momentos-chave (corte, cor, explosão, tique, crédito) | `timeline.js` | `CUE` |
| Ordem e tempo da cor | `timeline.js` | `DYE` |
| Velocidade do relógio | `timeline.js` | `SPEED` |
| Altura das camadas na explosão | `timeline.js` | `LAYER` e `LIFT_ORDER` |
| Linha de figura ("Fig. 1 · …") | `film-overlay.js` | `KICK` |
| Frases grandes e o "4,800×" | `film-overlay.js` | `HEAD` |
| Rótulos das peças | `film-overlay.js` | `LABELS` (`name`, `sub`) |
| Etiquetas de velocidade | `film-overlay.js` | `TAGS` |
| Carimbo final | `film-overlay.js` | `TB_ROWS` (Title, Style, Drawn by) |
| Câmera | `film.js` | `CAMS` (três grupos de chaves) e `camAt()` |
| Peças e engrenagens | `film.js`, `gears.js`, `physics.js` | geometria em código; `TRAIN` e `solve()` calculam as relações |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `VO` e em `voice/lines.json` (os dois precisam bater). Para pt-BR, ponha o português num dos campos (`zh` ou `en`) e apague ou troque o outro.
2. **Ajuste o tempo das falas.** Com a voz pronta, atualize `voice/dur.json` e, se preciso, os segundos `t` em `VO`. A legenda fica pelo menos 1,8 s e some antes da próxima fala.
3. **Traduza os textos da prancha** em `film-overlay.js`: `KICK`, `HEAD`, `LABELS`, `TAGS` e `TB_ROWS`. Mantenha frases curtas; os rótulos têm pouco espaço.
4. **Outro mecanismo exige modelo novo.** O relógio é todo código (`film.js`, `gears.js`, `physics.js`), e as engrenagens giram pela relação real de dentes. Trocar cores e textos é fácil; trocar a máquina é trabalho de modelagem.
5. **Confira os quadros** em vários segundos (mostrador, corte, cor se espalhando, 4.800×, explosão, tique lento, carimbo) antes de renderizar. `?from=a&to=b` mostra só um trecho.

## O que não mexer

- O material de luz em dois tons e a frente de cor que avança pela peça (shader em `film.js`).
- `film-outline.js`: faz os contornos na cor de cada peça.
- A regra de uma cor por sistema e um só destaque vermelho: é o que faz o estilo ser lido.

## Atenção

- **Assinaturas do exemplo:** o carimbo final (`TB_ROWS` em `film-overlay.js`) escreve "Drawn by LemoLab × Claude Opus 5.5" e o nome do estilo em chinês, 分色机械图解. Troque pela marca do usuário ou apague.
- **Texto em chinês fixo:** a linha `zh` de cada fala em `VO` (`timeline.js`) e o nome do estilo no carimbo. O resto dos textos da tela está em inglês, em `film-overlay.js`.
- **Legenda não quebra linha:** a legenda usa `white-space: nowrap` (`film.css`). Frase longa passa da borda da tela; divida em falas menores.
- **Letras com acento:** Inter, Noto Sans SC e IBM Plex Mono têm ç, ã, õ, á, é, í, ó, ú, â, ê, ô e à.
- **Modos especiais:** `?nosubs` tira a legenda. `?from=a&to=b` renderiza só esse trecho. `?f=1`, `2` ou `3` abrem quadros de referência (`main.js`): visão geral com legenda de cores, vista explodida por sistema e uma demonstração com `?s=` (corda de 0 a 1).
