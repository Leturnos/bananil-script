const fs = require('fs');
const path = require('path');
const { Lexer } = require('../lexer/Lexer');
const { Parser } = require('../parser/Parser');
const { Interpreter } = require('../interpreter/Interpreter');

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printHelp();
    return;
  }

  const command = args[0];

  if (command === "check") {
    handleCheck(args.slice(1));
  } else if (command === "run") {
    handleRun(args.slice(1));
  } else if (args[0].endsWith('.bna')) {
    // Retrocompatibilidade: bananil arquivo.bna
    handleRun(args);
  } else {
    console.error(`Erro: Comando desconhecido '${command}'.`);
    printHelp();
    process.exit(1);
  }
}

function printHelp() {
  console.log("🐕 BananilScript - Vira-lata Caramelo Edition");
  console.log("Uso:");
  console.log("  bananil run <arquivo.bna> [--modo=caos|jeitinho|CLT|raiz]");
  console.log("  bananil check <arquivo.bna>");
}

function handleCheck(args) {
  const filePathArg = args.find(arg => !arg.startsWith('--'));
  if (!filePathArg) {
    console.error("Erro: Nenhum arquivo especificado para checagem.");
    process.exit(1);
  }

  const source = readSource(filePathArg);
  const success = check(source);
  
  if (success) {
    console.log("✅ Tá limpo, chefe! O código tá nos trinks.");
    process.exit(0);
  } else {
    console.error("❌ Deu ruim na gramática. Tem erro aí, hein!");
    process.exit(1);
  }
}

function handleRun(args) {
  const filePathArg = args.find(arg => !arg.startsWith('--'));
  if (!filePathArg) {
    console.error("Erro: Nenhum arquivo especificado para execução.");
    process.exit(1);
  }

  const modoArg = args.find(arg => arg.startsWith('--modo='));
  const modo = modoArg ? modoArg.split('=')[1] : null;

  const source = readSource(filePathArg);
  run(source, modo);
}

function readSource(filePathArg) {
  const filePath = path.resolve(filePathArg);
  if (!fs.existsSync(filePath)) {
    console.error(`Erro: O arquivo '${filePathArg}' não foi encontrado.`);
    process.exit(1);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function check(source) {
  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();

  const parser = new Parser(tokens);
  parser.parse();

  return !parser.hadError;
}

function run(source, modo) {
  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();

  const parser = new Parser(tokens);
  const statements = parser.parse();

  if (parser.hadError) {
    process.exit(1);
  }

  const interpreter = new Interpreter();
  if (modo) {
    interpreter.currentMode = modo;
  }
  interpreter.interpret(statements);
}

main();
