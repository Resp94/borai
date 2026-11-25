---
task: "Escrever Legenda"
order: 1
input: |
  - conteudo: o roteiro do Reel, os slides do carrossel ou a descrição do post
  - termos_de_busca: duas ou três frases pelas quais o perfil quer ser encontrado (opcional; perguntar se faltar)
  - palavra_chave: palavra para o pedido de comentário, se houver
output: |
  - legenda: texto pronto para colar
  - primeiro_comentario: texto do primeiro comentário, se houver link
  - texto_alternativo: descrição da imagem (foto/carrossel)
  - recibo: trabalho A/B, espaço visível usado, pedido, termos, veredito do caption.py
---

# Escrever Legenda

Escreve a legenda pronta para colar, conferida pelo humanizador e pelo
`caption.py`, com um recibo que mostra cada decisão.

## Process

1. Ler o conteúdo do passo anterior e o `voice.md` do perfil. Decidir trabalho A (o vídeo já fisgou) ou B (a legenda é o conteúdo) e dizer qual.
2. Escrever: primeira linha (A: o pedido, claro; B: o gancho), corpo em 2 a 6 parágrafos curtos com os termos de busca, um pedido, até cinco hashtags na última linha.
3. Rodar `python3 agents/ig-human/tools/humanize.py legenda.txt -o legenda-limpa.txt --report` e reescrever à mão os vícios de estrutura apontados.
4. Rodar `python3 agents/ig-caption/tools/caption.py legenda-limpa.txt --keywords "termo 1,termo 2"`. Corrigir toda FALHA; decidir em voz alta cada ATENÇÃO.
5. Se houver link, escrever o primeiro comentário. Se houver imagem, escrever o texto alternativo.
6. Entregar a legenda num bloco pronto para colar e o recibo.

## Output Format

```yaml
trabalho: "A - o Reel carrega o gancho"
legenda: |
  ...
primeiro_comentario: "..."
texto_alternativo: "..."
recibo:
  visivel: "118 de 125 caracteres antes do corte"
  pedido: "comentar CONTRATO"
  hashtags: 3
  busca: ["contrato de prestação de serviço (linha 3)"]
  linter: "PRONTA"
```

## Output Example

> Use as quality reference, not as rigid template.

```
LEGENDA (trabalho A - o Reel já carrega o gancho)

Comenta CONTRATO que eu te mando a cláusula que me teria salvado R$ 18 mil.

Foi num contrato de prestação de serviço com uma agência, em março de 2024.
O cliente sumiu depois da entrega e eu não tinha como cobrar.

Faltava uma cláusula de multa por atraso no pagamento. Uma frase.

Hoje ela está em todo contrato que eu mando, e eu leio o rodapé antes de assinar.

#contratos #freelancer #prestacaodeservicos

LEGENDA PRONTA
trabalho:   A - o Reel carrega o gancho
visível:    78 de 125 caracteres antes do corte (o pedido aparece inteiro)
pedido:     um, comentar CONTRATO
hashtags:   3, todas de tema
busca:      "contrato de prestação de serviço" na linha 3
humanizador: nota humana 81 APROVADO
linter:     PRONTA
Nada foi postado. É só colar.
```

## Quality Criteria

- [ ] Trabalho A ou B declarado.
- [ ] Um pedido, com palavra-chave digitável quando for comentário.
- [ ] Veredito PRONTA no `caption.py` ou ATENÇÃO justificada.

## Veto Conditions

Reject and redo if ANY are true:
1. A primeira linha começa com saudação, hashtag, menção ou emoji.
2. Há link no corpo da legenda ou mais de cinco hashtags.
3. Há mais de um pedido de ação.
