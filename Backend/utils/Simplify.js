const Heap = require("heap");

exports.simplifyDebts = (transactions) => {
  let total = {};
  for (let transaction of transactions) {
    let { paidBy, owedBy, amount } = transaction;
    if (!(paidBy in total)) total[paidBy] = 0;
    if (!(owedBy in total)) total[owedBy] = 0;
    total[paidBy] -= amount;
    total[owedBy] += amount;
  }

  let creditHeap = new Heap((a, b) => b[0] - a[0]);
  let debitHeap = new Heap((a, b) => a[0] - b[0]);

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
      amountLeft = parseFloat(amountLeft.toFixed(2));
      answer.push({
        paidBy: debitName,
        owedBy: creditName,
        amount: -debitValue,
      });
      creditHeap.push([amountLeft, creditName]);
    } else if (debitValue < creditValue) {
      let amountLeft = debitValue - creditValue;
      amountLeft = parseFloat(amountLeft.toFixed(2));
      answer.push({
        paidBy: debitName,
        owedBy: creditName,
        amount: -creditValue,
      });
      debitHeap.push([amountLeft, debitName]);
    } else {
      answer.push({
        paidBy: debitName,
        owedBy: creditName,
        amount: -creditValue,
      });
    }
  }

  return answer;
};
