# Starlight Strings Guide

This document explains how string handling works in the **Starlight Programming Language**.

Strings are used to represent text and are essential for user input, data processing, and output formatting.

---

## Overview

| Feature | Description |
|--------|------------|
| Creation | Define strings using quotes |
| Concatenation | Combine strings using `+` |
| Built-in Functions | Transform and analyze strings |
| Indexing | Access individual characters |
| Splitting & Joining | Convert between strings and arrays |

---

## 1. Creating Strings

Strings are defined using double quotes.

```sl
let text = "Hello, Starlight";

sldeploy text;
````

---

## 2. Concatenation

Combine strings using the `+` operator.

```sl id="w5q6qs"
let name = "Alice";

sldeploy "Hello " + name;
```

---

## 3. String Length

```sl id="qf8ux3"
let text = "Hello";

sldeploy len(text); # 5
```

---

## 4. Accessing Characters

```sl id="qk8x9z"
let text = "Hello";

sldeploy text[0]; # H
sldeploy text[1]; # e
```

---

## 5. Case Conversion

```sl id="4xprg2"
sldeploy upper("hello");   # HELLO
sldeploy lower("WORLD");   # world
```

---

## 6. Trimming Whitespace

```sl id="d03l9m"
sldeploy trim("  hello  ");        # "hello"
sldeploy trimStart("  hi");        # "hi"
sldeploy trimEnd("bye  ");         # "bye"
```

---

## 7. Searching in Strings

```sl id="t5qj9x"
sldeploy includes("hello world", "world");  # true
sldeploy startsWith("hello", "he");         # true
sldeploy endsWith("hello", "lo");           # true
```

---

## 8. Replacing Text

```sl id="7jxv4t"
sldeploy replace("hello world", "world", "Starlight");
```

---

## 9. Splitting Strings

Convert a string into an array.

```sl id="d8lgf9"
let words = split("a,b,c", ",");

sldeploy words;
```

---

## 10. Joining Arrays into Strings

```sl id="6k2qjd"
let arr = ["a", "b", "c"];

sldeploy join(arr, "-"); # a-b-c
```

---

## 11. Substring Extraction

```sl id="c2fx3d"
sldeploy substring("hello", 1, 4); # ell
```

---

## 12. Repeating Strings

```sl id="r8d0af"
sldeploy repeat("ha", 3); # hahaha
```

---

## 13. Padding Strings

```sl id="a1k9de"
sldeploy padStart("5", 3, "0"); # 005
sldeploy padEnd("5", 3, "0");   # 500
```

---

## 14. String Formatting Example

```sl id="a3k7sl"
let name = "Alice";
let age = 25;

let message = "Name: " + name + ", Age: " + age;

sldeploy message;
```

---

## 15. Real-World Example

### User Greeting System

```sl id="l8zv21"
let input = ask("Enter your name:");

let clean = trim(input);

let name = capitalize(clean);

sldeploy "Welcome " + name;
```

---

## 16. Advanced Transformations

```sl id="9xg7qk"
sldeploy camelCase("hello world example");  # helloWorldExample
sldeploy kebabCase("Hello World Example");  # hello-world-example
```

---

## Built-in String Functions Summary

| Function                | Description           |
| ----------------------- | --------------------- |
| lower(str)              | Convert to lowercase  |
| upper(str)              | Convert to uppercase  |
| trim(str)               | Remove whitespace     |
| includes(str, substr)   | Check substring       |
| replace(str, a, b)      | Replace text          |
| split(str, sep)         | Split into array      |
| join(arr, sep)          | Join into string      |
| substring(str, a, b)    | Extract portion       |
| repeat(str, n)          | Repeat string         |
| padStart(str, len, pad) | Pad start             |
| padEnd(str, len, pad)   | Pad end               |
| camelCase(str)          | Convert to camelCase  |
| kebabCase(str)          | Convert to kebab-case |

---

## Best Practices

| Practice                   | Reason                  |
| -------------------------- | ----------------------- |
| Use built-in functions     | Cleaner and faster      |
| Trim user input            | Avoid unexpected spaces |
| Validate before processing | Prevent errors          |
| Keep formatting simple     | Improve readability     |

---

## Common Mistakes

| Mistake                   | Problem           |
| ------------------------- | ----------------- |
| Access out-of-range index | Returns undefined |
| Wrong separator in split  | Incorrect results |
| Forget trimming input     | Extra spaces      |
| Overusing concatenation   | Hard to read      |

---

## Notes

* Strings are immutable (new values are returned)
* Indexing starts at 0
* Most functions return a new string
* String operations are safe and predictable

---

## Summary

Strings are essential for:

* User interaction
* Data formatting
* Text processing
* Real-world applications

Mastering string manipulation is key to building practical programs in Starlight.

---

## Keywords

starlight strings, string functions, string manipulation, scripting language strings, text processing, programming strings guide
 
