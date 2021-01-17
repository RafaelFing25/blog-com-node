const express = require('express')
const { modelNames } = require('mongoose')
const router = express.Router()
const mongoose = require('mongoose')
require('../modules/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcrypt')
const passport = require('passport')

router.get('/registro', (req,res)=>{
    res.render('usuarios/registro')
})
router.post('/registro', (req,res)=>{
    console.log('eu')
    const erros = []

    if(!req.body.nome || req.body.nome === undefined || req.body.nome.length < 5){
        erros.push({texto:"Nome inválido"})
    }
    if(!req.body.email || req.body.email === undefined || req.body.nome.length < 5 ){
        erros.push({texto:"Email inválido"})
    }
    if(!req.body.senha || req.body.senha === undefined || req.body.nome.senha < 5){
        erros.push({texto:"Senha inválido"})
    }
    if(req.body.senha !== req.body.senha2){
        erros.push({texto:"Senhas não concidem"})
    }
    
    
    if(erros.length>0){
       erros.forEach(erro=>{
           console.log(erro)
           req.flash('error_msg',erro.texto)
       })
        res.redirect('/usuarios/registro')
      }else{
        Usuario.findOne({email: req.body.email}).then(usuario=>{
            if(usuario){
                req.flash("error_msg","email já cadastrado")
                res.redirect('/usuarios/registro')
            }else{
                const senha = bcrypt.hashSync(req.body.senha,10)
                const novoUsuario = {
                    nome:req.body.nome,
                    email:req.body.email,
                    senha:senha
                }
                const usuario = new Usuario(novoUsuario)
                usuario.save().then(_=>{
                    req.flash("sucess_msg", "Cadastrado  com sucesso")
                    res.redirect('/usuarios/entrar')
                }).catch(err=>{
                    req.flash('error_msg', "Erro ao salvar usuario")
                })
            }
        }).catch(err=>{
            req.flash("error_msg","erro interno, tente novamente")
            res.redirect('/usuarios/registro')
        })

        
   }
})

router.get('/entrar',(req,res)=>{
    res.render('usuarios/entrar')
})
router.post('/entrar',(req,res,next)=>{
    passport.authenticate("local",{
        successRedirect: '/',
        failureRedirect:'/usuarios/entrar',
        failureFlash:true
    })(req,res,next)
})
router.get('/sair',(req,res)=>{
    req.logout()
    res.redirect('/')
})

module.exports = router