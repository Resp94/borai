---
task: "Planejar Semana"
order: 1
input: |
  - fatos_da_semana: o que aconteceu de verdade (checkpoint anterior)
  - oferta_e_publico: o que o perfil vende e para quem (do voice.md ou company.md)
  - temas: os três ou quatro temas do perfil (opcional)
output: |
  - semana: grade com dia, hora, formato, tipo, fórmula e ângulo
  - stories: orientação diária
  - engajamento: 10 contas (5 alcance, 3 pares, 2 compradores)
---

# Planejar Semana

Monta a semana de Instagram a partir do que aconteceu de verdade, usando a
evidência do próprio perfil.

## Process

1. Ler `voice.md`, `swipe.md` e `log.md` do perfil em `_opensquad/_memory/instagram/{perfil}/`. Se faltar a oferta, o público ou os temas, perguntar numa pergunta agrupada.
2. Transformar cada fato da semana em ângulos concretos e classificar por tipo (Prova, Ensino, Opinião, História, Oferta).
3. Escolher 4 a 5 posts (pelo menos 3 Reels), sem dois tipos iguais seguidos e sem tema do log das últimas duas semanas; atribuir a cada um uma fórmula do `agents/ig-reel/tools/hooks.json`, priorizando as do swipe file.
4. Definir horários no fuso do público (seguindo `_opensquad/_memory/algoritmo-e-horario.md`, se existir) e dizer que o gancho pesa mais.
5. Montar a lista de engajamento (5 alcance, 3 pares, 2 compradores) e a orientação de Stories.
6. Entregar e, após aprovação, gravar em `_opensquad/_memory/instagram/{perfil}/plan.md`.

## Output Format

```yaml
semana:
  - dia: "terça"
    hora: "19:30"
    formato: "Reel"
    tipo: "Prova"
    formula: "#5 Tempo Encolhido"
    angulo: "..."
stories: "todo dia, 3 a 5 quadros; caixa de pergunta na quinta"
engajamento:
  alcance: ["@...", "@...", "@...", "@...", "@..."]
  pares: ["@...", "@...", "@..."]
  compradores: ["@...", "@..."]
```

## Output Example

> Use as quality reference, not as rigid template.

```
SEMANA DE 15/09  (horários de Brasília, público de empresas)

SEG  só engajamento (20 min, lista abaixo)
TER  07:30  REEL       PROVA     #5  Tempo Encolhido   proposta de 5 horas para 20 minutos
QUA  só Stories + engajamento
QUI  07:00  CARROSSEL  ENSINO    legenda trabalho B    a cláusula em 4 slides
SEX  07:30  REEL       OPINIÃO   #2  Ordem Negativa    para de fazer reunião de diagnóstico
SÁB  -
DOM  18:00  REEL       HISTÓRIA  #21 Começo no Meio    o e-mail pedindo reembolso

STORIES  todo dia, 3 a 5 quadros; caixa de pergunta na quinta.

ENGAJAMENTO  (antes de postar)
  alcance:     @conta1 @conta2 @conta3 @conta4 @conta5
  pares:       @par1 @par2 @par3
  compradores: @cliente1 @cliente2  (comentar por semanas antes de qualquer DM)

Lembrete: o horário pesa bem menos que os dois primeiros segundos do Reel.
Diga "escreve terça" e eu passo para o roteirista.
```

## Quality Criteria

- [ ] Pelo menos 3 Reels e tipos alternados.
- [ ] Ângulos concretos, tirados dos fatos da semana.
- [ ] Lista de engajamento completa.

## Veto Conditions

Reject and redo if ANY are true:
1. Algum item da semana é tema genérico, sem ângulo.
2. Um tema do log das últimas duas semanas foi repetido.
3. O plano agenda ou publica algo em nome do usuário.
