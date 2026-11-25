# Zoom de escala

**Slug:** `flat-space-explainer` · **Categoria:** Desenhos animados · **Filme de exemplo:** 52 s, 1920×1080

## O visual

Desenho chapado em SVG sobre um azul-noite `#1D2052`. Cada objeto tem uma cor base e um só degrau de sombra, sem contorno, sem degradê e sem transparência (`flat.js`). A paleta é curta: azul `#4D7CFE`, menta `#3FD8AE`, coral `#FF6B5E`, amarelo-sol `#FFC84A` e creme `#FFF4E2`, com o lilás `#9298D4` para textos secundários.

O guia é o Orbi, uma pequena sonda cujo olho é uma lente de zoom (`orbi.js`, `heroes.js`). Ele dispara uma linha pontilhada amarela até um anel "NEXT STOP", e a câmera mergulha nesse anel. O filme desce por paradas: galáxia, Sistema Solar, Terra, a sua mão, o sangue, um vírus. No fim, todas as paradas aparecem juntas numa régua.

Elementos fixos:
- a régua de escala no canto, com o campo de visão em números ("FIELD OF VIEW", de anos-luz a µm);
- o anel de próxima parada com halo tracejado e rótulo em duas linhas;
- textos que entram por cortina da esquerda para a direita ou sobem de trás de uma máscara (sem fade).

A legenda fica no canto inferior esquerdo com um tracinho amarelo: uma linha grande em chinês e, embaixo, uma menor em inglês. Sobre o céu claro e a pele ganha uma placa azul-noite.

## Quando usar

**Bom para:**
- explicar tamanho e escala (do muito grande ao muito pequeno, ou o contrário);
- ciência para sala de aula ou público jovem;
- uma viagem por etapas com um guia simpático;
- comparações do tipo "se a Terra fosse uma bola de basquete".

**Evite para:** temas sérios ou adultos, rostos reais, foto, ou assuntos sem uma ideia de "zoom". Cada parada é uma cena desenhada à mão em código; trocar o tema dá trabalho.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 52 s (`FILM_DUR = 52` em `film.js`; 96 BPM, `BEAT = 0.625`), renderizado a 24 fps pelo `build.sh` |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `flat.js`; SVG com `viewBox` de 1920×1080) |
| Prévia ao vivo | ~98 fps (leve) |
| Fontes (OFL) | Jost (texto latino), Noto Sans SC Bold recortada (`NotoSansSC-Bold-sub.woff2`, só os caracteres chineses usados) |
| Cores | fundo `#1D2052` (camadas `#252A63`, `#30367C`), destaque `#FFC84A`, creme `#FFF4E2` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Legendas | `scenes.js` | `VO`: `{ id, t, dur, cn, en }` (`cn` é a linha grande, `en` a pequena) |
| Texto da narração (para gerar a voz) | `vo/lines.json` | campo `text` de cada fala (`v1`, `v3`, `v4a`…`v8`) |
| Duração de cada fala | `vo/dur.json` e `scenes.js` | o `dur` de `VO` está copiado à mão; mude nos dois |
| Título e subtítulo da abertura | `film.js` | `title()` ("The Long Way Down" e as duas linhas de baixo) |
| Paradas da régua | `scenes.js` | `STOPS6` e `STOP_T` (segundo em que cada parada acende) |
| Campo de visão ao longo do filme | `scenes.js` | `E_TRACK` e `fmtM()` (unidades) |
| Quando cada cena começa | `scenes.js` | `TL` e `filmAll()` |
| Rótulos dos anéis | `scenes.js` | chamadas `ringAt(...)` ("Earth", "You", "Into your blood", "A virus, 0.1 µm") e `lockRing()` em `film.js` ("Our Sun") |
| Rótulos dentro das cenas | `scenes.js` | `wipeText(...)` em `solar()`, `earth()`, `hand()`, `blood()`, `virus()` |
| Frase final e assinatura | `scenes.js` | `finale()` e `signOff()` / `SIGN` |
| O guia | `heroes.js` / `orbi.js` | `HEROES.orbi` (ficha de personagem em `?f=options`) e `orbi()` |

**Formato dos dados.** A régua usa a escala em potências de dez (log10 do campo de visão, em metros). Uma parada de `STOPS6`:

```js
{ e: 7.75, name: 'Earth', glyph: 'earth', read: '56,000 km' }
```

`e` é a posição na régua (7.75 = 10^7,75 m ≈ 56.000 km), `name` é o rótulo, `read` é a leitura escrita e `glyph` é o ícone. Só existem os ícones desenhados em `stopGlyph()`: `galaxy`, `solar`, `earth`, `hand` e `cell`; qualquer outro valor desenha o vírus. `E_TRACK` é uma lista `[segundo, e]` que diz quanto a câmera "mostra" em cada momento; o número do canto sai daí.

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `vo/lines.json` e as legendas em `VO`. Ponha o pt-BR no campo `cn` (linha grande); a fonte dessa linha é `Jost,NotoSC`, então o português sai em Jost. O `en` vira a linha pequena: pode repetir em outra língua ou ficar vazio.
2. **Troque os textos em chinês** do título (`title()` em `film.js`), da frase final (`finale()`) e do `signOff()`. Neles a fonte é só `NotoSC`: ao pôr português, troque para `Jost`.
3. **Ajuste o tempo.** Com a nova narração, atualize `vo/dur.json` e o `dur` de `VO`. Se a narração andar muito, os tempos de `TL` e de `E_TRACK` também mudam.
4. **Mesmo tema, outros números:** troque `STOPS6`, os rótulos de `ringAt()` e os `wipeText()` de cada cena.
5. **Outro tema de escala:** cada parada é uma função de cena (`dive()`, `solar()`, `earth()`, `hand()`, `skin()`, `blood()`, `lens()`, `virus()`, `finale()`). Para outras paradas, reescreva essas funções com `el()`, `shaded()`, `twoTone()` e `halo()` de `flat.js`, e mantenha a mesma ordem de mergulho por anel.
6. **Confira os quadros** com `?from=` e `?to=` na prévia, e gere as imagens de referência com `shoot.mjs`, antes de renderizar.

## O que não mexer

- As regras de `flat.js`: uma cor base e um degrau de sombra, sem contorno, sem degradê, sem transparência.
- A gramática do zoom: linha pontilhada da lente → anel "NEXT STOP" → mergulho. É o que amarra o filme.
- A régua de escala no canto (`ribbon()`): ela dá a noção de quanto já se desceu.
- Textos por cortina ou máscara, nunca por fade (`wipeText()`).

## Atenção

- **Texto em chinês na tela:** a legenda principal é em chinês (`cn` de `VO`), e há chinês no subtítulo da abertura ("从银河一路缩到一个病毒"), na frase final ("从银河到病毒，二十八个数量级"), no `signOff()` (一路往下缩, 扁平尺度漫游) e nos quadros `?f=1`–`3` e `?f=options`. Tudo precisa ser trocado. Se for manter algum chinês novo, apague `fonts/NotoSansSC-Bold-sub.woff2` e rode `tools/fonts.py` de novo (ele baixa o recorte do Google Fonts).
- **Assinaturas do exemplo:** o fim do filme escreve "LemoLab × Claude Opus 5.5" (`SIGN` em `scenes.js`), o nome do filme "THE LONG WAY DOWN" e o do estilo. O guia se chama Orbi e é citado nas falas (`v5a`, `v6a`, `v7`). Troque pela marca do usuário, ou dê outro nome ao guia em `HEROES.orbi` e nas falas.
- **Números do exemplo:** as medidas na tela (100 mil anos-luz, 8 minutos de luz, 400 km da estação espacial, GPS 20.200 km, geoestacionária 35.786 km, uva de 2 cm, glóbulo vermelho 7,5 µm, vírus 0,1 µm, fio de cabelo 80 µm) estão escritas no código. Se o tema mudar, confira cada uma.
- **Letras com acento:** Jost tem acentos do português. Se aparecer quadrado, é texto que ainda está com `'font-family': 'NotoSC'`.
- **Modos especiais:** sem parâmetro, é o filme inteiro; `?from=` e `?to=` recortam um trecho; `?f=1`, `2` ou `3` mostram quadros fixos de referência; `?f=options` mostra a ficha do personagem. Não há parâmetro para tirar a legenda.
