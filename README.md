# Oma DiaBalance-back

# Backendin Alustusohjeet (Node.js + Express)

💡 Tämä ohje auttaa sinua luomaan Node.js-pohjaisen backend-projektin, joka on yhdistetty GitHub-repositoryyn ja sisältää Express-palvelimen.

---

## Luo GitHub-repository  
1. Mene osoitteeseen **[GitHub](https://github.com)**  
2. Klikkaa **New repository**  
3. Anna nimi esim. `Oma-DiaBalance-Back`  
4. **Valitse `Private` tai `Public`**  
5. **Valitse `Add a README file`** 
6. **Valitse `.gitignore` ja valitse sieltä `Node`** 
7. **Älä valitse lisenssiä**  
8. Paina **Create repository**  
9. Kopioi repositoryn URL

---

## Kloonaa repository koneellesi  
1. Avaa **Visual Studio Code (VS Code)**  
2. Avaa terminaali (`Ctrl + ö` Windowsissa, `Cmd + J` Macissa)  tai gitbash
3. Siirry kansioon, johon haluat kloonata projektin:  
   ```
   cd ~/Desktop/developer  # Tai muu haluamasi sijainti
   ```
4. **Kloonaa repository**  
   ```
   git clone <GITHUB_REPO_URL>
   ```
   Esim.:  
   ```
   git clone https://github.com/kayttaja/Oma-DiaBalance-Back.git
   ```
5. Siirry kloonattuun kansioon:  
   ```
   cd Oma-DiaBalance-Back
   ```

---

## Alusta projekti (`npm init -y`)
1. Aja seuraava komento, joka luo `package.json`-tiedoston:
   ```
   npm init -y
   ```
   
---

## Asenna tarvittavat paketit  
1. **Asenna ESLint ja Prettier**:
   ```
   npm install --save-dev --save-exact prettier
   npm install --save-dev eslint @eslint/js eslint-config-prettier globals
   ```
2. **Luo ESLint-konfiguraatiotiedosto `eslint.config.js`**  
   Lisää seuraava sisältö:
   ```js
   import globals from 'globals';
   import js from '@eslint/js';

   export default [
     {
       languageOptions: {
         ecmaVersion: 2021,
         sourceType: 'module',
         globals: {...globals.node},
       },
     },
     js.configs.recommended,
   ];
   ```
3. **Luo Prettier-konfiguraatiotiedosto `.prettierrc.cjs`**  
   Lisää seuraava sisältö:
   ```js
   module.exports = {
     semi: true,
     singleQuote: true,
     bracketSpacing: false,
     trailingComma: 'all',
   };
   ```
4. **Asenna nodemon kehityskäyttöön:**  
   ```bash
   npm install --save-dev nodemon
   ```

---

## Lisää skriptit `package.json`-tiedostoon  
Avaa `package.json` ja lisää "scripts"-osioon seuraavat rivit:
```json
"scripts": {
  "dev": "nodemon src/index.js",
  "start": "node src/index.js",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

---

## Lisää `.gitignore`-tiedostoon tarvittavat säännöt  
Jos `.gitignore` ei ole valmiina, luo tiedosto ja lisää:
```gitignore
node_modules/
.env
.DS_Store
```

---

## 7️⃣ Luo projektin perusrakenne  
Luo juureen `src`-kansio ja sen sisälle `index.js`-tiedosto:

Lisää `index.js`-tiedostoon seuraava Express-palvelin:
```js
import express from 'express';

const hostname = 'localhost';
const app = express();
const port = 3000;

// Perus reitti
app.get('/', (req, res) => {
  res.send('Welcome to my REST API!, tämä on Suvin oma backend kokeilu');
});

// Käynnistetään palvelin
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
```

---

## Lisää ja commitoi muutokset Gitiin  
Lisää kaikki tiedostot versionhallintaan:
```bash
git add .
```
Tee commit:
```bash
git commit -m "Alustettu backend-projekti"
```
Pushaa muutokset GitHubiin:
```bash
git push origin main
```

---

## Käynnistä kehitysympäristö  
Aja palvelin kehitystilassa:
```bash
npm run dev
```

Nyt palvelimesi pyörii osoitteessa:
```bash
http://localhost:3000/
```

---

**Onneksi olkoon!** Backend-palvelimesi on nyt alustettu ja käynnissä.

## Aletaan tekemään tietokantaa ja tietokanta tauluja
Asenna paketit
```bash
npm run install mysql2 dotenv
```

Luo kansio db ja sen sisälle tietokantasi nimi esim `diabalance.sql`

Luo kansio utils jonka sisään tiedosto `database.js`
laita sinne sisälle
```javascript
import mysql from 'mysql2';
import 'dotenv/config';
const pool = mysql.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0,
});
const promisePool = pool.promise();
export default promisePool;
```

* **Luo** `.env`-tiedosto ja lisää tietokantayhteydet, lisää kohtiin omat tietosi:

```
DB_HOST=localhost 
DB_USER=root
DB_PASSWORD=salasana
DB_NAME=tietokantasi nimi
```
**HUOM** Laita `.env` tiedosto `.gitignore` tiedostoon

Kun tietokantatalut on luotu `.sql` kansioon, niin voit käynnistää tietokannan. kopio polku mySQL terminaaliin. Laita source <ja tähän polku>
Nyt voit katsoa tuliko tietokanta:
```SQL
show databases;
```
```SQL
desc potila_hoitaja;
```

# CONSTRAINT selitettynä yksinkertaisesti

CONSTRAINT (rajoite) on SQL-tietokannoissa sääntö, joka varmistaa tietojen oikeellisuuden ja eheyden. Se on kuin vartija, joka tarkistaa, että kaikki tietokantaan menevä tai sieltä muuttuva tieto noudattaa tiettyjä sääntöjä.

## Eri CONSTRAINT-tyypit:

1. **PRIMARY KEY** - Määrittelee taulun pääavaimen, jonka avulla jokainen rivi voidaan yksilöidä.
   ```sql
   PRIMARY KEY (kayttaja_id)
   ```

2. **FOREIGN KEY** - Luo yhteyden kahden taulun välille ja varmistaa viite-eheyden.
   ```sql
   FOREIGN KEY (kayttaja_id) REFERENCES user(kayttaja_id)
   ```

3. **UNIQUE** - Varmistaa, että kentän arvot ovat ainutlaatuisia.
   ```sql
   UNIQUE (kayttajanimi)
   ```

4. **NOT NULL** - Varmistaa, että kenttä ei voi olla tyhjä.
   ```sql
   kayttajanimi VARCHAR(40) NOT NULL
   ```

5. **CHECK** - Tarkistaa, että kenttä täyttää tietyn ehdon.
   ```sql
   CHECK (kayttajarooli IN (1, 2))
   ```

## Nimetyn ja nimettömän CONSTRAINT:n ero:

Kun määrittelet viiteavaimen (FOREIGN KEY), voit tehdä sen kahdella tavalla:

### 1. Nimetön CONSTRAINT:
```sql
FOREIGN KEY (kayttaja_id) REFERENCES user(kayttaja_id)
```

### 2. Nimetty CONSTRAINT:
```sql
CONSTRAINT FK_kirjaus_kayttaja FOREIGN KEY (kayttaja_id) REFERENCES user(kayttaja_id)
```

**Ero on siinä, että**:
- Nimetyssä versiossa annat rajoitteelle nimen (FK_kirjaus_kayttaja)
- Nimettömässä versiossa tietokantajärjestelmä luo automaattisesti nimen

## Käytännön hyödyt nimetystä CONSTRAINT:sta:

1. **Selkeämmät virheilmoitukset**: Jos yrität lisätä rivin, joka rikkoo rajoitetta, virheilmoituksessa näkyy rajoitteen nimi.

2. **Helpompi muokkaaminen**: Jos haluat myöhemmin muokata tai poistaa rajoitetta, voit viitata siihen suoraan nimellä:
   ```sql
   ALTER TABLE kirjaus DROP CONSTRAINT FK_kirjaus_kayttaja;
   ```

3. **Dokumentaatio**: Nimi kertoo, mitä rajoite tekee ja mihin tauluihin se liittyy.

## Esimerkki virheilmoituksesta:

**Nimetty CONSTRAINT**:
```
Error: Violation of CONSTRAINT 'FK_kirjaus_kayttaja': Cannot add entry for patient ID 123 because the user does not exist
```

**Nimetön CONSTRAINT**:
```
Error: Violation of FOREIGN KEY constraint on table 'kirjaus': Cannot add entry...
```

Molemmat tavat tekevät teknisesti täsmälleen saman asian tietokannassa, mutta nimetty versio helpottaa ylläpitoa ja virheiden selvittelyä, erityisesti kun tietokanta kasvaa suuremmaksi.



## DiaBalance Backend – Käyttäjähallinnan toteutus

### Autentikointi

- **Rekisteröityminen**: POST /api/users
  - Validointi: käyttäjänimi & salasana
  - Salasanan hashays bcryptillä

- **Kirjautuminen**: POST /api/users/login
  - Varmistaa käyttäjänimen ja salasanan oikeellisuuden
  - Palauttaa JWT-tokenin
  - Tokenin voimassaoloaika: 24h (`JWT_EXPIRES_IN`)

- **Uloskirjautuminen**
  - Hoidetaan frontendissä poistamalla token (`localStorage.removeItem('token')`)

---

### Auktorisointi

- **Tokenin tarkistus**: `authenticateToken` middleware
- **Roolien tarkistus**
  - `kayttajarooli`: 1 (diabeetikko), 2 (hoidonseuraaja), 3 (ylläpitäjä)
  - Oikeuksien tarkistus eri reiteissä roolin perusteella
  - Esimerkiksi:
    - käyttäjä voi muokata vain omaa profiilia
    - ylläpitäjä voi poistaa kenen tahansa tilin

---

### Käyttäjäprofiili

- **GET /api/users/:id** – hakee käyttäjän tiedot
- **PUT /api/users/:id** – muokkaa käyttäjän tietoja (vain oma tai jos rooli = 2)
- **DELETE /api/users/:id** – poistaa käyttäjän tilin (oma tai ylläpitäjä)
- **Salasanan vaihto** onnistuu samalla reitillä (hashataan uudelleen)

---

### Token

- JWT luodaan kirjautuessa
- Token sisältää:
  - `kayttaja_id`
  - `kayttajarooli`
- Vanhenee automaattisesti 24h kuluttua
- Ei refresh token -järjestelmää tällä hetkellä

---
**Tietokantarakenne ja -yhteys on tehty ja testattu toimivaksi. Backend-rajapinta tukee CRUD-toimintoja käyttäjille ja käyttää suoraan tietokantaa mallien kautta.**

