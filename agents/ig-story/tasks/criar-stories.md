---
task: "Criar Stories"
order: 1
input: |
  - tema: o assunto do dia ou a oferta a aquecer
  - objetivo: volume de resposta, palavras do público, correção de equívoco, clique ou venda (opcional)
output: |
  - quadros: lista de 3 a 7 quadros com visual, fala e figurinha
  - destino_das_respostas: o que fazer com quem respondeu
---

# Criar Stories

Escreve a sequência de Stories do dia, quadro a quadro, com a figurinha certa
no lugar certo e o plano para as respostas.

## Process

1. Ler `voice.md` e, se existir, `plan.md` do perfil em `_opensquad/_memory/instagram/{perfil}/`.
2. Definir o objetivo do dia e escolher a figurinha pelo trabalho dela (enquete, caixa de pergunta, quiz, link, contagem regressiva, "sua vez").
3. Escrever na forma ABERTURA (algo acontecendo hoje, com rosto ou mão) → MEIO (2 quadros de conteúdo) → PEDIDO (quadro 4, uma figurinha) → FECHAMENTO (resposta, resultado ou gancho para amanhã).
4. Rodar `python3 agents/ig-human/tools/humanize.py falas.txt --report` nas falas e corrigir o que for apontado.
5. Escrever o destino das respostas: quem responde recebe resposta individual; respostas da caixa de pergunta viram ideias de Reel.

## Output Format

```yaml
quadros:
  - n: 1
    visual: "[selfie andando]"
    fala: "..."
    figurinha: null
  - n: 4
    visual: "[texto sobre foto]"
    fala: "..."
    figurinha: "enquete: Sim / Ainda não"
destino_das_respostas: "..."
```

## Output Example

> Use as quality reference, not as rigid template.

```
STORIES  ·  terça  ·  5 quadros

1  [selfie, andando na rua]   "Terceiro pedido de reembolso do ano. Mesmo motivo."
2  [gravação de tela]         a cláusula do contrato, com a frase grifada
3  [falando para a câmera]    "Aprovação é sensação. Entrega é data."
4  [enquete]                  "Já levou calote depois de uma aprovação?"
                              Sim / Ainda não
5  [texto sobre foto da mesa] "Responde aqui que eu te mando a cláusula."

Depois: todo mundo que votar "Sim" recebe uma resposta individual com a
cláusula. Esse é o funil inteiro: a pessoa falou primeiro.
Humanizador: falas limpas, nota humana 84 APROVADO.
```

## Quality Criteria

- [ ] 3 a 7 quadros, o primeiro com rosto ou mão.
- [ ] Pedido no quadro 4, com uma figurinha só.
- [ ] Destino das respostas escrito.

## Veto Conditions

Reject and redo if ANY are true:
1. O pedido está no último quadro de uma sequência de 6 ou 7.
2. Algum quadro tem parágrafo ou é repost sem comentário.
3. O plano inclui mandar DM para quem não interagiu.
