//Require Mongoose 
const mongoose = require("mongoose");
//Create Schema object
const Schema = mongoose.Schema;

//Define the database colletion article schema
const ArticleSchema = new Schema({
	//Healine for article is required string
	headline: {
		type: String,
		required: true,
		unique: true,
		dropDups: true	
	},
	//Summarty of Article is required string
	summary: {
		type: String,
		required: true
	},

	//URL of the article is required string
	url: {
		type: String,
		required: true
	},

	//Article saved
	saved: {
		type:Boolean,
		default:false
	},
	//This will crate an array to note obejectIds. References to the Notes Model
	note: [{
		type: Schema.Types.ObjectId,
		ref: "Note"
	}]
});

//Create the Article Model using the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);


//Export the model
module.exports = Article;