var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType;
var Currency = mongoose.Types.Currency;

var promoSchema = Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        min: 0,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

var Promotions = mongoose.model('Promotions', promoSchema);

module.exports = Promotions;