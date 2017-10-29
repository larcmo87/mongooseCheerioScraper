//Global variables for the before and after scrap record counts
let recCountBeforeScrape = 0;
let recCountAfterScrape = 0;
let saveNoteId = "";

//Save article
$(document).on("click",".save", function(){
   var thisId = $(this).attr("data-id");
  console.log("In save click");
  $.post("/saveArticle/" + thisId, function(res) {
    //Do nothing
   });
   $(this).parents('div.panel-default').remove();
});

//Delete article and remove from page
$(document).on("click",".delete", function(){
  //Store the _id of the artivle to be updated
   var thisId = $(this).attr("data-id");
 
  $.post("/deleteArticle/" + thisId, function(res) {
     
     //Do nothing
   });
   $(this).parents('div.panel-default').remove();
});


//Delete article and remove from page
$(document).on("click",".btn-delete-note", function(){
  //Store the _id of the note to be deleted
   var thisId = $(this).attr("data-id");
 
  //Remove the note object id from the articles collection note array
  //and delete the note from the notes collection
  $.post("/deleteNote/" + thisId, function(res) {
    //Do nothing
   });

  //remove the note item from the items list in the Modal
   $(this).parents('div.list-item').remove();
});

//Delete article and remove from page
$(document).on("click",".notes", function(){
    
    var addNoteDataIDVal  = $(this).attr("data-id");
    $(".note-list").empty();
    console.log(" addNoteDataIDVal " + addNoteDataIDVal);

    //Store the .notes btn data-id attribute value as the .save-note 
    //btn data-id attribute.
    $(".save-note").attr("data-id",addNoteDataIDVal);

     $.get("/article/" + addNoteDataIDVal, function(res){
      //console.log("Null res " + JSON.stringify(res.notes));

        //If the length of res.note array is greater than 0 then do
        if(res.note.length !== 0) {

          //Loop through each note in the res.note array
          res.note.forEach(function(note){
            console.log("Note" + JSON.stringify(note));

            //Append new note to the modal note list pasing in the note and the note id
            //as the btn-delete-note data-id attribute value
            $(".note-list").append("<div class='row list-item'><div class='col-sm-8 col-md-10 col-lg-10'><p>" + note.note + "</p></div><div class='col-sm-4 col-md-2 col-lg-2'><button class='btn btn-danger btn-delete-note' data-id='" + note._id + "'>Delete</button></div></div>");

          });
         
        }else{

          //If no notes then display "No notes for this article"
          $(".note-list").append("<div class='row list-item'><div class='col-sm-12 col-md-12 col-lg-12'><p style='text-align:center; padding-top: 30px'>No notes for this article</p></div></div>");
        }
       
       });
     //Show modal showNotes
     $("#showNotes").modal();  
});

//Save note
$(".save-note").on("click", function(){

  //Get the data-id attr value.
   var thisId = $(this).attr("data-id");

    //Store the .save-note  btn data-id attribute value as the .btn-delete-note 
    //btn data-id attribute.
   $(".btn-delete-note").attr("data-id",thisId);


   //Object to pass into the post
   //will contain the new note
   data = {
    note: $("#modalNewNote").val()
   }

   $.post("/article/" + thisId,data, function(res){
     console.log("Saved note res = " + JSON.stringify(res));

   });

   //Clear the new note
   $("#modalNewNote").val("");
});


//get all saved articles on initial page load and when deletion occures
const getAllRecords = function(data){
  //clear all of the article panels
    $(".article-panels").empty();

  //Get only saved artciles and render to the page
  $.get("/savedArticle", function(res) {
      console.log("get res value = " + JSON.stringify(res,null,2));
      console.log("res length " + res.length);
       console.log("res _id " + res[0]._id);
      let endDiv = "</div>"
      let divConstruct = "<div class='container-fluid note-list'>"
      let divRow = "<div class-'row'>"

      //Loop through the returned JSON object and render data in panels
      res.forEach(function(article){
         $(".article-panels").append("<div class='panel panel-default '><div class='panel-heading' style='background-color: #8E9D9E;'><h3><a href='" + article.url + "' class='panel-a'>" + article.headline + "</a></h3><a class='btn btn-danger delete'  data-id='" + article._id + "'>DELETE FROM SAVED</a><a class='btn btn-info notes'  data-id='" + article._id + "'>ARTICLE NOTES</a></div><div class='panel-body'>" + article.summary + "</div></div>");
          //$(".article-panels").append(divConstruct + divRow + "<div class='col-sm-6 col-md-8 col-lg-8'></div><div class='col-sm-3 col-md-2 col-lg-2'></div><div class='col-sm-3 col-md-2 col-lg-2'></div>"  + endDiv + endDiv)
      });     
   });
};

getAllRecords();