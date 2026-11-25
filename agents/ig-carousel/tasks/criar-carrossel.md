---
task: "Criar Carrossel"
order: 1
input: |
  - tema: o tema ou ângulo escolhido no checkpoint anterior
  - fatos: números, passos ou exemplos concretos disponíveis (opcional)
output: |
  - slides: lista numerada com papel, título e texto de cada slide
  - texto_alternativo: descrição da capa
  - orientacao_legenda: indicação de trabalho B para o Redator de Legendas
  - humanizador: nota e veredito do detect.py
---

# Criar Carrossel

Escreve o texto de um carrossel de 6 a 10 slides para aprovação antes de
qualquer arte, com capa forte, slide 2 independente e slide de resumo.

## Process

1. Ler `voice.md` e `swipe.md` do perfil em `_opensquad/_memory/instagram/{perfil}/`. Confirmar que o tema tem sequência; se for uma afirmação só, recomendar Reel e parar.
2. Escrever a capa (até 6 palavras + 1 linha de promessa) e o slide 2 (por que importa, em uma frase).
3. Escrever os slides do meio: uma ideia cada, título de 3 a 7 palavras, até 25 palavras embaixo, numerados (3/8).
4. Escrever o slide de resumo (a lista inteira, legível sem contexto) e o slide final com um pedido só.
5. Rodar `python3 agents/ig-human/tools/humanize.py slides.txt -o slides-limpo.txt --report` e `python3 agents/ig-human/tools/detect.py slides.txt slides-limpo.txt`; reescrever os vícios apontados.
6. Escrever o texto alternativo da capa e entregar a lista para aprovação. Só no "sim" registrar no `log.md` do perfil.

## Output Format

```yaml
slides:
  - n: 1
    papel: CAPA
    titulo: "..."
    texto: "..."
texto_alternativo: "..."
orientacao_legenda: "trabalho B: a capa já usou as seis palavras"
humanizador: "nota humana 80 APROVADO"
```

## Output Example

> Use as quality reference, not as rigid template.

```
CARROSSEL  ·  8 slides  ·  1080x1350

1  CAPA     A CLÁUSULA DE R$ 18 MIL
            Uma linha que agora vai em todo contrato meu.
2  O RISCO  Aprovaram o trabalho. Nove dias depois pediram o dinheiro de volta.
3/8         O QUE ELA DIZ
            Pagamento na entrega, não na aprovação.
4/8         POR QUE "APROVAÇÃO" É ARMADILHA
            Aprovação é sensação. Entrega é data. Só data se cobra.
5/8         ONDE ELA ENTRA
            Logo depois do prazo, antes do preço. Quem lê preço para de ler.
6/8         COMO FALAR COM O CLIENTE
            "Fica mais simples pros dois: entregou, venceu."
7/8 RESUMO  1. Pagamento na entrega  2. Data, não sensação
            3. Antes do preço  4. Uma frase pro cliente
8/8 PEDIDO  Comenta CONTRATO que eu te mando a cláusula inteira.

@seuperfil em todo slide, canto inferior.
Texto alternativo da capa: "Slide com o título A cláusula de R$ 18 mil em letras grandes sobre fundo claro."
Legenda: trabalho B, gancho na linha 1, um pedido.
Humanizador: nota humana 82 APROVADO.
```

## Quality Criteria

- [ ] 6 a 10 slides numerados, capa com até 6 palavras.
- [ ] Cada slide do meio com uma ideia e até 25 palavras.
- [ ] Slide de resumo e um pedido só no final.

## Veto Conditions

Reject and redo if ANY are true:
1. Algum slide é um parágrafo (mais de 25 palavras abaixo do título).
2. O slide 2 é preparação em vez de motivo.
3. Há número, cliente ou resultado inventado.
