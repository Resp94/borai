# Recorte de papel vermelho

**Slug:** `papercut-red` · **Categoria:** Artes tradicionais · **Filme de exemplo:** 49 s, 1920×1080

## O visual

Tudo é recorte de papel colado em camadas: papel vermelho `#D2201F`, papel de arroz creme `#F2E8D0` e papel azul-noite `#1C2446`, com bordas cortadas, textura e sombra leve entre as camadas. Os personagens se mexem a 12 quadros por segundo, como bonecos de papel articulados.

O filme de exemplo conta a lenda do monstro Nian na véspera do Ano-Novo chinês:
- close da tesoura cortando o papel e cartão de título com letras recortadas;
- a vila à noite apagando as luzes uma a uma;
- uma menina dobra o papel, corta e abre na hora uma flor redonda de papel recortado, na frente da câmera;
- a flor colada na janela brilha contra a luz, as lanternas acendem e o monstro foge;
- amanhecer e cartão final.

A legenda é uma faixa de papel vermelho `#A8111F` com bordas serrilhadas e pontinhos dourados, que "cai" de cima como um enfeite colado na porta.

## Quando usar

**Bom para:**
- Ano-Novo Lunar e festas tradicionais;
- cartões de boas-festas e saudações;
- contos populares, fábulas e lendas.

**Evite para:** temas técnicos, dados, telas de produto ou muito texto. A paleta é quase só vermelho e creme: assuntos que pedem muitas cores perdem a força.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 49 s (120 BPM em 2/4; `DUR = 49` em `story.js`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `main.js`; canvas fixo em `index.html`) |
| Prévia ao vivo | ~53 fps (leve) |
| Fontes (OFL) | Fraunces (título, legenda, assinatura), Ma Shan Zheng (o ideograma 年 no selo do título) |
| Cores | vermelho `#D2201F`, monstro `#B00F26`, papel de arroz `#F2E8D0`, noite `#1C2446`, faixa da legenda `#A8111F` (`PAL` em `paper.js`) |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas e legenda | `story.js` | `VO`: `id`, segundo de entrada `t` e `text` (a legenda sai daqui) |
| Falas para gerar a voz | `lines.json` | campo `text`; mantenha igual ao `VO` |
| Duração de cada fala | `voices/dur.json` | segundos por fala; controla quanto tempo a legenda fica na tela |
| Momentos da história | `story.js` | `T` (cortes da tesoura, título, luzes apagando, dobras, lanternas, fuga, amanhecer) |
| Planos | `story.js` | `SHOTS` (início, fim e nome de cada plano) |
| Título | `main.js` | `buildTitle()`: "NIAN" e "COMES TO TOWN", selo com 年, frase "a red paper-cut tale for New Year's Eve" |
| Cartão final | `main.js` | `REAL.title` ("RED PAPER-CUT") e o fim de `shotReveal()` |
| A flor recortada | `tuanhua.js` | um único gomo de 45° é desenhado e espelhado 8 vezes |
| Menina e monstro | `girl.js`, `nian.js` | desenho e poses (`GPOSE`, `NPOSE`) |
| Vila | `village.js` | casas, janelas e luzes |
| Cartaz | `main.js` | bloco `poster` (abre com `?poster=1`) |

## Como adaptar

1. **Comece pelas falas.** Troque o texto em `VO` (`story.js`) e repita em `lines.json`. A faixa da legenda tem uma linha só e cresce com o texto; frases longas passam da largura da tela.
2. **Ajuste o tempo.** Gere a voz, atualize `voices/dur.json` e, se preciso, mude o `t` de cada fala. As falas foram encaixadas nos momentos de `T` (por exemplo, "red, bright light, and loud noise" bate com `red`, `light` e `noise`).
3. **Troque título e cartão final** em `buildTitle()` e `REAL.title`. As letras viram recortes de papel, uma peça por letra.
4. **Outra história:** a menina, o monstro, a vila e a flor são desenhados em código. Trocar cores e textos é fácil; trocar personagens ou cenas exige redesenhar `girl.js`, `nian.js` ou `village.js` e reescrever os planos em `main.js`.
5. **Confira os quadros** em vários segundos (título, vila, dobra da flor, janela brilhando, final) antes de renderizar.

## O que não mexer

- `paper.js`: textura, borda cortada e sombra entre camadas.
- `fold.js` e `tuanhua.js`: a dobra, o corte e a abertura da flor são o ponto alto do estilo.
- O passo de 12 quadros por segundo dos personagens (`st()` em `main.js`): é o que dá o jeito de boneco de papel.

## Atenção

- **Assinaturas do exemplo:** o cartão final escreve "LemoLab × Claude Opus 5.5" e "RED PAPER-CUT" (`shotReveal()` e `REAL.title` em `main.js`), e o cartaz escreve "Red Paper-cut · LemoLab × Claude Opus 5.5". Troque pela marca do usuário ou apague.
- **Texto fixo em chinês:** o selo do título traz o ideograma 年 ("ano"). Se o tema não for Ano-Novo chinês, troque ou tire o selo.
- **Depende de arquivos fora da pasta:** `main.js` e outros importam `/core/lib.js` da skill. A prévia precisa ser servida a partir da raiz da skill.
- **Letras com acento:** se aparecer um quadrado no lugar de uma letra, a fonte não tem aquele caractere; avise o usuário em vez de trocar a fonte.
- **Modos especiais:** `?nosub=1` tira a legenda. `?poster=1` põe o título numa faixa no alto. `?test=sheet_girl` e `?test=sheet_nian` mostram as folhas de modelo dos personagens.
