const sqlite3 = require('sqlite3').verbose();

const DB_SOURCE = "db.sqlite3"

// open database in memory
let db = new sqlite3.Database('./' + DB_SOURCE, sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to ' + DB_SOURCE + ' database.');
});

let sql = `SELECT DISTINCT token FROM digiart`;

db.all(sql, [], (err, rows) => {
	if (err) {
		throw err;
	}
	rows.forEach((row) => {
		console.log(row.token);
	});
  });

// close the database connection
/*
db.close((err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Close the database connection.');
});
*/

module.exports = db