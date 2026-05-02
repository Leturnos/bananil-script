const readline = require('readline');
const { Lexer } = require('../lexer/Lexer');
const { Parser } = require('../parser/Parser');
const { Interpreter } = require('../interpreter/Interpreter');

function startRepl() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '🐕> '
  });

  const interpreter = new Interpreter();
  let buffer = "";
  let openBraces = 0;

  console.log("🐕 BananilScript REPL - Vira-lata Caramelo Edition");
  console.log("Digite seu código. Use '{' para blocos multi-linha.");
  console.log("Para sair, pressione Ctrl+C ou digite 'vazei()'.");

  rl.prompt();

  rl.on('line', (line) => {
    buffer += line + "\n";
    
    // Contagem simples de chaves para suportar multi-linha
    for (const char of line) {
      if (char === '{') openBraces++;
      if (char === '}') openBraces--;
    }

    if (openBraces <= 0) {
      if (buffer.trim() !== "") {
        try {
          runLine(buffer, interpreter);
        } catch (err) {
          console.error("⚠️  Mano, deu um ruim aqui no REPL, mas a gente dá um jeito.");
        }
      }
      buffer = "";
      openBraces = 0; // Reset para garantir segurança
      rl.setPrompt('🐕> ');
    } else {
      rl.setPrompt('... ');
    }
    rl.prompt();
  }).on('close', () => {
    console.log('\nAté a próxima, patrão! Vazei.');
    process.exit(0);
  });
}

function runLine(source, interpreter) {
  try {
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const statements = parser.parse();

    if (parser.hadError) {
      return;
    }

    interpreter.interpret(statements);
  } catch (error) {
    console.error("⚠️  Opa! A gambiarra não aguentou: " + error.message);
  }
}

module.exports = { startRepl };
