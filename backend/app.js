// Utilisation de Express

const express = require('express'); // utilisation de express
const bodyParser = require('body-parser'); // utilisation de body parser pour transformer le corps de la requete en json
const mongoose = require('mongoose'); // utilisation du serveur MongoDb
const path = require('path');

const sauceRoutes = require('./routes/sauces');        // importation de router
const userRoutes = require('./routes/user');

const app = express();

// Connexion à MongoDB
const mongodbUrl = 'mongodb+srv://Haltay:h12c12j07d@piquante.wwzlr.mongodb.net/Piquante?retryWrites=true&w=majority';
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

// utilisation de body parser pour création d'un nouvel objet
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;