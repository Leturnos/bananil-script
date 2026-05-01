const { TokenType, Keywords } = require('./TokenType');

class Token {
  constructor(type, lexeme, literal, line) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}

class Lexer {
  constructor(source) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  tokenize() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return this.tokens;
  }

  scanToken() {
    const c = this.advance();
    switch (c) {
      case '(': this.addToken(TokenType.L_PAREN); break;
      case ')': this.addToken(TokenType.R_PAREN); break;
      case '{': this.addToken(TokenType.L_BRACE); break;
      case '}': this.addToken(TokenType.R_BRACE); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case '.': this.addToken(TokenType.DOT); break;
      case '-': this.addToken(TokenType.MINUS); break;
      case '+': this.addToken(TokenType.PLUS); break;
      case '*': this.addToken(TokenType.STAR); break;
      case '/':
        if (this.match('/')) {
          // Um comentário vai até o fim da linha
          while (this.peek() !== '\n' && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUALS : TokenType.ASSIGN);
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUALS : TokenType.LESS);
        break;
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUALS : TokenType.GREATER);
        break;
      case '!':
        if (this.match('=')) {
          this.addToken(TokenType.NOT_EQUALS);
        }
        break;

      case '"': this.string(); break;

      case ' ':
      case '\r':
      case '\t':
        // Ignorar espaços em branco
        break;

      case '\n':
        this.line++;
        break;

      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          console.error(`[Linha ${this.line}] Erro: Caractere inesperado: ${c}`);
        }
        break;
    }
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    const text = this.source.substring(this.start, this.current);
    
    // Tratamento especial para palavras compostas: "se pá" e "enquanto der"
    let type = Keywords[text];

    if (text === "se" && this.peekString(" pá")) {
      this.advanceN(3); // pula " pá"
      type = TokenType.SE_PA;
    } else if (text === "enquanto" && this.peekString(" der")) {
      this.advanceN(4); // pula " der"
      type = TokenType.ENQUANTO_DER;
    }

    if (!type) type = TokenType.IDENTIFIER;
    this.addToken(type);
  }

  string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      console.error(`[Linha ${this.line}] Erro: String não finalizada.`);
      return;
    }

    // O fechamento "
    this.advance();

    // Remove as aspas do valor literal
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  number() {
    while (this.isDigit(this.peek())) this.advance();

    // Parte fracionária
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance(); // consome o "."

      while (this.isDigit(this.peek())) this.advance();
    }

    this.addToken(TokenType.NUMBER, parseFloat(this.source.substring(this.start, this.current)));
  }

  advance() {
    return this.source.charAt(this.current++);
  }

  advanceN(n) {
    this.current += n;
  }

  addToken(type, literal = null) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }

  match(expected) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;

    this.current++;
    return true;
  }

  peek() {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  peekString(str) {
    return this.source.substring(this.current, this.current + str.length) === str;
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  isDigit(c) {
    return c >= '0' && c <= '9';
  }

  isAlpha(c) {
    return (c >= 'a' && c <= 'z') ||
           (c >= 'A' && c <= 'Z') ||
           c === '_' ||
           /[áàâãéèêíïóòôõúùûç]/.test(c.toLowerCase());
  }

  isAlphaNumeric(c) {
    return this.isAlpha(c) || this.isDigit(c);
  }
}

module.exports = { Lexer };
