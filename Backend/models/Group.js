const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupCode: String,
  name: String,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  usersList: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, name: String }],
  expensesList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
  unsettled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  settled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDebts' }],
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
