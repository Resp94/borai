# Ukiyo-e

**Slug:** `ukiyoe` · **Categoria:** Artes tradicionais · **Filme de exemplo:** 44 s, 1920×1080

## O visual

Xilogravura japonesa em movimento. Cada cena é uma gravura impressa em papel creme (`#EEE2C6`) com textura de fibra, contorno preto de tinta sumi (`#231F1C`), azul-da-prússia (`#1D3A66`), verde, ocre e um vermelho (`#B8412F`). As cores entram como na impressão de verdade: primeiro o traço, depois cada bloco de cor, com um leve desencaixe entre eles e a marca do baren (a almofada de esfregar).

As cinco gravuras ficam lado a lado num rolo de papel, da direita para a esquerda. A câmera passa de uma para a outra como quem desenrola o rolo. No exemplo, um viajante de chapéu de palha caminha rumo a uma montanha: campo de arroz, ponte na chuva, casa de chá, a grande onda e, por fim, a montanha. No fim a câmera se afasta e mostra o rolo inteiro.

Elementos fixos:
- moldura dupla de traço preto em cada gravura;
- tira de título vertical com numeração ("一 田毎の朝") e um carimbo vermelho, que fecham cada cena;
- carimbos vermelhos com ideogramas (`drawSeal()`);
- personagem e natureza animados a 8 quadros por segundo; chuva e espuma a 12, como desenho feito à mão.

A legenda é uma tira de papel horizontal no pé da tela, com moldura dupla e um pequeno carimbo à esquerda.

## Quando usar

**Bom para:**
- viagem, caminho e passagem do tempo;
- cultura japonesa, chá, natureza e estações;
- poesia e narração curta e contemplativa;
- uma história contada em poucas "estações", uma por gravura.

**Evite para:** temas técnicos, dados, telas e produtos modernos, ou ritmo acelerado. O estilo pede calma e poucas palavras.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 44 s (`DUR` em `story.js`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `print.js`) |
| Prévia ao vivo | ~67 fps (leve) |
| Fontes (OFL) | Shippori Mincho B1 (legenda e títulos em letras latinas), Yuji Syuku e um recorte da Shippori (ideogramas das tiras de título e carimbos) |
| Cores | papel `#EEE2C6`, sumi `#231F1C`, azul-da-prússia `#1D3A66`, vermelho `#B8412F`, verde `#8AA152`, ocre `#CF9F4A` (paleta `PAL` em `print.js`) |
| Som | o código gera só a imagem; narração, trilha e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração / legenda | `lines.json` | campo `text` de cada fala (`L1`…`L5`); um campo `sub` opcional substitui o texto só na legenda |
| Duração de cada fala | `voices/dur.json` | segundos por fala; controla quanto tempo a legenda fica na tela |
| Quando cada fala entra | `story.js` | `VO` (segundo de entrada) |
| Tempo de cada cena, panorâmicas e onda | `story.js` | `T` (`v1`…`v5`, `pan12`, `waveRise`, `pull`, `endcard`…) |
| Tiras de título e carimbos de cada cena | `main.js` | `CART` (`title` e `seal` de cada gravura) |
| Título de abertura | `main.js` | `titleCard()`: "山へ五景", "Toward the Mountain", "FIVE VIEWS ON THE WAY" |
| Cartão final | `main.js` | `endCard()` |
| Cartaz | `main.js` | `poster()` (abre com `?poster`) |
| As cinco gravuras | `views.js` | `VIEWS` (`V1`…`V5`), cada uma com suas camadas de cor |
| Viajante | `traveler.js` | `traveler()` e o chapéu `kasa()` |
| Montanha, pinheiros, chuva, gansos | `nature.js` | `mountain()`, `pine()`, `rain()`, `goose()` |
| A grande onda | `wave.js` | `wave()`, `foam()` |
| Movimento de câmera | `main.js` | `camera()` |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `lines.json`, o título de abertura e o cartão final. Escreva em pt-BR com acentos; a Shippori que vai na legenda tem os acentos do português. A legenda não quebra linha: frases curtas, de uma linha só.
2. **Ajuste o tempo das falas.** Meça a nova narração em `voices/dur.json` e, se preciso, mude os segundos em `VO`. A legenda é encurtada sozinha quando a próxima fala começa.
3. **Tiras de título.** As tiras verticais e os carimbos usam ideogramas japoneses de um recorte de fonte que só tem os caracteres do exemplo. Para títulos em português, troque a fonte das tiras (`vtext()` em `print.js` usa `Yuji`) ou deixe as tiras sem texto; letras latinas em coluna vertical ficam estranhas.
4. **Cenas novas:** cada gravura é código em `views.js`. Dá para trocar cores e mover elementos com facilidade. Outra paisagem, outro personagem ou outro objeto exige desenhar as camadas de novo com as peças de `print.js` (`carve()`, `line()`, `fillPath()`, `bokashi()`, `kasumi()`) e de `nature.js`.
5. **Confira os quadros** com `?t=` em vários segundos (abertura, cada cena, a onda, o final) antes de renderizar.

## O que não mexer

- `print.js`: papel, fibra, grão da madeira, desencaixe das cores (`stampLayer()`, `inkify()`) e a marca do baren. É o que faz parecer impresso.
- O ritmo de 8 e 12 quadros por segundo (`q8`, `q12` em `story.js`).
- O rolo da direita para a esquerda e o afastamento final que mostra as cinco gravuras juntas.

## Atenção

- **Assinaturas do exemplo:** o cartão final (`endCard()`) mostra "a Lemo-Opuscar demo" e "LemoLab × Claude Opus 5.5". Troque pelo nome da marca do usuário ou apague.
- **Ideogramas recortados:** `shippori-kanji.woff2` e `yuji-kanji.woff2` só têm os ideogramas do exemplo (山, 旅, 雨, 橋…). Qualquer outro ideograma, ou letra latina nessas fontes, vira quadrado.
- **Depende da pasta `core`:** o código importa `/core/lib.js` por caminho absoluto. Abra o filme pelo servidor da galeria, com a raiz em `skills/video-styles/`, ou ele não carrega.
- **Modos especiais:** `?t=20` abre num segundo fixo. `?nosub` tira a legenda. `?poster` mostra o cartaz. `?title` e `?cart` deixam o título e as tiras de cena sempre visíveis. `?test=trav` mostra o viajante sozinho.
