const TokenType = {
  // Palavras-chave
  JEITO: 'JEITO',
  SE_PA: 'SE_PA',
  SENAO: 'SENAO',
  ENQUANTO_DER: 'ENQUANTO_DER',
  CORRE: 'CORRE',
  DEVOLVE: 'DEVOLVE',
  ANUNCIA: 'ANUNCIA',
  VAZEI: 'VAZEI',
  GAMBIARRA: 'GAMBIARRA',
  FE: 'FE',
  E_MERMO: 'E_MERMO',
  MENTIRA: 'MENTIRA',
  FIRMEZA: 'FIRMEZA',
  SUAVE: 'SUAVE',
  NERVOSO: 'NERVOSO',

  // Identificadores e Literais
  IDENTIFIER: 'IDENTIFIER',
  STRING: 'STRING',
  NUMBER: 'NUMBER',

  // Símbolos
  L_PAREN: '(',
  R_PAREN: ')',
  L_BRACE: '{',
  R_BRACE: '}',
  COMMA: ',',
  DOT: '.',
  PLUS: '+',
  MINUS: '-',
  STAR: '*',
  SLASH: '/',
  SEMICOLON: ';',

  // Operadores
  ASSIGN: '=',
  EQUALS: '==',
  NOT_EQUALS: '!=',
  LESS: '<',
  GREATER: '>',
  LESS_EQUALS: '<=',
  GREATER_EQUALS: '>=',

  // Controle
  EOF: 'EOF'
};

const Keywords = {
  'jeito': TokenType.JEITO,
  'se pá': TokenType.SE_PA,
  'senao': TokenType.SENAO,
  'enquanto der': TokenType.ENQUANTO_DER,
  'corre': TokenType.CORRE,
  'devolve': TokenType.DEVOLVE,
  'anuncia': TokenType.ANUNCIA,
  'vazei': TokenType.VAZEI,
  'gambiarra': TokenType.GAMBIARRA,
  'fé': TokenType.FE,
  'é_mermo': TokenType.E_MERMO,
  'mentira': TokenType.MENTIRA,
  'firmeza': TokenType.FIRMEZA,
  'suave': TokenType.SUAVE,
  'nervoso': TokenType.NERVOSO
};

module.exports = { TokenType, Keywords };
