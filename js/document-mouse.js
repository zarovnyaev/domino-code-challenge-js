
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
        $(document).on("mousemove", function(event) {
            this.x = event.pageX;
            this.y = event.pageY;
            if (typeof this.onMove === "function") {
                this.onMove();
            }
        }.bind(this));
    }
    
};

$(document).ready(function(){
    DocumentMouse.init();
});