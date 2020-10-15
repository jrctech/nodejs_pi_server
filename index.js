const express = require('express');
const app = express();
const WebSocket = require('ws');
const GPIO = require('onoff').Gpio; //include onoff to interact with the GPIO
const LED = new GPIO(4, 'out'); //use GPIO pin 4, and specify that it is output
const ledClientConnected = new GPIO(17, 'out'); //use GPIO pin 17, and specify that it is output
const ledHeartbeat = new GPIO(27, 'out'); //use GPIO pin 27, and specify that it is output
var clientsConnected = 0;
var i=0;

function blink(){
    i++;
    LED.writeSync(LED.readSync() ^ 1);
    if (i==20){
        i=0;
        clearInterval(x);
    }
}

const x=setInterval(blink, 100);

/*
 * Settings:
 * _____________________________________________________
 * */
app.set('port', process.env.port || 3000);

// _____________________________________________________

//Middlewares:
// _____________________________________________________

app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'), () => {
		console.log('HTTP server started on port: ', app.get('port')); 
});

const wss = new WebSocket.Server({ port:8082, clientTracking: true}, () => {
    console.log('Socket server listening on port ', wss.options.port);
});

wss.on('connection', (ws, req) => {
    console.log('New Client connected! ID: ', req.headers["sec-websocket-key"]);
    ws.send('{"msg":"Welcome to the Raspi GPIO Server!!"}');
    clientsConnected++;
    wssBroadcast(`{"clientsConnected": ${clientsConnected}}`);
    ws.send(`{"ledStatus": ${LED.readSync()}}`);
    ledClientConnected.writeSync(1);

    ws.on('message', (data) => {
        console.log(`Client has sent: ${data}`);
        if (data == 'TOGGLE'){
			if (LED.readSync() === 0){
				LED.writeSync(1); 
				console.log('Led is now ON');
				wssBroadcast('{"ledStatus": 1}');
			}
			else 
				{
					LED.writeSync(0); 
					console.log('Led is now OFF');
					wssBroadcast('{"ledStatus": 0}');
				}		
        }
        else if (data == 'DISCONNECT'){
            ws.send('{"msg":"You have been disconnected from server!"}');
            ws.terminate();
        }
        else if (data == 'KICK'){
            wssBroadcast('{"msg":"All clients have been disconnected!"}');
            wssBroadcast(`{"clientsConnected": ${0}}`);
            wss.clients.forEach(function each(client) {
                client.terminate();
            });
        }
    })

    ws.on('close', () => {
        console.log('Client has disconnected!');
        clientsConnected--;
        if (clientsConnected == 0){
            ledClientConnected.writeSync(0);
        }
		else
			wssBroadcast(`{"clientsConnected": ${clientsConnected}}`);
    })
});


function wssBroadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
    });
};
