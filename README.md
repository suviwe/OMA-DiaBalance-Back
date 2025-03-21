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

## 9️⃣ Käynnistä kehitysympäristö  
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

