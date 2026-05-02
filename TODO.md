# BananilScript 🐕
Vira-lata Caramelo Edition — roadmap de implementação

## Estrutura do projeto
- `/lexer` - Tokenizador (UTF-8, suporte a acentos)
- `/parser` - Analisador sintático (Pratt Parser para expressões)
- `/ast` - Definição dos nós da árvore (Statements vs Expressions)
- `/interpreter` - Engine de execução (Tree-walk)
- `/runtime` - Gerenciamento de estado
  - `/scope` - Pilha de escopos e variáveis
  - `/types` - Lógica de `firmeza`, `suave`, `nervoso`
  - `/modes` - Lógica de `caos`, `jeitinho`, `CLT`, `raiz`
  - `/errors` - Mensagens personalizadas e Call Stack
- `/cli` - Interface (Run, Check, REPL)
- `/ai` - Integração com LLMs

## Fase 1: Fundação — parser e AST
- [x] Definir gramática formal completa
  - `statement = varDecl | ifStmt | whileStmt | funcDef | exprStmt | returnStmt | tryCatchStmt ;`
  - `expression = binary | literal | identifier | call | grouping ;`
  - Tokens: `jeito`, `se pá`, `senao`, `enquanto der`, `corre`, `devolve`, `anuncia`, `vazei`, `gambiarra`, `fé`, `é_mermo`, `mentira`
- [x] Implementar lexer (tokenizador)
  - Suporte total a UTF-8 e identificadores com acento.
- [x] Implementar parser (Pratt Parser)
  - Lógica de precedência (ex: `*` antes de `+`, parênteses).
- [x] Definir nós do AST (Snapshot Testing ready)
  - Separar explicitamente `Statement` de `Expression`.

## Fase 2: Núcleo de execução e Erros
- [x] Implementar interpretador (tree-walk)
- [x] Sistema de variáveis e escopo local/global
- [x] Mensagens de erro com "personalidade" (Vira-lata style)
  - Erro de referência: `mano, o [x] sumiu no meio do rolê`
  - Call stack: `no corre: [nome] (linha [n])`
- [x] Implementar `anuncia()` e `vazei()`

## Fase 3: Controle de fluxo e Segurança
- [x] `se pá` / `senao`
- [x] `enquanto der` com **limite de iteração configurável**
- [x] Funções (`corre`/`devolve`) e recursão
- [x] `gambiarra`/`fé` (Try/Catch)

## Fase 4: Tipos e Modificadores
- [x] `firmeza`: Comportamento padrão.
- [x] `suave`: Nunca crasha, retorna `mentira` em caso de erro.
- [x] `nervoso`: Lança erros aleatórios (caos controlado por variável).

## Fase 5: Modos de Execução (O Diferencial)
- [x] `modo: caos`: Reordenar expressões, mudar valores, delays aleatórios.
- [x] `modo: jeitinho` (Regras claras):
  - `undefined` → `0`
  - Divisão por zero → `1`
  - `null access` → ignora/silencia
- [x] `modo: CLT`: Log de ponto obrigatório, lentidão e burocracia.
- [x] `modo: raiz` (Vira-lata Raiz):
  - Ignora qualquer padrão.
  - Tenta sobreviver a qualquer código (o "eterno try-catch" implícito).
  - Nunca crasha, sempre "dá um jeito".

## Fase 6: Integração com IA
- [ ] Contrato `AIAdapter` atualizado:
  ```typescript
  interface AIAdapter {
    explainError(error: any, context: string): Promise<string>;
    fixCode(code: string): Promise<string>;
    parseNaturalLanguage(input: string): Promise<AST>;
  }
  ```
- [ ] Integração de "Auto-gambiarra" via IA.

## Fase 7: Qualidade e Testes
- [x] Testes unitários (Lexer, Parser, Interpreter).
- [x] **Snapshot tests do AST** (garantir que mudanças no parser não quebrem a árvore).
- [x] Testes de estresse dos modos (`caos`, `raiz`).
- [x] Testes de casos edge (precisão numérica, estouro de pilha).

## Fase 8: CLI e Experiência
- [x] `bananil run <arquivo.bna>`
- [x] `bananil check <arquivo.bna>`
- [x] **REPL: `bananil repl`** (Interativo e divertido).
- [x] Extensão VSCode e README (O Guia da Gambiarra).

