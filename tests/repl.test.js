const { spawnSync } = require('child_process');
const path = require('path');

function testRepl() {
  console.log("🧪 Testando CLI: bananil repl...");

  const cliPath = path.resolve(__dirname, '../cli/index.js');

  // Teste 1: Execução simples e saída
  const simpleInput = 'anuncia("ola")\n';
  const result1 = spawnSync('node', [cliPath, 'repl'], { input: simpleInput });
  if (result1.stdout.toString().includes("ola")) {
    console.log("✅ Teste 1 (Simples): Passou");
  } else {
    console.error("❌ Teste 1 (Simples): Falhou. Output:", result1.stdout.toString());
    process.exit(1);
  }

  // Teste 2: Multi-linha (contagem de chaves)
  const multiInput = 'corre oi() {\nanuncia("oi")\n}\noi()\n';
  const result2 = spawnSync('node', [cliPath, 'repl'], { input: multiInput });
  if (result2.stdout.toString().includes("oi")) {
    console.log("✅ Teste 2 (Multi-linha): Passou");
  } else {
    console.error("❌ Teste 2 (Multi-linha): Falhou. Output:", result2.stdout.toString());
    process.exit(1);
  }

  // Teste 3: Resiliência a erro (não deve crashar o REPL)
  const errorInput = 'anuncia(inexistente)\nanuncia("sobrevivi")\n';
  const result3 = spawnSync('node', [cliPath, 'repl'], { input: errorInput });
  const combinedOutput = result3.stdout.toString() + result3.stderr.toString();
  if (combinedOutput.includes("sumiu no meio do rolê") && combinedOutput.includes("sobrevivi")) {
    console.log("✅ Teste 3 (Resiliência): Passou");
  } else {
    console.error("❌ Teste 3 (Resiliência): Falhou. Output:", combinedOutput);
    process.exit(1);
  }

  console.log("✅ CLI REPL passou em todos os testes!");
}

try {
  testRepl();
} catch (error) {
  console.error("❌ Falha crítica nos testes do REPL:");
  console.error(error.message);
  process.exit(1);
}
