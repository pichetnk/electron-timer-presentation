// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var server = require('http').createServer();
var io = require('socket.io')(server);

server.listen(3000);


let btnStart  = document.getElementById('btnStart');
let btnStop  = document.getElementById('btnStop');
let btnSet  = document.getElementById('btnSet');
let btnReset  = document.getElementById('btnReset');

let txtMinutes = document.getElementById('txtMinutes');
let txtSecond  = document.getElementById('txtSecond');

io.on('connection', function(socket){
	socket.on('event', function(data){});
	socket.on('disconnect', function(){
		console.log('gone');
	});
    socket.emit('timer-event', { minutes: txtMinutes.value,second:txtSecond.value });
    
});




btnStart.addEventListener('click',function(){   
    io.emit('timer-event', { code: '01',codeDesc:'timeStart' });   
});

btnStop.addEventListener('click',function(){
     io.emit('timer-event', { code: '02',codeDesc:'timeStop' });
});

btnReset.addEventListener('click',function(){
     io.emit('timer-event', { code: '03',codeDesc:'timeReset' });
});

btnSet.addEventListener('click',function(){
  io.emit('timer-event', {code: '00',codeDesc:'timeUpdate', minutes: txtMinutes.value,second:txtSecond.value });
});




