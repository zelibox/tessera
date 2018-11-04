$(function () {
    let points = 100500;
    $('.points').append('<span class="d p-1"></span>');
    $('.points').append('<span class="d p-2"></span>');
    $('.points').append('<span class="d p-3"></span>');
    $('.points').append('<span class="d p-4"></span>');
    $('.points').append('<span class="d p-5"></span>');
    $('.points').append('<span class="d p-6"></span>');
    $('.points').append('<span class="d p-7"></span>');
    $('.points').append('<span class="d p-8"></span>');
    $('.points').append('<span class="d p-9"></span>');
    $('.points').append('<span class="d p-0"></span>');
    const app = new PIXI.Application({
        autoResize: true,
        resolution: devicePixelRatio,
        transparent: true,
        antialias: true,
    });
    app.stage.interactive = true;
    const scene = new Scene(app);
    let loader = PIXI.loader;
    loader.add(scene.getAllAssets());
    loader.load();
    loader.on('progress', () => {
        // todo
        console.log(loader.progress);
    });
    loader.on('complete', () => {
        $('.wrap').append(app.view);
        window.addEventListener('resize', resize);
        function resize() {
            let puzzleSize = window.innerWidth / scene.cols;
            let toolbarHeight = $('.toolbar').height() + $('.footer').height();
            if ((puzzleSize * scene.rows) > (window.innerHeight - toolbarHeight)) {
                puzzleSize = (window.innerHeight - toolbarHeight) / scene.rows;
            }
            scene.puzzleSize = puzzleSize;
            // for (var i = app.stage.children.length - 1; i >= 0; i--) {	app.stage.removeChild(app.stage.children[i]);};
            scene.getAllPuzzles().forEach(p => p.clearGraphics());
            app.stage.removeChildren();
            app.renderer.resize(puzzleSize * scene.cols, puzzleSize * scene.rows);
        }
        setInterval(resize, 60000);
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
});
class Scene {
    constructor(app) {
        this.app = app;
        this.puzzleSize = 20;
        this.rows = 22;
        this.cols = 12;
        this.pause = false;
        this.customFigures = [];
        this.assets = {
            simplePuzzle: {
                blue: 'assets/puzzle/simple/blue.png',
                green: 'assets/puzzle/simple/green.png',
                red: 'assets/puzzle/simple/red.png',
                yellow: 'assets/puzzle/simple/yellow.png',
            },
            borderPuzzle: {
                left: 'assets/puzzle/border/left.png',
                mid: 'assets/puzzle/border/mid.png',
                right: 'assets/puzzle/border/right.png',
            },
            magicPuzzle: {
                rain: 'assets/puzzle/magic/rain.png',
                thief1: 'assets/puzzle/magic/thief1.png',
                thief2: 'assets/puzzle/magic/thief2.png',
            },
            shadowPuzzle: {
                shadow: 'assets/puzzle/shadow/shadow.png',
            }
        };
        this.wrapFigure = new WrapFigure(this);
        this.borderFigure = new BorderFigure(this);
        this.borderFigure.insertPuzzles(this.generatePuzzles(this.borderFigure.getCountPuzzlePlaces(), BorderPuzzle));
        this.shadowFigure = new ShadowFigure(this);
        this.initInteractiveFigure();
    }
    getApp() {
        return this.app;
    }
    getAllAssets() {
        let assets = [];
        for (let assetType in this.assets) {
            for (let assetTypeKey in this.assets[assetType]) {
                if (this.assets[assetType].hasOwnProperty(assetTypeKey)) {
                    assets.push(this.assets[assetType][assetTypeKey]);
                }
            }
        }
        return assets;
    }
    initInteractiveFigure() {
        let random = (Math.floor(Math.random() * (15 - 1 + 1)) + 1);
        if (random == 11) {
            this.interactiveFigure = new ThiefMagicFigure(this);
        }
        else if (random == 12) {
            this.interactiveFigure = new RainMagicFigure(this);
        }
        else {
            let figures = [
                InteractiveFigureDot,
                InteractiveFigureI,
                InteractiveFigureO,
                InteractiveFigureT,
                InteractiveFigureS,
                InteractiveFigureZ,
                InteractiveFigureJ,
                InteractiveFigureL,
                InteractiveFigureISmall,
                InteractiveFigureILSmall,
                InteractiveFigureIMiddle,
            ];
            this.interactiveFigure = new figures[Math.floor(Math.random() * figures.length)](this);
        }
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
        let figures = this.customFigures.concat([
            this.borderFigure,
            this.wrapFigure
        ]);
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
        let figures = this.customFigures.concat([
            this.shadowFigure,
            this.interactiveFigure,
            this.borderFigure,
            this.wrapFigure
        ]);
        for (let figure of figures) {
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
    addCustomFigure(figure) {
        this.customFigures.push(figure);
    }
    removeCustomFigure(figure) {
        this.customFigures.splice(this.customFigures.indexOf(figure), 1);
    }
    render() {
        if (this.pause) {
            return;
        }
        let figures = this.customFigures.concat([
            this.shadowFigure,
            this.interactiveFigure,
            this.borderFigure,
            this.wrapFigure
        ]);
        for (let figure of figures) {
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
    onImpact() {
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
    constructor(scene) {
        super(scene);
        this.renderStartDate = null;
        this.cell = null;
        this.row = null;
        this.enableMove = true;
    }
    onImpact() {
        this.updateShape([]);
        this.getScene().initInteractiveFigure();
    }
    getSpeed() {
        return 500;
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
        if (((new Date().getTime() - this.renderStartDate.getTime()) >= this.getSpeed())) {
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
class SimpleFigure extends InteractiveFigure {
    constructor(scene) {
        super(scene);
        let arr = [];
        let count = this.getCountPuzzlePlaces();
        let puzzleTypes = [
            SimpleGreenPuzzle,
            SimpleBluePuzzle,
            SimpleRedPuzzle,
            SimpleYellowPuzzle,
        ];
        let puzzleType = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
        for (let i = 0; i < count; i++) {
            arr.push(new puzzleType());
        }
        this.insertPuzzles(arr);
    }
}
class InteractiveFigureI extends SimpleFigure {
    initShape() {
        return [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
        ];
    }
}
class InteractiveFigureO extends SimpleFigure {
    initShape() {
        return [
            [1, 1],
            [1, 1]
        ];
    }
}
class InteractiveFigureT extends SimpleFigure {
    initShape() {
        return [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];
    }
}
class InteractiveFigureS extends SimpleFigure {
    initShape() {
        return [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ];
    }
}
class InteractiveFigureZ extends SimpleFigure {
    initShape() {
        return [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ];
    }
}
class InteractiveFigureJ extends SimpleFigure {
    initShape() {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ];
    }
}
class InteractiveFigureL extends SimpleFigure {
    initShape() {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ];
    }
}
class InteractiveFigureDot extends SimpleFigure {
    initShape() {
        return [
            [1]
        ];
    }
}
class InteractiveFigureISmall extends SimpleFigure {
    initShape() {
        return [
            [1, 0],
            [1, 0],
        ];
    }
}
class InteractiveFigureIMiddle extends SimpleFigure {
    initShape() {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ];
    }
}
class InteractiveFigureILSmall extends SimpleFigure {
    initShape() {
        return [
            [1, 0],
            [1, 1],
        ];
    }
}
class RainMagicFigure extends InteractiveFigure {
    constructor(scene) {
        super(scene);
        this.insertPuzzles([new RainMagicPuzzle()]);
    }
    initShape() {
        return [
            [1],
        ];
    }
}
class ThiefMagicFigure extends InteractiveFigure {
    constructor(scene) {
        super(scene);
        this.insertPuzzles([new ThiefMagicPuzzle()]);
    }
    initShape() {
        return [
            [1],
        ];
    }
    onImpact() {
        if (this.getPuzzles().length) {
            let puzzle = this.getPuzzles()[0];
            if (puzzle instanceof ThiefMagicPuzzle) {
                puzzle.setClassicGraphic();
            }
        }
        super.onImpact();
    }
    move(side) {
        let r = super.move(side);
        if (side === 'down' && r) {
            let puzzles = this.getScene().getWrapFigure().getPuzzles();
            if (puzzles.length) {
                let puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
                puzzle.createAnimation(ScalePuzzleAnimation, { x: 0, y: 0, alpha: 0 }).then(() => {
                    puzzle.remove();
                });
            }
        }
        return r;
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
                puzzle.setAlpha(0.6 / yIndex * (yIndex - this.latestFigure.getRow()));
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
                    if (shape[y - 1][x - 1]) {
                        puzzle.remove();
                    }
                    else {
                        puzzle.setFigure(this);
                        shape[y - 1][x - 1] = puzzle;
                    }
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
            figure.onImpact();
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
        let graphics = PIXI.Sprite.fromImage(this.getTile());
        graphics.width = width;
        graphics.height = height;
        graphics.anchor.set(0.5);
        this.graphics = graphics;
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
    getTile() {
        let tile = '';
        let sceneAssets = this.getFigure().getScene().assets.borderPuzzle;
        if (this.getRow() == 21 && this.getCell() == 1) {
            tile = sceneAssets.left;
        }
        else if (this.getRow() == 21 && this.getCell() == 10) {
            tile = sceneAssets.right;
        }
        else if (this.getRow() == 21 && this.getCell() > 1 && this.getCell() < 10) {
            tile = sceneAssets.mid;
        }
        return tile;
    }
    initGraphics() {
        let width = this.getFigure().getScene().puzzleSize;
        let height = this.getFigure().getScene().puzzleSize - 1;
        let app = this.getFigure().getScene().getApp();
        let graphics = PIXI.Sprite.fromImage(this.getTile());
        graphics.width = width;
        graphics.height = height;
        graphics.anchor.set(0.5);
        this.graphics = graphics;
        app.stage.addChild(this.graphics);
        return this.graphics;
    }
}
class ShadowPuzzle extends Puzzle {
    getTile() {
        return this.getFigure().getScene().assets.shadowPuzzle.shadow;
    }
    setAlpha(alpha) {
        if (this.graphics) {
            this.graphics.alpha = alpha;
        }
    }
    initGraphics() {
        let graphics = super.initGraphics();
        graphics.alpha = 0;
        // todo if not set 0 => bug render
        return graphics;
    }
}
class SimpleGreenPuzzle extends Puzzle {
    getTile() {
        return this.getFigure().getScene().assets.simplePuzzle.green;
    }
}
class SimpleBluePuzzle extends Puzzle {
    getTile() {
        return this.getFigure().getScene().assets.simplePuzzle.blue;
    }
}
class SimpleRedPuzzle extends Puzzle {
    getTile() {
        return this.getFigure().getScene().assets.simplePuzzle.red;
    }
}
class SimpleYellowPuzzle extends Puzzle {
    getTile() {
        return this.getFigure().getScene().assets.simplePuzzle.yellow;
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
class RainItemFigureMagicPuzzle extends InteractiveFigureDot {
    onImpact() {
        this.getScene().removeCustomFigure(this);
        this.updateShape([]);
    }
    getSpeed() {
        return 150;
    }
}
class RainItemPuzzle extends Puzzle {
    getTile() {
        if (!this.classicTile) {
            let keys = Object.keys(this.getFigure().getScene().assets.simplePuzzle);
            this.classicTile = this.getFigure().getScene().assets.simplePuzzle[keys[Math.floor(Math.random() * keys.length)]];
        }
        return this.classicTile;
    }
}
class RainMagicPuzzle extends Puzzle {
    constructor() {
        super(...arguments);
        this.animationTime = 2000;
    }
    getTile() {
        return this.getFigure().getScene().assets.magicPuzzle.rain;
    }
    remove() {
        for (let r = 1; r <= Math.floor(this.getFigure().getScene().rows / 3); r++) {
            let cell = (Math.floor(Math.random() * ((this.getFigure().getScene().cols - 2) - 1 + 1)) + 1);
            let block = this.getFigure().getScene().getPuzzle(cell, r);
            if (!block) {
                let figure = new RainItemFigureMagicPuzzle(this.getFigure().getScene());
                figure.cell = cell;
                figure.row = r;
                figure.insertPuzzles([new RainItemPuzzle()]);
                this.getFigure().getScene().addCustomFigure(figure);
            }
        }
        super.remove();
    }
}
class ThiefMagicPuzzle extends Puzzle {
    constructor() {
        super(...arguments);
        this.classicMode = false;
        this.classicTile = null;
    }
    getTile() {
        if (!this.classicTile) {
            let keys = Object.keys(this.getFigure().getScene().assets.simplePuzzle);
            this.classicTile = this.getFigure().getScene().assets.simplePuzzle[keys[Math.floor(Math.random() * keys.length)]];
        }
        return this.classicTile;
    }
    initGraphics() {
        if (this.classicMode) {
            return super.initGraphics();
        }
        let width = this.getFigure().getScene().puzzleSize - 1;
        let height = this.getFigure().getScene().puzzleSize - 1;
        let app = this.getFigure().getScene().getApp();
        let t1 = PIXI.Texture.fromImage(this.getFigure().getScene().assets.magicPuzzle.thief1);
        let t2 = PIXI.Texture.fromImage(this.getFigure().getScene().assets.magicPuzzle.thief2);
        let sprite = new PIXI.extras.AnimatedSprite([
            t1,
            t2,
        ], true);
        sprite.width = width;
        sprite.height = height;
        sprite.anchor.set(0.5);
        sprite.animationSpeed = 0.1;
        sprite.play();
        this.graphics = sprite;
        app.stage.addChild(sprite);
        return sprite;
    }
    setClassicGraphic() {
        if (this.graphics) {
            this.classicMode = true;
            this.clearGraphics();
            this.initGraphics();
        }
    }
}

//# sourceMappingURL=assets_typescript.js.map
