const COLOR = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  white: '\x1b[37m'
};

class ParseError extends Error {
  constructor(message, token, source, suggestion = null) {
    const line = token?.line ?? '?';
    const column = token?.column ?? '?';

    let output = `${COLOR.red}${message}${COLOR.reset}\n`;

    if (suggestion) {
      output += `${COLOR.yellow}${suggestion}${COLOR.reset}\n`;
    }

    if (source && token?.line != null) {
      const lines = source.split('\n');
      const srcLine = lines[token.line - 1] || '';

      output += `${COLOR.white}  at line ${line}, column ${column}\n`;
      const caretPos =
  typeof column === 'number' && column > 0
    ? column - 1
    : 0;

output += `    ${srcLine}\n`;
output += `    ${' '.repeat(caretPos)}^\n${COLOR.reset}`;

    } else {
      output += `${COLOR.white}  at line ${line}, column ${column}\n${COLOR.reset}`;
    }

    super(output);
    this.name = 'SyntaxError';
  }
}

class Parser {
  constructor(tokens, source = '') {
  this.tokens = tokens;
  this.source = source;
  this.pos = 0;
  this.current = this.tokens[this.pos];
}


  advance() {
    this.pos++;
    this.current = this.pos < this.tokens.length ? this.tokens[this.pos] : { type: 'EOF' };
  }

 eat(type) {
  if (this.current.type === type) {
    this.advance();
  } else {
    throw new ParseError(
      `Expected '${type}' but got '${this.current.type}'`,
      this.current,
      this.source
    );
  }
}


  peekType(offset = 1) {
    return (this.tokens[this.pos + offset] || { type: 'EOF' }).type;
  }

  parse() {
    const body = [];
    while (this.current.type !== 'EOF') {
      body.push(this.statement());
    }
    return { type: 'Program', body };
  }

  statement() {
    if (this.current.type === 'ASYNC' && this.peekType() === 'FUNC') {
    this.eat('ASYNC');
    this.eat('FUNC');
    return this.asyncFuncDeclaration();
  }
    switch (this.current.type) {
      case 'LET': return this.varDeclaration();
      case 'SLDEPLOY': return this.sldeployStatement();
      case 'DEFINE': return this.defineStatement();
      case 'IF': return this.ifStatement();
      case 'WHILE': return this.whileStatement();
      case 'FOR': return this.forStatement();
      case 'DO': return this.doTrackStatement();
      case 'START': return this.startStatement();
      case 'BREAK': return this.breakStatement();
      case 'CONTINUE': return this.continueStatement();
      case 'FUNC': return this.funcDeclaration();
      case 'RETURN': return this.returnStatement();
      case 'IMPORT': return this.importStatement();
      case 'LBRACE': return this.block();
      default:
        return this.expressionStatement();
    }
  }
varDeclaration() {
  const t = this.current; 
  this.eat('LET');

  if (this.current.type !== 'IDENTIFIER') {
    throw new ParseError(
      "Expected variable name after 'let'",
      this.current,
      this.source,
      "Variable declarations must be followed by an identifier, e.g. let x = 5"
    );
  }

  const idToken = this.current; 
  const id = idToken.value;
  this.eat('IDENTIFIER');

  let expr = null;

  if (this.current.type === 'EQEQ') {
    throw new ParseError(
      "Invalid '==' in variable declaration",
      this.current,
      this.source,
      "Did you mean '=' for assignment?"
    );
  }

  if (this.current.type === 'EQUAL') {
    this.eat('EQUAL');

    if (this.current.type === 'SEMICOLON') {
      throw new ParseError(
        "Expected expression after '='",
        this.current,
        this.source,
        "Assignments require a value, e.g. let x = 10"
      );
    }

    expr = this.expression();
  }

  if (this.current.type === 'SEMICOLON') {
    this.eat('SEMICOLON');
  }

  return { 
    type: 'VarDeclaration', 
    id, 
    expr, 
    line: t.line, 
    column: t.column 
  };
}

startStatement() {
  const t = this.current; 
  this.eat('START');

  if (this.current.type === 'LBRACE') {
    throw new ParseError(
      "Expected expression after 'start'",
      this.current,
      this.source,
      "The 'start' statement requires a discriminant expression"
    );
  }

  const discriminant = this.expression();

  if (this.current.type !== 'LBRACE') {
    throw new ParseError(
      "Expected '{' to start start-block",
      this.current,
      this.source,
      "Start blocks must be enclosed in braces"
    );
  }

  this.eat('LBRACE');

  const cases = [];

  while (this.current.type === 'RACE') {
    cases.push(this.raceClause());
  }

  if (cases.length === 0) {
    throw new ParseError(
      "Start statement must contain at least one 'race' clause",
      this.current,
      this.source,
      "Use 'race <condition> { ... }' inside start blocks"
    );
  }

  if (this.current.type !== 'RBRACE') {
    throw new ParseError(
      "Expected '}' to close start block",
      this.current,
      this.source,
      "Did you forget to close the start block?"
    );
  }

  this.eat('RBRACE');

  return {
    type: 'StartStatement',
    discriminant,
    cases,
    line: t.line,
    column: t.column
  };
}
raceClause() {
  const t = this.current; 
  this.eat('RACE');

  if (this.current.type === 'LBRACE') {
    throw new ParseError(
      "Expected condition after 'race'",
      this.current,
      this.source,
      "Race clauses require a condition before the block"
    );
  }

  const test = this.expression();

  if (this.current.type !== 'LBRACE') {
    throw new ParseError(
      "Expected '{' after race condition",
      this.current,
      this.source,
      "Race clauses must use a block: race condition { ... }"
    );
  }

  const consequent = this.block();

  return {
    type: 'RaceClause',
    test,
    consequent,
    line: t.line,
    column: t.column
  };
}


sldeployStatement() {
  const t = this.current; 
  this.eat('SLDEPLOY');

  if (this.current.type === 'SEMICOLON') {
    throw new ParseError(
      "Expected expression after 'sldeploy'",
      this.current,
      this.source,
      "sldeploy requires a value or expression to deploy"
    );
  }

  const expr = this.expression();

  if (this.current.type === 'SEMICOLON') {
    this.eat('SEMICOLON');
  }

  return { 
    type: 'SldeployStatement', 
    expr, 
    line: t.line, 
    column: t.column 
  };
}

doTrackStatement() {
  const t = this.current;
  this.eat('DO');

  if (this.current.type !== 'LBRACE') {
    throw new ParseError(
      "Expected '{' after 'do'",
      this.current,
      this.source,
      "The 'do' statement must be followed by a block"
    );
  }

  const body = this.block();

  let handler = null;

  if (this.current.type === 'TRACK') {
    this.eat('TRACK');

    if (this.current.type !== 'LBRACE') {
      throw new ParseError(
        "Expected '{' after 'track'",
        this.current,
        this.source,
        "Track handlers must be blocks"
      );
    }

    handler = this.block();
  }

  return {
    type: 'DoTrackStatement',
    body,
    handler,
    line: t.line,
    column: t.column
  };
}

defineStatement() {
  const t = this.current; 
  this.eat('DEFINE');

  if (this.current.type !== 'IDENTIFIER') {
    throw new ParseError(
      "Expected identifier after 'define'",
      this.current,
      this.source,
      "Definitions must be followed by a name, e.g. define PI = 3.14"
    );
  }

  const idToken = this.current; 
  const id = idToken.value;
  this.eat('IDENTIFIER');

  let expr = null;

  if (this.current.type === 'EQEQ') {
    throw new ParseError(
      "Invalid '==' in define statement",
      this.current,
      this.source,
      "Did you mean '=' to assign a value?"
    );
  }

  if (this.current.type === 'EQUAL') {
    this.eat('EQUAL');

    if (this.current.type === 'SEMICOLON') {
      throw new ParseError(
        "Expected expression after '='",
        this.current,
        this.source,
        "Definitions require a value, e.g. define X = 10"
      );
    }

    expr = this.expression();
  }

  if (this.current.type === 'SEMICOLON') {
    this.eat('SEMICOLON');
  }

  return { 
    type: 'DefineStatement', 
    id, 
    expr, 
    line: t.line, 
    column: t.column 
  };
}

asyncFuncDeclaration() {
  const t = this.current;

  if (this.current.type !== 'IDENTIFIER') {
    throw new ParseError(
      "Expected function name after 'async func'",
      this.current,
      this.source,
      "Async functions must have a name"
    );
  }

  const name = this.current.value;
  this.eat('IDENTIFIER');

  let params = [];

  if (this.current.type === 'LPAREN') {
    this.eat('LPAREN');

    if (this.current.type !== 'RPAREN') {
      if (this.current.type !== 'IDENTIFIER') {
        throw new ParseError(
          "Expected parameter name",
          this.current,
          this.source,
          "Function parameters must be identifiers"
        );
      }

      params.push(this.current.value);
      this.eat('IDENTIFIER');

      while (this.current.type === 'COMMA') {
        this.eat('COMMA');

        if (this.current.type !== 'IDENTIFIER') {
          throw new ParseError(
            "Expected parameter name after ','",
            this.current,
            this.source,
            "Separate parameters with commas"
          );
        }

        params.push(this.current.value);
        this.eat('IDENTIFIER');
      }
    }

    if (this.current.type !== 'RPAREN') {
      throw new ParseError(
        "Expected ')' after function parameters",
        this.current,
        this.source,
        "Did you forget to close the parameter list?"
      );
    }

    this.eat('RPAREN');
  } else if (this.current.type === 'IDENTIFIER') {
    params.push(this.current.value);
    this.eat('IDENTIFIER');
  }

  if (this.current.type !== 'LBRACE') {
    throw new ParseError(
      "Expected '{' to start function body",
      this.current,
      this.source,
      "Function declarations require a block body"
    );
  }

  const body = this.block();

  return { 
    type: 'FunctionDeclaration', 
    name, 
    params, 
    body, 
    async: true,
    line: t.line,
    column: t.column
  };
}
ifStatement() {
  const t = this.current;
  this.eat('IF');

  let test;

  if (this.current.type === 'LPAREN') {
    this.eat('LPAREN');

    if (this.current.type === 'RPAREN') {
      throw new ParseError(
        "Missing condition in if statement",
        this.current,
        this.source,
        "If statements require a condition"
      );
    }

    test = this.expression();

    if (this.current.type !== 'RPAREN') {
      throw new ParseError(
        "Expected ')' after if condition",
        this.current,
        this.source,
        "Did you forget to close the condition?"
      );
    }

    this.eat('RPAREN');
  } else {
    test = this.expression();
  }

  if (this.current.type === 'EQUAL') {
    throw new ParseError(
      "Invalid assignment in if condition",
      this.current,
      this.source,
      "Did you mean '==' for comparison?"
    );
  }

  const consequent = this.statementOrBlock();

  let alternate = null;

  if (this.current.type === 'ELSE') {
    this.eat('ELSE');

    if (this.current.type === 'IF') {
      alternate = this.ifStatement();
    } else {
      alternate = this.statementOrBlock();
    }
  }

  return { 
    type: 'IfStatement', 
    test, 
    consequent, 
    alternate, 
    line: t.line, 
    column: t.column 
  };
}

parseExpressionOnly() {
  return this.expression();
}

whileStatement() {
  const t = this.current; 
  this.eat('WHILE');

  let test;

  if (this.current.type === 'LPAREN') {
    this.eat('LPAREN');

    if (this.current.type === 'RPAREN') {
      throw new ParseError(
        "Missing condition in while statement",
        this.current,
        this.source,
        "While loops require a condition"
      );
    }

    test = this.expression();

    if (this.current.type !== 'RPAREN') {
      throw new ParseError(
        "Expected ')' after while condition",
        this.current,
        this.source,
        "Did you forget to close the condition?"
      );
    }

    this.eat('RPAREN');
  } 
  else {
    const exprTokens = [];
    let braceFound = false;
    let depth = 0;

    while (this.current.type !== 'EOF') {
      if (this.current.type === 'LBRACE' && depth === 0) {
        braceFound = true;
        break;
      }
      if (this.current.type === 'LPAREN') depth++;
      if (this.current.type === 'RPAREN') depth--;
      exprTokens.push(this.current);
      this.advance();
    }

    if (!braceFound) {
      throw new ParseError(
        "Expected '{' after while condition",
        this.current,
        this.source,
        "While loops must be followed by a block"
      );
    }

    const Parser = require('./parser'); 
    const exprParser = new Parser(exprTokens, this.source);
    test = exprParser.parseExpressionOnly(); 
  }

  if (this.current.type !== 'LBRACE') {
    throw new ParseError(
      "Expected '{' to start while loop body",
      this.current,
      this.source,
      "While loop bodies must be enclosed in braces"
    );
  }

  const body = this.block();

  return { 
    type: 'WhileStatement', 
    test, 
    body, 
    line: t.line, 
    column: t.column 
  };
}

importStatement() {
  const t = this.current; 
  this.eat('IMPORT');

  let specifiers = [];

  if (this.current.type === 'STAR') {
    this.eat('STAR');

    if (this.current.type !== 'AS') {
      throw new ParseError(
        "Expected 'as' after '*' in import",
        this.current,
        this.source,
        "Namespace imports require 'as', e.g. import * as name from 'mod'"
      );
    }

    this.eat('AS');

    if (this.current.type !== 'IDENTIFIER') {
      throw new ParseError(
        "Expected identifier after 'as'",
        this.current,
        this.source,
        "The namespace must have a local name"
      );
    }

    const name = this.current.value;
    this.eat('IDENTIFIER');

    specifiers.push({
      type: 'NamespaceImport',
      local: name,
      line: t.line,
      column: t.column
    });

  } else if (this.current.type === 'LBRACE') {
    this.eat('LBRACE');

    if (this.current.type === 'RBRACE') {
      throw new ParseError(
        "Empty import specifier list",
        this.current,
        this.source,
        "Specify at least one name inside '{ }'"
      );
    }

    while (this.current.type !== 'RBRACE') {
      if (this.current.type !== 'IDENTIFIER') {
        throw new ParseError(
          "Expected identifier in import specifier",
          this.current,
          this.source,
          "Import names must be identifiers"
        );
      }

      const importedName = this.current.value;
      const importedLine = this.current.line;
      const importedColumn = this.current.column;
      this.eat('IDENTIFIER');

      let localName = importedName;
      if (this.current.type === 'AS') {
        this.eat('AS');

        if (this.current.type !== 'IDENTIFIER') {
          throw new ParseError(
            "Expected identifier after 'as'",
            this.current,
            this.source,
            "Aliases must be valid identifiers"
          );
        }

        localName = this.current.value;
        this.eat('IDENTIFIER');
      }

      specifiers.push({
        type: 'NamedImport',
        imported: importedName,
        local: localName,
        line: importedLine,
        column: importedColumn
      });

      if (this.current.type === 'COMMA') this.eat('COMMA');
    }

    this.eat('RBRACE');

  } else if (this.current.type === 'IDENTIFIER') {
    const localName = this.current.value;
    const localLine = this.current.line;
    const localColumn = this.current.column;
    this.eat('IDENTIFIER');

    specifiers.push({
      type: 'DefaultImport',
      local: localName,
      line: localLine,
      column: localColumn
    });

  } else {
    throw new ParseError(
      "Invalid import syntax",
      this.current,
      this.source,
      "Use import name, import { a }, or import * as name"
    );
  }

  if (this.current.type !== 'FROM') {
    throw new ParseError(
      "Expected 'from' in import statement",
      this.current,
      this.source,
      "Imports must specify a source module"
    );
  }

  this.eat('FROM');

  const pathToken = this.current;

  if (pathToken.type !== 'STRING') {
    throw new ParseError(
      "Expected string after 'from'",
      pathToken,
      this.source,
      "Module paths must be strings"
    );
  }

  this.eat('STRING');

  if (this.current.type === 'SEMICOLON') this.eat('SEMICOLON');

  return { 
    type: 'ImportStatement', 
    path: pathToken.value, 
    specifiers, 
    line: t.line, 
    column: t.column 
  };
}
forStatement() {
  const t = this.current;
  this.eat('FOR');

  if (
    (this.current.type === 'LET' && this.peekType() === 'IDENTIFIER' && this.peekType(2) === 'IN') ||
    (this.current.type === 'IDENTIFIER' && this.peekType() === 'IN')
  ) {
    let variable;
    let variableLine, variableColumn;
    let iterable;
    let letKeyword = false;

    if (this.current.type === 'LET') {
      letKeyword = true;
      this.eat('LET');
    }

    if (this.current.type !== 'IDENTIFIER') {
      throw new ParseError(
        "Expected identifier in for-in loop",
        this.current,
        this.source,
        "for-in loops require a loop variable"
      );
    }

    variableLine = this.current.line;
    variableColumn = this.current.column;
    variable = this.current.value;
    this.eat('IDENTIFIER');

    if (this.current.type !== 'IN') {
      throw new ParseError(
        "Expected 'in' in for-in loop",
        this.current,
        this.source,
        "Use: for item in iterable { ... }"
      );
    }

    this.eat('IN');
    iterable = this.expression();

    if (this.current.type !== 'LBRACE') {
      throw new ParseError(
        "Expected '{' after for-in iterable",
        this.current,
        this.source,
        "For-in loops require a block body"
      );
    }

    const body = this.block();

    return { 
      type: 'ForInStatement', 
      variable, 
      variableLine, 
      variableColumn,
      iterable, 
      letKeyword, 
      body,
      line: t.line,
      column: t.column
    };
  }

  let init = null;
  let test = null;
  let update = null;

  if (this.current.type === 'LPAREN') {
    this.eat('LPAREN');

    if (this.current.type !== 'SEMICOLON') {
      init = this.current.type === 'LET'
        ? this.varDeclaration()
        : this.expressionStatement();
    } else {
      this.eat('SEMICOLON');
    }

    if (this.current.type !== 'SEMICOLON') {
      test = this.expression();
    }

    this.eat('SEMICOLON');

    if (this.current.type !== 'RPAREN') {
      update = this.expression();
    }

    if (this.current.type !== 'RPAREN') {
      throw new ParseError(
        "Expected ')' after for loop clauses",
        this.current,
        this.source,
        "Did you forget to close the for loop header?"
      );
    }

    this.eat('RPAREN');
  } else {
    throw new ParseError(
      "Expected '(' after 'for'",
      this.current,
      this.source,
      "Classic for loops require parentheses"
    );
  }

  if (this.current.type !== 'LBRACE') {
    throw new ParseError(
      "Expected '{' to start for loop body",
      this.current,
      this.source,
      "For loops require a block body"
    );
  }

  const body = this.block();

  return { 
    type: 'ForStatement', 
    init, 
    test, 
    update, 
    body,
    line: t.line,
    column: t.column
  };
}

breakStatement() {
  const t = this.current; // BREAK token
  this.eat('BREAK');
  if (this.current.type === 'SEMICOLON') this.advance();
  return { type: 'BreakStatement', line: t.line, column: t.column };
}

continueStatement() {
  const t = this.current; 
  this.eat('CONTINUE');
  if (this.current.type === 'SEMICOLON') this.advance();
  return { type: 'ContinueStatement', line: t.line, column: t.column };
}
funcDeclaration() {
  const t = this.current; 
  this.eat('FUNC');

  if (this.current.type !== 'IDENTIFIER') {
    throw new ParseError(
      "Expected function name after 'func'",
      this.current,
      this.source,
      "Functions must have a name, e.g. func add(a, b) { ... }"
    );
  }

  const nameToken = this.current;
  const name = nameToken.value;
  this.eat('IDENTIFIER');

  let params = [];

  if (this.current.type === 'LPAREN') {
    this.eat('LPAREN');

    if (this.current.type !== 'RPAREN') {
      if (this.current.type !== 'IDENTIFIER') {
        throw new ParseError(
          "Expected parameter name",
          this.current,
          this.source,
          "Function parameters must be identifiers"
        );
      }

      let paramToken = this.current;
      params.push({
        name: paramToken.value,
        line: paramToken.line,
        column: paramToken.column
      });
      this.eat('IDENTIFIER');

      while (this.current.type === 'COMMA') {
        this.eat('COMMA');

        if (this.current.type !== 'IDENTIFIER') {
          throw new ParseError(
            "Expected parameter name after ','",
            this.current,
            this.source,
            "Each parameter must be an identifier"
          );
        }

        paramToken = this.current;
        params.push({
          name: paramToken.value,
          line: paramToken.line,
          column: paramToken.column
        });
        this.eat('IDENTIFIER');
      }
    }

    if (this.current.type !== 'RPAREN') {
      throw new ParseError(
        "Expected ')' after function parameters",
        this.current,
        this.source,
        "Did you forget to close the parameter list?"
      );
    }

    this.eat('RPAREN');
  } 
  else if (this.current.type === 'IDENTIFIER') {
    const paramToken = this.current;
    params.push({
      name: paramToken.value,
      line: paramToken.line,
      column: paramToken.column
    });
    this.eat('IDENTIFIER');
  }

  if (this.current.type !== 'LBRACE') {
    throw new ParseError(
      "Expected '{' to start function body",
      this.current,
      this.source,
      "Functions must have a block body"
    );
  }

  const body = this.block();

  return {
    type: 'FunctionDeclaration',
    name,
    params,
    body,
    line: t.line,
    column: t.column
  };
}


returnStatement() {
  const t = this.current; // RETURN token
  this.eat('RETURN');

  let argument = null;
  if (this.current.type !== 'SEMICOLON') {
    argument = this.expression();
  }

  if (this.current.type === 'SEMICOLON') this.eat('SEMICOLON');

  return { type: 'ReturnStatement', argument, line: t.line, column: t.column };
}
statementOrBlock() {
  if (this.current.type === 'LBRACE') {
    return this.block();
  }
  return this.statement();
}
block() {
  const t = this.current; // LBRACE token
  this.eat('LBRACE');

  const body = [];

  while (this.current.type !== 'RBRACE') {
    if (this.current.type === 'EOF') {
      throw new ParseError(
        "Unterminated block",
        this.current,
        this.source,
        "Did you forget to close the block with '}'?"
      );
    }
    body.push(this.statement());
  }

  this.eat('RBRACE');

  return {
    type: 'BlockStatement',
    body,
    line: t.line,
    column: t.column
  };
}


expressionStatement() {
  const exprToken = this.current;
  const expr = this.expression();
  if (this.current.type === 'SEMICOLON') this.eat('SEMICOLON');
  return { type: 'ExpressionStatement', expression: expr, line: exprToken.line, column: exprToken.column };
}

expression() {
  return this.assignment();
}
assignment() {
  const node = this.ternary();
  const compoundOps = ['PLUSEQ', 'MINUSEQ', 'STAREQ', 'SLASHEQ', 'MODEQ'];

  const t = this.current;

  if (compoundOps.includes(t.type)) {
    const op = t.type;
    this.eat(op);
    const right = this.assignment();

    return {
      type: 'CompoundAssignment',
      operator: op,
      left: node,
      right,
      line: t.line,
      column: t.column
    };
  }

  if (t.type === 'EQEQ') {
    throw new ParseError(
      "Unexpected '==' in assignment",
      t,
      this.source,
      "Did you mean '=' to assign a value?"
    );
  }

  if (t.type === 'EQUAL') {
    this.eat('EQUAL');
    const right = this.assignment();

    return {
      type: 'AssignmentExpression',
      left: node,
      right,
      line: t.line,
      column: t.column
    };
  }

  return node;
}

ternary() {
  let node = this.nullishCoalescing();

  while (this.current.type === 'QUESTION') {
    const t = this.current;
    this.eat('QUESTION');

    const consequent = this.expression();

    if (this.current.type !== 'COLON') {
      throw new ParseError(
        "Expected ':' in conditional expression",
        this.current,
        this.source,
        "Ternary expressions must follow the form: condition ? a : b"
      );
    }

    this.eat('COLON');
    const alternate = this.expression();

    node = {
      type: 'ConditionalExpression',
      test: node,
      consequent,
      alternate,
      line: t.line,
      column: t.column
    };
  }

  return node;
}

nullishCoalescing() {
  let node = this.logicalOr(); 
  while (this.current.type === 'NULLISH_COALESCING') {
    const t = this.current;
    this.eat('NULLISH_COALESCING');
    node = { type: 'LogicalExpression', operator: '??', left: node, right: this.logicalOr(), line: t.line, column: t.column };
  }
  return node;
}
logicalOr() {
  let node = this.logicalAnd();
  while (this.current.type === 'OR') {
    const t = this.current;
    const op = t.type;
    this.eat(op);
    node = { type: 'LogicalExpression', operator: op, left: node, right: this.logicalAnd(), line: t.line, column: t.column };
  }
  return node;
}

logicalAnd() {
  let node = this.equality();
  while (this.current.type === 'AND') {
    const t = this.current;
    const op = t.type;
    this.eat(op);
    node = { type: 'LogicalExpression', operator: op, left: node, right: this.equality(), line: t.line, column: t.column };
  }
  return node;
}

equality() {
  let node = this.comparison();
  while (['EQEQ', 'NOTEQ'].includes(this.current.type)) {
    const t = this.current;
    const op = t.type;
    this.eat(op);
    node = { type: 'BinaryExpression', operator: op, left: node, right: this.comparison(), line: t.line, column: t.column };
  }
  return node;
}

comparison() {
  let node = this.term();
  while (['LT', 'LTE', 'GT', 'GTE'].includes(this.current.type)) {
    const t = this.current;
    const op = t.type;
    this.eat(op);
    node = { type: 'BinaryExpression', operator: op, left: node, right: this.term(), line: t.line, column: t.column };
  }
  return node;
}

term() {
  let node = this.factor();
  while (['PLUS', 'MINUS'].includes(this.current.type)) {
    const t = this.current;
    const op = t.type;
    this.eat(op);
    node = { type: 'BinaryExpression', operator: op, left: node, right: this.factor(), line: t.line, column: t.column };
  }
  return node;
}

factor() {
  let node = this.unary();
  while (['STAR', 'SLASH', 'MOD'].includes(this.current.type)) {
    const t = this.current;
    const op = t.type;
    this.eat(op);
    node = { type: 'BinaryExpression', operator: op, left: node, right: this.unary(), line: t.line, column: t.column };
  }
  return node;
}


unary() {
  const t = this.current;

  if (['NOT', 'MINUS', 'PLUS'].includes(t.type)) {
    const op = t.type;
    this.eat(op);

    if (this.current.type === 'EOF') {
      throw new ParseError(
        "Missing operand for unary operator",
        this.current,
        this.source,
        "Unary operators must be followed by an expression"
      );
    }

    return {
      type: 'UnaryExpression',
      operator: op,
      argument: this.unary(),
      line: t.line,
      column: t.column
    };
  }

  if (t.type === 'PLUSPLUS' || t.type === 'MINUSMINUS') {
    const op = t.type;
    this.eat(op);

    const argument = this.unary();

    if (!argument || !argument.type) {
      throw new ParseError(
        "Invalid operand for update operator",
        t,
        this.source,
        "Increment and decrement operators must apply to a variable"
      );
    }

    return {
      type: 'UpdateExpression',
      operator: op,
      argument,
      prefix: true,
      line: t.line,
      column: t.column
    };
  }

  return this.postfix();
}

postfix() {
  let node = this.primary();

  while (true) {
    const t = this.current;

    // Handle indexing / slicing
    if (t.type === 'LBRACKET') {
      const startLine = t.line;
      const startCol = t.column;
      this.eat('LBRACKET');

      let start = null;
      let end = null;
      let step = null;

      // Slice: [:end:step] or [start:end:step]
      if (this.current.type === 'COLON') {
        this.eat('COLON');
        if (this.current.type !== 'RBRACKET' && this.current.type !== 'COLON') {
          end = this.expression();
        }
        if (this.current.type === 'COLON') {
          this.eat('COLON');
          if (this.current.type !== 'RBRACKET') {
            step = this.expression();
          }
        }
        if (this.current.type !== 'RBRACKET') {
          throw new ParseError("Expected ']' after slice", this.current, this.source);
        }
        this.eat('RBRACKET');

        node = { type: 'SliceExpression', object: node, start, end, step, line: startLine, column: startCol };
      } else {
        // Normal index or slice starting with an expression
        start = this.expression();
        if (this.current.type === 'COLON') {
          this.eat('COLON');
          if (this.current.type !== 'RBRACKET' && this.current.type !== 'COLON') {
            end = this.expression();
          }
          if (this.current.type === 'COLON') {
            this.eat('COLON');
            if (this.current.type !== 'RBRACKET') {
              step = this.expression();
            }
          }
          if (this.current.type !== 'RBRACKET') {
            throw new ParseError("Expected ']' after slice", this.current, this.source);
          }
          this.eat('RBRACKET');

          node = { type: 'SliceExpression', object: node, start, end, step, line: startLine, column: startCol };
        } else {
          this.eat('RBRACKET');
          node = { type: 'IndexExpression', object: node, indexer: start, line: startLine, column: startCol };
        }
      }
      continue; // continue to allow . or () after []
    }

    // Handle function call
    if (t.type === 'LPAREN') {
      const startLine = t.line;
      const startCol = t.column;
      this.eat('LPAREN');

      const args = [];
      while (this.current.type !== 'RPAREN') {
        if (this.current.type === 'EOF') {
          throw new ParseError("Unterminated function call", this.current, this.source, "Did you forget to close ')'?");
        }
        args.push(this.expression());
        if (this.current.type === 'COMMA') this.eat('COMMA');
      }

      this.eat('RPAREN');

      node = { type: 'CallExpression', callee: node, arguments: args, line: startLine, column: startCol };
      continue;
    }

    // Handle member access
    if (t.type === 'DOT') {
      const startLine = t.line;
      const startCol = t.column;
      this.eat('DOT');

      if (this.current.type !== 'IDENTIFIER') {
        throw new ParseError("Expected property name after '.'", this.current, this.source, "Member access requires a property name, e.g. obj.value");
      }

      const property = this.current.value;
      this.eat('IDENTIFIER');

      node = { type: 'MemberExpression', object: node, property, line: startLine, column: startCol };
      continue;
    }

    // Handle postfix update operators
    if (t.type === 'PLUSPLUS' || t.type === 'MINUSMINUS') {
      this.eat(t.type);
      node = { type: 'UpdateExpression', operator: t.type, argument: node, prefix: false, line: t.line, column: t.column };
      continue;
    }

    break;
  }

  return node;
}


arrowFunction(params) {
  const t = this.current;
  this.eat('ARROW');

  let body;
  let isBlock = false;

  if (this.current.type === 'LBRACE') {
    body = this.block();
    isBlock = true;
  } 
  else if (this.current.type === 'EOF') {
    throw new ParseError(
      "Missing arrow function body",
      this.current,
      this.source,
      "Arrow functions require a body, e.g. x => x * 2"
    );
  } 
  else {
    body = this.expression();
  }

  const startLine = params.length > 0 ? params[0].line : t.line;
  const startCol  = params.length > 0 ? params[0].column : t.column;

  return {
    type: 'ArrowFunctionExpression',
    params,
    body,
    isBlock,
    line: startLine,
    column: startCol
  };
}


primary() {
  const t = this.current;

  if (t.type === 'NUMBER') {
    this.eat('NUMBER');
    return { type: 'Literal', value: t.value, line: t.line, column: t.column };
  }

  if (t.type === 'STRING') {
    this.eat('STRING');
    return { type: 'Literal', value: t.value, line: t.line, column: t.column };
  }

  if (t.type === 'TRUE') {
    this.eat('TRUE');
    return { type: 'Literal', value: true, line: t.line, column: t.column };
  }

  if (t.type === 'FALSE') {
    this.eat('FALSE');
    return { type: 'Literal', value: false, line: t.line, column: t.column };
  }

  if (t.type === 'NULL') {
    this.eat('NULL');
    return { type: 'Literal', value: null, line: t.line, column: t.column };
  }

  if (t.type === 'AWAIT') {
    this.eat('AWAIT');
    const argument = this.expression();
    return { type: 'AwaitExpression', argument, line: t.line, column: t.column };
  }

  if (t.type === 'NEW') {
    this.eat('NEW');
    const callee = this.primary();

    if (this.current.type !== 'LPAREN') {
      throw new ParseError(
        "Expected '(' after 'new'",
        this.current,
        this.source,
        "Use 'new ClassName(...)'"
      );
    }

    this.eat('LPAREN');
    const args = [];
    if (this.current.type !== 'RPAREN') {
      args.push(this.expression());
      while (this.current.type === 'COMMA') {
        this.eat('COMMA');
        if (this.current.type === 'RPAREN') break;
        args.push(this.expression());
      }
    }

    if (this.current.type !== 'RPAREN') {
      throw new ParseError(
        "Expected ')' to close arguments for 'new'",
        this.current,
        this.source
      );
    }

    this.eat('RPAREN');

    return { type: 'NewExpression', callee, arguments: args, line: t.line, column: t.column };
  }

  if (t.type === 'ASK') {
    this.eat('ASK');

    if (this.current.type !== 'LPAREN') {
      throw new ParseError(
        "Expected '(' after 'ask'",
        this.current,
        this.source
      );
    }

    this.eat('LPAREN');
    const args = [];
    if (this.current.type !== 'RPAREN') {
      args.push(this.expression());
      while (this.current.type === 'COMMA') {
        this.eat('COMMA');
        if (this.current.type === 'RPAREN') break;
        args.push(this.expression());
      }
    }

    if (this.current.type !== 'RPAREN') {
      throw new ParseError(
        "Expected ')' after arguments to 'ask'",
        this.current,
        this.source
      );
    }

    this.eat('RPAREN');

    return {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'ask', line: t.line, column: t.column },
      arguments: args,
      line: t.line,
      column: t.column
    };
  }
if (t.type === 'FUNC') {
    const funcToken = t;
    this.eat('FUNC');

    let params = [];
    if (this.current.type === 'LPAREN') {
      this.eat('LPAREN');

      if (this.current.type !== 'RPAREN') {
        if (this.current.type !== 'IDENTIFIER') {
          throw new ParseError(
            "Expected parameter name",
            this.current,
            this.source
          );
        }

        params.push(this.current.value);
        this.eat('IDENTIFIER');

        while (this.current.type === 'COMMA') {
          this.eat('COMMA');
          if (this.current.type !== 'IDENTIFIER') {
            throw new ParseError(
              "Expected parameter name",
              this.current,
              this.source
            );
          }
          params.push(this.current.value);
          this.eat('IDENTIFIER');
        }
      }

      if (this.current.type !== 'RPAREN') {
        throw new ParseError(
          "Expected ')' after function parameters",
          this.current,
          this.source
        );
      }

      this.eat('RPAREN');
    }

    if (this.current.type !== 'LBRACE') {
      throw new ParseError(
        "Expected '{' to start function body",
        this.current,
        this.source
      );
    }

    const body = this.block();

    return {
      type: 'FunctionExpression',
      params,
      body,
      line: funcToken.line,
      column: funcToken.column
    };
  }

  if (t.type === 'IDENTIFIER') {
    const name = t.value;
    this.eat('IDENTIFIER');

    if (this.current.type === 'ARROW') {
      return this.arrowFunction([{ type: 'Identifier', name, line: t.line, column: t.column }]);
    }

    return { type: 'Identifier', name, line: t.line, column: t.column };
  }

  if (t.type === 'LPAREN') {
    const startLine = t.line;
    const startCol = t.column;
    this.eat('LPAREN');

    const elements = [];
    if (this.current.type !== 'RPAREN') {
      elements.push(this.expression());
      while (this.current.type === 'COMMA') {
        this.eat('COMMA');
        if (this.current.type === 'RPAREN') break;
        elements.push(this.expression());
      }
    }

    if (this.current.type !== 'RPAREN') {
      throw new ParseError(
        "Expected ')' after expression",
        this.current,
        this.source
      );
    }

    this.eat('RPAREN');

    if (this.current.type === 'ARROW') {
      return this.arrowFunction(elements);
    }

    return elements.length === 1
      ? elements[0]
      : { type: 'ArrayExpression', elements, line: startLine, column: startCol };
  }

  if (t.type === 'LBRACKET') {
    const startLine = t.line;
    const startCol = t.column;
    this.eat('LBRACKET');

    const elements = [];
    if (this.current.type !== 'RBRACKET') {
      elements.push(this.expression());
      while (this.current.type === 'COMMA') {
        this.eat('COMMA');
        if (this.current.type === 'RBRACKET') break;
        elements.push(this.expression());
      }
    }

    if (this.current.type !== 'RBRACKET') {
      throw new ParseError(
        "Expected ']' after array elements",
        this.current,
        this.source
      );
    }

    this.eat('RBRACKET');

    return { type: 'ArrayExpression', elements, line: startLine, column: startCol };
  }

  if (t.type === 'LBRACE') {
    const startLine = t.line;
    const startCol = t.column;
    this.eat('LBRACE');

    const props = [];

    while (this.current.type !== 'RBRACE') {
      if (this.current.type === 'EOF') {
        throw new ParseError(
          "Unterminated object literal",
          this.current,
          this.source,
          "Did you forget to close '}'?"
        );
      }

      let key;

      if (this.current.type === 'IDENTIFIER') {
        const k = this.current;
        this.eat('IDENTIFIER');
        key = { type: 'Literal', value: k.value, line: k.line, column: k.column };
      } 
      else if (this.current.type === 'STRING') {
        const k = this.current;
        this.eat('STRING');
        key = { type: 'Literal', value: k.value, line: k.line, column: k.column };
      } 
      else {
        throw new ParseError(
          'Invalid object key',
          this.current,
          this.source,
          "Object keys must be identifiers or strings"
        );
      }

      if (this.current.type !== 'COLON') {
        throw new ParseError(
          "Expected ':' after object key",
          this.current,
          this.source
        );
      }

      this.eat('COLON');
      const value = this.expression();
      props.push({ key, value });

      if (this.current.type === 'COMMA') this.eat('COMMA');
    }

    this.eat('RBRACE');
    return { type: 'ObjectExpression', props, line: startLine, column: startCol };
  }

  throw new ParseError(
    `Unexpected token '${t.type}'`,
    t,
    this.source
  );
} 

}
module.exports = Parser;
