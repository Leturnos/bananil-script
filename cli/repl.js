const readline = require('readline');
const { Lexer } = require('../lexer/Lexer');
const { Parser } = require('../parser/Parser');
const { Interpreter } = require('../interpreter/Interpreter');

const GeminiAdapter = require('../ai/GeminiAdapter');
const NoopAdapter = require('../ai/NoopAdapter');

// Cores simples para o terminal
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m"
};

async function startRepl(args = []) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '🐕> '
  });

  const autoFixArg = args.find(arg => arg.startsWith('--auto-fix'));
  let autoFix = !!autoFixArg;
  let adapter = null;
  if (autoFix) {
    adapter = process.env.GEMINI_API_KEY 
      ? new GeminiAdapter(process.env.GEMINI_API_KEY)
      : new NoopAdapter();
  }

  const interpreter = new Interpreter();
  let buffer = "";
  let openBraces = 0;

  console.log("🐕 BananilScript REPL - Vira-lata Caramelo Edition");
  if (autoFix) console.log(`${colors.cyan}🤖 Auto-gambiarra ativada! (IA pronta para o resgate)${colors.reset}`);
  console.log("Digite seu código. Use '{' para blocos multi-linha.");
  console.log("Para sair, pressione Ctrl+C ou digite 'vazei()'.");

  rl.prompt();

  rl.on('line', async (line) => {
    buffer += line + "\n";

    openBraces += (line.match(/{/g) || []).length;
    openBraces -= (line.match(/}/g) || []).length;

    if (openBraces <= 0) {
      if (buffer.trim() !== "") {
        console.log(`${colors.gray}▶ executando...${colors.reset}`);
        try {
          await runLineWithIA(buffer, interpreter, adapter);
        } catch (err) {
          console.error(`${colors.red}⚠️  Mano, deu um ruim aqui no REPL, mas a gente dá um jeito.${colors.reset}`);
        }
      }
      buffer = "";
      openBraces = 0;
      rl.setPrompt('🐕> ');
    } else {
      rl.setPrompt('...> ');
    }
    rl.prompt();
  }).on('SIGINT', () => {
    if (buffer) {
      console.log(`\n${colors.yellow}⚠️ bloco cancelado${colors.reset}`);
      buffer = "";
      openBraces = 0;
      rl.setPrompt('🐕> ');
      rl.prompt();
    } else {
      console.log(`\n${colors.green}👋 vazei()${colors.reset}`);
      process.exit(0);
    }
  }).on('close', () => {
    console.log('\nAté a próxima, patrão! Vazei.');
    process.exit(0);
  });
  }

  async function runLineWithIA(source, interpreter, adapter) {
  let currentSource = source;

  if (currentSource.includes("modo: caos")) {
    console.log(`${colors.red}🌪️  Modo caos ativado! Segura na mão de Deus...${colors.reset}`);
  }

  try {
    const lexer = new Lexer(currentSource);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const statements = parser.parse();

    if (parser.hadError) {
      if (adapter) {
        console.log(`${colors.yellow}🤖 Detectei erro de sintaxe. Chamando o vira-lata inteligente...${colors.reset}`);
        const fixed = await adapter.fixCode(currentSource, "Erro de sintaxe no REPL.");
        
        // Gate de validação
        const l2 = new Lexer(fixed);
        const p2 = new Parser(l2.tokenize());
        const s2 = p2.parse();
        
        if (!p2.hadError) {
          console.log(`${colors.green}✨ Sugestão corrigida:${colors.reset} ${fixed.trim()}`);
          interpreter.interpret(s2);
          return;
        }
      }
      return;
    }

    interpreter.interpret(statements);
  } catch (error) {
    if (adapter && error.type === 'RuntimeError') {
       console.log(`${colors.yellow}🤖 Deu erro no corre. Tentando dar um jeitinho...${colors.reset}`);
       const fixed = await adapter.fixCode(currentSource, error.message);
       
       const l2 = new Lexer(fixed);
       const p2 = new Parser(l2.tokenize());
       const s2 = p2.parse();
       
       if (!p2.hadError) {
         console.log(`${colors.green}✨ Jeitinho da IA:${colors.reset} ${fixed.trim()}`);
         interpreter.interpret(s2);
         return;
       }
    }
    console.error(`${colors.red}⚠️  Opa! A gambiarra não aguentou: ${error.message}${colors.reset}`);
  }
}

module.exports = { startRepl };
