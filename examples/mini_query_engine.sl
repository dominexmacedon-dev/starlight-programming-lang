define table = [
    { "name": "Alice", "age": 25 },
    { "name": "Bob", "age": 17 },
    { "name": "Charlie", "age": 30 }
]

func where(data, predicate) {
    return filter(data, predicate)
}

func select(data, fields) {
    return map(data, (row) => {
        define obj = {}
        for f in fields {
            obj[f] = row[f]
        }
        return obj
    })
}

define adults = where(table, (r) => r.age >= 18)
define names = select(adults, ["name"])

sldeploy names
