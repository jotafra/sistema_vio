-- Crianção de functions
delimiter //
create function calcula_idade(datanascimento date)
returns int
deterministic
contains sql
begin
    declare idade int;
    set idade = timestampdiff(year,datanascimento,curdate());
    return idade;
end; //
delimiter ;

select calcula_idade('1997-02-03');
select name as Nome, calcula_idade(data_nascimento) as Idade from usuario;

-- verifica se a função especificada foi criada
show create function calcula_idade;

delimiter //
create function status_sistema()
returns varchar(50)
no sql
begin
    return 'Sistema Operando normalmente';
end; //

delimiter ;
select status_sistema();


delimiter //
create function total_compras_usuario(id_usuario int)
returns int
reads sql data
begin
    declare total int;
    select count(*) into total from compra where id_usuario = compra.fk_id_usuario;
    return total;
end; //

delimiter ;
select total_compras_usuario(1) as "Total de Compras";

-- Tabela para testa a clausula modifes sql data
create table log_evento (
    id_log int AUTO_INCREMENT PRIMARY KEY,
    mensagem varchar(50),
    data_log datetime DEFAULT current_timestamp
)

delimiter //
create function registrar_log_evento(texto varchar(255))
returns varchar(50)
not deterministic
modifies sql data
begin
    insert into log_evento(mensagem) values(texto);
    return 'Log registrado com sucesso';
end; //

delimiter ;

SHOW CREATE FUNCTION registrar_log_evento;

DROP FUNCTION registrar_log_evento;

-- Visualiza o estado da variável de controle para permissões de criação de funções 

show variables like 'log_bin_trust_function_creators';

-- altera a variável global do MySQL
-- precisa ter permissão de administrador do banco 

set global log_bin_trust_function_creators = 1;

select registrar_log_evento('teste');


delimiter $$
create function mensagem_boas_vindas(nome_usuario varchar(100))
returns varchar(255)
deterministic
contains sql
begin  
    declare msg varchar(255);
    set msg = concat('Olá ', nome_usuario, '! Seja bem-vindo(a) ao sistema VIO.');
    return msg;
end $$ 
delimiter ;

select mensagem_boas_vindas("Seu nome");


select routine_name from information_schema.routines 
where routine_type = 'FUNCTION' and routine_schema = 'vio_joao';

-- Maior idade 

delimiter $$

create function is_maior_idade(data_nascimento date)
returns boolean 
not deterministic 
contains sql 
begin 
    declare idade int;

    -- utilizando a função já criada 
    set idade = calcula_idade(data_nascimento);
    return idade >= 18;
end; $$

delimiter ;


--  Categorizar usuários por faixa etária 

delimiter $$

create function faixa_etaria(data_nascimento date)
returns varchar(20)
not deterministic 
contains sql 
begin 
    declare idade int;

    --  Calculo da idade com a função já criada 
    set idade = calcula_idade(data_nascimento);

    if idade < 18 then 
        return "menor de idade";
    else if idade < 60 then 
        return "Adulto";
    else 
        return "idoso";

    end if;

end; $$

delimiter ;

-- agrupar usuarios por faixa etaria 

select faixa_etaria(data_nascimento) as faixa, count(*) as quantidade from usuario group by faixa;

-- identificar uma faixa etária especifica 

select name from usuario 
    where faixa_etaria(data_nascimento) = "idoso";

-- Calcular a média de idade de usuários cadastrados cadastrados 

delimiter $$

create function media_idade()
returns decimal (5,2)
not deterministic 
reads sql data
begin 
    declare media decimal(5,2);

    -- Cálculo da média das idades 
    select avg(timestampdiff(year, data_nascimento, curdate())) into media from usuario;

    return ifnull(media, 0);
end; $$

delimiter ;


-- selecionar idade especifica 

select "A média de idade dos clientes é maior que 30" as resultado where media_idade() > 30;


-- Exercicio direcionado 

-- Calculo do total gasto por um usuário 

delimiter $$

create function calcula_total_gasto(pid_usuario int)
returns decimal(10,2)
not deterministic
reads sql data
begin 
    declare total decimal(10,2);

    select sum(i.preco * ic.quantidade) into total 
    from compra c 
    join ingresso_compra ic on c.id_compra = ic.fk_id_compra
    join ingresso i on i.id.ingresso = ic.fk_id_ingresso
    where c.fk_id_usuario = pid_usuario;

    return ifnull(total, 0);

end; $$
delimiter ;

-- Buscar faixa etária de um usuário 

delimiter $$

create function buscar_faixa_etaria_usuario(pid int)
returns varchar(20)
not deterministic
reads sql data
begin 
    declare nascimento date;
    declare faixa varchar(20);

    select data_nascimento into nascimento from usuario where id_usuario = pid;

    set faixa = faixa_etaria(nascimento);

    return faixa;

end; $$

delimiter ;












