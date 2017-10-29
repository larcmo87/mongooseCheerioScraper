// Requiring our models
const Article = require("../models/Articles.js")
const Note = require("../models/Notes.js")

//Used for scraping 
const request = require("request");
const cheerio = require("cheerio");



module.exports = function(app) {

	// A GET request to scrape the echojs website
	app.get("/scrape", function(req, res) {
		var returnCount = 0;
		var recordRemovedCount = 0;
			 
	  // First, we grab the body of the html with request
	  request("https://www.nytimes.com/section/technology?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=Tech&WT.nav=page", function(error, response, html) {
	   
	  	 if (!error && response.statusCode == 200) {
	    // Then, we load that into cheerio and save it to $ for a shorthand selector
	    var $ = cheerio.load(html);
	    	   
	    // Now, we grab every h2 within an article tag, and do the following:
	    $("a[class=story-link]").each(function(i, element) {
	    	
	      // Save an empty result object
	      	var result = {};
	      //console.log("headline = " + $(this).children('div').children('h2.headline').text());
	      // Add the text and href of every link, and save them as properties of the result object
	      result.headline = $(this).children('div').children('h2.headline').text().trim();
	      result.summary = $(this).children('div').children('p.summary').text().trim();
	      result.url = $(this).attr("href").trim();
    	
	    
	      //This effectively passes the result object to the entry (and the title and link)
	      var entry = new Article(result);
	      
	      // Now, save that entry to the db
	      entry.save(function(err, doc) {
	      	
	      	//Do not return anything. Not even errors
	      	//This is because dulicate errors are returned 
	      	//causes the server to stop
	      });
	    
	    });
	    console.log("server result = " + JSON.stringify(response,null,2));
	    //send response back to browse
	     res.send(response);
		}
	  });
	
	});
	app.get("/count", function(req, res) {

	  // Grab every doc in the Articles array
	  Article.count({}, function(error, doc) {
	    // Log any errors
	    if (error) {
	      console.log(error);
	    }
	    // Or send the doc to the browser as a json object
	    else {

	    	console.log("count = "  + doc);
	      res.json(doc);
	    }
	  });
	});

	//Get all articles
	app.get("/article", function(req, res) {

		
	  // Grab every doc in the Articles array
	  Article.find({}, function(error, doc) {
	    // Log any errors
	    if (error) {
	      console.log(error);
	    }
	    // Or send the doc to the browser as a json object
	    else {

	    	console.log(doc);
	      res.json(doc);
	    }
	  });
	});

	//Get all unsaved articles
	app.get("/unsavedArticle", function(req, res) {

		
	  // Grab every record in the article collection that has a saved value of false
	  Article.find({"saved": false}, function(error, doc) {
	    // Log any errors
	    if (error) {
	      console.log(error);
	    }
	    // Or send the doc to the browser as a json object
	    else {

	    	console.log(doc);
	      res.json(doc);
	    }
	  });
	});

	//Get all saveed articles
	app.get("/savedArticle", function(req, res) {

		
	  // Grab every record in the article collection that has a saved value of true
	  Article.find({"saved": true}, function(error, doc) {
	    // Log any errors
	    if (error) {
	      console.log(error);
	    }
	    // Or send the doc to the browser as a json object
	    else {

	    	console.log(doc);
	      res.json(doc);
	    }
	  });
	});

	//Update the selected article's saved value to true
	app.post("/saveArticle/:id", function(req, res) {

		console.log("body id " + JSON.stringify(req.params.id));
	  Article.update({
	    "_id": req.params.id
	  }, {
	    // Set "read" to true for the book we specified
	    $set: {
	      "saved": true
	    }
	  },
	  // When that's done, run this function
	  function(error, edited) {
	    // show any errors
	    if (error) {
	      console.log(error);
	      res.send(error);
	    }
	    // Otherwise, send the result of our update to the browser
	    else {

	      console.log(edited);
	      res.send(edited);
	    }
	  });
	});

	//Update the selected article's saved value to true
	app.post("/deleteArticle/:id", function(req, res) {

		console.log("delete id " + JSON.stringify(req.params.id));
	   Article.update({
	    "_id": req.params.id
	  }, {
	    // Set "read" to true for the book we specified
	    $set: {
	      "saved": false
	    }
	  },
	  // When that's done, run this function
	  function(error, deleted) {
	    // show any errors
	    if (error) {
	      console.log(error);
	      res.send(error);
	    }
	    // Otherwise, send the result of our update to the browser
	    else {
	      console.log(deleted);
	      res.send(deleted);
	    }
	  });
	});

	//Update the selected article's saved value to true
	app.post("/deleteNote/:id", function(req, res) {

		console.log("delete Note Id" + JSON.stringify(req.params.id));

	   //Remove the note object id from the document note array
	   Article.update({
	    "note": req.params.id
	  }, {
	    //Removes the note object id from the note array
	    $pull: {
	      "note": req.params.id
	    }
	  },
	  // When that's done, run this function
	  function(error, deleted) {
	    // show any errors
	    if (error) {
	      console.log(error);
	      res.send(error);
	    }
	    // Otherwise, delete the note from the notes collection
	    else {

	    	Note.findByIdAndRemove(req.params.id, function (err, post) {
			    if (err) return next(err);
			    res.json(post);
			 });
	    }
	  });
	});

	// Get article by paramer id value
	app.get("/article/:id", function(req, res) {
	  // Find the record in the Articles collection using the parameter id value
	  Article.findOne({ "_id": req.params.id })
	  //Populate all of the articles notes
	  .populate("note")
	  // execute query
	  .exec(function(error, doc) {
	    // Log errors
	    if (error) {
	      console.log(error);
	    }
	    else {

	    	console.log("returned articl notes = " + doc);
	    	//Return the doc data back to the client as Java Object
	      res.json(doc);
	    }
	  });
	});

	//Post - create a new note 
	app.post("/article/:id", function(req, res) {
	  // Create a new note and pass the req.body to the entry
	 console.log("req body = " + JSON.stringify(req.body));
	  var newNote = new Note(req.body);

	  // Save note to the database
	  	newNote.save(function(error, doc) {
	    // Log errors
		    if (error) {
		      console.log(error);
		    }
		    // Else do....
		    else {
		      // Find the corresponding article id and update the article's note array
		      Article.findOneAndUpdate({"_id": req.params.id}, { $push: { "note": doc._id } }, { new: true },function(err, notedoc) {
		        // Send any errors to the browser
		        if (err) {
		          res.send(err);
		        }
		        // Or send the newdoc to the browser
		        else {

		        	console.log(" note doe " + notedoc);
		          res.send(notedoc);
		        }
		      });
	 		}
		});

	});

	var getRecordCount = function(){
	// Grab every doc in the Articles array
	  Article.count({}, function(error, count) {
	    // Log any errors
	    if (error) {
	      console.log(error);
	    }
	    // Or send the doc to the browser as a json object
	    else {

	    	console.log("count = "  + count);
	     //Return count
	     return count;
	    }
	  });

	};

};

