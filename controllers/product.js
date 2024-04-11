const productService = require("../services/product");
const uploadS3Service = require("../services/upload");


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
    let code = 500;
    const { fileName, filePath } = req.body;

    try {
        const imgUrl = await uploadS3Service.uploadImageToS3(fileName, filePath);

        if (!imgUrl) throw new Error('Fail to upload image');
        const newProduct = await productService.createProduct({ ...req.body, imageUrl: imgUrl });
        return reply.status(201).send(newProduct);

    } catch (err) {
        return reply.status(code).send({ message: err.message, errorCode: code });
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
    let imgUrl;
    const { fileName, filePath } = req.body;
    try {
        if (fileName && filePath) {
            imgUrl = await uploadS3Service.uploadImageToS3(fileName, filePath);
            if (!imgUrl) throw new Error("something went wrong  while trying to upload the image");
            const product = await productService.updateProductById(id, { ...req.body, imageUrl: imgUrl });
            return reply.status(200).send(product)

        }
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

