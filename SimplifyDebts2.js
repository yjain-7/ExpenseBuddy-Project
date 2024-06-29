function simplifyDebts(transactions) {
    let total = {};

    for (let transaction of transactions) {
        let [giver, receiver, amount] = transaction;
        if (!(giver in total)) total[giver] = 0;
        if (!(receiver in total)) total[receiver] = 0;
        total[giver] -= amount;
        total[receiver] += amount;
    }

    let credit = [];
    let debit = [];

    for (let name in total) {
        let amount = total[name];
        if (amount > 0) {
            credit.push([-amount, name]);
        } else if (amount < 0) {
            debit.push([amount, name]);
        }
    }

    credit.sort((a, b) => a[0] - b[0]);
    debit.sort((a, b) => a[0] - b[0]);
    let answer = [];

    while (credit.length && debit.length) {
        let [creditValue, creditName] = credit.pop();
        let [debitValue, debitName] = debit.pop();

        if (creditValue < debitValue) {
            let amountLeft = creditValue - debitValue;
            answer.push([debitName, creditName, -debitValue]);
            credit.push([amountLeft, creditName]);
            credit.sort((a, b) => a[0] - b[0]);
        } else if (debitValue < creditValue) {
            let amountLeft = debitValue - creditValue;
            answer.push([debitName, creditName, -creditValue]);
            debit.push([amountLeft, debitName]);
            debit.sort((a, b) => a[0] - b[0]);
        } else {
            answer.push([debitName, creditName, -creditValue]);
        }
    }

    return answer;
}

// Example usage:
let transactions = [
    ['B','G',30],
    ['B','F',10],
    ['C','B',40],
    ['C','F',30],
    ['D','G',10],
    ['D','C',20],
    ['D','F',10],
    ['E','D',50],
    ['E','F',10],

];

console.log(simplifyDebts(transactions));
