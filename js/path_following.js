//
// Path Param
//

function SimpleLineSegmentPathParam() {
    this.current = -1; // Current Line Segment Point position
    this.distance = -1; // distance to current Line Segment Point
    
    // This function must be implemented in every path param
    this.addOffset = function(offset) {
        var returnParam = new SimpleLineSegmentPathParam();
        returnParam.distance = this.distance - offset;
        returnParam.current = this.current;
        return returnParam;
    };
}

//
// Path
//

// Line Segment Path With SImple Line Segment Param
function LineSegmentPath() {
    
    // Basic Structure of Line Segment Path / Collection of Points 
    this.points = Array();
    
    this.changeRadius = 5; // Radius to change to next point
    
    this.getParam = function(position, lastParam) {
        
        // LastParam
        var nextParam = new SimpleLineSegmentPathParam();
        
        if(lastParam.current == -1) {
            nextParam.current = 0;
            nextParam.distance = new Vector(position.x - this.points[0].x, position.y - this.points[0].y).length();
            return nextParam;
        }
        
        // Current point
        var point = this.points[lastParam.current];
        
        // calculate distance between
        var distanceVector =  new Vector(position.x - point.x, position.y - point.y);
        var distance = distanceVector.length();
        
        // If distance less than radius, posibly it pass the point
        if(distance < this.changeRadius) {
            nextParam.current = (lastParam.current + 1) % this.points.length;
            point = this.points[nextParam.current];
            nextParam.distance = new Vector(position.x - point.x, position.y - point.y).length();
        } else {
            // update distance only
            nextParam.current = lastParam.current;
            nextParam.distance = distance;
        }
        
        // TODO : Handle reverse direction
        
        return nextParam;
    };
    
    this.getPosition = function(param) {
        if(param.current == -1) {
            return this.points[0];
        }
        return this.points[param.current];
    };
    
}

//
// Path Following Algorithm
//

function FollowPath() {
    // Hold the algorithm for seek
    this.Seek = new SteeringSeek();
    
    // hold tha path to follow
    this.path = 0;
    
    // Hold the distance along the path to generate the
    // taget Can be negative if the character is to move
    // along the reverse direction
    this.pathOffset = 0;
    
    // Holds the current param of the path
    this.currentParam = 0;
    
    this.getSteering = function() {
        // 1. Calculate the target to delegate to face
        
        // Find the current position on the path
        this.currentParam = this.path.getParam(this.Seek.character.position, this.currentParam);
        
        // Offset it
        targetParam = this.currentParam.addOffset(this.pathOffset);
        
        // Get the target position
        this.Seek.target = new Kinematic();
        this.Seek.target.position = path.getPosition(targetParam);
        
        return this.Seek.getSteering();
    };
}