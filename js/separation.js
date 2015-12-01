function Separation() {
    
    // Hold the kinematic data for the character
    this.character = {};
    
    // Holds a list of potential targets
    this.targets = new Array();
    
    // Holds the threshold to take action
    this.threshold = 10;
    
    // Holds the constant coefficient of decay for the
    // inverse square law force
    this.decayCoefficient = 5;
    
    // Holds the maximum acceleration of the character
    this.maxAccel = 10;
    
    // Get Steering
    this.getSteering = function() {
        SteeringOutput steering = new SteeringOutput();
        
        for(var index = 0; index < this.targets.size(); index++) {
            
            // check if target is close
            var target = this.targets[index];
            var direction = new Vector(
                target.position.x - this.character.position.x,
                target.position.y - this.character.position.y
            );
            var distance = direction.length();
            if(distance < this.threshold) {
                
                // Calculate the strength of repulsion
                var strength = Math.min(
                    this.decayCoefficient / (distance * distance),
                    this.maxAccel;
                );
                
                // Add the acceleration
                direction.normalize();
                streering.linear.x += strength * direction.x;
                streering.linear.y += strength * direction.y;
            }
            
        }
        
        return steering;
    };
};