abstract class Figure implements IFigure {
    private puzzles: IPuzzle[];
    private shape: Array<number | IPuzzle>[] = null;
    private cell = 0;
    private row = 0;

    constructor(protected ctx: CanvasRenderingContext2D) {
    }

    getCell(): number {
        return this.cell;
    }

    getRow(): number {
        return this.row;
    }

    getPuzzles() {
        return this.puzzles;
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
        this.puzzles = puzzles;
    }

    render() {
        let x;
        let y = this.row;
        for (let row of this.getShape()) {
            x = this.cell;
            for (let place of row) {
                if (typeof place !== "number") {
                    place.render(x, y);
                }
                x += 1;
            }
            y += 1;
        }
    }

    rotate(side: 'left' | 'right') {
        const n = this.getShape().length - 1;
        let shape = this.getShape().map((row, i) => {
                row = row.map((val, j) => {
                    return this.getShape()[n - j][i]
                });
                if (side === 'left') {
                    row.reverse()
                }
                return row;
            }
        );
        if (side === 'left') {
            shape.reverse();
        }
        this.updateShape(shape);
    }

    move(side: 'left' | 'right' | 'down') {
        let moveX = this.cell;
        let moveY = this.row;
        if (side === 'right') {
            moveX = this.cell + 1;
        }
        if (side === 'left') {
            moveX = this.cell - 1;
        }
        if (side === 'down') {
            moveY = this.row + 1;
        }

        for (let puzzle of this.getPuzzles()) {
            let barrier = config.scene.getPuzzle(puzzle.getCell() + (this.cell - moveX), puzzle.getRow());
            if (barrier && barrier.getFigure() !== this) {
                console.log(barrier);
                return;
            }
        }

        this.cell = moveX;
        this.row = moveY;
    }


}

interface IFigure {
    getCell(): number;

    getRow(): number;

    getPuzzles(): IPuzzle[];
}
