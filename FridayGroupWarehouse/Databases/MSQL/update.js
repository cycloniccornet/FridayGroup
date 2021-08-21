const dotenv = require('dotenv');
dotenv.config({path: '../../.env'});
const sql = require('mssql');


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

async function updateProduct(name, price, description, stockId) {
    try {
        let pool = await sql.connect(config);
        return await pool.request()
            .input('stockId', sql.Int, stockId)
            .input('name', sql.NVarChar, name)
            .input('price', sql.Int, price)
            .input('description', sql.NVarChar, description)
            .query("" +
                "UPDATE " +
                "stock.stock_product " +
                "SET " +
                "stock_product_name = @name, " +
                "unit_price = @price, " +
                "product_description = @description " +
                "WHERE " +
                "stock_product_id = @stockId");
        //  await userlog.updateLog(id, name, price, description, type, stockId, "Some Name", "Some User Role");
    } catch (error) {
        console.log(error);
    }
}

async function updateProductType(id, typeId) {
    try {
        let pool = await sql.connect(config);
        return await pool.request()
            .input('id', sql.Int, id)
            .input('typeId', sql.Int, typeId)
            .query(
                "UPDATE stock.general_stock " +
                "SET product_type_fk = @typeId " +
                "WHERE id = @id"
            );
    } catch (error) {
        console.log(error);
    }
}

async function updateProductAmount(id, amount) {
    try {
        let pool = await sql.connect(config);
        return await pool.request()
            .input('id', sql.Int, id)
            .input('amount', sql.Int, amount)
            .query(
                "UPDATE stock.general_stock " +
                "SET quantity += @amount " +
                "WHERE id = @id"
            );

    } catch (error) {
        if (error) console.log("Error:", error);
    }
}

module.exports = {
    updateProduct,
    updateProductType,
    updateProductAmount
};
