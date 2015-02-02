
var DominosConfigBlock = function(params)
{
    params = params || {};
    
    this.obj = $('#dominos-config-block');
    this.containerObj = $('#dominos-config-block-container', this.obj);
    this.addNewDominoObj = $('#addNewDomino', this.obj);
};

/**
 * Initialization of dominos config block
 */
DominosConfigBlock.prototype.init = function()
{
    var self = this;
    
    // When "Add new domino" link was clicked
    this.addNewDominoObj.click(function()
    {
        self.addDominoConfigBlock();
    });
    
    // Udate block view
    this.updateBlockView();
    $(window).resize(function()
    {
        self.updateBlockView();
    });
};

/**
 * Updates block view
 */
DominosConfigBlock.prototype.updateBlockView = function()
{
    this.containerObj.css('height', $(window).height() - $(this.addNewDominoObj).height());
};

/**
 * Initialization of dominos config block
 */
DominosConfigBlock.prototype.addDominoConfigBlock = function()
{
    var newDominoConfigBlock = new DominoConfigBlock({
        parentContainerObj: this.containerObj
    });
    newDominoConfigBlock.init();
};
