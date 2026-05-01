const assert = require('node:assert');
const { Lexer } = require('../lexer/Lexer');
const { Parser } = require('../parser/Parser');
const { VarDeclaration, ExpressionStatement, Call, Literal } = require('../ast/Nodes');

function testParser() {
  console.log("🧪 Testando Parser...");

  const source = `
    jeito x = "bananil"
    anuncia(x)
  `;

  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();

  // Verificações
  assert.strictEqual(ast.length, 2, "Deveria ter 2 statements.");
  
  // Teste VarDeclaration
  assert.ok(ast[0] instanceof VarDeclaration, "Primeiro deveria ser VarDeclaration");
  assert.strictEqual(ast[0].name.lexeme, "x");
  assert.strictEqual(ast[0].initializer.value, "bananil");

  // Teste Call (ExpressionStatement)
  assert.ok(ast[1] instanceof ExpressionStatement, "Segundo deveria ser ExpressionStatement");
  assert.ok(ast[1].expression instanceof Call, "Deveria conter um Call");
  assert.strictEqual(ast[1].expression.callee.name.lexeme, "anuncia");

  console.log("✅ Parser passou nos testes básicos!");
  
  // Visualização simples
  console.log("\nEstrutura da AST:");
  console.log(JSON.stringify(ast, (key, value) => {
    if (key === 'tokens' || key === 'line') return undefined;
    return value;
  }, 2));
}

try {
  testParser();
} catch (error) {
  console.error("❌ Falha no teste do Parser:");
  console.error(error.message);
  process.exit(1);
}
