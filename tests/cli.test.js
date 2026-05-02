const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function testCliCheck() {
  console.log("🧪 Testando CLI: bananil check...");

  const cliPath = path.resolve(__dirname, '../cli/index.js');
  const validFile = path.resolve(__dirname, 'temp_valid.bna');
  const invalidFile = path.resolve(__dirname, 'temp_invalid.bna');

  fs.writeFileSync(validFile, 'jeito x = 10; anuncia(x);');
  fs.writeFileSync(invalidFile, 'jeito = 10;'); // Erro de sintaxe (falta nome)

  // Teste 1: Arquivo Válido (deve retornar 0)
  const validResult = spawnSync('node', [cliPath, 'check', validFile]);
  if (validResult.status === 0) {
    console.log("✅ Teste 1 (Válido): Passou (exit 0)");
  } else {
    console.error("❌ Teste 1 (Válido): Falhou. Status:", validResult.status);
    process.exit(1);
  }

  // Teste 2: Arquivo Inválido (deve retornar 1)
  const invalidResult = spawnSync('node', [cliPath, 'check', invalidFile]);
  if (invalidResult.status === 1) {
    console.log("✅ Teste 2 (Inválido): Passou (exit 1)");
  } else {
    console.error("❌ Teste 2 (Inválido): Falhou. Status:", invalidResult.status);
    process.exit(1);
  }

  // Limpeza
  fs.unlinkSync(validFile);
  fs.unlinkSync(invalidFile);

  console.log("✅ CLI Check passou em todos os testes!");
}

try {
  testCliCheck();
} catch (error) {
  console.error("❌ Falha crítica nos testes do CLI:");
  console.error(error.message);
  process.exit(1);
}
