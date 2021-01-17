const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
require('../modules/Postagem')
const Postagem = mongoose.model("postagens")
const { eAdmin } = require("../helpers/eAdmin")


router.get('/',eAdmin,(req,res) => {
    res.render('admin/index')
})

router.get('/posts', eAdmin,(req,res) => {
    res.send('Pagina de posts ')
})


router.get('/postagens',eAdmin, (req,res) => {
    Postagem.find().lean().populate('categoria').sort({datapublicada:"desc"}).then((postagens)=>{
        res.render("admin/postagens",{postagens:postagens})
    }).catch(err=>{
        req.flash("error_msg", "Erro Interno!Tente novamente.")
        res.redirect('/admin')
    })
})

router.get("/postagens/add",eAdmin, (req,res) => {
    
    res.render("admin/addpostagem")
    
    
})
router.post('/postagensadd',eAdmin,(req,res) => {
  const erros = []

  if(erros.length>0){
    req.flash("error_msg", erros.toString())
  }else{
  const novaPostagem = {
      titulo: req.body.titulo,
      slug: req.body.slug,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
  }
  new Postagem(novaPostagem).save().then(() => {
    req.flash("success_msg","Postagem Criada com sucesso")
    res.redirect('/admin/postagens')
  }).catch((err) => {
    req.flash("error_msg" , "erro desconhecido, tente novamente")
    res.redirect('/admin/postagens')
  })
  }
})

router.get('/postagem/remove/:id', eAdmin,(req,res) => {
    Postagem.findOneAndRemove({_id: req.params.id}).then(() => {
        req.flash("success_msg","Categoria deletada com sucesso!")
        res.redirect('/admin/postagens')
    }).catch((err) => {
      req.flash("error_msg", "Occreu um erro interno ao deletar a postagem!")
      res.redirect('/admin/postagem')
    })
})

router.get('/postagem/editar/:id',eAdmin,(req,res) => {
    Postagem.findOne({_id:req.params.id}).lean().then((postagem) => {   
      
      res.render('admin/editpostagem',{postagem: postagem})
    }).catch( (err) => {
        console.log(err)
      req.flash("error_msg", "Erro ao caregar formulario! Tente novamente!")
      res.redirect('/admin/postagens')
    })
})

router.post('/postagem/editar',eAdmin, (req,res) => {
    const erros=[]
  Postagem.findOne({_id: req.body.id}).then(postagem=>{

    postagem.titulo = req.body.titulo
    postagem.slug = req.body.slug
    postagem.descricao = req.body.descricao
    postagem.conteudo = req.body.conteudo

    postagem.save().then(_=>{
      req.flash('success_msg',"Postagem salva com sucesso")
      res.redirect('/admin/postagens')
    }).catch(err=>{
      req.flash('error_msg', "houve um erro ao salvar a Postagem")
      res.redirect('/admin/postagens')
    })

  }).catch(err=>{
    req.flash('error_msg',"Houve um erro ao salvar a Postagem")
    res.redirect("/admin/postagens")
  })
})

module.exports = router

