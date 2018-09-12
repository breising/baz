// change again and again
$(document).ready(function() {

  // // get to the current date of MONTH to determine which month to display
  // var dayOfMonth = new Date().getDate()

  // // populate the calendar DAYS with the dayOfMonth number

  // // get current day
  // var year = Number(new Date().getFullYear()); // returns 2017
  // var monthIndex = new Date().getMonth(); // returns 0-11
  // var dayMonthToday = new Date().getDate(); // returns 0-31

  // var monthsArray = ["Jan","Feb","Mar","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];

  var toMilitary = function(millisec) {
    var hours = Number(millisec/1000/60/60).toFixed(0);
    var minutes = Number(millisec/1000/60/60).toFixed(2).split(".")[1]; 
    console.log(String(hours) + ":" + String(minutes));
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
    console.log(millisec);

    return millisec;
  }

  var militaryTo12 = function(timeLabel) {
    //converts 24 hour militart time to AMPM

    // if the hour number is greater than 12, then subtract 12
    if(Number(timeLabel.split(":")[0]) > 11) {
      var newLabel = timeLabel + "PM";
      // if it's greater than 11, then make it PM else AM
      if(Number(timeLabel.split(":")[0]) > 12){
        var newHour = Number(timeLabel.split(":")[0]) - 12;
        newLabel = String(newHour) + ":" + String(timeLabel.split(":")[1]) + "PM";
        return newLabel;
      } else { // if greater than 11 only
        return newLabel;
      } // end second if
    } else { // for first if ..nothing happens except adding AM
      return timeLabel + "AM";
    }
  }

  var time1 = 1200000;//"12:00";
  //var time2 = "3:20PMhjk";
  console.log(militaryTo12(toMilitary(time1)));
  //console.log(labelToMilli(time2));

var firstClick = "";
var toggle = false;

  $(".time-box").click(function(){

    if (toggle === true) {
      ClearDropDown();
    }

    toggle = true;
    firstClick = this;
    $(".time-box").css("background-color", "white");
    $(this).css("background-color", "yellow");
    // In app.get, get the list of blocks from the database.
    // Use pug to put them into the view with display: none
    // then access that div via jquery to show/hide
    // get the dropdown container
    $(".dropdown-contain").appendTo(this);
    $(".dropdown-contain").css("display","block");
  }) // time-box click

  $(".dropdown-option").click(function(event) {
    // get the block id (the Blockid in the DB) from the pugView
    var id = event.target.id;//the id of the option/element clicked
    console.log("The id of the Block is: " + id);

    //get the time and chair values from the time-box
    var classList = $(firstClick).attr('class').split(" ");
    console.log("The class list is: " + classList);

    ClearDropDown();

    // add the Block to the template
    // get the Block info from the dropdown-option class
    var start_time = $(this).find(':nth-child(2)').html();
    var end_time = $(this).find(':nth-child(3)').html();

    console.log(id + " " + start_time + " " + end_time);

    //convert millisec to hours
    startHour = start_time /1000/60/60;
    startHour = startHour.toFixed(0); // convert number to a string and keeping specified number of decimals i.e. 7.08333 --> 7

    startMin = start_time/1000/60;

    start_time = startHour + "." + startMin;

    console.log(start_time);

  })


var ClearDropDown = function() {
  setTimeout(function(){ 
    console.log("Hey this is ClearDropDown");
    $(".dropdown-contain").appendTo(".dropdown-hold");
    $(".dropdown-contain").css("display","none");
    $(".time-box").css("background-color", "white");
    toggle = false;

  }, 0000);
  
}






  // Create dropdown menu when user clicks on a box
  // first, click on any box with the "time-box" class
  // $(".time-box").click(function() {
  //   get the coordinates of the click
  //   var x = event.clientX;
  //   var y = event.clientY;
  //   console.log("X coordinate = " + x + ", " + "X coordinate = " + y);

  //   //get an array list of the classes on the clicked box
  //   var classArray = $(this).attr('class').split(" ");
  //   console.log(classArray);
  //   console.log("The time label is: " + classArray[0]);
  //   console.log("The chair label is: " + classArray[1]);
  //   //get the dropdown element and change css for position and visibility
  //   $(".dropdown").css("position","absolute");
  //   $(".dropdown").css("left",x);
  //   $(".dropdown").css("top",y);
  //   $(".dropdown").css("display","block");

  // }) // DropDown menu


// on click --> insert select drop down and activate




  // given the month (0-11) and year (2017) repaint the calendar
  var renderDay = function(date) {
    var d = new Date(date)
    $(".month").html(d);

  }

  // Now set the listeners for the SHIFT back and forward
  $(".shiftback").click(function() {
    // get the month from the title
    var monthView = $(".title").html();
    var year = Number($(".year").html());
    var day = Number($(".day").html())

    monthsArray.forEach(function(x, monthIndex){
      if(x === monthView){
        // increment the months
        monthIndex = monthIndex - 1;
        if(monthIndex === -1) {
          monthIndex = 11;
          year = year - 1;
        }
      } 
    })
  }) // shiftback

  // Now set the listeners for the SHIFT back and forward
  $(".shiftforward").click(function() {
    // get the date
    console.log("Shift forward")
    var d = Date.parse($(".title").val())
    // increment the date
    console.log(d);
    d.setDate(d.getDate() + 1);

    // repaint with new date
    renderDay(d);
    
  }) // shift forward

 
  $(".showDay").click(function(event){
    var year = $(this).find(".boxyear").text();
    var day = $(this).find(".boxday").text();
    var month = $(this).find(".boxmonth").text();
    console.log("The day is: " + month + day + year);

    //post request to /schedule/day

  })
  


});