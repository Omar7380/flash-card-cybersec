const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'votre-secret-super-securise-' + Math.random(),
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // true en HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
}));

// Identifiants hashés (SHA-256) - depuis variables d'environnement
const CREDENTIALS = {
    username: process.env.USERNAME || 'omarkikou',
    passwordHash: process.env.PASSWORD_HASH || crypto.createHash('sha256').update('kikou123').digest('hex')
};

// Middleware pour vérifier l'authentification
function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Non autorisé' });
    }
}

// Route de login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Identifiants manquants' });
    }
    
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    
    if (username === CREDENTIALS.username && passwordHash === CREDENTIALS.passwordHash) {
        req.session.authenticated = true;
        req.session.username = username;
        res.json({ success: true, message: 'Connexion réussie' });
    } else {
        res.status(401).json({ error: 'Identifiants incorrects' });
    }
});

// Route de logout
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
        }
        res.json({ success: true, message: 'Déconnexion réussie' });
    });
});

// Route pour vérifier l'authentification
app.get('/api/check-auth', (req, res) => {
    if (req.session && req.session.authenticated) {
        res.json({ authenticated: true, username: req.session.username });
    } else {
        res.json({ authenticated: false });
    }
});

// Route protégée pour index.html
app.get('/index.html', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route par défaut
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📚 Accédez à votre application sur http://localhost:${PORT}`);
});
