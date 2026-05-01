const fs = require('fs');
const path = require('path');
const { Lexer } = require('../lexer/Lexer');
const { Parser } = require('../parser/Parser');
const { Interpreter } = require('../interpreter/Interpreter');

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("🐕 BananilScript - Vira-lata Caramelo Edition");
    console.log("Uso: bananil <arquivo.bna> [--modo=caos|jeitinho|CLT|raiz]");
    return;
  }

  const filePathArg = args.find(arg => !arg.startsWith('--'));
  if (!filePathArg) {
    console.error("Erro: Nenhum arquivo especificado.");
    return;
  }

  const filePath = path.resolve(filePathArg);
  if (!fs.existsSync(filePath)) {
    console.error(`Erro: O arquivo '${filePathArg}' não foi encontrado.`);
    return;
  }

  const modoArg = args.find(arg => arg.startsWith('--modo='));
  const modo = modoArg ? modoArg.split('=')[1] : null;

  const source = fs.readFileSync(filePath, 'utf8');
  run(source, modo);
}

function run(source, modo) {
  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();

  const parser = new Parser(tokens);
  const statements = parser.parse();

  // Se o parser falhar, ele já loga o erro e retorna null/statements incompletos
  if (!statements || statements.some(s => s === null)) return;

  const interpreter = new Interpreter();
  if (modo) {
    interpreter.currentMode = modo;
  }
  interpreter.interpret(statements);
}

main();
