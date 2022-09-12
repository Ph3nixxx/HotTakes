Dans le fichier app.js, les identifiants MongoDB ont été cachés dans un fichier config.js, ajouté dans les exceptions de .gitignore.
Pour utiliser ce projet, il faudra alors créer un compte MongoDB ainsi qu'une base de données afin d'en ajouter les identifiants dans le fichier app.js ou de créer un nouveau fichier config.js dans le dossier "backend".
Infos requises :
    'serverConfig.DB_URL' : adresse indiquée dans la base de données MongoDB créée
    'serverConfig.DB_LOGIN': "identifiant du compte"
    'serverConfig.DB_PASSWORD': "mot de passe du compte"