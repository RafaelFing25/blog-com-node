const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const admin = require("./routes/admin")
const categoria = require('./routes/categoria')
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash')
const moment = require('moment');




// ! Configuraçoes
    //? sessão
        app.use(session({
            secret: "qualquercoisa",
            resave: true,
            saveUninitialized: true
        })) 
        app.use(flash())
    //? middlewares
        app.use((req,res, next) =>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            next()
        } )
    //? Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //? Handlebars
        app.engine('handlebars', handlebars({
            defaultLayout: 'main',
            helpers: {
                formatDate: (date) => {
                    return moment(date).format('DD/MM/YYYY')
                }
            }
             }))
        app.set('view engine', 'handlebars')
    //? Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost/blogapp', {
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
    app.use('/categoria', categoria)
    app.get('/*', (req,res) => {
        res.render('pagenotfound')
    })

//! Outros
const PORTA = 8081
app.listen(PORTA, () => {
    console.log(`Servidor rodando em https://localhost:${PORTA} !`)
})