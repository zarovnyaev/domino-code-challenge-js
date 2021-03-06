
var DominosConfigBlock = function(params)
{
    params = params || {};
    
    this.obj = $('#dominos-config-block');
    this.containerObj = $('#dominos-config-block-container', this.obj);
    this.addNewDominoObj = $('#addNewDomino', this.obj);
    
    this.blocks = [];
};

/**
 * Initialization of dominos config block
 */
DominosConfigBlock.prototype.init = function()
{
    // When "Add new domino" link was clicked
    this.addNewDominoObj.click(this.addDominoConfigBlock.bind(this));
    
    // Udate block view
    this.updateBlockView();
    $(window).resize(this.updateBlockView.bind(this));
};

/**
 * Hide content of all blocks
 */
DominosConfigBlock.prototype.hideAllBlocksContent = function()
{
    for (var i in this.blocks) {
        this.blocks[i].hideContent();
    }
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
        parentContainerObj: this.containerObj,
        configBlockPanel: this
    });
    newDominoConfigBlock.init();
    this.blocks.push(newDominoConfigBlock);
};
