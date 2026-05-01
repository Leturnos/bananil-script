const { Environment } = require('../runtime/scope/Environment');
const { 
  VarDeclaration, 
  ExpressionStatement, 
  Block, 
  If, 
  While, 
  FunctionDeclaration,
  ReturnStatement,
  TryCatchStatement,
  Literal, 
  Variable, 
  Call, 
  Assign, 
  Binary 
} = require('../ast/Nodes');
const { TokenType } = require('../lexer/TokenType');

class Return extends Error {
  constructor(value) {
    super();
    this.value = value;
  }
}

class BananilFunction {
  constructor(declaration, closure) {
    this.declaration = declaration;
    this.closure = closure;
  }

  call(interpreter, args) {
    const environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, args[i]);
    }

    try {
      interpreter.executeBlock(this.declaration.body, environment);
    } catch (returnValue) {
      if (returnValue instanceof Return) return returnValue.value;
      throw returnValue;
    }
    return null;
  }
}

class Interpreter {
  constructor() {
    this.globals = new Environment();
    this.environment = this.globals;
    this.MAX_ITERATIONS = 1000;

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
    if (stmt instanceof FunctionDeclaration) {
      const functionObj = new BananilFunction(stmt, this.environment);
      this.environment.define(stmt.name.lexeme, functionObj);
      return null;
    }

    if (stmt instanceof ReturnStatement) {
      let value = null;
      if (stmt.value !== null) value = this.evaluate(stmt.value);
      throw new Return(value);
    }

    if (stmt instanceof TryCatchStatement) {
      try {
        this.execute(stmt.tryBranch);
      } catch (error) {
        // Se for um Return, não capturamos (deixa borbulhar)
        if (error instanceof Return) throw error;
        
        // Entra no bloco fé
        this.execute(stmt.catchBranch);
      }
      return null;
    }

    if (stmt instanceof VarDeclaration) {
      let value = null;
      if (stmt.initializer !== null) {
        value = this.evaluate(stmt.initializer);
      }
      this.environment.define(stmt.name.lexeme, value);
      return null;
    }

    if (stmt instanceof If) {
      if (this.isTruthy(this.evaluate(stmt.condition))) {
        this.execute(stmt.thenBranch);
      } else if (stmt.elseBranch !== null) {
        this.execute(stmt.elseBranch);
      }
      return null;
    }

    if (stmt instanceof While) {
      let iterations = 0;
      while (this.isTruthy(this.evaluate(stmt.condition))) {
        if (iterations >= this.MAX_ITERATIONS) {
          throw new Error("mano, cansei de rodar isso aqui, deu loop infinito né?\n\nno corre: principal\n\ntenta de novo aí na moral");
        }
        this.execute(stmt.body);
        iterations++;
      }
      return null;
    }

    if (stmt instanceof Block) {
      this.executeBlock(stmt.statements, new Environment(this.environment));
      return null;
    }

    if (stmt instanceof ExpressionStatement) {
      this.evaluate(stmt.expression);
      return null;
    }
  }

  executeBlock(statements, environment) {
    const previous = this.environment;
    try {
      this.environment = environment;
      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  evaluate(expr) {
    if (expr instanceof Literal) {
      return expr.value;
    }

    if (expr instanceof Variable) {
      return this.environment.get(expr.name);
    }

    if (expr instanceof Assign) {
      const value = this.evaluate(expr.value);
      this.environment.assign(expr.name, value);
      return value;
    }

    if (expr instanceof Binary) {
      const left = this.evaluate(expr.left);
      const right = this.evaluate(expr.right);

      switch (expr.operator.type) {
        case TokenType.GREATER: return left > right;
        case TokenType.GREATER_EQUALS: return left >= right;
        case TokenType.LESS: return left < right;
        case TokenType.LESS_EQUALS: return left <= right;
        case TokenType.NOT_EQUALS: return left !== right;
        case TokenType.EQUALS: return left === right;
        case TokenType.MINUS: return left - right;
        case TokenType.PLUS: return left + right;
        case TokenType.SLASH: return left / right;
        case TokenType.STAR: return left * right;
      }
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

  isTruthy(object) {
    if (object === null) return false;
    if (typeof object === "boolean") return object;
    return true;
  }
}

module.exports = { Interpreter };
