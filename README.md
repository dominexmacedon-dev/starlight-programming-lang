# Starlight Language (starlight-language)

**Starlight Language** is a lightweight server-side scripting programming language built with JavaScript. It provides a custom interpreter and command-line interface (CLI) runtime for executing `.sl` scripts.

This project is designed for learning, experimentation, and understanding how programming languages and interpreters work internally.

---

## Overview

Starlight Language is focused on simplicity and clarity. It demonstrates the full pipeline of a programming language, from lexical analysis to execution.

| Feature           | Description                                  |
| ----------------- | -------------------------------------------- |
| Type              | Server-side scripting language               |
| Runtime           | CLI-based                                    |
| Implementation    | JavaScript (Node.js)                         |
| Execution Model   | Interpreted (Lexer → Parser → Evaluator)     |
| Primary Use Cases | Learning, backend scripting, experimentation |

---

## Quick Start

Run a Starlight script:

```bash
starlight file.sl
```

Or using Node.js directly:

```bash
node starlight.js file.sl
```

---

## Example

```sl
print("Hello, Starlight")
```

---

## Execution Pipeline

The Starlight interpreter follows a structured execution pipeline:

| Stage      | File           | Description                          |
| ---------- | -------------- | ------------------------------------ |
| Input      | `.sl` file     | Source code                          |
| Lexing     | `lexer.js`     | Converts source code into tokens     |
| Parsing    | `parser.js`    | Builds an Abstract Syntax Tree (AST) |
| Evaluation | `evaluator.js` | Executes the AST                     |
| Output     | —              | Final program result                 |

---

## Project Structure

```plaintext
starlight-language/
├── lexer.js
├── parser.js
├── evaluator.js
├── starlight.js
└── README.md
```

---

## Core Components

### Lexer (`lexer.js`)

| Responsibility | Details                                    |
| -------------- | ------------------------------------------ |
| Tokenization   | Converts source code into tokens           |
| Recognizes     | Keywords, operators, identifiers, literals |
| Output         | Token stream                               |

---

### Parser (`parser.js`)

| Responsibility  | Details                     |
| --------------- | --------------------------- |
| Syntax Analysis | Validates program structure |
| Transformation  | Converts tokens into AST    |
| Output          | Abstract Syntax Tree        |

---

### Evaluator (`evaluator.js`)

| Responsibility   | Details                            |
| ---------------- | ---------------------------------- |
| Execution        | Interprets AST nodes               |
| Runtime Behavior | Handles expressions and statements |
| Output           | Program result                     |

---

### CLI Runtime (`starlight.js`)

| Responsibility | Details                               |
| -------------- | ------------------------------------- |
| Entry Point    | Handles CLI execution                 |
| File Handling  | Reads `.sl` files                     |
| Integration    | Connects lexer, parser, and evaluator |

---

## Use Cases

Starlight Language is suitable for:

| Use Case          | Description                            |
| ----------------- | -------------------------------------- |
| Learning          | Understanding interpreter architecture |
| Backend Scripting | Running command-line scripts           |
| Experimentation   | Testing language design concepts       |

---

## Project Goals

* Build a simple and understandable programming language
* Demonstrate interpreter architecture
* Provide a foundation for extending language features

---

## Future Improvements

| Feature          | Status      |
| ---------------- | ----------- |
| Variables        | Planned     |
| Functions        | Planned     |
| Control Flow     | In Progress |
| Error Handling   | Planned     |
| Standard Library | Planned     |
| Package System   | Planned     |

---

## Concepts Covered

* Programming language design
* Lexical analysis (tokenization)
* Parsing and Abstract Syntax Trees (AST)
* Interpretation and execution
* CLI tool development

---

## Keywords

Starlight Language is associated with the following topics:

* programming language
* scripting language
* interpreter
* compiler design
* abstract syntax tree
* lexer
* parser
* language development
* CLI runtime

---

## Contributing

Contributions are welcome. You can:

* Fork the repository
* Submit improvements
* Propose new features

---

## License

This project is open-source and intended for educational and experimental use.
