# BananilScript 🐕
### Vira-lata Caramelo Edition

![status](https://img.shields.io/badge/status-alpha-yellow)
![node](https://img.shields.io/badge/node-%3E%3D18-green)
![license](https://img.shields.io/badge/license-MIT-blue)

Uma linguagem de programação brasileira, resiliente e cheia de ginga. Onde o erro não é um problema, é apenas uma **gambiarra** esperando para acontecer.

---

## 👋 Hello World

```bananil
anuncia("salve do bananil")
```

---

## 📦 Instalação

```bash
git clone https://github.com/Leturnos/bananil-script.git
cd bananil-script
npm install
```

---

## 🚀 Como rodar

Atualmente em fase alpha, mas já latindo!

```bash
# Rodar um arquivo .bna
npm start run examples/ola.bna
# ou diretamente
node cli/index.js run examples/ola.bna

# Validar sintaxe (bom para CI)
npm start check examples/ola.bna

# Modo interativo (REPL)
npm start repl
```

---

## 🧩 Sintaxe básica

- `jeito` → variável (ex: `jeito x = 10`)
- `anuncia()` → print no terminal
- `se pá / senao` → condicional (if/else)
- `enquanto der` → loop (while)
- `corre / devolve` → funções e retorno
- `gambiarra / fé` → tratamento de erro (try/catch)
- `suave { ... }` → bloco de segurança (não crasha o código interno)

---

## 🤖 Auto-Gambiarra (Integração com IA)

O BananilScript possui integração nativa com o Google Gemini para corrigir seus erros automaticamente. Se o código falhar, a IA entra em cena, propõe um "jeitinho", mostra o *diff* e tenta rodar de novo.

> **Segurança:** A IA nunca sobrescreve o arquivo original. Um novo arquivo `.gambiarra.bna` é gerado e validado pelo parser antes de ser executado.

### Configuração
1. Crie um arquivo `.env` na raiz: `cp .env.example .env`
2. Adicione sua chave: `GEMINI_API_KEY=sua_chave_aqui`

### Como usar
```bash
# Tenta corrigir automaticamente 1 vez (padrão)
npm start run script.bna --auto-fix

# Tenta corrigir até 3 vezes
npm start run script.bna --auto-fix=3
```

---

## ⚙️ Modos de Execução

Você pode mudar a "personalidade" do interpretador via flag CLI ou diretamente no código:

- `--modo=jeitinho`: Transforma `undefined` em `0`, divisão por zero em `1` e silencia erros.
- `--modo=caos`: Reordena expressões e muda valores aleatoriamente.
- `--modo=CLT`: Adiciona lentidão, burocracia e logs de ponto.
- `--modo=raiz`: Modo vira-lata puro. Nunca crasha.

**No código:**
```bananil
modo: jeitinho
anuncia(10 / 0) // resulta em 1
```

---

## 🐾 Exemplo de código

```bananil
jeito frase = "salve do bananil"
anuncia(frase)

jeito sol = é_mermo
se pá (sol) {
  anuncia("tá suave!")
} senao {
  anuncia("deu ruim, mas a gente dá um jeito")
}

corre fatorial(n) {
  se pá (n <= 1) { devolve 1 }
  devolve n * fatorial(n - 1)
}

gambiarra {
  anuncia(fatorial(5))
} fé {
  anuncia("deu ruim no calculo!")
}

// Bloco de segurança (feature "suave")
suave {
  anuncia(chamada_perigosa()) // se falhar, apenas ignora e continua
}

jeito nervoso chance = 0.5 // modificador de variável: lança erros aleatórios
```

---

## 🧪 Testes

O projeto conta com testes automatizados para garantir a qualidade da gambiarra:
```bash
npm test
```
**Inclui testes para:**
- Lexer (Tokenização)
- Parser (AST e Gramática)
- Interpreter (Lógica e Escopo)
- Modos de execução (`caos`, `jeitinho`, `CLT`, `raiz`)
- Integração com IA (Mockada para CI)

---

## 🧱 Extensão VSCode

Para ter syntax highlighting profissional:

1. Copie a pasta `vscode-bananil` para o diretório de extensões:
   - **Linux/macOS:** `~/.vscode/extensions/`
   - **Windows:** `%USERPROFILE%\.vscode\extensions\`
2. Reinicie o VSCode.

> **Em breve:** Instalação facilitada via VSIX ou Marketplace.

---

## 🛠️ Filosofia

1. **Resiliência:** Se o código cair, o Bananil levanta.
2. **Humor:** Mensagens de erro estilo áudio de WhatsApp.
3. **Brasileirismo:** Símbolos e palavras que você usaria num churrasco.

---
*BananilScript: Porque todo código merece uma segunda chance (e um jeitinho bem aplicado).*
