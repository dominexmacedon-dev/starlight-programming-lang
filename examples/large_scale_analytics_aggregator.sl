define logs = []

for (let i = 1; i <= 100; i = i + 1) {
    push(logs, {
        "userId": i % 10,
        "value": i
    })
}

func aggregate(data) {
    define result = {}

    for entry in data {
        define key = entry.userId

        if (!has(result, key)) {
            result[key] = 0
        }

        result[key] = result[key] + entry.value
    }

    return result
}

define summary = aggregate(logs)

sldeploy summary
