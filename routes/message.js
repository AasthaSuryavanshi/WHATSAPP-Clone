const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    sender: String,
    reciever: String,
    data: String    
})

module.exports = mongoose.model('message', messageSchema);


