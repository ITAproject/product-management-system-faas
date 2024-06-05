'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');

const docClient = new AWS.DynamoDB.DocumentClient({
    endpoint: 'http://localhost:4566', // Localstack DynamoDB endpoint
    region: 'us-east-1'
});

const TABLE_NAME = "product-management-system-products";

const JWT_SECRET = "secret";

// Middleware to validate JWT
const authenticateJWT = (event) => {
    const token = event.headers.Authorization || event.headers.authorization;
    if (!token) {
        throw new Error('No token provided');
    }
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Unauthorized');
    }
};

// Login
module.exports.login = async (event) => {
    const {username, password} = JSON.parse(event.body);
    if (username === 'admin' && password === 'admin') {
        return {
            statusCode: 200,
            body: JSON.stringify({
                token: jwt.sign({username}, JWT_SECRET)
            })
        };
    }

    return {
        statusCode: 401,
        body: JSON.stringify({error: 'Unauthorized'})
    };
};

module.exports.createProduct = async (event) => {
    const {name, description, price} = JSON.parse(event.body);
    const id = uuid.v4();
    const newProduct = {id, name, description, price};
    await docClient.put({
        TableName: TABLE_NAME,
        Item: newProduct
    }).promise();

    // Auto-invoking function
    await module.exports.sendProductsSummary(event);

    return {
        statusCode: 201,
        body: JSON.stringify(newProduct)
    };
};

// Get All Products
module.exports.getProducts = async () => {
    const data = await docClient.scan({TableName: TABLE_NAME}).promise();
    return {
        statusCode: 200,
        body: JSON.stringify(data.Items)
    };
};

// Get Product by ID
module.exports.getProductById = async (event) => {
    const {id} = event.pathParameters;
    const data = await docClient.get({
        TableName: TABLE_NAME,
        Key: {id}
    }).promise();
    if (!data.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({error: 'Product not found'})
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data.Item)
    };
};

// Update Product
module.exports.updateProduct = async (event) => {
    const {id} = event.pathParameters;
    const {name, description, price} = JSON.parse(event.body);
    await docClient.update({
        TableName: TABLE_NAME,
        Key: {id},
        UpdateExpression: 'set name = :name, description = :description, price = :price',
        ExpressionAttributeValues: {
            ':name': name,
            ':description': description,
            ':price': price
        }
    }).promise();
    return {
        statusCode: 200,
        body: JSON.stringify({id, name, description, price})
    };
};

// Delete Product
module.exports.deleteProduct = async (event) => {
    const {id} = event.pathParameters;
    await docClient.delete({
        TableName: TABLE_NAME,
        Key: {id}
    }).promise();
    return {
        statusCode: 200,
        body: JSON.stringify({message: 'Product deleted successfully'})
    };
};

// Scheduled Task
module.exports.scheduledTask = async () => {
    console.log('Scheduled task running...');
};

// Process Product Changes
module.exports.processProductChanges = async (event) => {
    for (const record of event.Records) {
        console.log('DynamoDB Record: %j', record.dynamodb);
    }
};

// Send Products Summary
module.exports.sendProductsSummary = async () => {
    const data = await docClient.scan({ TableName: TABLE_NAME }).promise();
    const products = data.Items;

    return {
        statusCode: 200,
        body: JSON.stringify({ products: products })
    };
};

// Handle SNS Notification
module.exports.handleSnsNotification = async (event) => {
    for (const record of event.Records) {
        const snsMessage = record.Sns.Message;
        console.log('SNS Message:', snsMessage);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'SNS notification processed successfully' })
    };
};
