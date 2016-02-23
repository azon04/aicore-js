// Create the canvas
var canvas = document.getElementById("main-canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

var kinematic = {};

// There are n kinematics
var kinematics = new Array();

// And different wandering algorithm
var WanderingMovements = new Array();

// One kinematic repulsor and its algorithm
var respulsorKinematic = new Kinematic();
var CollAvoidMovement = new CollisionAvoidance();

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
    
    kinematics = [];
    WanderingMovements = [];
    // Set Wander
    for(var index = 0; index < 2; index++) {
        kinematics.push(new Kinematic());
        kinematics[index].position.x = 0;
        kinematics[index].position.y = 0;
        
        var WanderMovement = new Wander();
        WanderMovement.Face.Align.character = kinematics[index];
        WanderMovement.Face.Align.maxAngularAcceleration = Math.PI / 15.0;
        WanderMovement.Face.Align.maxRotation = Math.PI / 10.0;
        WanderMovement.Face.Align.targetRadius = 0.01;
        WanderMovement.Face.Align.slowRadius = Math.PI / 4.0;
        WanderMovement.wanderOffset = 40;
        WanderMovement.wanderRadius = 50;
        WanderMovement.wanderRate = Math.PI/3;
        WanderMovement.maxAccel = 10;
        WanderingMovements.push(WanderMovement);
    }
    
    // Set separation
    respulsorKinematic.position.x = canvas.width / 2;
    respulsorKinematic.position.y = canvas.height / 2;
    CollAvoidMovement.character = respulsorKinematic;
    CollAvoidMovement.targets = kinematics;
    CollAvoidMovement.maxAccel = 32;
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
    
    if(69 in keysDown) { // e
        selectedMovement = 2;
    }
    
    /*if(82 in keysDown) { // r
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
    
    if(68 in keysDown) { // d
        selectedMovement2 = 2;
    }
    
    /*if(70 in keysDown) { // f
        selectedMovement2 = 3;
    }
    
    if(71 in keysDown) { // g
        selectedMovement2 = 4;
    }*/

    // wander kinematics
    for(var index =0; index < kinematics.length; index++) {
        var steeringOutput = WanderingMovements[index].getSteering();
        kinematics[index].UpdateSteering(steeringOutput, 32 ,modifier);
        clipPosition(kinematics[index]);
    }
    
    // Collision Avoidance
    var moveSteeringOutput = new SteeringOutput();
    moveSteeringOutput.linear.x = 32;
    moveSteeringOutput.linear.y = 32;
    respulsorKinematic.UpdateSteering(moveSteeringOutput, 32, modifier);
    
    var CollAvoidnSteeringOutput = CollAvoidMovement.getSteering();
    respulsorKinematic.UpdateSteering(CollAvoidnSteeringOutput, 32, modifier);
    
    respulsorKinematic.orientation = getNewOrientation(respulsorKinematic.orientation, respulsorKinematic.velocity);
    
    // clip the position
    clipPosition(respulsorKinematic);
    
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

var drawRadius = function(ctx, color, position, radius) {
    ctx.save();

    ctx.translate(position.x + 8, position.y + 8);
    
    ctx.fillStyle = color;
    ctx.strokeStyle = "#0000ff";
    ctx.beginPath();
    ctx.arc(0,0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

// Draw Everything
var render = function() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    
    for(var index =0; index < kinematics.length; index++)
        drawKinematic(ctx, "#ff0000", kinematics[index].position, kinematics[index].orientation);
    
    drawRadius(ctx, "rgba(0, 0, 255, 0.25)", respulsorKinematic.position, CollAvoidMovement.threshold);
    drawKinematic(ctx, "#00ff00", respulsorKinematic.position, respulsorKinematic.orientation);
    
    
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

