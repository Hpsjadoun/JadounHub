const Datastore = require('nedb-promises');
const path = require('path');
const fs = require('fs');

// Server folder ke andar hi direct database folder setup karna
const dataDir = path.resolve(__dirname, '../data');

if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir, { recursive: true });
}

const connectDB = () => {
    try {
        // Bina kisi external server ke database templates setup
        global.db = {
            users: Datastore.create({ filename: path.join(dataDir, 'users.db'), autoload: true }),
            products: Datastore.create({ filename: path.join(dataDir, 'products.db'), autoload: true }),
            orders: Datastore.create({ filename: path.join(dataDir, 'orders.db'), autoload: true })
        };
        console.log(`🍃 Local Offline Database Engine Connected Successfully!`);
    } catch (error) {
        console.error(`❌ Local Database Initialisation Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;