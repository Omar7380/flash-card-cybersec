# FlashCards Sécurisé avec Node.js

## 🚀 Installation

1. **Installer Node.js** (si pas déjà fait) : https://nodejs.org/

2. **Installer les dépendances** :
```bash
npm install
```

## 🔐 Lancement du serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 📝 Identifiants

- **Identifiant** : `omarkikou`
- **Mot de passe** : `kikou123`

## 🌐 Déploiement sur Vercel

1. **Créer un fichier `vercel.json`** :
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

2. **Installer Vercel CLI** :
```bash
npm install -g vercel
```

3. **Déployer** :
```bash
vercel
```

## 🔒 Sécurité

✅ Identifiants **JAMAIS** envoyés au client
✅ Vérification côté serveur uniquement
✅ Sessions sécurisées avec express-session
✅ Hash SHA-256 des mots de passe
✅ Protection contre l'accès direct à index.html

## 📂 Structure

- `server.js` - Serveur Node.js avec authentification
- `login.html` - Page de connexion (frontend)
- `index.html` - FlashCards (protégé)
- `package.json` - Dépendances npm

## 🛠️ Changer les identifiants

Dans `server.js`, modifiez :
```javascript
const CREDENTIALS = {
    username: 'votre-nouveau-login',
    passwordHash: crypto.createHash('sha256').update('votre-nouveau-mdp').digest('hex')
};
```
