const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/* Renvoie un tableau de toutes les sauces de la base de données. */
router.get('/', auth, saucesCtrl.getAllSauces);
/* Renvoie la sauce avec l’_id fourni. */
router.get('/:id', auth, saucesCtrl.getOneSauce);
/* Capture et enregistre l'image, analyse la sauce transformée en chaîne de caractères et l'enregistre dans la base de données en définissant correctement son imageUrl. Initialise les
likes et dislikes de la sauce à 0 et les usersLiked et usersDisliked avec des tableaux vides. Remarquez que le corps de la demande initiale est vide ; lorsque multer est ajouté, il renvoie
une chaîne pour le corps de la demande en fonction des données soumises avec le fichier. */
router.post('/', auth, multer, saucesCtrl.createSauce);
/* Met à jour la sauce avec l'_id fourni. Si une image est téléchargée, elle est capturée et l’imageUrl de la sauce est mise à jour. Si aucun fichier n'est fourni, les informations sur la sauce
se trouvent directement dans le corps de la requête (req.body.name, req.body.heat, etc.). Si un fichier est fourni, la sauce transformée en chaîne de caractères se trouve dans req.body.sauce. Notez que
le corps de la demande initiale est vide ; lorsque multer est ajouté, il renvoie une chaîne du corps de la demande basée sur les données soumises avec le fichier. */
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
/* Supprime la sauce avec l'_id fourni. */
router.delete('/:id', auth, saucesCtrl.deleteSauce);
/* Définit le statut « Like » pour l' userId fourni. Si like = 1, l'utilisateur aime (= like) la sauce. Si like = 0, l'utilisateur annule son like ou son dislike. Si like = -1, l'utilisateur n'aime pas (=
dislike) la sauce. L'ID de l'utilisateur doit être ajouté ou retiré du tableau approprié. Cela permet de garder une trace de leurs préférences et les empêche de liker ou de ne pas disliker la même sauce 
plusieurs fois : un utilisateur ne peut avoir qu'une seule valeur pour chaque sauce. Le nombre total de « Like » et de « Dislike » est mis à jour à chaque nouvelle notation. */
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;