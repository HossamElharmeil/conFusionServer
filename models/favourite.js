const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var favouriteSchema = Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        unique: true
    }]
});

var Favourites = mongoose.model('Favourite', favouriteSchema);
module.exports = Favourites;