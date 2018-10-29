$(function () {
    const app = new PIXI.Application({
        autoResize: true,
        resolution: devicePixelRatio,
        transparent: true,
        antialias: true,
    });
    app.stage.interactive = true;
    const scene = new Scene(app);
    $('.wrap').append(app.view);
    window.addEventListener('resize', resize);
    function resize() {
        let puzzleSize = window.innerWidth / scene.cols;
        let toolbarHeight = $('.toolbar').height();
        if ((puzzleSize * scene.rows) > (window.innerHeight - toolbarHeight)) {
            puzzleSize = (window.innerHeight - toolbarHeight) / scene.rows;
        }
        scene.puzzleSize = puzzleSize;
        scene.getAllPuzzles().forEach(p => p.clearGraphics());
        app.renderer.resize(puzzleSize * scene.cols, puzzleSize * scene.rows);
    }
    resize();
    app.ticker.add(function () {
        scene.render();
    });
    // controller
    let startX = 0;
    let interval;
    $(app.view)['swipe']({
        swipeStatus: function (event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
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
    let pauseElement = $('.pause');
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
    let fullScreenToggleElement = $('.full-screen-toggle');
    fullScreenToggleElement.on('click', function () {
        let elem = document.documentElement;
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
class Scene {
    constructor(app) {
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
    getApp() {
        return this.app;
    }
    initInteractiveFigure() {
        // todo
        let figures = [
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
    }
    getInteractiveFigure() {
        return this.interactiveFigure;
    }
    getBorderFigure() {
        return this.borderFigure;
    }
    getWrapFigure() {
        return this.wrapFigure;
    }
    getShadowFigure() {
        return this.shadowFigure;
    }
    getPuzzle(cell, row) {
        for (let figure of [this.borderFigure, this.wrapFigure]) {
            for (let puzzle of figure.getPuzzles()) {
                if (((puzzle.getCell()) === cell)
                    && ((puzzle.getRow()) === row)) {
                    return puzzle;
                }
            }
        }
        return null;
    }
    getAllPuzzles() {
        let puzzles = [];
        for (let figure of [this.shadowFigure, this.interactiveFigure, this.borderFigure, this.wrapFigure]) {
            for (let puzzle of figure.getPuzzles()) {
                puzzles.push(puzzle);
            }
        }
        return puzzles;
    }
    generatePuzzles(count, type) {
        let arr = [];
        for (let i = 0; i < count; i++) {
            arr.push(new type());
        }
        return arr;
    }
    render() {
        if (this.pause) {
            return;
        }
        for (let figure of [this.shadowFigure, this.interactiveFigure, this.borderFigure, this.wrapFigure]) {
            figure.render();
        }
    }
    setPause(pause) {
        this.pause = pause;
    }
}
class Figure {
    constructor(scene) {
        this.scene = scene;
        this.shape = null;
        this.onUpdateShapeCallbacks = [];
    }
    getScene() {
        return this.scene;
    }
    impact(figure) {
    }
    getPuzzles() {
        let puzzles = [];
        for (let row of this.getShape()) {
            for (let puzzle of row) {
                if (typeof puzzle !== "number") {
                    puzzles.push(puzzle);
                }
            }
        }
        return puzzles;
    }
    getShape() {
        if (this.shape === null) {
            this.shape = this.initShape();
        }
        return this.shape;
    }
    onUpdateShape(callback) {
        this.onUpdateShapeCallbacks.push(callback);
    }
    updateShape(shape) {
        this.shape = shape;
        let x;
        let y = this.getRow();
        for (let row of this.getShape()) {
            x = this.getCell();
            for (let puzzle of row) {
                if (typeof puzzle !== "number") {
                    puzzle.setPosition(x, y);
                }
                x += 1;
            }
            y += 1;
        }
        this.onUpdateShapeCallbacks.forEach(c => c(this));
    }
    getCountPuzzlePlaces() {
        let count = 0;
        for (let row of this.getShape()) {
            for (let place of row) {
                if (place !== 0) {
                    count++;
                }
            }
        }
        return count;
    }
    insertPuzzles(puzzles) {
        let shape = [];
        let index = 0;
        for (let row of this.getShape()) {
            let rowShape = [];
            for (let place of row) {
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
    }
    render() {
        for (let puzzle of this.getPuzzles()) {
            puzzle.render();
        }
    }
}
class BorderFigure extends Figure {
    getCell() {
        return 0;
    }
    getRow() {
        return 0;
    }
    initShape() {
        let rows = this.getScene().rows;
        let cols = this.getScene().cols;
        let shape = [];
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < cols; c++) {
                let v = 0;
                if (r === 0 || r === (rows - 1) || c === 0 || c === (cols - 1)) {
                    v = 1;
                }
                row.push(v);
            }
            shape.push(row);
        }
        return shape;
    }
    impact(figure) {
        this.getScene().getWrapFigure().impact(figure);
    }
}
///<reference path="basic.figure.ts"/>
class InteractiveFigure extends Figure {
    constructor() {
        super(...arguments);
        this.renderStartDate = null;
        this.cell = null;
        this.row = null;
        this.enableMove = true;
    }
    getCell() {
        if (this.cell === null) {
            this.cell = Math.floor((this.getScene().cols / 2) - (this.getShape()[0].length / 2));
        }
        return this.cell;
    }
    getRow() {
        if (this.row === null) {
            this.row = 1;
        }
        return this.row;
    }
    render() {
        if (!this.renderStartDate) {
            this.renderStartDate = new Date();
        }
        if (((new Date().getTime() - this.renderStartDate.getTime()) >= 500)) {
            this.renderStartDate = new Date();
            this.move("down");
        }
        super.render();
    }
    rotate(side) {
        if (!this.enableMove) {
            return;
        }
        const n = this.getShape().length - 1;
        let shape = this.getShape().map((row, i) => {
            row = row.map((val, j) => {
                return this.getShape()[n - j][i];
            });
            if (side === 'left') {
                row.reverse();
            }
            return row;
        });
        if (side === 'left') {
            shape.reverse();
        }
        let x;
        let y = this.getRow();
        for (let row of shape) {
            x = this.getCell();
            for (let puzzle of row) {
                if (typeof puzzle !== "number") {
                    let barrier = this.getScene().getPuzzle(x, y);
                    if (barrier && barrier.getFigure() !== this) {
                        return;
                    }
                }
                x += 1;
            }
            y += 1;
        }
        this.updateShape(shape);
    }
    move(side) {
        if (!this.enableMove) {
            return false;
        }
        let moveX = this.getCell();
        let moveY = this.getRow();
        if (side === 'right') {
            moveX = this.getCell() + 1;
        }
        if (side === 'left') {
            moveX = this.getCell() - 1;
        }
        if (side === 'down') {
            moveY = this.getRow() + 1;
        }
        let x;
        let y = moveY;
        let barrierType = null;
        let barrier;
        labelStop: for (let row of this.getShape()) {
            x = moveX;
            for (let puzzle of row) {
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
                    // todo
                    this.scene.getWrapFigure().getPuzzles().forEach(p => p.remove());
                }
                else {
                    this.enableMove = false;
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
    }
}
class InteractiveFigureI extends InteractiveFigure {
    initShape() {
        return [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
        ];
    }
}
class InteractiveFigureO extends InteractiveFigure {
    initShape() {
        return [
            [1, 1],
            [1, 1]
        ];
    }
}
class InteractiveFigureT extends InteractiveFigure {
    initShape() {
        return [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];
    }
}
class InteractiveFigureS extends InteractiveFigure {
    initShape() {
        return [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ];
    }
}
class InteractiveFigureZ extends InteractiveFigure {
    initShape() {
        return [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ];
    }
}
class InteractiveFigureJ extends InteractiveFigure {
    initShape() {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ];
    }
}
class InteractiveFigureL extends InteractiveFigure {
    initShape() {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ];
    }
}
class InteractiveFigureDot extends InteractiveFigure {
    initShape() {
        return [
            [1]
        ];
    }
}
class InteractiveFigureISmall extends InteractiveFigure {
    initShape() {
        return [
            [1, 0],
            [1, 0],
        ];
    }
}
class InteractiveFigureIMiddle extends InteractiveFigure {
    initShape() {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ];
    }
}
class InteractiveFigureILSmall extends InteractiveFigure {
    initShape() {
        return [
            [1, 0],
            [1, 1],
        ];
    }
}
// LeftWind -- move all to right
// RightWind  -- move all to left
// TopWind -- move all to down
//
// Lava -- remove all under figure
//
// Bomb -- remove coming
// Dagger -- remove line
// TopCleaner -- remove all top
// LeftCleaner -- remove all left
// RightCleaner -- remove all right
//
// Thief -- remove random count
// Rain -- add random count
//
// Build -- replace all and paste building (circle, triangle, ...)
// Word -- replace all and paste random word
class ShadowFigure extends Figure {
    constructor() {
        super(...arguments);
        this.latestFigure = null;
        this.onUpdateShapeInteractiveFigure = (figure) => {
            if (this.latestFigure !== figure) {
                this.getPuzzles().forEach(p => p.remove());
                this.latestFigure = figure;
                this.shape = this.initShape();
                this.insertPuzzles(this.scene.generatePuzzles(this.getCountPuzzlePlaces(), ShadowPuzzle));
            }
            else {
                let puzzles = this.getPuzzles();
                this.shape = this.initShape();
                this.insertPuzzles(puzzles);
            }
        };
    }
    initShape() {
        if (!this.latestFigure) {
            return [];
        }
        let shape = [];
        for (let row of this.latestFigure.getShape()) {
            let sRow = [];
            for (let cell of row) {
                sRow.push(typeof cell !== "number" ? 1 : 0);
            }
            shape.push(sRow);
        }
        return shape;
    }
    getCell() {
        return this.latestFigure.getCell();
    }
    getRow() {
        let barrier = null;
        let yIndex = this.latestFigure.getRow();
        labelStop: while (yIndex <= this.getScene().rows) {
            yIndex++;
            let y = yIndex;
            let x;
            for (let row of this.getShape()) {
                x = this.latestFigure.getCell();
                for (let puzzle of row) {
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
        this.getPuzzles().forEach(puzzle => {
            if (puzzle instanceof ShadowPuzzle) {
                puzzle.setAlpha(0.3 / yIndex * (yIndex - this.latestFigure.getRow()));
            }
        });
        return yIndex;
    }
}
class WrapFigure extends Figure {
    initShape() {
        let rows = this.getScene().rows - 2;
        let cols = this.getScene().cols - 2;
        let shape = [];
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < cols; c++) {
                row.push(0);
            }
            shape.push(row);
        }
        return shape;
    }
    getCell() {
        return 1;
    }
    getRow() {
        return 1;
    }
    updateShape(shape) {
        let fillRows = [];
        for (let row of shape) {
            for (let cell of row) {
                if (typeof cell !== "number") {
                    fillRows.push(row);
                    break;
                }
            }
        }
        let rows = this.getScene().rows - 2;
        let cols = this.getScene().cols - 2;
        let newShape = [];
        for (let r = 0; r < rows; r++) {
            if ((shape.length - fillRows.length) > r) {
                let row = [];
                for (let c = 0; c < cols; c++) {
                    row.push(0);
                }
                newShape.push(row);
            }
            else {
                newShape.push(fillRows[r - (shape.length - fillRows.length)]);
            }
        }
        super.updateShape(newShape);
    }
    impact(figure) {
        let x;
        let y = figure.getRow();
        let shape = this.getShape();
        for (let row of figure.getShape()) {
            x = figure.getCell();
            for (let puzzle of row) {
                if (typeof puzzle !== "number") {
                    puzzle.setFigure(this);
                    shape[y - 1][x - 1] = puzzle;
                }
                x += 1;
            }
            y += 1;
        }
        let removeList = [];
        for (let row of shape) {
            let countFill = 0;
            for (let cell of row) {
                if (typeof cell !== "number") {
                    countFill++;
                }
                if (countFill === row.length) {
                    removeList = removeList.concat(row);
                }
            }
        }
        let promises = removeList.map(p => {
            return p.createAnimation(ScalePuzzleAnimation, { x: 0, y: 0, alpha: 0 });
        });
        Promise.all(promises).then(() => {
            removeList.map(p => p.remove());
            this.updateShape(shape);
            this.getScene().initInteractiveFigure();
        });
    }
}
class Puzzle {
    constructor() {
        this.x = null;
        this.y = null;
        this.futureX = null;
        this.futureY = null;
        this.stepX = null;
        this.stepY = null;
        this.animationTime = 300;
        this.cell = 5; //  todo!!!!!
        this.row = 5; //  todo!!!!!
        this.activeAnimationList = [];
    }
    getCell() {
        return this.cell;
    }
    getRow() {
        return this.row;
    }
    getFigure() {
        return this.figure;
    }
    setFigure(figure) {
        this.figure = figure;
    }
    createAnimation(animationType, params) {
        let animationFilter = this.activeAnimationList.filter(a => a instanceof animationType);
        if (animationFilter.length) {
            return animationFilter[0].run(params);
        }
        else {
            let animation = new animationType(this);
            this.activeAnimationList.push(animation);
            return animation.run(params);
        }
    }
    deactivateAnimation(animation) {
        let index = this.activeAnimationList.indexOf(animation);
        if (index !== -1) {
            this.activeAnimationList.splice(index, 1);
        }
    }
    remove() {
        let shape = this.figure.getShape();
        let x;
        let y = 0;
        for (let row of shape) {
            x = 0;
            for (let cell of row) {
                if (cell === this) {
                    shape[y][x] = 0;
                }
                x++;
            }
            y++;
        }
        this.clearGraphics();
        this.activeAnimationList = [];
        this.figure.updateShape(shape);
    }
    setPosition(x, y) {
        this.cell = x;
        this.row = y;
    }
    clearGraphics() {
        if (this.graphics) {
            this.getFigure().getScene().getApp().stage.removeChild(this.graphics);
            this.graphics = null;
        }
    }
    initGraphics() {
        let width = this.figure.getScene().puzzleSize - 1;
        let height = this.figure.getScene().puzzleSize - 1;
        let app = this.figure.getScene().getApp();
        this.graphics = new PIXI.Graphics();
        this.graphics.lineStyle(0);
        this.graphics.beginFill(this.getColor(), 1);
        this.graphics.drawRoundedRect(0, 0, width, height, Math.floor(width * 0.30));
        this.graphics.endFill();
        this.graphics.pivot.set(width / 2, height / 2);
        // let text = new PIXI.Text(
        //     '1',
        //     {
        //         fontFamily : 'monospace',
        //         fontSize: this.getFigure().getScene().puzzleSize / 2,
        //         lineHeight: this.getFigure().getScene().puzzleSize / 2,
        //         fill : 0x393e46,
        //         align : 'center'
        //     });
        //
        // text.anchor.x =0.5;
        // text.anchor.y =0.5;
        // text.y = this.getFigure().getScene().puzzleSize / 2;
        // text.x = this.getFigure().getScene().puzzleSize / 2;
        // this.graphics.addChild(text);
        app.stage.addChild(this.graphics);
        return this.graphics;
    }
    getGraphics() {
        if (!this.graphics) {
            this.initGraphics();
        }
        return this.graphics;
    }
    render() {
        let x = this.cell * this.figure.getScene().puzzleSize + this.figure.getScene().puzzleSize / 2;
        let y = this.row * this.figure.getScene().puzzleSize + this.figure.getScene().puzzleSize / 2;
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
            let diff = new Date().getTime() - this.renderStartDate.getTime();
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
        let graphics = this.getGraphics();
        graphics.position.x = this.x;
        graphics.position.y = this.y;
        this.activeAnimationList.forEach(a => a.animate());
    }
}
class BorderPuzzle extends Puzzle {
    getColor() {
        return 0x393e46;
    }
}
class ShadowPuzzle extends Puzzle {
    getColor() {
        return 0x00adb5;
    }
    initGraphics() {
        let g = super.initGraphics();
        g.alpha = 0;
        return g;
    }
    setAlpha(alpha) {
        if (this.graphics) {
            this.graphics.alpha = alpha;
        }
    }
}
class SimplePuzzle extends Puzzle {
    getColor() {
        return 0x00adb5;
    }
}
class PuzzleAnimation {
    constructor(puzzle) {
        this.params = null;
        this.puzzle = puzzle;
    }
    getParams() {
        return this.params;
    }
    run(params = null) {
        this.params = params;
        this.startTime = new Date();
        return new Promise((resolve) => {
            this.onStart();
            setTimeout(() => {
                resolve(this);
            }, this.getDuration());
        }).then(() => {
            this.onEnd();
            this.getPuzzle().deactivateAnimation(this);
        });
    }
    getProgress() {
        return this.getDiff() / this.getDuration();
    }
    getDiff() {
        return ((new Date()).getTime() - this.startTime.getTime());
    }
    getDuration() {
        return 300;
    }
    getPuzzle() {
        return this.puzzle;
    }
}
///<reference path="basic.puzzle.animation.ts"/>
class AlphaPuzzleAnimation extends PuzzleAnimation {
    onStart() {
        this.startAlpha = this.getPuzzle().getGraphics().alpha;
    }
    onEnd() {
        this.getPuzzle().getGraphics().alpha = this.getParams();
    }
    animate() {
        this.getPuzzle().getGraphics().alpha = this.startAlpha + ((this.getParams() - this.startAlpha) * this.getProgress());
    }
}
///<reference path="basic.puzzle.animation.ts"/>
class ScalePuzzleAnimation extends PuzzleAnimation {
    onStart() {
        this.startX = this.getPuzzle().getGraphics().scale.x;
        this.startY = this.getPuzzle().getGraphics().scale.y;
        this.startAlpha = this.getPuzzle().getGraphics().alpha;
    }
    onEnd() {
        this.getPuzzle().getGraphics().scale.x = this.getParams().x;
        this.getPuzzle().getGraphics().scale.y = this.getParams().y;
        this.getPuzzle().getGraphics().alpha = this.getParams().alpha;
    }
    animate() {
        this.getPuzzle().getGraphics().scale.x = this.startX + ((this.getParams().x - this.startX) * this.getProgress());
        this.getPuzzle().getGraphics().scale.y = this.startY + ((this.getParams().y - this.startY) * this.getProgress());
        this.getPuzzle().getGraphics().alpha = this.startAlpha + ((this.getParams().alpha - this.startAlpha) * this.getProgress());
    }
}

//# sourceMappingURL=assets_typescript.js.map
