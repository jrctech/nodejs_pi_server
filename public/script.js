const ws=new WebSocket('ws://192.168.1.112:8082');
const txtReceived = document.getElementById('txtReceived');
const lblClientsConnected = document.getElementById('lblClientsConnected');
ws.onopen = function(){
    console.log('We are connected'); 
};

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
}


btnLED.addEventListener('click', function(){
	ws.send("TOGGLE");
});


