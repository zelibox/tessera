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
    var app = new PIXI.Application({
        autoResize: true,
        resolution: devicePixelRatio,
        transparent: true,
        antialias: true,
    });
    app.stage.interactive = true;
    var scene = new Scene(app);
    $('.wrap').append(app.view);
    window.addEventListener('resize', resize);
    function resize() {
        var puzzleSize = window.innerWidth / scene.cols;
        var toolbarHeight = $('.toolbar').height();
        if ((puzzleSize * scene.rows) > (window.innerHeight - toolbarHeight)) {
            puzzleSize = (window.innerHeight - toolbarHeight) / scene.rows;
        }
        scene.puzzleSize = puzzleSize;
        scene.getAllPuzzles().forEach(function (p) { return p.clearGraphics(); });
        app.renderer.resize(puzzleSize * scene.cols, puzzleSize * scene.rows);
    }
    resize();
    app.ticker.add(function () {
        scene.render();
    });
    // controller
    var startX = 0;
    var interval;
    $(app.view)['swipe']({
        swipeStatus: function (event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
            // console.log({
            //     event: event,
            //     phase: phase,
            //     direction: direction,
            //     distance: distance,
            //     duration: duration,
            //     fingers: fingers,
            //     fingerData: fingerData,
            //     currentDirection: currentDirection
            // });
            if (phase === 'start') {
                if (event.pageX) {
                    startX = event.pageX;
                }
                else {
                    startX = event.touches[0].pageX;
                }
            }
            if (phase === 'cancel' && distance <= scene.puzzleSize) {
                if (startX > (window.innerWidth / 2)) {
                    scene.getInteractiveFigure().move('right');
                }
                else {
                    scene.getInteractiveFigure().move('left');
                }
            }
        },
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if (duration < 350) {
                if (direction == 'left') { // left
                    while (scene.getInteractiveFigure().move('left')) {
                    }
                }
                else if (direction == 'right') { // right
                    while (scene.getInteractiveFigure().move('right')) {
                    }
                }
                if (direction == 'up') { // up
                    scene.getInteractiveFigure().rotate('right');
                }
                else if (direction == 'down') { // down
                    while (scene.getInteractiveFigure().move('down')) {
                    }
                }
            }
        }
    });
    $("body").on('keydown', function (e) {
        if (e.keyCode == 37) { // left
            scene.getInteractiveFigure().move('left');
        }
        else if (e.keyCode == 39) { // right
            scene.getInteractiveFigure().move('right');
        }
        else if (e.keyCode == 38) { // up
            scene.getInteractiveFigure().rotate('right');
        }
        else if (e.keyCode == 40) { // down
            scene.getInteractiveFigure().move('down');
        }
    });
    var pauseElement = $('.pause');
    pauseElement.on('click', function () {
        if (pauseElement.hasClass('active')) {
            pauseElement.removeClass('active');
            scene.setPause(false);
        }
        else {
            pauseElement.addClass('active');
            scene.setPause(true);
        }
    });
    var fullScreenToggleElement = $('.full-screen-toggle');
    fullScreenToggleElement.on('click', function () {
        var elem = document.documentElement;
        if (fullScreenToggleElement.hasClass('active')) {
            fullScreenToggleElement.removeClass('active');
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            }
            else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            else if (document['msExitFullscreen']) {
                document['msExitFullscreen']();
            }
        }
        else {
            $('.full-screen-toggle').addClass('active');
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            }
            else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            }
            else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
            else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        }
    });
});
var Scene = /** @class */ (function () {
    function Scene(app) {
        this.app = app;
        this.puzzleSize = 20;
        this.rows = 22;
        this.cols = 12;
        this.pause = false;
        this.wrapFigure = new WrapFigure(this);
        this.borderFigure = new BorderFigure(this);
        this.borderFigure.insertPuzzles(this.generatePuzzles(this.borderFigure.getCountPuzzlePlaces(), BorderPuzzle));
        this.shadowFigure = new ShadowFigure(this);
        this.initInteractiveFigure();
    }
    Scene.prototype.getApp = function () {
        return this.app;
    };
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
            InteractiveFigureISmall,
            InteractiveFigureILSmall,
            InteractiveFigureIMiddle,
        ];
        this.interactiveFigure = new figures[Math.floor(Math.random() * figures.length)](this);
        this.interactiveFigure.insertPuzzles(this.generatePuzzles(this.interactiveFigure.getCountPuzzlePlaces(), SimplePuzzle));
        this.interactiveFigure.onUpdateShape(this.shadowFigure.onUpdateShapeInteractiveFigure);
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
    Scene.prototype.getShadowFigure = function () {
        return this.shadowFigure;
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
    Scene.prototype.getAllPuzzles = function () {
        var puzzles = [];
        for (var _i = 0, _a = [this.shadowFigure, this.interactiveFigure, this.borderFigure, this.wrapFigure]; _i < _a.length; _i++) {
            var figure = _a[_i];
            for (var _b = 0, _c = figure.getPuzzles(); _b < _c.length; _b++) {
                var puzzle = _c[_b];
                puzzles.push(puzzle);
            }
        }
        return puzzles;
    };
    Scene.prototype.generatePuzzles = function (count, type) {
        var arr = [];
        for (var i = 0; i < count; i++) {
            arr.push(new type());
        }
        return arr;
    };
    Scene.prototype.render = function () {
        if (this.pause) {
            return;
        }
        for (var _i = 0, _a = [this.shadowFigure, this.interactiveFigure, this.borderFigure, this.wrapFigure]; _i < _a.length; _i++) {
            var figure = _a[_i];
            figure.render();
        }
    };
    Scene.prototype.setPause = function (pause) {
        this.pause = pause;
    };
    return Scene;
}());
var Figure = /** @class */ (function () {
    function Figure(scene) {
        this.scene = scene;
        this.shape = null;
        this.onUpdateShapeCallbacks = [];
    }
    Figure.prototype.getScene = function () {
        return this.scene;
    };
    Figure.prototype.impact = function (figure) {
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
    Figure.prototype.onUpdateShape = function (callback) {
        this.onUpdateShapeCallbacks.push(callback);
    };
    Figure.prototype.updateShape = function (shape) {
        var _this = this;
        this.shape = shape;
        var x;
        var y = this.getRow();
        for (var _i = 0, _a = this.getShape(); _i < _a.length; _i++) {
            var row = _a[_i];
            x = this.getCell();
            for (var _b = 0, row_2 = row; _b < row_2.length; _b++) {
                var puzzle = row_2[_b];
                if (typeof puzzle !== "number") {
                    puzzle.setPosition(x, y);
                }
                x += 1;
            }
            y += 1;
        }
        this.onUpdateShapeCallbacks.forEach(function (c) { return c(_this); });
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
var BorderFigure = /** @class */ (function (_super) {
    __extends(BorderFigure, _super);
    function BorderFigure() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BorderFigure.prototype.getCell = function () {
        return 0;
    };
    BorderFigure.prototype.getRow = function () {
        return 0;
    };
    BorderFigure.prototype.initShape = function () {
        var rows = this.getScene().rows;
        var cols = this.getScene().cols;
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
        this.getScene().getWrapFigure().impact(figure);
    };
    return BorderFigure;
}(Figure));
///<reference path="basic.figure.ts"/>
var InteractiveFigure = /** @class */ (function (_super) {
    __extends(InteractiveFigure, _super);
    function InteractiveFigure() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderStartDate = null;
        _this.cell = null;
        _this.row = null;
        return _this;
    }
    InteractiveFigure.prototype.getCell = function () {
        if (this.cell === null) {
            this.cell = Math.floor((this.getScene().cols / 2) - (this.getShape()[0].length / 2));
        }
        return this.cell;
    };
    InteractiveFigure.prototype.getRow = function () {
        if (this.row === null) {
            this.row = 1;
        }
        return this.row;
    };
    InteractiveFigure.prototype.render = function () {
        if (!this.renderStartDate) {
            this.renderStartDate = new Date();
        }
        if (((new Date().getTime() - this.renderStartDate.getTime()) >= 500)) {
            this.renderStartDate = new Date();
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
        var y = this.getRow();
        for (var _i = 0, shape_1 = shape; _i < shape_1.length; _i++) {
            var row = shape_1[_i];
            x = this.getCell();
            for (var _a = 0, row_5 = row; _a < row_5.length; _a++) {
                var puzzle = row_5[_a];
                if (typeof puzzle !== "number") {
                    var barrier = this.getScene().getPuzzle(x, y);
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
        var moveX = this.getCell();
        var moveY = this.getRow();
        if (side === 'right') {
            moveX = this.getCell() + 1;
        }
        if (side === 'left') {
            moveX = this.getCell() - 1;
        }
        if (side === 'down') {
            moveY = this.getRow() + 1;
        }
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
                    barrier = this.getScene().getPuzzle(x, y);
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
                if (this.getRow() === 1) {
                    this.scene.getWrapFigure().getPuzzles().forEach(function (p) { return p.remove(); });
                }
                else {
                    barrier.getFigure().impact(this);
                }
            }
            return false;
        }
        else {
            this.cell = moveX;
            this.row = moveY;
            this.updateShape(this.getShape());
            return true;
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
var InteractiveFigureISmall = /** @class */ (function (_super) {
    __extends(InteractiveFigureISmall, _super);
    function InteractiveFigureISmall() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InteractiveFigureISmall.prototype.initShape = function () {
        return [
            [1, 0],
            [1, 0],
        ];
    };
    return InteractiveFigureISmall;
}(InteractiveFigure));
var InteractiveFigureIMiddle = /** @class */ (function (_super) {
    __extends(InteractiveFigureIMiddle, _super);
    function InteractiveFigureIMiddle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InteractiveFigureIMiddle.prototype.initShape = function () {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ];
    };
    return InteractiveFigureIMiddle;
}(InteractiveFigure));
var InteractiveFigureILSmall = /** @class */ (function (_super) {
    __extends(InteractiveFigureILSmall, _super);
    function InteractiveFigureILSmall() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InteractiveFigureILSmall.prototype.initShape = function () {
        return [
            [1, 0],
            [1, 1],
        ];
    };
    return InteractiveFigureILSmall;
}(InteractiveFigure));
var ShadowFigure = /** @class */ (function (_super) {
    __extends(ShadowFigure, _super);
    function ShadowFigure() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.latestFigure = null;
        _this.onUpdateShapeInteractiveFigure = function (figure) {
            if (_this.latestFigure !== figure) {
                _this.getPuzzles().forEach(function (p) { return p.remove(); });
                _this.latestFigure = figure;
                _this.shape = _this.initShape();
                _this.insertPuzzles(_this.scene.generatePuzzles(_this.getCountPuzzlePlaces(), ShadowPuzzle));
            }
            else {
                var puzzles = _this.getPuzzles();
                _this.shape = _this.initShape();
                _this.insertPuzzles(puzzles);
            }
        };
        return _this;
    }
    ShadowFigure.prototype.initShape = function () {
        if (!this.latestFigure) {
            return [];
        }
        var shape = [];
        for (var _i = 0, _a = this.latestFigure.getShape(); _i < _a.length; _i++) {
            var row = _a[_i];
            var sRow = [];
            for (var _b = 0, row_7 = row; _b < row_7.length; _b++) {
                var cell = row_7[_b];
                sRow.push(typeof cell !== "number" ? 1 : 0);
            }
            shape.push(sRow);
        }
        return shape;
    };
    ShadowFigure.prototype.getCell = function () {
        return this.latestFigure.getCell();
    };
    ShadowFigure.prototype.getRow = function () {
        var _this = this;
        var barrier = null;
        var yIndex = this.latestFigure.getRow();
        labelStop: while (yIndex <= this.getScene().rows) {
            yIndex++;
            var y = yIndex;
            var x = void 0;
            for (var _i = 0, _a = this.getShape(); _i < _a.length; _i++) {
                var row = _a[_i];
                x = this.latestFigure.getCell();
                for (var _b = 0, row_8 = row; _b < row_8.length; _b++) {
                    var puzzle = row_8[_b];
                    if (typeof puzzle !== "number") {
                        barrier = this.getScene().getPuzzle(x, y);
                        if (barrier && barrier.getFigure() !== this) {
                            break labelStop;
                        }
                    }
                    x += 1;
                }
                y += 1;
            }
        }
        yIndex -= 1;
        this.getPuzzles().forEach(function (p) {
            if (p instanceof ShadowPuzzle) {
                p.setAlpha(0.3 / yIndex * (yIndex - _this.latestFigure.getRow()));
            }
        });
        return yIndex;
    };
    return ShadowFigure;
}(Figure));
var WrapFigure = /** @class */ (function (_super) {
    __extends(WrapFigure, _super);
    function WrapFigure() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WrapFigure.prototype.initShape = function () {
        var rows = this.getScene().rows - 2;
        var cols = this.getScene().cols - 2;
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
    WrapFigure.prototype.getCell = function () {
        return 1;
    };
    WrapFigure.prototype.getRow = function () {
        return 1;
    };
    WrapFigure.prototype.updateShape = function (shape) {
        var fillRows = [];
        for (var _i = 0, shape_2 = shape; _i < shape_2.length; _i++) {
            var row = shape_2[_i];
            for (var _a = 0, row_9 = row; _a < row_9.length; _a++) {
                var cell = row_9[_a];
                if (typeof cell !== "number") {
                    fillRows.push(row);
                    break;
                }
            }
        }
        var rows = this.getScene().rows - 2;
        var cols = this.getScene().cols - 2;
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
            for (var _b = 0, row_10 = row; _b < row_10.length; _b++) {
                var puzzle = row_10[_b];
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
            for (var _d = 0, row_11 = row; _d < row_11.length; _d++) {
                var cell = row_11[_d];
                if (typeof cell !== "number") {
                    countFill++;
                }
                if (countFill === row.length) {
                    for (var _e = 0, row_12 = row; _e < row_12.length; _e++) {
                        var cell_1 = row_12[_e];
                        if (typeof cell_1 !== "number") {
                            cell_1.remove();
                        }
                    }
                }
            }
        }
        this.updateShape(shape);
        this.getScene().initInteractiveFigure();
    };
    return WrapFigure;
}(Figure));
var Puzzle = /** @class */ (function () {
    function Puzzle() {
        this.x = null;
        this.y = null;
        this.futureX = null;
        this.futureY = null;
        this.stepX = null;
        this.stepY = null;
        this.animationTime = 300;
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
    Puzzle.prototype.remove = function () {
        var shape = this.figure.getShape();
        var x;
        var y = 0;
        for (var _i = 0, shape_4 = shape; _i < shape_4.length; _i++) {
            var row = shape_4[_i];
            x = 0;
            for (var _a = 0, row_13 = row; _a < row_13.length; _a++) {
                var cell = row_13[_a];
                if (cell === this) {
                    shape[y][x] = 0;
                }
                x++;
            }
            y++;
        }
        this.clearGraphics();
        this.figure.updateShape(shape);
    };
    Puzzle.prototype.setPosition = function (x, y) {
        this.cell = x;
        this.row = y;
    };
    Puzzle.prototype.clearGraphics = function () {
        if (this.graphics) {
            this.getFigure().getScene().getApp().stage.removeChild(this.graphics);
            this.graphics = null;
        }
    };
    Puzzle.prototype.getGraphics = function () {
        if (!this.graphics) {
            var width = this.figure.getScene().puzzleSize - 1;
            var height = this.figure.getScene().puzzleSize - 1;
            var app = this.figure.getScene().getApp();
            this.graphics = new PIXI.Graphics();
            this.graphics.lineStyle(0);
            this.graphics.beginFill(this.getColor(), 1);
            this.graphics.drawRoundedRect(0, 0, width, height, Math.floor(width * 0.30));
            this.graphics.endFill();
            app.stage.addChild(this.graphics);
        }
        return this.graphics;
    };
    Puzzle.prototype.render = function () {
        var x = this.cell * this.figure.getScene().puzzleSize;
        var y = this.row * this.figure.getScene().puzzleSize;
        if ((this.x === null) || (this.y === null)) {
            this.x = x;
            this.y = y;
            this.futureX = x;
            this.futureY = y;
            this.renderStartDate = new Date();
        }
        else {
            if ((x !== this.futureX) || (y !== this.futureY)) {
                this.futureX = x;
                this.futureY = y;
                this.renderStartDate = new Date();
            }
            var diff = new Date().getTime() - this.renderStartDate.getTime();
            if (this.x > this.futureX) {
                this.stepX = ((this.x - this.futureX) * (diff / this.animationTime)) * -1;
            }
            else {
                this.stepX = ((this.futureX - this.x) * (diff / this.animationTime));
            }
            if (this.y > this.futureY) {
                this.stepY = ((this.y - this.futureY) * (diff / this.animationTime)) * -1;
            }
            else {
                this.stepY = ((this.futureY - this.y) * (diff / this.animationTime));
            }
            this.x += this.stepX;
            this.y += this.stepY;
            if (diff >= this.animationTime) {
                this.x = this.futureX;
                this.y = this.futureY;
            }
        }
        var graphics = this.getGraphics();
        graphics.position.x = this.x;
        graphics.position.y = this.y;
    };
    return Puzzle;
}());
var SimplePuzzle = /** @class */ (function (_super) {
    __extends(SimplePuzzle, _super);
    function SimplePuzzle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimplePuzzle.prototype.getColor = function () {
        return 0x00adb5;
    };
    return SimplePuzzle;
}(Puzzle));
var BorderPuzzle = /** @class */ (function (_super) {
    __extends(BorderPuzzle, _super);
    function BorderPuzzle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BorderPuzzle.prototype.getColor = function () {
        return 0x393e46;
    };
    return BorderPuzzle;
}(Puzzle));
var ShadowPuzzle = /** @class */ (function (_super) {
    __extends(ShadowPuzzle, _super);
    function ShadowPuzzle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.alpha = 0;
        _this.renderBlurStartDate = new Date();
        return _this;
    }
    ShadowPuzzle.prototype.getColor = function () {
        return 0x00adb5;
    };
    ShadowPuzzle.prototype.getGraphics = function () {
        if (!this.graphics) {
            var graphics = _super.prototype.getGraphics.call(this);
            graphics.alpha = 0.10;
            this.blurFilter = new PIXI.filters.BlurFilter();
            this.blurFilter.blur = 0;
            // graphics.filters = [this.blurFilter];
        }
        return this.graphics;
    };
    ShadowPuzzle.prototype.setAlpha = function (blur) {
        this.alpha = blur;
        this.renderBlurStartDate = new Date();
    };
    ShadowPuzzle.prototype.render = function () {
        _super.prototype.render.call(this);
        var diff = (new Date().getTime() - this.renderBlurStartDate.getTime() / this.animationTime);
        if (diff > 1) {
            diff = 1;
        }
        this.getGraphics().alpha = this.alpha * diff;
        // this.blurFilter.blur = this.blur * diff;
    };
    return ShadowPuzzle;
}(Puzzle));

//# sourceMappingURL=assets_typescript.js.map
