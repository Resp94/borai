---
task: "Criar Reel"
order: 1
input: |
  - ideia: a ideia ou o tema escolhido no checkpoint anterior (pode ser uma frase só)
  - fato_concreto: o que aconteceu, com quem e quanto custou ou rendeu (opcional; se faltar, perguntar)
  - duracao_alvo: duração desejada em segundos (opcional; padrão 30)
output: |
  - ganchos: três ganchos (falado + tela) com fórmula e nota do hookscore.py
  - roteiro: roteiro falado sobre o gancho vencedor
  - texto_de_tela: cartões com tempo
  - ficha_de_tempo: saída do beats.py
  - humanizador: nota e veredito do detect.py
---

# Criar Reel

Transforma uma ideia num roteiro de Reel pronto para gravar, com os ganchos
pontuados, o texto de tela separado e a ficha de tempo limpa.

## Process

1. Ler `_opensquad/_memory/instagram/{perfil}/voice.md` (criar a partir de `agents/_instagram/voice.template.md` + `company.md` se não existir) e, se existir, `swipe.md`.
2. Ler `agents/ig-reel/tools/hooks.json`. Se a ideia não tem um fato concreto, fazer UMA pergunta agrupada: o que aconteceu, com quem, quanto custou ou rendeu.
3. Escolher três fórmulas diferentes que servem à ideia (priorizando as que o `swipe.md` mostra funcionando) e escrever, para cada uma, a frase falada e a frase de tela.
4. Gravar as três frases faladas em um arquivo e rodar `python3 agents/ig-reel/tools/hookscore.py ganchos.txt`. Se a primeira estiver abaixo de 50, voltar ao passo 3.
5. Escrever o roteiro no formato: GANCHO (0-2 s) → O QUE ESTÁ EM JOGO (2-7 s) → CORPO (uma ideia por trecho) → RECOMPENSA + pedido → LOOP.
6. Rodar `python3 agents/ig-reel/tools/beats.py roteiro.txt --target {duracao_alvo}` e corrigir todo alerta até sair limpo.
7. Rodar `python3 agents/ig-human/tools/humanize.py roteiro.txt -o roteiro-limpo.txt --report`, reescrever à mão os vícios de estrutura apontados e conferir com `python3 agents/ig-human/tools/detect.py roteiro.txt roteiro-limpo.txt`.
8. Montar o bloco final e perguntar se pode registrar. Só no "sim", acrescentar ao `log.md` do perfil: data, fórmula, primeira frase.

## Output Format

```yaml
ganchos:
  - formula: "#5 Tempo Encolhido"
    falado: "..."
    tela: "..."
    nota: 86
    veredito: FORTE
escolhido: "#5 Tempo Encolhido"
roteiro: |
  ...
texto_de_tela:
  - tempo: "0:00"
    cartao: "..."
ficha_de_tempo: "28.4s em 9 trechos a 150 palavras/min, sem alertas"
humanizador: "3 marcas removidas, nota humana 78 APROVADO"
```

## Output Example

> Use as quality reference, not as rigid template.

```
GANCHOS (com nota)
  86  FORTE  #5 Tempo Encolhido    "Proposta me tomava cinco horas. Hoje leva vinte minutos."
                                   tela: 5 HORAS -> 20 MIN
  74  FORTE  #1 Confissão de Custo "Eu cobrava quatro horas por semana só de formatação. Por dois anos."
                                   tela: 2 ANOS JOGADOS FORA
  55  OK     #9 O Roubo            "Rouba o modelo de proposta que fez isso."
                                   tela: ROUBA ISSO

Gravando o #5: a proporção é crível, lê num olhar e o número é seu.

ROTEIRO
Proposta me tomava cinco horas. Hoje leva vinte minutos.
E não, eu não comecei a escrever mais rápido.
Eu parei de escrever do zero.
Peguei as últimas dez propostas que fecharam e separei o que se repetia.
Sobrou um esqueleto de uma página: problema, prazo, preço, próximo passo.
O resto eu só troco o nome e o número.
Comenta PROPOSTA que eu te mando o esqueleto.
Cinco horas viraram vinte minutos.

TEXTO DE TELA
  0:00  5 HORAS -> 20 MIN
  0:04  NÃO É VELOCIDADE
  0:09  10 PROPOSTAS QUE FECHARAM
  0:13  1 PÁGINA. 4 BLOCOS
  0:20  COMENTA PROPOSTA

REEL PRONTO
gancho:       #5 Tempo Encolhido, nota 86 FORTE
duração:      24.8s em 8 trechos a 150 palavras/min
humanizador:  2 marcas removidas, nota humana 79 APROVADO
legenda:      próximo passo no Redator de Legendas
Responda "sim" para registrar, ou diga o que mudar.
```

## Quality Criteria

- [ ] Três fórmulas diferentes, não três versões da mesma.
- [ ] Gancho escolhido com nota ≥ 70 ou escolha justificada.
- [ ] `beats.py` sem alertas e com loop.
- [ ] Texto de tela com até seis palavras por cartão.

## Veto Conditions

Reject and redo if ANY are true:
1. Algum número, cliente ou resultado foi inventado.
2. O roteiro tem saudação, "neste vídeo" ou mais de um pedido.
3. As ferramentas `hookscore.py`, `beats.py` ou o humanizador não foram rodados.
