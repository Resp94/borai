# Opensquad

Crie squads de agentes de IA que trabalham juntos — direto do seu IDE.

## Como Usar

Abra esta pasta no seu IDE e digite:

```
/opensquad
```

Isso abre o menu principal. De lá você pode criar squads, executá-los e mais.

Você também pode ser direto — descreva o que quer em linguagem natural:

```
/opensquad crie um squad para escrever posts no LinkedIn sobre IA
/opensquad execute o squad meu-squad
```

## Criar um Squad

Digite `/opensquad` e escolha "Criar squad" no menu, ou seja direto:

```
/opensquad crie um squad para [o que você precisa]
```

O Arquiteto fará algumas perguntas, projetará o squad e configurará tudo automaticamente.

## Executar um Squad

Digite `/opensquad` e escolha "Executar squad" no menu, ou seja direto:

```
/opensquad execute o squad <nome-do-squad>
```

O squad executa automaticamente, pausando apenas nos checkpoints de decisão.

## Escritório Virtual

O Escritório Virtual é uma interface visual 2D que mostra seus agentes trabalhando em tempo real.

**Passo 1 — Inicie o escritório** (no terminal, a partir da raiz do projeto):

```bash
cd dashboard
npm run dev
```

Na primeira vez, se as dependências ainda não estiverem instaladas, rode `npm install` dentro de `dashboard/` antes. O `npx opensquad init` já faz isso por você.

**Passo 2 —** Abra o endereço que aparece no terminal (normalmente `http://localhost:5173`). O escritório lê os squads da pasta `squads/` e se atualiza sozinho enquanto um squad está rodando.

---

# Opensquad (English)

Create AI squads that work together — right from your IDE.

## How to Use

Open this folder in your IDE and type:

```
/opensquad
```

This opens the main menu. From there you can create squads, run them, and more.

You can also be direct — describe what you want in plain language:

```
/opensquad create a squad for writing LinkedIn posts about AI
/opensquad run my-squad
```

## Create a Squad

Type `/opensquad` and choose "Create squad" from the menu, or be direct:

```
/opensquad create a squad for [what you need]
```

The Architect will ask a few questions, design the squad, and set everything up automatically.

## Run a Squad

Type `/opensquad` and choose "Run squad" from the menu, or be direct:

```
/opensquad run the <squad-name> squad
```

The squad runs automatically, pausing only at decision checkpoints.

## Virtual Office

The Virtual Office is a 2D visual interface that shows your agents working in real time.

**Step 1 — Start the office** (in the terminal, from the project root):

```bash
cd dashboard
npm run dev
```

The first time, if the dependencies are not installed yet, run `npm install` inside `dashboard/` first. `npx opensquad init` already does it for you.

**Step 2 —** Open the address shown in the terminal (usually `http://localhost:5173`). The office reads the squads in `squads/` and updates live while a squad is running.
