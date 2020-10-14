const Setor = require('../models/setor');

module.exports = {

    async listagem(req, res){

       await Setor.findAll().then((setores)=>{
           res.render('setores', {setores: setores});
        })
    }

}