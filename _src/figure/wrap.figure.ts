class WrapFigure extends Figure {
    protected cell = 1;
    protected row = 1;
    initShape(): number[][] {
        let rows = config.rows - 2;
        let cols = config.cols - 2;
        let shape = [];
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < cols; c++) {
                 row.push(0)
            }
            shape.push(row)
        }
        return shape;
    }


    updateShape(shape: Array<number | IPuzzle>[]): void {
        let fillRows = [];
        for (let row of shape) {
            for (let cell of row) {
                if (typeof cell !== "number") {
                    fillRows.push(row);
                    break;
                }
            }
        }

        let rows = config.rows - 2;
        let cols = config.cols - 2;
        let newShape = [];
        for (let r = 0; r < rows; r++) {
            if ((shape.length - fillRows.length) > r) {
                let row = [];
                for (let c = 0; c < cols; c++) {
                    row.push(0)
                }
                newShape.push(row)
            } else {
                newShape.push(fillRows[r - (shape.length - fillRows.length)])
            }

        }

        super.updateShape(newShape);
    }

    impact(figure: IFigure) {
        let x;
        let y = figure.getRow();
        let shape = this.getShape();
        for (let row of figure.getShape()) {
            x = figure.getCell();
            for (let puzzle of row) {
                if (typeof puzzle !== "number") {
                    puzzle.setFigure(this);
                    shape[y - 1][x - 1] = puzzle;
                }
                x += 1;
            }
            y += 1;
        }

        for (let row of shape) {
            let countFill = 0;
            for (let cell of row) {
                if (typeof cell !== "number") {
                    countFill++;
                }
                if (countFill === row.length) {
                    for (let cell of row) {
                        if (typeof cell !== "number") {
                            cell.remove();
                        }
                    }
                }
            }

        }

        this.updateShape(shape);


        config.scene.initInteractiveFigure();
    }
}