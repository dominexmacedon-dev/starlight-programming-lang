# Transaction history tracking

define history = [];

func logTransaction(type, amount) {
    push(history, {
        "type": type,
        "amount": amount
    });
}

func printHistory() {
    sldeploy "Transaction History:";

    for tx in history {
        sldeploy tx.type + ": " + tx.amount;
    }
}

logTransaction("deposit", 100);
logTransaction("withdraw", 50);
logTransaction("transfer", 200);

printHistory();
