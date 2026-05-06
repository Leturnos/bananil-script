const BananilErrorHandler = require('../errors/BananilErrorHandler');
const { TokenType } = require('../../lexer/TokenType');
const { ReturnStatement, VarDeclaration, FunctionDeclaration } = require('../../ast/Nodes');

class ModeManager {
  static modifyAnnounceArgs(mode, args) {
    let prefix = "";
    if (mode === 'CLT') prefix = "[PONTO BATIDO] ";
    
    const processedArgs = args.map(arg => {
      if (mode === 'caos' && typeof arg === 'string' && Math.random() < 0.3) {
        return arg + " " + Math.random().toString(36).substring(7);
      }
      return arg;
    });

    return { prefix, processedArgs };
  }

  static handleExecution(mode, interpreter, stmt, executeCallback) {
    if (mode === 'caos') {
      if (!(stmt instanceof VarDeclaration || stmt instanceof FunctionDeclaration) && Math.random() < 0.1) {
        return; // Pula a instrução
      }
    }

    if (mode === 'raiz') {
      try {
        executeCallback(stmt);
        interpreter.errorCount = 0;
      } catch (error) {
        if (error instanceof Error && error.value !== undefined) throw error; // Hack para return
        
        interpreter.errorCount++;
        if (interpreter.errorCount > 100) {
          throw BananilErrorHandler.tooManyErrorsRootMode();
        }
        console.log("deu ruim, mas seguimos (modo raiz) 🐕");
      }
    } else {
      executeCallback(stmt);
      interpreter.errorCount = 0;
    }
  }

  static applyCLTSleep(mode) {
    if (mode === 'CLT') {
      const start = Date.now();
      while (Date.now() - start < 10) { /* sleep */ }
    }
  }

  static handleUninitializedVar(mode) {
    if (mode === 'CLT') {
      throw BananilErrorHandler.uninitializedCLT();
    }
    if (mode === 'jeitinho') {
      return 0; // O jeitinho brasileiro
    }
    return null;
  }

  static handleMissingVariable(mode, error) {
    if (mode === 'jeitinho') return 0;
    throw error;
  }

  static handleDivisionByZero(mode, line) {
    if (mode === 'jeitinho') return 1;
    throw BananilErrorHandler.divisionByZero(line);
  }

  static modifyOperator(mode, type) {
    if (mode === 'caos' && Math.random() < 0.1) {
      if (type === TokenType.PLUS) return TokenType.MINUS;
      if (type === TokenType.MINUS) return TokenType.PLUS;
    }
    return type;
  }
}

module.exports = ModeManager;
