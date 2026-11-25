# Pop art

**Slug:** `pop-art` · **Categoria:** Impressão e gravura · **Filme de exemplo:** 52 s, 1920×1080

## O visual

Uma serigrafia pop: só três tintas, vermelho `#E4232B`, amarelo `#FFD21F` e azul `#1E62B0`, mais o preto `#141414` do contorno, sobre papel creme `#F8F2E2`. Os tons intermediários são feitos com pontos de retícula (Ben-Day) num ângulo de 45°, e as cores saem um pouco desencaixadas do contorno, como numa impressão de verdade. Quando a câmera se aproxima, os pontos crescem na tela.

O filme de exemplo explica por que quase toda banana do mercado é a mesma planta copiada:
- uma banana impressa e, em seguida, uma parede inteira de cópias carimbadas cada vez mais rápido;
- a banana antiga (Gros Michel) sendo "comida" pelos pontos até ficar preta;
- a troca para a Cavendish e a ameaça nova;
- uma onda de cor que transforma a parede em muitas bananas diferentes;
- cartão final.

Os títulos são rótulos brancos com contorno preto e sombra colorida deslocada, em letras grossas, que entram e saem pela lateral. A legenda é uma caixa branca com sombra vermelha, em duas línguas: chinês em cima e inglês embaixo.

## Quando usar

**Bom para:**
- explicar um objeto do dia a dia;
- pôsteres de marca e de produto;
- pequenas histórias com um número forte ("1.000+", "2019").

**Evite para:** temas delicados, rostos e pessoas reais, ou textos longos. Cada rótulo comporta uma palavra grande e uma linha pequena.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 52 s (`dur` em `timeline.json`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `main.js`; canvas fixo em `index.html`) |
| Prévia ao vivo | ~50 fps (leve); usa WebGL2 |
| Fontes (OFL) | Anton e Archivo Black (títulos e inglês), Noto Sans SC Black (chinês, recortada só para os caracteres do exemplo) |
| Cores | vermelho `#E4232B`, amarelo `#FFD21F`, azul `#1E62B0`, preto `#141414`, papel `#F8F2E2` (`INK` em `engine/pop.js`) |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas para gerar a voz | `voice/lines.json` | campo `text` de cada trecho (`v01_a`, `v02_b`…) |
| Legenda e tempos | `timeline.py` | `CUES` (início, trechos de voz, texto em chinês, texto em inglês) e `SHOTS` (início de cada plano) |
| Linha do tempo pronta | `timeline.json` | gerado por `timeline.py`; é o que `main.js` lê |
| Rótulos na tela | `main.js` | chamadas `label(...)` em cada plano: "ONE PLANT. COPIED.", "GROS MICHEL", "PANAMA DISEASE", "CAVENDISH", "TROPICAL RACE 4", "2019 → COLOMBIA", "1,000+", "MANY BANANAS" |
| Cartão final | `main.js` | o último `label(...)` (perto de `SH.card`) |
| Tipos de banana | `banana.js` | `VAR` (comprimento, curva, grossura e tinta de cada variedade) |
| Banana, fatia e planta | `banana.js` | `banana()`, `slice()`, `plant()` |
| A parede de cópias | `main.js` | `ORDER` e `STAMP` (ordem e ritmo dos carimbos) |

## Como adaptar

1. **Comece pelo roteiro.** Troque as falas em `voice/lines.json` e as legendas em `CUES` (`timeline.py`). A legenda tem duas linhas: se o vídeo for só em português, ponha o texto em pt-BR na linha principal e decida com o usuário o que fazer com a segunda.
2. **Gere a voz e rode `timeline.py`.** Ele lê a duração das falas em `out/voice/dur.json` e escreve o `timeline.json`. Ajuste `SHOTS` se um plano precisar de mais tempo.
3. **Troque os rótulos** nas chamadas `label(...)` de `main.js`: uma palavra grande em cima, uma linha pequena embaixo.
4. **Outro objeto:** a banana é desenhada em código (`banana.js`). Trocar cores e proporções em `VAR` é fácil; trocar a banana por outro objeto exige desenhar uma função nova no lugar de `banana()` e conferir todos os planos.
5. **Confira os quadros** em vários segundos (parede de cópias, banana preta, onda de cor, cartão final) antes de renderizar.

## O que não mexer

- `engine/pop.js`: é a impressora (três chapas de cor, retícula, preto e desencaixe).
- Usar só as três tintas e a retícula: cores "de tela" (degradês, tons fora das chapas) quebram o estilo.

## Atenção

- **Assinaturas do exemplo:** o cartão final escreve "POP ART · 波普艺术" e "LemoLab × Claude Opus 5.5" (fim dos planos em `main.js`). Troque pela marca do usuário ou apague.
- **Legenda em chinês e inglês:** a primeira linha de cada legenda e a segunda linha dos rótulos estão em chinês. A fonte chinesa foi recortada só para os caracteres do exemplo; texto novo em chinês exige recortar de novo (`tools/font_subset.py`).
- **Fatos do exemplo:** os números e datas falados são da história da banana. Para outro tema, confirme cada fato com o usuário.
- **Depende de arquivos fora da pasta:** `main.js` importa `/core/lib.js` da skill. A prévia precisa ser servida a partir da raiz da skill.
- **Letras com acento:** Anton e Archivo Black estão em `fonts/`. Se aparecer um quadrado no lugar de uma letra, a fonte não tem aquele caractere; avise o usuário em vez de trocar a fonte.
- **Modos especiais:** `?nosubs=1` tira a legenda. `?from=a&to=b` mostra só um trecho da linha do tempo. `?sign10=1` põe a assinatura no canto entre 7,5 s e 10 s (para o corte de 10 s).
