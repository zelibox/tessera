interface IPuzzle {
    render(x, y)
    setCtx(ctx: CanvasRenderingContext2D)
}

abstract class Puzzle implements IPuzzle {
    protected width = 18;
    protected height = 18;
    public color = "#fbcf9d";

    public x = null;
    public y = null;
    public futureX = null;
    public futureY = null;
    public stepX = null;
    public stepY = null;
    public countStep = 15;
    public currentStep = 0;
    private ctx: CanvasRenderingContext2D;

    setCtx(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
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
        // this.ctx.shadowColor = '#fbcf9d';
        // this.ctx.shadowBlur = 2;
        this.ctx.fill();
        this.ctx.closePath();
        return this.ctx;
    }
}

class SimplePuzzle extends Puzzle {

}

class BorderPuzzle extends Puzzle{
    color = '#111b44'
}

interface IFigure {

}

abstract class Figure implements IFigure {
    private puzzles: IPuzzle[];
    private shape: Array<number | IPuzzle>[] = null;
    private x = 0;
    private y = 0;

    constructor(protected ctx:CanvasRenderingContext2D) {
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

class TriangleFigure extends Figure {
    tickCount = 0;
    render(): void {
        this.tickCount++;
        if ((this.tickCount % 30) === 0) {
            this.move("down")
        }
        super.render();
    }

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

class BorderFigure extends Figure {
    initShape(): number[][] {
        let rows = 22;
        let cols = 12;
        let shape = [];
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < cols; c++) {
                let v = 0;
                if (r === 0 || r === (rows - 1) || c === 0 || c === (cols - 1)) {
                    v = 1
                }
                row.push(v)
            }
            shape.push(row)
        }
        return shape;
    }
}

function generatePuzzles(count, type){
    let arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(new type())
        console.log(count)
    }

    return arr;
}

$(() => {
    let canvasElement = <HTMLCanvasElement>document.getElementById('wrap');

    let ctx = canvasElement.getContext('2d');

    let f = new TriangleFigure(ctx);
    f.insertPuzzles(generatePuzzles(f.getCountPuzzlePlaces(), SimplePuzzle));
    f.move('right');
    f.move('right');
    f.move('right');
    f.move('right');
    f.move('down');


    let w = new BorderFigure(ctx);
    w.insertPuzzles(generatePuzzles(w.getCountPuzzlePlaces(), BorderPuzzle));


    $("body").on('keydown', function (e) {
        if (e.keyCode == 37) { // left
            f.move('left')
        }
        else if (e.keyCode == 39) { // right
            f.move('right')
        }
        else if (e.keyCode == 38) { // up
            f.rotate('right')
        }
        else if (e.keyCode == 40) { // down
            f.move('down')
        }
    });

    // f.flipMatrix();

    function draw() {
        ctx.clearRect(0, 0, 240, 440);
        f.render();
        w.render();
        requestAnimationFrame(draw);
    }

    draw();


});