const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/userDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const moment = require("moment");
const dateIndia = moment().format("DD/MM/YYYY");
const defImage = "https://qphs.fs.quoracdn.net/main-qimg-5871e4e05dd020122e560c53c0a520db";
// console.log(dateIndia)


const blogSchema = mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required: true
    },
    notes:{
        type:String,
        required:true
    },
    date:{
        type: String,
        default: dateIndia,
    },
    img: {
        type: String,
        default: defImage,
    },
    username:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    }

})
const blogModel = mongoose.model('blogy',blogSchema)

module.exports = blogModel