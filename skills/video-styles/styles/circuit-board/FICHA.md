# Placa de circuito

**Slug:** `circuit-board` · **Categoria:** Diagramas de linha · **Filme de exemplo:** 60 s, 1920×1080

## O visual

Uma placa de circuito vista de cima: máscara de solda verde-escura `#05190F` com trama de fibra, áreas de cobre verde `#1C6A44`, trilhas `#2B8158`, ilhas douradas `#D9B25B`, cobre exposto `#C9784A` e serigrafia branca `#F2EEE1`. Rios e lagos viram trilhas e áreas de cobre. A corrente aparece como um brilho âmbar que corre pelas trilhas; a água corre prateada.

O mapa é feito de quatro placas, uma dentro da outra: o corredor de transmissão (quilômetros), a cidade (dezenas de metros), a rua com a tomada (centímetros) e o carregador de celular (milímetros). A câmera mergulha de uma placa para a outra; na descida de tensão, quatro cortes secos mostram o mesmo símbolo do mesmo tamanho em quatro escalas. No fim, a câmera sai do carregador, atravessa todas as placas e mostra o corredor inteiro sobre uma mesa.

Os rótulos da placa são escritos numa fonte de traço único desenhada como trilha de circuito ("Routed", em `font.js` e `hanzi.js`), em chinês com o inglês embaixo. A legenda fica embaixo, centralizada, em chinês com o inglês logo abaixo.

## Quando usar

**Bom para:**
- energia, eletricidade e infraestrutura;
- cadeias de suprimento e caminhos de um ponto a outro;
- explicar o que tem dentro de um aparelho;
- mudar de escala (do país ao milímetro) numa só viagem.

**Evite para:** pessoas, emoção, temas sem ligação com rede, fluxo ou circuito, ou textos longos na tela.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 60 s (`DUR = 60` em `src/main.js`; 100 BPM) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `src/main.js`; a página só estica a imagem para a janela) |
| Prévia ao vivo | ~18 fps (pesado, 15–22 fps): a prévia pode engasgar, mas o render final não é afetado |
| Fontes | Noto Sans SC recortada (OFL), só na legenda; os rótulos da placa usam a fonte "Routed", desenhada em código |
| Cores | todas em `PAL` (`src/palette.js`): fundo `#05190F`, trilha `#2B8158`, ilha `#D9B25B`, cobre `#C9784A`, serigrafia `#F2EEE1`, corrente âmbar `[255, 190, 84]` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração (linha de cima da legenda) | `voice/lines.json` | campo `text` de cada fala (`v01`…`v11`) |
| Linha de baixo da legenda | `data/subs_en.json` | segundo item de cada par |
| Versão em inglês da narração | `voice_en/lines.json` | `text`, e `say` quando a voz lê outra frase |
| Duração de cada fala | `voice/dur.json` | segundos por fala; controla quanto tempo a legenda fica na tela |
| Quando cada fala entra | `src/main.js` | `VO` (segundo de entrada de cada fala) |
| Rótulos do corredor e cidades | `src/world.js` | `LABELS` e `DESIG` |
| Título e assinatura | `src/world.js` | itens `tb`, `tbE` e `sign`, posição em `TITLE` |
| Rótulos da cidade e da rua | `src/city.js`, `src/house.js` | listas de `text` |
| Rótulos do carregador | `src/charger.js` | lista com `充电器`, `整流桥`, `换流站` etc. |
| Placa de perda | `src/loss.js` | rótulos `损耗` / `LOSS` |
| Cores | `src/palette.js` | `PAL` |
| Planos e câmera | `src/main.js` | `SHOTS` (início, fim, placa e função de câmera: `camDam`, `camBus`, `camButuo` etc.) e `CUTS` |

## Como adaptar

1. **Comece pela narração.** Troque `text` em `voice/lines.json` e a tradução em `data/subs_en.json`. Para pt-BR, a linha de cima pode virar o texto em português e a de baixo pode ser apagada ou usada para outra língua.
2. **Ajuste o tempo das falas.** Com a voz pronta, ponha as durações em `voice/dur.json` e acerte os segundos em `VO`. Os planos de `SHOTS` foram cortados para caber nessas falas; se a narração mudar muito, os planos precisam acompanhar.
3. **Troque os rótulos da placa** em `LABELS`, `DESIG` e nas listas de `city.js`, `house.js`, `charger.js` e `loss.js`. Use frases curtas, em maiúsculas.
4. **Mapa novo:** rios, lagos, costa e cidades foram traçados à mão em `src/world.js`. Outro trajeto exige redesenhar o corredor e conferir a câmera de cada plano.
5. **Confira os quadros** em vários segundos (represa, perda, corredor, cortes de escala, tomada, carregador, saída final) antes de renderizar.

## O que não mexer

- `src/render.js` e `src/post.js`: desenham a placa (cobre, ilhas, furos, brilho da corrente) e o acabamento final.
- `src/levels.js`: encaixa as quatro placas uma dentro da outra.
- Os cortes de escala com o símbolo do mesmo tamanho (`CUTS`): fazem parte do estilo.

## Atenção

- **Rótulos da placa sem acento:** a fonte "Routed" (`src/font.js`) tem as maiúsculas de A a Z, números, alguns sinais e só parte das minúsculas. Não tem letras com acento: qualquer letra que falta vira um "?" desenhado. Os hanzi também são só os 48 desenhados em `src/hanzi.js`; outros viram "?".
- **Legenda sem acento:** a Noto Sans SC recortada só tem os caracteres das falas atuais. Letras com acento caem numa fonte reserva do navegador. O recorte é refeito por `tools/subset.py` a partir da fonte completa que o `build.sh` baixa; depois de trocar as falas, rode-o de novo e confira os acentos.
- **Texto em chinês fixo:** as falas de `voice/lines.json` e todos os rótulos com hanzi (`七毫秒`, `换流站`, `交流电`, `江苏`, `充电器`, `整流桥`, `损耗` etc.) em `world.js`, `charger.js` e `loss.js`. O inglês aparece embaixo de cada um.
- **Assinaturas do exemplo:** o bloco de título em `src/world.js` escreve "LemoLab × Claude Opus 5.5" (item `sign`). Troque pela marca do usuário ou apague.
- **Fatos do exemplo:** os lugares, a distância (2.080 km) e o tempo (7 ms) são do exemplo chinês. Num vídeo novo, todos os números e nomes da placa precisam ser trocados.
- **Modos especiais:** `?nosub` tira a legenda. `?subs=1` só inclui a legenda na lista de caixas de texto usada para conferência.
