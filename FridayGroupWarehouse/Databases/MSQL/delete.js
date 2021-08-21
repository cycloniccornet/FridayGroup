const dotenv = require('dotenv');
dotenv.config({path: '../../.env'});
const sql = require('mssql');

const userlog = require('../MongoDB/UserLog/userlog.js');
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

async function deleteProductFromStockProduct(id, username, userRole) {
    console.log('Called deleteProductFromStockProduct ' + id)
    let prod = await readProduct.getOneProduct(id);
    await userlog.deleteFromDatabaseLog(prod[0].stock_product_id, prod[0].stock_product_name, prod[0].product_description, username, userRole);
    try {
         let pool = await sql.connect(config);
        const deletedItem = await pool.request()
            .input('input_parameter', sql.Int, id)
            .query("DELETE FROM stock.stock_product where stock_product_id = @input_parameter");
        return deletedItem
    } catch (error) {
        console.log(error)
    }
}

async function removeProductFromSpecificWarehouse(id, username, userRole) {
    let productInfo = await readProduct.getProductDataFromGeneralStockToMDB(id);
    console.log(productInfo);
    await userlog.deleteLogFromWarehouse(productInfo[0].id, productInfo[0].stock_product_name, productInfo[0].product_type_name,
        productInfo[0].location_name, username, userRole);
    try {
        let pool = await sql.connect(config);
        return await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM stock.general_stock WHERE id = @id")
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    deleteProductFromStockProduct,
    removeProductFromSpecificWarehouse
};