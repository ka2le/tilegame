var role = "player";
var playerNumber;
var joining;
var joinNumber;
var started = false;
var rotation = 0;
function onload(){
	$('.no-zoom').bind('touchend', function(e) {
	  e.preventDefault();
	  // Add your code here. 
	  $(this).click();
	  // This line still calls the standard click event, in case the user needs to interact with the element that is being clicked on, but still avoids zooming in cases of double clicking.
	})
/* 	document.getElementById("sent").style.display = "none";
	document.getElementById("result").style.display = "none"; */
	var url = window.location.href;
	$(".square").click(function() {
		console.log(this);
	});	
	playerNumber = url.split("#")[1];
	console.log(playerNumber);
	startConnection();
	console.log(window.location.host);
	playerNumber--;
	if(playerNumber==0){
		document.getElementById("player1Stuff").style.display = "inline";
	}
	$('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').click(function(){
		$("#nav-icon3").toggleClass('open');
		console.log("menu");
		if($("#menu").is(":visible")){
			$("#menu").slideUp(200);
		}else{
			$("#menu").slideDown(200);
		}
		
	});
	if(window.location.host=="localhost:4330"){
		continueOnload();
	}
}
function continueOnload(){
	//$("#sent").hide();
	console.log("continueOnload");
	document.getElementById("playerNumber").innerHTML = ("Player: "+(playerNumber+1));
	iAmReady();
	waitForOthers();

}
function iAmReady(){
	console.log("iAmReady: " +playerNumber);
	send("iAmReady");
}
function waitForOthers(){
	showContent("waitingDiv");

}
function startGame(numberOfPlayers){
	toggleMenu();
	send("startGame", numberOfPlayers);
}

function handleInput(data){
	console.log(" handleInput(data)");
	console.log(data);
	
	var intent = data.intent;
	console.log(intent);

	if(intent=="relog" && !started){
		var whatToDo = data.value;
		if(whatToDo=="done"){
			document.getElementById("result").innerHTML = "Reconnected";
			document.getElementById("result").style.display = "block";
		}
		if(whatToDo=="newQ"){
			console.log("relog + newQ")
			showOptions();
		}
		started = true;
	}
	if(intent=="hostLoaded" && playerNumber != null){
		started = false;
		document.getElementById("playerNumber").innerHTML = ("Player: "+(playerNumber+1));
		iAmReady();
		/* document.getElementById("result").innerHTML = "Reconnected to host. Waiting...";
		document.getElementById("result").style.display = "block"; */
	}
	if(intent=="tile"){
		if(data.value2 == playerNumber){
			var tileType= data.value;
			document.getElementById("tileImage").src = "img/tile"+tileType+".png";
			rotation = 0;
			document.getElementById("tileImage").style.transform = "rotate("+rotation+"deg)";
			showContent("tileTable");
		}
	}
	if(intent=="placedTile"){
		if(data.value2 == playerNumber){
			$("#tileTable").hide();
			document.getElementById("tileImage").src = "";
			var placedArray = data.value.split("_");
			for(var i =0;i<placedArray.length;i++){
				if(placedArray[i]==0){
					$("#placeMeeple"+i).hide();
				}else{
					$("#placeMeeple"+i).show();
				}		
			}
			showContent("meepleTable");
		}
	}
	if(intent=="turnDone"){
		if(data.value2 == playerNumber){
			showContent("waitingDiv");
		}
	}
}
function showContent(id){
	document.getElementById("tileTable").style.display = "none";
	document.getElementById("meepleTable").style.display = "none";
	document.getElementById("waitingDiv").style.display = "none";
	document.getElementById(id).style.display = "inline";
}

function answer(theAnswer){
	send("answer", theAnswer);
}


function move(direction){
	send("move",direction);
}
/* function reconnect(){
	send("reconnect");
} */
function initReconnect(){
	toggleMenu();
	reconnect();
}
function handleReconnect(){
	console.log("handleReconnect");
	send("reconnect");
}

function rotate(direction){
	console.log(rotation);
	if(direction=="left"){
		rotation -= 90;
	}
	if(direction=="right"){
		rotation += 90;
	}
	document.getElementById("tileImage").style.transform = "rotate("+rotation+"deg)";
	send("rotate",direction);
}
function zoom(value){
	send("zoom",value);
}
function place(){
	//$("#tileTable").hide();
	send("place");
}
function reroll(){
	toggleMenu();
	send("reroll");
}
function placeMeeple(value){
	//$("#meepleTable").hide();
	send("placeMeeple", value);
}

function toggleMenu(){
		$("#nav-icon3").toggleClass('open');
		console.log("menu");
		if($("#menu").is(":visible")){
			$("#menu").slideUp(200);
		}else{
			$("#menu").slideDown(200);
		}
}
//--------------------------------------------Test-------------------------------------
function test(){
	console.log("testFunction");	
	if(window.location.host=="localhost:4330"){
		testStart();
		
	}
	toggleMenu();

}

function divFunction(number){

	console.log("divFunction " + number);
}

function testTile(type){
	toggleMenu();
	var message = {
      intent: "tile",
	  value: type,
	  value2: playerNumber,
	  sender: "host",
	  playerNumber: 1
    };
	handleInput(message);
}
function testPlaceMeeple(){
toggleMenu();
	var message = {
      intent: "placedTile",
	  value: "1_1_1_1_1",
	  value2: 0,
	  sender: "host",
	  playerNumber: 1
    };
	handleInput(message);
}
function testPlaceMeeple2(){
toggleMenu();
	var message = {
      intent: "placedTile",
	  value: "1_0_1_0_0",
	  value2: 0,
	  sender: "host",
	  playerNumber: 1
    };
	handleInput(message);
}
function testDone(){
toggleMenu();
	var message = {
      intent: "turnDone",
	  value: "",
	  value2: 0,
	  sender: "host",
	  playerNumber: 1
    };
	handleInput(message);
}

function testStart(){
toggleMenu();
	var message = {
      intent: "starting",
	  value: 1,
	  value2: 1,
	  sender: "host",
	  playerNumber: playerNumber
    };
	handleInput(message);
}
function testNew(){
toggleMenu();
	var message = {
      intent: "newQ",
	  value: 1,
	  value2: 1,
	  sender: "host",
	  playerNumber: playerNumber
    };
	handleInput(message);
}
function testFunction(){
toggleMenu();
	var message = {
      intent: "loginFree",
	  value: 1,
	  value2: 1,
	  sender: role,
	  playerNumber: playerNumber
    };
	handleInput(message);
}
function testFunction2(){
toggleMenu();
	var message = {
      intent: "loginTaken",
	  value: 1,
	  value2: 1,
	  sender: role,
	  playerNumber: playerNumber
    };
	handleInput(message);
}
function testCorrect(){
toggleMenu();
	var message = {
      intent: "score",
	  value: 1,
	  value2: 1,
	  sender: role,
	  playerNumber: 0
    };
	handleInput(message);
}

function testFunction3(){
toggleMenu();
	var message = {
      intent: "score",
	  value: 1,
	  value2: 1,
	  sender: role,
	  playerNumber: playerNumber
    };
	handleInput(message);
}
function testFunction4(){
toggleMenu();
	var message = {
      intent: "newQ",
	  value: 1,
	  value2: 1,
	  sender: role,
	  playerNumber: playerNumber
    };
	handleInput(message);
}