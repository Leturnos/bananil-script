const { Lexer } = require('../lexer/Lexer');
const { Parser } = require('../parser/Parser');
const { Interpreter } = require('../interpreter/Interpreter');

function runBna(code, modo = null) {
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const statements = parser.parse();
  const interpreter = new Interpreter();
  if (modo) interpreter.currentMode = modo;
  
  let output = [];
  interpreter.globals.define("anuncia", {
    isNative: true,
    call: (interpreter, args) => {
      output.push(args.join(" "));
      return null;
    }
  });

  try {
    interpreter.interpret(statements);
  } catch (e) {
    return { success: false, error: e.message, output };
  }
  return { success: true, output };
}

console.log("🚀 Iniciando Stress Tests de Modos...");

// 1. Estresse do Modo Raiz (Sobrevivência)
console.log("\n--- Teste de Estresse: Raiz ---");
const raizCode = `
modo: raiz
anuncia("passo 1")
x = variavel_inexistente + 10
anuncia("passo 2")
10 / 0
anuncia("passo 3")
chama_funcao_invisivel()
anuncia("passo 4")
`;
const tRaiz = runBna(raizCode);
if (tRaiz.output.includes("passo 1") && tRaiz.output.includes("passo 4")) {
  console.log("✅ Modo Raiz sobreviveu a múltiplos erros fatais.");
} else {
  console.error("❌ Modo Raiz falhou no estresse.");
}

// 2. Estresse do Modo Caos (Estatístico)
console.log("\n--- Teste de Estresse: Caos ---");
let mutations = 0;
const iterations = 100;
for (let i = 0; i < iterations; i++) {
  const tCaos = runBna(`modo: caos\nanuncia(10 + 5)`);
  const result = parseInt(tCaos.output[0]);
  if (result !== 15) mutations++;
}
console.log(`Mutações detectadas: ${mutations}/${iterations}`);
if (mutations > 0 && mutations < iterations) {
  console.log("✅ Modo Caos demonstrou instabilidade matemática.");
} else {
  console.warn("⚠️ Modo Caos foi muito estável (ou mutou tudo).");
}

console.log("\n🚀 Iniciando Edge Case Tests...");

// 3. Estouro de Pilha (Recursão)
console.log("\n--- Edge Case: Stack Overflow ---");
const stackCode = `
corre infinito(n) {
  devolve infinito(n + 1)
}
infinito(1)
`;
const tStack = runBna(stackCode);
if (!tStack.success && tStack.error.includes("Maximum call stack size exceeded")) {
  console.log("✅ Estouro de pilha capturado pelo Node.js (comportamento esperado).");
}

// 4. Precisão Numérica
console.log("\n--- Edge Case: Precisão Numérica ---");
const precisionCode = `anuncia(0.1 + 0.2)`;
const tPrecision = runBna(precisionCode);
console.log(`0.1 + 0.2 = ${tPrecision.output[0]}`);
if (parseFloat(tPrecision.output[0]) > 0.3 && parseFloat(tPrecision.output[0]) < 0.31) {
  console.log("✅ Precisão flutuante segue o padrão IEEE 754 (como JS).");
}

console.log("\n🏁 Testes de estresse e casos edge finalizados!");
