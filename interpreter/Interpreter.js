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
  ModifierBlock,
  ModeDeclaration,
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
    this.currentMode = 'firmeza';

    // Registrar funções nativas
    this.globals.define("anuncia", {
      isNative: true,
      call: (interpreter, args) => {
        let prefix = "";
        if (interpreter.currentMode === 'CLT') prefix = "[PONTO BATIDO] ";
        
        const processedArgs = args.map(arg => {
          if (interpreter.currentMode === 'caos' && typeof arg === 'string' && Math.random() < 0.3) {
            return arg + " " + Math.random().toString(36).substring(7);
          }
          return arg;
        });

        console.log(prefix + processedArgs.join(" "));
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
    // Detectar modo global (se houver um modo: no topo)
    if (statements.length > 0 && statements[0] instanceof ModeDeclaration) {
      this.currentMode = statements[0].mode.lexeme;
    }

    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  execute(stmt) {
    if (this.currentMode === 'raiz') {
      try {
        this.doExecute(stmt);
      } catch (error) {
        if (error instanceof Return) throw error;
        console.log("deu ruim, mas seguimos (modo raiz) 🐕");
      }
    } else {
      this.doExecute(stmt);
    }
  }

  doExecute(stmt) {
    if (this.currentMode === 'CLT') {
      // Simular lentidão burocrática (sync sleep fake)
      const start = Date.now();
      while (Date.now() - start < 50) { /* bloqueia 50ms */ }
    }

    if (stmt instanceof ModeDeclaration) {
      this.currentMode = stmt.mode.lexeme;
      return null;
    }

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
      if (this.currentMode === 'CLT' && stmt.initializer === null) {
        throw new Error("Mano, na CLT você tem que bater o ponto completo. Cadê o valor inicial da variável?");
      }
      let value = null;
      if (stmt.initializer !== null) {
        if (stmt.modifier && stmt.modifier.type === TokenType.SUAVE) {
          try {
            value = this.evaluate(stmt.initializer);
          } catch (error) {
            value = false; // suave silencia o erro e vira mentira
          }
        } else {
          value = this.evaluate(stmt.initializer);
        }
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

    if (stmt instanceof ModifierBlock) {
      const modifierType = stmt.modifier.type;

      if (modifierType === TokenType.SUAVE) {
        try {
          this.execute(stmt.body);
        } catch (error) {
          if (error instanceof Return) throw error;
          // suave silencia o erro no bloco
        }
      } else if (modifierType === TokenType.NERVOSO) {
        // Lógica nervosa: chance de erro aleatório
        if (Math.random() < 0.3) {
          throw new Error("mano, deu um treco aqui... o nervoso atacou! 😤\n\nno corre: principal\n\ntenta de novo aí na moral");
        }
        this.execute(stmt.body);
      } else {
        // firmeza: comportamento padrão
        this.execute(stmt.body);
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
      try {
        return this.environment.get(expr.name);
      } catch (error) {
        if (this.currentMode === 'jeitinho') return 0;
        throw error;
      }
    }

    if (expr instanceof Assign) {
      const value = this.evaluate(expr.value);
      this.environment.assign(expr.name, value);
      return value;
    }

    if (expr instanceof Binary) {
      let left = this.evaluate(expr.left);
      let right = this.evaluate(expr.right);

      // Modo Jeitinho: divisão por zero vira 1
      if (this.currentMode === 'jeitinho' && expr.operator.type === TokenType.SLASH && right === 0) {
        return 1;
      }

      let type = expr.operator.type;
      
      // Modo Caos: 10% de chance de trocar + por - e vice-versa
      if (this.currentMode === 'caos' && Math.random() < 0.1) {
        if (type === TokenType.PLUS) type = TokenType.MINUS;
        else if (type === TokenType.MINUS) type = TokenType.PLUS;
      }

      switch (type) {
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
