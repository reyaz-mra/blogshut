const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/userDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const moment = require("moment");
const dateIndia = moment().format("DD/MM/YYYY");
const defImage = "https://qphs.fs.quoracdn.net/main-qimg-5871e4e05dd020122e560c53c0a520db";
// console.log(dateIndia)


const reviewSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    rating:{
        type:String,
        required: true
    },
    comment:{
        type:String,
        required:true
    },
    date:{
        type: String,
        default: dateIndia,
    },

})
const reviewModel = mongoose.model('review',reviewSchema)

module.exports = reviewModel