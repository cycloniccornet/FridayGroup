const dotenv = require('dotenv');
dotenv.config({path: '../../.env'});

const MongoClient = require('mongodb').MongoClient;


const connectionUrl = process.env.MONGODATABASEURL;
const errorLog = require('../ErrorLog/errorLog');


// Getting date for user, and date for nodemailer
let calculateDate = Date.now()
let today = new Date();
let todayString = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();



/**
* Logging createProduct used in create.js function
* createNewProduct() line 43
**/
async function createNewProductLog(name, price, description, username, userRole) {
    try {
        await MongoClient.connect(connectionUrl, {useUnifiedTopology: true}, (error, client) => {
            if (error) console.log("Error from mongoDB", error);

            const database = client.db(process.env.MONGODATABASE);
            const userlogCollection = database.collection(process.env.MONGODB_COLLECTION);

            userlogCollection.insertOne({
                date: todayString,
                dateNow: calculateDate,
                action: "Create new product",
                name: name,
                price: price,
                description: description,
                username: username,
                userRole: userRole
            }, (error, result) => {
                if (error) throw new Error(error);
                client.close();
            });
        });
    } catch (error) {
        await errorLog.logError(error);
    }
}

async function updateLog(id, name, price, description, type, stockId, username, userRole) {
    try {
        await MongoClient.connect(connectionUrl, {useUnifiedTopology: true}, (error, client) => {
            if (error) console.log("Error from mongoDB", error);

            const database = client.db(process.env.MONGODATABASE);

            const userlogCollection = database.collection(process.env.MONGODB_COLLECTION);

            userlogCollection.insertOne({
                date: todayString,
                dateNow: calculateDate,
                action: 'Update',
                id: id,
                name: name,
                price: price,
                description: description,
                type: type,
                stockId: stockId,
                username: username,
                userRole: userRole
            }, (error, result) => {
                if (error) throw new Error(error);
                client.close();
            });
        });
    } catch (error) {
        await errorLog(error);
    }
}

/**
 * Logging link to warehouse, used in create.js function
 * addProductToWarehouse() line59
**/
async function linkToWarehouseLog(id, name, location, category, username, userRole){
    try {
        await MongoClient.connect(connectionUrl, {useUnifiedTopology: true}, (error, client) =>{
            if (error) console.log("Error from mongoDB", error);

            const database = client.db(process.env.MONGODATABASE);

            const userlogCollection = database.collection(process.env.MONGO_COLLECTION);

            userlogCollection.insertOne({
                date: todayString,
                dateNow: calculateDate,
                action: 'Linked product to warehouse',
                id: id,
                name: name,
                category: category,
                location: location,
                username: username,
                userRole: userRole
            }, (error, result) =>{
                if(error) throw new Error(error);
                client.close();
            });
        });
    } catch (error) {
        await errorLog(error);
    }
}


/**
* Logging deletion from a location, used in delete.js function
* removeProductFromSpecificWarehouse() line 52
**/
async function deleteLogFromWarehouse(id, name, category, location, username, userRole) {
    try {
        await MongoClient.connect(connectionUrl, {useUnifiedTopology: true}, (error, client) => {
            if (error) console.log("Error from mongoDB", error);

            const database = client.db(process.env.MONGODATABASE);

            const userlogCollection = database.collection(process.env.MONGODB_COLLECTION);

            userlogCollection.insertOne({
                date: todayString,
                dateNow: calculateDate,
                action: 'Remove product from specific warehouse',
                id: id,
                name: name,
                category: category,
                location: location,
                username: username,
                userRole: userRole
            }, (error, result) => {
                if (error) throw new Error(error);
                client.close();
            });
        });
    } catch (error) {
        await errorLog(error);
    }
}

/**
 * Logging deletion from database in delete.js function
* deleteProductFromStockProduct(), line 37
*/
async function deleteFromDatabaseLog(id, name, description,  username, userRole){

    try {
        await MongoClient.connect(connectionUrl, {useUnifiedTopology: true}, (error, client) =>{
            if (error) console.log("Error from mongoDB", error);

            const database = client.db(process.env.MONGODATABASE);
            const userlogCollection = database.collection(process.env.MONGODB_COLLECTION);

            userlogCollection.insertOne({
                date: todayString,
                dateNow: calculateDate,
                action: 'Deleted from warehouse database',
                id: id,
                name: name,
                description: description,
                username: username,
                userRole: userRole
            }, (error, result) => {
                if (error) throw new Error(error);
                client.close();
            });
        });
    } catch (error){
        await errorLog(error);
    }
}

function getUserLog() {
    return new Promise((resolve, reject) => {

        try {
            MongoClient.connect(connectionUrl, {useUnifiedTopology: true}, (error, client) => {
                if (error) throw new Error(error);
                const database = client.db(process.env.MONGODATABASE);
                const userlogCollection = database.collection('userlog');
                userlogCollection.find().toArray((error, foundLogs) => {
                    if (error) console.log(error);
                    //console.log(foundLogs);
                    client.close();
                    resolve(foundLogs);
                    return foundLogs;
                });
            });
        } catch (error) {
            reject.console.log(error);
        }
    });
}

module.exports = {
    getUserLog,
    updateLog,
    linkToWarehouseLog,
    deleteLogFromWarehouse,
    deleteFromDatabaseLog,
    createNewProductLog
};

