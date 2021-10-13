const mysql = require("mysql");
const { promisify } = require("util");

//! Function connecting to DB and getting query() & end() methods(promises) that suitable to be used with asyc/await later
function createDB() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

  connection.connect(err => {
    if (err) throw err;
  });

  return {
    query(qry, args) {
      return promisify(connection.query).call(connection, qry, args);
    },
    end() {
      return promisify(connection.end).call(connection);
    }
  };
}

module.exports = createDB;
