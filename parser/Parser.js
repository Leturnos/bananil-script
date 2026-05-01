const { TokenType } = require('../lexer/TokenType');
const { 
  VarDeclaration, 
  ExpressionStatement, 
  Literal, 
  Variable, 
  Call,
  Binary
} = require('../ast/Nodes');

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse() {
    const statements = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return statements;
  }

  declaration() {
    try {
      if (this.match(TokenType.JEITO)) return this.varDeclaration();
      return this.statement();
    } catch (error) {
      this.synchronize();
      return null;
    }
  }

  varDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Esperava nome da variável.");

    let initializer = null;
    if (this.match(TokenType.ASSIGN)) {
      initializer = this.expression();
    }

    // Opcional: permitir ponto e vírgula
    this.match(TokenType.SEMICOLON);
    return new VarDeclaration(name, initializer);
  }

  statement() {
    return this.expressionStatement();
  }

  expressionStatement() {
    const expr = this.expression();
    this.match(TokenType.SEMICOLON);
    return new ExpressionStatement(expr);
  }

  expression() {
    return this.call();
  }

  call() {
    let expr = this.primary();

    while (true) {
      if (this.match(TokenType.L_PAREN)) {
        expr = this.finishCall(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  finishCall(callee) {
    const args = [];
    if (!this.check(TokenType.R_PAREN)) {
      do {
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }

    this.consume(TokenType.R_PAREN, "Esperava ')' após argumentos.");
    return new Call(callee, args);
  }

  primary() {
    if (this.match(TokenType.MENTIRA)) return new Literal(false);
    if (this.match(TokenType.E_MERMO)) return new Literal(true);

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal);
    }

    if (this.match(TokenType.IDENTIFIER, TokenType.ANUNCIA, TokenType.VAZEI)) {
      // Aceita identificadores normais e palavras-chave de funções integradas
      return new Variable(this.previous());
    }

    if (this.match(TokenType.L_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.R_PAREN, "Esperava ')' após expressão.");
      return expr;
    }

    throw this.error(this.peek(), "Esperava expressão.");
  }

  // Auxiliares
  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  error(token, message) {
    const msg = `[Linha ${token.line}] Erro no '${token.lexeme}': ${message}`;
    console.error(msg);
    return new Error(msg);
  }

  synchronize() {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.JEITO:
        case TokenType.SE_PA:
        case TokenType.ENQUANTO_DER:
        case TokenType.CORRE:
        case TokenType.ANUNCIA:
        case TokenType.VAZEI:
          return;
      }

      this.advance();
    }
  }
}

module.exports = { Parser };
