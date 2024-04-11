
const productBodySchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        category: { type: 'string' },
        stock: { type: 'number' },
        fileName: { type: 'string' },
        filePath: { type: 'string' },
        type: { type: 'string', }
    },
    required: ['name', 'description', 'price', 'category', 'stock', 'filePath', 'fileName']
};
const updateProductBodySchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        category: { type: 'string' },
        stock: { type: 'number' },
        fileName: { type: 'string' },
        filePath: { type: 'string' },
        type: { type: 'string', }
    },

};


const allProductResponseSchema = {
    200: {
        type: 'array',
        items: {
            type: "object",
            properties: {
                _id: { type: "string" },
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                category: { type: 'string' },
                stock: { type: 'number' },
                imageUrl: { type: 'string' },
                type: { type: 'string', }
            }
        }
    },
    404: {
        type: 'object',
        properties: {
            message: { type: 'string' },
            errorCode: { type: "number" },
        }
    },
    500: {
        type: "object",
        properties: {
            message: { type: "string" },
            errorCode: { type: "number" },
        }
    }
};

const productResponseSchema = {
    200: {

        type: "object",
        properties: {
            _id: { type: "string" },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            stock: { type: 'number' },
            imageUrl: { type: 'string' },
            type: { type: 'string', }

        }
    },

};


module.exports = {
    productBodySchema,
    productResponseSchema,
    allProductResponseSchema,
    updateProductBodySchema,
}
