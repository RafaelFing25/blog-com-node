const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
require("../modules/Postagem")
const Postagem = mongoose.model('postagens')

router.get('/:slug',(req,res)=>{
    Postagem.findOne({slug: req.params.slug}).lean().then(postagem=>{
        if(postagem){
            
            console.log(postagem)
            res.render("postagem/index",{postagem:postagem})
        }else{
            req.flash("error_msg","Esta postagem não existe")
            res.redirect('/')
        }
    }).catch(err=>{
        req.flash("error_msg", "erro interno")
        res.redirect('/')
    })
})
router.post('/like/:id',(req,res)=>{
    Postagem.findById(req.params.id).then(postagem=>{
        postagem.likes++
        postagem.save().then(_=>{
            res.status(200)
        }).catch(_=>{
            req.flash('error_msg',"Erro ao dar like")
            res.redirect('/')
        })
    }).catch(err => {
        req.flash('error_msg',"Postagem não existe")
        res.redirect('/')
    })
})
router.post('/unlike/:id',(req,res)=>{
    Postagem.findById(req.params.id).then(postagem=>{
        postagem.likes--
        postagem.save().then(_=>{
            res.status(200)
        }).catch(_=>{
            req.flash('error_msg',"Erro ao dar unlike")
            res.redirect('/')
        })
    }).catch(err => {
        req.flash('error_msg',"Postagem não existe")
        res.redirect('/')
    })
})
router.post("/deslike/:id",(req,res) => {
    Postagem.findById(req.params.id).then(postagem=>{
        postagem.deslikes++
        postagem.save().then(_=>{
            res.status(200)
        }).catch(_=>{
            req.flash('error_msg',"Erro ao dar deslike")
            res.redirect('/')
        })
    }).catch(err => {
        req.flash('error_msg',"Postagem não existe")
        res.redirect('/')
    })
})
router.post("/undeslike/:id",(req,res) => {
    Postagem.findById(req.params.id).then(postagem=>{
        postagem.deslikes--
        postagem.save().then(_=>{
            res.status(200)
        }).catch(_=>{
            req.flash('error_msg',"Erro ao dar undeslike")
            res.redirect('/')
        })
    }).catch(err => {
        req.flash('error_msg',"Postagem não existe")
        res.redirect('/')
    })
})


module.exports = router