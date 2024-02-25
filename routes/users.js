const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')

mongoose.connect("mongodb://0.0.0.0:/whatsup")

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  profileImage: {
    type: String,
    default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png'
  },
  socketid: String,
})

userSchema.plugin(plm)
module.exports = mongoose.model('User', userSchema)
