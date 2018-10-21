///<reference path="figure/interactive.figure.ts"/>
///<reference path="figure/basic.figure.ts"/>
class Scene {
    private interactiveFigure: InteractiveFigure;
    private borderFigure: BorderFigure;
    private wrapFigure: WrapFigure;

    constructor(protected ctx: CanvasRenderingContext2D) {
        this.initInteractiveFigure();
        this.initBorderFigure();
        this.wrapFigure = new WrapFigure(ctx);
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
        ];
        this.interactiveFigure = new figures[Math.floor(Math.random() * figures.length)](this.ctx);
        this.interactiveFigure.insertPuzzles(
            this.generatePuzzles(this.interactiveFigure.getCountPuzzlePlaces(), SimplePuzzle)
        );
    }

    private initBorderFigure() {
        this.borderFigure = new BorderFigure(this.ctx);
        this.borderFigure.insertPuzzles(
            this.generatePuzzles(this.borderFigure.getCountPuzzlePlaces(), BorderPuzzle)
        );
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

    generatePuzzles(count, type) {
        let arr = [];
        for (let i = 0; i < count; i++) {
            arr.push(new type());
        }

        return arr;
    }

    render() {
        for (let figure of [this.interactiveFigure, this.borderFigure, this.wrapFigure]) {
            figure.render();
        }
    }
}
