# Deposit and withdraw system

func deposit(account, amount) {
    account.balance = account.balance + amount;
    sldeploy "Deposited: " + amount;
    sldeploy "New balance: " + account.balance;
}

func withdraw(account, amount) {
    if (account.balance < amount) {
        sldeploy "Insufficient funds";
        return;
    }

    account.balance = account.balance - amount;

    sldeploy "Withdrawn: " + amount;
    sldeploy "Remaining balance: " + account.balance;
}

define user = { "balance": 300 };

deposit(user, 100);
withdraw(user, 50);
withdraw(user, 500);
