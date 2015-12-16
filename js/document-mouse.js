
/**
 * Class DocumentMousePosition
 */
var DocumentMouse = {
    
    x: null,
    y: null,
    onMove: null,
    
    getX: function()
    {
        return this.x;
    },
    
    getY: function()
    {
        return this.y;
    },
    
    setMoveListenner: function(onMove)
    {
        this.onMove = onMove;
    },
    
    clearMoveListenner: function()
    {
        this.setMoveListenner(null);
    },
    
    init: function()
    {
        var _documentMouseObj = this;
        $(document).on("mousemove", function(event) {
            _documentMouseObj.x = event.pageX;
            _documentMouseObj.y = event.pageY;
            if (typeof _documentMouseObj.onMove === "function") {
                _documentMouseObj.onMove();
            }
        });
    }
    
};

$(document).ready(function(){
    DocumentMouse.init();
});