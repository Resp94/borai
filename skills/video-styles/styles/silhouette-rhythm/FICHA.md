# Silhuetas no ritmo

**Slug:** `silhouette-rhythm` · **Categoria:** Gráfico e tipografia · **Filme de exemplo:** 49 s, 1920×1080

## O visual

Silhuetas escuras contra um pôr do sol, com reflexo na água. O céu é um degradê que vai do laranja `#FFB347` e `#FF801F`, passando pelo vermelho `#FC4D2B` e pelo magenta `#E0245C`, até o violeta `#380A52`, com o sol baixo e um rastro de brilho na água. Tudo se move na batida (120 BPM, uma batida a cada meio segundo): cabeças sobem, patas pisam, asas abrem, e cada passo deixa um anel na água.

O filme de exemplo acompanha um bando de flamingos e um filhote que está sempre meio tempo atrasado:
- cinco cabeças sobem na batida, e uma cabecinha pula atrasada no meio;
- o bando marcha e vira junto; o filhote não;
- os adultos decolam um a cada meia batida, e o filhote fica para trás;
- a primeira corrida do filhote sai fora do tempo, ele tropeça, a imagem congela e ele cai na água;
- os anéis que o bando deixou na água marcam a batida; o filhote conta, corre no tempo e decola;
- ele alcança a fila no céu e entra no passo.

Não há narração nem legenda. O único texto é o título no fim, no canto de baixo à esquerda, em creme `#FFF3E4`: "HALF A BEAT" com a última palavra entrando atrasada, "慢半拍" ao lado, o nome do estilo e a assinatura.

## Quando usar

**Bom para:**
- clipes e vídeos guiados pela música;
- esporte e equipes (sincronia, alguém que aprende o ritmo do grupo);
- aberturas de natureza e de festival.

**Evite para:** explicações, dados, textos ou falas. A história é contada só por movimento e ritmo.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 49 s (`DUR = 49.0` em `film.js`; uma batida `B = .5` s) |
| Formato | feito para horizontal 1920×1080. O canvas segue o tamanho da janela e a escala é calculada pela altura (`K = H / 1080`); o título fica em posição fixa (`TX`, `TY`), então outros formatos não foram pensados |
| Prévia ao vivo | ~45 fps (leve); usa WebGL |
| Fontes (OFL) | Anton (título), Barlow Condensed Medium (nome do estilo e assinatura), Noto Sans SC 900 e 500 (texto em chinês); todas recortadas só para os caracteres do exemplo |
| Cores | céu do laranja `#FF801F` ao violeta `#380A52` (`rampA` em `sky.js`), texto `#FFF3E4` |
| Som | o código gera só a imagem; trilha e efeitos do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Planos e o que acontece em cada um | `film.js` | blocos `// ---------- shot 1` a `shot 9` (elenco e tempos) e `// ---- 1` a `9b` (desenho de cada plano) |
| Momentos-chave | `film.js` | por exemplo `TRIP`, `FZ1` (tropeço e congelamento), `LEAD` (decolagem do líder), `LINE` (a fila) |
| Trechos com música | `film.js` | `MUSIC` (início e fim de cada trecho em segundos) |
| Cor e altura do sol ao longo do filme | `film.js` | "the sky clock", logo antes de `MUSIC` |
| Título final | `film.js` | `TITLE` (segundo em que cada palavra entra) e `drawTitle()`, que desenha "HALF", "A", "BEAT", "慢半拍", "Silhouette Rhythm · 剪影律动" e a assinatura |
| Posição do título | `film.js` | `TX`, `TY` |
| Forma do flamingo em pé e voando | `shapes.js` | `flamingo()` e `flyer()` |
| Poses | `film.js` | `POSE`, `STANCE`, `DEEP` |
| Céu, sol e água | `sky.js` | shader (`rampA`, sol, brilho na água) |

## Como adaptar

1. **Comece pelo título.** Troque as palavras e o nome do estilo em `drawTitle()` e os tempos em `TITLE`. Se o título mudar de tamanho, confira `TX` e `TY`.
2. **Siga a batida da nova música.** Tudo está em segundos sobre a grade de meia em meia batida (`B = .5`). Se a música tiver outro andamento, os tempos dos planos precisam ser refeitos.
3. **Mude cores** no shader de `sky.js` para outro céu (amanhecer, noite).
4. **Outro animal ou outro grupo:** os flamingos são desenhados em código (`shapes.js`). Trocar cores, tamanho do bando e tempos é fácil; trocar por outro bicho ou por pessoas exige redesenhar `flamingo()` e `flyer()` e refazer as poses.
5. **Confira os quadros** em vários segundos (cabeças, marcha, decolagem, tropeço, anéis na água, título) antes de renderizar.

## O que não mexer

- `sky.js`: o céu, o sol e a água com reflexo.
- As três camadas de desenho (silhuetas, reflexos e luz na água) que o shader junta: são o que dá o contraluz.
- A regra de tudo na batida, com o filhote meio tempo atrás até o final: é a história do estilo.

## Atenção

- **Assinaturas do exemplo:** o título final escreve "LemoLab × Claude Opus 5.5" e "Silhouette Rhythm · 剪影律动" (`film.js`). Troque pela marca do usuário ou apague.
- **Crédito obrigatório da trilha original:** a trilha do exemplo usa a bateria "MuldjordKit" (Lars Muldjord), licença CC BY 4.0. Se o usuário usar essa trilha, ela precisa ser creditada.
- **Fontes recortadas:** os arquivos em `fonts/` só têm os caracteres do exemplo (`make_fonts.py`). Texto novo, inclusive letras com acento, pode virar quadrado; nesse caso, recorte as fontes de novo com `make_fonts.py` (ele precisa das fontes originais, que o `build.sh` baixa) em vez de trocar a fonte.
- **Sem modos especiais:** o código não lê parâmetros de URL.
