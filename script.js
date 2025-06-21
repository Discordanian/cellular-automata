// "Globals"

var config = {
    failsafe: 120,
    debug: false,
    cellsize: 10,
    fr: 30,
    rule: {}, // The rule we are applying for each iteration.
    ruleArray: [],
    row1: {}, // The initial first row.
    onRow: 1, // The row we are on for this iteration.
    run: true
};

function setup() {
    var my_width = windowWidth;
    var my_height = windowHeight;

    var canvas = createCanvas(my_width, my_height);
    canvas.parent("canvas");
    config.rule = document.getElementById("menu1");
    config.row1 = document.getElementById("row1");

    // Get 'width' in cell size
    config.col_count = floor(my_width / config.cellsize) + 2; // We'll go 'one' off of each end.
    config.row_count = floor(my_height / config.cellsize) + 1; // We'll go one below the floor.

    initialize();
    config.rule.addEventListener("change", initialize);
    config.row1.addEventListener("change", initialize);
    frameRate(config.fr);
}

function draw() {
    // background(0);
    iterate();
    displayMatrix();

    if (config.debug && config.failsafe-- < 0) {
        noLoop();
        console.log("Failsafe hit");
    }

    config.onRow++;
    if (config.onRow > config.matrix.length - 1) {
        console.log("Time to clear and start again");
        initialize();
    }
}

// Setup Matrix and Rule and reset onRow
function initialize() {
    if (config.debug) {
        console.log("Initializing");
    }
    initMatrix(); // Clear matrix and set first row
    initRule(); // Set ruleArray based on selected rule #
    config.onRow = 1; // Reset the row we are on for iterating
}

// Sets the rule array
// Note that the array is 'backward' from the rule in binary
// This is because the bitPosition will align with the
// index in the rule array.  So 3 'blanks'/0s results in index 0
function initRule() {
    config.ruleArray = [];
    var n = config.rule.value;
    for (var i = 0; i < 8; i++) {
        config.ruleArray.push(n % 2);
        n = floor(n / 2); //shift
    } // We need an array of length 8
}

// Initialize Matrix.
// Set first row according to dropdown.
function initMatrix() {
    if (config.debug) {
        console.log("iniMatrix()");
    }
    config.matrix = []; // whack current matrix
    for (var i = 0; i < config.row_count; i++) {
        config.matrix.push([]);
        for (var j = 0; j < config.col_count; j++) {
            config.matrix[i].push(0);
        }
    }
    console.log(config.row1.value);

    var middle_cell = floor(config.col_count / 2);
    if (config.row1.value % 2) {
        // odd, so last cell is set
        config.matrix[0][middle_cell + 1] = 1;
    }
    if (
        config.row1.value == 2 ||
        config.row1.value == 3 ||
        config.row1.value == 6 ||
        config.row1.value == 7
    ) {
        // middle is set
        config.matrix[0][middle_cell] = 1;
    }
    if (config.row1.value > 3) {
        // first cell set
        config.matrix[0][middle_cell - 1] = 1;
    }
} // initMatrix

// Display empty or full square
function displayMatrix() {
    for (var i = 0; i < config.row_count; i++) {
        for (var j = 0; j < config.col_count; j++) {
            var x = j * config.cellsize - config.cellsize / 2;
            var y = i * config.cellsize;
            stroke(0);
            if (config.matrix[i][j]) {
                fill(0);
            } else {
                fill(255);
            }
            rect(x, y, config.cellsize, config.cellsize);
        } // var j
    } // var i
} // displayMatrix

// Given a cell, what is the bitPosition from the 3 cells above
function bitPosition(my_row, my_col) {
    var row = my_row - 1; // The row above
    var retval = config.matrix[row][my_col - 1] * 4;
    retval += config.matrix[row][my_col] * 2;
    retval += config.matrix[row][my_col + 1];
    return retval;
}

// Work on config.onRow and set values
function iterate() {
    var row = config.onRow;
    for (var col = 1; col < config.col_count - 1; col++) {
        config.matrix[row][col] = config.ruleArray[bitPosition(row, col)];
    }
}
