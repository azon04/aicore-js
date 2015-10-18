// Create the canvas
var canvas = document.getElementById("main-canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

var kinematic = {};

// Path
var path = new LineSegmentPath();

// Path Following Algorithm
var followPath = new KinematicFollowPath();

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
    
    // Path Setup
    path.points.push(new Vector(100, 350));
    path.points.push(new Vector(200, 150));
    path.points.push(new Vector(300, 350));
    path.points.push(new Vector(400, 150));
    path.points.push(new Vector(500, 350));
    
    // Path following algorithm setting
    followPath.Seek.character = kinematic;
    followPath.Seek.maxAccel = 20.0;
    followPath.Seek.maxSpeed = 50.0;
    followPath.path = path;
    followPath.pathOffset = -10;
    followPath.currentParam = new SimpleLineSegmentPathParam();
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
    
    // path following algorithm
    var steeringOutput = followPath.getSteering();
    //kinematic.UpdateSteering(steeringOutput, 64 ,modifier);
    kinematic.Update(steeringOutput, modifier);

    // clip the position
    clipPosition(kinematic);
    
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

var drawPath = function(ctx, color, path) {
    ctx.strokeStyle = color;
    if(path.points.length > 0) {
        ctx.moveTo(path.points[0].x, path.points[0].y);
        var index;
        for(index = 1; index <path.points.length; index++) {
            ctx.lineTo(path.points[index].x, path.points[index].y);
        }
    }
    ctx.stroke();
    ctx.restore();
}

// Draw Everything
var render = function() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    
    drawPath(ctx, "#ff0000", path);
    drawKinematic(ctx, "#ff0000", kinematic.position, kinematic.orientation);
    
   
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

