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



//set the local host port
const PORT = 3000;


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


// // A GET request to scrape the echojs website
// app.get("/scrape", function(req, res) {
//   // First, we grab the body of the html with request
//   request("http://www.echojs.com/", function(error, response, html) {
//     // Then, we load that into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(html);
//     // Now, we grab every h2 within an article tag, and do the following:
//     $("article h2").each(function(i, element) {

//       // Save an empty result object
//       var result = {};

//       // Add the text and href of every link, and save them as properties of the result object
//       result.headline = $(this).children("a").text();
//       result.summary = $(this).children("a").text();
//       result.url = $(this).children("a").attr("href");

//       // Using our Article model, create a new entry
//       // This effectively passes the result object to the entry (and the title and link)
//       var entry = new Articles(result);

//       // Now, save that entry to the db
//       entry.save(function(err, doc) {
//         // Log any errors
//         if (err) {
//           console.log(err);
//         }
//         // Or log the doc
//         else {
//           console.log(JSON.stringify(doc));
//         }
//       });

//     });
//   });
//   // Tell the browser that we finished scraping the text
//   res.send("Scrape Complete");
// });

// 	app.get("/article", function(req, res) {

// 		console.log("in get articles route");
// 	  // Grab every doc in the Articles array
// 	  Articles.find({}, function(error, doc) {
// 	    // Log any errors
// 	    if (error) {
// 	      console.log(error);
// 	    }
// 	    // Or send the doc to the browser as a json object
// 	    else {
// 	    	console.log(doc);
// 	      res.json(doc);
// 	    }
// 	  });
// 	});

app.listen(3000, function(){
	console.log("App running on port " + PORT);
});
