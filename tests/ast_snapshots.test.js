const fs = require('fs');
const path = require('path');
const { Lexer } = require('../lexer/Lexer');
const { Parser } = require('../parser/Parser');

function getSnapshotPath(testName) {
  return path.join(__dirname, 'snapshots', `${testName}.json`);
}

function runSnapshotTest(testName, code) {
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  
  const serializedAst = JSON.stringify(ast, (key, value) => {
    // Remover referências circulares ou tokens complexos se necessário para o snapshot
    if (key === 'tokens' || key === 'current') return undefined;
    return value;
  }, 2);

  const snapshotPath = getSnapshotPath(testName);

  if (!fs.existsSync(path.dirname(snapshotPath))) {
    fs.mkdirSync(path.dirname(snapshotPath));
  }

  if (!fs.existsSync(snapshotPath)) {
    fs.writeFileSync(snapshotPath, serializedAst);
    console.log(`📸 Snapshot criado para: ${testName}`);
    return true;
  }

  const existingSnapshot = fs.readFileSync(snapshotPath, 'utf-8');
  if (existingSnapshot === serializedAst) {
    console.log(`✅ Snapshot condizente: ${testName}`);
    return true;
  } else {
    console.error(`❌ Regressão detectada na AST para: ${testName}`);
    console.error("Diferença encontrada entre o snapshot e a AST atual.");
    // Em um ambiente de teste real, usaríamos um diff engine aqui
    return false;
  }
}

console.log("🚀 Iniciando Snapshot Tests da AST...");

const tests = {
  "basic_var": "jeito x = 10;",
  "function_def": "corre soma(a, b) { devolve a + b; }",
  "if_else": "se pá (é_mermo) { anuncia(1); } senao { anuncia(0); }",
  "try_catch": "gambiarra { x = 1; } fé { y = 2; }",
  "modes": "modo: jeitinho; x = 1 / 0;"
};

let allPassed = true;
for (const [name, code] of Object.entries(tests)) {
  if (!runSnapshotTest(name, code)) allPassed = false;
}

if (!allPassed) process.exit(1);
