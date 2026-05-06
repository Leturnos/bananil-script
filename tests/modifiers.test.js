const { Lexer } = require('../lexer/Lexer');
const { Parser } = require('../parser/Parser');
const { Interpreter } = require('../interpreter/Interpreter');

function runBna(code) {
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const statements = parser.parse();
  const interpreter = new Interpreter();
  
  // Silenciar console.error para os testes
  const originalError = console.error;
  console.error = () => {};

  let output = [];
  // Redirecionar anuncia para capturar saída
  interpreter.globals.define("anuncia", {
    isNative: true,
    call: (interpreter, args) => {
      output.push(args.join(" "));
      return null;
    }
  });

  try {
    // Usar doExecute para testar falhas diretamente sem o catch global do interpret()
    for (const stmt of statements) {
      interpreter.execute(stmt);
    }
  } catch (e) {
    console.error = originalError;
    return { success: false, error: e.message, output };
  }
  console.error = originalError;
  return { success: true, output };
}

describe('Modifiers Tests', () => {
  test('Variável Suave silencia erro e retorna false (default)', () => {
    const t1 = runBna(`jeito suave x = variavel_inexistente; anuncia(x);`);
    expect(t1.output[0]).toBe("false");
  });

  test('Bloco Suave silencia erro e continua execução externa', () => {
    const t2 = runBna(`
      suave {
        anuncia("inicio");
        anuncia(erro_fatal);
        anuncia("fim");
      }
      anuncia("fora");
    `);
    expect(t2.output).toContain("inicio");
    expect(t2.output).toContain("fora");
    expect(t2.output).not.toContain("fim");
  });

  test('Bloco Firmeza falha normalmente quando ocorre erro', () => {
    const t3 = runBna(`firmeza { anuncia(erro_aqui); }`);
    expect(t3.success).toBe(false);
    expect(t3.error).toContain("sumiu no meio do rolê");
  });

  test('Bloco Nervoso demonstra comportamento probabilístico', () => {
    let sucessos = 0;
    for (let i = 0; i < 50; i++) {
      const t4 = runBna(`nervoso { anuncia("ok"); }`);
      if (t4.output.includes("ok")) sucessos++;
    }
    // chance de 5% de erro. Em 50 tentativas, esperamos alguns erros e alguns sucessos.
    expect(sucessos).toBeLessThan(50);
    expect(sucessos).toBeGreaterThan(0);
  });
});
