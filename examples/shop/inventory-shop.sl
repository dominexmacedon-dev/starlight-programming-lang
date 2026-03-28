# Inventory management system (formatted output)

define inventory = {
    "apple": { "price": 1, "stock": 10 },
    "banana": { "price": 2, "stock": 5 },
    "orange": { "price": 3, "stock": 8 }
};

func buy(itemName, quantity) {

    if (!has(inventory, itemName)) {
        sldeploy "Item not found: " + itemName;
        return;
    }

    define item = inventory[itemName];

    if (item.stock < quantity) {
        sldeploy "Not enough stock for " + itemName;
        return;
    }

    item.stock = item.stock - quantity;

    define cost = item.price * quantity;

    sldeploy "Bought " + quantity + " " + itemName;
    sldeploy "Cost: " + cost;
}

func printInventory(inv) {
    sldeploy "Remaining inventory:";

    for key in inv {
        define item = inv[key];
        sldeploy key + " -> price: " + item.price + ", stock: " + item.stock;
    }
}

buy("apple", 3);
buy("banana", 2);
buy("orange", 10);

printInventory(inventory);
