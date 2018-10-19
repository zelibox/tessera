abstract class Figure implements IFigure {
    private puzzles: IPuzzle[];
    private shape: Array<number | IPuzzle>[] = null;
    private x = 0;
    private y = 0;

    constructor(protected ctx: CanvasRenderingContext2D) {
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
        let y = this.y;
        for (let row of this.getShape()) {
            x = this.x;
            for (let place of row) {
                if (typeof place !== "number") {
                    place.render(x, y);
                }
                x += 20;
            }
            y += 20;
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
        let moveX = this.x;
        let moveY = this.y;
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
    }

    isCanMove(x, y) {
        if (x >= 0 && x <= 160) {
            return true;
        } else {
            return false;
        }
    }

}

interface IFigure {

}
