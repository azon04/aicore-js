function KinematicSeek() {
    // Hold data for the character and target
    this.character = {};
    this.target = {};
    
    // Maximum Speed the character can travel
    this.maxSpeed = 0.0;
    
    this.getSteering = function() {
        
        var steeringOutput = new SteeringOutput();
        
        steeringOutput.linear.x = this.target.position.x - this.character.position.x;
        steeringOutput.linear.y = this.target.position.y - this.character.position.y;
        
        steeringOutput.linear.normalize();
        steeringOutput.linear.x *= this.maxSpeed;
        steeringOutput.linear.y *= this.maxSpeed;
        
        this.character.orientation = getNewOrientation(this.character.orientation, steeringOutput.linear);
        
        // Output steering
        return steeringOutput;
    };
}

function KinematicFlee() {
    // Hold data for the character and target
    this.character = {};
    this.target = {};
    
    // Maximum Speed the character can travel
    this.maxSpeed = 0.0;
    
    this.getSteering = function() {
        
        var steeringOutput = new SteeringOutput();
        
        steeringOutput.linear.x = this.character.position.x - this.target.position.x;
        steeringOutput.linear.y = this.character.position.y - this.target.position.y;
        
        steeringOutput.linear.normalize();
        steeringOutput.linear.x *= this.maxSpeed;
        steeringOutput.linear.y *= this.maxSpeed;
        
        this.character.orientation = getNewOrientation(this.character.orientation, steeringOutput.linear);
        
        // Output steering
        return steeringOutput;
    };
}

function KinematicWandering() {
    // Hold data for the character and target
    this.character = {};
    
    // Maximum Speed the character can travel
    this.maxSpeed = 0.0;
    
    // Maximum rotation
    this.maxRotation = Math.PI;
    
    this.getSteering = function() {
        
        var steeringOutput = new SteeringOutput();
        
        steeringOutput.linear.x = -this.maxSpeed * Math.sin(this.character.orientation);
        steeringOutput.linear.y = this.maxSpeed * Math.cos(this.character.orientation);
        
        steeringOutput.angular = (Math.random() - Math.random()) * this.maxRotation ;
        
        // Output steering
        return steeringOutput;
    };
}

function KinematicArrive() {
    // Hold data for the character and target
    this.character = {};
    this.target = {};
    
    // Maximum Speed the character can travel
    this.maxSpeed = 0.0;
    
    // Hold the statisfaction radius
    this.radius = 0.0;
    
    // Hold the time to target constant
    this.timeToTarget = 0.25;
    
    this.getSteering = function() {
        
        var steeringOutput = new SteeringOutput();
        
        steeringOutput.linear.x = this.target.position.x - this.character.position.x;
        steeringOutput.linear.y = this.target.position.y - this.character.position.y;
        
        if(steeringOutput.linear.length() < this.radius) {
            return new SteeringOutput();
        }
        
        steeringOutput.linear.x /= this.timeToTarget;
        steeringOutput.linear.y /= this.timeToTarget;
        
        if(steeringOutput.linear.length() > this.maxSpeed) {
            steeringOutput.linear.normalize();
            steeringOutput.linear.x *= this.maxSpeed;
            steeringOutput.linear.y *= this.maxSpeed;
        }
        
        this.character.orientation = getNewOrientation(this.character.orientation, steeringOutput.linear);
        
        // Output steering
        return steeringOutput;
    };
}


// Steering algorithm
function SteeringSeek() {
    // Hold data for the character and target
    this.character = {};
    this.target = {};
    
    // Maximum Speed the character can travel
    this.maxAccel = 0.0;
    
    this.getSteering = function() {
        
        var steeringOutput = new SteeringOutput();
        
        steeringOutput.linear.x = this.target.position.x - this.character.position.x;
        steeringOutput.linear.y = this.target.position.y - this.character.position.y;
        
        steeringOutput.linear.normalize();
        steeringOutput.linear.x *= this.maxAccel;
        steeringOutput.linear.y *= this.maxAccel;
        
        this.character.orientation = getNewOrientation(this.character.orientation, steeringOutput.linear);
        
        // Output steering
        steeringOutput.angular = 0;
        return steeringOutput;
    };
}

function SteeringFlee() {
    // Hold data for the character and target
    this.character = {};
    this.target = {};
    
    // Maximum Speed the character can travel
    this.maxAccel = 0.0;
    
    this.getSteering = function() {
        
        var steeringOutput = new SteeringOutput();
        
        steeringOutput.linear.x = this.character.position.x - this.target.position.x;
        steeringOutput.linear.y = this.character.position.y - this.target.position.y;
        
        steeringOutput.linear.normalize();
        steeringOutput.linear.x *= this.maxAccel;
        steeringOutput.linear.y *= this.maxAccel;
        
        this.character.orientation = getNewOrientation(this.character.orientation, steeringOutput.linear);
        
        // Output steering
        steeringOutput.angular = 0;
        return steeringOutput;
    };
}