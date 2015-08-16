function Vector(x, y)
{
    this.x = x;
    this.y = y;
    
    this.mulVector = function(otherVector) {
        var newVector = new Vector(0,0);
        newVector.x = this.x * otherVector.x;
        newVector.y = this.y * otherVector.y;
        return newVector;
    };
    
    this.mulConst = function(number) {
        var newVector = new Vector(0,0);
        newVector.x = this.x * number;
        newVector.y = this.y * number;
        return newVector;
    };
    
    this.addVector = function(otherVector) {
        var newVector = new Vector(0,0);
        newVector.x = this.x + otherVector.x;
        newVector.y = this.y + otherVector.y;
        return newVector;
    };
    
    this.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    
    this.normalize = function() {
        var length = this.length();
        this.x /= length;
        this.y /= length;
    };
}

// Static. See page 43
function Static()
{
    this.position = new Vector(0,0);
    this.orientation = 0.0;
}

// Kinematic. See page 46
function Kinematic()
{
    this.position = new Vector(0,0);
    this.orientation = 0.0;
    this.velocity = new Vector(0,0);
    this.rotation = 0.0;
    this.Update = function(steering, time) {
        
        this.position.x += steering.linear.x * time;
        this.position.y += steering.linear.y * time;
        
        this.orientation = this.orientation + this.rotation * time;
        
        // And the velocity and rotation
        this.velocity.x = this.velocity.x + steering.linear.x * time;
        this.velocity.y = this.velocity.y + steering.linear.y * time;
        this.rotation = this.rotation + steering.angular * time;
    };
    
    this.UpdateSteering = function(steering, maxSpeed, time) {
        
        // Update the position and orientation
        this.position.x += this.velocity.x * time;
        this.position.y += this.velocity.y * time;
        this.orientation += this.rotation * time;
        
        // and the velocity and rotation
        this.velocity.x += steering.linear.x * time;
        this.velocity.y += steering.linear.y * time;
        this.rotation += steering.angular * time;
        
        // Check speeding and clip
        if(this.velocity.length() > maxSpeed) {
            this.velocity.normalize();
            this.velocity.x *= maxSpeed;
            this.velocity.y *= maxSpeed;
        }
    };
    
}

var getNewOrientation = function(currentOrientation, velocity) {
    // Make sure we have a velocity
    if(velocity.length() > 0) {
        return Math.atan2(-velocity.x, velocity.y);
    } else {
        return currentOrientation;
    }
}

// SteeringOutput. See page 46
function SteeringOutput()
{
    this.linear = new Vector(0,0);
    this.angular = 0;
}
