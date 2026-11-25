---
task: "Responder Comentários"
order: 1
input: |
  - comentarios: lista de comentários com @ (texto ou print)
  - palavra_chave: a palavra pedida no post e o que foi prometido (se houver)
output: |
  - contagem: número de comentários por grupo
  - respostas: respostas prontas, agrupadas por grupo
  - perguntas_para_reel: perguntas que devem virar Reel de resposta
---

# Responder Comentários

Separa os comentários por valor e escreve as respostas na ordem certa, sem
gastar alcance com quem não merece.

## Process

1. Ler o `voice.md` do perfil e todos os comentários.
2. Classificar cada comentário em PALAVRA-CHAVE, LEAD, SUBSTÂNCIA, PERGUNTA, APOIO ou RUÍDO e dizer a contagem.
3. Escrever as respostas nessa ordem; parar quando o valor acabar (APOIO recebe curtida e no máximo 3 a 8 palavras; RUÍDO, nada).
4. Marcar cada PERGUNTA com muitas curtidas como Reel de resposta (fórmula #16).
5. Rodar `python3 agents/ig-human/tools/humanize.py respostas.txt --report` e corrigir.
6. Entregar com o portão: nada é postado sem o "sim".

## Output Format

```yaml
contagem:
  palavra_chave: 41
  lead: 2
  substancia: 3
  pergunta: 2
  apoio: 34
  ruido: 2
respostas:
  - grupo: "LEAD"
    para: "@conta"
    comentario: "..."
    resposta: "..."
perguntas_para_reel:
  - para: "@conta"
    pergunta: "..."
    curtidas: 34
```

## Output Example

> Use as quality reference, not as rigid template.

```
RESPOSTAS  ·  84 comentários  ·  41 PALAVRA-CHAVE, 2 LEAD, 3 SUBSTÂNCIA,
                                 2 PERGUNTA, 34 APOIO, 2 RUÍDO

PALAVRA-CHAVE (41)  mandar a cláusula. Uma linha cada, mesma gentileza, texto diferente.

LEAD
@marina.design - "aconteceu exatamente isso comigo em junho"
> Marina, o que resolveu pra gente foi tirar o pagamento da aprovação e prender
> na data de entrega. Se quiser, te mando o texto da cláusula.

SUBSTÂNCIA
@joao.dev - "eu coloco multa de 2% + juros, funciona melhor"
> João, boa. A gente usa multa também, mas só depois que o vencimento virou
> data. Sem data, a multa não tem de onde contar.

PERGUNTA -> REEL
@carla.foto - "e se o cliente se recusar a assinar?"
  34 curtidas nesse comentário. Isso é um Reel, não uma resposta. Fórmula #16.

RUÍDO (2)  pulados. Responder daria alcance.

Nada foi postado. Responda "sim" e é só colar.
```

## Quality Criteria

- [ ] Contagem por grupo antes das respostas.
- [ ] Respostas na ordem de valor.
- [ ] Perguntas para Reel marcadas.

## Veto Conditions

Reject and redo if ANY are true:
1. Houve resposta a ruído ou a hater.
2. A mesma resposta foi copiada para vários comentários.
3. Uma pergunta simples foi mandada para a DM em vez de respondida.
