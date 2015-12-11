
var DominoConfigBlock = function(params)
{
    params = params || {};
    
    this.configBlockPanel = params.configBlockPanel || null;
    
    this.parentContainerObj = params.parentContainerObj || null;
    this.obj = this.container = this.topLine = null;
    
    // Create domino
    this.domino = null;
    this.dominoParams = params.dominoParams || {};
};

/**
 * Initialization of domino
 */
DominoConfigBlock.prototype.init = function()
{
    if (this.parentContainerObj === undefined) {
        return;
    }
    
    // Create domino
    this.dominoParams.configBlock = this;
    this.domino = new Domino(this.dominoParams);
    this.domino.init();
    
    var self = this;
    
    // Create and insert block
    this.obj = $("<div/>", {
        class: 'domino-config-block'
    }).appendTo(this.parentContainerObj);
    
    // Insert form code from template "domino-config-block-template"
    $(document.getElementById('domino-config-block-template').innerHTML).appendTo(this.obj);
    
    // Sets domino raising when mouse over
    this.obj.hover(
        function() { self.domino.raise(); },
        function() { self.domino.unraiseOther(); }
    );
    
    // Set panel objects
    this.container = $('.container', this.obj);
    this.topLine = $('.top-line', this.obj);
    this.deleteBtnObj = $('a[data-rel=delete-btn]', this.obj);
    this.updateBtnObj = $('input[data-rel=update-btn]', this.obj);
    // Inputs
    this.inputPositionLeftObj = $('input[name=position-left]', this.obj);
    this.inputPositionTopObj = $('input[name=position-top]', this.obj);
    this.inputRotateObj = $('input[name=rotate]', this.obj);
    this.inputFace1Obj = $('select[name=face-1]', this.obj);
    this.inputFace2Obj = $('select[name=face-2]', this.obj);
    this.faceRandObj = $('a[data-rel=face-rand-btn]', this.obj);
    this.inputSizeTypeObj = $('select[name=size-type]', this.obj);
    this.inputSizeWidthObj = $('input[name=size-width]', this.obj);
    this.inputSizeHeightObj = $('input[name=size-height]', this.obj);
    this.ratioBodyWidthLineObj = $('div[data-rel=size-ratio-body-width-line]', this.obj);
    this.inputratioBodyWidthObj = $('input[name=size-ratio-body-width]', this.obj);
    
    // Sets domino parameters to the form
    this.inputPositionTopObj.val(this.domino.dominoTop);
    this.inputPositionLeftObj.val(this.domino.dominoLeft);
    this.inputRotateObj.val(this.domino.dominoRotate);
    this.inputFace1Obj.val(this.domino.faceDots[1]);
    this.inputFace2Obj.val(this.domino.faceDots[2]);
    this.inputSizeTypeObj.val(this.domino.dominoSizeCalcType);
    this.inputSizeWidthObj.val(this.domino.dominoSizeWidth);
    this.inputSizeHeightObj.val(this.domino.dominoSizeHeight);
    this.inputratioBodyWidthObj.val(this.domino.dominoSizeRatioBodyWidth);
    this.setSizeType();
    
    // Set delete listener
    this.deleteBtnObj.click(function(event)
    {
        self.deleteBlock();
        event.preventDefault();
        event.stopPropagation();
    });
    
    // Set domino update listener
    this.updateBtnObj.click(function(event)
    {
        self.updateDomino();
        event.preventDefault();
        event.stopPropagation();
    });
    
    // Face rand click
    this.faceRandObj.click(function(event)
    {
        self.setRandomDominoFaces();
        event.preventDefault();
        event.stopPropagation();
    });
    
    // Top line click
    this.topLine.click(function() {
        self.toggleContent();
    });
    
    // Set domino size type update listener
    this.inputSizeTypeObj.change(function(event)
    {
        self.setSizeType();
    });
};

/**
 * Sets domino size type
 * @param {String} type
 */
DominoConfigBlock.prototype.setSizeType = function(type)
{
    if (type === undefined) {
        type = this.inputSizeTypeObj.val();
    } else {
        this.inputSizeTypeObj.val(type);
    }
    
    if (type === 'bodyRatio') {
        this.ratioBodyWidthLineObj.show();
    } else {
        this.ratioBodyWidthLineObj.hide();
    }
};

/**
 * Sets random faces of the domino
 */
DominoConfigBlock.prototype.setRandomDominoFaces = function()
{
    this.inputFace1Obj.val(Math.floor(Math.random() * (6 - 0 + 1)) + 0);
    this.inputFace2Obj.val(Math.floor(Math.random() * (6 - 0 + 1)) + 0);
    this.updateDomino();
};

/**
 * Update domino
 */
DominoConfigBlock.prototype.updateDomino = function()
{
    this.domino
            .setSize({
                type: this.inputSizeTypeObj.val(),
                width: this.inputSizeWidthObj.val(),
                height: this.inputSizeHeightObj.val(),
                ratioBodyWidth: this.inputratioBodyWidthObj.val()
            })
            .rotate(this.inputRotateObj.val())
            .setDominoFacePip(1, this.inputFace1Obj.val())
            .setDominoFacePip(2, this.inputFace2Obj.val())
            .position(
                this.inputPositionTopObj.val(),
                this.inputPositionLeftObj.val()
            )
    ;
};

/**
 * Set position values on config block
 * @param {Int} top
 * @param {Int} left
 */
DominoConfigBlock.prototype.setPositionValues = function(top, left)
{
    this.inputPositionTopObj.val(Math.floor(top));
    this.inputPositionLeftObj.val(Math.floor(left));
};

/**
 * Delete this block with domino
 */
DominoConfigBlock.prototype.deleteBlock = function()
{
    // Delete domino
    this.domino.delete();
    delete this.domino;
    
    // Delete block
    this.obj.remove();
    delete this;
};

/**
 * Hide content block
 */
DominoConfigBlock.prototype.hideContent = function()
{
    this.container.hide();
};

/**
 * Show content block
 * @param {Object} params
 */
DominoConfigBlock.prototype.showContent = function(params)
{
    params = params || {};
    
    // If hide other blocks content
    if (params.hideOther !== undefined && params.hideOther === true) {
        this.configBlockPanel.hideAllBlocksContent();
    }
    
    this.container.show();
};

/**
 * Toggle content block
 */
DominoConfigBlock.prototype.toggleContent = function()
{
    this.container.toggle();
};
