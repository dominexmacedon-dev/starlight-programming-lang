define memo = {}

func fib(n) {
    if (n <= 1) {
        return n
    }

    if (has(memo, n)) {
        return memo[n]
    }

    define result = fib(n - 1) + fib(n - 2)
    memo[n] = result
    return result
}

sldeploy fib(10)
