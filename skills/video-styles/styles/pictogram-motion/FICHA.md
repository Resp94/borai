# Pictogramas em movimento

**Slug:** `pictogram-motion` · **Categoria:** Gráfico e tipografia · **Filme de exemplo:** 50 s, 1920×1080

## O visual

Sinalização urbana que ganha vida. Tudo é feito de formas geométricas chapadas: guarda-chuva, gota, nuvem, sol, lua, raio, pegadas, ônibus, placas de ponto e objetos perdidos. O fundo é uma grade de pictogramas pequenos, com as fileiras deslizando em sentidos opostos. Cada trecho usa uma paleta de uma cor só, em cinco tons, e o guarda-chuva amarelo (`#F2BA1D`) é a única cor quente num mundo frio.

As paletas ficam em `PAL` no `engine.js`: azul-chuva (`#1A3263`), verde-bonde (`#00685D`), azul-poça (`#61A5D0`), coral-tijolo (`#C04731`), amarelo-sinal (`#E4A608`) e tinta-tempestade (`#131924`). O texto é creme (`#FBF6EC`).

Tudo bate na música (120 BPM, um tempo a cada 0,5 s). As trocas de plano usam a própria grade: fileiras que correm, colunas que viram, a tela que se divide em quartos, uma íris que abre a partir do guarda-chuva e um raio em zigue-zague que racha a imagem.

Elementos fixos:
- painel de informações no alto: linha do ônibus e hora à esquerda, capítulo e clima à direita, com ícone;
- régua de 12 paradas no pé da tela, com a parada atual acesa;
- títulos grandes que entram por máscara, deslizando de dentro de uma faixa invisível.

A legenda é uma faixa colorida no canto inferior esquerdo com duas linhas: chinês em cima e inglês embaixo.

## Quando usar

**Bom para:**
- serviços públicos, transporte e histórias de cidade;
- identidade de marca e de evento, com cores e ícones próprios;
- explicar uma ideia com objetos, sinais e números;
- vídeos com música marcada, em que cada corte cai no tempo.

**Evite para:** rostos e emoção de perto, temas que pedem foto, e frases longas. O estilo vive de palavras soltas e ícones.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 50 s (120 BPM; `FULL = 50` em `film.js`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `engine.js`) |
| Prévia ao vivo | ~69 fps (leve) |
| Fontes (OFL) | Inter Tight (títulos), DM Mono (painel, legenda em inglês), Noto Sans SC (chinês) |
| Cores | seis paletas de cinco tons em `PAL`; guarda-chuva `#F2BA1D`/`#D39400`; texto creme `#FBF6EC`, tinta `#111521` |
| Som | o código gera só a imagem; narração, trilha e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Texto da legenda e momento de entrada | `voice/vo.json` | campos `en`, `zh` e `t` de cada fala (`L1`…`L8`) |
| Legenda que o filme lê de fato | `voice/cues.js` | `window.CUES` (`t0`, `t1`, `en`, `zh`); é gerado a partir de `vo.json` por `tools/cues.py` |
| Texto falado pela voz | `voice/lines.json` | campo `text` |
| Ordem e início dos planos | `film.js` | `SHOTS` (`t0` e `kind` de cada plano) |
| Transições entre planos | `film.js` | `TRANS` (segundo → tipo) |
| Título de abertura | `film.js` | `titleCard()`: "LEFT", "BEHIND", "被落下的伞" |
| Cartão final | `film.js` | `endCard()` |
| Painel do alto | `film.js` | `hudInfo()` (hora e clima), `CHS` (capítulos), `hud()` ("LINE 4") |
| Nomes das paradas | `film.js` | `STREETS` e as placas "ELM ST" e "DEPOT" |
| Placas e letreiros | `film.js` | "LOST & FOUND", "CLOSED", "TAKE ONE", "EVERY STOP" e seus pares em chinês |
| Pictogramas | `engine.js` | `G.drop`, `G.cloud`, `G.sunIcon`, `G.moon`, `G.bolt`, `G.item`, `G.umbrella` |
| Paletas | `engine.js` | `PAL`, `CREAM`, `INK`, `G.UMB` |

## Como adaptar

1. **Decida a língua da legenda.** A faixa tem duas linhas fixas (`zh` em cima, `en` embaixo). Para um vídeo só em pt-BR, ponha o texto em português em `en` e deixe `zh` vazio, ou use as duas linhas para português e outra língua. Depois atualize `voice/cues.js`. O `tools/cues.py` gera esse arquivo, mas precisa de `out/voice/dur.json` (durações da voz), que não vem junto; sem ele, edite `cues.js` direto.
2. **Troque os textos da tela.** Títulos, placas, painel e cartão final estão em `film.js`. Cada título em inglês tem um par em chinês logo abaixo; troque ou apague os dois. Escreva em pt-BR com acentos e em maiúsculas, como no original.
3. **Ajuste o tempo.** Os planos começam nos segundos de `SHOTS` e as transições caem nos mesmos números em `TRANS`. Mantenha tudo em múltiplos de 0,5 s para continuar no tempo da música.
4. **Troque os ícones.** Os pictogramas são formas simples em `engine.js`. Mudar cor e tamanho é fácil. Um ícone novo (outro objeto, outro veículo) precisa ser desenhado com `G.disc`, `G.seg`, `G.ring`, `G.poly` e `G.rrect`.
5. **Troque a cor da marca.** O guarda-chuva amarelo é o "herói" que se destaca. Para outra marca, troque `G.UMB` e `G.UMB2` e as paletas de `PAL`, sempre com uma cor quente única contra fundos frios.
6. **Confira trechos** com `?a=` e `?b=` (segundo inicial e final) antes de renderizar o filme todo.

## O que não mexer

- A grade de fundo com fileiras alternadas (`G.pattern`, `G.drawPattern`): é a assinatura do estilo.
- `G.maskText`: o jeito de o texto entrar deslizando por máscara.
- O desfoque de movimento nos trechos rápidos (`FAST` e o laço de cinco subquadros em `window.render`).
- A regra de uma paleta por trecho (`palAt()`).

## Atenção

- **Assinaturas do exemplo:** o cartão final (`endCard()`) mostra "LemoLab × Claude Opus 5.5" e "PICTOGRAM MOTION 象形运动图形". Troque pelo nome da marca do usuário ou apague.
- **Nomes fictícios:** "Line 4", as ruas (ELM ST, MILL RD…), o depósito e os números 312 e 313 são inventados e aparecem no painel, nas placas e na legenda.
- **Duas fontes de legenda:** `voice/vo.json` é a origem, mas o filme lê `voice/cues.js`. Se mudar só o `vo.json`, nada muda na tela.
- **Letras com acento:** as três fontes têm os acentos do português. O `index.html` só pré-carrega os caracteres chineses das legendas; isso não afeta o português.
- **Modos especiais:** `?nocap=1` tira a legenda. `?a=10&b=20` mostra só o trecho entre os segundos 10 e 20.
