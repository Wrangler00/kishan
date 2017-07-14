var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var multer = require('multer');
var twilio = require('twilio');
var upload = multer();


var TWILIO_ACCOUNT_SID='ACa5355d724462a0560d58fcad0de7ff03';

var TWILIO_AUTH_TOKEN='2c75a04795136dd181a9729e836f43e5';

var client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 

//mongodb
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.createCollection("contactsDB", function(err, res) {
    if (err) throw err;
    console.log("Table created!");
    db.close();
  });
});

//setting static folder
app.use(express.static(__dirname + '/public'));

var auth = require('./routes/auth.js');
app.use('/',auth);

var contacts = [
	{
		"firstName": "Abhishek",
		"lastName" : "kumar",
		"phone" : "+919317098895",
		"id":"ghsdv784554"
	},
	{
		"firstName": "Abhishek",
		"lastName" : "Jio",
		"phone" : "+917985256707",
		"id":"vbbvzbvdhy78454"
	},
	{
		"firstName": "Mummy",
		"lastName" : "Ji",
		"phone" : "+919005589733",
		"id":"gvhjf4646"
	},
	{
		"firstName": "Papa",
		"lastName" : "Ji",
		"phone" : "+919506880067",
		"id":"jihjoylj12"
	},
	{
		"firstName": "Kishan",
		"lastName" : "Traders",
		"phone" : "+919971792703",
		"id":"ootuoyo8556"
	},
	{
		"firstName": "Moid",
		"lastName" : "Hassan",
		"phone" : "9999999",
		"id":"78555"
	},
	{
		"firstName": "Priyanka",
		"lastName" : "Dutta",
		"phone" : "555555",
		"id":"ghbdrg784546"
	},
	{
		"firstName": "Kumar",
		"lastName" : "Sanu",
		"phone" : "7777777",
		"id":"qwqwqwq845112"
	},
	{
		"firstName": "Alka",
		"lastName" : "Yagni",
		"phone" : "666666666",
		"id":"lalalala12121"
	},
	{
		"firstName": "killller",
		"lastName" : "Aggarwal",
		"phone" : "88888888",
		"id":"tytyugvfr4646"
	}
];

app.post('/',function(req ,res){
	console.log(req.body.password);
	res.send("recieved your request!");
	var OTP = Math.floor(100000 + Math.random() * 900000);

	var firstName,lastName,phone;
	for(var i=0;i<contacts.length;i++){
		if(req.body.password === contacts[i].phone){
			firstName = contacts[i].firstName;
			lastName = contacts[i].lastName;
			phone = contacts[i].phone;
		}
	}

	var sendTo = JSON.stringify(req.body.password);
	var msg = req.body.message+" Your OTP is "+OTP;
	client.messages.create({ 
	    to: sendTo, 
	    from: "+19495582127", 
	    body: msg
	},function(err,messages){
		//errror
		if(err) console.log(err);
		else {
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				else{
					var myobj = { name: firstName+" "+lastName, time:messages.dateUpdated, OTP:OTP};
					console.log(myobj);
				  	db.collection("contactsDB").insertOne(myobj, function(err, res) {
					    if (err) throw err;
					    else console.log("record inserted");
				  	});
			  	}
			  	db.close();
			});
		}
	});
});

io.on('connection',function(socket){
	console.log('A user connected');

	socket.on("first tab clicked",function(){
		console.log("First tab clicked!");
		socket.emit("contacts json",contacts);
	});

	socket.on("Second tab clicked",function(){
		console.log("Second tab clicked!");
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  else{
		  	db.collection("contactsDB").find({}).toArray(function(err, result) {
			    if (err) throw err;
			    console.log(result);
			    socket.emit("sentMessages",result);
			    //db.close();
			});
  		  }
  		  db.close();
		});
	});

	socket.on('disconnect',function(){
		console.log('A user disconnected');
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});