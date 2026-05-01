const { TokenType } = require('../lexer/TokenType');
const { 
  VarDeclaration, 
  ExpressionStatement, 
  Block,
  If,
  While,
  Literal, 
  Variable, 
  Call,
  Binary,
  Assign
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
    if (this.match(TokenType.SE_PA)) return this.ifStatement();
    if (this.match(TokenType.ENQUANTO_DER)) return this.whileStatement();
    if (this.match(TokenType.L_BRACE)) return new Block(this.block());
    return this.expressionStatement();
  }

  ifStatement() {
    this.consume(TokenType.L_PAREN, "Esperava '(' após 'se pá'.");
    const condition = this.expression();
    this.consume(TokenType.R_PAREN, "Esperava ')' após condição.");

    const thenBranch = this.statement();
    let elseBranch = null;
    if (this.match(TokenType.SENAO)) {
      elseBranch = this.statement();
    }

    return new If(condition, thenBranch, elseBranch);
  }

  whileStatement() {
    this.consume(TokenType.L_PAREN, "Esperava '(' após 'enquanto der'.");
    const condition = this.expression();
    this.consume(TokenType.R_PAREN, "Esperava ')' após condição.");
    const body = this.statement();

    return new While(condition, body);
  }

  block() {
    const statements = [];

    while (!this.check(TokenType.R_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }

    this.consume(TokenType.R_BRACE, "Esperava '}' após bloco.");
    return statements;
  }

  expressionStatement() {
    const expr = this.expression();
    this.match(TokenType.SEMICOLON);
    return new ExpressionStatement(expr);
  }

  expression() {
    return this.assignment();
  }

  assignment() {
    const expr = this.equality();

    if (this.match(TokenType.ASSIGN)) {
      const equals = this.previous();
      const value = this.assignment();

      if (expr instanceof Variable) {
        const name = expr.name;
        return new Assign(name, value);
      }

      throw this.error(equals, "Destino da atribuição inválido.");
    }

    return expr;
  }

  equality() {
    let expr = this.comparison();

    while (this.match(TokenType.NOT_EQUALS, TokenType.EQUALS)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  comparison() {
    let expr = this.term();

    while (this.match(TokenType.GREATER, TokenType.GREATER_EQUALS, TokenType.LESS, TokenType.LESS_EQUALS)) {
      const operator = this.previous();
      const right = this.term();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  term() {
    let expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = this.factor();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  factor() {
    let expr = this.call();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous();
      const right = this.call();
      expr = new Binary(expr, operator, right);
    }

    return expr;
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
