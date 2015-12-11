
/**
 * Class Domino
 * @param {object} params
 * @returns {Domino}
 */
var Domino = function(params)
{
    params = params || {};
    
    this.draggedObject = null;
    
    this.configBlock = params.configBlock || null;
    
    // Elements classes
    this.dominoClass = params.dominoElementClass || 'domino';
    this.dominoFaceClass = 'domino-face';
    
    // Faces
    this.faceDots = [];
    params.dots = params.dots || {};
    this.faceDots[1] = params.dots.face1 || 0;
    this.faceDots[2] = params.dots.face2 || 0;
    
    // Domino position & rotation
    params.position = params.position || {};
    this.dominoTop = params.position.top || 0;
    this.dominoLeft = params.position.left || 0;
    this.dominoRotate = params.rotate || 0;
    
    // Domino size
    this.sizeParams = params.size || {};
    
    // jQuery object of elements
    this.dominoObj = null;
    this.dominoFacesObj = [];
    
    // Pips types with positions
    this.pips = [];
    this.pips[0] = [];
    this.pips[1] = [[2, 2]];
    this.pips[2] = [[1, 3], [3, 1]];
    this.pips[3] = [[1, 3], [2, 2], [3, 1]];
    this.pips[4] = [[1, 1], [1, 3], [3, 1], [3, 3]];
    this.pips[5] = [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]];
    this.pips[6] = [[1, 1], [1, 3], [2, 1], [2, 3], [3, 1], [3, 3]];
};

/**
 * Sets domino size info
 * @param {object} sizeParams
 * @returns {Domino.prototype}
 */
Domino.prototype.setSize = function(sizeParams)
{
    sizeParams = sizeParams || {};
    
    if (sizeParams.type === undefined 
        || (sizeParams.type !== 'static' && sizeParams.type !== 'bodyRatio')
        || isNaN(parseInt(sizeParams.width)) || isNaN(parseInt(sizeParams.height))
        || (sizeParams.type === 'bodyRatio' && isNaN(parseInt(sizeParams.ratioBodyWidth)))
    ) {
        sizeParams.type = 'static';
        sizeParams.width = 50;
        sizeParams.height = 100;
    }
    this.dominoSizeCalcType = sizeParams.type;
    this.dominoSizeWidth = sizeParams.width;
    this.dominoSizeHeight = sizeParams.height;
    this.dominoSizeRatioBodyWidth = sizeParams.ratioBodyWidth || 500;

    // Updates size of domino
    this.updateDominoSize();
    
    // If sets domino dynamic size
    if (this.dominoSizeCalcType === 'bodyRatio') {
        var self = this;
        $(window).resize(function()
        {
            self.updateDominoSize();
        });
    }
    
    return this;
};

/**
 * Initialization of domino
 */
Domino.prototype.init = function()
{
    // Domino generation
    this.genDomino();

    // Sets dmino size info
    this.setSize(this.sizeParams);
    
    // Set pips types
    this.setDominoFacePip(1, this.faceDots[1]);
    this.setDominoFacePip(2, this.faceDots[2]);
    
    // Set domino position and rotation
    this.rotate(this.dominoRotate);
    this.position(this.dominoTop, this.dominoLeft);
};

/**
 * Set draggedObject element object for current domino
 */
Domino.prototype.setdraggedObject = function()
{
    var self = this;
    this.mover = new DraggedObject({
        'element': this.dominoObj,
        'onDragStart': function() { self.onDominoDragStart(); },
        'onDrag': function() { self.onDominoDrag(); },
        'onDragStop': function() { self.onDominoDragStop(); }
    });
    this.mover.init();
};

/**
 * When domino start draging
 */
Domino.prototype.onDominoDragStart = function()
{
    this.raise();
    this.configBlock.showContent({'hideOther': true});
};

/**
 * When domino stop draging
 */
Domino.prototype.onDominoDragStop = function()
{
    this.unraiseOther();
};

/**
 * When domino draging
 */
Domino.prototype.onDominoDrag = function()
{
    this.configBlock.setPositionValues(this.mover.getPositionY(), this.mover.getPositionX());
    this.position(this.mover.getPositionY(), this.mover.getPositionX());
};

/**
 * Generation of domino
 */
Domino.prototype.genDomino = function()
{
    this.dominoObj = $("<div/>", {
        class: this.dominoClass,
        'rel-type': 'domino'
    }).appendTo("body");

    // Faces generate and insert
    this.dominoObj.append(this.genDominoFace(1));
    this.dominoObj.append(this.genDominoFace(2));
    
    // Set draggedObject
    this.setdraggedObject();
    
    // Set new domino above of all
    this.unraiseOther();
};

/**
 * Generation of domino face
 * @param {Int} faceNumber
 */
Domino.prototype.genDominoFace = function(faceNumber)
{
    this.dominoFacesObj[faceNumber] = $("<div/>", {
        class: this.dominoFaceClass
    }).appendTo(this.dominoObj)
      .append(this.genDominoFaceField());
};

/**
 * Generation of domino face field
 * @returns {jQuery}
 */
Domino.prototype.genDominoFaceField = function()
{
    var fieldWrapper = $("<div/>", {
        class: 'field-wrapper'
    });
    
    var field = $("<div/>", {
        class: 'field'
    }).appendTo(fieldWrapper);
    
    for (var rowNum = 1; rowNum <= 3; rowNum++) {
        var row = $("<div/>", {
            class: 'field-row'
        }).appendTo(field);
        
        for (var columnNum = 1; columnNum <= 3; columnNum++) {
            $("<div/>", {
                class: 'field-cell'
            }).appendTo(row);
        }
    }
    
    return fieldWrapper;
};

/**
 * Removes all face dots
 * @param {int} face
 */
Domino.prototype.removeFaceDots = function(face)
{
    $('.face-dot', this.dominoFacesObj[face]).remove();
};

/**
 * Generation of domino face field
 * @param {int} face
 * @param {int} pip
 * @returns {Domino.prototype}
 */
Domino.prototype.setDominoFacePip = function(face, pip)
{
    if (this.pips[pip] === undefined || this.dominoFacesObj[face] === undefined) {
        return null;
    }
    
    this.removeFaceDots(face);
    
    for (var dot in this.pips[pip]) {
        if (this.pips[pip][dot][0] !== undefined 
            && this.pips[pip][dot][1] !== undefined
        ) {
            var dotCell = this.getDominoFaceFrame(
                face, 
                this.pips[pip][dot][0], 
                this.pips[pip][dot][1]
            );
            if (dotCell === null) {
                continue;
            }

            $("<div/>", {
                class: 'face-dot'
            }).appendTo(dotCell);
        }
    }
    
    // Updating of dotted sizes
    this.updateDotsSize();
    
    return this;
};

/**
 * Put domino in new position
 * @param {int} top
 * @param {int} left
 * @returns {Domino.prototype}
 */
Domino.prototype.position = function(top, left)
{
    this.dominoObj.offset({ 
        top: top, 
        left: left 
    });
    
    this.dominoTop = top;
    this.dominoLeft = left;

    return this;
};

/**
 * Domino rotation
 * @param {int} angle
 * @returns {Domino.prototype}
 */
Domino.prototype.rotate = function(angle)
{
    this.dominoObj
        .css('-ms-transform', 'rotate(' + angle + 'deg)')
        .css('-webkit-transform', 'rotate(' + angle + 'deg)')
        .css('transform', 'rotate(' + angle + 'deg)');
    return this;
};

/**
 * Updating pip dotteds sizes by faces size
 */
Domino.prototype.updateDotsSize = function()
{
    var faceHeight = this.dominoFacesObj[1].height(),
        faceWidth = this.dominoFacesObj[1].width(),
        faceSide = (faceHeight < faceWidth ? faceHeight : faceWidth);

    this.setDotsSize(parseInt(faceSide * 25 / 100));
};

/**
 * Updating pip dottes sizes
 * @param {Integer} size
 */
Domino.prototype.setDotsSize = function(size)
{
    $('.face-dot', this.dominoObj)
        .css('width', size)
        .css('height', size);
};

/**
 * Returns domino face frame cell jQuery object or NULL if not exist
 * @param {Integer} face
 * @param {Integer} row
 * @param {Integer} cell
 * @returns {jQuery}|NULL
 */
Domino.prototype.getDominoFaceFrame = function(face, row, cell)
{
    if (this.dominoFacesObj[face] === undefined) {
        return null;
    }
    
    var rowObject = $('.field-row', this.dominoFacesObj[face]).get(row - 1);
    if (rowObject === undefined) {
        return null;
    }
    
    var cellObject = $('.field-cell', rowObject).get(cell - 1);
    if (cellObject === undefined) {
        return null;
    }
    
    return $(cellObject);
};

/**
 * Update domino size
 */
Domino.prototype.updateDominoSize = function()
{
    // Sets all dottes to 1px size
    this.setDotsSize(1);
    // Sets domino size
    this.dominoObj.css(this.calcDominoSize());
    // Update dottes by domino size
    this.updateDotsSize();
};

/**
 * Returns domino size
 * @returns {object}
 */
Domino.prototype.calcDominoSize = function()
{
    var dominoWidth = 0,
        dominoHeight = 0;

    // Calculate domino size        
    if (this.dominoSizeCalcType === 'static') {
        // If domino have static size
        dominoWidth = this.dominoSizeWidth;
        dominoHeight = this.dominoSizeHeight;
    } else if (this.dominoSizeCalcType === 'bodyRatio' && this.dominoSizeRatioBodyWidth > 0) {
        // If domino have ratio size
        dominoWidth = $(window).width() * this.dominoSizeWidth / this.dominoSizeRatioBodyWidth;
        dominoHeight = dominoWidth * this.dominoSizeHeight / this.dominoSizeWidth;
    }

    return {
        width: dominoWidth,
        height: dominoHeight
    };
};

/**
 * Delete this domino
 */
Domino.prototype.delete = function()
{
    this.dominoObj.remove();
};

/**
 * Raise this domino
 */
Domino.prototype.raise = function()
{
    // Set all dominos not raised
    this.unraiseAll();
    
    // Set current domino raised
    this.dominoObj
            .css('z-index', 1000)
            .css('box-shadow', '0 0 20px rgba(0, 0, 0, 0.5)');
};

/**
 * Unraise other dominos
 */
Domino.prototype.unraiseOther = function()
{
    // Set all dominos not raised
    this.unraiseAll();
    
    // Up current domino
    this.dominoObj.css('z-index', 200);
};

/**
 * Unraise all dominos
 */
Domino.prototype.unraiseAll = function()
{
    // Set all dominos not raised
    $('div[rel-type=domino]')
            .css('z-index', 100)
            .css('box-shadow', 'none');
};