# Starlight Language Syntax Reference

This document provides a comprehensive reference for **Starlight Language syntax**, including statements, expressions, operators, and edge-case behavior. It is intended as a formal guide for developers and learners.

---

## 1. Program Structure

A Starlight program consists of a sequence of executable statements.

```sl
define x = 10
sldeploy x
```

---

## 2. Statements

### 2.1 Variable Declaration

```sl
define name = "Alice"
```

| Rule           | Description |
| -------------- | ----------- |
| Initialization | Required    |
| Typing         | Dynamic     |

---

### 2.2 Assignment

```sl
x = 20
```

#### Compound Assignment Operators

| Operator | Description               |
| -------- | ------------------------- |
| `+=`     | Addition assignment       |
| `-=`     | Subtraction assignment    |
| `*=`     | Multiplication assignment |
| `/=`     | Division assignment       |
| `%=`     | Modulus assignment        |

---

### 2.3 Output

```sl
sldeploy value
```

| Behavior | Description            |
| -------- | ---------------------- |
| Output   | Prints formatted value |

---

### 2.4 Input

```sl
define input = ask("Enter value:")
```

| Rule        | Description      |
| ----------- | ---------------- |
| Prompt type | Must be a string |

---

### 2.5 Conditional Statement

```sl
if (condition) {
    ...
} else {
    ...
}
```

| Rule      | Description        |
| --------- | ------------------ |
| Condition | Coerced to boolean |

---

### 2.6 While Loop

```sl
while (condition) {
    ...
}
```

---

### 2.7 For Loop

```sl
for (let i = 0; i < 10; i = i + 1) {
    ...
}
```

---

### 2.8 For-In Loop

```sl
for item in array {
    ...
}
```

| Behavior | Description     |
| -------- | --------------- |
| Arrays   | Iterates values |
| Objects  | Iterates keys   |

---

### 2.9 Loop Control

```sl
break
continue
```

| Statement  | Description            |
| ---------- | ---------------------- |
| `break`    | Exit loop              |
| `continue` | Skip to next iteration |

---

### 2.10 Functions

#### Declaration

```sl
func add(a, b) {
    return a + b
}
```

#### Return Behavior

| Rule           | Description       |
| -------------- | ----------------- |
| Default return | `null` if omitted |

---

### 2.11 Arrow Functions

```sl
define add = (a, b) => a + b
```

#### Block Form

```sl
define fn = (x) => {
    return x * 2
}
```

---

### 2.12 Import

```sl
import math from "math"
import { add } from "utils"
import * as lib from "module"
```

| Import Type | Description          |
| ----------- | -------------------- |
| Default     | Single module import |
| Named       | Specific exports     |
| Namespace   | Entire module        |

---

### 2.13 Error Handling

```sl
do {
    ...
} track {
    ...
}
```

| Feature        | Description           |
| -------------- | --------------------- |
| `track` block  | Executes on error     |
| Error variable | Accessible as `error` |

---

### 2.14 Start Statement (Switch-like)

```sl
start (value) {
    case 1 {
        ...
    }
    case 2 {
        ...
    }
}
```

| Behavior    | Description                |
| ----------- | -------------------------- |
| Fallthrough | Occurs unless `break` used |

---

### 2.15 Await

```sl
define result = await asyncCall()
```

---

### 2.16 Object Construction

```sl
define obj = new Constructor(arg)
```

---

## 3. Expressions

### 3.1 Literal Values

```sl
10
"hello"
true
false
null
```

---

### 3.2 Expression Types

| Type               | Example        |
| ------------------ | -------------- |
| Identifier         | `x`            |
| Binary Expression  | `a + b`        |
| Logical Expression | `a AND b`      |
| Unary Expression   | `!x`, `-x`     |
| Conditional        | `cond ? a : b` |
| Function Call      | `fn()`         |
| Member Access      | `obj.key`      |
| Index Access       | `arr[0]`       |

---

### 3.3 Arrays

```sl
[1, 2, 3]
```

---

### 3.4 Objects

```sl
{
    "a": 1,
    "b": 2
}
```

---

### 3.5 Slice Expression

```sl
arr[start:end]
arr[start:end:step]
```

| Format             | Description     |
| ------------------ | --------------- |
| `[start:end]`      | Basic slice     |
| `[start:end:step]` | Slice with step |

---

### 3.6 Update Expressions

```sl
i++
i--
++i
--i
```

---

## 4. Operators

### Operator Categories

| Category   | Operators                         |
| ---------- | --------------------------------- |
| Arithmetic | `+`, `-`, `*`, `/`, `%`           |
| Assignment | `=`, `+=`, `-=`, `*=`, `/=`, `%=` |
| Comparison | `==`, `!=`, `<`, `<=`, `>`, `>=`  |
| Logical    | `AND`, `OR`, `??`                 |
| Unary      | `!`, `+`, `-`                     |

---

## 5. Edge Cases

### Runtime Behavior

| Case                      | Behavior / Result    |
| ------------------------- | -------------------- |
| Undefined variable        | Runtime error        |
| Division by zero          | Runtime error        |
| Invalid assignment        | Syntax/runtime error |
| Function without return   | Returns `null`       |
| Array out-of-bounds       | Returns `undefined`  |
| Missing object property   | Returns `undefined`  |
| Call non-function         | Runtime error        |
| Member access on `null`   | Runtime error        |
| Loop control outside loop | Runtime error        |
| Import failure            | Runtime error        |

---

### Slice Rules

| Rule                | Behavior       |
| ------------------- | -------------- |
| Negative indices    | Supported      |
| Out-of-range values | Clamped        |
| Step value          | Cannot be zero |

---

## 6. Language Notes

| Feature            | Description                          |
| ------------------ | ------------------------------------ |
| Typing             | Dynamic                              |
| Data structures    | Mutable (arrays and objects)         |
| Functions          | Support closures                     |
| Undefined handling | Converted to `null` internally       |
| Error reporting    | Includes line and column information |

---

## Keywords

starlight language syntax, scripting language reference, interpreter syntax, programming language grammar, AST interpreter language
