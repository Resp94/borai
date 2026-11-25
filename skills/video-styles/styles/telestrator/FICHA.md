# Telestrador esportivo

**Slug:** `telestrator` · **Categoria:** Edição e documentário · **Filme de exemplo:** 54,4 s, 1920×1080

> **Precisa de mídia própria:** a filmagem da partida e as fotos (terceiros) não vêm junto, então a prévia mostra o campo sem imagem. Num filme novo, o material vem do usuário.

## O visual

Um programa de análise de futebol na TV. O filme usa imagens reais da partida e, por cima delas, o analista congela o lance e desenha com caneta de marcador: linhas amarelas fluorescentes `#FFD400` com brilho e seta, anéis em perspectiva no pé do jogador, rastro da bola, espaços vazios em vermelho `#FF3B30` e a defesa em ciano `#3FD8FF`. Entre os trechos passa uma faixa amarela na diagonal, como vinheta de TV.

Elementos fixos do pacote gráfico:
- selo no canto superior direito com o nome do programa e o modo (AO VIVO, ANÁLISE, REPLAY);
- placar no canto inferior direito, que vira no quadro exato de cada gol;
- marcador de tempo no canto superior esquerdo (segundo e número do quadro da filmagem, com ícone de pausa, retrocesso ou câmera lenta);
- legenda em duas linhas numa caixa escura com filete amarelo.

Trechos do exemplo: abertura em quadro-negro verde-escuro `#0C1411`, ficha da partida com linha do tempo de 0′ a 90′, lance ao vivo, retrocesso com listras de fita, congelamentos com desenho, tela dividida com duas câmeras, mapa de chutes visto de cima (o próprio quadro da filmagem é "achatado" em perspectiva até virar prancheta), cartão de números e cartão final.

## Quando usar

**Bom para:**
- destrinchar um lance, um gol ou uma jogada ensaiada;
- resumo de partida com números contados no próprio vídeo (tempo de reação, distância do chute);
- treino e análise tática para atletas e técnicos;
- qualquer explicação que pede "congela aqui e olha isto" sobre uma filmagem real.

**Evite para:** temas sem filmagem própria ou liberada, assuntos que não são esporte e não cabem na linguagem de programa de TV, ou quem não tem tempo de marcar posições quadro a quadro. Este estilo depende de vídeo de verdade e de trabalho manual de rastreamento.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 54,4 s (`dur` em `timeline.json`; a página copia para `window.DUR`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `index.html`; as filmagens são esticadas para 1920×1080) |
| Prévia ao vivo | ~99 fps (leve) |
| Fontes (OFL) | Noto Sans SC (títulos e legenda em chinês), Barlow Condensed (números e inglês, itálico 800 e 600), IBM Plex Mono (marcador de tempo) — recortes em `fonts/*.woff2` |
| Cores | marcador `#FFD400`, defesa `#3FD8FF`, espaço `#FF3B30`, giz `#F4F1E8`, quadro `#0C1411` (objeto `COL`) |
| Som | o código gera só a imagem; narração, som da torcida e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Ordem e duração dos trechos | `timeline.json` | lista `seg`: `id`, `t0`/`t1` (segundos do filme), `clip` e `f0`/`f1` (quadros da filmagem); na tela dividida, `r0`/`r1` para a segunda câmera |
| Falas e legenda | `timeline.json` | lista `vo`: `t` (entrada), `text` (inglês) e `zh` (chinês) |
| Texto lido pela voz sintética | `audio/lines.json` | campo `text` de cada fala (`g1`, `g2`, `g2b`, `v1`…`v4`, `map`) |
| Duração de cada fala | `vdur.json` | segundos por fala; define quanto tempo a legenda fica |
| Quadros da filmagem | `assets/a/`, `assets/b/`, `assets/c/` | `001.jpg`, `002.jpg`… em 1920×1080; o total de cada pasta fica em `NFR` |
| Posição dos jogadores e da bola | `index.html` | `TRK`: listas `[quadro, x, y]` em coordenadas 1280×720 da filmagem original |
| Linhas do campo e ponto do chute | `tools/pitch.json` | gera `assets/pitch.json` com `tools/homography.py` |
| Rótulos desenhados nos congelamentos | `index.html` | chamadas `tag(...)` em `overlayAnalysis()`, `overlayG1()` e `splitView()` |
| Ficha da partida (times, data, placar) | `index.html` | função `record()` |
| Transcrição da narração original | `index.html` | `lines` dentro de `transcript()` |
| Cartão de números | `index.html` | `rows` dentro de `notes()` e a foto `assets/hak.jpg` |
| Mapa de chutes | `index.html` | `SH` dentro de `shotMap()` |
| Nome do programa | `index.html` | `bugTop()`, `sting()` e `endCard()` (texto "定格" e "FREEZE FRAME") |
| Placar e minutos dos gols | `index.html` | `bugScore()` e a lista `GOALS` no fim do arquivo |
| Créditos do cartão final | `index.html` | `CREDITS` |

## Como adaptar

1. **Comece pela filmagem.** Escolha um vídeo que você pode usar (seu, liberado ou com licença aberta). Extraia os quadros para `assets/a/`, `b/` e `c/` com nome de três dígitos (`001.jpg`…), em 1920×1080. O `tools/prep.sh` mostra o comando `ffmpeg` usado. Atualize `NFR` com o total de quadros de cada pasta.
2. **Monte o roteiro em `timeline.json`.** Cada trecho tem um `id` que o código reconhece (`live`, `rewind`, `fz1`…`fz4`, `slow1`, `rep1`, `map`, `notes`, `end`, `card`…). Troque os quadros `f0`/`f1` para apontar para o seu lance. Um trecho com `f0` igual a `f1` vira congelamento. Exemplo de entrada: `{"id": "fz1", "t0": 23.0, "t1": 25.0, "f0": 1, "f1": 1}`.
3. **Marque as posições.** Abra a prévia com `?dbg=1` para ver os pontos de `TRK` em rosa sobre a imagem e ajuste cada lista `[quadro, x, y]` até o ponto ficar no pé do jogador. As coordenadas são da filmagem em 1280×720 (o código multiplica por 1,5).
4. **Mapa de chutes.** Em `tools/pitch.json`, para cada gol, informe pelo menos 4 pontos do campo em metros (origem no centro do gol; `x` = distância para fora da linha de fundo, `y` = atravessando o campo) e onde eles aparecem no quadro em pixels: `[[16.5, -20.16], [532, 382]]`. Em `marks.shot` vai o pixel do ponto do chute. Rode `tools/homography.py` para gerar `assets/pitch.json`; a distância mostrada na tela sai daí.
5. **Troque os textos.** Falas em `timeline.json` (`vo`) e em `audio/lines.json`, rótulos nas chamadas `tag()`, ficha da partida em `record()`, números em `notes()`. Cada língua da legenda cabe em uma linha só, até 960 px (`SUB.maxW`); se passar, o console avisa e é para encurtar a frase. Para trocar o chinês por português, ponha o texto pt-BR no campo `zh`.
6. **Refaça as fontes.** As fontes são recortes só com as letras usadas. Depois de mudar qualquer texto, apague `fonts/*.woff2` e rode `tools/fonts.py` (baixa do Google Fonts as letras de `index.html` e `timeline.json`).
7. **Confira os quadros** na prévia em vários segundos, principalmente nos congelamentos, na tela dividida e no mapa de chutes.

## O que não mexer

- `marker()` e `ring()`: são o traço de marcador com brilho e o anel em perspectiva, a cara do estilo.
- `wipe()`: a faixa amarela diagonal entre os trechos.
- A lógica de `shotMap()` com `Hap()` e `drawTri()`: é o que achata o quadro da filmagem em vista de cima.
- A posição do selo (`bugTop`) e do placar (`bugScore`): no exemplo eles cobrem o logotipo e o endereço da emissora gravados na filmagem. Com outra filmagem, mova se for preciso, mas mantenha o pacote em cima da imagem.

## Atenção

- **Filmagem e fotos de terceiros, não incluídas.** As pastas `assets/a`, `b`, `c` e as fotos `assets/stadium.jpg` e `assets/hak.jpg` não estão no projeto. São baixadas por `tools/fetch_sources.sh` (YouTube via `yt-dlp` e Wikimedia Commons, cerca de 55 MB em `raw/`) e convertidas por `tools/prep.sh`. Sem isso, a prévia mostra só os gráficos, sem imagem de fundo.
- **Licenças do exemplo (ver `CREDITS` e `SOURCES.jsonl`):** os lances são da beIN SPORTS Türkiye, em CC BY 3.0 (vídeo no YouTube e um recorte no Wikimedia Commons); a foto do jogador é de Thomas Rodenbücher, CC BY 2.0; a foto do estádio é de Olos88, CC0. CC BY exige crédito ao autor e indicação das mudanças. O `tools/license-evidence.json` guarda a checagem da licença do vídeo. Para um vídeo do usuário, troque todo esse material e atualize `CREDITS` e a lista `CREDITS` do cartão final.
- **Dados ligados à filmagem:** `TRK`, `tools/pitch.json`, `assets/pitch.json`, os quadros em `timeline.json`, os pontos fixos `DEF2`, `BOXLINE`, `GOALPT` e `SPL` (janela de cada câmera na tela dividida) valem só para estas imagens. Com outra filmagem, todos precisam ser refeitos.
- **Partida, clubes e jogadores reais:** Beşiktaş 3–3 Fenerbahçe, 25/02/2019, com nomes de jogadores na tela. O exemplo se apresenta como análise não oficial de torcedor. Não reaproveite esses nomes em outro conteúdo.
- **Texto em chinês na tela:** títulos, rótulos, ficha da partida, cartão de números e a primeira linha da legenda estão em chinês, com o inglês embaixo. Tudo precisa ser traduzido.
- **Assinaturas do exemplo:** o cartão final leva "LemoLab × Claude Opus 5.5", e o programa fictício se chama "定格 / FREEZE FRAME". Troque pelo nome da marca do usuário.
- **Letras com acento:** as fontes são recortes. Sem rodar `tools/fonts.py` de novo, letras como "ã" e "ç" aparecem como quadrado ou em fonte diferente.
- **Modos especiais:** `?nosub=1` tira a legenda; `?dbg=1` mostra os pontos de rastreamento no lugar dos desenhos.
