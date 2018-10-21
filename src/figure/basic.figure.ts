abstract class Figure implements IFigure {
    private shape: Array<number | IPuzzle>[] = null;
    protected cell = 0;
    protected row = 0;

    constructor(protected ctx: CanvasRenderingContext2D) {
    }

    impact(figure: IFigure) {
    }

    getCell(): number {
        return this.cell;
    }

    getRow(): number {
        return this.row;
    }

    getPuzzles() {
        let puzzles = [];
        for (let row of this.getShape()) {
            for (let puzzle of row) {
                if (typeof  puzzle !== "number") {
                    puzzles.push(puzzle);
                }
            }
        }

        return puzzles;
    }

    abstract initShape(): number[][];

    getShape(): Array<number | IPuzzle>[] {
        if (this.shape === null) {
            this.shape = this.initShape();
        }

        return this.shape;
    }

    updateShape(shape: Array<number | IPuzzle>[]) {
        this.shape = shape;
        let x;
        let y = this.row;
        for (let row of this.getShape()) {
            x = this.cell;
            for (let puzzle of row) {
                if (typeof puzzle !== "number") {
                    puzzle.setPosition(x, y);
                }
                x += 1;
            }
            y += 1;
        }
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

    insertPuzzles(puzzles: IPuzzle[]) {
        let shape = [];

        let index = 0;
        for (let row of this.getShape()) {
            let rowShape = [];
            for (let place of row) {
                if (place !== 0) {
                    rowShape.push(puzzles[index]);
                    puzzles[index].setCtx(this.ctx);
                    puzzles[index].setFigure(this);
                    index++;
                } else {
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

interface IFigure {
    getCell(): number;

    getRow(): number;

    getPuzzles(): IPuzzle[];

    impact(figure:IFigure);

    getShape(): Array<number | IPuzzle>[];

    updateShape(shape: Array<number | IPuzzle>[]);
}
