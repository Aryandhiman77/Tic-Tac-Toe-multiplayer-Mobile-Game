const mongoose = require('mongoose')
const userSchema = new mongoose.Schema ({
    userid:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:'user',
    },
    friendid:{
        type:String,
        required:true,
    },
    friendUserid:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:'user',
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})
const Friend = mongoose.model('friend',userSchema)
module.exports = Friend
