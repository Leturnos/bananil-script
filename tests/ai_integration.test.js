const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { runWithAutoFix } = require('../cli/index');

describe('Fase 6: Integração com IA (Auto-Gambiarra)', () => {
  const testFile = path.join(__dirname, 'temp_error.bna');
  const gambiarraFile = path.join(__dirname, 'temp_error.gambiarra.bna');

  afterEach(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    if (fs.existsSync(gambiarraFile)) fs.unlinkSync(gambiarraFile);
  });

  // 1. Mock do AIAdapter (ESSENCIAL)
  class MockAIAdapter {
    constructor(suggestion = "jeito x = 10 / 1") {
      this.suggestion = suggestion;
    }
    async fixCode(code, error) {
      return this.suggestion;
    }
  }

  // 2. Teste E2E (Mantendo um execSync para sanidade do binário)
  test('Deve falhar sem a flag --auto-fix (E2E)', () => {
    fs.writeFileSync(testFile, 'jeito x = '); 
    try {
      execSync(`node cli/index.js run ${testFile}`, { stdio: 'pipe' });
    } catch (error) {
      expect(error.status).toBe(1);
      expect(error.stderr.toString()).toContain('Erro no');
    }
  });

  // 3. Teste real da auto-gambiarra
  test('Deve gerar arquivo gambiarra com código corrigido', async () => {
    fs.writeFileSync(testFile, 'jeito x = ');
    const mockAI = new MockAIAdapter('jeito x = 1');

    await runWithAutoFix({
      source: 'jeito x = ',
      filePath: testFile,
      autoFix: true,
      maxRetries: 1,
      adapter: mockAI
    });

    expect(fs.existsSync(gambiarraFile)).toBe(true);
    const content = fs.readFileSync(gambiarraFile, 'utf-8');
    expect(content).toContain('jeito x = 1');
    expect(content).toContain('gerado por auto-gambiarra');
  });

  // 4. Teste de fallback (sem IA)
  test('Não deve gerar gambiarra se o adapter for nulo', async () => {
    fs.writeFileSync(testFile, 'jeito x = ');
    
    try {
      await runWithAutoFix({
        source: 'jeito x = ',
        filePath: testFile,
        autoFix: true,
        maxRetries: 1,
        adapter: null
      });
    } catch (e) {
      expect(fs.existsSync(gambiarraFile)).toBe(false);
    }
  });

  // 5. Teste de código inválido vindo da IA
  test('Não deve aceitar código inválido da IA (Gate Validation)', async () => {
    fs.writeFileSync(testFile, 'jeito x = ');
    const mockAI = new MockAIAdapter('jeito x = '); // Continua inválido

    try {
      await runWithAutoFix({
        source: 'jeito x = ',
        filePath: testFile,
        autoFix: true,
        maxRetries: 1,
        adapter: mockAI
      });
    } catch (e) {
      // Deve falhar após esgotar tentativas sem salvar arquivo válido
      expect(fs.existsSync(gambiarraFile)).toBe(false);
    }
  });

  // Teste de Sanidade do GeminiAdapter (Regex)
  test('GeminiAdapter deve limpar markdown robustamente', () => {
    const GeminiAdapter = require('../ai/GeminiAdapter');
    const adapter = Object.create(GeminiAdapter.prototype);
    
    const cases = [
      ["```bananil\njeito x = 1\n```", "jeito x = 1"],
      ["```\njeito y = 2\n```", "jeito y = 2"],
      ["Código extra ```jeito z = 3```", "jeito z = 3"]
    ];

    cases.forEach(([input, expected]) => {
      expect(adapter.stripCodeFences(input)).toBe(expected);
    });
  });
});
