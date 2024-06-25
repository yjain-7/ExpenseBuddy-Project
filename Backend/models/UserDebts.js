const mongoose = require('mongoose')
const userDebtsSchema = new mongoose.Schema({
    padiBy: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    owedBy: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    amount : Number,
});

const UserDebts = mongoose.model('UserDebts', userDebtsSchema);

module.exports = UserDebts;     