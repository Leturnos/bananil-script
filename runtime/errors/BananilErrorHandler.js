class BananilErrorHandler {
  static missingReference(name) {
    return new Error(`mano, o ${name} sumiu no meio do rolê\n\ntenta de novo aí na moral`);
  }

  static callStack(error, functionName, line) {
    // Evita duplicar a call stack se já tiver sido anexada
    if (error.message.includes('no corre:')) {
      return error;
    }
    error.message += `\n\nno corre: ${functionName} (linha ${line})`;
    return error;
  }

  static tooManyErrorsRootMode() {
    return new Error("mano, o modo raiz saiu do controle! Muitos erros seguidos.\n\nno corre: principal\n\ntenta de novo aí na moral");
  }

  static uninitializedCLT(line, name) {
    return new Error(`⚠️ Processo indeferido.\n\nToda variável CLT precisa iniciar registrada.\n\nLinha ${line}: ${name}`);
  }

  static infiniteLoop() {
    return new Error("mano, cansei de rodar isso aqui, deu loop infinito né?\n\nno corre: principal\n\ntenta de novo aí na moral");
  }

  static infiniteLoopCLT() {
    return new Error("⚠️ Banco de horas excedido.\n\nO loop foi encerrado preventivamente.");
  }

  static recursionLimitCLT() {
    return new Error("⚠️ Jornada excedida.\n\nRecursão ultrapassou o limite permitido pelo sindicato.");
  }

  static nervosoAttack() {
    return new Error("mano, deu um treco aqui... o nervoso atacou! 😤\n\nno corre: principal\n\ntenta de novo aí na moral");
  }

  static divisionByZero(line) {
    return new Error(`mano, tentou dividir por zero? aí não dá né...\n\nno corre: principal (linha ${line})\n\ntenta de novo aí na moral`);
  }

  static divisionByZeroCLT() {
    return new Error("⚠️ AVISO PRÉVIO\n\nTentativa de divisão por zero detectada.\n\nO setor financeiro recusou a operação.");
  }

  static notCallable() {
    return new Error("isso aqui não dá pra chamar não, patrão.");
  }

  static unknownNode() {
    return new Error("isso aqui deu ruim patrão, não sei o que é esse nó.");
  }
}

module.exports = BananilErrorHandler;
