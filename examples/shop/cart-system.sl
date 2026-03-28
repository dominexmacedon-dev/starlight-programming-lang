# Cart system

define cart = [];

func addToCart(name, price, qty) {
    push(cart, {
        "name": name,
        "price": price,
        "qty": qty
    });

    sldeploy "Added to cart: " + name;
}

func viewCart() {
    sldeploy "Cart items:";

    for item in cart {
        sldeploy item.name + " x" + item.qty + " = " + (item.price * item.qty);
    }
}

addToCart("Laptop", 300, 1);
addToCart("Mouse", 20, 2);

viewCart();
