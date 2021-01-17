module.exports = {
    eAdmin: function(req,res,next){
        if(req.isAuthenticated() ){
            if(req.user.eAdmin){
                
                return next()
            }else{
                req.flash('error_msg',"Você deve ser admin para entrar aqui")
                res.redirect("/")
            }
        }else{
            req.flash("error_msg","Você deve estar logado")
            res.redirect("/")
        }
    }
}