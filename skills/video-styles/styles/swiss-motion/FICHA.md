# Motion design suíço

**Slug:** `swiss-motion` · **Categoria:** Gráfico e tipografia · **Filme de exemplo:** 44 s, 1920×1080

## O visual

Um fundo cinza-papel (`#EAE9E5`) com um cartaz branco ao lado, tudo preso numa grade de 12 colunas. Tinta preta (`#111111`), cinzas claros para a grade e um único vermelho (`#E30613`) para o que importa. A tipografia é Archivo, em vários pesos; números gigantes ocupam a página da esquerda.

O movimento é seco e no tempo da música (120 BPM): cada coisa entra de uma vez, numa só curva de aceleração (`E` em `ease.js`), ou anda em linha reta. Nada balança.

O filme mostra um cartaz de concerto se arrumando sozinho, uma regra de cada vez:
- **1 Grade:** as colunas crescem a partir de uma linha vermelha;
- **2 Tipografia:** textos em três fontes diferentes viram uma só;
- **3 Espaço:** linhas sobrando são cortadas com uma "faca";
- **4 Alinhamento:** tudo vai para a esquerda;
- **5 Exceção:** um círculo vermelho sai da grade.

Depois o cartaz gira e vira partitura: os blocos pretos são notas, e uma linha vermelha passa tocando. No fim, a câmera se afasta e mostra uma parede de cartazes, cada um quebrando uma regra diferente.

As falas aparecem como parte do layout, palavra por palavra: uma linha pequena em cinza e a frase grande em preto.

## Quando usar

**Bom para:**
- identidade de marca e sistemas visuais;
- cartazes, eventos e programação;
- ensinar regras ou passos numerados;
- qualquer tema que combine com ordem, grade e tipografia forte.

**Evite para:** emoção forte, fotos, ilustração ou tom descontraído. O estilo pede frases curtas e poucas palavras por vez.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 44 s (120 BPM; `DUR = 44` em `film.js`, `BPM` em `ease.js`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `film.js`; canvas fixo em `index.html`) |
| Prévia ao vivo | ~100 fps (leve) |
| Fontes (OFL) | Archivo (todo o filme); UnifrakturMaguntia e DM Serif Display só na piada da "fonte errada" |
| Cores | fundo `#EAE9E5`, cartaz `#FFFFFF`, tinta `#111111`, vermelho `#E30613`, grade `#CFCEC9` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração / legenda | `lines.json` | campo `text` (`l1`…`l6`) e `t` (segundo de entrada) |
| Duração de cada fala | `voices/dur.json` | segundos por fala |
| Quando cada palavra aparece | `voices/words_rel.json` | segundos de cada palavra desde o início da fala |
| Quando a fala sai e onde fica | `film.js` | `LAYOUT` (segundo de saída, posição `page`, `center` ou `wall`) |
| Título de abertura | `film.js` | `drawOpening()` ("Five Rules for a Poster") |
| Nome das cinco regras | `film.js` | `RULES` (segundo, número, nome) |
| Notas pequenas de cada regra | `film.js` | `NOTES` (três linhas por regra) |
| Linha de legenda do topo | `film.js` | `drawCaptions()` |
| Textos do cartaz | `film.js` | `TX` (versão bagunçada `A`, unificada `B`, compacta `C`, final `E`; `cut` = linha cortada) |
| Blocos, notas e círculo | `score.json` | `stiff`, `final`, `circle`, `bleed` |
| Parede de cartazes | `film.js` | `VAR` e `drawVariant()` |
| Cartão final e cartaz | `film.js` | `drawEndCard()` |
| Câmera | `film.js` | `CAM` (centro x, y, zoom e giro por momento) |
| Momentos-chave | `film.js` e `score.json` | `T` e `timeline` |
| Cores | `film.js` | objeto `C` |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `lines.json`. Cada fala precisa ter um ponto seguido de espaço: o que vem antes vira a linha pequena e o que vem depois vira a frase grande (ex.: "Regra um. Monte uma grade."). A exceção é `l5b`, que é toda grande. Sem o ". ", o código corta a primeira letra.
2. **Ajuste o tempo.** Com a nova narração, atualize `t` em `lines.json`, `voices/dur.json` e o segundo de saída em `LAYOUT`. O `words_rel.json` precisa ter um tempo por palavra; se a contagem não bater, as palavras entram a cada 0,26 s.
3. **Troque o cartaz.** Em `TX`, cada linha tem a versão bagunçada `A` (`[texto, fonte, peso, tamanho, y]`) e as versões seguintes. Linhas com `cut` somem na regra 3. Troque também `RULES`, `NOTES`, as legendas e os cartazes da parede em `VAR`.
4. **Blocos e música andam juntos.** Em `score.json`, cada bloco é `[coluna, linha, comprimento]`: coluna 0–6 = as 7 notas de `cols`, linha 0–15 = colcheias, comprimento em linhas. Exemplo: `[3, 6, 4]` é um bloco na quarta coluna, da linha 6 até a 9. O `stiff.lead` tem 16 blocos de uma célula, e a soma dos comprimentos em `final.lead` também precisa dar 16, porque cada bloco do começo vira uma célula do final.
5. **Confira os quadros** em vários segundos (cada regra, o giro, a parede, o final) antes de renderizar.

## O que não mexer

- `ease.js`: a curva única `E` e o `snap()` são o que dá o movimento suíço.
- A grade (`fx()`, `px()`, `py()`): tudo se apoia nela.
- A ideia de que só uma coisa sai da grade (o círculo vermelho): é a piada do filme.

## Atenção

- **Assinaturas do exemplo:** o cartão final e o cartaz (`?poster`) levam "LemoLab × Claude Opus 5.5" e "A Lemo-Opuscar film". Troque pelo nome da marca do usuário ou apague.
- **Crédito obrigatório da bateria:** a trilha original usa a bateria "MuldjordKit", de Lars Muldjord, licença CC BY 4.0, e o cartão final mostra esse crédito. As amostras não estão nesta pasta; `music/score.py` as carrega pelo sampler do núcleo. Se usar outra trilha, tire essa linha de `drawEndCard()`; se usar a original, mantenha o crédito.
- **Texto de tela em inglês e alemão:** as legendas e notas estão em inglês, e o cartaz de concerto está em alemão ("neue musik", "konzert 1961", "freitag 17. märz 1961"). Tudo precisa ser traduzido.
- **Modos especiais:** `?nosub` tira só as falas do centro e da parede; as falas da página da esquerda fazem parte do layout e continuam. `?poster` troca o cartão final pela versão de cartaz (aparece nos últimos segundos).
