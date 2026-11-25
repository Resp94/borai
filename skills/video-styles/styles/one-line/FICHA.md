# Desenho de linha contínua

**Slug:** `one-line` · **Categoria:** Luz e linhas · **Filme de exemplo:** 47,5 s, 1920×1080

## O visual

Uma única linha de tinta preta `#1D1A17` corre sobre papel creme `#F4EFE4` sem nunca levantar a caneta. A espessura muda com a velocidade: rápido fica fino, devagar fica grosso e a tinta empoça. A câmera fica perto da ponta da caneta e acompanha o traço; só no fim ela se afasta e mostra que todos os desenhos formavam o rosto de um velho.

No exemplo, cada parte do rosto é uma fase da vida:
- orelha esquerda: o nascimento (a mãozinha que segura um dedo);
- topo da cabeça: uma pipa;
- óculos: uma bicicleta;
- boca: o primeiro amor, o único trecho em vermelho `#B3332B`;
- nariz: a casa;
- olho direito: a perda (a caneta para alguns segundos);
- orelha direita: o filho;
- contorno do rosto: a velhice, com o traço tremido.

No fim, a caneta passa para a mão de uma criança, que começa uma linha nova. As sombras das mãos e da caneta aparecem por cima do papel.

A legenda é escrita à mão (Caveat), pequena e discreta, e "se escreve" da esquerda para a direita. O título e o cartão final são escritos em letra cursiva no papel em branco.

## Quando usar

**Bom para:**
- histórias de marca e de família;
- marcos da vida, homenagens, aniversários;
- anúncios minimalistas com uma ideia só.

**Evite para:** listas, dados, explicações com muitos passos ou muito texto. Também não serve para mostrar produto em detalhe: tudo é uma linha só.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 47,5 s (`DUR` em `story.js`) |
| Formato | o canvas é 1920×1080 em `index.html`; `main.js` lê `W` e `H` do canvas, mas as posições de câmera, título e cartão final foram feitas para horizontal |
| Prévia ao vivo | ~56 fps (leve) |
| Fontes (OFL) | Caveat (legenda e rótulos), Sacramento (título cursivo) |
| Cores | papel `#F4EFE4`, tinta `#1D1A17`, vermelho do amor `#B3332B` (`PAPER`, `INK`, `RED` em `ink.js`) |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas e legenda | `story.js` | `VO`: `text`, `t0` (entrada), `dur` e `sub` (quando a legenda entra e sai) |
| Falas para gerar a voz | `lines.json` | campo `text`; mantenha igual ao `VO` |
| Título | `story.js` | `TITLE` (`text`, `sub`, tempos) |
| Cartão final | `subs.js` | `endCard()`: título, "ONE-LINE DRAWING" e assinatura escritos direto no código |
| Momento da troca de mãos | `story.js` | `HAND` (`enter`, `grip`, `oldOut`, `newLine`) e `END` |
| O desenho e seus trechos | `face.js` | `SEGS`: cada trecho tem `id`, estilo de traço e tempo `t` de início e fim |
| Movimento de câmera | `shots.js` | `CAM` (segundo, centro x e y, zoom `z`, giro `r`, quanto segue a caneta `f`) |
| Estilo do traço por fase | `ink.js` | espessura e opacidade de `child`, `teen`, `love`, `adult`, `old`, `kid` |

## Como adaptar

1. **Comece pelas falas.** Troque o texto em `VO` (`story.js`) e repita em `lines.json`. Frases curtas: a legenda tem uma linha só.
2. **Ajuste os tempos.** Depois de gerar a voz, atualize `t0`, `dur` e `sub` de cada fala. As falas foram encaixadas em pontos exatos do desenho (por exemplo, "goes" quando a caneta volta a andar), então confira cada encaixe.
3. **Troque título e cartão final** em `TITLE` e em `endCard()`.
4. **Desenho novo:** a linha é um caminho de curvas escrito à mão em `face.js`. Trocar o rosto ou as fases da vida exige redesenhar esses caminhos e refazer os tempos de `SEGS` e as posições de `CAM`. É o trabalho mais pesado deste estilo.
5. **Confira os quadros** em vários segundos (nascimento, primeiro amor, perda, recuo final, troca de mãos) antes de renderizar.

## O que não mexer

- `ink.js`: é o que faz a tinta engrossar, empoçar e tremer.
- `paper.js`: textura e grão do papel.
- A regra de uma linha contínua: a linha só para na "perda" e na troca de mãos. Cortes no traço quebram o estilo.

## Atenção

- **Assinaturas do exemplo:** o cartão final escreve "The Line That Never Lifted", "ONE-LINE DRAWING" e "LemoLab × Claude Opus 5.5" direto em `endCard()` (`subs.js`). Troque pela marca do usuário ou apague.
- **O desenho é todo código:** o rosto e as cenas dentro dele não são imagem. Dá para mudar falas, tempos, cores e câmera com facilidade; mudar o que a linha desenha exige redesenhar os caminhos de `face.js`.
- **Depende de arquivos fora da pasta:** vários arquivos importam `/core/lib.js` da skill. A prévia precisa ser servida a partir da raiz da skill.
- **Letras com acento:** se aparecer um quadrado no lugar de uma letra, a fonte não tem aquele caractere; avise o usuário em vez de trocar a fonte.
- **Modos especiais:** `?nosub` tira legenda, título e cartão final; `?poster` e `?clean` também. `?all` mostra a linha inteira já desenhada. `?nopen` esconde caneta e mãos. `?cam=x,y,z` fixa a câmera.
