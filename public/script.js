
const txtReceived = document.getElementById('txtReceived');
const lblClientsConnected = document.getElementById('lblClientsConnected');
const btnOpenClose = document.getElementById('btnOpenClose');
const btnKick = document.getElementById('btnKick');

function wsConnect(){
	var ws=new WebSocket('ws://192.168.1.112:8082');  //ws exists only in function scope
	ws.onopen = function(){
		console.log('We are connected'); 
		btnOpenClose.innerText = "Close Connection"  
	} 
	
	ws.onmessage = function(e){
		console.log(e.data);
		const msgJSON= JSON.parse(e.data);
		var msgTXT='';
		if (msgJSON.msg != null)
			msgTXT = msgJSON.msg;
		else if (msgJSON.ledStatus != null){
			if (msgJSON.ledStatus== 1){
				btnLED.style.backgroundColor = 'green';
				msgTXT='Led is On';
			}
			else{
				btnLED.style.backgroundColor = 'red';
				msgTXT='Led is Off';
			}
		}
		if(msgJSON.clientsConnected != null){
			lblClientsConnected.innerHTML = `Clients connected to the server: ${msgJSON.clientsConnected}`;
			lblClientsConnected.style.color = 'green';
		}
		
		if(msgTXT != ''){
			var d = new Date;
			var hms = '' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' => ';
			txtReceived.innerHTML += hms + msgTXT + '\n';
			txtReceived.scrollTop = txtReceived.scrollHeight;
		}
		
	}
	ws.onerror = function(e){
		console.log(e);
	}
	ws.onclose = function(e){
		console.log('Connection closed');
		console.log(e);
		btnOpenClose.innerText = "Open Connection";
		lblClientsConnected.innerHTML = "Disconnected from server";
		lblClientsConnected.style.color = 'red';
	}

	return ws;	//Returns ws object to be accesible outside function
};


var ws = wsConnect();  //This exists on global scope

btnLED.addEventListener('click', function(){
	ws.send("TOGGLE");
});
btnOpenClose.addEventListener('click', function(){
	if(btnOpenClose.innerText == 'Close Connection'){
		ws.send("DISCONNECT");
		btnOpenClose.innerText = "Open Connection";
	}
	else{
		ws = wsConnect();
		//ws=new WebSocket('ws://192.168.1.112:8082');
		//btnOpenClose.innerText = "Close Connection";
	}
});
btnKick.addEventListener('click', function(){
	ws.send("KICK");
});


