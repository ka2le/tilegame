var socket = null;

function startConnection(){
	// WebSocket
	socket = new WebSocket( 'wss://' + window.location.host );  
	socket.addEventListener( 'message', doSocketMessage );
	socket.onopen = function () {
		  console.log("Connected");
		  continueOnload();
	};
	socket.onclose = function () {
		  console.log("Socket Was Closed For Some Reason");
		  reconnect(2);
	};
}
function reconnect(number){
	if(number!=2){
		socket.close();
	}
	socket = new WebSocket( 'wss://' + window.location.host );  
	socket.addEventListener( 'message', doSocketMessage );
	socket.onopen = function () {
		  console.log("Re-Connected");
		 // continueOnload();
		 handleReconnect();
	};
}
function send(intent, value, value2){
	
	var message = {
      intent: intent,
	  value: value,
	  value2: value2,
	  sender: role,
	  playerNumber: playerNumber
    };
	socket.send( JSON.stringify( message ) );	 

}

function doSocketMessage( message ) {  
  console.log("doSocketMessage");
  // Parse
  var data = JSON.parse( message.data );
  var intent = data.intent;
  //console.log(intent);
  handleInput(data);
}

