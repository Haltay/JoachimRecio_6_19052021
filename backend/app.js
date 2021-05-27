
const express = require('express'); // utilisation de express
const bodyParser = require('body-parser'); // utilisation de body parser pour transformer le corps de la requete en json
const mongoose = require('mongoose'); // utilisation du serveur MongoDb
const helmet = require('helmet'); // Pour la securité (en configurant de manière adéquate les en-têtes HTTP)
const path = require('path');

const sauceRoutes = require('./routes/sauces');        // importation de router
const userRoutes = require('./routes/user');

require('dotenv').config()  // Stockage du mot de passe en dans un autre environnement

const app = express();

// Connexion à MongoDB
const mongodbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongodbUrl,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Sécurité CORS (Cross Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Utilisation de Helmet
app.use(helmet());

// utilisation de body parser pour création d'un nouvel objet
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;