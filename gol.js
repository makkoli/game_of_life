"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var GameOfLife = function() {
    // Initialize a random board object via user input of width, height, and size of cells

    function GameOfLife(width, height, size) {
        _classCallCheck(this, GameOfLife);

        this.width = width / size; // width of board
        this.height = height / size; // height of board
        this.size = size; // size of each square on the board n x n
        this.board = []; // Board with cells
        this.generation = 1; // Current generation of cells

        // Initialize the board
        var counter = 0;
        for (var i = 0; i < this.height; i++) {
            this.board.push([]);
            for (var j = 0; j < this.width; j++) {
                // Initialize the board with half the cells in use
                // and the other half not in use
                if (Math.random() < 0.5) {
                    this.board[counter].push(0);
                } else {
                    this.board[counter].push(1);
                }
            }
            counter++;
        }
    }

    // Produces the next generation of cells

    GameOfLife.prototype.getNextGeneration = function getNextGeneration() {
        var nextBoard = [];
        var neighbors = 0;
        for (var i = 0; i < this.height; i++) {
            nextBoard.push([]);
            for (var j = 0; j < this.width; j++) {
                neighbors = this.getNeighbors(j, i);
                // Kill cell via overpopulation
                if (neighbors > 3) {
                    nextBoard[i].push(0// Kill cell via underpopulation
                    );
                } else if (neighbors < 2) {
                    nextBoard[i].push(0// Create cell if exactly 3 neighbors and cell is dead
                    );
                } else if (neighbors == 3 && this.board[i][j] == 0) {
                    nextBoard[i].push(1)// Cell lives on to next generation if between 2 and 3 neighbors
                    // and ages to an older state;
                } else if (neighbors == 2 && this.board[i][j] != 0 || neighbors == 3 && this.board[i][j] != 0) {
                    nextBoard[i].push(2// Else, push the state from previous board to new board
                    );
                } else {
                    nextBoard[i].push(this.board[i][j]);
                }
            }
        }
        this.board = nextBoard;
        this.generation++;
    };

    // Gets the number of neighbors a cell has
    // @x: x location of cell
    // @y: y location of cell

    GameOfLife.prototype.getNeighbors = function getNeighbors(x, y) {
        var xRight = (x + 1) % this.width;
        var xLeft = (x - 1 + this.width) % this.width;
        var yBelow = (y + 1) % this.height;
        var yAbove = (y - 1 + this.height) % this.height;
        var count = 0;

        // Check cell directly above
        if (this.board[yAbove][x] != 0) {
            count++;
        }
        // Check cell above and to left
        if (this.board[yAbove][xLeft] != 0) {
            count++;
        }
        // Check cell above and to right
        if (this.board[yAbove][xRight] != 0) {
            count++;
        }
        // Check cell to the left
        if (this.board[y][xLeft] != 0) {
            count++;
        }
        // Check cell to the right
        if (this.board[y][xRight] != 0) {
            count++;
        }
        // Check cell directly below
        if (this.board[yBelow][x] != 0) {
            count++;
        }
        // Check cell below and to left
        if (this.board[yBelow][xLeft] != 0) {
            count++;
        }
        // Check cell below and to right
        if (this.board[yBelow][xRight] != 0) {
            count++;
        }

        return count;
    };

    // Returns the board in string format

    GameOfLife.prototype.toString = function toString() {
        var result = "";
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                result = result + this.board[i][j];
            }
            result = result + '\n';
        }
        return result;
    };

    // Clears the board to an empty state

    GameOfLife.prototype.clear = function clear() {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                // Clear all the cells to empty state
                this.board[i][j] = 0;
            }
        }
        this.generation = 1;
    };

    // Gets the cell at a point on the board
    // @x: x location of cell
    // @y: y location of cell

    GameOfLife.prototype.getCell = function getCell(x, y) {
        return this.board[y][x];
    };

    // Sets a cell at a point on the board
    // @x: x location of cell
    // @y: y location of cell

    GameOfLife.prototype.setCell = function setCell(x, y) {
        this.board[y][x] = 1;
    };

    // Gets the current generation of cells

    GameOfLife.prototype.getGeneration = function getGeneration() {
        return this.generation;
    };

    // Get the width of the grid in number of cells

    GameOfLife.prototype.getWidth = function getWidth() {
        return this.width;
    };

    // Get the height of the grid in number of cells

    GameOfLife.prototype.getHeight = function getHeight() {
        return this.height;
    };

    // Gets the size of each cell (n x n)

    GameOfLife.prototype.getSize = function getSize() {
        return this.size;
    };

    return GameOfLife;
}();

// Start rendering once page loads
$(document).ready(function() {
    var board = new GameOfLife(600, 350, 10);
    drawBoard(board);
    $("#generation").text(board.getGeneration());
    $("#start").prop("disabled", true);
    running(board);

    // Start animation if user has stopped it
    $("#start").on('click', function() {
        $(this).prop("disabled", true);
        running(board);
    });

    // Add a live cell by user click
    $(".cell").on('click', function(event) {
        board.setCell($(this).attr("data-x"), $(this).attr("data-y"));
        drawBoard(board);
    });
});

// Animation is running
// @board: board object used for animation
function running(board) {
    // Board renders
    var boardInterval = setInterval(function() {
        // Keep running until user hits stop
        board.getNextGeneration();
        drawBoard(board);
        $("#generation").text(board.getGeneration());
    }, 300);

    // Stop animation when user clicks
    $("#stop").on('click', function() {
        clearInterval(boardInterval);
        $("#start").prop("disabled", false);
    });

    // Clears (and stops) board
    $("#clear").on('click', function() {
        clearInterval(boardInterval);
        board.clear();
        drawBoard(board);
        $("#generation").text(board.getGeneration());
        $("#start").prop("disabled", false);
    });
}

// Draw the board
// @board: board object to draw
function drawBoard(board) {
    ReactDOM.render(React.createElement(Board, {board: board}), document.getElementById("board"));
}

// Holds the game board and updates it
var Board = React.createClass({
    displayName: "Board",

    // Generate the cell list for the display
    generateCellList: function generateCellList(cellList) {
        for (var i = 0; i < this.props.board.getHeight(); i++) {
            for (var j = 0; j < this.props.board.getWidth(); j++) {
                // Determine the status color for the cell
                // and add the x and y location of each cell
                if (this.props.board.getCell(j, i) == 0) {
                    cellList.push(React.createElement(Cell, {
                        status: "inactive",
                        y: i,
                        x: j
                    }));
                } else if (this.props.board.getCell(j, i) == 1) {
                    cellList.push(React.createElement(Cell, {
                        status: "young",
                        y: i,
                        x: j
                    }));
                } else {
                    cellList.push(React.createElement(Cell, {
                        status: "old",
                        y: i,
                        x: j
                    }));
                }
            }
        }
    },

    // Renders the cells onto the board
    render: function render() {
        var cellList = [];
        this.generateCellList(cellList);

        return React.createElement("div", {
            className: "board"
        }, cellList.map(function(curr) {
            return curr;
        }));
    }
});

// The individual cell components
var Cell = React.createClass({
    displayName: "Cell",

    render: function render() {
        return React.createElement("div", {
            className: "cell cell-" + this.props.status,
            "data-y": this.props.y,
            "data-x": this.props.x
        });
    }
});
