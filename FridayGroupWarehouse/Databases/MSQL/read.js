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


async function getAllProducts() {
    try {

        let pool = await sql.connect(config);
        let allProducts = await pool.request()
            .query('SELECT id, quantity, delivery_time, amount_ordered, reorder_at, reordered, location_name, location_fk, product_type_name, stock_product_name, stock_product_fk, unit_price, product_description' +
            ' FROM stock.general_stock, stock.location, stock.product_type, stock.stock_product' +
            ' WHERE location_id = location_fk ' +
            'AND product_type_fk = product_type_id ' +
            'AND stock_product_fk = stock_product_id ' +
            'ORDER BY stock_product_name');
        return {
            data: allProducts.recordset
        }
    } catch (error) {
        console.log(error);
    }
}

async function getOneProduct(id){
    try {
        let pool = await sql.connect(config);
        let products = await pool.request()
            .input('input_parameter', sql.Int, id)
            .query("SELECT  * FROM stock.stock_product where stock_product_id = @input_parameter");
        console.log(products.recordset);
        return products.recordset;
    } catch (error) {
        console.log(error);
    }
}

async function getAllProductInfoOnProductId(id) {
    try {
        let pool = await sql.connect(config);
        let product = await pool.request()
            .input('input_parameter', sql.Int, id)
            .query("SELECT location_name, product_type_name, stock_product_id, stock_product_name, product_description" +
                " FROM stock.general_stock, stock.location, stock.product_type, stock.stock_product" +
                " WHERE stock_product_fk = @input_parameter" +
                " AND stock_product_id = stock_product_id" +
                " AND location_id = location_fk" +
                " AND product_type_fk = product_type_id" +
                " AND stock_product_fk = stock_product_id");
        console.log(product.recordset);
        return product.recordset;
    }catch (error) {
        console.log(error);
    }
    sql.close();
}




async function getProductDataFromGeneralStockToMDB(id) {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request()
            .input('input_parameter', sql.Int, id)
            .query("SELECT id, quantity, delivery_time, amount_ordered, reorder_at, reordered, location_name, product_type_name, " +
                "stock_product_id, stock_product_name, unit_price, product_description FROM stock.general_stock, stock.location, " +
                "stock.product_type, stock.stock_product WHERE id = @input_parameter " +
                "AND stock_product_id = stock_product_id " +
                "AND location_id = location_fk " +
                "AND product_type_fk = product_type_id " +
                "AND stock_product_fk = stock_product_id");
        return products.recordset;
    } catch (error) {
        console.log(error);
    }
}

async function getProductInfo(id) {
    console.log('Function "getProductInfo" called - with ID'+id);
    try {
        let pool = await sql.connect(config);
        let product = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT " +
                "id, " +
                "stock_product_name, " +
                "unit_price, " +
                "product_description, " +
                "product_type_name, " +
                "product_type_id, " +
                "stock_product_id " +
                "  FROM stock.general_stock, stock.product_type, stock.stock_product " +
                "  WHERE id = @id " +
                "AND product_type_fk = product_type_id " +
                "AND stock_product_fk = stock_product_id "
            )
        let quantity = await pool.request()
            .input('id', sql.Int, product.recordset[0].stock_product_id)
            .query("" +
                "SELECT location_name, quantity FROM stock.location, stock.general_stock, stock.stock_product " +
                "WHERE stock_product_id = @id AND stock_product_fk = stock_product_id AND location_id = location_fk"
            );

        return {
            product: product.recordset,
            locations: quantity.recordset
        }
    } catch (error) {
        console.log(error);
    }
}

async function getProductTypes() {
    try {
        let pool = await sql.connect(config);
        let type = await pool.request()
            .query("" +
                "SELECT * FROM stock.product_type"
            )
        return {
            types: type
        }
    } catch (error) {
        console.log(error);
    }
}

async function getAllProductItems() {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request()
            .query("SELECT stock_product_id, stock_product_name, unit_price, product_description,\n" +
                "       (SELECT COUNT(location_fk)\n" +
                "           FROM stock.general_stock\n" +
                "           WHERE stock_product_id = general_stock.stock_product_fk)\n" +
                "              as locations,\n" +
                "       (SELECT SUM(quantity)\n" +
                "           FROM stock.general_stock\n" +
                "           WHERE stock_product_id = general_stock.stock_product_fk)\n" +
                "              as total_quantity\n" +
                "FROM stock.stock_product\n" +
                "ORDER BY stock_product_name")
        return {
            products
        }
    } catch (error) {
        console.log(error);
    }
}

async function getAllLocations() {
    try {
        let pool = await sql.connect(config);
        let locations = await pool.request()
            .query("SELECT * FROM stock.location")
        return {
            locations
        }
    } catch (error) {
        console.log(error);
    }
}

async function getLocationIdByStockProductId(stockProductId) {
    try {
        let pool = await sql.connect(config);
        let product = await pool.request()
            .input('stockProductId', sql.Int, stockProductId)
            .query("SELECT product_type_fk FROM stock.general_stock WHERE stock_product_fk = @stockProductId")
        return {
            product
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAllProducts,
    getOneProduct,
    getProduct: getProductInfo,
    getProductTypes,
    getAllProductItems,
    getAllLocations,
    getLocationIdByStockProductId,
    getProductDataFromGeneralStockToMDB,
    getAllProductInfoOnProductId
};

