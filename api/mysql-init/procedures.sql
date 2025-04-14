delimiter // 

create procedure registrar_compra(
    in p_id_usuario int,
    in p_id_ingresso int,
    in p_quantidade int 
)
begin
    declare v_id_compra int;

    -- Criar registro na tabela 'compra'
    insert into compra ( data_compra, fk_id_usuario)
    values (now(), p_id_usuario);

    -- Obter o ID da compra recem-criada 
    set v_id_compra = last_insert_id();

    insert into ingresso_compra (fk_id_compra, fk_id_ingresso, quantidade)

    values (v_id_compra, p_id_ingresso, p_quantidade);

end; //

delimiter;

delimiter //

create procedure total_ingressos_usuario(
    in p_id_usuario int,
    out p_total_ingressos int 
)

begin 
    -- Inicializar o valor de saída 
    set p_total_ingressos = 0;

    -- Consultar e somar todos os ingressos comprados pelo usuário 
    select coalesce(sum(ic.quantidade), 0)
    into p_total_ingressos
    from ingresso_compra ic
    join compra c on ic.fk_id_compra = c.id_compra 
    where c.fk_id_usuario = p_id_usuario;
end; //

delimiter // 

show procedure status where db = 'vio_joao';

set @total = 0;

call total_ingressos_usuario (2, @total);

delimiter //

create procedure registrar_presenca(
    in p_id_compra int,
    in p_id_evento int
)
begin 
    -- Registrar presença 
    insert into presenca (data_hora_checkin, fk_id_evento, fk_id_compra)
    values (now(), p_id_evento, p_id_compra);
end //

delimiter;

call registrar_presenca(1, 3);


-- Procedure para resumo do usuário 

delimiter $$

create procedure resumo_usuario(in pid int)
begin 
    declare nome varchar(100);
    declare email varchar(100);
    declare totalrs decimal(10,2);
    declare faixa varchar(20);

    -- Busca o nome e o email do usuário 
    select u.name, u.email into nome, email
    from usuario u 
    where u.id_usuario = 1;

    -- Chamada das funções especificas já criadas

    set totalrs = calcula_total_gasto(pid);
    set faixa = buscar_faixa_etaria_usuario(pid);

    -- Exibe os dados formatados 
    select nome as nome_usuario,
        email as email_usuario, 
        total as total_gasto,
        faixa as faixa_etaria;

end; $$

delimiter ;



-- -=-=-=-=-=-=-=-=-=-=-=-=-=- Atividade 14/04 -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

-- mostrar ingressos vendidos por evento 
delimiter $$

create function total_ingressos_vendidos(id_evento int) 
returns int
deterministic
begin
    declare total int;
    select ifnull(sum(ic.quantidade), 0) into total
    from ingresso i
    join ingresso_compra ic on i.id_ingresso = ic.fk_id_ingresso
    where i.fk_id_evento = id_evento;
    return total;
end $$

delimiter ;

-- renda do evento, quantidade de ingressos * preço do ingresso, se for null ele retorna como 0.00
delimiter $$

create function renda_total_evento(id_evento int)
returns decimal(10,2)
deterministic
begin
    declare total decimal(10,2);
    select ifnull(sum(i.preco * ic.quantidade), 0.00) into total
    from ingresso i
    join ingresso_compra ic on i.id_ingresso = ic.fk_id_ingresso
    where i.fk_id_evento = id_evento;
    return total;
end $$

delimiter ;

-- retorna todos os dados do evento com base nas tabelas 
delimiter $$

create procedure resumo_evento(in id_evento int)
begin
    declare nome_evento varchar(100);
    declare data_evento datetime;
    declare total_vendidos int;
    declare renda_total decimal(10,2);

    -- busca informações básicas do evento
    select nome, data_hora
    into nome_evento, data_evento
    from evento
    where evento.id_evento = id_evento;

    -- usa as funções para calcular ingressos e renda
    set total_vendidos = total_ingressos_vendidos(id_evento);
    set renda_total = renda_total_evento(id_evento);

    -- exibe o resumo formatado
    select 
        nome_evento as nome,
        data_evento as data_hora,
        total_vendidos as ingressos_vendidos,
        renda_total as renda_total;
end $$

delimiter ;


