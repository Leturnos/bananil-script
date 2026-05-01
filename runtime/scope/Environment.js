class Environment {
  constructor(enclosing = null) {
    this.values = new Map();
    this.enclosing = enclosing;
  }

  define(name, value) {
    this.values.set(name, value);
  }

  assign(nameToken, value) {
    const name = nameToken.lexeme;
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }

    if (this.enclosing !== null) {
      this.enclosing.assign(nameToken, value);
      return;
    }

    throw new Error(`mano, tentou mexer no ${name} mas ele nem existe\n\nno corre: principal (linha ${nameToken.line})\n\ntenta de novo aí na moral`);
  }

  get(nameToken) {
    const name = nameToken.lexeme;
    if (this.values.has(name)) {
      return this.values.get(name);
    }

    if (this.enclosing !== null) {
      return this.enclosing.get(nameToken);
    }

    // Erro customizado estilo vira-lata
    throw new Error(`mano, o ${name} sumiu no meio do rolê\n\nno corre: principal (linha ${nameToken.line})\n\ntenta de novo aí na moral`);
  }
}

module.exports = { Environment };
