const assert = require('node:assert');
const { Lexer } = require('../lexer/Lexer');
const { TokenType } = require('../lexer/TokenType');

function testLexer() {
  console.log("🧪 Testando Lexer...");

  const source = `
    // Comentário de teste
    jeito frase = "salve do bananil"
    anuncia(frase)
    se pá (é_mermo) {
      vazei(0)
    }
  `;

  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();

  // Verificações básicas
  const expectedTypes = [
    TokenType.JEITO, TokenType.IDENTIFIER, TokenType.ASSIGN, TokenType.STRING,
    TokenType.ANUNCIA, TokenType.L_PAREN, TokenType.IDENTIFIER, TokenType.R_PAREN,
    TokenType.SE_PA, TokenType.L_PAREN, TokenType.E_MERMO, TokenType.R_PAREN, TokenType.L_BRACE,
    TokenType.VAZEI, TokenType.L_PAREN, TokenType.NUMBER, TokenType.R_PAREN, TokenType.R_BRACE,
    TokenType.EOF
  ];

  assert.strictEqual(tokens.length, expectedTypes.length, `Deveria ter ${expectedTypes.length} tokens, mas tem ${tokens.length}`);

  expectedTypes.forEach((type, i) => {
    assert.strictEqual(tokens[i].type, type, `Token na posição ${i} deveria ser ${type}, mas é ${tokens[i].type}`);
  });

  console.log("✅ Lexer passou em todos os testes!");
  
  // Exibir tokens para conferência visual
  console.log("\nTokens gerados:");
  tokens.forEach(t => console.log(`  [${t.line}] ${t.type}: "${t.lexeme}" ${t.literal !== null ? `(${t.literal})` : ''}`));
}

try {
  testLexer();
} catch (error) {
  console.error("❌ Falha no teste do Lexer:");
  console.error(error.message);
  process.exit(1);
}
