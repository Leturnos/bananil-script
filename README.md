# BananilScript 🐕
### Vira-lata Caramelo Edition

Uma linguagem de programação brasileira, resiliente e cheia de ginga. Onde o erro não é um problema, é apenas uma **gambiarra** esperando para acontecer.

---

## 🚀 Como rodar

Atualmente em fase alpha, mas já latindo!

```bash
# Rodar um arquivo .bna
npm start run examples/ola.bna

# Validar sintaxe (bom para CI)
npm start check examples/ola.bna

# Modo interativo (REPL)
npm start repl
```

## 🛠️ Tooling

### Validador de Sintaxe (`check`)
O comando `check` analisa o código e retorna:
- `exit 0`: Se o código estiver nos trinks.
- `exit 1`: Se a gramática estiver capenga.

### REPL Interativo
Experimente o BananilScript em tempo real. Suporta multi-linha usando chaves `{}` e é resiliente a erros de digitação.

### Extensão VSCode
Para ter syntax highlighting:
1. Copie a pasta `vscode-bananil` para `~/.vscode/extensions/` (Linux/macOS) ou `%USERPROFILE%\.vscode\extensions\` (Windows).
2. Reinicie o VSCode.
3. Aproveite as cores da gambiarra!

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

jeito i = 1
enquanto der (i <= 3) {
  anuncia("repetindo ", i)
  i = i + 1
}

corre soma(a, b) {
  devolve a + b
}

gambiarra {
  anuncia(soma(10, 20))
  anuncia(x) // erro!
} fé {
  anuncia("deu ruim na soma ou no x!")
}

suave {
  anuncia(chamada_para_api_fora_do_ar())
}

jeito nervoso chance = 0.5

modo: jeitinho
anuncia(10 / 0) // resulta em 1
```

## 🛠️ Filosofia

1. **Resiliência:** Se o código cair, o Bananil levanta.
2. **Humor:** Mensagens de erro que parecem um áudio de WhatsApp.
3. **Brasileirismo:** Símbolos e palavras-chave que você usaria num churrasco.

---
*BananilScript: Porque todo código merece uma segunda chance (e uma gambiarra).*
