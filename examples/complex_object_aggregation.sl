define orders = [
    { "item": "book", "price": 10 },
    { "item": "pen", "price": 2 },
    { "item": "bag", "price": 25 }
]

define total = reduce(orders, (acc, o) => acc + o.price, 0)

sldeploy total
