function Separation() {
    
    // Hold the kinematic data for the character
    this.character = {};
    
    // Holds a list of potential targets
    this.targets = new Array();
    
    // Holds the threshold to take action
    this.threshold = 200;
    
    // Holds the constant coefficient of decay for the
    // inverse square law force
    this.decayCoefficient = 100;
    
    this.multiplier = 100;
    
    // Holds the maximum acceleration of the character
    this.maxAccel = 10;
    
    // Get Steering
    this.getSteering = function() {
        var steering = new SteeringOutput();
        
        for(var index = 0; index < this.targets.length; index++) {
            // check if target is close
            var target = this.targets[index];
            var direction = new Vector(
                this.character.position.x - target.position.x,
                this.character.position.y - target.position.y
            );
            var distance = direction.length();
            if(distance < this.threshold) {
                
                // Calculate the strength of repulsion
                var strength = Math.min(
                    this.multiplier * this.decayCoefficient / (distance * distance),
                    this.maxAccel
                );
                
                // Add the acceleration
                direction.normalize();
                steering.linear.x += strength * direction.x;
                steering.linear.y += strength * direction.y;
                
            }
            
        }
        
        this.character.orientation = getNewOrientation(this.character.orientation, steering.linear);
        
        return steering;
    };
};