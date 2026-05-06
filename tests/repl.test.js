const { spawnSync } = require('child_process');
const path = require('path');

describe('REPL CLI Tests', () => {
  const cliPath = path.resolve(__dirname, '../cli/index.js');

  test('Execução simples no REPL', () => {
    const simpleInput = 'anuncia("ola")\n';
    const result = spawnSync('node', [cliPath, 'repl'], { input: simpleInput });
    expect(result.stdout.toString()).toContain("ola");
  });

  test('Execução multi-linha (contagem de chaves) no REPL', () => {
    const multiInput = 'corre oi() {\nanuncia("oi")\n}\noi()\n';
    const result = spawnSync('node', [cliPath, 'repl'], { input: multiInput });
    expect(result.stdout.toString()).toContain("oi");
  });

  test('Resiliência a erros no REPL', () => {
    // Agora o REPL imprime '▶ executando...' e o interpretador imprime o erro
    const errorInput = 'anuncia(inexistente)\n';
    const result = spawnSync('node', [cliPath, 'repl'], { input: errorInput });
    const combinedOutput = result.stdout.toString() + result.stderr.toString();
    expect(combinedOutput).toContain("sumiu no meio do rolê");
    // O REPL não crasha e volta ao prompt
    expect(combinedOutput).toContain("🐕>");
  });
});
