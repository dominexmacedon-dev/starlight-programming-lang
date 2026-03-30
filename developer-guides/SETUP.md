# Starlight CLI Setup Guide

This guide explains how to install and use the **Starlight CLI** to run `.sl` files on your local machine or server.

Starlight is designed to be simple, fast, and instantly usable without complex configuration.

---

## 1. Overview

The Starlight CLI allows developers to:

- Execute `.sl` scripts directly from the terminal
- Build and test programs quickly
- Use a lightweight scripting environment
- Run scripts without compilation

Once installed, Starlight works globally across your system.

---

## 2. Installation

Install Starlight CLI globally using npm:

```bash
npm install -g starlight-cli
````

### Requirements

| Requirement | Description                          |
| ----------- | ------------------------------------ |
| Node.js     | Required (v14 or higher recommended) |
| npm         | Comes with Node.js                   |

---

## 3. Verify Installation

After installation, verify that Starlight is available:

```bash
starlight --version
```

If installed correctly, this will display the CLI version.

---

## 4. Creating a `.sl` File

You can create a Starlight file using any text editor.

### Important (Windows Users)

When saving your file:

1. Click **Save As**
2. In **Save as type**, select **All Files (*.*)**
3. Name your file with `.sl` extension

Example:

```
hello.sl
```

---

## 5. Writing Your First Program

Create a file named `hello.sl`:

```sl
sldeploy("Hello, Starlight");
```

---

## 6. Running a Program

Run your file using the CLI:

```bash
starlight hello.sl
```

### Output:

```
Hello, Starlight
```

---

## 7. How It Works

When you run:

```bash
starlight file.sl
```

The CLI will:

1. Read the `.sl` file
2. Tokenize the code (Lexer)
3. Parse it into AST (Parser)
4. Execute it (Evaluator)
5. Display output

---

## 8. Advantages of Starlight CLI

| Feature           | Benefit                            |
| ----------------- | ---------------------------------- |
| Global CLI        | Run scripts anywhere               |
| No compilation    | Instant execution                  |
| Lightweight       | Fast and minimal                   |
| Beginner-friendly | Easy syntax and setup              |
| Portable          | Works on local machine and servers |

---

## 9. Common Use Cases

* Learning programming language internals
* Writing CLI scripts
* Testing language features
* Rapid prototyping

---

## 10. Troubleshooting

### Command Not Found

If `starlight` is not recognized:

* Restart your terminal
* Ensure npm global path is added to PATH

### File Not Running

* Ensure file extension is `.sl`
* Check for syntax errors

---

## 11. Best Practices

* Keep files organized in folders
* Use meaningful file names
* Test small scripts first
* Use version control (Git)

---

## 12. Next Steps

* Explore built-in functions
* Try writing small applications
* Read full syntax reference
* Experiment with advanced features

---

## Keywords

starlight cli setup, install starlight language, run .sl files, scripting language cli, nodejs interpreter setup, starlight programming guide

 
