# Agentes de Instagram (ig-*)

Os 13 agentes `ig-*` desta pasta são adaptados do
[instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill),
de Jake Schincariol, licença MIT (ver `INSTAGRAM-LICENSE`).

## O que foi adaptado

- Cada skill original (`SKILL.md`) virou um agente do Borai (`AGENT.md`)
  com tarefas prontas (`tasks/`), escrito em pt-BR.
- As ferramentas Python (`tools/`) foram adaptadas para português do Brasil:
  palavras com acento, padrões de gancho fraco, lista de "cara de IA",
  pedidos de ação (CTA), ritmo de fala e as 26 fórmulas de gancho.
- Os arquivos compartilhados saíram de `~/.claude/instagram/` e foram para
  uma pasta por perfil: `_borai/_memory/instagram/{perfil}/`
  (`voice.md`, `swipe.md`, `log.md`, `plan.md`).
- O modelo de voz fica em `_instagram/voice.template.md`.

Os agentes escrevem; quem publica é você. Nada é postado sem a sua aprovação.
