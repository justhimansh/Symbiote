const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jwt');

const useSchema = new mongoose.useSchema({
    username : {
        rtpe : String,
        reqired : true,
        unique : true
    },
    email : {
        type : Sting,
        required : true,
        unique : true
    },
    password : {
        type : Sting,
        required : true
    },
    tokens :{
        token : String,
        required : true
    }
})

useSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = bcryptjs.hashSync(this.password, 10);
    }
    next();
})

userSchema.methods.generateToken = async function(){
    try{
        let generatedToken = jwt.sign({_id : this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token : generatedToken}); 
         await this.save();
         return generatedToken;
    }catch (error){
        console.log(error)
    }
}

const Users = new mongoose.model("USER", userSchema);

module.exports = Users;