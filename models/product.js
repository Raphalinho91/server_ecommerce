const mongoose = require('mongoose');

const ProductTypeEnum = Object.freeze({
    PHYSICAL: 'produit physique',
    VIDEO: 'vidéo'
});


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Vous devez fournir un nom."]
    },
    description: {
        type: String,
        required: [true, "Vous devez fournir une description."]
    },
    price: {
        type: Number,
        required: [true, "Vous devez fournir un prix."]
    },
    category: {
        type: String,
        required: [true, "Vous devez fournir une catégorie."]
    },
    stock: {
        type: Number,
        required: [true, "Vous devez fournir une quantité en stock."]
    },
    imageUrl: {
        type: String,
        required: [true, "Vous devez fournir une URL d'image."]
    },
    type: {
        type: String,
        enum: Object.values(ProductTypeEnum),
        default: ProductTypeEnum.PHYSICAL
    }

});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product, ProductTypeEnum };