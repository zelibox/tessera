class Scene {
    public puzzleSize = 20;
    public rows = 22;
    public cols = 12;
    private interactiveFigure: InteractiveFigure;
    private borderFigure: BorderFigure;
    private wrapFigure: WrapFigure;
    private shadowFigure: ShadowFigure;
    private pause: boolean = false;

    constructor(private app: PIXI.Application) {
        this.wrapFigure = new WrapFigure(this);

        this.borderFigure = new BorderFigure(this);
        this.borderFigure.insertPuzzles(
            this.generatePuzzles(this.borderFigure.getCountPuzzlePlaces(), BorderPuzzle)
        );
        this.shadowFigure = new ShadowFigure(this);


        this.initInteractiveFigure();
    }

    getApp(): PIXI.Application {
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
        this.interactiveFigure.insertPuzzles(
            this.generatePuzzles(this.interactiveFigure.getCountPuzzlePlaces(), SimplePuzzle)
        );
        this.interactiveFigure.onUpdateShape(this.shadowFigure.onUpdateShapeInteractiveFigure)
    }

    public getInteractiveFigure() {
        return this.interactiveFigure;
    }

    public getBorderFigure() {
        return this.borderFigure;
    }

    public getWrapFigure() {
        return this.wrapFigure;
    }

    public getShadowFigure() {
        return this.shadowFigure;
    }

    getPuzzle(cell, row): IPuzzle {
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

    getAllPuzzles(): IPuzzle[] {
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

    setPause(pause:boolean){
        this.pause = pause;
    }
}
