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
    if (key === 'tokens' || key === 'current') return undefined;
    return value;
  }, 2);

  const snapshotPath = getSnapshotPath(testName);

  if (!fs.existsSync(path.dirname(snapshotPath))) {
    fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
  }

  if (!fs.existsSync(snapshotPath)) {
    fs.writeFileSync(snapshotPath, serializedAst);
    return true;
  }

  const existingSnapshot = fs.readFileSync(snapshotPath, 'utf-8');
  return existingSnapshot === serializedAst;
}

describe('AST Snapshot Tests', () => {
  const tests = {
    "basic_var": "jeito x = 10;",
    "function_def": "corre soma(a, b) { devolve a + b; }",
    "if_else": "se pá (é_mermo) { anuncia(1); } senao { anuncia(0); }",
    "try_catch": "gambiarra { x = 1; } fé { y = 2; }",
    "modes": "modo: jeitinho; x = 1 / 0;"
  };

  Object.entries(tests).forEach(([name, code]) => {
    test(`Snapshot for ${name}`, () => {
      const result = runSnapshotTest(name, code);
      expect(result).toBe(true);
    });
  });
});
