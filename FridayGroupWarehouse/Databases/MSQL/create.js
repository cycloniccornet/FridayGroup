const dotenv = require('dotenv');
dotenv.config({path: '../../.env'});
const sql = require('mssql');

const userlog = require('../MongoDB/Userlog/userlog.js');
const readProduct = require('../MSQL/read.js');


const config = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_LOCATION,
    database: process.env.DB_NAME,
    "options": {
        "encrypt": true,
        "enableArithAbort": true
    }
};

async function insert(productName, amount, price, description, location, category) {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request()
            .input('stock_product_name', sql.NVarChar, productName)
            .input('unit_price', sql.Int, price)
            .input('product_description', sql.NVarChar, description)
            .input('location_fk', sql.Int, location)
            .input('product_type_fk', sql.Int, category)
            .input('quantity', sql.Int, amount)
            .query("INSERT INTO stock.stock_product(stock_product_name, unit_price, product_description) VALUES(@stock_product_name, @unit_price, @product_description) " +
                "INSERT INTO stock.general_stock(location_fk, product_type_fk, quantity, stock_product_fk) VALUES(@location_fk, @product_type_fk, @quantity, (SELECT IDENT_CURRENT('stock.stock_product')))");
        await userlog.createLog(category, productName, amount, location, "Some name", "Some role");
        console.log("recordset ", products.recordset);

        return products.recordset;
    } catch (error) {
        console.log(error);
    }
}



async function createNewProduct(name, price, description, username, userRole) {
    let newPrice = Number(price).toFixed(2)
    try {
        let pool = await sql.connect(config);
        let product = await pool.request()
            .input('stock_product_name', sql.NVarChar, name)
            .input('unit_price', sql.Numeric, newPrice)
            .input('product_description', sql.NVarChar, description)
            .query("INSERT INTO stock.stock_product(stock_product_name, unit_price, product_description) VALUES (@stock_product_name, @unit_price, @product_description)");
        console.log(product);
        await userlog.createNewProductLog(name, price, description, username, userRole);
        return product;
    } catch (error) {
        console.log(error);
    }
}

async function addProductToWarehouse(locationId, productId, productType, username, userRole) {
    try {
        console.log("Produkt ID: "+productId);
        console.log("Lokations ID: "+locationId);
        console.log("Produkt Type ID: "+productType);
        let pool = await sql.connect(config);
        return await pool.request()
            .input('location_id', sql.NVarChar, locationId)
            .input('product_id', sql.Int, productId)
            .input('product_type', sql.Int, productType)
            .query("INSERT INTO stock.general_stock (location_fk, product_type_fk, stock_product_fk, quantity) VALUES (@location_id, @product_type, @product_id, 0)");
        let productInfo = await readProduct.getAllProductInfoOnProductId(productId);
        console.log(productInfo)
        await userlog.linkToWarehouseLog(productId, productInfo[0].product_type_name, productInfo[0].location_name, productInfo[0].product_type_name, username, userRole );
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    insert,
    createNewProduct,
    addProductToWarehouse
};

