//Global variables for the before and after scrap record counts
let recCountBeforeScrape = 0;
let recCountAfterScrape = 0;

// $( document ).ready(function() {
//     getRecordCountBefore(); 
// });

$(".scrape-btn").on("click", function(event) {

  //Keep page from refressing
  event.preventDefault();

  //Call to function to get the count of articles in the
  // Mongo database article collection before scrape
  getRecordCountBefore();

   // Now make an ajax call for the Article scrap and
   //insert into the Mongo database article collection
  $.ajax({
    method: "GET",    
    url: "/scrape",  
    success: function(data){
      console.log("successfully returned data = " + data);
       //getRecordCountAfter();
    }    
  })
   //Do when done
  .done(function(data) {
    

  //Call to function to get the count of articles in the
  // Mongo database article collection after scrape
    getRecordCountAfter();
    getAllRecords(data);
  });
});//End of scrap click event 

$(document).on("click",".save", function(){
   var thisId = $(this).attr("data-id");
  console.log("In save click");
  $.post("/saveArticle/" + thisId, function(res) {
      console.log("get res value = " + res);
     
      // var resLenght = res.length;

      // res.forEach(function(article){
      //    $(".article-panels").append("<div class='panel panel-default' data-id='" + article._id + "'><div class='panel-heading' style='background-color: #8E9D9E;'><h3><a href='" + article.url + "' class='panel-a'>" + article.headline + "</a></h3><a class='btn btn-success save'>Save Article</a></div><div class='panel-body'>" + article.summary + "</div></div>");
      // });     
   });
   $(this).parents('div.panel-default').remove();
});

$(document).on("click", ".markread", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    type: "GET",
    url: "/markread/" + thisId
  });
  $(this).parents("div").partens(".panel-heading").remove();
  getRead();
});

//Ajax call to get the count of articles in the Mongo database article collection before scrape
var getRecordCountBefore = function (){
  
   $.ajax({
    method: "GET",    
    url: "/count"

  })
    //Retun the article record count
  .done(function(count) {
   
    //Store count in global variable recCountBeforeScrape
   recCountBeforeScrape = count;
    console.log("count before scrape = " + recCountBeforeScrape);
  });
};

//Ajax call to get the count of articles in the Mongo database article collection after scrape
var getRecordCountAfter = function (count){
  
   $.ajax({
    method: "GET",    
    url: "/count"
  })
    //Retun the article record count
  .done(function(count) {
    
    //Store count in global variable recCountAfterScrape
    recCountAfterScrape = count;
    console.log("count after scrape = " + recCountAfterScrape);
    console.log("count before scrape = " + recCountBeforeScrape);
    //Initial article scrape
    if(recCountBeforeScrape ===  0 && recCountAfterScrape !== 0){
       $("#article-record-count").html(recCountAfterScrape + " initial new articles scraped");
    }
     //New articles added
    else if(recCountAfterScrape > recCountBeforeScrape){
      //Subtract the before record count from the after record count
      var newCount = recCountAfterScrape - recCountBeforeScrape;
      $("#article-record-count").html(recCountAfterScrape + " new articles scraped");
    }
    //No new articles
    else if(recCountAfterScrape === recCountBeforeScrape){
      $("#article-record-count").html("No new articles scraped");
    }
    $("#scrapeModal").modal();
  });
};


const getAllRecords = function(data){
    
  $.get("/unsavedArticle", function(res) {
      console.log("get res value = " + JSON.stringify(res,null,2));
      console.log("res length " + res.length);
       console.log("res _id " + res[0]._id);
      var resLenght = res.length;

      res.forEach(function(article){
         $(".article-panels").append("<div class='panel panel-default '><div class='panel-heading' style='background-color: #8E9D9E;'><h3><a href='" + article.url + "' class='panel-a'>" + article.headline + "</a></h3><a class='btn btn-success save'  data-id='" + article._id + "'>Save Article</a></div><div class='panel-body'>" + article.summary + "</div></div>");
      });     
   });
};

