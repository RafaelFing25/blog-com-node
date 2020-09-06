const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../modules/Categoria')
const Categoria = mongoose.model("categorias")
require('../modules/Postagem')
const Postagem = mongoose.model("postagens")


router.get('/',(req,res) => {
    res.render('admin/index')
})

router.get('/posts', (req,res) => {
    res.send('Pagina de posts ')
})

router.get('/categorias', (req,res) => {
    Categoria.find().sort({date:'desc'}).lean().then((categorias) => {
        res.render('admin/categorias', {categorias: categorias/*.map(categorias =>{categorias.toJSON()})*/})

    }).catch((err) => {
        req.flash('error_msg', "houve um erro"+err)
        res.redirect('/admin')
    })
})

router.get('/categorias/add', (req,res) => {
    res.render('admin/addcategorias')
})
router.post("/categorias/nova", (req,res) => {

    const erros= []

    if(!req.body.nome || typeof req.body.nome == undefined  /*req.body.name == null*/){
        erros.push({text: "Nome Invalido"})
    }

    if(!req.body.slug|| typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({text: "Slug Inválido"})
    }

    if(req.body.nome.length < 5){
        erros.push({text: "O nome deve ter mais de 5 caracteres"})
    }


    

    if(req.body.slug.length < 5){
        erros.push({text: "O slug deve ter mais de 5 caracteres"})
    }
    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
        console.log('Salvo com sucesso')
        req.flash("success_msg", "Categoria Criada com sucesso")
        res.redirect("/admin/categorias")})
        .catch((err) => {
            req.flash("error_msg", "Ouve um erro ao salvar a categoria")
            console.log(err)
            res.redirect('/admin')})}

    
})
router.get("/categorias/delete/:id", (req,res) =>{
    Categoria.findOneAndRemove({_id: req.params.id}).then(() => {
        req.flash("success_msg","Categoria deletada com sucesso!")
        res.redirect('/admin/categorias')
    }).catch((err) => {
      req.flash("error_msg", "Occreu u erro intern ao deletar a categoria!")
      res.redirect('/admin/categorias')
    })
})

router.get('/categorias/editar/:id',(req,res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render('admin/editcategorias',{categoria: categoria})
      
    }).catch( (err) => {
      req.flash("error_msg", "essa categoria não existe")
      res.redirect('/admi/categorias')
    })
})

router.post('/categorias/editar', (req,res) => {
    const erros=[]

    if(!req.body.nome || typeof req.body.nome == undefined  /*req.body.name == null*/){
        erros.push("Nome Invalido")
    }

    if(!req.body.slug|| typeof req.body.slug == undefined || req.body.slug == null){
        erros.push("Slug Inválido")
    }

    if(req.body.nome.length < 5){
        erros.push("O nome deve ter mais de 5 caracteres")
    }
    


    

    if(req.body.slug.length < 5){
        erros.push("O slug deve ter mais de 5 caracteres")
    }
    if(erros.length > 0){
        req.flash("error_msg",erros.toString())
        console.log(erros.toString())
        res.redirect('/admin/categorias/editar/'+req.body.id)
        
    }else{
         Categoria.findOne({_id: req.body.id}).then( (categoria) => {
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
            categoria.save().then(() => {
              req.flash("success_msg", "Categoria editada com succeso")
              res.redirect('/admin/categorias')
            }).catch((err) => {
              req.flash("error_msg", "Houve um erro interno ao salvar a categoria")
              res.redirect('/admin/categorias')

            })
        }).catch((err) => {
          req.flash("error_msg","houve um erro")
        })
    }
})

router.get('/postagens', (req,res) => {
    Postagem.find().lean().populate('categoria').sort({datapublicada:"desc"}).then((postagens)=>{
        console.log(postagens)
        res.render("admin/postagens",{postagens:postagens})
    }).catch(err=>{
        req.flash("error_msg", "Erro Interno!Tente novamente.")
        res.redirect('/admin')
    })
})

router.get("/postagens/add", (req,res) => {
    Categoria.find().lean().then(categorias=>{
        console.log(categorias)
        res.render("admin/addpostagem",{categorias:categorias})
    }).catch((err) => {
      req.flesh("error_msg", "Houve um erro desconhecido")
    })
    
})
router.post('/postagensadd',(req,res) => {
  const erros = []

  if(req.body.categoria == "0"){
      erros.push('Categoria invalida registre uma categoria')
  }
  if(erros.length>0){
    req.flash("error_msg", erros.toString())
  }else{
  const novaPostagem = {
      titulo: req.body.titulo,
      slug: req.body.slug,
      decriçao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria
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

router.get('/postagem/remove/:id', (req,res) => {
    Postagem.findOneAndRemove({_id: req.params.id}).then(() => {
        req.flash("success_msg","Categoria deletada com sucesso!")
        res.redirect('/admin/postagens')
    }).catch((err) => {
      req.flash("error_msg", "Occreu um erro interno ao deletar a postagem!")
      res.redirect('/admin/postagem')
    })
})

router.get('/postagem/editar/:id',(req,res) => {
    Postagem.findOne({_id:req.params.id}).lean().then((postagem) => {
        res.render('admin/editcategorias',{postagen: postagem})
      
    }).catch( (err) => {
      req.flash("error_msg", "essa postagem não existe")
      res.redirect('/admi/postagens')
    })
})

router.post('/postagem/editar', (req,res) => {
    const erros=[]

    
         Categoria.findOne({_id: req.body.id}).then( (categoria) => {
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
            categoria.save().then(() => {
              req.flash("success_msg", "Categoria editada com succeso")
              res.redirect('/admin/postagens')
            }).catch((err) => {
              req.flash("error_msg", "Houve um erro interno ao salvar a categoria")
              res.redirect('/admin/postagens')

            })
        }).catch((err) => {
          req.flash("error_msg","houve um erro")
        })
    }
)

module.exports = router

