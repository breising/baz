$(document).ready(function() {

    var paintStartTimes = function() {
        // loop through to create time options for the AM start times
        for(var x=7; x<=11; x++){
            for(var y=0; y<60 ; y=y+5){
                // append to the select box
                // class name = milliseconds
                if(y == 0) {
                    $(".start-time").append('<option value="' + (Number(x*1000*60*60) + Number(y*1000*60)) + '">' + x + ':' + y + 0 + ' AM</option>');
                } else if(y == 5) {
                    $(".start-time").append('<option value="' + (Number(x*1000*60*60) + Number(y*1000*60)) + '">' + x + ':' + 0 + y + ' AM</option>');
                } else {
                    $(".start-time").append('<option value="' + (Number(x*1000*60*60) + Number(y*1000*60)) + '">' + x + ':' + y + ' AM</option>');
                }
            }
        }

        // loop through to create time options for the 12:00PM-100PM start time
        for(var z=12; z<=12; z++){
            for(var y=0; y<60 ; y=y+5){
                // append to the select box
                // class name = milliseconds
                if(y == 0) {
                    $(".start-time").append('<option value="' + (Number(z*1000*60*60) + Number(y*1000*60)) + '">' + z + ':' + y + 0 + ' PM</option>');
                } else if(y == 5) {
                    $(".start-time").append('<option value="' + (Number(z*1000*60*60) + Number(y*1000*60)) + '">' + x + ':' + 0 + y + ' PM</option>');
                } else {
                    $(".start-time").append('<option value="' + (Number(z*1000*60*60) + Number(y*1000*60)) + '">' + z + ':' + y + ' PM</option>');
                }
            }
        }

        // loop through to create time options for the after 1:00PM start time
        for(var z=13; z<20; z++){
            for(var y=0; y<60 ; y=y+5){
                // append to the select box
                // class name = milliseconds
                if(y == 0) {
                    $(".start-time").append('<option value="' + (Number(z*1000*60*60) + Number(y*1000*60)) + '">' + (z-12) + ':' + y + 0 + ' PM</option>');
                } else if(y == 5) {
                    $(".start-time").append('<option value="' + (Number(z*1000*60*60) + Number(y*1000*60)) + '">' + (z-12) + ':' + 0 + y + ' PM</option>');
                } else {
                    $(".start-time").append('<option value="' + (Number(z*1000*60*60) + Number(y*1000*60)) + '">' + (z-12) + ':' + y + ' PM</option>');
                }
            }
        }  
    };

    paintStartTimes();

    var paintEndTimes = function() {
        // loop through to create time options for the AM start times
        for(var x=7; x<=11; x++){
            for(var y=0; y<60 ; y=y+5){
                // append to the select box
                // class name = milliseconds
                if(y == 0) {
                    $(".end-time").append('<option value="' + (Number(x*1000*60*60) + Number(y*1000*60)) + '">' + x + ':' + y + 0 + ' AM</option>');
                } else if(y == 5) {
                    $(".end-time").append('<option value="' + (Number(x*1000*60*60) + Number(y*1000*60)) + '">' + x + ':' + 0 + y + ' AM</option>');
                } else {
                    $(".end-time").append('<option value="' + (Number(x*1000*60*60) + Number(y*1000*60)) + '">' + x + ':' + y + ' AM</option>');
                }
            }
        }

        // loop through to create time options for the 12:00PM-100PM start time
        for(var z=12; z<=12; z++){
            for(var y=0; y<60 ; y=y+5){
                // append to the select box
                // class name = milliseconds
                if(y == 0) {
                    $(".end-time").append('<option value="' + (Number(z*1000*60*60) + Number(y*1000*60)) + '">' + z + ':' + y + 0 + ' PM</option>');
                } else if(y == 5) {
                    $(".end-time").append('<option value="' + (Number(z*1000*60*60) + Number(y*1000*60)) + '">' + x + ':' + 0 + y + ' PM</option>');
                } else {
                    $(".end-time").append('<option value="' + (Number(z*1000*60*60) + Number(y*1000*60)) + '">' + z + ':' + y + ' PM</option>');
                }
            }
        }

        // loop through to create time options for the after 1:00PM start time
        for(var z=13; z<20; z++){
            for(var y=0; y<60 ; y=y+5){
                // append to the select box
                // class name = milliseconds
                if(y == 0) {
                    $(".end-time").append('<option value="' + (Number(z*1000*60*60) + Number(y*1000*60)) + '">' + (z-12) + ':' + y + 0 + ' PM</option>');
                } else if(y == 5) {
                    $(".end-time").append('<option value="' + (Number(z*1000*60*60) + Number(y*1000*60)) + '">' + (z-12) + ':' + 0 + y + ' PM</option>');
                } else {
                    $(".end-time").append('<option value="' + (Number(z*1000*60*60) + Number(y*1000*60)) + '">' + (z-12) + ':' + y + ' PM</option>');
                }
            }
        }  
    };

    paintEndTimes();

}); // document.ready