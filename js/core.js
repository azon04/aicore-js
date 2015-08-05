function Vector(x,y)
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
        
        this.position = this.position.addVector(
          this.velocity.mulConst(time)              
        );
        
        
        this.orientation = this.orientation + this.rotation * time;
        
        // And the velocity and rotation
        this.velocity.x = this.velocity.x + steering.linear.x * time;
        this.velocity.y = this.velocity.y + steering.linear.y * time;
        this.orientation = this.orientation + steering.angular * time;
    }
}

// SteeringOutput. See page 46
function SteeringOutput()
{
    this.linear = new Vector(0,0);
    this.angular = 0;
}