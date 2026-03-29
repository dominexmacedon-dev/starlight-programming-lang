# Starlight Examples

This document contains a collection of example programs written in the **Starlight Programming Language**.

These examples demonstrate core features such as variables, loops, functions, arrays, objects, and real-world use cases.

---

## Table of Contents

| Category | Description |
|----------|------------|
| Basics | Simple programs and syntax |
| Variables | Variable declaration and usage |
| Operators | Arithmetic and comparisons |
| Conditionals | Decision making |
| Loops | Iteration examples |
| Functions | Reusable logic |
| Arrays | Data collection operations |
| Objects | Structured data |
| Advanced | Real-world systems |

---

## 1. Basics

### Hello World

```sl
# Print a message
sldeploy "Hello, world!";
````

---

## 2. Variables

```sl
# Declare variables
let name = "Alice";
let age = 20;

# Output values
sldeploy name;
sldeploy age;
```

---

## 3. Operators

```sl
# Arithmetic
let result = 10 + 5 * 2;

sldeploy result;
```

---

## 4. Conditionals

```sl
# Check condition
let age = 18;

if (age >= 18) {
    sldeploy "Adult";
} else {
    sldeploy "Minor";
}
```

---

## 5. Loops

### While Loop

```sl
let i = 0;

while (i < 3) {
    sldeploy i;
    i = i + 1;
}
```

### For Loop

```sl
for (let i = 0; i < 3; i = i + 1) {
    sldeploy i;
}
```

---

## 6. Functions

```sl
# Function definition
func add(a, b) {
    return a + b;
}

let result = add(2, 3);

sldeploy result;
```

---

## 7. Arrays

```sl
# Create array
let arr = [1, 2, 3];

# Access element
sldeploy arr[0];

# Slice array
let part = arr[1:3];

sldeploy part;
```

---

## 8. Objects

```sl
# Create object
let user = {
    "name": "Alice",
    "age": 25
};

# Access property
sldeploy user.name;
```

---

## 9. Advanced Example

### Simple Shop System

```sl
let inventory = {
    "apple": { "price": 1, "stock": 10 }
};

func buy(item, qty) {

    let product = inventory[item];

    if (product.stock < qty) {
        sldeploy "Not enough stock";
        return;
    }

    product.stock = product.stock - qty;

    let cost = product.price * qty;

    sldeploy "Bought " + qty + " " + item;
    sldeploy "Cost: " + cost;
}

buy("apple", 2);
```

---

## 10. Array Transformations

```sl
let nums = [1, 2, 3, 4];

# Filter even numbers
let evens = filter(nums, (x) => x % 2 == 0);

# Double values
let doubled = map(evens, (x) => x * 2);

sldeploy doubled;
```

---

## 11. Object Iteration

```sl
let obj = {
    "a": 1,
    "b": 2
};

for key in obj {
    sldeploy key + ": " + obj[key];
}
```

---

## 12. Error Handling

```sl
do {
    let x = y;
} track {
    sldeploy "Error occurred";
}
```

---

## Summary

| Feature          | Covered |
| ---------------- | ------- |
| Variables        | Yes     |
| Loops            | Yes     |
| Functions        | Yes     |
| Arrays           | Yes     |
| Objects          | Yes     |
| Real-world logic | Yes     |

---

## Next Steps

* Explore the `examples/` folder for more programs
* Try modifying examples to learn faster
* Build your own mini projects using Starlight

---

## Keywords

Starlight examples, scripting language examples, interpreter examples, array examples, loop examples, beginner programming language, CLI scripting language

---


