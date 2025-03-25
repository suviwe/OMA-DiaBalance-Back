
-- source C:\Users\suviw\Desktop\developer\OMA-DiaBalance-Back\db\diabalance.sql

DROP DATABASE IF EXISTS diabalance_db;
CREATE DATABASE diabalance_db;
USE diabalance_db;

-- Käyttäjätaulu
CREATE TABLE user (
    kayttaja_id INT(10) AUTO_INCREMENT PRIMARY KEY,
    kayttajanimi VARCHAR(40) NOT NULL,
    salasana VARCHAR(60) NOT NULL,
    kayttajarooli INT(1) NOT NULL
);

-- Kirjaustaulu (mittaustiedot)
CREATE TABLE kirjaus (
    pvm DATE NOT NULL,
    kayttaja_id INT(10) NOT NULL,
    hrv_data VARCHAR(21844),
    vs_aamu DECIMAL(3, 1),
    vs_ilta DECIMAL(3, 1),
    vs_aamupala_ennen DECIMAL(3, 1),
    vs_aamupala_jalkeen DECIMAL(3, 1),
    vs_lounas_ennen DECIMAL(3, 1),
    vs_lounas_jalkeen DECIMAL(3, 1),
    vs_valipala_ennen DECIMAL(3, 1),
    vs_valipala_jalkeen DECIMAL(3, 1),
    vs_paivallinen_ennen DECIMAL(3, 1),
    vs_paivallinen_jalkeen DECIMAL(3, 1),
    vs_iltapala_ennen DECIMAL(3, 1),
    vs_iltapala_jalkeen DECIMAL(3, 1),
    oireet VARCHAR(200),
    kommentti VARCHAR(500),
    PRIMARY KEY (pvm, kayttaja_id),
    CONSTRAINT FK_kirjaus_kayttaja FOREIGN KEY (kayttaja_id) REFERENCES user(kayttaja_id)
);

-- Potilas-hoitaja suhdetaulu
CREATE TABLE potilas_hoitaja (
    hoidonseuraaja INT(10) NOT NULL,
    potilas INT(10) NOT NULL,
    PRIMARY KEY (hoidonseuraaja, potilas),
    CONSTRAINT FK1_potilas_hoitaja FOREIGN KEY (hoidonseuraaja) REFERENCES user(kayttaja_id),
    CONSTRAINT FK2_potilas_hoitaja FOREIGN KEY (potilas) REFERENCES user(kayttaja_id)
);

-- Ajanvaraustaulu
CREATE TABLE ajanvaraus (
    hoidonseuraaja INT(10) NOT NULL,
    potilas INT(10) NOT NULL,
    ajanvaraus_pvm DATE NOT NULL,
    ajanvaraus_aloitus TIME,
    ajanvaraus_lopetus TIME,
    PRIMARY KEY (hoidonseuraaja, potilas, ajanvaraus_pvm),
    CONSTRAINT FK1_ajanvaraus FOREIGN KEY (hoidonseuraaja) REFERENCES user(kayttaja_id),
    CONSTRAINT FK2_ajanvaraus FOREIGN KEY (potilas) REFERENCES user(kayttaja_id)
);

-- Lisätään testikäyttäjät (1 potilas, 1 hoidonseuraaja)
-- Salasana 'potilas123' hashattu versio
INSERT INTO user (kayttajanimi, salasana, kayttajarooli) 
VALUES ('testipotilas', '$2y$10$abcdefghijklmnopqrstu.vwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 1);

-- Salasana 'hoitaja123' hashattu versio
INSERT INTO user (kayttajanimi, salasana, kayttajarooli) 
VALUES ('testihoitaja', '$2y$10$abcdefghijklmnopqrstu.vwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 2);

-- Luodaan potilas-hoitaja suhde
-- Oletetaan että potilas sai ID:n 1 ja hoitaja ID:n 2
INSERT INTO potilas_hoitaja (hoidonseuraaja, potilas) 
VALUES (2, 1);

-- Lisätään yksi kirjaus potilaan mittaustiedoista
INSERT INTO kirjaus (pvm, kayttaja_id, vs_aamu, vs_ilta, oireet, kommentti) 
VALUES ('2025-03-25', 1, 7.2, 6.8, 'Hieman väsymystä', 'Päivä sujui muuten hyvin');

-- Lisätään yksi ajanvaraus
INSERT INTO ajanvaraus (hoidonseuraaja, potilas, ajanvaraus_pvm, ajanvaraus_aloitus, ajanvaraus_lopetus) 
VALUES (2, 1, '2025-04-15', '13:00:00', '13:30:00');