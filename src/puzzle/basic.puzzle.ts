interface IPuzzle {
    render(cell, row)

    setCtx(ctx: CanvasRenderingContext2D)

    getCell(): number;

    getRow(): number;

    setFigure(figure: IFigure)

    getFigure(): IFigure

    remove();

    setPosition(x: number, y: number): void;
}

abstract class Puzzle implements IPuzzle {
    public color = "#fbcf9d";

    public x = null;
    public y = null;
    public futureX = null;
    public futureY = null;
    public stepX = null;
    public stepY = null;
    public countStep = 8;
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

    setFigure(figure: IFigure) {
        this.figure = figure;
    }

    setCtx(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
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

        this.figure.updateShape(shape);
    }


    setPosition(x: number, y: number): void {
        this.cell = x;
        this.row = y;
    }

    render() {
        let width = config.puzzleSize - 1;
        let height = config.puzzleSize - 1;

        let x = this.cell * config.puzzleSize;
        let y = this.row * config.puzzleSize;
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
        if (width < 2 * r) r = width / 2;
        if (height < 2 * r) r = height / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + r, this.y);
        this.ctx.arcTo(this.x + width, this.y, this.x + width, this.y + height, r);
        this.ctx.arcTo(this.x + width, this.y + height, this.x, this.y + height, r);
        this.ctx.arcTo(this.x, this.y + height, this.x, this.y, r);
        this.ctx.arcTo(this.x, this.y, this.x + width, this.y, r);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
        return this.ctx;
    }
}


class SimplePuzzle extends Puzzle {

}

class BorderPuzzle extends Puzzle {
    color = '#111b44'
}
