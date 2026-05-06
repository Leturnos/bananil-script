const AIAdapter = require("./AIAdapter");

/**
 * Adaptador "vazio" utilizado quando a IA está desativada ou a API Key não foi fornecida.
 */
class NoopAdapter extends AIAdapter {
  async fixCode(code, errorMessage) {
    console.warn("🤖 IA desativada ou GEMINI_API_KEY ausente. Sem correção automática.");
    return code;
  }

  async explainError(error, contextCode) {
    return `Mano, a IA tá de folga (sem API Key). Mas ó o que rolou: ${error.message}`;
  }
}

module.exports = NoopAdapter;
