/**
 * Interface abstrata para adaptadores de IA no BananilScript.
 * Segue o princípio de inversão de dependência para facilitar mocks em testes.
 */
class AIAdapter {
  /**
   * Explica um erro ocorrido no código.
   * @param {Error} error - O objeto de erro capturado.
   * @param {string} contextCode - O código fonte original onde o erro ocorreu.
   * @returns {Promise<string>} - Explicação amigável da IA.
   */
  async explainError(error, contextCode) {
    throw new Error("explainError() não implementado pelo adaptador.");
  }

  /**
   * Tenta corrigir um código que falhou.
   * @param {string} code - O código fonte original.
   * @param {string} errorMessage - A mensagem de erro gerada.
   * @returns {Promise<string>} - O código BananilScript sugerido (apenas o código).
   */
  async fixCode(code, errorMessage) {
    throw new Error("fixCode() não implementado pelo adaptador.");
  }
}

module.exports = AIAdapter;
