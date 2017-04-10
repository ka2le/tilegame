var role = "host";
var playerNumber = 0;
var players = [0,0];

var playerTurn = 1;
var numberOfPlayers = 1;
var sun = new Image();
var moon = new Image();
var earth = new Image();
var playerMovement = [0,0]
var playerPos = [100,100]
var playerHeigth= 30;
var jumping = false;
var jumpCounter = 0;
var stepLenght = 7;
var keyisup = true;
var allObjects = [];
var fallspeed = 3;
var offsetX =10;
var offsetY =10;
var player1;
var gridSize=30;
var squareSize = 70;
var zoomSpeed = 20;
var theCanvas;
var pixelWidth = 1200;
var pixelHeight = 800;
var theSquares = [];
var rotation = 1;
var activeSquare;
var activeSquareImg = new Image();
var TO_RADIANS = Math.PI/2;
var allTiles = []; 
var borderColor = "black";
function onload(){
	console.log("start");
	startConnection();
	theCanvas = document.getElementById("theCanvas");
	theCanvas.height = pixelHeight;
	theCanvas.width = pixelWidth;
	var margin = gridSize/4;
	for(var x= 0; x<gridSize; x++){
		var xpos= x*squareSize-(margin*squareSize);
		var column = [];
		for(var y= 0; y<gridSize; y++){
			var ypos= y*squareSize-(margin*squareSize);
			var square = new object("square", squareSize, squareSize,xpos,ypos,x,y, 'img/square.png', 0, "rgb(255,0,0)","rgb(0,0,0)",1);
			//var square = new object("square", squareSize, squareSize,4,4,4,4, 'img/square.png', "solid", "rgb(255,0,0)","rgb(0,0,0)",1);
			column.push(square);
		}
		theSquares.push(column);
	}
	allObjects[400].updateType(2);
	var x = 13;
	var y = 11;
	xpos= x*squareSize-(margin*squareSize);
	ypos= y*squareSize-(margin*squareSize);
	activeSquare = new object("square", squareSize, squareSize,xpos,ypos,x,y, "img/tile1.png", 1, "rgb(255,0,0)","rgb(0,0,0)",1);
	//updateTemp();
	init();
	createTheTiles();
	//createCanvases();
	var testArray = [1,2,3,4];
	console.log(rotateBorders(testArray,2));
}
function continueOnload(){
	console.log("continueOnload does nothing now on host.");
	send("hostLoaded");
}

function rotateBorders(borders, theRotation){
	var tempArray = [];
	if(theRotation==1){
		tempArray = [borders[0],borders[1],borders[2],borders[3]];
	}
	if(theRotation==2){
		tempArray = [borders[3],borders[0],borders[1],borders[2]];
	}
	if(theRotation==3){
		tempArray = [borders[2],borders[3],borders[0],borders[1]];
	}
	if(theRotation==4){
		tempArray = [borders[1],borders[2],borders[3],borders[0]];
	}
	/* theRotation=theRotation-1;
	
	for(var i= 0; i<borders.length; i++){
		tempArray.push(borders[(i+theRotation)%4]);
	} */
	return(tempArray);
}

function createTheTiles(){
	var newTile; 
	newTile = new tile(1, "road", "grass","road", "grass", "none",10);
	newTile = new tile(2, "road", "town", "road", "grass", "none",5);
 	newTile = new tile(3, "grass", "grass","road", "road", "none",5);
	newTile = new tile(4, "grass", "road", "road", "road", "block",4);
	newTile = new tile(5, "town", "town",  "grass", "grass", "none",2);
	newTile = new tile(6, "grass", "town",  "road", "road", "none",2);
	newTile = new tile(7, "town", "town",  "town", "grass", "town",2);
	newTile = new tile(8, "grass", "town",  "grass", "grass", "none",3);
	newTile = new tile(9, "grass", "grass",  "grass", "grass", "church",1);
	newTile = new tile(10, "grass", "town",  "grass", "town", "grass",1);
	newTile = new tile(11, "town", "town",  "grass", "grass", "grass",1);
	newTile = new tile(12, "road", "town",  "road", "road", "block",1);
	newTile = new tile(13, "grass", "grass",  "grass", "road", "church",3);
	newTile = new tile(14, "road", "road",  "road", "road", "block",3);
	newTile = new tile(15, "town", "town",  "town", "town", "town",1); 
	console.log(allTiles);
}
function tile(type, left, top,right, bottom, center, numberOfThisType){
	this.type= type;
	this.left= left;
	this.right= right;
	this.top= top;
	this.bottom= bottom;
	this.borders = [left, top, right, bottom];
	this.center= center;
	for(var i = 0; i<numberOfThisType; i++){
		allTiles.push(this);
	}
	
}

function getTileByType(type){
	for(var i= 0; i<allTiles.length; i++){
		if(allTiles[i].type==type){
			return allTiles[i];
		}
	}
}

function getBorders(theSquare){
	var tempBorders = getTileByType(theSquare.type).borders;
	return rotateBorders(tempBorders, theSquare.rotate)
}
function placeTile(){
	var theActive = activeSquare;
	var updateSquare = findXY(activeSquare.valueX, activeSquare.valueY);
	if(updateSquare.type==0){
		var leftTile=  findXY(activeSquare.valueX-1, activeSquare.valueY);
		var rightTile=  findXY(activeSquare.valueX+1, activeSquare.valueY);
		var topTile=  findXY(activeSquare.valueX, activeSquare.valueY-1);
		var bottomTile=  findXY(activeSquare.valueX, activeSquare.valueY+1);
		var completeMatch = true;
		var thisBordes = getBorders(activeSquare);
		console.log("this borders: "+thisBordes);
		if(leftTile.type>0 || rightTile.type>0 || topTile.type>0 || bottomTile.type>0){
			if(leftTile.type>0){
				var currentBorders = getBorders(leftTile);
				
				if(currentBorders[2]!=thisBordes[0]){
					completeMatch=false;
					console.log(currentBorders[2]+"<LEFT MISMATCH current>"+thisBordes[0]);
				}else{
					console.log(currentBorders[2]+"<LEFT Match current>"+thisBordes[0]);
				}
			}
			if(rightTile.type>0){
				var currentBorders = getBorders(rightTile);
				if(currentBorders[0]!=thisBordes[2]){
					completeMatch=false;
					console.log(currentBorders[0]+"<RIGHT MISMATCH current>"+thisBordes[2]);
				}else{
					console.log(currentBorders[0]+"<RIGHT MATCH current>"+thisBordes[2]);
				}
			}
			if(topTile.type>0){
				var currentBorders = getBorders(topTile);
				if(currentBorders[3]!=thisBordes[1]){
					completeMatch=false;
					console.log(currentBorders[3]+"<TOP MISMATCH current>"+thisBordes[1]);
				}else{
					console.log(currentBorders[3]+"<TOP MATCH current>"+thisBordes[1]);
				}
			}
			if(bottomTile.type>0){
				var currentBorders = getBorders(bottomTile);
				if(currentBorders[1]!=thisBordes[3]){
					completeMatch=false;
					console.log(currentBorders[1]+"<Bottom  MISMATCH current>"+thisBordes[3]);
				}else{
					console.log(currentBorders[1]+"<Bottom  MAtCH current>"+thisBordes[3]);
				}
			}
			if(completeMatch){
				updateSquare.updateType(1);
				waitForMeeple();
			}else{
				console.log("does not match");
				cantPlaceTile();
			}
		}else{
			console.log("must place next to other square");
			cantPlaceTile();
		}
	}else{
		console.log("square taken");
		cantPlaceTile();
	}
}
function redrawSquare(theSquare){
	//console.log("redrawSquare");
	//rotation = (rotation%4)+1;
	//console.log("rotateRight"+ rotation);
	drawRotateToTemp("img/tile"+theSquare.type+".png", theSquare.rotate);
	theSquare.setImg(getTempSrc());
	//this.rotate = rotation;
}
function help(){
	var theActive = activeSquare;
	console.log(activeSquare);
	console.log(getBorders(activeSquare));
	console.log(activeSquare.rotate);
	var underSquare =  findXY(activeSquare.valueX, activeSquare.valueY);
	if(underSquare.type>0){
		console.log("underSquare");
		console.log(underSquare);
		console.log(getBorders(underSquare));
		console.log(underSquare.rotate);
	}
					
}
function cantPlaceTile(){
	borderColor="red";
	console.log("cantPlaceTile");
}

//---------------------------------------------The squares function----------------------------------------------------------------------------
function object(name, width, height, pixelX, pixelY,valueX,valueY, src, type, color, colorBorder, colliedLevel){
	this.name = name;
	this.height = height;
	this.width = width;
	this.x = pixelX;
	this.y = pixelY;
	this.valueX = valueX;
	this.valueY = valueY;
	this.active = false;
	this.hasImage = true;
	this.type= type;
	this.disabled = false;
	this.rotate= 1;
	this.meeplePos = 0;
	this.meepleColor;
	this.colliedLevel = colliedLevel; 
	if(src == ""){
		this.hasImage = false;
	}else{
		var image = new Image();
		image.src = src;
		this.image = image;
		this.image.onload = function(){
			//console.log("this.image.onload ");
			//updateTemp();
		};
		this.imageOriginal = image;
		this.src = src;
	}
	this.activate = function () {
		for(var i=0; i<allObjects.length; i++){
			allObjects[i].setImg(allObjects[i].imageOriginal.src);
			allObjects[i].active = false;
		}
		this.setImg(getTempSrc());
		this.active = true;
    };
	this.setImg = function (src) {
        var image = new Image();
		image.src = src;
		this.image = image;
		this.src = src;
    };
	this.updateType = function (type) {
		if(type==1){
			this.setImg(activeSquare.image.src);
			this.type = activeSquare.type;
			this.rotate = rotation;
			this.imageOriginal = this.image;
		}
		if(type==2){
			this.setImg("img/tile"+type+".png");
			this.type = type;
			this.rotate = rotation;
			this.imageOriginal = this.image;
		}
		if(type=="randomTile"){
			var numberOfTiles =allTiles.length;
			var randomNumber = Math.floor(Math.random() * numberOfTiles) + 1;
			var tileType = allTiles[randomNumber-1].type;
			this.setImg("img/tile"+tileType+".png");
			activeSquareImg.src=("img/tile"+tileType+".png");
			this.rotate=1;
			rotation=1;
			this.imageOriginal = this.image;
			this.type= tileType;
		}
    };
	this.rotateRight = function () {
		rotation = (rotation%4)+1;
		console.log("rotateRight"+ rotation);
		drawRotateToTemp(this.imageOriginal.src, rotation);
		this.setImg(getTempSrc());
		this.rotate = rotation;
		//this.imageOriginal = this.image;
		//this.active = true;
    };
	this.rotateLeft = function () {
		rotation = ((rotation+2)%4)+1;
		console.log("rotateRight"+ rotation);
		drawRotateToTemp(this.imageOriginal.src, rotation);
		this.setImg(getTempSrc());
		this.rotate = rotation;

    };
	this.copyPos = function (otherSquare) {
		this.x= otherSquare.x;
		this.y= otherSquare.y;
		this.valueX= otherSquare.valueX;
		this.valueY= otherSquare.valueY;
		//this.rotate = rotation;
		//this.active = true;
    };
	this.rotate = 1;
	this.color = color;
	this.colorBorder = colorBorder;
	this.movement = [0,0];
	this.move = function (x,y) {
        this.x += x;
		this.y += y;
    };
	allObjects.push(this);
}

function findActive(){
	for(var i=0; i<allObjects.length; i++){
		if(allObjects[i].active){
			return allObjects[i];
		}
	}
}
function placeMeeple(position){
	console.log("placeMeeple");
	var teamColor = "red";
	var tileToPlaceOn = findXY(activeSquare.valueX,activeSquare.valueY);
	tileToPlaceOn.meeplePos = position;
	tileToPlaceOn.meepleColor = teamColor;
	
	
}
function findXY(x,y){
	for(var i=0; i<allObjects.length; i++){
		if(allObjects[i].valueX==x && allObjects[i].valueY==y){
			return allObjects[i];
		}
	}
}
function init() {
  window.requestAnimationFrame(draw);
}
function animate(thisObject){
	thisObject.height = thisObject.height/2;
}
var updateFrequenzy = 500;
var clockruns = 0;
var extraUpdate = false;
//-------------------------------------------------DRAW------------------------------------------------------------------------
function draw() {
  var ctx = document.getElementById('theCanvas').getContext('2d');
  var time = new Date();
  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, pixelWidth, pixelHeight); // clear canvas
  //moveAll();
  //draw all objects
  clockruns++;
  extraUpdate = false;
	if( clockruns>updateFrequenzy){
		clockruns = 0;
		extraUpdate = true;
	}
  for(var i=0; i<allObjects.length; i++){
	var theObject = allObjects[i];
		
		if(theObject.hasImage && !theObject.disabled){
			//if(extraUpdate){
				if(theObject.type>0){
					redrawSquare(theObject);
				}
			//}
			
			
			ctx.drawImage(theObject.image, theObject.x+offsetX, theObject.y+offsetY, theObject.width, theObject.height);
		}else{
			ctx.fillStyle = theObject.color;
			ctx.strokeStyle =  theObject.colorBorder;
			ctx.fillRect(theObject.x+offsetX,theObject.y+offsetY,theObject.width, theObject.height);
		}
		if(theObject.meeplePos>0){
			var meepleSquare = [];
			meepleSquare.height = theObject.height/4;
			meepleSquare.width = theObject.width/4;
			ctx.fillStyle = theObject.meepleColor;
			ctx.strokeStyle =  theObject.meepleColor;
			if(theObject.meeplePos==1){
				meepleSquare.x = theObject.x+offsetX+0;
				meepleSquare.y = theObject.y+offsetY+(theObject.height/5*2);
			}
			if(theObject.meeplePos==2){
				meepleSquare.x = theObject.x+offsetX+(theObject.width/5*2);
				meepleSquare.y = theObject.y+offsetY+0;
			}
			if(theObject.meeplePos==3){
				meepleSquare.x = theObject.x+offsetX+(theObject.width/11*8);
				meepleSquare.y = theObject.y+offsetY+(theObject.height/5*2);
			}
			if(theObject.meeplePos==4){
				meepleSquare.x = theObject.x+offsetX+(theObject.width/5*2);
				meepleSquare.y = theObject.y+offsetY+(theObject.height/11*8);
			}
			if(theObject.meeplePos==5){
				meepleSquare.x = theObject.x+offsetX+(theObject.width/5*2);
				meepleSquare.y = theObject.y+offsetY+(theObject.height/5*2);
			}
			ctx.clearRect(meepleSquare.x, meepleSquare.y, meepleSquare.width, meepleSquare.height); // clear canvas
			ctx.fillRect(meepleSquare.x, meepleSquare.y, meepleSquare.width, meepleSquare.height);
		}
	 }
	 if(!activeSquare.disabled){
			 ctx.clearRect(activeSquare.x+offsetX, activeSquare.y+offsetY, activeSquare.width, activeSquare.height); // clear canvas
		  ctx.fillStyle = borderColor;
		  ctx.fillRect(activeSquare.x+offsetX, activeSquare.y+offsetY, activeSquare.width, activeSquare.height);
		  ctx.clearRect(theObject.x+offsetX+5, theObject.y+offsetY+5, theObject.width-10, theObject.height-10); // clear canvas
		  theObject = activeSquare;
		  updateTemp();
		  var tempCanvas = document.getElementById("tempCanvas");
		ctx.drawImage(tempCanvas, theObject.x+offsetX+5, theObject.y+offsetY+5, theObject.width-10, theObject.height-10);
	 }

	  ctx.save();
	window.requestAnimationFrame(draw);
}
function drawRotateToTemp(src, rotate){
	//console.log("draw rotate "+rotate);
	var canvas = document.getElementById('tempCanvas');
	var ctx = document.getElementById('tempCanvas').getContext('2d');
	ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, squareSize, squareSize); // clear canvas
  ctx.translate(canvas.width/2,canvas.height/2);
  var angle = (rotate-1);
  var radianAngle = TO_RADIANS*angle;
  ctx.rotate(radianAngle);

	var image = new Image();
	image.src = src;
	
   ctx.drawImage(image, -(squareSize/2), -(squareSize/2), squareSize,squareSize);
   ctx.translate(-canvas.width/2,-canvas.height/2);
  ctx.save();
}

function getTempSrc(){
	var tempCanvas = document.getElementById("tempCanvas")
	var src = tempCanvas.toDataURL("image/png");
	return src;
}
function updateTemp(){
if(activeSquare.rotate == 1){
		 var canvas = document.getElementById('tempCanvas');
	var ctx = document.getElementById('tempCanvas').getContext('2d');
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, squareSize, squareSize); // clear canvas
	ctx.drawImage(activeSquare.image, 0, 0, squareSize,squareSize);
	ctx.save();
}

}
//-------------------------------------------------Handle Player Turns------------------------------------------------------------------------
var theTurn = "";
function newRound(){
	send("turnDone", "scoreHereLater", playerTurn);
	playerTurn++;
	if(playerTurn>numberOfPlayers){
		playerTurn=1;
	}
	drawNewTile();
	theTurn = "newRound";
	send("tile", activeSquare.type, playerTurn);
}
function waitForMeeple(){
	console.log("waitForMeeple");
	theTurn = "waitForMeeple";
	send("placedTile", "", playerTurn);
	activeSquare.disabled = true;
}
function drawNewTile(){
	activeSquare.disabled = false;
	activeSquare.updateType("randomTile");
	updateTemp();
}
function restartGame(howManyPlayers){
	numberOfPlayers=howManyPlayers;
	playerTurn=1;
	allObjects = [];
	var margin = gridSize/4;
	for(var x= 0; x<gridSize; x++){
		var xpos= x*squareSize-(margin*squareSize);
		var column = [];
		for(var y= 0; y<gridSize; y++){
			var ypos= y*squareSize-(margin*squareSize);
			var square = new object("square", squareSize, squareSize,xpos,ypos,x,y, 'img/square.png', 0, "rgb(255,0,0)","rgb(0,0,0)",1);
			//var square = new object("square", squareSize, squareSize,4,4,4,4, 'img/square.png', "solid", "rgb(255,0,0)","rgb(0,0,0)",1);
			column.push(square);
		}
		theSquares.push(column);
	}
	allObjects[400].updateType(2);
	var x = 13;
	var y = 11;
	xpos= x*squareSize-(margin*squareSize);
	ypos= y*squareSize-(margin*squareSize);
	activeSquare = new object("square", squareSize, squareSize,xpos,ypos,x,y, "img/tile1.png", 1, "rgb(255,0,0)","rgb(0,0,0)",1);
	//updateTemp();
	init();
	createTheTiles();
	send("tile", activeSquare.type, playerTurn);
}
//-------------------------------------------------Handle Input------------------------------------------------------------------------
function handleInput(data){
	console.log(" handleInput(data)");
	console.log(data);
	
	var intent = data.intent;
	console.log(intent);
	if(intent=="reconnect"){
		if(data.playerNumber == playerTurn){
		if(theTurn=="newRound"){
			send("tile", activeSquare.type, playerTurn);
		}
		if(theTurn=="newRound"){
			send("placedTile", "", playerTurn);
		}
	} 
	if(intent=="placeMeeple"){
		var pos = data.value;
		if(pos==0){
			
		}else{
			placeMeeple(pos);	
		}
		newRound();
	}
	if(intent=="startGame"){
		howManyPlayers = data.value;
		 restartGame(howManyPlayers);
	}
	if(intent=="move"){
		var direction = data.value;
		if(direction=="up"){
			moveTile("up");
		}
		if(direction=="down"){
			moveTile("down");
		}
		if(direction=="left"){
			moveTile("left");
		}
		if(direction=="right"){
			moveTile("right");
		}
	}
	if(intent=="zoom"){
		var value = data.value;
		if(value=="in"){
			zoomIn();
		}if(value=="out"){
			zoomOut();
		}
	}
	if(intent=="place"){
		placeTile();
	}
	if(intent=="rotate"){
		var direction = data.value;
		if(direction=="left"){
			activeSquare.rotateLeft();
		}
		if(direction=="right"){
			activeSquare.rotateRight();
		}
	}	
	
}

//-------------------------------------------------Handle Input------------------------------------------------------------------------
function moveTile(direction){
	var theActive = activeSquare;
	var newSquare;
	if(direction=="up"){
		newSquare = theSquares[theActive.valueX][theActive.valueY-1];
	}
	if(direction=="down"){
		newSquare = theSquares[theActive.valueX][theActive.valueY+1];
	}
	if(direction=="left"){
		newSquare = theSquares[theActive.valueX-1][theActive.valueY];
	}
	if(direction=="right"){
		newSquare = theSquares[theActive.valueX+1][theActive.valueY];
	}
	activeSquare.copyPos(newSquare);
	newSquare.activate();
}
function startPlayerTurn(player){
	send("tile", activeSquare.type, player);

}
function zoomIn(){
	pixelHeight = (pixelHeight/zoomSpeed)*(zoomSpeed-1);
	pixelWidth =  (pixelWidth/zoomSpeed)*(zoomSpeed-1);
	stepLenght = (stepLenght/zoomSpeed)*(zoomSpeed-1);
	theCanvas.height = pixelHeight;
	theCanvas.width = pixelWidth;
}
function zoomOut(){
	pixelHeight = (pixelHeight/zoomSpeed)*(zoomSpeed+1);
	pixelWidth =  (pixelWidth/zoomSpeed)*(zoomSpeed+1);
	stepLenght = (stepLenght/zoomSpeed)*(zoomSpeed+1);
	theCanvas.height = pixelHeight;
	theCanvas.width = pixelWidth;

}

$(function() {
	   $(window).keydown(function(e) {
	   if(!activeSquare.disabled){
		   var key = e.which;
		console.log("key pressed: "+key); //do stuff with "key" here...
			borderColor = "black";
		  if(key == 87 && !jumping){
				offsetY += stepLenght;
		  }
		  // up arrow
		   if(key == 38){
				moveTile("up");
		  }
		   // down arrow
		   if(key == 40){
				moveTile("down");
		  }
		   // left arrow
		   if(key == 37){
				moveTile("left");
		  }
		  // right arrow
		   if(key == 39){
				moveTile("right");
		  }
			//enter
		  if(key == 13){
			placeTile();
		  }
		   // E
		   if(key == 69){
				var theActive = activeSquare;
				theActive.rotateRight();
				console.log("rotated to: " +theActive.rotate);
				//newSquare.activate();
		  }
		     // R for reload
		   if(key == 82){
				drawNewTile();
		  }
		   // number 1
		   if(key == 49){
				placeMeeple(1);
		  }
		   // number 2
		   if(key == 50){
				placeMeeple(2);
		  }
		   // number 3
		   if(key == 51){
				placeMeeple(3);
		  }
		   // number 4
		   if(key == 52){
				placeMeeple(4);
		  }
		   // number 5
		   if(key == 53){
				placeMeeple(5);
		  }
		  //H for Help
		   if(key == 72){
		        help();
				
				//newSquare.activate();
		  }
		   if(key == 81){
				//var theActive = activeSquare;
				activeSquare.rotateLeft();
		  }
		  // +
		   if(key == 107){
				zoomIn()
				//newSquare.activate();
		  }
		  //-
		   if(key == 109){
			zoomOut();
			
				//newSquare.activate();
		  }
		  //S
		  if(key == 83){
			playerMovement[1] = stepLenght;
			offsetY -= stepLenght;
		  }
		  //D
		  if(key == 68){
			allObjects[0].movement[0] = stepLenght;
			offsetX += stepLenght;
		  }
		   //A
		  if(key == 65){
			allObjects[0].movement[0] = -stepLenght;
			offsetX -= stepLenght;
		  }
		  }
	   });
	});


function testNoMeeple(meeple){
	var message = {
      intent: "placeMeeple",
	  value: meeple,
	  value2: 1,
	  sender: "host",
	  playerNumber: 1
    };
	handleInput(message);
}	
	
/* function createCanvases(){
	var createSquare;
	var container = document.getElementById("theImages");
	for(var i= 1; i<allTiles.length+1; i++){
		//createSquare = new object("square", squareSize, squareSize,0,0,0,00, "img/tile"+i+".png", 1, "rgb(255,0,0)","rgb(0,0,0)",1);
		var src = "img/tile"+i+".png";
		console.log(src);
		for(var j= 1; j<5; j++){
			var rotate = j;
			container.innerHTML += '<canvas height="'+squareSize+'px" width="'+squareSize+'px" id="canvas'+i+'_'+j+'"></canvas>'
			var newCanvas = document.getElementById('canvas'+i+'_'+j);
			drawRotated(src, rotate, newCanvas);
		}
	}
}
function drawRotated(src, rotate, canvas){
	console.log("drawing " +src + " with rotation " +rotate+ " on canvas "+canvas.id  )
	console.log(canvas);
	var ctx = canvas.getContext('2d');
	ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, squareSize, squareSize); // clear canvas
  ctx.translate(canvas.width/2,canvas.height/2);
  var angle = (rotate-1);
  var radianAngle = TO_RADIANS*angle;
  ctx.rotate(radianAngle);
	var image = new Image();
	image.src = src;
   ctx.drawImage(image, -(squareSize/2), -(squareSize/2), squareSize,squareSize);
   ctx.translate(-canvas.width/2,-canvas.height/2);
  ctx.save();
} */


// -------------------------------------------------------- PHP Kod 
/* $.post( "php/php.php",   { 
		value: "test", 
		value2: "test2"
		},
	function( data ) {
		console.log(data);
		
	}); */