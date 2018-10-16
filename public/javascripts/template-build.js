
// Must keep this here even though it does noting
var drop = function() {
  // do nothing
}

$(document).ready(function() {

  $(".new_template").click(function(){
    // go into new-template MODE

    //activateDragDrop();

    clear_inputs();

    inputs_on();

    //onDropTemplate();
  
  })//... click.new_template

  $(".edit_template").click(function(){
    // go into new-template MODE

    activateDragDrop();

    inputs_on();

    onDropTemplate();
  
  })//... click.new_template

  var activateDragDrop = function(){
    console.log("activateDragDrop");
    //Activate the grid drag and drop operations
    $(".block-item").draggable({
      helper: "clone"
    });

    $(".time-box").droppable({
      greedy: true,
      hoverClass: "drop-hover",
      tolerance: "pointer"
    });

    $(".block-item").draggable({ disabled: false} );
    $(".time-box").droppable({ disabled: false} );
  } //... activate drag

  var inputs_off = function(){

    $(".block-item").draggable({ disabled: true} );
    $(".time-box").droppable({ disabled: true} );

    $(".name_template").attr("readonly", true);
    $(".description_template").attr("readonly", true);

    $(".name_template").css('background-color','#f2f2f2');
    $(".description_template").css('background-color','#f2f2f2');
  }

  var inputs_on = function(){
    // enable the inputs and turn them green;
    $(".name_template").attr("readonly", false);
    $(".description_template").attr("readonly", false);

    //Highlight colors for grid, name and description
    $(".name_template").css('background-color','#c6ecc6');
    $(".description_template").css('background-color','#c6ecc6');
    //show save button and activate listener
    $(".save_template").show();
    $(".save_template").click(function() {
      save_template_new();
    }) //...$(".save_template")
  } //... inputs_on

  var clear_inputs = function(){
    //clear the inputs
    $(".id_template").val("");
    $(".name_template").val("");
    $(".description_template").val("");
  } //... inputs_on

  var save_template_edit = function() {

    // get all the block info from the grid



    // blockID, time, chair, templateID
    // CREATE TABLE templateblock (
    //   id SERIAL PRIMARY KEY,
    //   blockid INTEGER REFERENCES block,
    //   templateid INTEGER REFERENCES template,
    //   startTime INTEGER,
    //   chair INTEGER REFERENCES chair
    // );


    inputs_off();
    //var url = "/template-save?name=" + name + "&description=" + description;
    // $.ajax({
    //     url: url, 
    //     success: function(result){
    //       alert(result);
    //       // disable the drag and drop operations
    //       $(".block-item").draggable({ disabled: true} );
    //       $(".time-box").drappable({ disabled: true} );
    //     } //...success
    // }) // ... ajax
  } //...save_template_new


  var save_template_new = function() {
    //var id = $(".id-template").value();
    var name = $(".name_template").val();
    var description = $(".description_template").val();

    if(name == "" || name == null || name == undefined) {
      return alert("Name and Description are required.");
    }

    inputs_off();

    var url = "/template-save?name=" + name + "&description=" + description;
    $.ajax({
        type:"POST",
        url: url, 
        success: function(result){
          alert("Saved success");

        } //...success
    }) // ... ajax
  } //...save_template_new

  var onDropTemplate = function(){
    // ******MUST keep these inside the document ready function  
    // set event listener for the drop event
    $( ".time-box" ).on( "drop", function( event, ui ) {
        //this = the target element

        //get the start-time (mins) from the drop target
        var getMin = function(element){ 
          var min = $(element).text();
          var hour = $(element).text();

          hour = hour.split(":")[0].split(".")[1];
          hour = Number(hour) * 60;
          //console.log("hour= " + hour);
          min = min.split(":")[1];// = 00PM
          min = Number(min[0] + min[1]);// final
          return hour + min;
        }       
        // get the chair from the drop target
        var getChair = function(element){
          var chair = $(element).text();
          return chair = chair.split(".")[0];
        }

        var min = getMin(this);
        var chair = getChair(this);

        // get the Id of the block (draggable)
        var block_id = ui.draggable.attr('id');
        var text_of_block = ui.draggable.text();
        // the above gets the ":" delimited text "45:Adjustment:#ffff00"

        // so, then get the first part (the 45)
        var block_duration = Number(text_of_block.split(":")[0]);
        // so, then get the second part (the name)
        var block_name = text_of_block.split(":")[1];
        // so, then get the third part (the color)
        var block_color = text_of_block.split(":")[2];
        //Get the next element at 5 mins later
        //loop through the elements
        var stop_time = min + block_duration;
        //first check that all elements are free to accept a block
        // check if child element exists with id = block_id
        // loop through all the candidate elements
        for(x=min ; x <= stop_time; x += 5){
          // create a selector for the time-box element
          var selector = String(chair) + "_" + String(x);
          // if it has any child elements, then it's already taken
          if($("." + selector).children().length > 0){
            // if exists then stop !
            return alert("Sorry. That's already taken.")
          }
        }

        // disable the droppable after it accepts a block
        $(this).droppable( "option", "disabled", true );
        // Insert the text of the draggable into the droppable
        $(this).append(ui.draggable.text())

        // loop through all the candidate elements again
        for(x=min ; x <= stop_time; x += 5){
            // create the selector for getting next element
            var selector = String(chair) + "_" + String(x); 
            // Now do the work element
            // create html for the child element of drop target
            var html = '<div id="' + String(block_id) + '">' + block_name + '</div>';
            // modify the element
            $("." + selector).html(html);
            $("." + selector).droppable( "option", "disabled", true );
            $("." + selector).css('background-color', block_color);
        }
      }) //...on.drop $(.time-box)
  }


  var toMilitary = function(millisec) {
    var hours = Number(millisec/1000/60/60).toFixed(0);
    var minutes = Number(millisec/1000/60/60).toFixed(2).split(".")[1]; 
    //console.log(String(hours) + ":" + String(minutes));
    return String(hours) + ":" + String(minutes);
  }

  var labelToMilli = function(label){
    var array = String(label).split(":")[1].split("");
    while(array.length > 2) {
      array.pop();
    }
    var minutes = array.join("");

    var hour = Number(label.split(":")[0]);
    var millisec = (hour * 60 * 60 * 1000) + (minutes * 60 * 1000);
    //console.log(millisec);

    return millisec;
  }

  var militaryTo12 = function(timeLabel) {
    //converts 24 hour militart time to AMPM
    var hours = timeLabel.split(":")[0];
    var minutes = timeLabel.split(":")[1];
    var AMPM = "";

    if(hours < 1) {
      hours = "12";
      AMPM = "AM";
      return String(hours) + ":" + String(minutes) + String(AMPM);
    } 

    if(hours > 11 & hours < 13) {
      AMPM = "PM";
      return String(hours) + ":" + String(minutes) + String(AMPM);   
    }

    if(hours > 12) {
      hours = Number(hours) - 12;
      return String(hours) + ":" + String(minutes) + String(AMPM);   
    }
  } //militaryTo12

}) //...document.ready



