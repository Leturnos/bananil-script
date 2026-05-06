const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

describe('CLI Check Tests', () => {
  const cliPath = path.resolve(__dirname, '../cli/index.js');
  const validFile = path.resolve(__dirname, 'temp_valid.bna');
  const invalidFile = path.resolve(__dirname, 'temp_invalid.bna');

  afterAll(() => {
    if (fs.existsSync(validFile)) fs.unlinkSync(validFile);
    if (fs.existsSync(invalidFile)) fs.unlinkSync(invalidFile);
  });

  test('bananil check deve retornar exit 0 para arquivo válido', () => {
    fs.writeFileSync(validFile, 'jeito x = 10; anuncia(x);');
    const result = spawnSync('node', [cliPath, 'check', validFile]);
    expect(result.status).toBe(0);
  });

  test('bananil check deve retornar exit 1 para arquivo inválido', () => {
    fs.writeFileSync(invalidFile, 'jeito = 10;'); // Erro de sintaxe
    const result = spawnSync('node', [cliPath, 'check', invalidFile]);
    expect(result.status).toBe(1);
  });
});
