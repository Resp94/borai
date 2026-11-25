---
task: "Escrever DM"
order: 1
input: |
  - pessoa: @, o que faz, o que postou ou fez
  - gatilho: o motivo real para mandar hoje
  - objetivo: conversa, venda, parceria ou indicação
  - tipo: entrega de palavra-chave, contato aquecido ou parceria
output: |
  - mensagem: texto pronto, com contagem de caracteres
  - follow_ups: dois, com o dia de cada
---

# Escrever DM

Escreve a mensagem certa para quem se mexeu primeiro, com os dois follow-ups
e mais nenhum.

## Process

1. Conferir se há gatilho. Sem gatilho, parar e dizer isso. Se o pedido for DM fria, avisar que é o pior uso da hora e oferecer duas semanas de comentários antes.
2. Ler o `voice.md` e o `log.md` do perfil.
3. Escrever conforme o tipo: entrega (coisa prometida + como usar + pergunta de quatro palavras), contato aquecido (2 a 4 frases, coisa específica, dar antes de pedir, um pedido pequeno), parceria (quatro linhas).
4. Escrever os follow-ups: +4 dias com algo novo; +10 dias encerrando.
5. Rodar `python3 agents/ig-human/tools/humanize.py dm.txt --report` e corrigir. Contar caracteres.

## Output Format

```yaml
tipo: "contato aquecido"
mensagem: "..."
caracteres: 212
follow_ups:
  - dia: "+4"
    texto: "..."
  - dia: "+10"
    texto: "..."
```

## Output Example

> Use as quality reference, not as rigid template.

```
TIPO: entrega de palavra-chave  (@marina.design comentou CONTRATO)

MENSAGEM 1  (198 caracteres)
Marina, aqui está: a cláusula de pagamento na entrega, em texto pra copiar.
[cláusula]
Cola logo depois do prazo, antes do preço.
Você trabalha mais com identidade ou com site?

FOLLOW-UP +4 dias  (só se ela não respondeu)
Marina, lembrei de você: saiu um modelo de aditivo pra contrato que já foi
assinado. Se servir, te mando.

FOLLOW-UP +10 dias
Vou parar de te mandar coisa por aqui. Se um dia precisar revisar contrato,
é só chamar.

Humanizador: as três mensagens limpas. Envio à mão (ou pela automação oficial
de palavra-chave, se você usa).
```

## Quality Criteria

- [ ] Gatilho citado.
- [ ] Contagem de caracteres em cada mensagem.
- [ ] Dois follow-ups e nenhum a mais.

## Veto Conditions

Reject and redo if ANY are true:
1. A entrega da palavra-chave foi condicionada a uma pergunta.
2. A primeira mensagem para contato aquecido tem link, agenda ou mais de quatro frases.
3. Algo foi inventado sobre a pessoa ou sobre uma relação em comum.
