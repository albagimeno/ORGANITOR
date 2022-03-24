CREATE DATABASE `data_web` CHARACTER SET utf8 COLLATE utf8_spanish_ci;
USE data_web;
-- tabla de usuarios

CREATE TABLE `user` (
	`id_user` INT(5) zerofill NOT NULL AUTO_INCREMENT,
	`user_name` VARCHAR(8) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
	`name` VARCHAR(20) NOT NULL,
	`mail` VARCHAR(55) NOT NULL,
	`password` VARCHAR(80) NOT NULL,
	`phone_number` VARCHAR(10) DEFAULT NULL,
	`first_surname` VARCHAR(20) NOT NULL,
	`second_surname` VARCHAR(20),
	UNIQUE KEY `identifier` (`id_user`) USING BTREE,
	PRIMARY KEY (`id_user`)
);
-- CREATE TABLE `user`( `id_user` INT(5) zerofill NOT NULL AUTO_INCREMENT, `user_name` VARCHAR(8) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL, `name` VARCHAR(20) NOT NULL, `mail` VARCHAR(55) NOT NULL, `password` VARCHAR(80) NOT NULL, `phone_number` VARCHAR(10) DEFAULT NULL, `first_surname` VARCHAR(20) NOT NULL, `second_surname` VARCHAR(20), UNIQUE KEY `identifier`(`id_user`) USING BTREE, PRIMARY KEY(`id_user`));

