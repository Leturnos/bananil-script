class Node {}

// Statements (Comandos)
class Stmt extends Node {}

class VarDeclaration extends Stmt {
  constructor(name, initializer) {
    super();
    this.name = name;
    this.initializer = initializer;
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
  Binary,
  Literal,
  Variable,
  Call,
  Assign
};
