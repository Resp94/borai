# Contagem regressiva em tela dividida

**Slug:** `countdown` · **Categoria:** Telas e interfaces · **Filme de exemplo:** 59,5 s, 1920×1080

> **Precisa de mídia própria:** as fotos e câmeras (NASA) não vêm junto, então a prévia mostra os quadros de imagem vazios. Num filme novo, o material vem do usuário.

## O visual

O último minuto de um lançamento de foguete contado em tempo real, sem cortar o tempo: um segundo de filme é um segundo do relógio. A tela começa com uma só câmera. Conforme a contagem avança, a tela se divide em mais quadros: câmeras, foto, documento, gráfico e lista de etapas. Na contagem final, cada número falado abre um quadro novo numa grade 3×3. Na ignição, os nove quadros se juntam numa imagem só, com um clarão branco.

Elementos fixos:
- relógio grande `T−0:32` na parte de baixo, com quem está no controle (solo, foguete, Houston);
- caixa de transcrição ao vivo com a fala original, palavra por palavra;
- etiqueta em cada quadro (`CAM 1`, `PHOTO`, `DOC`…) e um selo dizendo se a câmera está sincronizada ("LIVE SYNC"), só no mesmo período ("SAME WINDOW") ou em câmera lenta devolvida ao tempo real;
- quadros vazios marcados "STANDBY" antes de entrarem;
- faixas laranja de evento no quadro principal.

Fundo quase preto `#06080A`, quadros `#0B0E11`, texto branco `#F2F5F7`, cinza `#7C878D` e laranja `#FF5B1F` como único destaque.

## Quando usar

**Bom para:**
- lançamentos, aberturas, inaugurações, viradas de ano: qualquer coisa com contagem;
- eventos ao vivo filmados de vários ângulos ao mesmo tempo;
- mostrar "tudo acontecendo junto" com relógio e dados.

**Evite para:** temas sem um momento marcado no relógio, sem várias câmeras do mesmo instante ou sem áudio original do evento. O estilo depende de material sincronizado; com poucas imagens, os quadros ficam vazios.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 59,5 s (`DUR = 59.5`, ignição em `T0 = 32.5`, 30 fps; tudo no `index.html`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos e canvas de 1920×1080) |
| Prévia ao vivo | ~99 fps (leve), mas sem as imagens: sem a pasta `frames/`, os quadros de câmera, a foto e o documento aparecem pretos |
| Fontes (OFL) | Barlow e Barlow Condensed (números e texto), IBM Plex Mono (rótulos), Noto Sans SC (chinês, recortada só com os caracteres do filme) |
| Cores | fundo `#06080A`, quadros `#0B0E11`, texto `#F2F5F7`, cinza `#7C878D`, laranja `#FF5B1F`, vermelho "ao vivo" `#FF3B30` |
| Som | o áudio do filme é o som original da transmissão mais dois trechos de narração e trilha (`audio/mix.py`); nada disso vem junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Transcrição na caixa e legendas | `index.html` | `CUES`: `who` (`kc`, `loop`, `nar`), `t0`, `t1`, `zh` (linha traduzida) e `w` (palavras com o segundo de cada uma) |
| Quem fala | `index.html` | `WHO` |
| Quando a tela se divide e onde fica cada quadro | `index.html` | `LAY` (tempo + retângulo `[x, y, largura, altura]` por quadro); grade em `GX`, `GY`, `gc()` |
| Etiquetas das câmeras | `index.html` | `LABEL` e `SYNC` |
| Momento zero e duração | `index.html` | `T0`, `DUR` |
| Quem está no controle | `index.html` | `HANDS` e `HAND_LAB` |
| Lista de etapas da contagem | `index.html` | `CHECK` (`m` = segundos em relação ao zero, `heard` = quando foi falado) |
| Etapas depois do zero | `index.html` | `FLIGHT` |
| Faixas laranja de evento | `index.html` | `FLAGS` |
| Nomes sobre a foto | `index.html` | `CREW` (posição horizontal de 0 a 1, nome, função) |
| Linhas destacadas no documento | `index.html` | `DOC_ROWS` (pixels medidos na imagem `frames/doc.jpg`) |
| Título e cartela final | `index.html` | `drawTitle()` e `drawEnd()` |
| Gráfico de comparação | `index.html` | `drawThrust()` (textos fixos dentro da função) |
| Corte útil de cada câmera | `index.html` | `camRegion()` (evita logos e números gravados na imagem) |
| Sincronia de cada câmera | `tools/prep.sh` | tabela no topo: segundo da fonte = segundo do evento + deslocamento |
| Narração própria | `audio/lines.json` | `text`, `voice`, `speed` de cada fala |

## Como adaptar

1. **Escolha o momento zero** do novo evento e ponha em `T0`. O relógio, os tiques e a lista de etapas contam a partir dele.
2. **Junte as câmeras** do mesmo instante e sincronize cada uma em `tools/prep.sh` (som, clarão ou relógio gravado na imagem). Ele gera `frames/<câmera>/NNNN.jpg` (número do quadro do filme, 30 por segundo). Atualize em `FR` os intervalos de quadros que existem para cada câmera, e os nomes em `SRC` e `LABEL`.
3. **Transcreva o áudio original** em `CUES`, com o segundo de cada palavra em `w`. Exemplo de entrada: `{ who: 'kc', t0: 20.12, t1: 22.42, zh: 'Lá vamos nós.', w: [['And', 20.12], ['here', 20.52], ['we', 20.70], ['go.', 20.84]] }`. O campo `zh` é a linha traduzida; use pt-BR nele. `tools/subs.mjs` exporta as legendas e confere se cada linha cabe numa só linha.
4. **Prenda as trocas de tela às falas.** Cada entrada de `LAY` deve começar no segundo em que algo é dito (no exemplo, "Ten", "nine", "eight"…). Mantenha a regra: a imagem nunca pula no tempo.
5. **Troque os textos de apoio:** `CHECK`, `FLIGHT`, `FLAGS`, `CREW`, `drawThrust()`, `drawTitle()` e `drawEnd()`. Se trocar a foto ou o documento, meça de novo as posições em `CREW` e `DOC_ROWS`.
6. **Confira quadros** com `core/render/still.mjs` (o `build.sh` usa 28,5 s como cartaz) antes de renderizar tudo.

## O que não mexer

- `layoutAt()` e o bloco de junção em `render()` (`merge`): fazem os quadros crescerem, abrirem e se fundirem na ignição.
- `slots()`: desenha os dígitos do relógio em casas fixas para não tremerem.
- A regra de tempo real (tempo do filme = tempo do relógio + `T0`): é a ideia do estilo.

## Atenção

- **Material de terceiros (licenças):** todas as imagens e o áudio principal são da NASA (lançamento da Artemis II, 1º de abril de 2026): sete vídeos, uma foto de John Kraus e uma página de ficha técnica. São obras do governo dos EUA, domínio público nos EUA, mas as regras de mídia da NASA proíbem sugerir aprovação e restringem o uso da insígnia. Num filme novo, troque tudo pelo material do evento do usuário e diga de quem é cada imagem.
- **Nada de mídia na pasta:** `raw/` e `frames/` não existem. O `build.sh` baixa os trechos de vídeo com `tools/grab.py` (lê só os segundos usados do site da NASA, cerca de 400 MB) e a foto e o documento com `tools/footage.py`; depois `tools/prep.sh` gera `frames/`. Sem isso, a prévia mostra os quadros pretos.
- **Som também não vem:** a voz do narrador (Kokoro, voz `bf_emma`, Apache-2.0) é gerada a partir de `audio/lines.json`; em `audio/vo/` só há `dur.json` e `words.json`, sem os `.wav`. A trilha usa amostras CC0 (Versilian Studios) que não estão aqui. O `build.sh` chama um `tools/fetch.sh` da biblioteca que não existe nesta pasta e espera um Python em `.venv/`.
- **Arquivos citados que faltam:** `CREDITS` fala em `SOURCES.md` e `FACTS.md`; nenhum dos dois está na pasta. Falta também o texto de licença da Noto Sans SC em `fonts/` (só há os de Barlow e IBM Plex Mono).
- **Pessoas e marcas reais na tela:** nomes dos quatro astronautas (`CREW`), "NASA", "Artemis II", "Houston", "Integrity", o crédito "NASA/John Kraus" desenhado sobre a foto e a fonte "NASA RS-25" no gráfico. Troque tudo junto com o material.
- **Texto em chinês na tela:** quase todo rótulo tem uma linha em chinês (`LABEL`, `SYNC`, `WHO`, `HAND_LAB`, `CHECK`, `FLIGHT`, `FLAGS`, `CREW`, `DOC_ROWS`, `zh` de `CUES`, título "自己倒数" e cartela final). Troque por pt-BR. Com a troca, a Barlow passa a desenhar essas linhas; a Noto Sans SC recortada não tem letras latinas novas.
- **Texto preso na imagem:** o documento e a foto têm texto próprio (a ficha da NASA mostra "10 DAY TEST FLIGHT", "2 EARTH ORBITS"); `camRegion()` corta as câmeras para esconder números e logos gravados nelas. Com material novo, refaça esses cortes.
- **Assinaturas do exemplo:** a cartela final escreve "LemoLab × Claude Opus 5.5" e "FOOTAGE: NASA · PUBLIC DOMAIN · UNOFFICIAL" (`drawEnd()`). Troque pelo nome da marca do usuário e pelo crédito certo, ou apague.
- **Modos especiais:** o `index.html` não lê nenhum parâmetro de URL.
- **Categoria:** a galeria põe este estilo em "Telas e interfaces"; o `style.json` o classifica como edição e documentário.
