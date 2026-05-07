const BananilErrorHandler = require('../errors/BananilErrorHandler');
const { TokenType } = require('../../lexer/TokenType');
const { ReturnStatement, VarDeclaration, FunctionDeclaration } = require('../../ast/Nodes');

class ModeManager {
  static modifyAnnounceArgs(mode, args) {
    let prefix = "";
    if (mode === 'clt') prefix = "[PONTO BATIDO] ";
    
    const processedArgs = args.map(arg => {
      if (mode === 'caos' && typeof arg === 'string' && Math.random() < 0.3) {
        return arg + " " + Math.random().toString(36).substring(7);
      }
      return arg;
    });

    return { prefix, processedArgs };
  }

  static handleExecution(interpreter, stmt, executeCallback) {
    if (interpreter.currentMode === 'caos') {
      if (!(stmt instanceof VarDeclaration || stmt instanceof FunctionDeclaration) && Math.random() < 0.1) {
        return; // Pula a instrução
      }
    }

    try {
      executeCallback(stmt);
      interpreter.errorCount = 0;
    } catch (error) {
      // Verifica se é o erro de 'Return' customizado do interpretador
      if (error.constructor.name === 'Return') throw error;

      // Se no momento do erro o modo for 'raiz', nós silenciamos e seguimos
      if (interpreter.currentMode === 'raiz') {
        interpreter.errorCount++;
        if (interpreter.errorCount > 100) {
          throw BananilErrorHandler.tooManyErrorsRootMode();
        }
        console.log("deu ruim, mas seguimos (modo raiz) 🐕");
        return;
      }

      // Caso contrário (firmeza, clt, jeitinho, caos), o erro deve subir
      throw error;
    }
  }

  static applyCLTSleep(mode) {
    if (mode === 'clt') {
      const start = Date.now();
      while (Date.now() - start < 10) { /* sleep */ }
    }
  }

  static handleUninitializedVar(mode, line, name) {
    if (mode === 'clt') {
      throw BananilErrorHandler.uninitializedCLT(line, name);
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
    if (mode === 'clt') throw BananilErrorHandler.divisionByZeroCLT();
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
