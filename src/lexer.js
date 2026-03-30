class LexerError extends Error {
  constructor(message, line, column, source = '') {
    let output = `SyntaxError: ${message}\n`;
    output += `  at line ${line}, column ${column}\n`;

    if (source && line != null) {
      const lines = source.split('\n');
      const srcLine = lines[line - 1] || '';
      output += `    ${srcLine}\n`;
      output += `    ${' '.repeat(column - 1)}^\n`;
    }

    super(output);
    this.name = 'SyntaxError';
  }
}

class Lexer {
  constructor(input) {
  this.input = input;
  this.source = input;
  this.pos = 0;
  this.currentChar = input[0] || null;
  this.line = 1;
  this.column = 1;
  this.keywords = [
      'let', 'sldeploy', 'if', 'else', 'while', 'for',
      'break', 'continue', 'func', 'return',
      'true', 'false', 'null',
      'ask', 'define', 'import', 'from', 'as',
      'async', 'await', 'new', 'in', 'do', 'track', 'start', 'race', 'not', 'and', 'or'
    ];
}


  advance() {
    if (this.currentChar === '\n') {
      this.line++;
      this.column = 0;
    } else {
      this.column++;
    }
    this.pos++;
    this.currentChar = this.pos < this.input.length ? this.input[this.pos] : null;
  }

  peek() {
    return this.pos + 1 < this.input.length ? this.input[this.pos + 1] : null;
  }

  error(msg) {
  throw new LexerError(
    msg,
    this.line,
    this.column,
    this.source
  );
}


  skipWhitespace() {
    while (this.currentChar && /\s/.test(this.currentChar)) this.advance();
  }

  skipComment() {
    if (this.currentChar === '#') {
      if (this.peek() === '*') {
        this.advance(); this.advance(); // skip #*
        while (this.currentChar !== null) {
          if (this.currentChar === '*' && this.peek() === '#') {
            this.advance(); this.advance();
            return;
          }
          this.advance();
        }
        this.error("Unterminated multi-line comment (#* ... *#)");
      } else {
        while (this.currentChar && this.currentChar !== '\n') this.advance();
      }
    }
  }

  number() {
    const startLine = this.line;
    const startCol = this.column;
    let result = '';
    while (this.currentChar && /[0-9]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

    if (this.currentChar === '.' && /[0-9]/.test(this.peek())) {
      result += '.'; this.advance();
      while (this.currentChar && /[0-9]/.test(this.currentChar)) {
        result += this.currentChar;
        this.advance();
      }
      return { type: 'NUMBER', value: parseFloat(result), line: startLine, column: startCol };
    }

    return { type: 'NUMBER', value: parseInt(result), line: startLine, column: startCol };
  }

  identifier() {
    const startLine = this.line;
    const startCol = this.column;
    let result = '';
    while (this.currentChar && /[A-Za-z0-9_]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

if (this.keywords.includes(result)) {
  if (result === 'and') return { type: 'AND', value: 'and', line: startLine, column: startCol };
  if (result === 'or')  return { type: 'OR', value: 'or', line: startLine, column: startCol };
  return { type: result.toUpperCase(), value: result, line: startLine, column: startCol };
}

return { type: 'IDENTIFIER', value: result, line: startLine, column: startCol };


  }

  string() {
    const startLine = this.line;
    const startCol = this.column;
    const quote = this.currentChar;
    this.advance();
    let result = '';

    while (this.currentChar && this.currentChar !== quote) {
      if (this.currentChar === '\\') {
        this.advance();
        switch (this.currentChar) {
          case 'n': result += '\n'; break;
          case 't': result += '\t'; break;
          case '"': result += '"'; break;
          case "'": result += "'"; break;
          case '\\': result += '\\'; break;
          default: result += this.currentChar;
        }
      } else {
        result += this.currentChar;
      }
      this.advance();
    }

    if (this.currentChar !== quote) {
      this.error('Unterminated string literal');
    }

    this.advance();
    return { type: 'STRING', value: result, line: startLine, column: startCol };
  }

  getTokens() {
    const tokens = [];

    while (this.currentChar !== null) {
      if (/\s/.test(this.currentChar)) { this.skipWhitespace(); continue; }
      if (this.currentChar === '#') { this.skipComment(); continue; }
      if (/[0-9]/.test(this.currentChar)) { tokens.push(this.number()); continue; }
      if (/[A-Za-z_]/.test(this.currentChar)) { tokens.push(this.identifier()); continue; }
      if (this.currentChar === '"' || this.currentChar === "'") { tokens.push(this.string()); continue; }

      const char = this.currentChar;
      const next = this.peek();
      const startLine = this.line;
      const startCol = this.column;

      if (char === '=' && next === '=') { tokens.push({ type: 'EQEQ', line: startLine, column: startCol }); this.advance(); this.advance(); continue; }
    
if (char === '=' && next === '>') {
  tokens.push({ type: 'ARROW', line: startLine, column: startCol });
  this.advance(); this.advance();
  continue;
}

if (char === '-' && next === '>') {
  tokens.push({ type: 'ARROW', line: startLine, column: startCol });
  this.advance(); this.advance();
  continue;
}
if (char === '?' && next === '?') {
    tokens.push({ type: 'NULLISH_COALESCING', value: '??', line: startLine, column: startCol });
    this.advance(); 
    this.advance(); 
    continue;
}

if (char === '?') {
    tokens.push({ type: 'QUESTION', value: '?', line: startLine, column: startCol });
    this.advance();
    continue;
}

      if (char === '!' && next === '=') { tokens.push({ type: 'NOTEQ', line: startLine, column: startCol }); this.advance(); this.advance(); continue; }
      if (char === '<' && next === '=') { tokens.push({ type: 'LTE', line: startLine, column: startCol }); this.advance(); this.advance(); continue; }
      if (char === '>' && next === '=') { tokens.push({ type: 'GTE', line: startLine, column: startCol }); this.advance(); this.advance(); continue; }
      if (char === '&' && next === '&') { tokens.push({ type: 'AND', line: startLine, column: startCol }); this.advance(); this.advance(); continue; }
      if (char === '|' && next === '|') { tokens.push({ type: 'OR', line: startLine, column: startCol }); this.advance(); this.advance(); continue; }
      if (char === '+' && next === '+') { tokens.push({ type: 'PLUSPLUS', line: startLine, column: startCol }); this.advance(); this.advance(); continue; }
      if (char === '-' && next === '-') { tokens.push({ type: 'MINUSMINUS', line: startLine, column: startCol }); this.advance(); this.advance(); continue; }

      const map = { '+': 'PLUSEQ', '-': 'MINUSEQ', '*': 'STAREQ', '/': 'SLASHEQ', '%': 'MODEQ' };
      if (next === '=' && map[char]) { tokens.push({ type: map[char], line: startLine, column: startCol }); this.advance(); this.advance(); continue; }

      const singles = {
        '+': 'PLUS', '-': 'MINUS', '*': 'STAR', '/': 'SLASH', '%': 'MOD',
        '=': 'EQUAL', '<': 'LT', '>': 'GT', '!': 'NOT',
        '(': 'LPAREN', ')': 'RPAREN', '{': 'LBRACE', '}': 'RBRACE',
        ';': 'SEMICOLON', ',': 'COMMA', '[': 'LBRACKET', ']': 'RBRACKET',
        ':': 'COLON', '.': 'DOT'
      };

      if (singles[char]) { tokens.push({ type: singles[char], line: startLine, column: startCol }); this.advance(); continue; }

      this.error("Unexpected character: " + char);
    }

    tokens.push({ type: 'EOF', line: this.line, column: this.column });
    return tokens;
  }
}

module.exports = Lexer;  