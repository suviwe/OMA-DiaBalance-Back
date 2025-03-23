
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
    hoidonseujaaja INT(10) NOT NULL,
    potilas INT(10) NOT NULL,
    PRIMARY KEY (hoidonseujaaja, potilas),
    CONSTRAINT FK1_potilas_hoitaja FOREIGN KEY (hoidonseujaaja) REFERENCES user(kayttaja_id),
    CONSTRAINT FK2_potilas_hoitaja FOREIGN KEY (potilas) REFERENCES user(kayttaja_id)
);

-- Ajanvaraustaulu
CREATE TABLE ajanvaraus (
    hoidonseujaaja INT(10) NOT NULL,
    potilas INT(10) NOT NULL,
    ajanvaraus_pvm DATE NOT NULL,
    ajanvaraus_aloitus TIME,
    ajanvaraus_lopetus TIME,
    PRIMARY KEY (hoidonseujaaja, potilas, ajanvaraus_pvm),
    CONSTRAINT FK1_ajanvaraus FOREIGN KEY (hoidonseujaaja) REFERENCES user(kayttaja_id),
    CONSTRAINT FK2_ajanvaraus FOREIGN KEY (potilas) REFERENCES user(kayttaja_id)
);