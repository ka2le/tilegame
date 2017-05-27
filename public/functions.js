var role = "host";
var playerNumber = 0;
var players = [];
var playerTurn = 0;
var numberOfPlayers = 0;
var teamColors = ["blue", "red", "yellow", "green", "black"];
var startX = 15;
var startY = 15;
var allTilesTypes = [];
var totalNumberOfRounds = 72;
var playerMovement = [0,0]
var playerPos = [100,100]
var playerHeigth= 30;
var jumping = false;
var jumpCounter = 0;
var stepLenght = 7;
var keyisup = true;
var allObjects = [];
var fallspeed = 3;
var offsetX =0;
var offsetY =0;
var player1;
var gridSize=30;
var margin = gridSize/4;
var squareSize = 120;
var zoomSpeed = 5; 
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
var drawDelay = 50;
var cheatsOn = false;
function onload(){
	//console.log("start");
	startConnection();
	theCanvas = document.getElementById("theCanvas");
	updateCanvasSize();
//console.log(pixelHeight);
	document.getElementById("tempCanvas").height = squareSize;
	document.getElementById("tempCanvas").width = squareSize;
	//var margin = gridSize/4;
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
	var x = startX;
	var y = startY;
	xpos= x*squareSize-(margin*squareSize);
	ypos= y*squareSize-(margin*squareSize);
	activeSquare = new object("square", squareSize, squareSize,xpos,ypos,x,y, "img/tile1.png", 1, "rgb(255,0,0)","rgb(0,0,0)",1);
	//updateTemp();
	init();
	createTheTiles();
	//console.log(allTiles);
	findXY(startX,startY-1).updateType(2);
	//allObjects[400]
	//createCanvases();
	var testArray = [1,2,3,4];
	//console.log(rotateBorders(testArray,2));
	resetPlayers();
	$(window).resize(function () {
		updateCanvasSize();
	});
	centerTiles();
	//console.log("players");
	//console.log(players);
	//createTransparentMeeple();
	$( "#menuContainer" ).click(function( event ) {
		event.stopPropagation();
		// Do something
	});
	$("#cheatsCheck").click(function() {
        if($(this).is(":checked")){
			enableCheats()
		}else{
			disableCheats();
		}
    });
	$('.scoreText').change(function() { 
		insertCheatScore();
	});	
	//$("#menuContainer").onclick().stopPropagation();
}
function insertCheatScore(){
	console.log("insertCheatScore()");
	for(var i =0; i<players.length; i++){
		$("#player"+(i+1)).addClass("playerInfo");
		if(players[i].active){
			players[i].score = parseInt(document.getElementById("scoreTextPlayer"+(i+1)).value);
			players[i].potentialScore = parseInt(document.getElementById("potentialTextPlayer"+(i+1)).value);
			players[i].meeplesLeft = parseInt(document.getElementById("meeplePlayer"+(i+1)).value);
		}
	}
}
function enableCheats(){
	cheatsOn = true;
	$(".scoreText").prop('readonly', false);
}
function disableCheats(){
	cheatsOn = false;
	$(".scoreText").prop('readonly', true);
}
function toggleMenu(){
	console.log("toggleMenu");
	if($("#menubackground").is(':visible')){
		$("#menubackground").fadeOut("fast");
	}else{
		$("#menubackground").fadeIn("fast");
	}
	
}
function hideMenu(){
	$("#menubackground").fadeOut("fast");
}
function updateCanvasSize(){
	//console.log("updateCanvasSize");
	/* theCanvas = document.getElementById("theCanvas");
	pixelHeight = $('#theCanvas').height()/4*3;
	pixelWidth = $('#theCanvas').width()/4*3;
	theCanvas.height = pixelHeight;
	theCanvas.width = pixelWidth; */
	centerTiles();
}
function continueOnload(){
	//console.log("continueOnload does nothing now on host.");
	send("hostLoaded");
}
function resetPlayers(){
	players = [];
	for(var i = 0; i<5; i++){
		if(numberOfPlayers>i){
			var newPlayer = new player(i, true);
		}else{
			var newPlayer = new player(i, false);
		}
	}
	updatePlayerInfo();
}
function player(number, active){
	this.number = number;
	this.active = active;
	this.meeplesLeft = 7;
	this.potentialScore = 0;
	this.score = 0;
	this.teamColor = teamColors[number];
	players.push(this);
}
function createTheTiles(){
var testSomeTiles = false;
if(testSomeTiles){
	var newTile;
	newTile = new tile(1, "road", "grass","road", "grass", "none",10);
	newTile = new tile(2, "road", "town", "road", "grass", "none",5);
	for(var i = 0; i<1; i++){
		newTile = new tile(1, "road", "grass","road", "grass", "none",10);
	}
	for(var i = 0; i<1; i++){
		newTile = new tile(13, "grass", "grass",  "grass", "road", "church",3);
	}

}else{
 var newTile;

	for(var i = 0; i<9; i++){
		newTile = new tile(1, "road", "grass","road", "grass", "none",10);
	}
	for(var i = 0; i<4; i++){
		newTile = new tile(2, "road", "town", "road", "grass", "none",5);
	}
	for(var i = 0; i<9; i++){
		newTile = new tile(3, "road", "grass","grass", "road", "none",5);
	}
	for(var i = 0; i<4; i++){
		newTile = new tile(4, "road", "grass", "road", "road", "block",4);
	}
	for(var i = 0; i<3; i++){
		newTile = new tile(5, "town", "town",  "grass", "grass", "none",2);
	}
	for(var i = 0; i<3; i++){
		newTile = new tile(6, "grass", "town",  "road", "road", "none",2);
	}
	for(var i = 0; i<3; i++){
		newTile = new tile(7, "town", "town",  "town", "grass", "none",2);
	}
	for(var i = 0; i<5; i++){
		newTile = new tile(8, "grass", "town",  "grass", "grass", "none",3);
	}
	for(var i = 0; i<4; i++){
		newTile = new tile(9, "grass", "grass",  "grass", "grass", "church",1);
	}
	for(var i = 0; i<3; i++){
		newTile = new tile(10, "grass", "town",  "grass", "town", "block",1);
	}
	for(var i = 0; i<2; i++){
		newTile = new tile(11, "town", "town",  "grass", "grass", "block",1);
	}
	for(var i = 0; i<3; i++){
		newTile = new tile(12, "road", "town",  "road", "road", "block",1);
	}
	for(var i = 0; i<2; i++){
		newTile = new tile(13, "grass", "grass",  "grass", "road", "church",3);
	}
	for(var i = 0; i<1; i++){
		newTile = new tile(14, "road", "road",  "road", "road", "block",3);
	}
	for(var i = 0; i<1; i++){
		newTile = new tile(15, "town", "town",  "town", "town", "none",1, true); 
	}
	for(var i = 0; i<2; i++){
		newTile = new tile(16, "town", "grass",  "town", "grass", "none",1, true); 
	}
	for(var i = 0; i<2; i++){
		newTile = new tile(17, "town", "town",  "town", "road", "none",1, true); 
	}
	for(var i = 0; i<2; i++){
		newTile = new tile(18, "town", "town",  "road", "road", "none",1,true); 
	}
	for(var i = 0; i<3; i++){
		newTile = new tile(19, "road", "town",  "grass", "road", "none",1); 	
	} 
	for(var i = 0; i<2; i++){
		newTile = new tile(20, "town", "town",  "grass", "grass", "none",2, true);
	}
	for(var i = 0; i<1; i++){
		newTile = new tile(21, "town", "town",  "town", "grass", "none",2, true);
	}
	for(var i = 0; i<1; i++){
		newTile = new tile(22, "town", "grass",  "town", "grass", "none",1); 
	}
	for(var i = 0; i<2; i++){
		newTile = new tile(23, "town", "town",  "road", "road", "none",1); 
	}	
	for(var i = 0; i<1; i++){
		newTile = new tile(24, "town", "town",  "town", "road", "none",1); 
	}
	//console.log(allTiles);
	}
}
function tile(type, left, top,right, bottom, center, numberOfThisType, hasShield){
	this.type= type;
	this.left= left;
	this.right= right;
	this.top= top;
	this.bottom= bottom;
	this.borders = [left, top, right, bottom, center];
	this.center= center;
	this.hasShield = false;
	if(hasShield){
		this.hasShield = true;
	}
	this.id= allTiles.length;
	allTiles.push(this);
	allTilesTypes.push(this);
}

function getTileByType(type){
	for(var i= 0; i<allTilesTypes.length; i++){
		if(allTilesTypes[i].type==type){
			return allTilesTypes[i];
		}
	}
}

function getBorders(theSquare){
	var tempBorders = getTileByType(theSquare.type).borders;
	return rotateBorders(tempBorders, theSquare.rotate)
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
	tempArray.push(borders[4])
	return(tempArray);
}
function placeTile(){
	//console.log("Placeing Tile" + activeSquare.borders);
	var theActive = activeSquare;
	var updateSquare = findXY(activeSquare.valueX, activeSquare.valueY);
	if(updateSquare.type==0){
		var leftTile=  findXY(activeSquare.valueX-1, activeSquare.valueY);
		var rightTile=  findXY(activeSquare.valueX+1, activeSquare.valueY);
		var topTile=  findXY(activeSquare.valueX, activeSquare.valueY-1);
		var bottomTile=  findXY(activeSquare.valueX, activeSquare.valueY+1);
		var completeMatch = true;
		var thisBordes = getBorders(activeSquare);
		//console.log("this borders: "+thisBordes);
		if(leftTile.type>0 || rightTile.type>0 || topTile.type>0 || bottomTile.type>0){
			if(leftTile.type>0){
				var currentBorders = getBorders(leftTile);
				
				if(currentBorders[2]!=thisBordes[0]){
					completeMatch=false;
					//console.log(currentBorders[2]+"<LEFT MISMATCH current>"+thisBordes[0]);
				}else{
					//console.log(currentBorders[2]+"<LEFT Match current>"+thisBordes[0]);
				}
			}
			if(rightTile.type>0){
				var currentBorders = getBorders(rightTile);
				if(currentBorders[0]!=thisBordes[2]){
					completeMatch=false;
					//console.log(currentBorders[0]+"<RIGHT MISMATCH current>"+thisBordes[2]);
				}else{
					//console.log(currentBorders[0]+"<RIGHT MATCH current>"+thisBordes[2]);
				}
			}
			if(topTile.type>0){
				var currentBorders = getBorders(topTile);
				if(currentBorders[3]!=thisBordes[1]){
					completeMatch=false;
					//console.log(currentBorders[3]+"<TOP MISMATCH current>"+thisBordes[1]);
				}else{
					//console.log(currentBorders[3]+"<TOP MATCH current>"+thisBordes[1]);
				}
			}
			if(bottomTile.type>0){
				var currentBorders = getBorders(bottomTile);
				if(currentBorders[1]!=thisBordes[3]){
					completeMatch=false;
					//console.log(currentBorders[1]+"<Bottom  MISMATCH current>"+thisBordes[3]);
				}else{
					//console.log(currentBorders[1]+"<Bottom  MAtCH current>"+thisBordes[3]);
				}
			}
			if(completeMatch){
				updateSquare.updateType(1);
				waitForMeeple();
			}else{
				//console.log("does not match");
				cantPlaceTile();
			}
		}else{
			//console.log("must place next to other square");
			cantPlaceTile();
		}
	}else{
		//console.log("square taken");
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
	//console.log(activeSquare);
	//console.log(getBorders(activeSquare));
	//console.log(activeSquare.rotate);
	var underSquare =  findXY(activeSquare.valueX, activeSquare.valueY);
	if(underSquare.type>0){
		//console.log("underSquare");
		console.log(underSquare);
		console.log(underSquare.id);
		console.log(getBorders(underSquare));
		console.log(underSquare.rotate);
	}
					
}
function cantPlaceTile(){
	borderColor="red";
	//console.log("cantPlaceTile");
}
function getTileIdByType(type){
	for(var i= 0; i<allTiles.length; i++){
		if(allTiles[i].type==type){
			return i;
		}
	}
}


var currentTileId =0;

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
	this.id=allObjects.length;
	this.rotate= 1;
	this.meeplePos = -1;
	this.meepleColor;
	this.meepleImg;
	this.borders; 
	this.tempMeeple = -1; 
	this.tempChecked = false;
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
			this.borders = getBorders(this, this.rotate);
			this.imageOriginal = this.image;
			//console.log("getTileIdByType(this.type)");
			//console.log(getTileIdByType(this.type));
			currentTileId = getTileIdByType(this.type);
			allTiles.splice(currentTileId,1);
		}
		if(type==2){
			this.setImg("img/tile"+type+".png");
			this.type = type;
			this.rotate = rotation;
			this.borders = ["road", "town", "road", "grass", "none"];
			this.imageOriginal = this.image;
			currentTileId = getTileByType(2).id;
			allTiles.splice(currentTileId,1);
		}
		if(type=="randomTile"){
			var numberOfTiles =allTiles.length;
			var randomNumber = Math.floor(Math.random() * numberOfTiles) + 1;
			var tileType = allTiles[randomNumber-1].type;
			this.setImg("img/tile"+tileType+".png");
			activeSquare.valueX = startX;
			activeSquare.valueY = startY-1;
			moveTile("down");
			activeSquareImg.src=("img/tile"+tileType+".png");
			this.rotate=1;
			rotation=1;
			this.imageOriginal = this.image;
			this.type= tileType;
		}
    };
	this.rotateRight = function () {
		rotation = (rotation%4)+1;
		//console.log("rotateRight"+ rotation);
		drawRotateToTemp(this.imageOriginal.src, rotation);
		this.setImg(getTempSrc());
		this.rotate = rotation;
		borderColor = "black";
		//this.imageOriginal = this.image;
		//this.active = true;
    };
	this.rotateLeft = function () {
		rotation = ((rotation+2)%4)+1;
		//console.log("rotateRight"+ rotation);
		borderColor = "black";
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
	//console.log("placeMeeple");
	var teamColor = teamColors[playerTurn];
	var tileToPlaceOn = findXY(activeSquare.valueX,activeSquare.valueY);
	tileToPlaceOn.meeplePos = position-1;
	//console.log("placeMeeple "+ tileToPlaceOn.meeplePos);
	tileToPlaceOn.meepleColor = teamColor;
	players[playerTurn].meeplesLeft--;
	//console.log(teamColor);
	tileToPlaceOn.meepleImg = theMeepleImgs[teamColor];
	
}
function updatePlayerInfo(){
	$(".playerInfo").hide();
	$(".playerInfo").removeClass();
	$("#player"+(playerTurn+1)).addClass("activePlayer"+(playerTurn+1));
	for(var i =0; i<players.length; i++){
		$("#player"+(i+1)).addClass("playerInfo");
		if(players[i].active){
			document.getElementById("player"+(i+1)).style.display = "block";
			document.getElementById("scoreTextPlayer"+(i+1)).value = players[i].score;
			document.getElementById("potentialTextPlayer"+(i+1)).value = players[i].potentialScore;
			document.getElementById("meeplePlayer"+(i+1)).value = players[i].meeplesLeft;
		}
	}
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
//-------------------------------------------------DRAW------------------------------------------------------------------------'
var blueMeepleImg = new Image();
blueMeepleImg.src= "img/meepleblue.png";
var redMeepleImg = new Image();
redMeepleImg.src= "img/meeplered.png";
var greenMeepleImg = new Image();
greenMeepleImg.src= "img/meeplegreen.png";
var yellowMeepleImg = new Image();
yellowMeepleImg.src= "img/meepleyellow.png";
var theMeepleImgs = {"blue":blueMeepleImg, "red":redMeepleImg ,"yellow": yellowMeepleImg, "green": greenMeepleImg};
var meepleImg = new Image();
meepleImg.src= "img/meeple.png";
			


function draw() {
  var ctx = document.getElementById('theCanvas').getContext('2d');
  var time = new Date();
  ctx.globalCompositeOperation = 'source-over';
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
		/* 	ctx.fillStyle = theObject.color;
			ctx.strokeStyle =  theObject.colorBorder;
			ctx.fillRect(theObject.x+offsetX,theObject.y+offsetY,theObject.width, theObject.height); */
		}
		if(theObject.meeplePos>-1){
			var meepleSquare = [];
			var meelpeSize = 1/3;
			meepleSquare.height = theObject.height*meelpeSize;
			meepleSquare.width = theObject.width*meelpeSize;
			ctx.fillStyle = theObject.meepleColor;
			ctx.strokeStyle =  theObject.meepleColor;
			if(theObject.meeplePos==0){
				meepleSquare.x = theObject.x+offsetX+0;
				meepleSquare.y = theObject.y+offsetY+(theObject.height/5*1);
			}
			if(theObject.meeplePos==1){
				meepleSquare.x = theObject.x+offsetX+(theObject.width/11*4);
				meepleSquare.y = theObject.y+offsetY+0;
			}
			if(theObject.meeplePos==2){
				meepleSquare.x = theObject.x+offsetX+(theObject.width/11*7);
				meepleSquare.y = theObject.y+offsetY+(theObject.height/5*1);
			}
			if(theObject.meeplePos==3){
				meepleSquare.x = theObject.x+offsetX+(theObject.width/11*4);
				meepleSquare.y = theObject.y+offsetY+(theObject.height/11*7);
			}
			if(theObject.meeplePos==4){
				meepleSquare.x = theObject.x+offsetX+(theObject.width/10*3);
				meepleSquare.y = theObject.y+offsetY+(theObject.height/10*3);
			}
			//ctx.clearRect(meepleSquare.x, meepleSquare.y, meepleSquare.width, meepleSquare.height); // clear canvas

			//console.log("drawing");
			ctx.drawImage(theObject.meepleImg,meepleSquare.x, meepleSquare.y, meepleSquare.width, meepleSquare.height);
		}
	 }
	 if(!activeSquare.disabled){

			 ctx.clearRect(activeSquare.x+offsetX, activeSquare.y+offsetY, activeSquare.width, activeSquare.height); // clear canvas
		  ctx.fillStyle = borderColor;
		  ctx.fillRect(activeSquare.x+offsetX, activeSquare.y+offsetY, activeSquare.width, activeSquare.height);
		  ctx.clearRect(theObject.x+offsetX+10, theObject.y+offsetY+10, theObject.width-20, theObject.height-20); // clear canvas
		  theObject = activeSquare;
		  updateTemp();
		  var tempCanvas = document.getElementById("tempCanvas");
		ctx.drawImage(tempCanvas, theObject.x+offsetX+10, theObject.y+offsetY+10, theObject.width-20, theObject.height-20);
	 }

	  ctx.save();
	 setTimeout(function(){ 
		window.requestAnimationFrame(draw);
	 }, drawDelay); 
	
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
var townValue = 2;
function newRound(){
	//console.log("newRound");
	$("#info2").hide();
	countScore();
	updateGameInfo("");
	updatePlayerInfo();
	send("turnDone", "scoreHereLater", playerTurn);
	playerTurn++;
	if(playerTurn>numberOfPlayers-1){
		playerTurn=0;
	}
	setTimeout(function(){ 
		if(allTiles.length<1){
			endGame();
		}else{
			drawNewTile();
			theTurn = "newRound";
			send("tile", activeSquare.type, playerTurn);
		}
		
	}, 1);
}
function endGame(){
	townValue = 1;
	countScore();
	var higestScore = 0;
	var winners = [];
	for(var i = 0; i<players.length; i++){
		//players[i].active = false;
		players[i].score += players[i].potentialScore;
		players[i].potentialScore = 0;
		players[i].meeplesLeft = 0;
		if(players[i].score==higestScore){
			winners.push(players[i]);
			higestScore = players[i].score;
		}
		if(players[i].score>higestScore){
			winners = [players[i]];
			playerTurn = i;
			//winners.i = i;
			higestScore = players[i].score;
		}
	}
	
	updatePlayerInfo();
	var text = "";
	if(winners.length>1){
		text += "Draw! Congratulations to:";
		for(var i =0;i<winners.length; i++){
			text += " "+winners[i].teamColor;
			//players[winners.i].active = true;
		}
		text += "!";
	}else{
		text = "Congratulations to the " + winners[0].teamColor+" player!";
	}
	updateGameInfo(text);
	
}
function sortById(array){
	var sortedArray = [];
	var done = false;
	while(!done){
			var lowestId = 100000000;
			var lowestObject = array[0];
			var lowestI = 0;
			for(var i = 0; i<array.length; i++){
				if(array[i].id<lowestId){
					lowestId = array[i].id;
					lowestObject = array[i];
					lowestI = i;
					//console.log("lowestObject.id "+lowestObject.id);
				}
				array.splice(lowestI,1);
				sortedArray.push(lowestObject);
			}
		if(sortedArray.length == array.length){
			done=true;
			}
	}
	return array;
}

function findConnectedSquares(startSquare){
	//console.log("findConnectedSquares");
	var connectedSquares = [];
	var completedStructure = false;	
	var foundAllSquares = false;
	var currentSquare = startSquare;
	var startPos = currentSquare.tempMeeple;
	var terrain = currentSquare.borders[startPos];
	var foundUnfinished = false;
	var addedNewSquare;
	var squaresWithRelatedMeeples = [];
	connectedSquares.push(currentSquare);
	var squaresToCheck =  [];
	squaresToCheck.push(startSquare);
	var isTaken = false;
	if(terrain == "church"){
		foundAllSquares = true;
		foundUnfinished = true;
		//console.log("meeple is placed on church");
		for(var x=0;x<3;x++){
			for(var y=0;y<3;y++){
				var currentSquare = findXY((startSquare.valueX-1+x), (startSquare.valueY-1+y));
				//console.log(x+"<x y>"+y);
				if(currentSquare.id!=startSquare.id  && currentSquare.type>0){
					
					connectedSquares.push(currentSquare);
				}
			}
		}
		if(connectedSquares.length==9){
			foundUnfinished = false;
		}
		//console.log("connectedSquares.length: "+connectedSquares.length);
	}
	//console.log("LOOKING FOR SQARES BASED ON MEEPLE "+ startSquare.meepleColor);
	while(!foundAllSquares){
		//console.log("while(!foundAllSquares)");
		addedNewSquare = false;
		var tempArray = [];
		for(var j = 0; j<squaresToCheck.length; j++){
			//if(tempArray.indexOf(squaresToCheck[j])>0){
				if(!squaresToCheck[j].tempChecked){
					tempArray.push(squaresToCheck[j]);
				}
				
			//}
		}
		for(var j = 0; j<tempArray.length; j++){
			var currentSquare = tempArray[j];
			currentSquare.tempChecked = true;
			startPos = currentSquare.tempMeeple;
			var center = currentSquare.borders[4];
			if(center == terrain || center == "none"){
				for(var i = 0; i<4; i++){
					if(currentSquare.borders[i]==terrain){
						if(currentSquare.meeplePos==i){
							isTaken =true;
							squaresWithRelatedMeeples.push(currentSquare);
						}
						var connectedSquare = findSquareInRelationToSquare(currentSquare, i);
						if(connectedSquare.tempChecked){
						}else{	
							if(connectedSquare.type>0){
								connectedSquare.tempMeeple = exitToEntrance(i);
								if(connectedSquares.indexOf(connectedSquare)==-1){
									connectedSquares.push(connectedSquare);
								}		
								squaresToCheck.push(connectedSquare);
								addedNewSquare=true;
							}else{
								foundUnfinished = true;
							}
						}
					}
				}
			}else{
				var i = startPos;
				 if(currentSquare.borders[i]==terrain){
					if(currentSquare.meeplePos==i){
						isTaken =true;
						squaresWithRelatedMeeples.push(currentSquare);
					}
					 var connectedSquare = findSquareInRelationToSquare(currentSquare, i);
					if(connectedSquare.tempChecked){
					
					}else{
						if(connectedSquare.type>0){
							connectedSquare.tempMeeple = exitToEntrance(i);
							if(connectedSquares.indexOf(connectedSquare)==-1){
								connectedSquares.push(connectedSquare);
							}
							
							squaresToCheck.push(connectedSquare);
							addedNewSquare=true;
						}else{
							foundUnfinished = true;
						}
					} 
				} 
			}
		}	
		if(!addedNewSquare){
			foundAllSquares = true;
		}
	}
	resetAllTempValues();
	//console.log("foundUnfinished " +foundUnfinished);
	return [connectedSquares, foundUnfinished, isTaken, squaresWithRelatedMeeples];
}
function exitToEntrance(exit){
	if(exit==0){
		return 2;
	}
	if(exit==1){
		return 3;
	}
	if(exit==2){
		return 0;
	}
	if(exit==3){
		return 1;
	}
}
function findSquareInRelationToSquare(theSquare, relation){
	if(relation == 0){
		return findXY(theSquare.valueX-1, theSquare.valueY);
	}
	if(relation == 1){
		return findXY(theSquare.valueX, theSquare.valueY-1);
	}
	if(relation == 2){
		return findXY(theSquare.valueX+1, theSquare.valueY);
	}
	if(relation == 3){
		return findXY(theSquare.valueX, theSquare.valueY+1);
	}
	if(relation==4){
		return findXY(theSquare.valueX, theSquare.valueY);
	}
}
function resetAllTempValues(){
	for(var i= 0; i<allObjects.length; i++){
		allObjects[i].tempMeeple = -1;
		allObjects[i].tempChecked = false;
	}
}
function removeMeeplesFromSquares(theSquares){
	//console.log("removeMeeplesFromSquares");
	//console.log(theSquares); 
	for(var i = 0; i<theSquares.length; i++){
		var whatPlayer = teamColors.indexOf(theSquares[i].meepleColor);
		//console.log("returning "+teamColors[whatPlayer] +" meeple from sqaure id: "+ theSquares[i].id);
		players[whatPlayer].meeplesLeft++;
		theSquares[i].meeplePos =-1;
	}
}
function howManyWithShield(theSquares){
	var howMany =0;
	for(var i = 0; i<theSquares.length; i++){
		if(getTileByType(theSquares[i].type).hasShield){
			howMany++;
		}
	}
	return howMany;
}
function getConnectionName(connection){
	var name = connection.type+"_";
	for(var j = 0; j<connection.connectedSquares.length; j++){
		//console.log(connectedSquares[j].id);
		name+= "_"+connection.connectedSquares[j].id;
	} 
	return name;
}
function countScore(){
	//console.log("countScore");
	var theConnections = [];
	for(var i = 0; i<allObjects.length; i++){
		var currentSquare = allObjects[i];
		if(currentSquare.type>0){
			if(currentSquare.meeplePos>-1){
				var thisConnection = [];
				currentSquare.tempMeeple = currentSquare.meeplePos;
				//console.log("trigger findConnectedSquares from square id: " +currentSquare.id);
				var resultArray = findConnectedSquares(currentSquare);
				var connectedSquares = resultArray[0];
				thisConnection.isComplete = !resultArray[1];
				thisConnection.connectedSquares = connectedSquares;
				thisConnection.type= currentSquare.borders[currentSquare.meeplePos];
				thisConnection.triggeredColor = currentSquare.meepleColor;
				thisConnection.meeplePlayer =  teamColors.indexOf(currentSquare.meepleColor);
				thisConnection.startSquare = currentSquare;
				thisConnection.squaresWithRelatedMeeples = resultArray[3];
				thisConnection.meeplesByPlayers = [0,0,0,0,0];
				thisConnection.meeplesByPlayers[thisConnection.meeplePlayer]++;
				connectedSquares.sort(function (a, b) {
					return a.id - b.id;
				});
				connectedSquares.sort();// = sortById(connectedSquares);
				 //console.log("sorted connected squares");
				 var name = getConnectionName(thisConnection)
				thisConnection.name = name;
				var connectionExist = false;
				for(var j = 0; j<theConnections.length; j++){
					//console.log(theConnections[j].name);
					if(theConnections[j].name == thisConnection.name){
						connectionExist=true;
						//console.log("connectionExist with name above" );
						for(var x = 0; x<thisConnection.meeplesByPlayers.length; x++){
							theConnections[j].meeplesByPlayers[x] += thisConnection.meeplesByPlayers[x];
						}
					} 
				}
				if(!connectionExist){
					theConnections.push(thisConnection);
				}
				//console.log(theConnections[theConnections.length-1].meeplesByPlayers);
				
			}
		}
	}
	//console.log("Calculating the score-----------------------------");
	clearPlayerPotentialScore();
	
	for(var i = 0; i<theConnections.length; i++){
		var thisConnection = theConnections[i];
	//	console.log("Calculating the score-----------------------------"+thisConnection.name);
		//console.log(thisConnection.name);
		//console.log(thisConnection);
		var maxNumberOfMeeples = 0;
		var newMeeplesByPlayers = [0,0,0,0,0];
		for(var player = 0; player<thisConnection.meeplesByPlayers.length; player++){
			var nrOfMeeples = thisConnection.meeplesByPlayers[player];
			//console.log(player+" has "+nrOfMeeples+" meeples");
			//console.log(" maxNumberOfMeeples "+maxNumberOfMeeples);
			if(nrOfMeeples>maxNumberOfMeeples){
				
				maxNumberOfMeeples=nrOfMeeples;
				//console.log("maxNumberOfMeeples updated to "+maxNumberOfMeeples+"-----");
				newMeeplesByPlayers = [0,0,0,0,0];	
				newMeeplesByPlayers[player] += nrOfMeeples;
				
			}else if(nrOfMeeples==maxNumberOfMeeples){
				newMeeplesByPlayers[player] += nrOfMeeples;
			}else{
				newMeeplesByPlayers[player] = 0;
			}
			
		}
		//console.log("who should get score");
		//console.log(newMeeplesByPlayers);
		var scoreMultiplier = 0;
		if(thisConnection.type=="road"){
			scoreMultiplier=1;
		}
		if(thisConnection.type=="town"){
			scoreMultiplier=townValue;
		}
		if(thisConnection.type=="church"){
			scoreMultiplier=1;
			var playerI = thisConnection.meeplePlayer;//teamColors.indexOf(thisConnection.triggeredColor,1);	
			var numberOfTiles = thisConnection.connectedSquares.length;
			var idFromName = thisConnection.name.split("_")[2];
			if(thisConnection.isComplete){
				players[playerI].score += numberOfTiles*scoreMultiplier;
				players[playerI].meeplesLeft++;
				thisConnection.startSquare.meeplePos = -1;				
			}else{
				players[playerI].potentialScore += numberOfTiles*scoreMultiplier;
			}
		}else{
			var numberOfTiles = thisConnection.connectedSquares.length;
			scoreMultiplier = scoreMultiplier*numberOfTiles;
			if(thisConnection.type=="town"){
				var howMany = howManyWithShield(thisConnection.connectedSquares);
				scoreMultiplier += townValue*howMany;
			}
			if(thisConnection.isComplete){
				removeMeeplesFromSquares(thisConnection.squaresWithRelatedMeeples);
				for(var player = 0; player<newMeeplesByPlayers.length; player++){
					var nrOfMeeples = newMeeplesByPlayers[player];
					if(nrOfMeeples>0){
						nrOfMeeples=1;
					}
					players[player].score += nrOfMeeples*scoreMultiplier;
					console.log("giving score "+ nrOfMeeples*scoreMultiplier +" to " + player)
				}
				
			}else{
				for(var player = 0; player<newMeeplesByPlayers.length; player++){
					var nrOfMeeples = newMeeplesByPlayers[player];
					if(nrOfMeeples>0){
						nrOfMeeples=1;
					}
					players[player].potentialScore += nrOfMeeples*scoreMultiplier;
				}
			} 
		}
		
	}
}

function clearPlayerPotentialScore(){
	for(var player = 0; player<players.length; player++){
		players[player].potentialScore = 0;
	}
}

var placeableSpotsString;
function centerTiles(){
	var xmax = 0;
	var ymax = 0;
	var xmin = gridSize;
	var ymin = gridSize;
	for(var i = 0; i<allObjects.length; i++){
		if(allObjects[i].type>0){
			//console.log(allObjects[i]);
			var currentx = allObjects[i].valueX;
			var currenty = allObjects[i].valueY;
			if(currentx>xmax){
				xmax= currentx;
			}
			if(currentx<xmin){
				xmin= currentx;
			}
			if(currenty>ymax){
				ymax= currenty;
			}
			if(currenty<ymin){
				ymin= currenty;
			}
		}
		
	}
	var xwidth = xmax-xmin;
	var ywidth = ymax-ymin;
	var canvasWidth = Math.ceil(pixelWidth/squareSize);
	var canvasHeight = Math.ceil(pixelHeight/squareSize);
	var leftSpace = Math.ceil((canvasWidth-xwidth)/2)-1.5;
	var topSpace = Math.ceil((canvasHeight-ywidth)/2)-1.5;
	offsetX =(margin*squareSize)-(xmin*squareSize)+(leftSpace*squareSize);
	offsetY =(margin*squareSize)-(ymin*squareSize)+(topSpace*squareSize);
	/* if(leftSpace<4){
		var tempStepLenght = stepLenght;
		stepLenght = squareSize*4;
		zoomOut();
		stepLenght= tempStepLenght;
	}  */
	//console.log("xwidth "+xwidth);
	//console.log("ywidth "+ywidth);
	
}
function waitForMeeple(){
	//console.log("waitForMeeple");
	theTurn = "waitForMeeple";
	$("#info2").show();
	//centerTiles();
	var startSquare = findXY(activeSquare.valueX, activeSquare.valueY);
	var placeableSpots = [];
	for(var i = 0; i<4; i++){
		placeableSpots.push(0);
		if(startSquare.borders[i]=="road" || startSquare.borders[i]=="town"){
			//console.log("Waitformeeple trigger findConnectedSquares for "+startSquare.id);
			startSquare.tempMeeple = i;
			var resultArray =  findConnectedSquares(startSquare);
			var connectedSquares =resultArray[0];
			var isComplete = !resultArray[1];
			var isTaken = resultArray[2];
			//console.log("It is taken?: " +isTaken);
			//console.log(resultArray);
			if(!isTaken){
				placeableSpots[i] = 1;
			}
		}
	}
	if(startSquare.borders[4]=="church"){
		placeableSpots.push(1);
	}else{
		placeableSpots.push(0);
	}
	
	placeableSpotsString = placeableSpots.join("_");
	//console.log("placeableSpots: "+ placeableSpots);
	if(players[playerTurn].meeplesLeft>0){
		send("placedTile", placeableSpotsString, playerTurn);
		activeSquare.disabled = true;
	}else{
		send("turnDone", "", playerTurn);
		newRound();
	}
	
}
function drawNewTile(){
	updatePlayerInfo();
	hideMenu();
	//console.log(" drawNewTile()");
	activeSquare.disabled = false;
	activeSquare.updateType("randomTile");
	send("tile", activeSquare.type, playerTurn);
	updateTemp();
}
function restartGame(howManyPlayers){
	 hideMenu();
	numberOfPlayers=howManyPlayers;
	updatePlayerInfo();
	playerTurn=0;
	theTurn="newRound"
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
	allTiles = [];
	createTheTiles();
	findXY(startX,startY-1).updateType(2);
	var x = startX;
	var y = startY;
	xpos= x*squareSize-(margin*squareSize);
	ypos= y*squareSize-(margin*squareSize);
	activeSquare = new object("square", squareSize, squareSize,xpos,ypos,x,y, "img/tile1.png", 1, "rgb(255,0,0)","rgb(0,0,0)",1);
	//console.log(activeSquare);
	activeSquare.updateType("randomTile");
	//updateTemp();
	init();
	
	send("tile", activeSquare.type, playerTurn);
	players = [];
	resetPlayers();
	updateGameInfo("");
	updateGameInfo("Started game for "+ numberOfPlayers+ " players!");
}

function updateGameInfo(text){
	if(text == ""){
		text = allTiles.length+"/"+totalNumberOfRounds+" Tiles Left";
	}
	document.getElementById("info").innerHTML = text;
}


//-------------------------------------------------Handle Input------------------------------------------------------------------------
function handleReconnect(){
	if(theTurn=="newRound"){
		send("tile", activeSquare.type, playerTurn);
	}
	if(theTurn=="waitForMeeple"){
		send("placedTile", placeableSpotsString, playerTurn);
	}
}
function handleInput(data){
	//console.log(" handleInput(data)");
	//console.log(data);
	
	var intent = data.intent;
	//console.log(intent);
	if(intent=="reconnect" || intent=="iAmReady"){
		if((data.playerNumber) == playerTurn){
			if(theTurn=="newRound"){
				send("tile", activeSquare.type, playerTurn);
			}
			if(theTurn=="waitForMeeple"){
				send("placedTile", placeableSpotsString, playerTurn);
			}
		}
	}	
	if(intent=="placeMeeple"){
		var pos = data.value;
		if(pos==0){
			
		}else{
			placeMeeple(pos);	
		}
		//console.log('intent=="placeMeeple" at:' +pos);
		
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
	if(intent=="reroll"){
		drawNewTile();
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
	borderColor = "black";
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
	borderColor = "black";
	send("tile", activeSquare.type, player);

}
function zoomIn(){
	pixelHeight = (pixelHeight/zoomSpeed)*(zoomSpeed-1);
	pixelWidth =  (pixelWidth/zoomSpeed)*(zoomSpeed-1);
	stepLenght = (stepLenght/zoomSpeed)*(zoomSpeed-1);
	theCanvas.height = pixelHeight;
	theCanvas.width = pixelWidth;
	centerTiles();
}
function zoomOut(){
	pixelHeight = (pixelHeight/zoomSpeed)*(zoomSpeed+1);
	pixelWidth =  (pixelWidth/zoomSpeed)*(zoomSpeed+1);
	stepLenght = (stepLenght/zoomSpeed)*(zoomSpeed+1);
	theCanvas.height = pixelHeight;
	theCanvas.width = pixelWidth;
	centerTiles();

}
function clearConsole(){
	//console.clear();
}
$(function() {
	   $(window).keydown(function(e) {
		var key = e.which;
		//console.log("key pressed: "+key); //do stuff with "key" here...
//restartGame(howManyPlayers);
	   if(!activeSquare.disabled){
		
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
		  //key = N
		   if(key == 78){
				restartGame(2);
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
				//console.log("rotated to: " +theActive.rotate);
				//newSquare.activate();
		  }
		     // R for reload
		   if(key == 82){
				drawNewTile();
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
		  }else{
				   	 // number 0
		   if(key == 48){
				testNoMeeple(0);
		  }
		   // number 1
		   if(key == 49){
				testNoMeeple(1);
		  }
		   // number 2
		   if(key == 50){
				testNoMeeple(2);
		  }
		   // number 3
		   if(key == 51){
				testNoMeeple(3);
		  }
		   // number 4
		   if(key == 52){
				testNoMeeple(4);
		  }
		   // number 5
		   if(key == 53){
				testNoMeeple(5);
		  }
		  }
	   });
	});


function testNoMeeple(meeple){
	//console.log("testNoMeeple");
	var message = {
      intent: "placeMeeple",
	  value: meeple,
	  value2: 1,
	  sender: "host",
	  playerNumber: 1
    };
	handleInput(message);
}	

function createTransparentMeeple(){
/* 	//https://www.patrick-wied.at/blog/how-to-create-transparency-in-images-with-html5canvas
	var canvas = document.createElement("canvas");
	canvas.width = squareSize;
	//cavnas.style.position = 'absolute';
	//canvas.style.zIndex = 300;
	
	canvas.height = squareSize;
	document.getElementById("testButtons").appendChild(canvas);
	var ctx = canvas.getContext('2d');
	//console.log("createTransparentMeeple v2");
	ctx.drawImage(meepleImg, 0, 0, squareSize,squareSize);
	ctx.save();
	var image = ctx.getImageData(0, 0, squareSize, squareSize);
	var imageData = image.data, 
		length = imageData.length;
		// imageData[i-2], imageData[i-3]
	for(var i=3; i < length; i+=4){
		//console.log(imageData[i-1])
		if(imageData[i-1] == 0){
			imageData[i] = 0;
		}  
		
	}
	image.data = imageData;
	ctx.putImageData(image, 0, 0);
	meepleImg.src= canvas.toDataURL(); */
}	
	
/* function createCanvases(){
	var createSquare;
	var container = document.getElementById("theImages");
	for(var i= 1; i<allTiles.length+1; i++){
		//createSquare = new object("square", squareSize, squareSize,0,0,0,00, "img/tile"+i+".png", 1, "rgb(255,0,0)","rgb(0,0,0)",1);
		var src = "img/tile"+i+".png";
		//console.log(src);
		for(var j= 1; j<5; j++){
			var rotate = j;
			container.innerHTML += '<canvas height="'+squareSize+'px" width="'+squareSize+'px" id="canvas'+i+'_'+j+'"></canvas>'
			var newCanvas = document.getElementById('canvas'+i+'_'+j);
			drawRotated(src, rotate, newCanvas);
		}
	}
}
function drawRotated(src, rotate, canvas){
	//console.log("drawing " +src + " with rotation " +rotate+ " on canvas "+canvas.id  )
	//console.log(canvas);
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
		//console.log(data);
		
	}); */