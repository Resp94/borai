# Formas Bauhaus

**Slug:** `bauhaus-shapes` · **Categoria:** Gráfico e tipografia · **Filme de exemplo:** 52 s, 1920×1080

## O visual

Papel claro `#F8F7F3` e poucas formas chapadas: círculos, triângulos, retângulos e uma rampa diagonal azul. Quatro cores fazem papéis fixos: o verde `#0E9F7A` é o protagonista (o ponto que cresce), o azul `#2138C8` é o único campo grande, o amarelo `#F4E04D` é base e apoio, e o lilás-claro `#D5DCEE` marca áreas secundárias. Texto e linhas ficam num azul-ardósia quase preto, `#161C3A`.

No exemplo, um ponto rola pela rampa e ganha anéis coloridos a cada dez anos até virar uma bola de 128. Os números grandes sobem por trás de uma máscara, os rótulos correm ao longo da rampa e a câmera faz aproximações curtas. Há uma textura leve de tinta e papel por cima.

A legenda é um bloco de papel fixo no canto inferior direito, com uma barra verde que cresce na lateral, em duas linhas: chinês em cima e inglês embaixo.

## Quando usar

**Bom para:**
- explicar um mecanismo ou um princípio com números (juros, proporções, crescimento);
- comparar duas grandezas lado a lado;
- abrir capítulos e vinhetas com tipografia forte.

**Evite para:** histórias com personagens, rostos, emoção, fotos ou cenas com muitos objetos. O estilo vive de poucas formas e poucos números.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 52 s (`FULL = 52` em `film.js`: 50 s de história + 2 s do cartão final) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `index.html`) |
| Prévia ao vivo | ~26 fps (pesado: abaixo de 30 fps, pode engasgar em máquina fraca) |
| Fontes (OFL) | Jost (variável, textos latinos) e Noto Sans SC (recorte só com os caracteres chineses usados) |
| Cores | paleta `klein`: papel `#F8F7F3`, verde `#0E9F7A`, azul `#2138C8`, amarelo `#F4E04D`, lilás `#D5DCEE`, tinta `#161C3A`; paleta alternativa `sorbet` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração | `voice/lines.json` | campo `text` de cada fala (`v01`…`v12`) |
| Legenda (duas linhas) | `voice/lines.json` | campos `zh` (linha de cima) e `en` (linha de baixo) |
| Duração de cada fala | `voice/dur.json` | segundos por fala |
| Quando cada fala entra | `film.js` | `VO_T` (segundo de entrada de cada fala) |
| Trechos do filme | `film.js` | `SHOTS` (`S1`…`S5`) e as funções `S1()`…`S5()` |
| Títulos e números na tela | `film.js` | chamadas `T('...')` dentro de cada cena (ex.: `'INTEREST'`, `'128'`, `'6.02'`, `'LAST 10 YEARS'`) |
| Frases em chinês na tela | `film.js` | `T('...', ..., {fam:HEI})` (ex.: ids `title-zh`, `s2-zh`, `s3-zh`, `s4-zh`) |
| Cartão final e crédito | `film.js` | `STYLE_EN`, `STYLE_ZH`, `CREDIT` e `creditBlock()` |
| Cores | `index.html` | `PALS` (`klein`, `sorbet`) e `DEFAULT_PAL` |
| Quadros fixos de referência | `index.html` | `frameTitle()`, `frameLever()`, `frameWater()` |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `voice/lines.json` e os rótulos `T('...')` de cada cena em `film.js`. Os rótulos usam maiúsculas; mantenha.
2. **Resolva a legenda bilíngue.** `subtitles()` sempre desenha duas linhas: `zh` em cima (fonte chinesa) e `en` embaixo. Para pt-BR, coloque o texto em `en` e ajuste `subtitles()` e `subBox()` para desenhar uma linha só; não coloque português em `zh`, porque a fonte chinesa é um recorte.
3. **Tire o chinês da tela.** As frases desenhadas com `fam:HEI` (título, comparações) precisam virar texto em Jost ou sair.
4. **Ajuste o tempo.** Atualize `voice/dur.json` com a duração real de cada fala e, se preciso, os segundos em `VO_T` e os limites de `SHOTS`.
5. **Outro assunto, outra conta.** As formas seguem a matemática do exemplo (`SIMPLE`, `UNIT`, a bola de 8 anéis em `RING`). Trocar só os números escritos deixa o desenho errado; um tema novo exige reescrever as cenas `S1()`…`S5()`.
6. **Confira os quadros** com `?cut=a:b` em vários trechos antes de renderizar.

## O que não mexer

- Os papéis das cores (verde = protagonista, azul = um campo só, amarelo = apoio): é o que deixa o quadro legível.
- A revelação dos textos por máscara (`g.clip()` + deslocamento): faz parte do estilo.
- `index.html` acima de `const FILM`: textura (`?tex`), paletas e carregamento das fontes.

## Atenção

- **Assinaturas do exemplo:** o cartão final mostra "LemoLab × Claude Opus 5.5" (`CREDIT` em `film.js`) e o nome do estilo em chinês (`STYLE_ZH`). Troque pela marca do usuário ou apague.
- **Letras com acento:** a Jost cobre o português, mas a fonte chinesa só tem os caracteres do exemplo. Se aparecer um quadrado no lugar de uma letra, avise o usuário em vez de trocar a fonte.
- **Modos especiais:** `?frame=1`, `2` ou `3` mostram quadros fixos (título, alavanca, água). `?nosub=1` tira a legenda. `?cut=a:b` toca só um trecho e `?sign=1` põe o crédito nos últimos 2,5 s dele. `?pal=sorbet` troca a paleta e `?tex=0` desliga a textura.
