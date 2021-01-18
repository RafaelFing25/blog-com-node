const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const admin = require('./routes/admin')
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash')
const moment = require('moment')
require("./modules/Postagem")
const Postagem = mongoose.model('postagens')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')

const postagens = require('./routes/postagem')
const usuario = require('./routes/usuario')

const passport = require('passport')
require('./config/auth')(passport)


// ! Configuraçoes
    //? sessão
        app.use(session({
            secret: "qualquercoisa",
            resave: true,
            saveUninitialized: true
        })) 
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //? middlewares
        app.use((req,res, next) =>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
            next()
        } )
    //? Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //? Handlebars
        app.engine('handlebars', handlebars({
            handlebars: allowInsecurePrototypeAccess(Handlebars),
            defaultLayout: 'main',
            helpers: {
                formatDate: (date) => {
                    return moment(date).format('DD/MM/YYYY  hh:mm')
                }
            }
             }))
        app.set('view engine', 'handlebars')
    //? Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb+srv://Rafael:hRKhwJw97AkmJLmM@bloagapp.kikv6.mongodb.net/Bloagapp?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        useFindAndModify: false }).then(() => {
            console.log('Conectado com sucesso ao MongoDb')
        }).catch((err) => {
            console.log(err)
        })

    //? Public
        app.use(express.static('public'))

//! Rotas
    app.use('/admin', admin)
    app.use("/postagem", postagens)
    app.use('/usuarios', usuario)
    app.get('/' , (req,res)=>{
        const Data = new Date()
        
        Postagem.find().where('datapublicada').lt(Data.toISOString()).lean().sort({datapublicada:"desc"}).limit(5).then(postagens=>{
            res.render("index", {postagens:postagens})
        }).catch((err)=>{
            req.flash("error_msg", err)
            res.redirect('/404')
        })
    })
    app.get('/404',(req,res)=>{
        res.send('Error 404!')
    })
   
    app.get('/*', (req,res) => {
        res.render('pagenotfound')
    })

//! Outros
const PORTA = process.env.PORT || 8081
app.listen(PORTA, () => {
    console.log(`Servidor rodando em https://localhost:${PORTA} !`)
})