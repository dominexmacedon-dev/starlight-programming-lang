define records = [
    { "type": "A", "value": 10 },
    { "type": "B", "value": 20 },
    { "type": "A", "value": 30 },
    { "type": "B", "value": 40 }
]

func groupByType(data) {
    define result = {}

    for item in data {
        if (!has(result, item.type)) {
            result[item.type] = []
        }
        push(result[item.type], item.value)
    }

    return result
}

define grouped = groupByType(records)

sldeploy grouped
