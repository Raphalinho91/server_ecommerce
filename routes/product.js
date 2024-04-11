const {
    getProducts,
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/product");
const { productBodySchema, productResponseSchema, allProductResponseSchema, updateProductBodySchema } = require("../schemas/product");



function productRoutes(fastify, _options, done) {
    fastify.get(
        "/product",
        {
            schema: {
                response: allProductResponseSchema,
            },
        },
        getProducts
    );

    fastify.post(
        "/product",
        {
            schema: {
                body: productBodySchema,
                response: productResponseSchema,
            },
        },
        addProduct
    );

    fastify.get(
        "/product/:id",
        {
            schema: {
                response: productResponseSchema,
            },
        },
        getProduct
    );
    fastify.patch(
        "/product/:id",
        {
            schema: {
                body: updateProductBodySchema,
                response: productResponseSchema,
            },
        },
        updateProduct
    );
    fastify.delete(
        "/product/:id",
        {
            schema: {
                response: productResponseSchema,
            },
        },
        deleteProduct
    );




    done();
}

module.exports = {
    productRoutes
}