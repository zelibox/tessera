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
function generatePuzzles(count, type) {
    var arr = [];
    for (var i = 0; i < count; i++) {
        arr.push(new type());
    }
    return arr;
}
$(function () {
    console.log(BorderFigure);
    var canvasElement = document.getElementById('wrap');
    var ctx = canvasElement.getContext('2d');
    var f = new InteractiveFigureS(ctx);
    f.insertPuzzles(generatePuzzles(f.getCountPuzzlePlaces(), SimplePuzzle));
    f.move('right');
    f.move('right');
    f.move('right');
    f.move('right');
    f.move('down');
    var w = new BorderFigure(ctx);
    w.insertPuzzles(generatePuzzles(w.getCountPuzzlePlaces(), BorderPuzzle));
    $("body").on('keydown', function (e) {
        if (e.keyCode == 37) { // left
            f.move('left');
        }
        else if (e.keyCode == 39) { // right
            f.move('right');
        }
        else if (e.keyCode == 38) { // up
            f.rotate('right');
        }
        else if (e.keyCode == 40) { // down
            f.move('down');
        }
    });
    // f.flipMatrix();
    function draw() {
        ctx.clearRect(0, 0, 240, 440);
        f.render();
        w.render();
        requestAnimationFrame(draw);
    }
    draw();
});
var config = {
    puzzleSize: 20,
    rows: 22,
    cols: 12,
};
var Puzzle = /** @class */ (function () {
    function Puzzle() {
        this.width = 18;
        this.height = 18;
        this.color = "#fbcf9d";
        this.x = null;
        this.y = null;
        this.futureX = null;
        this.futureY = null;
        this.stepX = null;
        this.stepY = null;
        this.countStep = 10;
        this.currentStep = 0;
    }
    Puzzle.prototype.setCtx = function (ctx) {
        this.ctx = ctx;
    };
    Puzzle.prototype.render = function (x, y) {
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
        // this.ctx.shadowColor = '#fbcf9d';
        // this.ctx.shadowBlur = 2;
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
var Figure = /** @class */ (function () {
    function Figure(ctx) {
        this.ctx = ctx;
        this.shape = null;
        this.x = 0;
        this.y = 0;
    }
    Figure.prototype.getShape = function () {
        if (this.shape === null) {
            this.shape = this.initShape();
        }
        return this.shape;
    };
    Figure.prototype.updateShape = function (shape) {
        this.shape = shape;
    };
    Figure.prototype.getCountPuzzlePlaces = function () {
        var count = 0;
        for (var _i = 0, _a = this.getShape(); _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var place = row_1[_b];
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
            for (var _b = 0, row_2 = row; _b < row_2.length; _b++) {
                var place = row_2[_b];
                if (place !== 0) {
                    rowShape.push(puzzles[index]);
                    puzzles[index].setCtx(this.ctx);
                    index++;
                }
                else {
                    rowShape.push(0);
                }
            }
            shape.push(rowShape);
        }
        this.updateShape(shape);
        this.puzzles = puzzles;
    };
    Figure.prototype.render = function () {
        var x;
        var y = this.y;
        for (var _i = 0, _a = this.getShape(); _i < _a.length; _i++) {
            var row = _a[_i];
            x = this.x;
            for (var _b = 0, row_3 = row; _b < row_3.length; _b++) {
                var place = row_3[_b];
                if (typeof place !== "number") {
                    place.render(x, y);
                }
                x += 20;
            }
            y += 20;
        }
    };
    Figure.prototype.rotate = function (side) {
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
        this.updateShape(shape);
    };
    Figure.prototype.move = function (side) {
        var moveX = this.x;
        var moveY = this.y;
        if (side === 'right') {
            moveX = this.x + 20;
        }
        if (side === 'left') {
            moveX = this.x - 20;
        }
        if (side === 'down') {
            moveY = this.y + 20;
        }
        if (this.isCanMove(moveX, moveY)) {
            this.x = moveX;
            this.y = moveY;
        }
    };
    Figure.prototype.isCanMove = function (x, y) {
        if (x >= 0 && x <= 160) {
            return true;
        }
        else {
            return false;
        }
    };
    return Figure;
}());
var BorderFigure = /** @class */ (function (_super) {
    __extends(BorderFigure, _super);
    function BorderFigure() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BorderFigure.prototype.initShape = function () {
        var rows = 22;
        var cols = 12;
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
    return BorderFigure;
}(Figure));
var InteractiveFigure = /** @class */ (function (_super) {
    __extends(InteractiveFigure, _super);
    function InteractiveFigure() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InteractiveFigure.prototype.render = function () {
        this.tickCount++;
        if ((this.tickCount % 30) === 0) {
            this.move("down");
        }
        _super.prototype.render.call(this);
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
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
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

//# sourceMappingURL=assets_typescript.js.map
