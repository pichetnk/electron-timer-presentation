// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var server = require('http').createServer();
var io = require('socket.io')(server);

server.listen(3000);


let btnStart  = document.getElementById('btnStart');
let btnStop  = document.getElementById('btnStop');
let btnSave  = document.getElementById('btnSave');
let btnReset  = document.getElementById('btnReset');

let txtMinutes = document.getElementById('txtMinutes');
let txtSecond  = document.getElementById('txtSecond');

io.on('connection', function(socket){
	socket.on('event', function(data){});
	socket.on('disconnect', function(){
		console.log('gone');
	});
    socket.emit('timeUpdate', { minutes: txtMinutes.value,second:txtSecond.value });
    
});




btnStart.addEventListener('click',function(){   
    io.emit('timeStart', { code: '01' });   
});

btnStop.addEventListener('click',function(){
     io.emit('timeStop', { code: '02' });
});

btnReset.addEventListener('click',function(){
     io.emit('timeReset', { code: '03' });
});

btnSave.addEventListener('click',function(){
  io.emit('timeUpdate', { minutes: txtMinutes.value,second:txtSecond.value });
});




