const { Product } = require("../models/product");

const createProduct = async function (ProductData) {
    const product = Product.create(ProductData);
    return product;
}

const updateProductById = async function (productId, updateData) {
    const productToUpdate = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    return productToUpdate;
}

const deleteProductById = async (productId) => {
    const result = await Product.findByIdAndDelete(productId);
    return result;
};


const getAllProducts = async function () {
    return await Product.find({});
};

const getProductById = async function (productId) {
    const product = await Product.findById(productId);
    return product;
}

module.exports = {
    createProduct,
    updateProductById,
    deleteProductById,
    getAllProducts,
    getProductById
};
