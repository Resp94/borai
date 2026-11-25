# Sinfonia da cidade

**Slug:** `city-symphony` · **Categoria:** Edição e documentário · **Filme de exemplo:** 52,0 s, 1920×1080

> **Precisa de mídia própria:** a imagem deste filme é montada em Python com vídeos e fotos de terceiros, que não vêm junto. A prévia fica preta. Num filme novo, o material vem do usuário.

## O visual

Um dia inteiro de Nova York, da madrugada à madrugada seguinte, montado com filmagens reais em time-lapse. Os carros viram rios de luz, as nuvens escorrem como água e as multidões viram névoa: os quadros são somados (`blend` em `tools/prep.py`), como uma câmera de obturador aberto. Todo corte cai numa batida da música.

A imagem passa por um tratamento único: curva de filme, cor um pouco lavada (`SAT = .86`), tom quente, brilho nas luzes, grão, vinheta e faixas pretas de cinema 1.85:1 em cima e embaixo. O único acento de cor é o laranja de lâmpada de rua `#D9772F` (`SODIUM`).

Momentos marcantes do exemplo:
- abertura caindo de uma foto noturna tirada do espaço até a cidade;
- grade que se multiplica no ritmo: 2, 4, 9 e 16 quadros ao mesmo tempo;
- tela dividida com um filme de 1899 de um lado e o mesmo lugar hoje do outro;
- pedestres viram pontos e rastros laranja (efeito `trails`);
- o dia volta de trás para frente em flashes de 4 e 2 quadros, e corta seco no preto;
- página de livro antigo, citação e cartela final.

Não há narração. O texto aparece solto sobre a imagem, alinhado à esquerda, sem caixa de fundo: números grandes que "travam" dígito a dígito, linha laranja embaixo e um relógio de 24 h no canto inferior direito.

## Quando usar

**Bom para:**
- filmes de cidade, de lugar ou de "um dia em…";
- montagens musicais e aberturas;
- comparar passado e presente;
- mostrar dois ou três números fortes no meio das imagens.

**Evite para:** explicações longas, entrevistas, temas sem filmagem própria ou livre para usar. O estilo vive de material filmado; sem ele não há filme.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 52,0 s (120 BPM, compasso de 2 s; `DUR = bar(26)` em `tools/timeline.py`) |
| Formato | só horizontal, 1920×1080 (`W, H` fixos em `tools/render.py`), com faixas 1.85:1; a versão "small" do `build.sh` só reduz para 1280 de largura |
| Prévia ao vivo | ~100 fps, mas não mostra o filme: o `index.html` é só uma lista de textos para a checagem de leitura (tela preta com "28 text spans") |
| Como a imagem é feita | Python, quadro a quadro (`tools/render.py`), não no navegador |
| Fontes (OFL) | Michroma (letras latinas, em maiúsculas) e Noto Sans SC (chinês) |
| Cores | texto branco quente `#EDE8DF`, texto secundário `#B0AAA0`, acento laranja `#D9772F` |
| Som | trilha original gerada por `tools/music.py`; o arquivo de áudio do exemplo não vem junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Textos na tela (título, números, legendas dos números, citação, cartela final) | `tools/render.py` | função `texts(t, f)`, chamadas `L.text(id, x, y, texto, …)` |
| Créditos da cartela final | `tools/render.py` | `CREDIT_LINES` |
| Relógio de 24 h | `tools/render.py` | `dial_hour()` (hora em cada segundo) e `draw_dial()` |
| Legendas (.srt) | `cues.json` | `t0`, `t1` e `text` (duas línguas separadas por `\n`) |
| Lista de planos | `tools/shots.py` | chamadas `clip()` e `photo()`, listas `MONT`, `POOL`, `GRID_STAGES`, `FLASH_SRC` |
| Arquivos de vídeo usados | `tools/shots.py` | `V` (apelido → arquivo em `raw/`) |
| Tratamento de cada fonte (cortes de logo, ruído) | `tools/prep.py` | `PRE` |
| Ritmo e seções | `tools/timeline.py` | `BPM`, `bar()` e os marcos `NOON`, `GRID`, `BRAKE`, `DUSK`, `FLASH`, `STOP`, `CARD`, `SLATE` |
| Música | `tools/music.py` | `CH` (acordes) e `PLAN` (acorde por compasso) |
| Fontes de terceiros | `SOURCES.jsonl` | uma linha por arquivo |

## Como adaptar

1. **Junte o material.** Cada vídeo ou foto vira uma linha em `SOURCES.jsonl`. Campos que o código lê: `name`, `file` (ex.: `raw/meu.mp4`), `url`; e, para registro, `page`, `title`, `credit`, `license`, `date`. Exemplo: `{"name": "praia", "file": "raw/praia.mp4", "url": "https://…", "page": "https://…", "credit": "Fulano", "license": "CC BY 4.0"}`. Rode `python3 tools/fetch_sources.py` para baixar o que falta. Fotos ficam em `raw/<name>.jpg`.
2. **Monte os planos** em `tools/shots.py`. Um plano de vídeo é `clip(id, entrada, saída, apelido, segundo_na_fonte, velocidade, blend=…)`. Velocidade 40 = time-lapse 40× mais rápido; `blend` alto faz o rio de luz; uma lista como `[(0, 1.0), (.6, 6.0)]` faz rampa de velocidade. Use sempre `bar(compasso, tempo)` para entrada e saída, assim o corte cai na batida.
3. **Limpe o `PRE`** em `tools/prep.py`: os recortes ali escondem logos de fontes específicas do exemplo. Para fontes novas, apague as linhas antigas e crie as suas se precisar.
4. **Troque os textos** em `texts()`. Posição em pixels (x, y) e tempos já estão no código; mantenha frases curtas. Os números usam `counter()` (conta até o valor) ou `lock_digits()` (trava dígito a dígito).
5. **Ajuste a música** se mudar o tamanho ou as seções: `tools/timeline.py` é a única fonte de tempo para imagem e som.
6. **Confira quadros** com `python tools/render.py --still 11.2 a.jpg 30 b.jpg` antes do filme inteiro. O `build.sh` faz tudo: clipes, música, imagem, legendas, mixagem, cartaz.

## O que não mexer

- `grade()`, `finish()`, `LUT` e `SAT` em `render.py`: são o tratamento de cor, grão e faixas pretas que dão unidade ao estilo.
- `tools/prep.py` (curva de velocidade e soma de quadros): é o que transforma filmagem comum em rio de luz.
- A regra de que todo corte sai de `bar()`: cortes fora da batida quebram o estilo.

## Atenção

- **Material de terceiros (licenças):** os vídeos são CC BY 3.0 (Scott Herder, David Schwab, Longfellow Films, Joe Cavallini, 350.org, Branded Cities) e CC BY 2.0 (Steven Kelley, Jason Eppink, Sunny Ripert). CC BY exige crédito com autor, título e licença: se usar qualquer um deles, mantenha a linha correspondente em `CREDITS` e em `CREDIT_LINES`. O resto é domínio público: filme de 1899 (Library of Congress), Fuzileiros Navais dos EUA (DVIDS), foto da NASA, fotos de Carol M. Highsmith e a página de Walt Whitman (Internet Archive). Num filme novo, troque tudo por material do usuário ou com licença conferida, e atualize `SOURCES.jsonl`, `CREDITS` e `CREDIT_LINES`.
- **Nada de mídia na pasta:** `raw/` não existe. Os vídeos e fotos (cerca de 1 GB) são baixados por `tools/fetch_sources.py`, que lê `SOURCES.jsonl`. As fontes Michroma e Noto Sans SC também são baixadas por ele; na pasta `fonts/` só estão os textos de licença.
- **Música:** usa amostras CC0 (Versilian Studios: VS Chamber Orchestra e VCSL) que não estão aqui. O `build.sh` chama um `tools/fetch.sh` da biblioteca que não existe nesta pasta, e espera um Python em `.venv/`. Sem isso, a música não sai.
- **Arquivos citados que faltam:** `CREDITS` fala em `SOURCES.md` (gerado por `tools/used.py`) e `FACTS.md`; nenhum dos dois está na pasta.
- **Dados reais:** população de 2020 (Censo dos EUA), contagens da Ponte do Brooklyn (NYC DOT, 2024) e pedestres da Times Square (2024). Num filme novo, troque e guarde a fonte de cada número.
- **Texto em chinês na tela:** título, legendas dos números, citação e cartela têm uma linha em chinês (`title_cn`, `pop_cn`, `bb_cn`, `q_cn`, `s_title_cn`, …) e as legendas em `cues.json` também. Troque por pt-BR.
- **Página do livro presa à imagem:** `page_frame()` ilumina uma linha da página escaneada numa altura medida para aquele scan (`ph * .850`). Com outra página, refaça esse valor.
- **Assinaturas do exemplo:** a cartela final escreve "LemoLab × Claude Opus 5.5" (`s_lemo` em `render.py`). O `fetch_sources.py` se identifica como "LemoOpuscar/1.0" ao baixar. Troque pelo nome da marca do usuário ou apague.
- **Letras com acento:** Michroma é a fonte das letras latinas. Se aparecer um quadrado no lugar de uma letra, a fonte não tem aquele caractere; avise o usuário em vez de trocar a fonte.
