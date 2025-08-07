CREATE DATABASE IF NOT EXISTS fullcycle_db;

USE fullcycle_db;

CREATE TABLE IF NOT EXISTS people(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255), PRIMARY KEY(id)
);

INSERT INTO people(name) VALUES("Uder Assis [_Dumpado_]");
