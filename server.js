// create a connector to access the database
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('data/sensor.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to database.');
console.log(db);
});


// initialize express
let express = require('express');
let restapi = express();

restapi.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


let selectAllQuery='SELECT * FROM sensor';
let selectPointNameQuery="SELECT * from sensor where gate = ?"

function findInDb(query, callback){ //una funzione passata come parametro viene eseguita alla fine della funzione che la riceve
    db.all(query, function(err, rows){ //exec query
		if(err){ return callback(err) };
		callback(null, rows);
	});
};

function findInDbSingle(query, name, callback){
	db.all(query, name,function(err,rows){
		if(err){ return callback(err) };
		callback(null, rows);
	});

}

restapi.get('/sensors', function(req, res){ //entrypoint generico per tutti i dati 
  findInDb(selectAllQuery, function(err, obj){ //function(err, obj) è cosa fare terminata la query, cioè la callback
    if(err){ return next(err) }; //gestisce gli errori (il primo param della callback deve contenere errori)
	res.send(obj); //oppure invia la responce
     //res.status(200).json(obj);
  });
});


// tutti i paths che contengono uno specifico punto
restapi.get('/sensor/:gate', function(req, res){
	let gateName = req.params.gate;
	if(gateName){
		findInDbSingle(selectPointNameQuery, gateName, function(err, obj){ //callback
    	if(err){ return next(err) }; //gestisce gli errori
		res.send(obj); //oppure invia la responce
  		});
	}
})

restapi.listen(3000);
console.log("Listening on port 3000...");
