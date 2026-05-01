const fs = require('fs');
const path = require('path');
const { Lexer } = require('../lexer/Lexer');
const { Parser } = require('../parser/Parser');
const { Interpreter } = require('../interpreter/Interpreter');

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("🐕 BananilScript - Vira-lata Caramelo Edition");
    console.log("Uso: bananil <arquivo.bna>");
    return;
  }

  const filePath = path.resolve(args[0]);
  if (!fs.existsSync(filePath)) {
    console.error(`Erro: O arquivo '${args[0]}' não foi encontrado.`);
    return;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  run(source);
}

function run(source) {
  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();

  const parser = new Parser(tokens);
  const statements = parser.parse();

  // Se o parser falhar, ele já loga o erro e retorna null/statements incompletos
  if (!statements || statements.some(s => s === null)) return;

  const interpreter = new Interpreter();
  interpreter.interpret(statements);
}

main();
