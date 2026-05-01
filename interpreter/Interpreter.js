const { Environment } = require('../runtime/scope/Environment');
const { VarDeclaration, ExpressionStatement, Literal, Variable, Call } = require('../ast/Nodes');

class Interpreter {
  constructor() {
    this.globals = new Environment();
    this.environment = this.globals;

    // Registrar funções nativas
    this.globals.define("anuncia", {
      isNative: true,
      call: (interpreter, args) => {
        console.log(...args);
        return null;
      }
    });

    this.globals.define("vazei", {
      isNative: true,
      call: (interpreter, args) => {
        const code = args[0] || 0;
        process.exit(code);
      }
    });
  }

  interpret(statements) {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  execute(stmt) {
    if (stmt instanceof VarDeclaration) {
      let value = null;
      if (stmt.initializer !== null) {
        value = this.evaluate(stmt.initializer);
      }
      this.environment.define(stmt.name.lexeme, value);
      return null;
    }

    if (stmt instanceof ExpressionStatement) {
      this.evaluate(stmt.expression);
      return null;
    }
  }

  evaluate(expr) {
    if (expr instanceof Literal) {
      return expr.value;
    }

    if (expr instanceof Variable) {
      return this.environment.get(expr.name);
    }

    if (expr instanceof Call) {
      const callee = this.evaluate(expr.callee);
      const args = expr.args.map(arg => this.evaluate(arg));

      if (typeof callee.call !== 'function') {
        throw new Error("isso aqui não dá pra chamar não, patrão.");
      }

      return callee.call(this, args);
    }

    throw new Error("isso aqui deu ruim patrão, não sei o que é esse nó.");
  }
}

module.exports = { Interpreter };
