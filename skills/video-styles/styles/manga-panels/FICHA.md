# Quadros de mangá

**Slug:** `manga-panels` · **Categoria:** Desenhos animados · **Filme de exemplo:** 48 s, 1920×1080

> **Precisa de imagens próprias:** as 18 figuras do exemplo foram geradas por IA e não podem ser reaproveitadas, então a prévia mostra os quadros sem figuras. Num filme novo, o material vem do usuário.

## O visual

Uma página de mangá impressa que se monta no ritmo da música. Só três cores: tinta preta (`#121212`), papel creme (`#F3F0E8`) e um vermelhão (`#F03C1E`) usado como único destaque. Os cinzas viram retícula, pontos a 45°, como na impressão de mangá.

Os quadros nascem um a um, com borda grossa e sarjeta branca. Por cima entram as ferramentas do gênero, todas desenhadas em código:
- linhas de foco e linhas de velocidade;
- onomatopeias grandes em katakana (パシャッ, ドクン, バサバサッ…), com contorno branco;
- caixas de narração, gritos em letra pincelada e balões de fala;
- quadros de impacto em negativo nos cortes, tremida de câmera no tempo forte e granulação de papel.

As figuras (a fotógrafa, a câmera, a cidade, os pombos) **não** são desenhadas em código: são imagens geradas por IA e passadas para retícula por `tools/prep.py`. O exemplo é um clipe: a letra da música aparece na tela como texto do mangá.

## Quando usar

**Bom para:**
- clipes e vídeos guiados por música;
- lançamento de produto com clima de anime (o produto vira o "herói" do quadro);
- aberturas e vinhetas com muita energia e cortes no tempo.

**Evite para:** explicações longas, dados e números, ou vídeos sem imagens geradas. Sem as figuras, sobram só os quadros vazios com retícula e texto.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 48 s (160 BPM, 29 compassos mais o final; `dur` em `beats.json`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `kit.js`) |
| Prévia ao vivo | ~67 fps (leve) |
| Fontes (OFL) | Noto Sans SC 900 e Noto Serif SC 900 (letra da música), Dela Gothic One (onomatopeias e marca), Barlow Condensed 600 e 800 itálico (textos em inglês) |
| Cores | tinta `#121212`, papel `#F3F0E8`, destaque vermelhão `#F03C1E` (`INK`, `PAPER`, `ACC` em `kit.js`) |
| Imagens | 18 imagens em `img/*.png` (nomes em `NAMES`, no fim de `film.js`); **não vêm junto** |
| Som | o código gera só a imagem; a trilha e os efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Letra na tela, tempos e tipo de cada linha | `beats.json` | `lines`: `text`, `t0`, `t1` e `kind` (`box`, `shout`, `balloon`, `brand`, `sfx`) |
| Ritmo e cortes | `beats.json` | `bpm`, `offset` e `cuts` (compasso de cada corte) |
| Créditos da página final | `beats.json` | `colophon` |
| Posição e tamanho da letra | `film.js` | `LY` (uma entrada por linha) |
| Ordem das cenas | `film.js` | `SCENES` (corte → função `S_…`) |
| Quadros de impacto | `film.js` | `FLASH` |
| Onomatopeias | `film.js` | chamadas `sfx(t, 'パシャッ', …)` em cada cena |
| Título e marca | `film.js` | "KOMA ONE", "PANEL 1" em `S_title`; "KOMA ONE", "口袋相机", "POCKET CAMERA" e o slogan na cena final (`S_end`) |
| Imagens | `img/` | uma PNG por nome de `NAMES` (`shoot`, `hero`, `city`, `eye`, `pig`…) |
| Preparo das imagens | `tools/prep.py` | transforma uma imagem comum em preto, branco, retícula e vermelho |

## Como adaptar

1. **Gere as imagens primeiro.** O filme precisa de um personagem, um produto e alguns fundos novos, todos gerados por IA para o tema do usuário. Gere com fundo verde puro quando for figura ou produto, passe cada uma por `tools/prep.py` (opção `--key` para recortar o verde) e salve em `img/<nome>.png` com os mesmos nomes de `NAMES`. O exemplo usava `tools/gen_all.sh` e `tools/gen_camswap.sh`, mas eles dependem de arquivos que não vêm junto (`prompts/`, `tools/style_suffix.txt` e um gerador externo).
2. **Troque a letra** em `beats.json`. Cada linha tem início e fim em segundos e um tipo. Escreva em pt-BR com acentos e frases curtas: os gritos (`shout`) usam letra de 118 a 190 px e cabem poucas palavras.
3. **Regere as fontes.** As fontes foram recortadas só com as letras do exemplo (veja abaixo). Depois de mudar os textos, inclua os novos caracteres nas listas de `tools/fonts.sh`, apague os `.woff2` correspondentes e rode o script de novo.
4. **Troque as onomatopeias** nas chamadas `sfx()`. Elas podem continuar em japonês (faz parte do gênero) ou virar onomatopeias em português ("CLIQUE!", "TUM", "VUSH").
5. **Ajuste o ritmo** só por `beats.json`: `bpm` e `cuts` mudam todos os cortes, as tremidas e os quadros de impacto de uma vez.

## O que não mexer

- `kit.js`: retícula (`tone()`, `lineTone()`), linhas de foco e velocidade, contorno branco (`halo()`), quadros, balões e onomatopeias. É o que faz parecer mangá impresso.
- As três cores. O vermelhão é o único destaque; colocar mais cores quebra o estilo.
- A granulação de papel (`grain()`) e os quadros de impacto em negativo (`flash()`).

## Atenção

- **Imagens não incluídas:** a pasta `img/` não existe neste pacote. Sem ela, o filme roda, mas os quadros aparecem sem as figuras (o código só avisa "missing" no console). Pelo `CREDITS`, as 15 ilustrações originais foram geradas para este exemplo e não podem ser reaproveitadas em outro filme; cada vídeo novo precisa gerar as suas.
- **Fontes recortadas:** as cinco fontes só têm os caracteres do exemplo. A Barlow tem só A–Z, a–z e números, **sem acentos**; a Dela Gothic One tem só katakana e as letras de "KOMA ONE"; as Noto SC têm só os ideogramas usados. Letras novas aparecem como quadrados até rodar `tools/fonts.sh` com a lista nova.
- **Letra em chinês:** as linhas de `beats.json` estão em chinês e as onomatopeias em japonês. Tudo precisa ser trocado.
- **Assinaturas do exemplo:** a página final mostra "LemoLab × Claude Opus 5.5", "黑白漫画分格 / Manga Panels" e o `colophon` de `beats.json` ("Images: Codex · Music: made in code"). Troque pelo nome da marca do usuário ou apague. A marca "KOMA ONE" e a câmera são fictícias.
- **Sem modos especiais:** o `film.js` não lê parâmetros de URL; não há `?nosub` nem quadros fixos.
