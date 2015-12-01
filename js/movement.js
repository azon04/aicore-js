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
        
        // As Vector function : change from orientation to Vector
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
        
        // this.character.orientation = getNewOrientation(this.character.orientation, steeringOutput.linear);
        
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
        
        // this.character.orientation = getNewOrientation(this.character.orientation, steeringOutput.linear);
        
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

function VelocityMatch() {
    // Hold data for the character and target
    this.character = {};
    this.target = {};
    
    // Maximum Acceleration of the character
    this.maxAccel = 0.0;
    
    // Holds the time over which to achieve target speed
    this.timeToTarget = 0.1;
    
    this.getSteering = function() {
        
        var steeringOutput = new SteeringOutput();
        
        // Acceleration tries to get to the target velocity
        steeringOutput.linear.x = this.target.velocity.x - this.character.velocity.x;
        steeringOutput.linear.y = this.target.velocity.y - this.character.velocity.y;
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

/**
* Delegated Movements
**/

function Pursue() {
    this.seek = new SteeringSeek();
    
    // Holds the maximum prediction time
    this.maxPrediction = 0.0;
    
    //
    this.target ={};
    
    this.getSteering = function() {
        // Work out the distance target
        var direction = new Vector( this.target.position.x - this.seek.character.position.x,
                                   this.target.position.y - this.seek.character.position.y);
        var distance = direction.length();
        
        // Work out our current speed
        var speed = this.seek.character.velocity.length();
        
        var prediction = 0;
        // Check if speed is too small to give a reasonable
        // prediction time
        if(speed <= distance/this.maxPrediction)
            prediction = this.maxPrediction;
        else
            prediction = distance / speed;
        
        // Put the target together
        this.seek.target = new Kinematic();
        this.seek.target.position.x = this.target.position.x + this.target.velocity.x * prediction;
        this.seek.target.position.y = this.target.position.y + this.target.velocity.y * prediction;
        
        return this.seek.getSteering();
                                   
    }
}


function Evade() {
    this.flee = new SteeringFlee();
    
    // Holds the maximum prediction time
    this.maxPrediction = 0.0;
    
    //
    this.target ={};
    
    this.getSteering = function() {
        // Work out the distance target
        var direction = new Vector( this.target.position.x - this.flee.character.position.x,
                                   this.target.position.y - this.flee.character.position.y);
        var distance = direction.length();
        
        // Work out our current speed
        var speed = this.flee.character.velocity.length();
        
        var prediction = 0;
        // Check if speed is too small to give a reasonable
        // prediction time
        if(speed <= distance/this.maxPrediction)
            prediction = this.maxPrediction;
        else
            prediction = distance / speed;
        
        // Put the target together
        this.flee.target = new Kinematic();
        this.flee.target.position.x = this.target.position.x + this.target.velocity.x * prediction;
        this.flee.target.position.y = this.target.position.y + this.target.velocity.y * prediction;
        
        return this.flee.getSteering();
                                   
    }
}

function Face() {
    this.Align = new SteeringAlign();
    
    this.Align.target = new Kinematic(); // setup imaginery target
    
    //
    this.target = {};
    
    this.getSteering = function() {
        // Calculate teh target to delegate
        
        // Work out the direction to target
        var direction = new Vector(0,0);
        direction.x = this.target.position.x - this.Align.character.position.x;
        direction.y = this.target.position.y - this.Align.character.position.y;
        
        // Check for a zero direction, and make no change if so
        if(direction.length() == 0)
            return new SteeringOutput();
        
        // Put target together
        this.Align.target.orientation = Math.atan2(-direction.x, direction.y);
        
        return this.Align.getSteering();
    }
}

function LookWhereYoureGoing() {
    this.Align = new SteeringAlign();
    this.Align.target = new Kinematic(); // setup imaginery target
    
    this.getSteering = function() {
        // Calculate the target to dlegate
        
        // Check a zero direction, and make no change if so
        if(this.Align.character.velocity.length() == 0)
            return new SteeringOutput();
        
        // Otherwise set the target based on the velocity
        this.Align.target.orientation = Math.atan2(-this.Align.character.velocity.x, this.Align.character.velocity.y);
        
        return this.Align.getSteering();
    }
}

function Wander() {
    this.Face = new Face();
    this.Face.target = new Kinematic();
    
    // Holds the radius and the forwared offset of the wander circle
    this.wanderOffset = 0.0;
    this.wanderRadius = 0.0;
    
    // Holds the maximum rate at which the wander orientation can change
    this.wanderRate = 0.0;
    
    // Holds the current orientation of the wander target
    this.wanderOrientation = 0.0;
    
    // Hold the maximum acceleration of the character
    this.maxAccel = 0.0;
    
    this.getSteering = function() {
        // Calculate the target to delegate to face
        
        // Update the wander orientation
        this.wanderOrientation += (Math.random() - Math.random()) * this.wanderRate;
        
        // Calculate the combined target orientation
        var targetOrientation = this.wanderOrientation + this.Face.Align.character.orientation;
        
        
        // Calculate the circle of the wander circle
        this.Face.target.position.x = this.Face.Align.character.position.x + this.wanderOffset * -Math.sin(this.Face.Align.character.orientation);
        this.Face.target.position.y = this.Face.Align.character.position.y + this.wanderOffset * Math.cos(this.Face.Align.character.orientation);
        
        // Calculate the target location
        this.Face.target.position.x += this.wanderRadius * -Math.sin(targetOrientation);
        this.Face.target.position.y += this.wanderRadius * Math.cos(targetOrientation);
        
        // Deleagate the face
        var steering = this.Face.getSteering();
        
        // Now set the linear acceleration to be at full acceleration in the direction of the orientation
        steering.linear.x = this.maxAccel * -Math.sin(this.Face.Align.character.orientation);
        steering.linear.y = this.maxAccel * Math.cos(this.Face.Align.character.orientation);
        
        return steering;
    }
}