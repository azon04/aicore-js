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

function SteeringArrive() {
    // Hold data for the character and target
    this.character = {};
    this.target = {};
    
    // Maximum Speed and Acceleration of the character
    this.maxAccel = 0.0;
    this.maxSpeed = 0.0;
    
    // Holds the radius for arriving at the target
    this.targetRadius = 0.0;
    
    // Holds the radius for beginnung to slow down
    this.slowRadius = 1.0;
    
    // Holds the time over which to achieve target speed
    this.timeToTarget = 0.1;
    
    this.getSteering = function() {
        
        var steeringOutput = new SteeringOutput();
        
        // Get the direction to the target
        var direction = new Vector(0,0);
        direction.x = this.target.position.x - this.character.position.x;
        direction.y = this.target.position.y - this.character.position.y;
        var distance = direction.length();
        
        // check if we are there return no steering
        if(distance < this.targetRadius) {
            return steeringOutput;
        }
        
        // If we are outside of slow radius, then go max speed
        var targetSpeed;
        if(distance > this.slowRadius) {
            targetSpeed = this.maxSpeed;
        } // otherwise calculate a scaled speed
        else {
            targetSpeed = this.maxSpeed * distance / this.slowRadius;
            
        }
        
        // Target velocity combines speed and direction
        var targetVelocity = direction;
        targetVelocity.normalize();
        targetVelocity.x *= targetSpeed;
        targetVelocity.y *= targetSpeed;
        
        // Accelerate tries to get the target velocity
        steeringOutput.linear.x = targetVelocity.x - this.character.velocity.x;
        steeringOutput.linear.y = targetVelocity.y - this.character.velocity.y;
        steeringOutput.linear.x /= this.timeToTarget;
        steeringOutput.linear.y /= this.timeToTarget;
        
        // Check if the acceleration is too fast
        if(steeringOutput.linear.length() > this.maxAccel) {
            steeringOutput.linear.normalize();
            steeringOutput.linear.x *= this.maxAccel;
            steeringOutput.linear.y *= this.maxAccel;
        }
        
        // Output steering
        steeringOutput.angular = 0;
        return steeringOutput;
    };
}

function SteeringAlign() {
    // Holds the Kinematic data for the character and target
    this.character = {};
    this.target = {};
    
    // Holds the max angular acceleration and rotation
    // of the character
    this.maxAngularAcceleration = 0.0;
    this.maxRotation = 0.0;
    
    // Holds the radius for arriving at the target
    this.targetRadius = 0.0;
    
    // Holds the radius for beginning to slow down
    this.slowRadius = 0.0;
    
    // Holds the time over which to achieve target speed
    this.timeToTarget = 0.1;
    
    this.getSteering = function() {
        
        var steering = new SteeringOutput();
        
        // Get the naive direction to the target
        var rotation = this.target.orientation - this.character.orientation;
        
        // Map the result to the (-pi,pi) interval
        rotation = mapToRange(rotation);
        var rotationSize = Math.abs(rotation);
        
        // Check if we are there
        if(rotationSize < this.targetRadius) {
            return steering;
        }
        
        var targetRotation = 0;
        // If we are outside the slowradius, then use
        // maximum rotation
        if(rotationSize > this.slowRadius) {
            targetRotation = this.maxRotation;
        } // Otherwise calculate a scaled rotation
        else {
            targetRotation = this.maxRotation * rotationSize / this.slowRadius;
        }
        
        // The final target rotation combines
        // speed (already in the variable) and direction
        targetRotation *= rotation / rotationSize;
        
        // Acceleration tries to get to target rotation
        steering.angular = targetRotation - this.character.rotation;
        steering.angular /= this.timeToTarget;
        
        // Check if acceleration is too great
        var angularAcceleration = Math.abs(steering.angular);
        if(angularAcceleration > this.maxAngularAcceleration) {
            steering.angular /= angularAcceleration;
            steering.angular *= this.maxAngularAcceleration;
        }
        
        return steering;
    };
}