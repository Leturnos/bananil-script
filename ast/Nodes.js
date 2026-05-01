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

// Expressions (Valores)
class Expr extends Node {}

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
  Binary,
  Literal,
  Variable,
  Call
};
