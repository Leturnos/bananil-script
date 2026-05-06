require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Lexer } = require('../lexer/Lexer');
const { Parser } = require('../parser/Parser');
const { Interpreter } = require('../interpreter/Interpreter');
const { startRepl } = require('./repl');
const GeminiAdapter = require('../ai/GeminiAdapter');
const NoopAdapter = require('../ai/NoopAdapter');
const diff = require('diff');

// Cores simples para o terminal
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m"
};

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printHelp();
    return;
  }

  const command = args[0];

  if (command === "check") {
    handleCheck(args.slice(1));
  } else if (command === "run") {
    await handleRun(args.slice(1));
  } else if (command === "repl") {
    await startRepl(args.slice(1));
  } else if (args[0].endsWith('.bna')) {
    await handleRun(args);
  } else {
    console.error(`Erro: Comando desconhecido '${command}'.`);
    printHelp();
    process.exit(1);
  }
}

function printHelp() {
  console.log("🐕 BananilScript - Vira-lata Caramelo Edition");
  console.log("Uso:");
  console.log("  bananil run <arquivo.bna> [--modo=...] [--auto-fix[=N|ask]]");
  console.log("  bananil check <arquivo.bna>");
  console.log("  bananil repl");
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

async function handleRun(args) {
  const filePathArg = args.find(arg => !arg.startsWith('--'));
  if (!filePathArg) {
    console.error("Erro: Nenhum arquivo especificado para execução.");
    process.exit(1);
  }

  const modoArg = args.find(arg => arg.startsWith('--modo='));
  const modo = modoArg ? modoArg.split('=')[1] : null;

  const autoFixArg = args.find(arg => arg.startsWith('--auto-fix'));
  let autoFix = false;
  let maxRetries = 1;
  let ask = false;

  if (autoFixArg) {
    autoFix = true;
    const value = autoFixArg.split('=')[1];
    if (value === 'ask') {
      ask = true;
    } else if (value) {
      maxRetries = parseInt(value, 10);
    }
  }

  const source = readSource(filePathArg);
  const filePath = path.resolve(filePathArg);

  // Injeção do Adapter (NoopAdapter como fallback profissional)
  let adapter = null;
  if (autoFix) {
    adapter = process.env.GEMINI_API_KEY 
      ? new GeminiAdapter(process.env.GEMINI_API_KEY)
      : new NoopAdapter();
  }

  try {
    await runWithAutoFix({
      source,
      filePath,
      modo,
      autoFix,
      maxRetries,
      ask,
      adapter
    });
  } catch (error) {
    process.exit(1);
  }
}

async function runWithAutoFix({ source, filePath, modo, autoFix, maxRetries, ask, adapter }) {
  let currentSource = source;
  let currentPath = filePath;
  let attempts = 0;

  while (attempts <= maxRetries) {
    try {
      const lexer = new Lexer(currentSource);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const statements = parser.parse();

      if (parser.hadError) {
        throw { type: 'SyntaxError', message: 'Erro de sintaxe detectado pelo parser.' };
      }

      const interpreter = new Interpreter();
      if (modo) interpreter.currentMode = modo;
      
      interpreter.interpret(statements);
      // Se chegou aqui, deu certo!
      if (attempts > 0) {
        console.log(`${colors.green}✅ Gambiarra funcionou! Rodou liso.${colors.reset}`);
      }
      return true;
    } catch (error) {
      const isAutoFixable = (error.type === 'SyntaxError' || error.type === 'RuntimeError');
      
      if (!autoFix || !adapter || !isAutoFixable || attempts >= maxRetries) {
        if (attempts > 0) console.error(`${colors.red}❌ A gambiarra não foi o suficiente...${colors.reset}`);
        throw error;
      }

      attempts++;
      console.log(`${colors.yellow}🤖 Tentativa de auto-gambiarra ${attempts}/${maxRetries}...${colors.reset}`);
      
      try {
        const fixedCode = await adapter.fixCode(currentSource, error.message || "Erro desconhecido");
        
        // Gate de Validação
        const lexerGate = new Lexer(fixedCode);
        const tokensGate = lexerGate.tokenize();
        const parserGate = new Parser(tokensGate);
        parserGate.parse();

        if (parserGate.hadError) {
          console.error(`${colors.red}⚠️ IA sugeriu um código inválido. Abortando tentativa.${colors.reset}`);
          continue;
        }

        showDiff(currentSource, fixedCode);

        // Salvar arquivo .gambiarra.bna
        const gambiarraPath = currentPath.replace('.bna', '.gambiarra.bna');
        const header = `// gerado por auto-gambiarra\n// erro original: ${error.message || 'Desconhecido'}\n// data: ${new Date().toISOString()}\n\n`;
        const finalContent = header + fixedCode;
        
        fs.writeFileSync(gambiarraPath, finalContent);
        console.log(`${colors.gray}Novo código salvo em: ${path.basename(gambiarraPath)}${colors.reset}`);
        
        currentSource = fixedCode;
        currentPath = gambiarraPath;
      } catch (aiError) {
        console.error(`${colors.red}❌ Falha na IA: ${aiError.message}${colors.reset}`);
        throw aiError;
      }
    }
  }
}

function showDiff(oldCode, newCode) {
  const changes = diff.diffLines(oldCode, newCode);
  console.log(`${colors.gray}--- original${colors.reset}`);
  console.log(`${colors.gray}+++ gambiarra${colors.reset}`);
  
  changes.forEach((part) => {
    const color = part.added ? colors.green : part.removed ? colors.red : colors.reset;
    const prefix = part.added ? '+' : part.removed ? '-' : ' ';
    
    const lines = part.value.split('\n');
    lines.forEach(line => {
      if (line || part.value.endsWith('\n') && lines.indexOf(line) < lines.length - 1) {
        process.stdout.write(`${color}${prefix} ${line}${colors.reset}\n`);
      }
    });
  });
  console.log("");
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

if (require.main === module) {
  main();
}

module.exports = {
  main,
  handleRun,
  runWithAutoFix,
  check,
  showDiff
};
