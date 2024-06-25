const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  password: { type: String, required: true },
  groupsList: [{ groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, name: String, groupCode: String, _id:false }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
