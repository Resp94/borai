# Programa de auditório rítmico

**Slug:** `game-show` · **Categoria:** Jogos · **Filme de exemplo:** 148,8 s, 1920×1080

## O visual

Um programa de auditório em forma de jogo de ritmo. Desenho chapado em SVG, contorno preto grosso `#1B1B1B`, cores fortes de festa (amarelo `#FFD23F`, laranja `#FF8C42`, rosa `#FF8FB1`, roxo `#6B4FBB`, azul `#4D7CFE`), com um fundo de cor por cena. Tudo acontece na batida: personagens caem do céu, pulam, gritam "Hey!" e recebem um "Perfect!" quando acertam o tempo. A cada corte, a tela pisca e dá um soquinho de zoom.

Os personagens são "feijões" redondos com antena, cada um com uma cor e um acessório, e um crachá com o nome.

O filme de exemplo conta a história da IA de 1997 a 2026:
- abertura com o elenco inteiro e a contagem "1, 2, 3, 4";
- sete fases, cada uma aberta por um cartão "GAME N" com nome e anos;
- uma rodada "REMIX 2026!";
- um boletim final com as notas e os créditos.

Não há legenda na tela: as falas são gritos curtos em inglês e saem só num arquivo `.srt` separado (`make_srt.py`).

## Quando usar

**Bom para:**
- linhas do tempo de tecnologia, de uma empresa ou de um produto;
- retrospectivas do ano, com várias "fases";
- vídeos de variedade e humor rápido.

**Evite para:** temas sérios, explicações detalhadas ou textos longos. A tela comporta título curto, ano e crachás.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 148,8 s (150 BPM, 93 compassos; `END_BAR = 93` e `window.DUR = at(END_BAR)` em `main.js`) |
| Formato | só horizontal, 1920×1080 (tamanho fixo no CSS e no `viewBox` do SVG em `index.html`) |
| Prévia ao vivo | ~53 fps (leve) |
| Fontes (OFL) | Noto Sans SC (textos em chinês), Fredoka (títulos, anos, "Perfect!", crachás), ZCOOL KuaiLe (dois cartazes escritos à mão); em `fonts/`, declaradas em `fonts.css` |
| Cores | contorno `#1B1B1B`, creme `#FFF6E5`, amarelo `#FFD23F`, laranja `#FF8C42`, vermelho `#FF5A5F`, roxo `#6B4FBB`, azul `#4D7CFE` (`K` em `main_v1.js`) |
| Som | o código gera só a imagem; gritos, trilha e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

O filme é montado em três passos. `assemble.py` junta `main_v1.js` (cores, ritmo, ajudantes) e `main_b.js` (personagens e cenas) em `main.js`; depois `build.py` junta `frame_head.html` e `main.js` em `index.html`. **Edite `main_b.js` ou `main_v1.js`, nunca o `main.js` nem o `index.html` direto.**

| O que mudar | Arquivo | Onde |
|---|---|---|
| Ordem e início de cada fase | `main_b.js` | `SECT` dentro de `buildAll()` (compasso de início de cada fase) |
| Cartão de cada fase | `main_b.js` | chamadas `card(...)`: número, nome, anos, cores e ícone |
| Abertura | `main_b.js` | primeira `scene(...)` de `buildAll()`: título e subtítulo |
| Rodada final | `main_b.js` | cena de `SECT.rmx`: "REMIX 2026!" e a frase de baixo |
| Boletim e créditos | `main_b.js` | bloco de `SECT.end` (título do boletim e caixa de créditos) |
| Personagens e crachás | `main_b.js` | `CAST` (cor, barriga, antena, acessório e `name` de cada um) |
| Gritos | `voices/shouts.json` | `text` de cada grito; o `id` é chamado nas cenas como `ev(..., 'v:id')` |
| Cores | `main_v1.js` | `K` |
| Ritmo e duração | `assemble.py` | troca `BPM` para 150 e `END_BAR` para 93 ao montar o `main.js` |

## Como adaptar

1. **Planeje as fases.** Cada fase ocupa 9 compassos no exemplo. Para outra história, defina quantas fases quer e ajuste `SECT`, os cartões `card(...)` e as cenas de cada fase.
2. **Troque os textos** dos cartões, da abertura, do remix e do boletim. Escreva em pt-BR com acentos e frases curtas.
3. **Troque o elenco** em `CAST`: nome no crachá, cores e acessórios. Mudar a aparência além disso exige mexer em `bean()`.
4. **Gritos:** reescreva `voices/shouts.json` mantendo os `id` usados nas cenas.
5. **Monte e confira:** rode `assemble.py` e `build.py`, abra `index.html?t=SEGUNDOS` em vários pontos (abertura, um cartão de fase, um "Perfect!", o boletim) antes de renderizar.

## O que não mexer

- `frame_head.html`: estilos da página, filtros SVG e os ajudantes de animação.
- `bean()` e `pose()`: o jeito dos personagens pularem e reagirem na batida.
- A grade de compassos (`at(compasso, tempo)`) e os soquinhos de zoom e piscadas nos cortes (`PUNCH`, `CUTS`): são o ritmo do estilo.

## Atenção

- **Conteúdo muito específico:** as cenas foram escritas uma a uma para a história da IA. Adaptar para outro tema é reescrever cenas, não só trocar textos.
- **Texto na tela em chinês:** títulos, cartões, boletim e créditos estão em chinês. Tudo precisa ser traduzido.
- **Nomes de produtos e pessoas reais:** os crachás usam nomes de modelos de IA (GPT, Claude, Gemini, Llama, DeepSeek, Midjourney, Sora e outros) e a fase de 2011 cita pessoas reais pelo primeiro nome. Troque ou confira com o usuário antes de publicar.
- **Assinaturas do exemplo:** os créditos finais escrevem "LemoLab × Claude Opus 5.5" e uma frase em chinês dizendo que o filme foi gerado por Claude Opus 5.5 (bloco de `SECT.end` em `main_b.js`). Troque pela marca do usuário ou apague.
- **Fontes baixadas:** os arquivos de `fonts/` são fatias baixadas do Google Fonts por `fetch_fonts.mjs`; `fonts.css` diz qual fatia cobre quais caracteres. Se aparecer um quadrado no lugar de uma letra acentuada, a fatia não tem aquele caractere; avise o usuário em vez de trocar a fonte.
- **Modo especial:** `?t=SEGUNDOS` abre a página parada naquele segundo.
