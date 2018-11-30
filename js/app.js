document.addEventListener("DOMContentLoaded", function (event){

    function GameOfLife (boardWidth, boardHeight) {
        this.width = boardWidth;
        this.height = boardHeight;
        this.board = document.querySelector(".board");
        this.cells = []; //empty array for all cells

        //Creating a board

        this.createBoard = function() {
            this.board.style.height = (this.height * 10) +"px"; // 10 - height of one div
            this.board.style.width = this.width * 10 + "px"; //10 - width of one div
            this.boardElements = this.height * this.width; // number of all cells
            for (var i=0; i<this.boardElements; i++) {
                var cell = document.createElement("div");
                this.board.appendChild(cell);
            }
            this.cells = this.board.children;

            //Adding an event for all cells
            for (var j=0; j<this.cells.length; j++) {
                this.cells[j].addEventListener("click", function (e) {
                    this.classList.toggle("live");
                });
            }

        };

        //Counting cell index
        this.countIndex = function (x,y) {
            return x + (y*this.width);
        };

        //Setting state for cells
        this.setCellState = function (x, y, state) {
            if (state==="live") {
                this.cells[this.countIndex(x, y)].classList.add("live");
            }
            else {
                this.cells[this.countIndex(x, y)].classList.remove("live");
            }
        };

        //Creating a glider with random position
        this.addGlider = function () {
            var randomNumber = Math.floor(Math.random()*this.height-3)+3;
            this.setCellState(randomNumber+1, randomNumber, "live");
            this.setCellState(randomNumber+2, randomNumber+1, "live");
            this.setCellState(randomNumber, randomNumber+2, "live");
            this.setCellState(randomNumber+1, randomNumber+2, "live");
            this.setCellState(randomNumber+2, randomNumber+2, "live");

        };

        //Setting next state of cell by computing states of its neighbours
        this.computeCellNextState = function (x,y) {
            var alive = 0;
            var neighbours = [];
            if (x===0 && y!==0 && y!==this.height-1)  {
                neighbours = [this.cells[this.countIndex(x, y-1)], this.cells[this.countIndex(x+1, y-1)], this.cells[this.countIndex(x+1, y)], this.cells[this.countIndex(x, y+1)], this.cells[this.countIndex(x+1, y+1)]];
            }
            else if (y===0 && x!==0 && x!==this.width-1) {
                neighbours = [this.cells[this.countIndex(x+1, y)],this.cells[this.countIndex(x-1, y)], this.cells[this.countIndex(x-1, y+1)], this.cells[this.countIndex(x, y+1)], this.cells[this.countIndex(x+1, y+1)]];
            }
            else if (y===0 && x===0) {
                neighbours = [this.cells[this.countIndex(x+1, y)], this.cells[this.countIndex(x, y+1)], this.cells[this.countIndex(x+1, y+1)]];
            }
            else if (x===this.width-1 && y!==this.height-1 && y!==0) {
                neighbours = [this.cells[this.countIndex(x-1, y-1)], this.cells[this.countIndex(x, y-1)], this.cells[this.countIndex(x-1, y)], this.cells[this.countIndex(x-1, y+1)], this.cells[this.countIndex(x, y+1)]];
            }
            else if (y===this.height-1 && x!==this.width-1 && x!==0) {
                neighbours = [this.cells[this.countIndex(x-1, y-1)], this.cells[this.countIndex(x, y-1)], this.cells[this.countIndex(x+1, y-1)], this.cells[this.countIndex(x-1, y)], this.cells[this.countIndex(x+1, y)]];
            }
            else if (x===this.width-1 && y===this.height-1) {
                neighbours = [this.cells[this.countIndex(x-1, y-1)], this.cells[this.countIndex(x, y-1)], this.cells[this.countIndex(x-1, y)]];
            }
            else if(x===0 && y===this.height-1) {
                neighbours = [this.cells[this.countIndex(x, y-1)], this.cells[this.countIndex(x+1, y-1)], this.cells[this.countIndex(x+1, y)]];
            }
            else if (y===0 && x===this.width-1) {
                neighbours = [this.cells[this.countIndex(x-1, y)], this.cells[this.countIndex(x-1, y+1)], this.cells[this.countIndex(x, y+1)]];
            }
            else if(x!==0 && y!==0 && x!==this.width-1 && y!==this.height-1) {
                neighbours = [this.cells[this.countIndex(x - 1, y - 1)], this.cells [this.countIndex(x, y - 1)], this.cells[this.countIndex(x + 1, y - 1)], this.cells[this.countIndex(x - 1, y)], this.cells[this.countIndex(x + 1, y)], this.cells[this.countIndex(x - 1, y + 1)], this.cells[this.countIndex(x, y + 1)], this.cells[this.countIndex(x + 1, y + 1)]];
            }


            //Counting number of alive neighbours
            for (var i=0; i<neighbours.length; i++) {
                if(neighbours[i].classList.contains("live")) {
                    alive++;
                }
            }

            if (!this.cells[this.countIndex(x,y)].classList.contains("live") && alive===3) {
                return 1;
            }
            else if (this.cells[this.countIndex(x,y)].classList.contains("live") && (alive===2 || alive===3)) {
                return 1;
            }
            else {
                return 0;
            }

        };

        //Creating an array with next states of each cell
        this.boardState = [];

        this.computeNextGeneration = function () {
            var nextGen = [];
            for (var i = 0; i < this.height; i++) {
                for (var j = 0; j < this.width; j++) {
                    nextGen.push(this.computeCellNextState(j, i));
                }
            }
            this.boardState = nextGen;


        };
        //Printing new states of cells
        this.printNextGeneration = function () {
            for (var i=0; i<this.cells.length; i++) {
                if (this.boardState[i]===1) {
                    this.cells[i].classList.add("live");


                }
                else if (this.boardState[i]===0) {
                    this.cells[i].classList.remove("live");


                }
            }


        };
        var self = this;

        //An event for button creating a glider
        var gliderBtn = document.querySelector(".add-glider");
        gliderBtn.addEventListener("click", function (e) {
            self.addGlider();
        });

        //Setting cells life cycle interval
        var playBtn = document.querySelector(".play");
        var pauseBtn = document.querySelector(".pause");
        this.interval = undefined;
        var started = false;
        playBtn.addEventListener("click", function (e) {

            if (started === false) {

                self.interval = setInterval(function () {
                    self.computeNextGeneration();
                    self.printNextGeneration();
                }, 1000);
                started = true;

            }

        });


        pauseBtn.addEventListener("click", function (e) {
            clearInterval(self.interval);
            started = false;

        });


        this.start = function () {
            this.createBoard();
            this.addGlider();

        };

        //Clearing the board
        var clearB = document.querySelector(".clear-board");
        clearB.addEventListener("click", function(e) {
            for(var i=0; i<self.cells.length; i++){
                self.cells[i].classList.remove("live");
            }
            if (self.interval!==undefined) {
                clearInterval(self.interval);
                started=false;
            }
        })

    }

    var bWidth = document.querySelector(".width");
    var bHeight = document.querySelector(".height");
    var startB = document.querySelector(".start");

    var startSection = document.querySelector(".game-start");
    var gameSection = document.querySelector(".game");

    gameSection.style.display="none";

    startB.addEventListener("click", function (e) {
        startSection.style.display = "none";
        gameSection.style.display = "block";
        var game = new GameOfLife(bWidth.value, bHeight.value);
        game.start();

    });


});