const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');

const serverConfig = require('./config');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const app = express();

/* configuration de la base de données MongoDB Atlas */

mongoose.connect('mongodb+srv://' + serverConfig.DB_LOGIN + ':' + serverConfig.DB_PASSWORD + '@' + serverConfig.DB_URL + '/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !'+ error));

/* Configuration des headers pour le navigateur */

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;