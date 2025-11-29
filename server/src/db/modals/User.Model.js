const mongoose = require('mongoose')
const nanoid = require('nanoid');
const nanoidtendigit = require('../../utils/gameIdGenerator')
const crypto = require('crypto');
const userSchema = new mongoose.Schema ({
    username:{
        type:String,
        required:true
    },
    gameid:{
        type:String,
        default:()=>nanoidtendigit(),
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    },
    refreshToken:{
        type:String,
    },
    profile:{
        type:String,
        default:'/default.jpg'
    },
    passwordResetCode:String,
    passwordResetCodeExpires:Date,
    passwordChangedAt:Date,
    

   
})
userSchema.methods.createResetPasswordCode = function(){
    const generateResetCode = nanoid.customAlphabet('1234567890', 6);
    const resetCode = generateResetCode();
    this.passwordResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
    this.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    console.log(resetCode,this.passwordResetCode);
    return resetCode;
}


const User = mongoose.model('user',userSchema)
module.exports = User
