const { Environment } = require('../runtime/scope/Environment');
const BananilErrorHandler = require('../runtime/errors/BananilErrorHandler');
const ModeManager = require('../runtime/modes/ModeManager');
const Modifiers = require('../runtime/types/Modifiers');
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

    interpreter.callDepth++;
    if (interpreter.callDepth > 50 && interpreter.currentMode === 'clt') {
      throw BananilErrorHandler.recursionLimitCLT();
    }

    try {
      interpreter.executeBlock(this.declaration.body, environment);
    } catch (returnValue) {
      if (returnValue instanceof Return) return returnValue.value;
      throw returnValue;
    } finally {
      interpreter.callDepth--;
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
    this.errorCount = 0; // Contador de erros para o modo raiz
    this.callDepth = 0; // Controle de recursão

    // Registrar funções nativas
    this.globals.define("anuncia", {
      isNative: true,
      call: (interpreter, args) => {
        const { prefix, processedArgs } = ModeManager.modifyAnnounceArgs(interpreter.currentMode, args);
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
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  execute(stmt) {
    ModeManager.handleExecution(this, stmt, (s) => this.doExecute(s));
  }

  doExecute(stmt) {
    ModeManager.applyCLTSleep(this.currentMode);

    if (stmt instanceof ModeDeclaration) {
      this.currentMode = stmt.mode.lexeme.toLowerCase();
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
      let value = null;
      if (stmt.initializer === null) {
        value = ModeManager.handleUninitializedVar(this.currentMode, stmt.name.line, stmt.name.lexeme);
      } else {
        value = Modifiers.evaluateVarDeclaration(stmt.modifier, () => this.evaluate(stmt.initializer));
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
          if (this.currentMode === 'clt') {
            throw BananilErrorHandler.infiniteLoopCLT();
          }
          throw BananilErrorHandler.infiniteLoop();
        }
        this.execute(stmt.body);
        iterations++;
      }
      return null;
    }

    if (stmt instanceof ModifierBlock) {
      Modifiers.executeModifierBlock(stmt.modifier.type, () => this.execute(stmt.body), Return);
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
        return ModeManager.handleMissingVariable(this.currentMode, error);
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

      // Tratamento de Divisão por Zero
      if (expr.operator.type === TokenType.SLASH && right === 0) {
        return ModeManager.handleDivisionByZero(this.currentMode, expr.operator.line);
      }

      let type = ModeManager.modifyOperator(this.currentMode, expr.operator.type);

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
        throw BananilErrorHandler.notCallable();
      }

      return callee.call(this, args);
    }

    throw BananilErrorHandler.unknownNode();
  }

  isTruthy(object) {
    if (object === null) return false;
    if (typeof object === "boolean") return object;
    return true;
  }
}

module.exports = { Interpreter, Return };
