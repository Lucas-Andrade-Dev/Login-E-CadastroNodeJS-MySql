const mysql = require('mysql');

const { setDefaultResultOrder } = require('dns');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud",
});



module.exports = db;