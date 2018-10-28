class WrapFigure extends Figure {
    initShape(): number[][] {
        let rows = this.getScene().rows - 2;
        let cols = this.getScene().cols - 2;
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

    getCell(): number {
        return 1;
    }

    getRow(): number {
        return 1;
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

        let rows = this.getScene().rows - 2;
        let cols = this.getScene().cols - 2;
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

        let removeList = [];
        for (let row of shape) {
            let countFill = 0;
            for (let cell of row) {
                if (typeof cell !== "number") {
                    countFill++;
                }
                if (countFill === row.length) {
                    removeList = removeList.concat(row);
                }
            }
        }
        let promises = removeList.map(p => {
            return p.createAnimation(BlurPuzzleAnimation,
                100
            );
        });
        // new Promise()
        console.log('impact');
        Promise.all(promises).then(() => {
            removeList.map(p => p.remove());
            this.updateShape(shape);
            this.getScene().initInteractiveFigure();
        });

    }
}