# Starlight Functions Guide

This document explains how functions work in the **Starlight Programming Language**.

Functions allow you to organize code into reusable blocks, making programs more modular and maintainable.

---

## Overview

| Feature | Description |
|--------|------------|
| Function Declaration | Define reusable logic |
| Parameters | Pass data into functions |
| Return Values | Output results |
| Arrow Functions | Short function syntax |
| Recursion | Functions calling themselves |

---

## 1. Function Declaration

A function is defined using the `func` keyword.

```sl
# Define a function
func greet() {

    # Output message
    sldeploy "Hello!";
}

# Call the function
greet();
````

---

## 2. Functions with Parameters

Functions can accept input values.

```sl
# Function with parameter
func greet(name) {

    sldeploy "Hello " + name;
}

greet("Alice");
greet("Bob");
```

### Parameter Rules

| Rule          | Description                       |
| ------------- | --------------------------------- |
| Order matters | Arguments are matched by position |
| Dynamic types | Any value type can be passed      |

---

## 3. Return Values

Functions can return results using `return`.

```sl
func add(a, b) {

    return a + b;
}

let result = add(2, 3);

sldeploy result;
```

---

## 4. Default Return Behavior

If no `return` is specified, the function returns `null`.

```sl
func test() {

    sldeploy "Running";
}

let value = test();

sldeploy value; # null
```

---

## 5. Arrow Functions

Short syntax for simple functions.

```sl
# Inline function
let add = (a, b) => a + b;

sldeploy add(5, 10);
```

---

## 6. Arrow Functions (Block Form)

Use when multiple statements are needed.

```sl
let multiply = (a, b) => {

    return a * b;
};

sldeploy multiply(3, 4);
```

---

## 7. Functions Calling Functions

Functions can call other functions.

```sl
func square(x) {
    return x * x;
}

func doubleSquare(x) {
    return square(x) * 2;
}

sldeploy doubleSquare(3);
```

---

## 8. Higher-Order Functions

Functions can accept other functions as arguments.

```sl
func apply(fn, value) {

    return fn(value);
}

let result = apply((x) => x * 3, 5);

sldeploy result;
```

---

## 9. Recursive Functions

A function can call itself.

```sl
# Factorial function
func factorial(n) {

    if (n == 0) {
        return 1;
    }

    return n * factorial(n - 1);
}

sldeploy factorial(5);
```

---

## 10. Functions with Conditions

```sl
func check(num) {

    if (num > 0) {
        return "Positive";
    }

    return "Negative";
}

sldeploy check(10);
sldeploy check(-3);
```

---

## 11. Early Return Pattern

Simplifies logic by exiting early.

```sl
func validate(age) {

    if (age < 0) {
        return "Invalid";
    }

    if (age < 18) {
        return "Minor";
    }

    return "Adult";
}

sldeploy validate(20);
```

---

## 12. Functions with Objects

```sl
func getName(user) {

    return user.name;
}

let user = {
    "name": "Alice"
};

sldeploy getName(user);
```

---

## Best Practices

| Practice             | Reason               |
| -------------------- | -------------------- |
| Keep functions small | Easier to understand |
| Use meaningful names | Improves readability |
| Avoid deep nesting   | Reduces complexity   |
| Use return early     | Cleaner logic        |

---

## Common Mistakes

| Mistake              | Problem           |
| -------------------- | ----------------- |
| Missing return       | Unexpected null   |
| Wrong parameters     | Incorrect results |
| Infinite recursion   | Stack overflow    |
| Calling non-function | Runtime error     |

---

## Notes

* Functions are dynamically typed
* Arguments are passed by value (or reference depending on type)
* Functions return `null` if no value is specified
* Arrow functions are useful for short logic

---

## Summary

Functions are essential for:

* Code reuse
* Structuring programs
* Reducing duplication
* Improving maintainability

Mastering functions is a key step toward building complex applications in Starlight.

---

## Keywords

starlight functions, function declaration, arrow functions, recursion, higher-order functions, scripting language functions, programming functions guide

 
