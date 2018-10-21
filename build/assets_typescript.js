var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
$(function () {
    var canvasElement = document.getElementById('wrap');
    var ctx = canvasElement.getContext('2d');
    config.scene = new Scene(ctx);
    $("body").on('keydown', function (e) {
        if (e.keyCode == 37) { // left
            config.scene.getInteractiveFigure().move('left');
        }
        else if (e.keyCode == 39) { // right
            config.scene.getInteractiveFigure().move('right');
        }
        else if (e.keyCode == 38) { // up
            config.scene.getInteractiveFigure().rotate('right');
        }
        else if (e.keyCode == 40) { // down
            config.scene.getInteractiveFigure().move('down');
        }
    });
    function draw() {
        ctx.clearRect(0, 0, 240, 440);
        config.scene.render();
        requestAnimationFrame(draw);
    }
    draw();
});
var Figure = /** @class */ (function () {
    function Figure(ctx) {
        this.ctx = ctx;
        this.shape = null;
        this.cell = 0;
        this.row = 0;
    }
    Figure.prototype.impact = function (figure) {
    };
    Figure.prototype.getCell = function () {
        return this.cell;
    };
    Figure.prototype.getRow = function () {
        return this.row;
    };
    Figure.prototype.getPuzzles = function () {
        var puzzles = [];
        for (var _i = 0, _a = this.getShape(); _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var puzzle = row_1[_b];
                if (typeof puzzle !== "number") {
                    puzzles.push(puzzle);
                }
            }
        }
        return puzzles;
    };
    Figure.prototype.getShape = function () {
        if (this.shape === null) {
            this.shape = this.initShape();
        }
        return this.shape;
    };
    Figure.prototype.updateShape = function (shape) {
        this.shape = shape;
        var x;
        var y = this.row;
        for (var _i = 0, _a = this.getShape(); _i < _a.length; _i++) {
            var row = _a[_i];
            x = this.cell;
            for (var _b = 0, row_2 = row; _b < row_2.length; _b++) {
                var puzzle = row_2[_b];
                if (typeof puzzle !== "number") {
                    puzzle.setPosition(x, y);
                }
                x += 1;
            }
            y += 1;
        }
    };
    Figure.prototype.getCountPuzzlePlaces = function () {
        var count = 0;
        for (var _i = 0, _a = this.getShape(); _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_3 = row; _b < row_3.length; _b++) {
                var place = row_3[_b];
                if (place !== 0) {
                    count++;
                }
            }
        }
        return count;
    };
    Figure.prototype.insertPuzzles = function (puzzles) {
        var shape = [];
        var index = 0;
        for (var _i = 0, _a = this.getShape(); _i < _a.length; _i++) {
            var row = _a[_i];
            var rowShape = [];
            for (var _b = 0, row_4 = row; _b < row_4.length; _b++) {
                var place = row_4[_b];
                if (place !== 0) {
                    rowShape.push(puzzles[index]);
                    puzzles[index].setCtx(this.ctx);
                    puzzles[index].setFigure(this);
                    index++;
                }
                else {
                    rowShape.push(0);
                }
            }
            shape.push(rowShape);
        }
        this.updateShape(shape);
    };
    Figure.prototype.render = function () {
        for (var _i = 0, _a = this.getPuzzles(); _i < _a.length; _i++) {
            var puzzle = _a[_i];
            puzzle.render();
        }
    };
    return Figure;
}());
///<reference path="basic.figure.ts"/>
var InteractiveFigure = /** @class */ (function (_super) {
    __extends(InteractiveFigure, _super);
    function InteractiveFigure() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.row = 1;
        _this.cell = Math.floor((config.cols / 2) - (_this.getShape()[0].length / 2));
        _this.tickCount = 0;
        return _this;
    }
    InteractiveFigure.prototype.render = function () {
        this.tickCount++;
        if ((this.tickCount % 30) === 0) {
            this.move("down");
        }
        _super.prototype.render.call(this);
    };
    InteractiveFigure.prototype.rotate = function (side) {
        var _this = this;
        var n = this.getShape().length - 1;
        var shape = this.getShape().map(function (row, i) {
            row = row.map(function (val, j) {
                return _this.getShape()[n - j][i];
            });
            if (side === 'left') {
                row.reverse();
            }
            return row;
        });
        if (side === 'left') {
            shape.reverse();
        }
        var x;
        var y = this.row;
        for (var _i = 0, shape_1 = shape; _i < shape_1.length; _i++) {
            var row = shape_1[_i];
            x = this.cell;
            for (var _a = 0, row_5 = row; _a < row_5.length; _a++) {
                var puzzle = row_5[_a];
                if (typeof puzzle !== "number") {
                    var barrier = config.scene.getPuzzle(x, y);
                    if (barrier && barrier.getFigure() !== this) {
                        return;
                    }
                }
                x += 1;
            }
            y += 1;
        }
        this.updateShape(shape);
    };
    InteractiveFigure.prototype.move = function (side) {
        var moveX = this.cell;
        var moveY = this.row;
        if (side === 'right') {
            moveX = this.cell + 1;
        }
        if (side === 'left') {
            moveX = this.cell - 1;
        }
        if (side === 'down') {
            moveY = this.row + 1;
        }
        this.updateShape(this.getShape());
        var x;
        var y = moveY;
        var barrierType = null;
        var barrier;
        labelStop: for (var _i = 0, _a = this.getShape(); _i < _a.length; _i++) {
            var row = _a[_i];
            x = moveX;
            for (var _b = 0, row_6 = row; _b < row_6.length; _b++) {
                var puzzle = row_6[_b];
                if (typeof puzzle !== "number") {
                    barrier = config.scene.getPuzzle(x, y);
                    if (barrier && barrier.getFigure() !== this) {
                        barrierType = side;
                        break labelStop;
                    }
                }
                x += 1;
            }
            y += 1;
        }
        if (barrierType) {
            if (barrierType === 'down') {
                barrier.getFigure().impact(this);
            }
            return;
        }
        else {
            this.cell = moveX;
            this.row = moveY;
        }
    };
    return InteractiveFigure;
}(Figure));
var InteractiveFigureI = /** @class */ (function (_super) {
    __extends(InteractiveFigureI, _super);
    function InteractiveFigureI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InteractiveFigureI.prototype.initShape = function () {
        return [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
        ];
    };
    return InteractiveFigureI;
}(InteractiveFigure));
var InteractiveFigureO = /** @class */ (function (_super) {
    __extends(InteractiveFigureO, _super);
    function InteractiveFigureO() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InteractiveFigureO.prototype.initShape = function () {
        return [
            [1, 1],
            [1, 1]
        ];
    };
    return InteractiveFigureO;
}(InteractiveFigure));
var InteractiveFigureT = /** @class */ (function (_super) {
    __extends(InteractiveFigureT, _super);
    function InteractiveFigureT() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InteractiveFigureT.prototype.initShape = function () {
        return [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];
    };
    return InteractiveFigureT;
}(InteractiveFigure));
var InteractiveFigureS = /** @class */ (function (_super) {
    __extends(InteractiveFigureS, _super);
    function InteractiveFigureS() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InteractiveFigureS.prototype.initShape = function () {
        return [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ];
    };
    return InteractiveFigureS;
}(InteractiveFigure));
var InteractiveFigureZ = /** @class */ (function (_super) {
    __extends(InteractiveFigureZ, _super);
    function InteractiveFigureZ() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InteractiveFigureZ.prototype.initShape = function () {
        return [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ];
    };
    return InteractiveFigureZ;
}(InteractiveFigure));
var InteractiveFigureJ = /** @class */ (function (_super) {
    __extends(InteractiveFigureJ, _super);
    function InteractiveFigureJ() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InteractiveFigureJ.prototype.initShape = function () {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ];
    };
    return InteractiveFigureJ;
}(InteractiveFigure));
var InteractiveFigureL = /** @class */ (function (_super) {
    __extends(InteractiveFigureL, _super);
    function InteractiveFigureL() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InteractiveFigureL.prototype.initShape = function () {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ];
    };
    return InteractiveFigureL;
}(InteractiveFigure));
var InteractiveFigureDot = /** @class */ (function (_super) {
    __extends(InteractiveFigureDot, _super);
    function InteractiveFigureDot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InteractiveFigureDot.prototype.initShape = function () {
        return [
            [1]
        ];
    };
    return InteractiveFigureDot;
}(InteractiveFigure));
///<reference path="figure/interactive.figure.ts"/>
///<reference path="figure/basic.figure.ts"/>
var Scene = /** @class */ (function () {
    function Scene(ctx) {
        this.ctx = ctx;
        this.initInteractiveFigure();
        this.initBorderFigure();
        this.wrapFigure = new WrapFigure(ctx);
    }
    Scene.prototype.initInteractiveFigure = function () {
        // todo
        var figures = [
            InteractiveFigureI,
            InteractiveFigureO,
            InteractiveFigureT,
            InteractiveFigureS,
            InteractiveFigureZ,
            InteractiveFigureJ,
            InteractiveFigureL,
            InteractiveFigureDot,
        ];
        this.interactiveFigure = new figures[Math.floor(Math.random() * figures.length)](this.ctx);
        this.interactiveFigure.insertPuzzles(this.generatePuzzles(this.interactiveFigure.getCountPuzzlePlaces(), SimplePuzzle));
    };
    Scene.prototype.initBorderFigure = function () {
        this.borderFigure = new BorderFigure(this.ctx);
        this.borderFigure.insertPuzzles(this.generatePuzzles(this.borderFigure.getCountPuzzlePlaces(), BorderPuzzle));
    };
    Scene.prototype.getInteractiveFigure = function () {
        return this.interactiveFigure;
    };
    Scene.prototype.getBorderFigure = function () {
        return this.borderFigure;
    };
    Scene.prototype.getWrapFigure = function () {
        return this.wrapFigure;
    };
    Scene.prototype.getPuzzle = function (cell, row) {
        for (var _i = 0, _a = [this.borderFigure, this.wrapFigure]; _i < _a.length; _i++) {
            var figure = _a[_i];
            for (var _b = 0, _c = figure.getPuzzles(); _b < _c.length; _b++) {
                var puzzle = _c[_b];
                if (((puzzle.getCell()) === cell)
                    && ((puzzle.getRow()) === row)) {
                    return puzzle;
                }
            }
        }
        return null;
    };
    Scene.prototype.generatePuzzles = function (count, type) {
        var arr = [];
        for (var i = 0; i < count; i++) {
            arr.push(new type());
        }
        return arr;
    };
    Scene.prototype.render = function () {
        for (var _i = 0, _a = [this.interactiveFigure, this.borderFigure, this.wrapFigure]; _i < _a.length; _i++) {
            var figure = _a[_i];
            figure.render();
        }
    };
    return Scene;
}());
///<reference path="scene.ts"/>
var config = {
    puzzleSize: 20,
    rows: 22,
    cols: 12,
    scene: null
};
var BorderFigure = /** @class */ (function (_super) {
    __extends(BorderFigure, _super);
    function BorderFigure() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BorderFigure.prototype.initShape = function () {
        var rows = config.rows;
        var cols = config.cols;
        var shape = [];
        for (var r = 0; r < rows; r++) {
            var row = [];
            for (var c = 0; c < cols; c++) {
                var v = 0;
                if (r === 0 || r === (rows - 1) || c === 0 || c === (cols - 1)) {
                    v = 1;
                }
                row.push(v);
            }
            shape.push(row);
        }
        return shape;
    };
    BorderFigure.prototype.impact = function (figure) {
        config.scene.getWrapFigure().impact(figure);
    };
    return BorderFigure;
}(Figure));
var WrapFigure = /** @class */ (function (_super) {
    __extends(WrapFigure, _super);
    function WrapFigure() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cell = 1;
        _this.row = 1;
        return _this;
    }
    WrapFigure.prototype.initShape = function () {
        var rows = config.rows - 2;
        var cols = config.cols - 2;
        var shape = [];
        for (var r = 0; r < rows; r++) {
            var row = [];
            for (var c = 0; c < cols; c++) {
                row.push(0);
            }
            shape.push(row);
        }
        return shape;
    };
    WrapFigure.prototype.updateShape = function (shape) {
        var fillRows = [];
        for (var _i = 0, shape_2 = shape; _i < shape_2.length; _i++) {
            var row = shape_2[_i];
            for (var _a = 0, row_7 = row; _a < row_7.length; _a++) {
                var cell = row_7[_a];
                if (typeof cell !== "number") {
                    fillRows.push(row);
                    break;
                }
            }
        }
        var rows = config.rows - 2;
        var cols = config.cols - 2;
        var newShape = [];
        for (var r = 0; r < rows; r++) {
            if ((shape.length - fillRows.length) > r) {
                var row = [];
                for (var c = 0; c < cols; c++) {
                    row.push(0);
                }
                newShape.push(row);
            }
            else {
                newShape.push(fillRows[r - (shape.length - fillRows.length)]);
            }
        }
        _super.prototype.updateShape.call(this, newShape);
    };
    WrapFigure.prototype.impact = function (figure) {
        var x;
        var y = figure.getRow();
        var shape = this.getShape();
        for (var _i = 0, _a = figure.getShape(); _i < _a.length; _i++) {
            var row = _a[_i];
            x = figure.getCell();
            for (var _b = 0, row_8 = row; _b < row_8.length; _b++) {
                var puzzle = row_8[_b];
                if (typeof puzzle !== "number") {
                    puzzle.setFigure(this);
                    shape[y - 1][x - 1] = puzzle;
                }
                x += 1;
            }
            y += 1;
        }
        for (var _c = 0, shape_3 = shape; _c < shape_3.length; _c++) {
            var row = shape_3[_c];
            var countFill = 0;
            for (var _d = 0, row_9 = row; _d < row_9.length; _d++) {
                var cell = row_9[_d];
                if (typeof cell !== "number") {
                    countFill++;
                }
                if (countFill === row.length) {
                    for (var _e = 0, row_10 = row; _e < row_10.length; _e++) {
                        var cell_1 = row_10[_e];
                        if (typeof cell_1 !== "number") {
                            cell_1.remove();
                        }
                    }
                }
            }
        }
        this.updateShape(shape);
        config.scene.initInteractiveFigure();
    };
    return WrapFigure;
}(Figure));
var Puzzle = /** @class */ (function () {
    function Puzzle() {
        this.width = config.puzzleSize - 1;
        this.height = config.puzzleSize - 1;
        this.color = "#fbcf9d";
        this.x = null;
        this.y = null;
        this.futureX = null;
        this.futureY = null;
        this.stepX = null;
        this.stepY = null;
        this.countStep = 8;
        this.currentStep = 0;
        this.cell = 5; //  todo!!!!!
        this.row = 5; //  todo!!!!!
    }
    Puzzle.prototype.getCell = function () {
        return this.cell;
    };
    Puzzle.prototype.getRow = function () {
        return this.row;
    };
    Puzzle.prototype.getFigure = function () {
        return this.figure;
    };
    Puzzle.prototype.setFigure = function (figure) {
        this.figure = figure;
    };
    Puzzle.prototype.setCtx = function (ctx) {
        this.ctx = ctx;
    };
    Puzzle.prototype.remove = function () {
        var shape = this.figure.getShape();
        var x;
        var y = 0;
        for (var _i = 0, shape_4 = shape; _i < shape_4.length; _i++) {
            var row = shape_4[_i];
            x = 0;
            for (var _a = 0, row_11 = row; _a < row_11.length; _a++) {
                var cell = row_11[_a];
                if (cell === this) {
                    shape[y][x] = 0;
                }
                x++;
            }
            y++;
        }
        this.figure.updateShape(shape);
    };
    Puzzle.prototype.setPosition = function (x, y) {
        this.cell = x;
        this.row = y;
    };
    Puzzle.prototype.render = function () {
        var x = this.cell * config.puzzleSize;
        var y = this.row * config.puzzleSize;
        if ((this.x === null) || (this.y === null)) {
            this.x = x;
            this.y = y;
            this.futureX = x;
            this.futureY = y;
            this.currentStep = 0;
        }
        else {
            if ((x !== this.futureX) || (y !== this.futureY)) {
                this.futureX = x;
                this.futureY = y;
                this.currentStep = 0;
                if (this.x > this.futureX) {
                    this.stepX = ((this.x - this.futureX) / this.countStep) * -1;
                }
                else {
                    this.stepX = ((this.futureX - this.x) / this.countStep);
                }
                if (this.y > this.futureY) {
                    this.stepY = ((this.y - this.futureY) / this.countStep) * -1;
                }
                else {
                    this.stepY = ((this.futureY - this.y) / this.countStep);
                }
            }
            this.x += this.stepX;
            this.y += this.stepY;
            if (this.currentStep >= this.countStep) {
                this.x = this.futureX;
                this.y = this.futureY;
            }
        }
        this.currentStep++;
        var r = 2;
        if (this.width < 2 * r)
            r = this.width / 2;
        if (this.height < 2 * r)
            r = this.height / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + r, this.y);
        this.ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.height, r);
        this.ctx.arcTo(this.x + this.width, this.y + this.height, this.x, this.y + this.height, r);
        this.ctx.arcTo(this.x, this.y + this.height, this.x, this.y, r);
        this.ctx.arcTo(this.x, this.y, this.x + this.width, this.y, r);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
        return this.ctx;
    };
    return Puzzle;
}());
var SimplePuzzle = /** @class */ (function (_super) {
    __extends(SimplePuzzle, _super);
    function SimplePuzzle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SimplePuzzle;
}(Puzzle));
var BorderPuzzle = /** @class */ (function (_super) {
    __extends(BorderPuzzle, _super);
    function BorderPuzzle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = '#111b44';
        return _this;
    }
    return BorderPuzzle;
}(Puzzle));

//# sourceMappingURL=assets_typescript.js.map
