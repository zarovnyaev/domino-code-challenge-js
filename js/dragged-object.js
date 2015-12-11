
var DraggedObject = function(params)
{
    params = params || {};
    
    this.onDragStart = params.onDragStart || null;
    this.onDrag = params.onDrag || null;
    this.onDragStop = params.onDragStop || null;
    
    this.element = params.element || null;
    
    // Element's current positions
    this.elementPositionX = this.elementPositionY = null;

    // Set timer for element position update in dragging process
    this.draggingTimer = null;
    this.dragElementPositionUpdatePeriod = 10;
};

/**
 * Initialization
 */
DraggedObject.prototype.init = function()
{
    // Sets cursor
    this.element.css('cursor', 'move');
    
    var self = this;
    
    // Set start
    this.element.mousedown(function() {
        self.onDraggingStart();
    });
    
    // Set end
    this.element.mouseup(function() {
        self.onDraggingStop();
    });
};

/**
 * When dragging is started
 */
DraggedObject.prototype.onDraggingStart = function()
{
    var self = this;
    
    // Set element position
    this.elementPositionX = this.element.position().left;
    this.elementPositionY = this.element.position().top;

    // Set on element cursor positions
    this.onElementCursorPositionX = DocumentMouse.getX() 
                                  - this.elementPositionX;
    this.onElementCursorPositionY = DocumentMouse.getY() 
                                  - this.elementPositionY;

    DocumentMouse.setMoveListenner(function() {
        self.elementPositionUpdate();
    });
    
    // Execute onDragStart function is specified
    if (typeof this.onDragStart === 'function') {
        this.onDragStart();
    }
};

/**
 * Element position updater in dragging process
 */
DraggedObject.prototype.elementPositionUpdate = function()
{
    var newElementPositionX = DocumentMouse.getX() 
                            - this.onElementCursorPositionX;
    var newElementPositionY = DocumentMouse.getY() 
                            - this.onElementCursorPositionY;

    if (newElementPositionX === this.elementPositionX
        && newElementPositionY === this.elementPositionY
    ) {
        return;
    }
    
    this.elementPositionX = newElementPositionX;
    this.elementPositionY = newElementPositionY;
    
    // Execute onDrag function is specified
    if (typeof this.onDrag === 'function') {
        this.onDrag();
    }
};

/**
 * When dragging is finished
 */
DraggedObject.prototype.onDraggingStop = function()
{
    // Clear cursor positions
    this.onElementCursorPositionX 
        = this.onElementCursorPositionY 
        = this.elementPositionX
        = this.elementPositionY
        = null;

    // Clear dragging listenner
    DocumentMouse.clearMoveListenner();
    
    // Execute onDragStart function is specified
    if (typeof this.onDragStop === 'function') {
        this.onDragStop();
    }
};

/**
 * Returns position Y of dragged element
 * @returns Int
 */
DraggedObject.prototype.getPositionY = function()
{
    return this.elementPositionY;
};

/**
 * Returns position X of dragged element
 * @returns Int
 */
DraggedObject.prototype.getPositionX = function()
{
    return this.elementPositionX;
};