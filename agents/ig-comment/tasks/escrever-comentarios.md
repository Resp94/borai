---
task: "Escrever Comentários"
order: 1
input: |
  - posts: texto ou print de cada post, com o @ da conta
  - modo: individual (duas opções por post) ou rodada (uma por post)
output: |
  - comentarios: por post, opções rotuladas com o tipo
  - recomendacao: qual postar e por quê (modo individual)
  - registro: contas comentadas na semana
---

# Escrever Comentários

Escreve comentários específicos que fazem o usuário parecer um par, e registra
quem já foi comentado para não repetir.

## Process

1. Ler `voice.md`, `plan.md` e `log.md` do perfil em `_borai/_memory/instagram/{perfil}/`. Avisar se alguma conta foi comentada demais na semana.
2. Para cada post, entender o que ele é e escolher o tipo de comentário que cabe (nunca sempre o tipo 1).
3. Escrever: modo individual, duas opções de tipos diferentes; rodada, uma por post. De uma a três frases, uma ideia, sem abertura proibida.
4. Rodar `python3 agents/ig-human/tools/humanize.py comentarios.txt --report` e corrigir.
5. Entregar com a recomendação e acrescentar as contas comentadas ao `log.md` do perfil.

## Output Format

```yaml
comentarios:
  - conta: "@conta"
    opcoes:
      - tipo: "6 · Comprovante"
        texto: "..."
      - tipo: "3 · Discordar com respeito"
        texto: "..."
    recomendacao: "..."
registro: ["@conta"]
```

## Output Example

> Use as quality reference, not as rigid template.

```
OPÇÕES DE COMENTÁRIO  (no reel da @contaexemplo sobre preço)

[6 · Comprovante]
A gente subiu 40% em março do ano passado e perdeu exatamente um cliente, justo o
que ocupava metade da caixa de entrada. Levou oito meses pra eu perder o medo.

[3 · Discordar com respeito]
Concordo com a âncora de preço. Só não faria no meio do projeto: tentamos isso e
perdemos uma renovação que estava tranquila.

Posta o primeiro: ele concede algo e tem um número.

Registro da semana: @contaexemplo (1ª vez), @outraconta (2ª vez, segura até sexta).
Humanizador: os dois limpos.
```

## Quality Criteria

- [ ] Tipos diferentes nas duas opções.
- [ ] Nenhum comentário genérico.
- [ ] Registro atualizado.

## Veto Conditions

Reject and redo if ANY are true:
1. Algum comentário abre com elogio genérico ou só tem emoji.
2. Algum comentário vende, tem link ou pede para seguir.
3. Algum comentário passa de três frases ou tem duas ideias.
