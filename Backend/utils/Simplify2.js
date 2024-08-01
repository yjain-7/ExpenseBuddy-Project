const Heap = require('heap');

function simplifyDebts(transactions){
  let total = {};
  for (let transaction of transactions) {
    let { giver, receiver, amount } = transaction;
    if (!(giver in total)) total[giver] = 0;
    if (!(receiver in total)) total[receiver] = 0;
    total[giver] -= amount;
    total[receiver] += amount;
  }

  let creditHeap = new Heap((a, b) => b[0] - a[0]); // Max heap for credits
  let debitHeap = new Heap((a, b) => a[0] - b[0]); // Min heap for debits

  for (let name in total) {
    let amount = total[name];
    if (amount > 0) {
      creditHeap.push([-amount, name]);
    } else if (amount < 0) {
      debitHeap.push([amount, name]);
    }
  }

  let answer = [];

  while (creditHeap.size() && debitHeap.size()) {
    let [creditValue, creditName] = creditHeap.pop();
    let [debitValue, debitName] = debitHeap.pop();

    if (creditValue < debitValue) {
      let amountLeft = creditValue - debitValue;
      answer.push({ giver: debitName, receiver: creditName, amount: -debitValue });
      creditHeap.push([amountLeft, creditName]);
    } else if (debitValue < creditValue) {
      let amountLeft = debitValue - creditValue;
      answer.push({ giver: debitName, receiver: creditName, amount: -creditValue });
      debitHeap.push([amountLeft, debitName]);
    } else {
      answer.push({ giver: debitName, receiver: creditName, amount: -creditValue });
    }
  }

  return answer;
}


let debts = [
    { giver: 'B', receiver: 'A', amount: 20 },
    { giver: 'C', receiver: 'A', amount: 250 },
    { giver: 'C', receiver: 'B', amount: 250 }
  ]

console.log(simplifyDebts(debts))