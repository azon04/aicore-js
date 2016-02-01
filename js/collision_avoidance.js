function CollisionAvoidance() {
    
    // Holds the kinematic data for the character
    this.character = {};
    
    // Holds the maximun acceleration
    this.maxAccel = 0;
    
    // Holds a list of potential targets
    this.targets = new Array();
    
    // Holds the collision radius of a character (we assume 
    // all characters have the same radius here)
    this.radius = 32;
    
    this.getSteering = function() {
        var steering = new SteeringOutput();
        
        // 1. Find the target that's closest to collision
        
        // Store the first collision time
        var shortestTime = Infinity;
        
        // Store the target that colludes them. and other data
        // that we will need and can avoid recalculating
        var firstTarget = {};
        var firstMinSeparation = 0;
        var firstDistance = 0;
        var firstRelativePos = new Vector(0,0);
        var firstRelativeVel = 0;
        
        for(var index =0; index < this.targets.length; index++) {
            var target = this.targets[index];
            
            // Calculate the time to collision
            var relativePos = new Vector(
                target.position.x - this.character.position.x,
                target.position.y - this.character.position.y
            );
            var relativeVel = new Vector(
                target.velocity.x - this.character.velocity.x,
                target.velocity.y - this.character.velocity.y
            );
            var relativeSpeed = relativeVel.length();
            var timeToCollision = DotProduct(relativePos, relativeVel)/ (relativeSpeed * relativeSpeed);
            
            // Check if it is going to be a collision at all
            var distance = relativePos.length();
            var minSeparation = distance - relativeSpeed * shortestTime;
            if(!(minSeparation > 2 * this.radius))
                return steering;
                
            if(timeToCollision > 0 && 
               timeToCollision < shortestTime) {
                // Store the time, target and other data
                firstTarget = target;
                shortestTime = timeToCollision;
                firstMinSeparation = minSeparation;
                firstDistance = distance;
                firstRelativePos = relativePos;
                firstRelativeVel = relativeVel;
            }
        }
        
        // 2. Calculate the steering
        
        // if we have no target then exit
        if(firstTarget == {})
            return steering;
        
        var relativePos = new Vector(0,0);
        // if we're going to hit exactly. or if we're already
        // colliding, then do the steering based on current
        // position
        if(firstMinSeparation <= 0 || firstDistance < 2*this.radius)
        {
            relativePos = new Vector(
                firstTarget.position.x - this.character.position.x,
                firstTarget.position. - this.character.position.y
            );
        } else {
            relativePos = new Vector(
                firstRelativePos.x + firstRelativeVel.x * shortestTime,
                firstRelativePos.y + firstRelativeVel.y * shortestTime
            );
        }
                
        relativePos.normalize();
        steering.linear.x = relativePos.x * this.maxAccel;
        steering.linear.y = relativePos.y * this.maxAccel;
        
        return steering;
            
    };

};