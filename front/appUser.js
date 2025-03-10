//Chamada da função createUser para a associação ao evento de envio a formulário
document.getElementById("formulario-registro").addEventListener("submit", createUser);

document.addEventListener("DOMContentLoaded", getAllUsers)

document.addEventListener("DOMContentLoaded", getAllUsersTable)

document.addEventListener("DOMContentLoaded", getAllOrgsTable)  


function createUser(event) {
  //Previne o comportamento padrao do formulario, ou seja, impede que ele seja enviado e recarregue a pagona
  event.preventDefault();

  //Captura os valores dos campos do formularios
  const name = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("senha").value;
  const data_nascimento = document.getElementById("data").value;

  //Requisição HTTP para o endpoint de cadastro de usuario
  fetch("http:10.89.240.14:5000/api/v1/user", {
    //Realiza uma chamada http para o servidor(a rota definida)
    method: "POST",
    headers: {
      //A requisição será em formato json
      "Content-Type": "application/json",
    },
    //Transforma os dados do formulario de uma string json para serem enviados no corpo da req
    body: JSON.stringify({ name, cpf, email, password, data_nascimento }),
  })
    .then((response) => {
      //Tratamento da resposta do servidor / API
      if (response.ok) {
        //verifica se a resposta foi bem sucedida (status 2xx(duzentos e alguma coisa))
        return response.json();
      }
      //Convertendo o erro em formato JSON
      return response.json().then((err) => {
        //Mensagem retornada do servidor acessada pela chave "error"
        throw new Error(err.error);
      });
    }) //Fechamento da then(response)
    .then((data) => {
      //executa a resposta de sucesso - retorna ao usuario final

      //Exibe um alerta para o usuario final (front) com o nome que acabou de ser cadastrado
      alert(data.message);
      console.log(data.message);

      //Reseta os campos do formulario após o sucesso do cadastro
      document.getElementById("formulario-registro").reset();
    })
    .catch((error) => {
      //Captura qualquer erro que ocorra durante o processo de requisição / resposta

      //Exibe alerta (front) com o erro processado
      alert("Erro no cadastro: " + error.message);
      console.error("Erro:", error.message);
    });
} //Fechamento createUser

function getAllUsers(){
  fetch("http:10.89.240.14:5000/api/v1/user/",{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => {
      if(response.ok) {
        return response.json();
      }
      return response.json().then((err) => {
        throw new Error(err.error);
      });
    })
      .then((data) => {
        const userList = document.getElementById("user-list");
        userList.innerHTML = ""; //Limpa a lista existente

        data.users.forEach((user)=>{
          const listItem = document.createElement("li");
          listItem.textContent = `Nome: ${user.name},
          CPF: ${user.cpf}, 
          Email ${user.email},
          Data de Nascimento ${user.data_nascimento}`
          userList.appendChild(listItem);
        })

      })
      .catch((error)=>{
        alert("Erro ao obter usuários: " + error.message);
        console.error("Erro: ", error.message);
      })
}

function getAllUsersTable(){
  fetch("http://10.89.240.14:5000/api/v1/user/",{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => {
      if(response.ok) {
        return response.json();
      }
      return response.json().then((err) => {
        throw new Error(err.error);
      });
    })
    .then((data) => {
      const userList = document.getElementById("user-list-table");
      //Limpa a lista antes de adicionar novos itens
      userList.innerHTML = "";

      //Verifica se há usuários retornados e os adiciona á tabela
      data.users.forEach((usuario) =>{
        //Cria uma nova linha
        const tr = document.createElement("tr");

        //cria célular para nome, cpf e email
        const tdName = document.createElement("td");
        tdName.textContent = usuario.name;
        tr.appendChild(tdName);

        const tdcpf = document.createElement("td");
        tdcpf.textContent = usuario.cpf;
        tr.appendChild(tdcpf);

        const tdEmail = document.createElement("td");
        tdEmail.textContent = usuario.email;
        tr.appendChild(tdEmail);

        const tdData_nascimento = document.createElement("td");
        tdData_nascimento.textContent = usuario.data_nascimento;
        tr.appendChild(tdData_nascimento);


        //Adiciona a linha á tabela
        userList.appendChild(tr);
      });
    })
    .catch((error) => {
      alert("Erro ao obter usuários: " + error.message);
      console.error("Erro: ", error.message);
    })
}

function getAllOrgsTable(){
  fetch("http://10.89.240.14:5000/api/v1/organizador",{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => {
      if(response.ok) {
        return response.json();
      }
      return response.json().then((err) => {
        throw new Error(err.error);
      });
    })
    .then((data) => {
      const orgList = document.getElementById("org-list-table");
      //Limpa a lista antes de adicionar novos itens
      orgList.innerHTML = "";

      //Verifica se há usuários retornados e os adiciona á tabela
      data.organizadores.forEach((organizadores) =>{
        //Cria uma nova linha
        const tr = document.createElement("tr");

        //cria célular para nome, cpf e email
        const tdNome = document.createElement("td");
        tdNome.textContent = organizadores.nome;
        tr.appendChild(tdNome);

        const tdtelefone = document.createElement("td");
        tdtelefone.textContent = organizadores.telefone;
        tr.appendChild(tdtelefone);

        const tdEmail = document.createElement("td");
        tdEmail.textContent = organizadores.email;
        tr.appendChild(tdEmail);


        //Adiciona a linha á tabela
        orgList.appendChild(tr);
      });
    })
    .catch((error) => {
      alert("Erro ao obter Organizadores: " + error.message);
      console.error("Erro: ", error.message);
    })
}