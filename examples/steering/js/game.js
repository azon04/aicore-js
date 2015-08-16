// Create the canvas
var canvas = document.getElementById("main-canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

var kinematic = {};
var steeringMovements = [];
var selectedMovement = 0;

var kinematic2 = {};
var steering2Movements = [];
var selectedMovement2 = 0;

var maxSpeed = 32;

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
    var steeringSeek = new SteeringSeek();
    steeringSeek.character = kinematic;
    steeringSeek.target = kinematic2;
    steeringSeek.maxAccel = 5.0;
    steeringMovements[0] = steeringSeek;
    
    // Set flee
    var steeringFlee = new SteeringFlee();
    steeringFlee.character = kinematic;
    steeringFlee.target = kinematic2;
    steeringFlee.maxAccel = 5.0;
    steeringMovements[1] = steeringFlee;
    
    
    // Set for Kinematic 2
    kinematic2.position.x = (Math.random() * canvas.width);
    kinematic2.position.y = (Math.random() * canvas.height);
    
    // Set seek
    var steering2Seek = new SteeringSeek();
    steering2Seek.character = kinematic2;
    steering2Seek.target = kinematic;
    steering2Seek.maxAccel = 5.0;
    steering2Movements[0] = steering2Seek;
    
    // Set flee
    var steering2Flee = new SteeringFlee();
    steering2Flee.character = kinematic2;
    steering2Flee.target = kinematic;
    steering2Flee.maxAccel = 5.0;
    steering2Movements[1] = steering2Flee;
    
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
    
    /*if(69 in keysDown) { // e
        selectedMovement = 2;
    }
    
    if(82 in keysDown) { // r
        selectedMovement = 3;
    }
    */
    
    if(65 in keysDown) { // a
        selectedMovement2 = 0;
    }
    
    if(83 in keysDown) { // s
        selectedMovement2 = 1;
    }
    
    /*if(68 in keysDown) { // d
        selectedMovement2 = 2;
    }
    
    if(70 in keysDown) { // f
        selectedMovement2 = 3;
    }*/

    // steering algorithm
    var steeringOutput = steeringMovements[selectedMovement].getSteering();
    kinematic.UpdateSteering(steeringOutput, maxSpeed ,modifier);
    
    steeringOutput = steering2Movements[selectedMovement2].getSteering();
    kinematic2.UpdateSteering(steeringOutput, maxSpeed, modifier);
    
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
            ctx.fillText("Steering Seek", 32, 32);
            break;
        case 1:
            ctx.fillText("Steering Flee", 32, 32);
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
            ctx.fillText("Steering Seek", 600, 32);
            break;
        case 1:
            ctx.fillText("Steering Flee", 600, 32);
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

