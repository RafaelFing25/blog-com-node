const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo:{
        type:String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        rerquired: true
    },
    conteudo:{
        type:String,
        required: true
    },
    likes:{
        type:Number,
        default:0
    },
    deslikes:{
        type:Number,
        default:0
    },
    datapublicada:{
        type:Date,
        default: Date.now()
    }
})


mongoose.model("postagens", Postagem)