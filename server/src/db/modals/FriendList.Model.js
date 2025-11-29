const mongoose = require('mongoose')
const userSchema = new mongoose.Schema ({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'   // referring to 'user' model
    }]
    
   
})

const FriendList = mongoose.model('friendList',userSchema)
module.exports = FriendList