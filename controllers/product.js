const productService = require("../services/product");


const getProducts = async (req, reply) => {
    try {
        const products = await productService.getAllProducts();

        return reply.send(products);
    } catch (e) {
        console.error(e);
        return reply.code(500).send({ message: e.message, errorCode: 500 });
    }
};


const addProduct = async (req, reply) => {
    // TO DO : faire que seul un admin puisse ajouter un produit
    try {
        const newProduct = await productService.createProduct(req.body);
        return reply.status(201).send(newProduct);
    } catch (e) {
        console.error(e);
        return reply.status(400).send({
            message: e.message,
            errorCode: 400
        })
    }
}

const getProduct = async (req, reply) => {
    const id = req.params.id;
    let code = 500;
    try {
        const product = await productService.getProductById(id);
        if (!product) {
            code = 404
            throw new Error("product not found");
        }
        return reply.send(product)
    } catch (err) {
        console.error(err.message)
        return reply.status(code).send({
            message: err.message,
            errorCode: code
        })

    }
}

const updateProduct = async (req, reply) => {
    // TO DO : faire que seul un admin  puisse mettre à jour un produit
    const id = req.params.id;
    let code = 400;
    try {
        const product = await productService.updateProductById(id, req.body);
        if (!product) {
            code = 404;
            throw new Error("product to update not found");
        }
        return reply.send(product)
    } catch (err) {
        console.error(err.message)
        return reply.status(code).send({
            message: err.message,
            errorCode: code
        })

    }

}


const deleteProduct = async (req, reply) => {
    // TO DO : faire que seul un admin puisse supprimer un produit
    const id = req.params.id
    let code = 500;
    try {
        const result = await productService.deleteProductById(id);
        if (!result) {
            code = 404
            throw new Error("product to delete not found");
        }
        return reply.send(result)
    } catch (err) {
        console.error(err.message)
        return reply.status(code).send({
            message: err.message,
            errorCode: code
        })

    }

}


module.exports = {
    getProducts,
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct
}

