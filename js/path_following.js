//
// Path Param
//

// More complex path param
// path param is only consist distance of the path
function PathParam() {
    this.distance = 0;
    
    this.addOffset = function(offset) {
        var returnParam = new PathParam();
        returnParam.distance = this.distance + offset;
        return returnParam;
    };
}

//
// Path
//

// LineSegment Path using Path Param (Distance only)
function LinePath() {
    
    // Basic Structure of Line Segment Path / Collection of Points 
    this.points = Array();
    
    // Save the cached distance
    this.distanceForPoints = Array();
    
    this.changeRadius = 10; // Radius to change to next point
    
    this.getParam = function(position, lastParam) {
        var nextParam = new PathParam();
        
        // Search nearest point from last param
        var distanceOfPath = this.distanceForPoints[1];
        var index = 1;
        while(distanceOfPath-this.changeRadius < lastParam.distance && index < this.points.length) {
            index++;
            distanceOfPath += this.distanceForPoints[index];
        }
        
        if(index == this.points.length) {
            nextParam.distance = this.distanceForPoints[this.points.length-1];
            return nextParam;
        }
        
        var point1 = this.points[index-1];
        var point2 = this.points[index];
        var vector1 = new Vector(point2.x - point1.x, point2.y - point1.y);
        var vector2 = new Vector(position.x - point1.x, position.y - point1.y);
        
        vector1.normalize();
        var distanceFromPoint1 = DotProduct(vector1, vector2);
        nextParam.distance = distanceOfPath - this.distanceForPoints[index] + distanceFromPoint1;
        
        return nextParam;
    };
    
    this.getPosition = function(param) {
        
        // Search nearest point from last param
        var distanceOfPath = this.distanceForPoints[1];
        var index = 1;
        while(distanceOfPath < param.distance && index < this.points.length) {
            index++;
            distanceOfPath += this.distanceForPoints[index];
        }
        
        if (index == this.points.length) {
            return this.points[this.points.length-1];
        }
        
        var diff = param.distance - (distanceOfPath-this.distanceForPoints[index]);
        var point1 = this.points[index-1];
        var point2 = this.points[index];
        var vector1 = new Vector(point2.x - point1.x, point2.y - point1.y);
        vector1.normalize();
        var returnedPoint = new Vector( point1.x + diff * vector1.x,
                                       point1.y + diff * vector1.y);
        
        return returnedPoint;
    };
        
    this.construct = function() {
        this.distanceForPoints[0] = 0;
        for(var i=1; i < this.points.length; i++) {
            var vectorDistance = new Vector(this.points[i-1].x - this.points[i].x,
                                               this.points[i-1].y - this.points[i].y);
            var distance = vectorDistance.length();
            this.distanceForPoints[i] = distance;
        }
    };
    
}




//
// Path Following Algorithm
//

function KinematicFollowPath() {
    // Hold the algorithm for seek
    this.Seek = new KinematicSeek();
    
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