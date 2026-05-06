const { TokenType } = require('../../lexer/TokenType');
const BananilErrorHandler = require('../errors/BananilErrorHandler');

class Modifiers {
  static evaluateVarDeclaration(modifier, evaluateCallback) {
    if (modifier && modifier.type === TokenType.SUAVE) {
      try {
        return evaluateCallback();
      } catch (error) {
        return false; // suave silencia o erro e vira mentira
      }
    } else {
      return evaluateCallback();
    }
  }

  static executeModifierBlock(modifierType, executeCallback, ReturnClass) {
    if (modifierType === TokenType.SUAVE) {
      try {
        executeCallback();
      } catch (error) {
        if (error instanceof ReturnClass) throw error;
        // suave silencia o erro no bloco
      }
    } else if (modifierType === TokenType.NERVOSO) {
      // Lógica nervosa: chance de erro aleatório
      if (Math.random() < 0.3) {
        throw BananilErrorHandler.nervosoAttack();
      }
      executeCallback();
    } else {
      // firmeza: comportamento padrão
      executeCallback();
    }
  }
}

module.exports = Modifiers;
