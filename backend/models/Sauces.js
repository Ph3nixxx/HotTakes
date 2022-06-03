const mongoose = require("mongoose");

const ModelsSauce = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: false },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true }],
    usersDisliked: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true }]
});

module.exports = mongoose.model('Sauces', ModelsSauce);