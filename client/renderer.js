// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var remote = require('electron').remote;
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

let txtDoc = document.getElementById('txtDoc');
let timeDis = document.getElementById('timeDis');
let btnStart  = document.getElementById('btnStart');
let btnStop  = document.getElementById('btnStop');
let btnClose = document.getElementById('btnClose');

var timeCountdownInterval;
var minutesInit,secondsInit

var duration =0;
var timer = duration, minutes, seconds,milliseconds;

var socket = require('socket.io-client').connect('http://localhost:3000',
         { reconnect: true }); 
socket.on('connect', function() { 
      console.log('Connected to server.'); 
      socket.on('timer-event', function(data) { //code 
            console.log(data);

            if(data.code=='00'){ // time update
                minutesInit =parseInt(data.minutes,10);
                secondsInit =parseInt(data.second,10);
                duration =  (minutesInit*60000)+(secondsInit*1000);
            }else if (data.code=='01') {//timeStart
                setUpDurationTime();
                timeCountdown();
                timeCountdownInterval= setInterval(timeCountdown, 10);
            }
            else if (data.code=='02') {//timeStop
                clearInterval(timeCountdownInterval);
            }
            else if (data.code=='03') {//timeReset
                setUpDurationTime();
                displayTime(); 
            }
           
            //setUpDurationTime();
            //displayTime(); 
      }) 
/*
     socket.on('timeStart', function (data) {
            console.log(data);
            setUpDurationTime();
            timeCountdown();
            imeCountdownInterval= setInterval(timeCountdown, 10);
     });
     
     socket.on('timeStop', function (data) {
            console.log(data);
            clearInterval(timeCountdownInterval);
     });
     socket.on('timeReset', function (data) {
            console.log(data);
            setUpDurationTime();
            displayTime(); 
     });
    */
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
btnClose.addEventListener('click', function () {
     console.log('btnClose c');
     var window = remote.getCurrentWindow();
     console.log(window);
     window.close();  
}); 
function timeCountdown() {

   timer = timer-10;
   if (timer < 0) {
      clearInterval(timeCountdownInterval);
  }

  async ( function (){
    displayTime();       
   } , null ) ;
}
function setUpDurationTime(){
    duration =  (minutesInit*60000)+(secondsInit*1000)
    console.log('duration >> '+duration);
    timer = duration;
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
