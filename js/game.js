// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = screen.width;
canvas.height = screen.height;
document.body.appendChild(canvas);

// Background Image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero Image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
    heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster Image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function() {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game Objects
var hero = {
    speed: 256,
    x : 0,
    y : 0
};

var monster = {
    x: 0,
    y: 0
};

var kinematic = {};
var kinematic2 = {};
var kinematicSeek = {};

var monstersCought = 0;

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
    
    kinematic2.position.x = (Math.random() * canvas.width);
    kinematic2.position.y = (Math.random() * canvas.height);
    
    // Set seek
    kinematicSeek = new KineamticSeek();
    kinematicSeek.character = kinematic;
    kinematicSeek.target = kinematic2;
    kinematicSeek.maxSpeed = 5.0;
    console.log(kinematicSeek);
}

// Reset the game when the plauer cathes a monster
var reset = function() {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;
    
    monster.x = 32 + (Math.random() * canvas.width - 64);
    monster.y = 32 + (Math.random() * canvas.height - 64);
};

// Update Game Objects
var update = function(modifier) {
    if(38 in keysDown) {
        hero.y -= hero.speed * modifier;
    }
    
    if(40 in keysDown) {
        hero.y += hero.speed * modifier;
    }
    
    if(37 in keysDown) {
        hero.x -= hero.speed * modifier;
    }
    
    if(39 in keysDown) {
        hero.x += hero.speed * modifier;
    }
    
    // Are they touching
    if(hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
       && hero.y <= (monster.y + 32)
       && monster.y <= (hero.y + 32)
      )
    {
        ++monstersCought;
        reset();
    }
    
    // steering algorithm
    var steeringOutput = kinematicSeek.getSteering();
    kinematic.Update(steeringOutput,modifier);
    
    //console.log("kinemaric.orientation : " + kinematic.orientation);
    //console.log("kinematicSeek.character.orientation : " + kinematicSeek.character.orientation);
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

// Draw Everything
var render = function() {
    if(bgReady) {
        ctx.drawImage(bgImage,0,0);
    }
    
    
    drawRotate(ctx, heroReady, heroImage, kinematic.position, kinematic.orientation);
    
    drawRotate(ctx, monsterReady, monsterImage, kinematic2.position, kinematic2.orientation);
    
    
    // Score
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Monsters caught: " + monstersCought, 32, 32);
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
reset();
main();

