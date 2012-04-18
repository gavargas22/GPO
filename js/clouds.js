// JavaScript Document

var scrollSpeed = 50;       // Speed in milliseconds
var step = 0.5;               // How many pixels to move per step
var current = 0;            // The current pixel row
var imageHeight = 3800;     // Background image height
var headerHeight = 373;     // How tall the header is.

//The pixel row where to start a new loop
var restartPosition = -(imageHeight - headerHeight);

function scrollBg(){
    
    //Go to next pixel row.
    current -= step;
    
    //If at the end of the image, then go to the top.
    if (current == restartPosition){
        current = 0;
    }
    
    //Set the CSS of the header.
    $('#clouds-div').css("background-position",+current+"px "+"0");
    
    
}

//Calls the scrolling function repeatedly
var init = setInterval("scrollBg()", scrollSpeed);