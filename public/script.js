var ws=new WebSocket('ws://192.168.1.112:8082');
const txtReceived = document.getElementById('txtReceived');
const lblClientsConnected = document.getElementById('lblClientsConnected');
const btnOpenClose = document.getElementById('btnOpenClose');
const btnKick = document.getElementById('btnKick');

ws.onopen = function(){
	console.log('We are connected'); 
	btnOpenClose.innerText = "Close Connection"  
} 

ws.onmessage = function(e){
    console.log(e.data);
    const msgJSON= JSON.parse(e.data);
    var msgTXT='';
    if (msgJSON.Welcome != null)
		msgTXT = msgJSON.Welcome;
	else if (msgJSON.ledStatus != null){
		if (msgJSON.ledStatus== 1){
			btnLED.style.backgroundColor = '#58FF33';
			msgTXT='Led is On';
		}
		else{
			btnLED.style.backgroundColor = '#C80D12';
			msgTXT='Led is Off';
		}
	}
	if(msgJSON.clientsConnected != null){
		lblClientsConnected.innerHTML = `Clients connected to the server: ${msgJSON.clientsConnected}`;
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
}


btnLED.addEventListener('click', function(){
	ws.send("TOGGLE");
});
btnOpenClose.addEventListener('click', function(){
	if(btnOpenClose.innerText == 'Close Connection'){
		ws.send("DISCONNECT");
		btnOpenClose.innerText = "Open Connection";
	}
	else
		ws=new WebSocket('ws://192.168.1.112:8082');
});
btnKick.addEventListener('click', function(){
	ws.send("KICK");
});


