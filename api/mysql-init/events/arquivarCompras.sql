
create event if not exists arquivar_compras_antigas
    on schedule every 1 day
    starts current_timestamp + interval 1 day 
    on completion preserve
    enable 
do
    insert into historico_compra(id_compra, data_compra, id_usuario)
    select id_compra, data_compra, fk_id_usuario from compra where data_compra < now() - interval 6 month; 


CREATE TABLE `historico_compra`(
    `id_historico` int NOT NULL AUTO_INCREMENT,
    `id_compra` int NOT NULL,
    `data_compra` datetime NOT NULL,
    `id_usuario` int NOT NULL,
    `data_exclusao` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_historico`)
);