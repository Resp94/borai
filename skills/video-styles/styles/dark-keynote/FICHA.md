# Keynote tech escuro

**Slug:** `dark-keynote` · **Categoria:** Telas e interfaces · **Filme de exemplo:** 42 s, 1920×1080

## O visual

Fundo quase preto `#0A0B0F` com grade discreta e brilhos suaves, como o palco de um lançamento de produto. Tudo é interface desenhada em código: janelas, ícones, notificações, fotos, barras de armazenamento. Só existe uma cor de destaque, um verde-limão `#B7F34A`, usada no cursor, no botão e nos números que importam.

O filme começa com um cursor digitando uma frase. A câmera se afasta e a tela se enche de janelas e notificações até afogar o cursor. Um toque congela tudo, as janelas voam para uma grade e viram o app organizado. Depois vem um número gigante que embaralha e trava dígito por dígito ("12,408 files."), uma barra de tempo, e o filme volta ao cursor, que digita de novo a frase do começo.

A legenda é texto simples, sem faixa. A última fala não vira legenda: é digitada na tela pelo próprio cursor.

## Quando usar

**Bom para:**
- lançamento de app, SaaS ou recurso novo;
- abertura de keynote ou demo de produto;
- mostrar "antes e depois" de organização, velocidade ou limpeza;
- números de impacto com um só destaque.

**Evite para:** temas emocionais, pessoas, natureza, histórias com personagens ou qualquer coisa que não caiba numa tela de computador.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 42 s (120 BPM; `DUR = 42` em `timeline.js`) |
| Formato | só horizontal, 1920×1080 (`W`, `H` fixos em `engine.js`; canvas fixo em `index.html`) |
| Prévia ao vivo | ~43 fps (leve) |
| Fontes (OFL) | Inter (interface), Inter Tight (títulos e números grandes), JetBrains Mono (rótulos e créditos) |
| Cores | fundo `#0A0B0F`→`#151822`, texto `#E8EAF0`, destaque `#B7F34A`, vermelho de alerta `#FF5A5F` |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração / legenda | `lines.json` | campo `text` de cada fala (`l1`…`l6`); `onscreen: true` = digitada, sem legenda |
| Quando cada fala entra | `timeline.js` | `K.vo` (segundo de cada fala) |
| Frase digitada no início e no fim | `timeline.js` | `K.title` ("Room to think.") |
| Legenda da frase final | `main.js` | `window.ECHO_SUB` (texto e tempos fixos) |
| Todos os tempos de ação | `timeline.js` | objeto `K` (puxada da câmera, congelar, grade, número, cartão final) |
| Janelas e notificações do caos | `world.js` | `items()` e `NOTIFS` |
| Janela do app (nome, abas, regras) | `film.js` | `GNAME`, `COUNTS`, `rules`, `segs`, textos "Tidy", "Tidy up", "All clear" |
| Número grande | `film.js` | `'12,408'`, `'files.'` e `'TIDY  ·  FIRST RUN'` |
| Cartão final | `film.js` | função `sceneEnd()` |
| Logotipo do app | `engine.js` | `tidyMark()` e `wordmark()` |
| Cor de destaque | `engine.js` | `PAL.accent` ou `setAccent('#hex')` |
| Cartaz | `frames.js` | função `poster()` (abre com `?scene=poster`) |

## Como adaptar

1. **Troque a marca.** O app fictício se chama "Tidy" em vários lugares: `lines.json`, `film.js` (barra da janela, botão, número, cartão final) e `engine.js` (`tidyMark()`, `wordmark()`). Troque todos pelo nome do produto do usuário.
2. **Troque a cor de destaque** com `setAccent()` ou em `PAL.accent`. É a única cor do filme; mantenha uma só.
3. **Troque o texto.** Falas em `lines.json`, frase do cursor em `K.title`, número e rótulos em `film.js`. Números grandes funcionam melhor curtos (até 6 caracteres): o `scramble()` trava um dígito de cada vez.
4. **Ajuste o tempo.** Se a narração mudar, atualize `voices/dur.json` e `K.vo`. A legenda fica pelo menos 1,8 s. Se mudar `K.title`, ajuste também `window.ECHO_SUB` em `main.js`.
5. **Conteúdo das janelas:** as janelas, fotos e notificações são desenhos genéricos em código (`windowContent()`, `photo()`, `notif()` em `engine.js`). Trocar textos é fácil; mostrar a interface real do produto exige redesenhar essas funções.
6. **Confira os quadros** em vários segundos (cursor, caos, grade, número, final) antes de renderizar.

## O que não mexer

- `engine.js`: é a biblioteca de interface (painéis, brilho, grade, câmera, embaralhar números).
- `world.js`: posições e voo das janelas até a grade (`snap()`, `poseAt()`).
- A regra de uma cor só de destaque.
- O ritmo de `timeline.js`: os tempos de imagem e música saem da mesma tabela.

## Atenção

- **Assinaturas do exemplo:** o cartão final traz "Room to Think", "a launch film for Tidy, a fictional app", "Dark Tech Keynote · Lemo-Opuscar" e "LemoLab × Claude Opus 5.5", além de créditos de voz e música do exemplo. Troque pelo nome da marca do usuário ou apague.
- **`timeline.json`:** é gerado a partir de `timeline.js` pelo `tools/dump_timeline.mjs`. Mude os tempos em `timeline.js`, não no JSON.
- **Letras com acento:** as fontes podem não ter todos os caracteres. Se aparecer um quadrado no lugar de uma letra, avise o usuário em vez de trocar a fonte.
- **Modos especiais:** `?scene=poster` e `?scene=engineDemo` mostram quadros fixos. `?nosub` tira a legenda.
