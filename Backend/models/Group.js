const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupCode: String,
  name: String,
  description: String,
  createdBy: { userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, name: String },
  usersList: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, name: String, _id: false }],
  expensesList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
  unsettled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  settled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  activities: [String]
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;