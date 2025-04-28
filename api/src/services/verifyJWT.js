// Importando o módulo 'jsonwebtoken' para trabalhar com JWT (JSON Web Token)
const jwt = require("jsonwebtoken");

// Função middleware para verificar se o token JWT fornecido é válido
function verifyJWT(req, res, next) {
    // Pegando o token do cabeçalho "Authorization" da requisição
    const token = req.headers["authorization"];

    // Verificando se o token não foi fornecido
    if (!token) {
        // Se o token não foi enviado, retorna uma resposta de erro (401 Unauthorized)
        return res.status(401).json({
            auth: false, // Indicando que a autenticação falhou
            message: "Token não foi fornecido" // Mensagem explicando o erro
        });
    }

    // Verificando o token usando a chave secreta armazenada nas variáveis de ambiente (process.env.SECRET)
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        // Caso haja erro na verificação (por exemplo, o token é inválido ou expirou)
        if (err) {
            // Retorna uma resposta de erro (403 Forbidden)
            return res.status(403).json({
                auth: false, // Indicando que a autenticação falhou
                message: "Falha na autenticação do Token" // Mensagem explicando o erro
            });
        }

        // Se o token for válido, decodificamos ele e pegamos o ID do usuário (assumindo que o token contém o campo 'id')
        req.userId = decoded.id;

        // Chama a próxima função/middleware na cadeia de execução (permitindo que a requisição prossiga)
        next();
    });
}

// Exportando o middleware para ser usado em outras partes do código
module.exports = verifyJWT;
