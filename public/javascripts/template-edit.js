// the drop function MUST remain in THIS scope
var drop = function() {
    
  }



$(document).ready(function() {
  // ******MUST keep these inside the document ready function  
  // set up the draggable template-item and droppable calendar item.
  var tempDroppable = "";

  $( ".template-item" ).draggable({
    helper: "clone"

  });
  $( ".showDay" ).droppable({
    greedy: true,
    hoverClass: "drop-hover",
    tolerance: "pointer",
 
  });
  



  // ******MUST keep these inside the document ready function  
  // set event listener for the drop event
  $( ".showDay" ).on( "drop", function( event, ui ) {
        //this = the target element
        var day = $(this).find(".boxday").text();
        var month = $(this).find(".boxmonth").text();
        var year = $(this).find(".boxyear").text();

        // console.log(day + " " + month + " " + year);
        // alert(day + " " + month + " " + year);

        // disable the droppable after it accepts a template
        $(this).droppable( "option", "disabled", true );

        console.log(ui.draggable.attr('id'));

        $(this).append(ui.draggable.text())

        var url = "/template-save?" + ui.draggable.attr('id');

        $.ajax({
          url: url, 
          success: function(result){
        //$("#bla").html(result);
            console.log(result);
          }
        });

  });
  // get to the current date of MONTH to determine which month to display
  var dayOfMonth = new Date().getDate()

  // populate the calendar DAYS with the dayOfMonth number

  // get current day
  var year = Number(new Date().getFullYear()); // returns 2017
  var monthIndex = new Date().getMonth(); // returns 0-11
  var dayMonthToday = new Date().getDate(); // returns 0-31
  

  var monthsArray = ["Jan","Feb","Mar","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];

  var showRange = function() {

  }


  // given the month (0-11) and year (2017) repaint the calendar
  var repaintCal = function(year, monthIndex) {
    //make new date objects using the FIRST DAY of the month
    var oriDate = new Date(year, monthIndex, 01);
    var date = new Date(year, monthIndex, 01);
    
    // iterate backwards from the 1st day of the month to find the first Sunday
    for(var x=1; x < 8; x++) {
      
      // if the day is sunday (= 0)
      // date.getDay() will return the day of the week as an index 0-6 where
      // 0 is Sunday, 1=Monday etc. 
      if(date.getDay() === 0) {
        // if this date is a Sunday, use 'date' to start populating the calendar up to 35
        //Now, there are 35 days shown on each calendar view regardless of the month...so loop through and make the label for day.
        for(var x=1; x<36; x++){
          //console.log(date.getDate());
          // get the element box1, box2 etc. and insert the number for the day along with a child div containing the month (display: none)
          $(".box" + x).html( "<div class='boxday'>" + date.getDate() + "</div>" + "<div class='boxmonth'>" + date.getMonth() + "</div>" + "<div class='boxyear'>" + date.getFullYear() + "</div>");
          // Only the class=boxday is visible on the calendar, others are display=NONE

          $(".box" + x).attr("id","div1");
          $(".box" + x).attr("ondrop","drop(event)");
          $(".box" + x).attr("ondragover","allowDrop(event)");

          //increment the 'data' and do it again for the next element
          date.setDate(date.getDate() + 1);
        }
      } else {
        // increment the date backwards looking for the first Sunday where we can start the calendar
        date.setDate(date.getDate() - 1);
      }
    }

    $(".month").html( monthsArray[oriDate.getMonth()]);
    $(".year").html( oriDate.getFullYear());
    
  }

  // Paint the calendar
  repaintCal(year, monthIndex);

  // Now set the listeners for the SHIFT back and forward
  $(".shiftback").click(function() {
 
    // get the month from the title
    var monthView = $(".month").html();
    var year = Number($(".year").html());

    monthsArray.forEach(function(x, monthIndex){
      if(x === monthView){
        // increment the months
        monthIndex = monthIndex - 1;
        if(monthIndex === -1) {
          monthIndex = 11;
          year = year - 1;
        }
        repaintCal(year, monthIndex);      
      } 
    })
  }) // shiftback

  // Now set the listeners for the SHIFT back and forward
  $(".shiftforward").click(function() {
    // get the month from the title
    var monthView = $(".month").html();
    var year = Number($(".year").html());

    monthsArray.forEach(function(x, monthIndex){
      if(x === monthView){
        // increment the months
        monthIndex = monthIndex + 1
        if(monthIndex === 12) {
          monthIndex = 0;
          year = year + 1;
        }
        repaintCal(year, monthIndex);
        console.log("Repainted");      
      } 
    })
  }) // shift forward

 
  $(".showDay").click(function(event){
    var year = $(this).find(".boxyear").text();
    var day = $(this).find(".boxday").text();
    var month = $(this).find(".boxmonth").text();
    console.log("The day is: " + month + ":" + day + ":" + year);

    var url = "/schedule-day/" + Number(year) + "/" + Number(month) + "/" + Number(day);

    console.log("The url is:" + url);
    //Below redirects to the new url...uncomment when it is setup.
    //window.location = url
  })








// Need to get the month day year of the target div
// create a URL to post that to the database: table Template: id, dayID, date
// then repaint the calendar but now import the applied templates.

});

