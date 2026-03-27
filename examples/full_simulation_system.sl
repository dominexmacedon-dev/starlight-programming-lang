define system = {
    "cache": {},
    "logs": []
}

func log(message) {
    push(system.logs, message)
}

func compute(x) {
    if (has(system.cache, x)) {
        log("cache hit: " + x)
        return system.cache[x]
    }

    log("cache miss: " + x)
    define result = x * x + 10
    system.cache[x] = result
    return result
}

func runBatch(inputs) {
    define results = []

    for x in inputs {
        push(results, compute(x))
    }

    return results
}

define inputData = range(1, 20)
define outputData = runBatch(inputData)

sldeploy outputData
sldeploy system.logs
