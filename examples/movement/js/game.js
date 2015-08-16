// Create the canvas
var canvas = document.getElementById("main-canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Monster Image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function() {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";


var kinematic = {};
var kinematicMovements = [];
var selectedMovement = 0;

var kinematic2 = {};
var kinematic2Movements = [];
var selectedMovement2 = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);


// Init
var init = function() {
    kinematic = new Kinematic();
    kinematic2 = new Kinematic();
    
    
    // Set seek
    var kinematicSeek = new KinematicSeek();
    kinematicSeek.character = kinematic;
    kinematicSeek.target = kinematic2;
    kinematicSeek.maxSpeed = 40.0;
    kinematicMovements[0] = kinematicSeek;
    
    // Set flee
    var kinematicFlee = new KinematicFlee();
    kinematicFlee.character = kinematic;
    kinematicFlee.target = kinematic2;
    kinematicFlee.maxSpeed = 40.0;
    kinematicMovements[1] = kinematicFlee;
    
    // Set Wandering
    var kinematicWandering = new KinematicWandering();
    kinematicWandering.character = kinematic;
    kinematicWandering.maxSpeed = 40.0;
    kinematicMovements[2] = kinematicWandering;
    
    // Set Arrive
    var kinematicArrive = new KinematicArrive();
    kinematicArrive.character = kinematic;
    kinematicArrive.target = kinematic2;
    kinematicArrive.maxSpeed = 40.0;
    kinematicArrive.radius = 32.0;
    kinematic2Movements[3] = kinematicArrive;
    
    // Set for Kinematic 2
    kinematic2.position.x = (Math.random() * canvas.width);
    kinematic2.position.y = (Math.random() * canvas.height);
    
    // Set seek
    var kinematic2Seek = new KinematicSeek();
    kinematic2Seek.character = kinematic2;
    kinematic2Seek.target = kinematic;
    kinematic2Seek.maxSpeed = 40.0;
    kinematic2Movements[0] = kinematic2Seek;
    
    // Set flee
    var kinematic2Flee = new KinematicFlee();
    kinematic2Flee.character = kinematic2;
    kinematic2Flee.target = kinematic;
    kinematic2Flee.maxSpeed = 40.0;
    kinematic2Movements[1] = kinematic2Flee;
    
    // Set Wandering
    var kinematic2Wandering = new KinematicWandering();
    kinematic2Wandering.character = kinematic2;
    kinematic2Wandering.maxSpeed = 40.0;
    kinematic2Movements[2] = kinematic2Wandering;
    
    // Set Arrive
    var kinematic2Arrive = new KinematicArrive();
    kinematic2Arrive.character = kinematic2;
    kinematic2Arrive.target = kinematic;
    kinematic2Arrive.maxSpeed = 40.0;
    kinematic2Arrive.radius = 32.0;
    kinematic2Movements[3] = kinematic2Arrive;
    
}

function clipPosition(obj) {
    obj.position.x = obj.position.x % canvas.width;
    obj.position.y = obj.position.y % canvas.height;
    
    if(obj.position.x < 0) 
    {
        obj.position.x = canvas.width;
    }
    
    if(obj.position.y < 0) 
    {
        obj.position.y = canvas.height;
    }
}

// Update Game Objects
var update = function(modifier) {
    
    // Key pressed
    if(81 in keysDown) { // q
        selectedMovement = 0;
    }
    
    if(87 in keysDown) { // w
        selectedMovement = 1;
    }
    
    if(69 in keysDown) { // e
        selectedMovement = 2;
    }
    
    if(82 in keysDown) { // r
        selectedMovement = 3;
    }
    
    if(65 in keysDown) { // a
        selectedMovement2 = 0;
    }
    
    if(83 in keysDown) { // s
        selectedMovement2 = 1;
    }
    
    if(68 in keysDown) { // d
        selectedMovement2 = 2;
    }
    
    if(70 in keysDown) { // f
        selectedMovement2 = 3;
    }

    // steering algorithm
    var steeringOutput = kinematicMovements[selectedMovement].getSteering();
    kinematic.Update(steeringOutput,modifier);
    
    steeringOutput = kinematic2Movements[selectedMovement2].getSteering();
    kinematic2.Update(steeringOutput,modifier);
    
    // clip the position
    clipPosition(kinematic);
    clipPosition(kinematic2);
    
    
    
};

// Drawing function
var draw = function(ctx, imageReady, image, position) {
    
    if(imageReady) {
        var x = position.x - (image.width/2);
        var y = position.y - (image.height/2);
        
        ctx.drawImage(image, x, y);
    }
    
}

var drawRotate = function(ctx, imageReady, image, position, orientation) {
    
    if(imageReady) {
        ctx.save();
        
        ctx.translate(position.x + image.width/2, position.y + image.height/2);
        
        ctx.rotate(orientation);
        
        ctx.translate(- image.width/2, - image.height/2);
        
        ctx.drawImage(image, 0, 0);
        
        ctx.restore();
    }
    
}

var drawKinematic = function(ctx, color, position, orientation) {
    
    ctx.save();

    ctx.translate(position.x + 8, position.y + 8);

    ctx.rotate(orientation);

    //ctx.translate(- 8, - 8);

    ctx.fillStyle = color;

    var path = new Path2D();
    path.moveTo(8,0);
    path.lineTo(0,32);
    path.lineTo(-8,0);
    ctx.fill(path);
    
    var circle = new Path2D();
    circle.arc(0,0, 16, 0, Math.PI * 2);
    ctx.fill(circle);

    ctx.restore();
    
}

// Draw Everything
var render = function() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    
    drawKinematic(ctx, "#ff0000", kinematic.position, kinematic.orientation);
    
    drawKinematic(ctx, "#00ff00", kinematic2.position, kinematic2.orientation);
    
    // Score
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.font = "12px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    
    switch(selectedMovement) {
        case 0:
            ctx.fillText("Kinematic1 Seek", 32, 32);
            break;
        case 1:
            ctx.fillText("Kinematic1 Flee", 32, 32);
            break;
        case 2:
            ctx.fillText("Kinematic1 Wandering", 32, 32);
            break;
        case 3:
            ctx.fillText("Kinematic1 Arrive", 32, 32);
            break;
    }
    ctx.fillText("'q' for Seek", 32, 48);
    ctx.fillText("'w' for Flee", 32, 64);
    ctx.fillText("'e' for Wandering", 32, 80);
    ctx.fillText("'r' for Arrive", 32, 96)
    
    ctx.fillStyle = "rgb(0,255,0)";
    switch(selectedMovement2) {
        case 0:
            ctx.fillText("Kinematic2 Seek", 600, 32);
            break;
        case 1:
            ctx.fillText("Kinematic2 Flee", 600, 32);
            break;
        case 2:
            ctx.fillText("Kinematic2 Wandering", 600, 32);
            break;
        case 3:
            ctx.fillText("Kinematic2 Arrive", 600, 32);
            break;
    }
    ctx.fillText("'a' for Seek", 600, 48);
    ctx.fillText("'s' for Flee", 600, 64);
    ctx.fillText("'d' for Wandering", 600, 80);
    ctx.fillText("'f' for Arrive", 600, 96);
    
}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame;

// Main Loop
var main = function() {
    var now = Date.now();
    var delta = now - then;
    
    update(delta/1000);
    render();
    
    then = now;
    
    // Request to do this again ASAP
    requestAnimationFrame(main);
}

// Lets play this game
var then = Date.now();
init();
main();

