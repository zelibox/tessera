///<reference path="basic.figure.ts"/>
abstract class InteractiveFigure extends Figure {
    private renderStartDate: Date = null;
    protected cell = null;
    protected row = null;
    private enableMove = true;

    onImpact(): void {
        this.getScene().initInteractiveFigure();
    }

    getSpeed() {
        return 500;
    }

    constructor(scene: Scene) {
        super(scene);
    }

    getCell(): number {
        if (this.cell === null) {
            this.cell = Math.floor((this.getScene().cols / 2) - (this.getShape()[0].length / 2))
        }

        return this.cell;
    }

    getRow(): number {
        if (this.row === null) {
            this.row = 1;
        }

        return this.row;
    }

    render(): void {
        if (!this.renderStartDate) {
            this.renderStartDate = new Date();
        }
        if (((new Date().getTime() - this.renderStartDate.getTime()) >= this.getSpeed())) {
            this.renderStartDate = new Date();
            this.move("down")
        }
        super.render();
    }

    rotate(side: 'left' | 'right') {
        if (!this.enableMove) {
            return;
        }
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

    move(side: 'left' | 'right' | 'down'): boolean {
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
        labelStop:
            for (let row of this.getShape()) {
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
                } else {
                    this.enableMove = false;
                    barrier.getFigure().impact(this);
                }
            }
            return false;
        } else {
            this.cell = moveX;
            this.row = moveY;
            this.updateShape(this.getShape());
            return true;
        }
    }
}

class InteractiveFigureI extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
        ];
    }
}

class InteractiveFigureO extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [1, 1],
            [1, 1]
        ];
    }
}

class InteractiveFigureT extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];
    }
}

class InteractiveFigureS extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ];
    }
}

class InteractiveFigureZ extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ];
    }
}

class InteractiveFigureJ extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ];
    }
}

class InteractiveFigureL extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ];
    }
}

class InteractiveFigureDot extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [1]
        ];
    }
}

class InteractiveFigureISmall extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [1, 0],
            [1, 0],
        ];
    }
}

class InteractiveFigureIMiddle extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ];
    }
}

class InteractiveFigureILSmall extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [1, 0],
            [1, 1],
        ];
    }
}
