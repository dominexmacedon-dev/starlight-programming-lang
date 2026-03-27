func eval(expr) {
    if (typeOf(expr) == "number") {
        return expr
    }

    if (typeOf(expr) == "array") {
        define op = expr[0]

        if (op == "+") {
            return eval(expr[1]) + eval(expr[2])
        }

        if (op == "*") {
            return eval(expr[1]) * eval(expr[2])
        }
    }

    return null
}

define program = ["+", 2, ["*", 3, 4]]

sldeploy eval(program)
