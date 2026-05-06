const { Lexer } = require('../lexer/Lexer');
const { TokenType } = require('../lexer/TokenType');

describe('Lexer Tests', () => {
  test('Tokenização básica de código BananilScript', () => {
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

    const expectedTypes = [
      TokenType.JEITO, TokenType.IDENTIFIER, TokenType.ASSIGN, TokenType.STRING,
      TokenType.ANUNCIA, TokenType.L_PAREN, TokenType.IDENTIFIER, TokenType.R_PAREN,
      TokenType.SE_PA, TokenType.L_PAREN, TokenType.E_MERMO, TokenType.R_PAREN, TokenType.L_BRACE,
      TokenType.VAZEI, TokenType.L_PAREN, TokenType.NUMBER, TokenType.R_PAREN, TokenType.R_BRACE,
      TokenType.EOF
    ];

    expect(tokens.length).toBe(expectedTypes.length);

    expectedTypes.forEach((type, i) => {
      expect(tokens[i].type).toBe(type);
    });
  });

  test('Ignora comentários e espaços em branco', () => {
    const source = "  // comentário\njeito x = 1  ";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.JEITO);
    expect(tokens[tokens.length-1].type).toBe(TokenType.EOF);
  });
});
