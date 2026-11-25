# Plano-sequência em raspagem

**Slug:** `printed-long-take` · **Categoria:** Impressão e gravura · **Filme de exemplo:** 60 s, 1920×1080

## O visual

Um vale de inverno em 3D desenhado como gravura em raspagem: tudo é tinta quase preta `#16171b` com riscos finos raspados até o papel `#ede5cd`. Só há uma cor forte, o vermelho `#c4332b` (a coroa dos grous), e um pouco de amarelo `#dfa443` no sol. A neve, a água, o céu e as árvores com geada são feitos de linhas cortadas, como numa matriz de gravura. Às vezes a imagem parece uma prova recém-tirada, com a tinta ainda falhando.

A câmera faz quase um plano só: desce do céu noturno até o rio que solta vapor, passa por baixo de uma ponte, assiste ao amanhecer, segue os grous que acordam e levantam voo, atravessa o vapor e cai no campo de alimentação. Lá, um quadro de madeira conta os grous: 33 em 1952, depois 1.927 em 2025, com o status de proteção riscado e carimbado. O filme fecha com um casal de grous dançando e o cartão final gravado no céu.

O título e o cartão final são "cortados" no próprio céu. A legenda fica numa faixa embaixo, centralizada: chinês em cima, inglês embaixo.

## Quando usar

**Bom para:**
- viagens e jornadas por uma paisagem;
- vida selvagem e natureza;
- paisagens com clima (frio, névoa, amanhecer);
- uma história com um número que muda ao longo do tempo.

**Evite para:** cores vivas, pessoas em primeiro plano, interfaces, ou muito texto na tela.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 60 s (`DUR: 59.6` em `timeline.js` mais 0,4 s da câmera lenta sob a ponte, `WARP` em `scene.js`) |
| Formato | só horizontal, 1920×1080 (`W_`, `H_` fixos em `scene.js`) |
| Prévia ao vivo | ~15 fps (pesado, 15–22 fps): a prévia pode engasgar, mas o render final não é afetado |
| Fontes (OFL) | só Noto Serif SC 700, recortada para os caracteres do filme (placas, quadro, título e legenda) |
| Cores | `INK` `#16171b`, `PAPER` `#ede5cd`, `RED` `#c4332b`, `YELLOW` `#dfa443` (`textures.js`; as mesmas em `C`, `look.js`) |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas e legenda | `timeline.js` | `VO` (id, segundo de entrada, chinês, inglês) |
| Texto para gerar a voz | `lines_zh.json`, `lines_en.json` | `text` de cada fala (`l01`…`l11`) |
| Duração de cada fala | `voice/zh/dur.json` | a legenda usa estes segundos; `voice/en/dur.json` é da versão em inglês |
| Momentos da história | `timeline.js` | `T` (título, ponte, amanhecer, voo, quadro, carimbo, dança, final) |
| Título e cartão final no céu | `scene.js` | `TITLE` e `ENDC` (`skyTypeCanvas()`) |
| Placa da ponte | `props.js` | `plateCanvas()` e `PLATE_LINES` ("音羽橋") |
| Termômetro | `props.js` | `dialCanvas()` |
| Quadro de contagem | `props.js` | `boardCanvas()` e `boardPieces()` (datas, números, status) |
| Câmera | `scene.js` | `CAM_A_KEYS`, `camB()`, `camC()`, `camSign`, `camVerdict`, `camEnd` |
| Vale, rio, ponte, árvores | `world.js` | `buildWorld()`, `RIVER`, `BRIDGE` |
| Grous, árvores, névoa, sol | `textures.js` | `craneAtlas()`, `frostTreeAtlas()`, `mistAtlas()`, `sunCanvas()` |

## Como adaptar

1. **Comece pela narração.** Troque as falas em `VO` e nos `lines_*.json` (precisam bater). Para pt-BR, ponha o português num dos dois campos de `VO` e apague ou troque o outro.
2. **Ajuste o tempo das falas.** Ponha a duração real em `voice/zh/dur.json` (é o arquivo que a legenda lê) e acerte os segundos em `VO`. Os tempos de `T` e `VO` são contados antes da câmera lenta: depois de 9,95 s, tudo na tela acontece até 0,4 s mais tarde.
3. **Troque os textos gravados:** título e cartão em `TITLE` e `ENDC`, placa da ponte e quadro em `props.js`. Todos estão em chinês (veja "Atenção").
4. **Lugar ou bicho novo:** o vale e os grous são código e desenho em código. Mudar a paisagem mexe em `world.js` e em toda a câmera; trocar o animal exige refazer `craneAtlas()`.
5. **Confira os quadros** em vários segundos (título, ponte, amanhecer, voo, quadro de 1952, carimbo, dança, final) antes de renderizar.

## O que não mexer

- `look.js`: são os materiais de raspagem (água, neve, céu) que dão o estilo.
- O passe de impressão (`printMat` em `scene.js`): papel, tinta falhando e a transição em branco.
- A câmera contínua, sem cortes secos: é a ideia do estilo.

## Atenção

- **Fonte sem acento:** a Noto Serif SC foi recortada só para os caracteres do filme (`tools/chars.txt`) e não tem ç, ã, õ, á, é, í, ó, ú, â, ê, ô nem à. Na legenda essas letras caem na fonte serifada do navegador; nas placas e no quadro também, quebrando o desenho gravado. O recorte é refeito por `tools/subset.py`, que junta os caracteres de `scene.js`, `props.js` e `timeline.js`; depois de trocar os textos, rode-o de novo (ele precisa da fonte completa que o `build.sh` baixa) e confira os acentos.
- **Texto em chinês fixo:** a linha de cima da legenda (`VO`), o título 三十三只, a placa 音羽橋 e todo o quadro de contagem (`丹顶鹤 · 冬季清点`, `1952 年冬`, `33 只`, `2025 年 1 月`, `1,927 只`, `保护等级`, `易危`, `近危`, `已移出濒危`) em `props.js`.
- **Assinaturas do exemplo:** o cartão final escreve "LemoLab × Claude Opus 5.5" (`ENDC` em `scene.js`). A placa, o termômetro, o quadro e o carimbo são inventados; o nome da ponte é real. Troque pela marca do usuário ou apague.
- **Fatos do exemplo:** as contagens de grous e o status de proteção são do exemplo. Num vídeo novo, todos os números precisam ser trocados.
- **Modos especiais:** `?atlas=crane`, `tree`, `mist` ou `sun` mostram as folhas de desenho. `?cam=` força uma posição de câmera. `?subs=1` só inclui a legenda na lista de caixas de texto usada para conferência.
