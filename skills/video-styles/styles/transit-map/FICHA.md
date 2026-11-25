# Mapa de metrô

**Slug:** `transit-map` · **Categoria:** Gráfico e tipografia · **Filme de exemplo:** 47 s, 1920×1080

## O visual

Um mapa de metrô impresso numa folha de papel `#F2EEE5`, sobre uma mesa, filmado por uma câmera em perspectiva que inclina, aproxima e desfoca as bordas. As linhas seguem a grade clássica de mapa de metrô (só ângulos de 0°, 45° e 90°), cada uma na sua cor, e crescem como se uma caneta as desenhasse na hora. As estações acendem quando a linha passa, as baldeações caem sobre o papel e trenzinhos correm pelas linhas.

O filme de exemplo mostra a rede de metrô de Xangai crescendo de uma linha de 6 km em 1993 até 21 linhas e 906 km:
- abertura num túnel e o primeiro trecho de 5 estações;
- uma régua de anos e um contador de quilômetros com tambores que giram como um odômetro;
- a explosão de linhas de 2001 a 2010 e a comparação com o metrô de Londres;
- a rede inteira hoje, uma placa de estação escura com os números do recorde e a marca "You are here";
- cartão final impresso no canto da folha.

Não há narração nem legenda: o texto está impresso no mapa, sempre em duas línguas (chinês em cima, inglês embaixo).

## Quando usar

**Bom para:**
- transporte, logística e rotas;
- crescimento ao longo do tempo (de 1 para muitos);
- redes: lojas, filiais, conexões, parceiros.

**Evite para:** histórias com personagens, emoção ou rostos, ou temas que não cabem num mapa. Também não serve para dados soltos sem lugar.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 47 s (`DUR = 44.5` de "tempo da história" em `timeline.js`, esticado para 47 s por `WARP`) |
| Formato | feito para horizontal 1920×1080. O canvas segue o tamanho da janela (`fit()` em `film.js`) e a escala é calculada pela largura (`innerWidth / 1920`), então só funciona bem em 16:9 |
| Prévia ao vivo | ~47 fps (leve); usa WebGL |
| Fontes (OFL) | Inter (latim, números, tambores do contador), Noto Sans SC (chinês, recortada só para os caracteres do exemplo) |
| Cores | papel `#F2EEE5`, tinta `#1B1C1E`, cinza `#77736B`, rio `#BCD6EA`; cada linha tem sua cor em `net.js` (por exemplo, linha 1 `#E3002B`, linha 2 `#82BF25`) |
| Som | o código gera só a imagem; trilha e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

O motor (`film.js`) não guarda nenhuma rede nem história. A rede fica em `net.js` e a direção do filme em `timeline.js`.

| O que mudar | Arquivo | Onde |
|---|---|---|
| Estações | `net.js` | `ST`: posição na grade, nome em chinês, nome em inglês e importância (1 = grande, 4 = parada simples) |
| Linhas | `net.js` | lista de linhas: `id`, `color`, `route` (estações e curvas), `bullet`, `loop` |
| Rios | `net.js` | lista de água (`huangpu`, `suzhou`) |
| Números mostrados | `timeline.js` | `FX` (data de abertura, quilômetros por ano, número de linhas e estações, recorde de passageiros, Londres) |
| Ordem em que as linhas crescem | `timeline.js` | `PHASES` (linha, de, até, início, fim, ano) |
| Planos | `timeline.js` | `S` (túnel, primeiro trecho, crescimento, comparação, hoje, final) |
| Câmera | `timeline.js` | `camera(t)` |
| Textos impressos | `timeline.js` | cabeçalho "上海地铁 / Shanghai Metro", régua de anos, "Expo 2010", "You are here", legenda "It all started with 6 km", cartão final |
| Velocidade de cada trecho | `timeline.js` | `WARP` (tempo do filme para tempo da história) |

## Como adaptar

1. **Desenhe a rede nova** em `net.js`: estações em `ST` e linhas com suas rotas. Use só os ângulos da grade (0°, 45°, 90°).
2. **Troque os números** em `FX` e a ordem de crescimento em `PHASES`. Todo número que aparece na tela vem de `FX`.
3. **Reescreva os textos impressos** em `timeline.js`. Cada texto tem uma linha em chinês e uma em inglês; decida com o usuário como fica em pt-BR.
4. **Refaça a câmera** em `camera(t)`: ela segue pontos de estações pelo `id`, então uma rede nova pede posições novas.
5. **Confira os quadros** em vários segundos (primeiro trecho, régua de anos, explosão de linhas, rede inteira, final) antes de renderizar.

## O que não mexer

- `film.js`: é o motor genérico (crescimento das linhas, estações, trens, rótulos, contador).
- `gl.js`: papel, mesa, perspectiva e desfoque.
- A grade de 45°: linhas tortas quebram a leitura de mapa de metrô.

## Atenção

- **Dados reais de terceiros:** a rede, os nomes das estações, as cores das linhas e os números do exemplo são do metrô de Xangai e do metrô de Londres. O `CREDITS` lista as fontes (jornais chineses, conta oficial do metrô de Xangai, Transport for London, London Transport Museum). Para outro tema, troque tudo; se mantiver algum dado, credite a fonte.
- **Aviso de filme não oficial:** o cabeçalho, a legenda do começo e o cartão final dizem que é uma homenagem não oficial, sem ligação com a operadora. Ajuste ou apague conforme o novo tema.
- **Assinaturas do exemplo:** o cartão final escreve "6 公里 / 6 Kilometres", "地铁线路图 / Transit Map" e "LemoLab × Claude Opus 5.5" (`timeline.js`). Troque pela marca do usuário ou apague.
- **Fonte chinesa recortada:** `NotoSansSC-sub.ttf` só tem os caracteres do exemplo (`tools/subset.py`). Texto novo em chinês exige recortar de novo.
- **Depende de arquivos fora da pasta:** `film.js` e `timeline.js` importam `/core/lib.js` da skill. A prévia precisa ser servida a partir da raiz da skill.
- **Letras com acento:** se aparecer um quadrado no lugar de uma letra, a fonte não tem aquele caractere; avise o usuário em vez de trocar a fonte.
- **Sem modos especiais:** o código não lê parâmetros de URL.
