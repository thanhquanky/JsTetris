/*
Author: Thanh Ky Quan
Project: JSTetris
*/
// Location 

var Location = function (row, col) {
    this.row = Math.floor(row);
    this.col = Math.floor(col);    
}

// Direction constant
Location.direction = {
    west: 180,
    east: 0,
    south: 90,
    left: 90,
    right: -90
};

Location.signChart = [
    {row: -1, col: 1},
    {row: -1, col: -1},
    {row: 1, col: -1},
    {row: 1, col: 1}
];

// Return an adjacent location of the current location by specific direction
Location.prototype.getAdjacentLocation = function (direction) {
        return new Location(this.row + Math.sin(degToRad(direction)), this.col + Math.cos(degToRad(direction)));
};

// Check whether 2 locations are equal
Location.prototype.equals = function (newLocation) {
    var flag = this.row === newLocation.row && this.col === newLocation.col;
    return flag;
}

// Move location
Location.prototype.moveTo = function (direction) {
    var newRow = this.row + Math.sin(degToRad(direction)); 
    var newCol = this.col + Math.cos(degToRad(direction));
    return new Location(newRow, newCol);
}

// Get angle to other Location
Location.prototype.getDirectionTowards = function (otherLoc) {
    // select downward as positive 
    var dy = (-otherLoc.row) - this.row;
    var dx = otherLoc.col - this.col;
    var rad;
    if (dx == 0 && dy == 0)
        rad = 0;
    else
        rad = Math.atan2(dy, dx);
        
    return radToDeg(rad);
}


var Block = function () {

    // Declare variables
    this.positions = [];  // Position of block's pieces
    this.newPositions = []; // New positions
    this.blockTypes = ["B", "I", "T", "Z", "S", "J", "L", "O"]; // B-Block is just an empty block. This additional block will avoid using -1 as default value in weighted map
    this.blockColors = ["black", "blue", "coral", "BurlyWood", "Gold", "Teal", "PaleVioletRed", "green"]; // block color
    this.location = null;    // Location of a block on the board
    this.color = "";            // Color of the block
    this.blockTypeIndex = 0;      // Index of block type
    // End Declare variables
}

Block.prototype.create = function (type) {
    this.blockTypeIndex = typeof type !== null ? type : 1;
    this.color = this.blockColors[this.blockTypeIndex];
    this['create' + this.blockTypes[this.blockTypeIndex] + "Block"](this.color);
    //console.log(tempBlock);
};

// I-Block
Block.prototype.createIBlock = function (blockColor) {
    this.positions = [
        new Location(0, 0),
        new Location(0, 1),
        new Location(0, 2),
        new Location(0, 3) 
    ];
}

// T-Block
Block.prototype.createTBlock = function (blockColor) {
    this.positions = [
        new Location(0, 0),
        new Location(0, 1),
        new Location(1, 1),
        new Location(0, 2)
    ];
};

// Z-Block
Block.prototype.createZBlock = function (blockColor) {
    this.positions = [
        new Location(0, 0),
        new Location(0, 1),
        new Location(1, 1),
        new Location(1, 2)
    ];
};

// S-Block
Block.prototype.createSBlock = function (blockColor) {
    this.positions = [
        new Location(0, 0),
        new Location(1, 0),
        new Location(1, 1),
        new Location(2, 1)
    ];
};

// J-Block
Block.prototype.createJBlock = function (blockColor) {
    this.positions = [
        new Location(0, 0),
        new Location(1, 0),
        new Location(2, 0),
        new Location(2, -1)
    ];
};

// L-Block
Block.prototype.createLBlock = function (blockColor) {
    this.positions = [
        new Location(0, 0),
        new Location(1, 0),
        new Location(2, 0),
        new Location(2, 1)
    ];
};

// O-Block
Block.prototype.createOBlock = function (blockColor) {
    this.positions = [
        new Location(0, 0),
        new Location(0, 1),
        new Location(1, 0),
        new Location(1, 1)
    ];
};    

    
// get block's type
Block.prototype.getBlockType = function (index) {
    return this.blockTypes[index];
}

// get block's type index
Block.prototype.getBlockTypeIndex = function() {
    return this.blockTypeIndex;
}

Block.prototype.getBlockColor = function (index) {
    return this.blockColors[index];
}

Block.prototype.hasLocation = function(newLocation) {
    var flag = false;
    for (var i=0; i<4 && !flag; i++) {
        var tempRow = this.positions[i].row + this.location.row;
        var tempCol = this.positions[i].col + this.location.col;
        flag = newLocation.equals(new Location(tempRow, tempCol));
    }
    return flag;
}

// Board object
var Board = function (rows, cols) {

    //Declare variables

    this.maxRows = rows;    // Total rows of the tetris board
    this.maxCols = cols;    // Total cols of the tetris board
    this.changedCells = []; // Cells that are changed by moving, rotating 
    this.filledLines = [];  // Lines that are filled
    // Check map of the board for verifying an existence of any block
    this.map = new Array(this.maxRows + 2);

    // Go to each row and create cols-element array
    for (var i = 0; i <= this.maxRows + 1; i++) {
        /* 2 extra cols (col 0 and last col) are used as border
        fill is an extension of Array prototype 
        */
        this.map[i] = new Array(this.maxCols + 2).fill(0);
    }

    //End Declare variables
}

// Get value of a cell on the map
Board.prototype.getCellValue = function (location) {
    return this.map[location.row][location.col];
}

// Set value for a cell on the map
Board.prototype.setCellValue = function (location, value) {
    //console.log("(" + location.row + ", " + location.col + ") = " + value);
    this.map[location.row][location.col] = value;
}

// Get changed cells list
Board.prototype.getChangedCells = function () {
    return this.changedCells;
}

// Set changed cells list
Board.prototype.setChangedCells = function (newList) {
    this.changedCells = newList;
}

// Add block into board
Board.prototype.add = function (block, location) {
    block.location = location;
    for (var i = 0; i < 4; i++) {
        var currentCellRow =  location.row + block.positions[i].row;
        var currentCellCol = location.col + block.positions[i].col;
        var currentCellLocation = new Location(currentCellRow, currentCellCol);
        this.setCellValue(currentCellLocation, block.blockTypeIndex);
        this.changedCells.push(currentCellLocation);
    }
    console.log('Done');
};

Board.prototype.isValidLocation = function (newLocation) {
    var flag =  newLocation.row >= 0 && newLocation.row <= this.maxRows && newLocation.col >=1 && newLocation.col <= this.maxCols;
    if (flag === false) {
        console.log('cannot keep moving');
    }
    return flag;
}

// Check whether a block can move in certain direction
Board.prototype.canMove = function (block, direction) {
    var flag = true;
    // absolute location with respect to the board
    var loc = block.location;
    for (var i = 0; i < 4 && flag === true; i++) {
        var newRow = loc.row + block.positions[i].row + Math.floor(Math.sin(degToRad(direction)));
        var newCol = loc.col + block.positions[i].col + Math.floor(Math.cos(degToRad(direction)));
        // adject with relative position with respect to absolute location and moving direction
        var newLocation = new Location(newRow, newCol);
        flag = this.isValidLocation(newLocation);
        if (flag && !block.hasLocation(newLocation))
            flag = this.map[newLocation.row][newLocation.col] === 0;
        if (flag)
            block.newPositions.push(newLocation);
        else
            block.newPositions = []; // reset
            
    }
    return flag;
}

// Move a block 
Board.prototype.move = function (block, direction) {
    var loc = block.location;
    var blockTypeIndex = block.blockTypeIndex;
    for (var i=0; i<4; i++) {
        var oldCellLocation = new Location(loc.row + block.positions[i].row, loc.col + block.positions[i].col);
        this.setCellValue(oldCellLocation, 0);
        this.changedCells.push(oldCellLocation);
    }

    for (var i=0; i<4; i++) {
        //var newCellLocation = new Location(loc.row + block.positions[i].row + Math.sin(degToRad(direction)), loc.col + block.positions[i].col + Math.cos(degToRad(direction)));
        var newCellLocation = block.newPositions[i];
        this.setCellValue(newCellLocation, blockTypeIndex);
        this.changedCells.push(newCellLocation);
    }

    // update new location
    block.location = loc.moveTo(direction);

    // reset new positions list
    block.newPositions = [];
}

// check whether a block can turn
Board.prototype.canTurn = function (block, turnDirection) {
    var loc = block.location;
    var pivot = block.positions[0];
    var flag = true;
    // first block is always the pivot point
    for (var i=0; i<4 && flag === true; i++) {
        //var currentCellLocation = new Location(loc.row + block.positions[i].row, loc.col + block.positions[i].col);
        var currentDirection = pivot.getDirectionTowards(block.positions[i]);
        var newDirection = currentDirection + turnDirection;
        
        // find quarant to determine the sign of relative row and col
        var quarant = getQuarant(newDirection);

        // new row is old col with sign depends on the new quarant
        var newRow = Math.abs(block.positions[i].col) * Location.signChart[quarant].row;
        // new col is old row with sign depends on the new quarant
        var newCol = Math.abs(block.positions[i].row) * Location.signChart[quarant].col;

        var newRelativeLocation = new Location(newRow, newCol);
        var newLocation = new Location(loc.row + newRow, loc.col + newCol);
        flag = this.isValidLocation(newLocation);
        if (flag && !block.hasLocation(newLocation))
            flag = this.map[newLocation.row][newLocation.col] === 0;

        // if location is valid and available, it's ok!
        if (flag) 
            block.newPositions.push(newRelativeLocation);
        else
            block.newPositions = []; // reset
    }
    return flag;
}

// turn a block
Board.prototype.turn = function (block, turnDirection) {
    var loc = block.location;
    var blockTypeIndex = block.blockTypeIndex;
    for (var i=0; i<4; i++) {
        var oldCellLocation = new Location(loc.row + block.positions[i].row, loc.col + block.positions[i].col);
        this.setCellValue(oldCellLocation, 0);
        this.changedCells.push(oldCellLocation);
    }

    for (var i=0; i<4; i++) {
        var newCellLocation = new Location(block.newPositions[i].row + loc.row, block.newPositions[i].col + loc.col);
        this.setCellValue(newCellLocation, blockTypeIndex);
        this.changedCells.push(newCellLocation);
    }

    // update positions
    block.positions = block.newPositions;

    // reset new positions list
    block.newPositions = [];
}

Board.prototype.scanFilledLines = function() {
    for (var i = 1; i <= this.maxRows; i++) {
        var count = 0;
        for (var j = 1; j <= this.maxCols; j++) {
            if (this.getCellValue(new Location(i,j)) > 0)
                count++;
        }
        if (count == this.maxCols) {
            this.filledLines.push(i);
            console.log("Line " + i + " is filled!");
        }
    }
    return this.filledLines;
}

Board.prototype.moveEverythingDownFromLine = function (line) {
    for (var i = line; i > 0; i--) 
        this.map[i] = this.map[i-1];
    this.map[0].fill(0);
    this.map[1].fill(0);
}

// Detect game over
Board.prototype.canAdd = function (block, location) {
    var flag = true;
    this.map[0].fill(0);
    this.map[1].fill(0);
    console.log("Adding Block " + block.getBlockType(block.blockTypeIndex));
    for (var i=0; i<4 && flag; i++) {
        var currentCellLocation = new Location(block.positions[i].row + location.row, block.positions[i].col + location.col);
        flag = this.getCellValue(currentCellLocation) === 0;
        if (flag === false) {
            console.log("Current cell location: (" + currentCellLocation.row + ", " + currentCellLocation.col + "): " + this.getCellValue(currentCellLocation));
            console.log("Map value is: " + this.map[currentCellLocation.row][currentCellLocation.col]);
        }
    }
    this.printMap(); // debugging purpose
    return flag;
}

// Print map
Board.prototype.printMap = function () {
    for (var i = 0; i <= this.maxRows + 1; i++) {
        console.log(this.map[i]);
    }
}

var Tetris = function () {
    this.board = new Board(15, 10);;
    this.currentBlock = null;
    this.startingLocation = new Location(1, 5);
    this.score = 0;
}

Tetris.prototype.getCurrentBlock = function () {
    return this.currentBlock;
}

Tetris.prototype.setCurrentBlock = function (block) {
    this.currentBlock = block;
}

Tetris.prototype.generateNewBlock = function () {
    // Generate random number from 1 to 7
    var blockTypeIndex = Math.ceil(Math.random() * 7);
    //var blockTypeIndex = 3;
    var currentBlock = new Block();
    currentBlock.create(blockTypeIndex);
    
    var board = this.board;
    
    if (board.canAdd(currentBlock, this.startingLocation)) {
        board.add(currentBlock, this.startingLocation);
        this.currentBlock = currentBlock;
    }
    else {
        this.gameOver();
    }
};


Tetris.prototype.moveBlock = function (direction) {
    var board = this.board;
    var currentBlock = this.getCurrentBlock();
    var flag = board.canMove(currentBlock, direction);
    if (flag) {
        board.move(currentBlock, direction);
        this.setCurrentBlock(currentBlock);
        this.redraw(board);
    }
    else 
        board.newPositions = []; // Clear changedCells
    return flag;
}

Tetris.prototype.fallingBlock = function () {
    var flag = this.moveBlock(Location.direction['south']);
    if (!flag) {
        this.scanFilledLine();
        this.generateNewBlock();
        this.redraw();
    }
};

Tetris.prototype.turnBlock = function (direction) {
    var board = this.board;
    var currentBlock = this.currentBlock;
    if (board.canTurn(currentBlock, direction)) {
        board.turn(currentBlock, direction);
        this.setCurrentBlock(currentBlock);
        this.redraw(board);
    }
    else 
        board.changedCells = [];
}

Tetris.prototype.redraw = function () {
    var board = this.board;
    var changedCells = board.changedCells;
    for (var i = 0; i < changedCells.length; i++) {
        var loc = changedCells[i];
        if (i<4)
            $('#box' + loc.row + loc.col).attr("class", "box block0");
        else {
            var cellValue = board.getCellValue(loc);
            $('#box' + loc.row + loc.col).attr("class", "box block" + cellValue);
        }
    }
    board.changedCells = [];
}

Tetris.prototype.draw = function () {
    var board = this.board;

    // Clear everything
    $('#gamePanel').html("");

    for (var i = 1; i <= board.maxRows; i++) {
        for (var j = 1; j <= board.maxCols; j++) {
            $("<div></div>").attr("id", "box" + i + j).addClass("box " + "block"+board.getCellValue(new Location(i,j))).appendTo("#gamePanel");
        }
    }
}

Tetris.prototype.scanFilledLine = function () {
    var lineCount = 0;
    var board = this.board;
    var filledLines = board.scanFilledLines();
    var size = filledLines.length;
    // Update score
    if (size > 0) {
        var newScore = this.score + size;
        
        this.updateScore(newScore);
        while (size > 0) {
            var currentLine = filledLines[--size] + lineCount;
            board.moveEverythingDownFromLine(currentLine);
            lineCount++;
        }
        
        board.filledLines = [];
        this.draw();
    }
}

Tetris.prototype.updateScore = function (newScore) {
    this.score = newScore;
    $("#score").text(newScore);
}

// OMG, finally
Tetris.prototype.gameOver = function() {
    $("#gamePanel").hide();
    $("#gameoverPanel").show();
    clearInterval(window.intervalCode);
}

Tetris.prototype.start = function () {
    this.generateNewBlock();
    this.draw(this.board);
};