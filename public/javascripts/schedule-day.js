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


  // given the month (0-11) and year (2017) repaint the calendar
  var renderDay = function(date) {
    var d = new Date(date)
    $(".title").html(d);

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