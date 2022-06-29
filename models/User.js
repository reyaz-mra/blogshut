const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

mongoose.connect("mongodb://localhost:27017/userDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is Required"]
    },
    username:{
        type:String,
        unique:[true,"Username Must be Unique"],
        required:[true,"Name is Required"]
    },
    email:{
        type:String,
        unique:[true,"Email Must be Unique"],
        required:[true,"Email is Required"]
    },
    password:{
        type:String,
        required:[true,"Password is Required"]
    }
})

// userSchema.pre("save", function(next) {
//     if(!this.isModified("password")) {
//         return next();
//     }
//     this.password = bcrypt.hashSync(this.password, 10);
//     next();
// });

// // userSchema.methods.comparePassword = function(plaintext, callback) {
// //     return callback(null, bcrypt.compareSync(plaintext, this.password));
// // };

const userModel = mongoose.model('user',userSchema)

module.exports = userModel