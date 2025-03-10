const connect = require("../db/connect");

module.exports = async function validadeCpf(cpf, userId){
    const query = "SELECT id_usuario FROM usuario WHERE cpf = ? ";
    const values = [cpf];

    connect.query(query, values, (err, results)=>{
        if(err){
            // Fazer algo
        }
        else if( results.lenght > 0){
            const idDoCpfCadastrado = results[0].id_usuario;

            if(userId && idDoCpfCadastrado !== userId){
                return{ error:"CPF já cadastrado para outro usuário"}
            }else if(!userId){
                return{error: "CPF já cadastrado"}
            }             
        }
        else{
            return null;
        }
    })
};