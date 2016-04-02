CREATE DATABASE IF NOT EXISTS nonescaping;
USE nonescaping;
DROP TABLE IF EXISTS users;
CREATE TABLE users ( id INT NOT NULL, username VARCHAR(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, serial VARCHAR(19) NOT NULL, license_key VARCHAR(50) NOT NULL, PRIMARY KEY (id) );

INSERT INTO users (username, serial, license_key) VALUES ('Василий Петров', '885fae565c86d81fb3b', 'QCTF_885fae565c86d81fb3beb4bba39833ba')