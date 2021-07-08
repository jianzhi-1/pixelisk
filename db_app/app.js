const express = require('express');
const bodyParser = require('body-parser');
var db = require("./db.js")

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const port = 8000

app.get('/', (req, res) => {
    var sql = "select * from digiart";
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
			res.status(400).json({"error":err.message});
			return;
        }
		console.log(rows);
        //res.json({
        //    "message":"success",
        //    "data":rows
        //})
    });
	res.send('PixeLisk Server')
})

app.get('/all', (req, res) => {

    var sql = "select * from digiart";
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
			res.status(400).json({"error":err.message});
			return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
	console.log("HERE")
	res.header("Access-Control-Allow-Origin", "*");
	console.log("THERE")
})

//app get - get ntf
app.get('/token/:tokenId', (req, res) => {
    var sql = "select * from digiart where token='" + req.params['tokenId'] + "'";
    console.log(sql)
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
			res.status(400).json({"error":err.message});
			return;
        }
		if (rows.length == 0 || rows.length > 1){
			res.status(400).json({"error":"no such token or multiple tokens"});
			return;
		}
        res.json({"data":rows[0]['data']})
    });
    console.log(req.params)
})

//app post - create ntf
app.post('/create', (req, res) => {
	console.log("REQUEST AT CREATE")
	console.log(req)
	console.log(req.body)
	console.log(JSON.stringify(req.body))
	var sql = `insert into digiart (token, data) values('${req.body['token']}', '${req.body['data']}')`;
    console.log(sql)
	var params = []
    db.run(sql, params, (err, rows) => {
        if (err) {
			res.status(400).json({"error":err.message});
			return;
        }
        //res.json({
        //    "message":"post request success",
        //})
    });
    //console.log(req.data);
    //res.send('POST request to the homepage')
})

app.listen(port, () => {
  	console.log(`Example app listening at http://localhost:${port}`)
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
