interface IPuzzle {
    render(cell, row)

    setCtx(ctx: CanvasRenderingContext2D)

    getCell(): number;

    getRow(): number;

    setFigure(figure: IFigure)

    getFigure(): IFigure
}

abstract class Puzzle implements IPuzzle {
    protected width = config.puzzleSize - 1;
    protected height = config.puzzleSize - 1;
    public color = "#fbcf9d";

    public x = null;
    public y = null;
    public futureX = null;
    public futureY = null;
    public stepX = null;
    public stepY = null;
    public countStep = 10;
    public currentStep = 0;
    private ctx: CanvasRenderingContext2D;
    private cell: number = 5; //  todo!!!!!
    private row: number = 5; //  todo!!!!!
    private figure: IFigure;

    getCell() {
        return this.cell;
    }

    getRow() {
        return this.row;
    }

    getFigure(): IFigure {
        return this.figure;
    }

    setCtx(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    render(cell, row) {
        if  (this.color == '#f00') {
            console.log(cell, row)
        }
        // let barrierPuzzle = config.scene.getPuzzle(cell, row);
        // if (barrierPuzzle && (barrierPuzzle !== this) && (this.color == '#f00')) {
        //     console.log(barrierPuzzle);
        // }
        // console.log(config.scene.getPuzzle(cell, row));
        this.cell = cell;
        this.row = row;
        let x = cell * config.puzzleSize;
        let y = row * config.puzzleSize;
        if ((this.x === null) || (this.y === null)) {
            this.x = x;
            this.y = y;
            this.futureX = x;
            this.futureY = y;
            this.currentStep = 0;
        } else {
            if ((x !== this.futureX) || (y !== this.futureY)) {
                this.futureX = x;
                this.futureY = y;
                this.currentStep = 0;

                if (this.x > this.futureX) {
                    this.stepX = ((this.x - this.futureX) / this.countStep) * -1;
                } else {
                    this.stepX = ((this.futureX - this.x) / this.countStep);
                }
                if (this.y > this.futureY) {
                    this.stepY = ((this.y - this.futureY) / this.countStep) * -1;
                } else {
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
        let r = 2;
        if (this.width < 2 * r) r = this.width / 2;
        if (this.height < 2 * r) r = this.height / 2;
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
    }

    setFigure(figure: IFigure) {
        this.figure = figure;
    }
}


class SimplePuzzle extends Puzzle {

}

class BorderPuzzle extends Puzzle {
    color = '#111b44'
}