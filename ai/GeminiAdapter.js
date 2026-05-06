const { GoogleGenerativeAI } = require("@google/generative-ai");
const AIAdapter = require("./AIAdapter");

/**
 * Implementação do adaptador de IA utilizando o Google Gemini.
 */
class GeminiAdapter extends AIAdapter {
  constructor(apiKey) {
    super();
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY não configurada. A auto-gambiarra precisa dela!");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  /**
   * Remove blocos de código markdown (fences) e qualquer texto ao redor.
   * @param {string} text 
   * @returns {string}
   */
  stripCodeFences(text) {
    // Tenta extrair o que está entre as fences (triplas)
    // Suporta ```bananil\ncodigo``` ou ```codigo```
    const match = text.match(/```(?:[a-z]*\n)?([\s\S]*?)```/);
    if (match) return match[1].trim();
    
    // Se não houver fences, limpa apenas espaços
    return text.trim();
  }

  async fixCode(code, errorMessage) {
    const prompt = `
Você é um especialista na linguagem "BananilScript".

REGRAS DA LINGUAGEM:
- Variáveis são declaradas com: jeito x = 10
- Booleanos: é_mermo (true), mentira (false)
- Saída: anuncia("texto")
- Condicional: se pá <condição>: ... senao: ...
- Loop: enquanto der <condição>: ...
- Função: corre nome(): ... devolve valor
- Try/catch: gambiarra: ... fé: ...
- Evite erros de sintaxe (sempre feche blocos corretamente com fim do escopo implícito ou identação)

EXEMPLO DE CORREÇÃO (FEW-SHOT):
Código: jeito x = 10 / 0
Erro: Divisão por zero
Sugestão: jeito x = 10 / 1

TAREFAS:
1. Corrigir o código mantendo a intenção original.
2. Garantir que o código seja válido sintaticamente conforme as regras acima.
3. NÃO inventar novas palavras-chave ou funções globais além de 'anuncia'.
4. NÃO adicionar explicações, saudações ou comentários extras.
5. NÃO usar markdown (fences de código).
6. Divisão por zero -> substituir por valor seguro (ex: 1) ou tratar.

CÓDIGO QUE FALHOU:
ERRO: ${errorMessage}
FONTE ORIGINAL:
${code}

RETORNE APENAS O CÓDIGO CORRIGIDO:
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let cleanedCode = this.stripCodeFences(response.text());

      if (!cleanedCode || cleanedCode.length < 3) {
        throw new Error("IA retornou código curto demais ou vazio.");
      }

      return cleanedCode;
    } catch (error) {
      console.error("❌ Falha na comunicação com o Gemini:", error.message);
      throw error;
    }
  }

  async explainError(error, contextCode) {
    const prompt = `
Explique o erro abaixo em BananilScript:
- Use gírias brasileiras (leve, não exagerado, estilo vira-lata caramelo)
- Seja claro e útil para o desenvolvedor
- Se possível, sugira como corrigir de forma rápida

ERRO: ${error.message}
CÓDIGO ONDE OCORREU:
${contextCode}

EXPLICAÇÃO:
`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (e) {
      return `Mano, deu um revertério aqui e nem eu sei o que rolou: ${error.message}`;
    }
  }
}

module.exports = GeminiAdapter;
