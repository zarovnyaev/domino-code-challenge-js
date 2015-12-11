
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
        var self = this;
        $(document).on("mousemove", function(event) {
            self.x = event.pageX;
            self.y = event.pageY;
            if (typeof self.onMove === "function") {
                self.onMove();
            }
        });
    }
    
};

$(document).ready(function(){
    DocumentMouse.init();
});