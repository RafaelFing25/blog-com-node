const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../modules/Categoria')
const Categoria = mongoose.model("categorias")

router.get('/:slug',(req,res) => {
    const slug =  req.params.slug
    Categoria.find({"slug":req.params.slug}).lean().then((categorias) => {
        if(categorias.length >= 5){
            res.render('categoriaspages/template', {slug: slug})
        }else{
            const erro = 'Não foi possivel achar essa categoria'
            res.render('categoriaspages/template',{erro: erro})}
            
          
})})


module.exports = router;

