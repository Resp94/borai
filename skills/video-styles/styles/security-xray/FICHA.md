# Raio-X de segurança

**Slug:** `security-xray` · **Categoria:** Instrumentos e provas · **Filme de exemplo:** 51,9 s, 1920×1080

## O visual

A tela de um aparelho de raio-X de aeroporto, de madrugada. Malas e objetos passam pela esteira e aparecem nas cores falsas do equipamento: laranja `#ff8a1a` para orgânico, verde `#6bdc2e` para mistura, azul `#2f7dff` para metal. Em volta da imagem fica a interface do console: relógio, contador de bagagens, botões (`STOP`, `OS`, `Z+`, `MARK`…) e painéis laterais.

Os objetos são modelos 3D simples montados em código (three.js). O operador marca um item com uma caixa, abre um painel com a regra e carimba o veredito: verde para liberado, vermelho para barrado. Há uma passagem para uma vista em CT girando em volta do objeto, e no fim a câmera recua para fora do monitor, mostrando a cabine e o céu clareando.

A legenda é uma placa escura no canto inferior esquerdo, fixa na tela, com duas linhas: chinês em cima, inglês embaixo.

## Quando usar

**Bom para:**
- mostrar o que tem "dentro" de algo (bagagem, encomenda, produto);
- explicar regras de transporte, alfândega ou inspeção;
- humor seco no tom de relatório técnico, com uma surpresa no meio.

**Evite para:** rostos e pessoas, temas que pedem cores naturais, ou muito texto corrido. Os painéis comportam rótulos curtos e uma regra por vez.

## Ficha técnica

| Item | Valor |
|---|---|
| Duração do exemplo | 51,9 s (49,7 s de história em `DUR_IN`, esticados pelos trechos de `WARP` no `film.js`) |
| Formato | horizontal, desenhado em 1920×1080; o quadro acompanha o tamanho da janela (`innerWidth`, `innerHeight`), mas a composição é horizontal e não foi feita para vertical |
| Prévia ao vivo | ~35 fps (média) |
| Fontes (OFL) | IBM Plex Mono (interface e inglês), Noto Sans SC (chinês) |
| Cores | orgânico `#ff8a1a`, mistura `#6bdc2e`, metal `#2f7dff`; textos da interface em azul-claro (objeto `C` no `film.js`) |
| Dependência | three.js 0.170 (já listado no `package.json` da skill; o `index.html` carrega de `/node_modules/three`) |
| Som | o código gera só a imagem; narração e trilha do exemplo não vêm junto |

## Onde está o conteúdo

| O que mudar | Arquivo | Onde |
|---|---|---|
| Falas da narração | `voice/lines.json` | campo `text` de cada fala (`v01a`…`v13`) |
| Quando cada fala entra | `film.js` | `VO` (id e segundo de entrada) |
| Legendas | `film.js` | `SUBS` (início, fim, chinês, inglês) |
| Momentos de cada cena | `film.js` | `T`, `PB`, `WA`, `CR`, `DW`, `SU`, `ST` (segundos da história) |
| Relógio e contador | `film.js` | `CLK` (hora mostrada) e `BAGS` (número de bagagens) |
| Rótulos e regras nos painéis | `film.js` | chamadas de `bi('中文', 'INGLÊS', …)` em `pbOverlay()`, `bottleOverlay()`, `monitorFrame()` e na vista CT |
| Vereditos | `film.js` | chamadas de `stamp(…, '中文', 'INGLÊS', …)` |
| Resumo do turno | `film.js` | `summary()` |
| Tela final | `film.js` | `endCard()` |
| Objetos na esteira | `props.js` | `suitcase()`, `laptop()`, `umbrella()`, `sneakers()`, `books()`, `thermos()`, `trayMisc()`, `backpack()`, `tote()`, `lunch()` |
| Caixa com os caranguejos | `crab.js` | `crabBox()` e `crab()` |
| Ritmo (trechos esticados) | `film.js` | `WARP` |

## Como adaptar

1. **Comece pelo texto.** Troque as falas em `voice/lines.json` e as legendas em `SUBS`. Cada legenda tem uma linha em chinês e outra em inglês: troque as duas pelo pt-BR ou deixe uma vazia.
2. **Troque os rótulos e as regras** nas chamadas de `bi()` e `stamp()`. O primeiro texto é a linha grande; o segundo, a linha menor embaixo.
3. **Ajuste o tempo.** Se a narração mudar, mexa nos segundos de `VO` e `SUBS`; se a cena precisar de mais tempo, mexa em `WARP` e nos blocos `T`, `PB`, `WA`, `CR`.
4. **Contador e relógio:** os números da madrugada estão em `CLK` e `BAGS`. Troque para combinar com a nova história.
5. **Objetos novos:** cada objeto é uma função em `props.js` montada com formas do three.js. Trocar o conteúdo de uma mala é fácil; um objeto novo exige montar a função, registrá-lo em `IT` e ajustar a altura em `HL`. O caranguejo que mexe a perna é o mais trabalhoso de trocar (`crab.js` e o enquadramento `TW`).

## O que não mexer

- `xr.js`: é o motor que faz a imagem de raio-X a partir dos modelos 3D.
- `story()`, `filmT()` e `KN`: convertem o tempo da história no tempo do filme.
- `SWEEPS` e `sweepOver()`: a varredura entre os cortes faz parte do estilo.
- As três cores de material (`C.org`, `C.mix`, `C.met`): são o código de leitura do raio-X.

## Atenção

- **Assinaturas do exemplo:** a tela final (`endCard()`) traz "LemoLab × Claude Opus 5.5", o título "安检口的夜班 / Night Shift at Lane 3" e o nome do estilo. Troque pelo nome da marca do usuário ou apague.
- **Chinês em todo lugar:** legendas, rótulos (`bi()`), vereditos (`stamp()`), resumo e tela final. A fonte chinesa é recortada só para os caracteres do exemplo (`make_fonts.py`).
- **Letras com acento:** se aparecer um quadrado no lugar de uma letra, a fonte não tem aquele caractere; avise o usuário em vez de trocar a fonte.
- **Regras reais:** o filme cita regras de aviação chinesas (100 Wh para power bank, 100 mL por frasco em voo internacional, frutos do mar vivos fora da cabine). Para outro país, confira as regras antes de usar.
- **Sem modos especiais:** o `film.js` não lê parâmetros de URL (não há `?frame`, `?nosub` nem `?poster`).
- **Material de terceiros:** o `CREDITS` diz que não há fotos nem modelos externos; tudo é montado em código. A marca e o contador do console são inventados.
