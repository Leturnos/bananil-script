class Node {}

// Statements (Comandos)
class Stmt extends Node {}

class VarDeclaration extends Stmt {
  constructor(name, initializer, modifier = null) {
    super();
    this.name = name;
    this.initializer = initializer;
    this.modifier = modifier;
  }
}

class ModifierBlock extends Stmt {
  constructor(modifier, body) {
    super();
    this.modifier = modifier;
    this.body = body;
  }
}

class ExpressionStatement extends Stmt {
  constructor(expression) {
    super();
    this.expression = expression;
  }
}

class Block extends Stmt {
  constructor(statements) {
    super();
    this.statements = statements;
  }
}

class If extends Stmt {
  constructor(condition, thenBranch, elseBranch) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
}

class While extends Stmt {
  constructor(condition, body) {
    super();
    this.condition = condition;
    this.body = body;
  }
}

class FunctionDeclaration extends Stmt {
  constructor(name, params, body) {
    super();
    this.name = name;
    this.params = params;
    this.body = body;
  }
}

class ReturnStatement extends Stmt {
  constructor(keyword, value) {
    super();
    this.keyword = keyword;
    this.value = value;
  }
}

class TryCatchStatement extends Stmt {
  constructor(tryBranch, catchBranch) {
    super();
    this.tryBranch = tryBranch;
    this.catchBranch = catchBranch;
  }
}

// Expressions (Valores)
class Expr extends Node {}

class Assign extends Expr {
  constructor(name, value) {
    super();
    this.name = name;
    this.value = value;
  }
}

class Binary extends Expr {
  constructor(left, operator, right) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

class Literal extends Expr {
  constructor(value) {
    super();
    this.value = value;
  }
}

class Variable extends Expr {
  constructor(name) {
    super();
    this.name = name;
  }
}

class Call extends Expr {
  constructor(callee, args) {
    super();
    this.callee = callee;
    this.args = args;
  }
}

module.exports = {
  VarDeclaration,
  ExpressionStatement,
  Block,
  If,
  While,
  FunctionDeclaration,
  ReturnStatement,
  TryCatchStatement,
  ModifierBlock,
  Binary,
  Literal,
  Variable,
  Call,
  Assign
};
