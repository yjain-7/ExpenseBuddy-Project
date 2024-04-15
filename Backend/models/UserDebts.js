const mongoose = require('mongoose')
const userDebtsSchema = new mongoose.Schema({
    owedBy: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    padiBy: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    amount : Number,
    settled : Boolean
});

const UserDebts = mongoose.model('UserDebts', userDebtsSchema);

module.exports = UserDebts;   