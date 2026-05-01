const { Lexer } = require('../lexer/Lexer');
const { Parser } = require('../parser/Parser');
const { Interpreter } = require('../interpreter/Interpreter');

function runBna(code) {
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const statements = parser.parse();
  const interpreter = new Interpreter();
  
  let output = [];
  // Redirecionar anuncia para capturar saída
  interpreter.globals.define("anuncia", {
    isNative: true,
    call: (interpreter, args) => {
      output.push(args.join(" "));
      return null;
    }
  });

  try {
    for (const stmt of statements) {
      interpreter.execute(stmt);
    }
  } catch (e) {
    return { success: false, error: e.message, output };
  }
  return { success: true, output };
}

console.log("🚀 Iniciando testes dos modificadores...");

// Teste 1: Variável Suave silencia erro
const t1 = runBna(`jeito suave x = variavel_inexistente; anuncia(x);`);
if (t1.output[0] === "false") {
  console.log("✅ Teste 1 (Variável Suave): Passou");
} else {
  console.error("❌ Teste 1 (Variável Suave): Falhou. Output:", t1.output);
}

// Teste 2: Bloco Suave silencia erro e continua
const t2 = runBna(`
  suave {
    anuncia("inicio");
    anuncia(erro_fatal);
    anuncia("fim");
  }
  anuncia("fora");
`);
if (t2.output.includes("inicio") && t2.output.includes("fora") && !t2.output.includes("fim")) {
  console.log("✅ Teste 2 (Bloco Suave): Passou");
} else {
  console.error("❌ Teste 2 (Bloco Suave): Falhou. Output:", t2.output);
}

// Teste 3: Bloco Firmeza falha normalmente
const t3 = runBna(`
  firmeza {
    anuncia(erro_aqui);
  }
`);
if (!t3.success && t3.error.includes("sumiu no meio do rolê")) {
  console.log("✅ Teste 3 (Bloco Firmeza): Passou (falhou como esperado)");
} else {
  console.error("❌ Teste 3 (Bloco Firmeza): Falhou. Erro:", t3.error);
}

// Teste 4: Bloco Nervoso (probabilístico)
let falhas = 0;
let sucessos = 0;
for (let i = 0; i < 20; i++) {
  const t4 = runBna(`nervoso { anuncia("ok"); }`);
  if (t4.success) sucessos++;
  else falhas++;
}
if (falhas > 0 && sucessos > 0) {
  console.log(`✅ Teste 4 (Bloco Nervoso): Passou (Instável: ${sucessos} ok, ${falhas} falhas)`);
} else {
  console.warn(`⚠️ Teste 4 (Bloco Nervoso): Não foi possível validar instabilidade em 20 tentativas. (Sucessos: ${sucessos}, Falhas: ${falhas})`);
}

console.log("\n🏁 Testes finalizados!");
