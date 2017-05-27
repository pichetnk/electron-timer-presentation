// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var remote = require('electron').remote;
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var axios = require('axios');


let txtDoc = document.getElementById('txtDoc');
let timeDis = document.getElementById('timeDis');
let btnStart  = document.getElementById('btnStart');
let btnReset  = document.getElementById('btnReset');
let btnClose = document.getElementById('btnClose');
let btnPause = document.getElementById('btnPause');


var timeCountdownInterval=false;
var minutesInit=5,secondsInit=0;
var setting;
var duration =0;
var timer = duration, minutes, seconds,milliseconds;

minutesInit =parseInt(10,10);
secondsInit =parseInt(0,10);
duration =  (minutesInit*60000)+(secondsInit*1000);
/*
fs.readFile('setting.json', 'utf8', function (err, data) {
    if (err) return console.log(err);    
    setting= JSON.parse(data);
    initSocket();  
});
*/
function initSetting(){
	axios.get('http://ywc.in.th/timePresent/client.json')
	  .then(function (response) {
		console.log(response);
		setting = response.data;
		initSocket();  
	  })
	  .catch(function (error) {
		console.log(error);
	  });
}     

      
   


function initSocket() {
var socket = require('socket.io-client').connect('http://'+setting.server+':'+setting.port,{ reconnect: true }); 
socket.on('connect', function() { 
      console.log('Connected to server.'); 
      socket.on('timer-event', function(data) { //code 
            console.log(data);

            if(data.code=='00'){ // time update
                minutesInit =parseInt(data.minutes,10);
                secondsInit =parseInt(data.second,10);
                duration =  (minutesInit*60000)+(secondsInit*1000);
                setUpDurationTime();
              //  displayTime(); 
            }else if (data.code=='01') {//timeStart
                console.log('timeStart');
                //setUpDurationTime();
                //timeCountdown();
                //timeCountdownInterval= setInterval(timeCountdown, 10);
                startTime();
            }
            else if (data.code=='02') {//pause
                console.log('timeStop');
                pauseTime();
            }
            else if (data.code=='03') {//timeReset
                console.log('timeReset');
                resetTime();
            }
           

      }) 
});
}

initSetting();

btnStart.addEventListener('click',function(){
    //timer =duration;
    //timeCountdownInterval= setInterval(timeCountdown, 10);
    startTime();
});
btnReset.addEventListener('click',function(){
   resetTime();
});

btnPause.addEventListener('click',function(){
    pauseTime();
});
/*
btnStop.addEventListener('click',function(){
    clearInterval(timeCountdownInterval);
});
*/
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
    //clearInterval(timeCountdownInterval);
    pauseTime();
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

function startTime(){
    
    if(timeCountdownInterval === false) {
        btnPause.style="";
        btnStart.style="display: none;";
        timeCountdown();
        timeCountdownInterval= setInterval(timeCountdown, 10);
    }
}

function pauseTime(){
    btnPause.style="display: none;";
    btnStart.style="";
    clearInterval(timeCountdownInterval);
    timeCountdownInterval = false;
}

function resetTime() {
    setUpDurationTime();
    displayTime(); 
}
