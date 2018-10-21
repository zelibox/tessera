///<reference path="basic.figure.ts"/>
abstract class InteractiveFigure extends Figure {
    protected row = 1;
    protected cell = Math.floor((config.cols / 2) - (this.getShape()[0].length / 2));

    private tickCount: number = 0;

    render(): void {
        this.tickCount++;
        if ((this.tickCount % 30) === 0) {
            this.move("down")
        }
        super.render();
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

        let x;
        let y = this.row;
        for (let row of shape) {
            x = this.cell;
            for (let puzzle of row) {
                if (typeof puzzle !== "number") {
                    let barrier = config.scene.getPuzzle(x, y);
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
        this.updateShape(this.getShape());

        let x;
        let y = moveY;
        let barrierType = null;
        let barrier;
        labelStop:
        for (let row of this.getShape()) {
            x = moveX;
            for (let puzzle of row) {
                if (typeof puzzle !== "number") {
                    barrier = config.scene.getPuzzle(x, y);
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
            if (barrierType ==='down') {
                barrier.getFigure().impact(this);
            }
            return;
        } else {
            this.cell = moveX;
            this.row = moveY;
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
