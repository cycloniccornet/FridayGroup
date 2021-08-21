const MongoClient = require('mongodb').MongoClient;

const connectionUrl = 'mongodb://localhost:27017';

async function logError(errorToLog) {
    try {
        await MongoClient.connect(connectionUrl, {useUnifiedTopology: true}, (error, client) => {
            if (error) throw new Error(error);

            const database = client.db('FridayGroup');

            const errorlogCollection = database.collection('errorlog');

            errorlogCollection.insertOne({
                error: errorToLog,
                date: Date()
            }, (error, result) => {
                if (error) throw new Error(error);

                console.log(result);
                client.close();
            });
        });
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    logError
};