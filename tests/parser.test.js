const { Lexer } = require('../lexer/Lexer');
const { Parser } = require('../parser/Parser');
const { VarDeclaration, ExpressionStatement, Call } = require('../ast/Nodes');

describe('Parser Tests', () => {
  test('Parsing básico de variáveis e chamadas de função', () => {
    const source = `
      jeito x = "bananil"
      anuncia(x)
    `;

    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(ast.length).toBe(2);
    
    expect(ast[0]).toBeInstanceOf(VarDeclaration);
    expect(ast[0].name.lexeme).toBe("x");
    expect(ast[0].initializer.value).toBe("bananil");

    expect(ast[1]).toBeInstanceOf(ExpressionStatement);
    expect(ast[1].expression).toBeInstanceOf(Call);
    expect(ast[1].expression.callee.name.lexeme).toBe("anuncia");
  });

  test('Parsing de expressões matemáticas com precedência', () => {
    const source = "jeito x = 1 + 2 * 3";
    const lexer = new Lexer(source);
    const parser = new Parser(lexer.tokenize());
    const ast = parser.parse();
    
    // x = (1 + (2 * 3))
    expect(ast[0].initializer.operator.lexeme).toBe("+");
    expect(ast[0].initializer.right.operator.lexeme).toBe("*");
  });
});
