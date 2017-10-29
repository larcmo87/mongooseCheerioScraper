//Required package dependencies
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

//Require the Note and Article Models
// const Note = require("./models/Notes.js");
// const Articles = require("./models/Articles.js");

//Used for scraping 
const request = require("request");
const cheerio = require("cheerio");




var PORT = process.env.PORT || 3000;


//Set Mongoose to leverge built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//Initialize Expres
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));


//Make the public directory static
app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/myTimesCheerioScraper";
//Mongoose data base connection configuration. Name of DB will be yTimesCheerioScraper

mongoose.connect(MONGODB_URI);
var db = mongoose.connection;


//Show Mongoose connection error
db.on("error",(error) => {
	console.log("Mongoose connection error ", error);
});


//Mongoose connection successfull.
db.once("open", () =>{
	console.log("Mongoose connection was successful");

});

//require("./routes/html-routes.js")(app);

require("./routes/savedArticles-routes.js")(app);

app.listen(PORT, function(){
	console.log("App running on port " + PORT);
});
