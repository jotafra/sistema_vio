//Chamada da função "TesteCalendario" para associação ao evento de envio do formulario
document.getElementById("form-selecao-data")
.addEventListener("submit", testeCalendario);

function testeCalendario(event){
    //Previne o comportamento padrão do formulario, ou seja, impede que ele seja enviado e recarregue a pagina
    event.preventDefault();

    const data_recebida = document.getElementById("data").value;


    if(data_recebida){
        alert("A data selecionada é: ")
    }
    else{
        alert("Por favor, selecione uma data!")
    }

    // console.log("Data recebida: ", data_recebida);
    alert("A data selecionada é: " + data_recebida);
}