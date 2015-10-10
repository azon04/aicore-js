//
// Path Param
//

function SimpleLineSegmentPathParam() {
    this.current = -1; // Current Line Segment Point position
    this.distance = -1; // distance to current Line Segment Point
    
    // This function must be implemented in every path param
    this.addOffset = function(offset) {
        this.distance = this.distance - offset;
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
    
    this.getparam = function(position, lastParam) {
        // LastParam
        var nextParam = SimpleLineSegmentPathParam();
        
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
            nextParam.current = (lastParam.current + 1) % this.points.size();
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
    // hold tha path to follow
    this.path = 0;
    
    // Hold the distance along the path to generate the
    // taget Can be negative if the character is to move
    // along the reverse direction
    
    
}