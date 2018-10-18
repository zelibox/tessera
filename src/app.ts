interface IPuzzle {
    render(x, y)
}

abstract class Puzzle implements IPuzzle {
    protected width = 20;
    protected height = 20;
    public color = "#fbcf9d";

    public x = null;
    public y = null;
    public futureX = null;
    public futureY = null;
    public stepX = null;
    public stepY = null;
    public countStep = 10;
    public currentStep = 0;

    constructor(protected ctx: CanvasRenderingContext2D) {
    }


    render(x, y) {
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
            // this.x = this.futureX;
            // this.y = this.futureY;
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
        this.ctx.shadowColor = '#fbcf9d';
        this.ctx.shadowBlur = 2;
        this.ctx.fill();
        this.ctx.closePath();
        return this.ctx;
    }
}

class SimplePuzzle extends Puzzle {

}


interface IFigure {

}

abstract class Figure {
    private puzzles: IPuzzle[];
    private shape: Array<number | IPuzzle>[] = null;
    private x = 0;
    private y = 0;


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
                x += 22;
            }
            y += 22;
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
        if (side === 'right') {
            this.x += 20;
        }
        if (side === 'left') {
            this.x -= 20;
        }
        if (side === 'down') {
            this.x -= 20;
        }
    }

}

class TriangleFigure extends Figure {
    initShape(): number[][] {
        return [
            // [0, 1, 0],
            // [1, 1, 1],
            // [0, 0, 0],
            //
            // [1, 1],
            // [1, 1],
            //
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ];
    }
}


$(() => {
    let canvasElement = <HTMLCanvasElement>document.getElementById('wrap');

    let ctx = canvasElement.getContext('2d');

    let f = new TriangleFigure();

    let r = new SimplePuzzle(ctx);
    r.color = '#ff0000';
    f.insertPuzzles([
        r,
        new SimplePuzzle(ctx),
        new SimplePuzzle(ctx),
        new SimplePuzzle(ctx),
    ]);

    $("body").on('keydown', function (e) {
        if (e.keyCode == 37) { // left
            f.move('left')
        }
        else if (e.keyCode == 39) { // right
            f.move('right')
        }
        else if (e.keyCode == 32) { // space
            f.move('down')
        }
        else if (e.keyCode == 38) { // up
            f.rotate('left')
        }
        else if (e.keyCode == 40) { // down
            f.rotate('right')
        }
    });

    // f.flipMatrix();

    function draw() {
        ctx.clearRect(0, 0, 300, 300);
        f.render();
        requestAnimationFrame(draw);
    }

    draw();


});