$(document).ready(function(){
  
  var color;
  //boolean to have control over when the device is on or off
  var on =false;
  //array that captures the sequence of buttons played in the game
  var moves = [];
  //object containing number to color transformations for selecting random colors when playing the game
  var numberToColor = {0:"#01A64A",1:"red",2:"yellow",3:"blue"};
  //colors of the game when it is no lit up
  var originalColors = ["green","#9F0F18","#CFA40F","#094A8E"];
  //boolean to control when a colored button can be hit e.g. block on click of button when game is off
  var buttonClicked = false;
  //step keeps track of steps for each round
  var step = 0;
  //strict keeps track of whether the game is being played in strict mode
  var strict = false;
  //current score and number of steps in the current round
  var count = 0;
  //keeps track of whether the game has been started (if the start button has been hit)
  var playing = false;
  
  //this function is mostly a safety measure to make sure all color lights are off when the game is reset
  function resetColors(){
    for(var i = 0; i <4; i++){
	    $("[color='" + numberToColor[i] + "']").css("background-color",originalColors[i]);
    }
  }
  
  //function to display the count
  function displayCount(){
    if(count.toString().length == 1){
      //add a zero to the beggining number if count is less than 10
	    $(".count").html("0" + count);
    } else {
	    $(".count").html(count);
    }
  }
  
  //control the lighting up of the colored buttons
  //color is the originial color of a button (not lit)
  //button is used to identify the right color and extract the hex code for when the button is lit
  function lightButton(color,button){
    var identifier = "[color='"+button +"']";
    if(color == "")color = $(identifier).css("background-color");
    $(identifier).css("background-color",($(identifier).attr("color")));
    setTimeout(function(){
      $(identifier).css("background-color",color);
      buttonClicked = false;
    },800);
  }
  
  //play audio and light button when a button is clicked
  function hitButton(color,button){    
    buttonClicked = true; 
    document.getElementById(button).play();
    lightButton(color,button);
  }
  
  //play all the buttons in a sequence every time a nyew round is reached or when the player makes a mistake and is not on strict mode
  function loop(loopCounter){    
    setTimeout(function() {
         hitButton("",moves[loopCounter]);
         loopCounter++;
         if(loopCounter < moves.length) loop(loopCounter);
      },1000);
  }
  
  //add a new value to the sequence and display the sequence
  function play(){
    var random = numberToColor[Math.floor(Math.random()*4)];
    moves.push(random);       
    loop(0); 
  }
  
  //this function controls the on/off button
  $(".on-button").on("click",function(){
    $(".switch").toggleClass("switch-on");
    //if turning device off
    if(on){
     //stop all clocks in the game 
     var id = window.setTimeout(function() {}, 0);
     while (id--) {
      window.clearTimeout(id); // will do nothing if no timeout with id is present
     } 
     //reset colors to original colors in case there is a glitch or error 
     resetColors(); 
     //reset the count 
     count = 0; 
     //set all booleans to false and reset count display 
     on = strict = playing = false; 
     $(".count").html("&nbsp&nbsp"); 
    }else{
     //else if we are turning thee game on, display something on the screen to show it is on 
     on = true;
     $(".count").html("__"); 
     moves = []; 
     step = 0;
    }
    $(".light").removeClass("on");
  });
  
  $(".button").on("click",function(){
    //use booleans to control if a colored button can be hit
    if(buttonClicked || !on || !playing)return;
    //change color to lit color
    color = $(this).css("background-color");
    var button = $(this).attr("color");
    //if the user makes a mistake
    if(button !== moves[step]){      
      document.getElementById("buzzer").play();
      step = 0;
      lightButton(color,button);
      $(".count").html("!!");
      setTimeout(function(){displayCount();},1000);
      // if not on strict mode
      if(!strict){
        setTimeout(function(){loop(0);},1000);
        return; 
      } else {
        //if on strict mode, the game resets
         count = 1; 
         moves = []; 
         step = 0;
         setTimeout(function(){play();},1000);
         return;
      }  
    }
    //add a new step if the user succeeds at the current level  
    step++;
    if(step == moves.length){
      step = 0;
      count++;
      displayCount();
      play();
    }
    hitButton(color,button);   
  });
  
  //change between strict and non strict mode, and turn the little red light on or off
  $(".strict-mode").on("click",function(){
    if(!on)return;
    strict === true? strict = false:strict = true;
    $(".light").toggleClass("on");
  });
  
  //visual effects of round buttons, for "sinking" effect we remove and readd the shadow 
  $(".round-button").mouseup(function(){
    $(this).css("box-shadow","2px 2px 2px black");
  })
    .mousedown(function(){
    $(this).css("box-shadow","2px 2px 2px #ECE7EE");
  });
  
  //initialize the game
  $(".start").on("click",function(){
    if(!on)return;
    count = 1;
    playing = true;
    step = 0;
    initializeSound();
    displayCount();
    setTimeout(function(){play();},1000);
  })
  
  //sound intialization is necesssary for mobile browsers, all sound is played muted once and then is unmuted for the actual game
  function initializeSound(){
    for(var i = 0; i < 4; i++){
      document.getElementById(numberToColor[i]).muted = true;
      document.getElementById(numberToColor[i]).play();
    }
    setTimeout(function(){
    for(var i = 0; i < 4; i++){
      document.getElementById(numberToColor[i]).muted = false;
    }
    },1000);  
  }
  
});