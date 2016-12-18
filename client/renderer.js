// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

let txtDoc = document.getElementById('txtDoc');
let timeDis = document.getElementById('timeDis');
let btnStart  = document.getElementById('btnStart');
let btnStop  = document.getElementById('btnStop');

var timeCountdownInterval;
var minutesInit,secondsInit

var duration =0;
var timer = duration, minutes, seconds,milliseconds;

var socket = require('socket.io-client').connect('http://localhost:3000',
         { reconnect: true }); 
socket.on('connect', function() { 
      console.log('Connected to server.'); 
      socket.on('timeUpdate', function(data) { //code 
          console.log(data);
          minutesInit =parseInt(data.minutes,10);
          secondsInit =parseInt(data.second,10);
          displayTime(); 
      }) 

     socket.on('timeStart', function (data) {
        console.log(data);
        console.log('minutesInit >> '+minutesInit);
        console.log('secondsInit >> '+secondsInit);
        duration =  (minutesInit*60000)+(secondsInit*1000)
        console.log('duration >> '+duration);
        timer =duration;
        timeCountdown();
        timeCountdownInterval= setInterval(timeCountdown, 10);
     });
     
     socket.on('timeStop', function (data) {
       console.log(data);
       clearInterval(timeCountdownInterval);
     });
     socket.on('timeReset', function (data) {
       console.log(data);
       duration =  (minutesInit*60000)+(secondsInit*1000)
       console.log('duration >> '+duration);
       timer =duration;
       displayTime(); 
     });

     
});
/*
io.on('connection', function(socket){
 socket.on('time-sync', function(msg){
    console.log('message: ' + msg);
  });
});
http.listen(3000, function() {
  console.log('listening on *:3000' );
});

*/

//timeDis.innerHTML="sadasdasd";


btnStart.addEventListener('click',function(){
    timer =duration;
    timeCountdownInterval= setInterval(timeCountdown, 10);
  
});

btnStop.addEventListener('click',function(){
    clearInterval(timeCountdownInterval);
});
//var myVar = setInterval(myTimer, 1000);

function timeCountdown() {

   timer = timer-10;
   if (timer < 0) {
      clearInterval(timeCountdownInterval);
  }

  async ( function (){
    displayTime();       
   } , null ) ;
}


function displayTime(){
    if(timer>=0){
        minutes = parseInt(timer / (60000), 10)
        seconds = parseInt((timer/1000) %60, 10);
        milliseconds = parseInt((timer % 1000)/10, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        milliseconds = milliseconds < 10 ? "0" + milliseconds : milliseconds;

        if(timer<60000){
        timeDis.className = "textRed";
        }else {
        timeDis.className = "textNomal";
        }
        timeDis.textContent = minutes + ":" + seconds+":"+milliseconds;
    }
}

function async(your_function, callback) {
    setTimeout(function() {
        your_function();
        if (callback) {callback();}
    }, 0);
}
