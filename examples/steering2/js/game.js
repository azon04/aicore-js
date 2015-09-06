// Create the canvas
var canvas = document.getElementById("main-canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

var kinematic = {};

// For steering Movement
var steeringMovements = [];
var selectedMovement = 0;

// For face movement
var faceMovements = [];
var selectedFaceMovement = 0;

var kinematic2 = {};

// For Steering Movement
var steering2Movements = [];
var selectedMovement2 = 0;

// For face movement
var face2Movements = [];
var selectedFace2Movement = 0;

var maxSpeed1 = 50;
var maxSpeed2 = 32;

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
    
    // Set Pursue
    var pursue = new Pursue();
    pursue.maxPrediction = 5.0;
    pursue.target = kinematic2;
    pursue.seek.character = kinematic;
    pursue.seek.maxAccel = 10.0;
    steeringMovements[0] = pursue;
    
    // Set Evade
    var evade = new Evade();
    evade.maxPrediction = 5.0;
    evade.target = kinematic2;
    evade.flee.character = kinematic;
    evade.flee.maxAccel = 5.0;
    steeringMovements[1] = evade;
    
    // Set face Movement
    var face = new Face();
    face.Align.character = kinematic;
    face.target = kinematic2;
    face.Align.maxAngularAcceleration = Math.PI / 15.0;
    face.Align.maxRotation = Math.PI / 10.0;
    face.Align.targetRadius = 0.01;
    face.Align.slowRadius = Math.PI / 4.0;
    faceMovements[0] = face;
    
    // Set Look where youre going Movement
    var lookWhereYoureGoing = new LookWhereYoureGoing();
    lookWhereYoureGoing.Align.character = kinematic;
    lookWhereYoureGoing.Align.maxAngularAcceleration = Math.PI / 15.0;
    lookWhereYoureGoing.Align.maxRotation = Math.PI / 10.0;
    lookWhereYoureGoing.Align.targetRadius = 0.01;
    lookWhereYoureGoing.Align.slowRadius = Math.PI / 4.0;
    faceMovements[1] = lookWhereYoureGoing;
    
    
    // Set for Kinematic 2
    kinematic2.position.x = (Math.random() * canvas.width);
    kinematic2.position.y = (Math.random() * canvas.height);
    kinematic2.orientation = Math.PI / 2.0;
    
    // Set Pursue
    var pursue2 = new Pursue();
    pursue2.maxPrediction = 5.0;
    pursue2.target = kinematic;
    pursue2.seek.character = kinematic2;
    pursue2.seek.maxAccel = 5.0;
    steering2Movements[0] = pursue2;
    
    // Set Evade
    var evade2 = new Evade();
    evade2.maxPrediction = 5.0;
    evade2.target = kinematic;
    evade2.flee.character = kinematic2;
    evade2.flee.maxAccel = 5.0;
    steering2Movements[1] = evade2;
    
    // Set face Movement
    var face2 = new Face();
    face2.Align.character = kinematic2;
    face2.target = kinematic;
    face2.Align.maxAngularAcceleration = Math.PI / 15.0;
    face2.Align.maxRotation = Math.PI / 10.0;
    face2.Align.targetRadius = 0.01;
    face2.Align.slowRadius = Math.PI / 4.0;
    face2Movements[0] = face2;
    
    // Set Look where youre going Movement
    var lookWhereYoureGoing2 = new LookWhereYoureGoing();
    lookWhereYoureGoing2.Align.character = kinematic2;
    lookWhereYoureGoing2.Align.maxAngularAcceleration = Math.PI / 15.0;
    lookWhereYoureGoing2.Align.maxRotation = Math.PI / 10.0;
    lookWhereYoureGoing2.Align.targetRadius = 0.01;
    lookWhereYoureGoing2.Align.slowRadius = Math.PI / 4.0;
    face2Movements[1] = lookWhereYoureGoing2;

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
    
    if(79 in keysDown) { // o
        selectedFaceMovement = 0;
    }
    
    if(80 in keysDown) { // p
        selectedFaceMovement = 1;
    }
    
    /*if(69 in keysDown) { // e
        selectedMovement = 2;
    }
    
    if(82 in keysDown) { // r
        selectedMovement = 3;
    }
    
    if(84 in keysDown) { // t
        selectedMovement = 4;
    }*/
    
    if(65 in keysDown) { // a
        selectedMovement2 = 0;
    }
    
    if(83 in keysDown) { // s
        selectedMovement2 = 1;
    }
    
    if(75 in keysDown) { // k
        selectedFace2Movement = 0;
    }
    
    if(76 in keysDown) { // l
        selectedFace2Movement = 1;
    }
    
    /*if(68 in keysDown) { // d
        selectedMovement2 = 2;
    }
    
    if(70 in keysDown) { // f
        selectedMovement2 = 3;
    }
    
    if(71 in keysDown) { // g
        selectedMovement2 = 4;
    }*/

    // steering algorithm
    var steeringOutput = steeringMovements[selectedMovement].getSteering();
    kinematic.UpdateSteering(steeringOutput, maxSpeed1 ,modifier);
    steeringOutput = faceMovements[selectedFaceMovement].getSteering();
    kinematic.UpdateSteering(steeringOutput, maxSpeed1 ,modifier);
    
    steeringOutput = steering2Movements[selectedMovement2].getSteering();
    kinematic2.UpdateSteering(steeringOutput, maxSpeed2, modifier);
    steeringOutput = face2Movements[selectedFace2Movement].getSteering();
    kinematic2.UpdateSteering(steeringOutput, maxSpeed1 ,modifier);
    
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
            ctx.fillText("Pursue (From Seek)", 32, 32);
            break;
        case 1:
            ctx.fillText("Evade (From Flee)", 32, 32);
            break;
        case 2:
            ctx.fillText("Steering Arrive", 32, 32);
            break;
        case 3:
            ctx.fillText("Steering Align", 32, 32);
            break;
        case 4:
            ctx.fillText("Velocity Matching", 32, 32);
            break;
    }
    ctx.fillText("'q' for Pursue", 32, 48);
    ctx.fillText("'w' for Evade", 32, 64);
    ctx.fillText("'e' for Arrive", 32, 80);
    ctx.fillText("'r' for Align", 32, 96);
    ctx.fillText("'t' for Velocity Match", 32, 112);
    switch(selectedFaceMovement) {
        case 0:
            ctx.fillText("Face", 32, 128);
            break;
        case 1:
            ctx.fillText("Look Where You're Going", 32, 128);
            break;
    }
    ctx.fillText("'o' for Face", 32, 144);
    ctx.fillText("'p' for Look Where You're Going", 32, 160);
    
    ctx.fillStyle = "rgb(0,255,0)";
    switch(selectedMovement2) {
        case 0:
            ctx.fillText("Pursue (From Seek)", 600, 32);
            break;
        case 1:
            ctx.fillText("Evade (From Flee)", 600, 32);
            break;
        case 2:
            ctx.fillText("Steering Arrive", 600, 32);
            break;
        case 3:
            ctx.fillText("Steering Align", 600, 32);
            break;
        case 4:
            ctx.fillText("Velocity Matching", 600, 32);
            break;
    }
    
    ctx.fillText("'a' for Pursue", 600, 48);
    ctx.fillText("'s' for Evade", 600, 64);
    ctx.fillText("'d' for Arrive", 600, 80);
    ctx.fillText("'f' for Align", 600, 96);
    ctx.fillText("'g' for Velocity Matching", 600, 112);
    
    switch(selectedFace2Movement) {
        case 0:
            ctx.fillText("Face", 600, 128);
            break;
        case 1:
            ctx.fillText("Look Where You're Going", 600, 128);
            break;
    }
    ctx.fillText("'o' for Face", 600, 144);
    ctx.fillText("'p' for Look Where You're Going", 600, 160);
    
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

