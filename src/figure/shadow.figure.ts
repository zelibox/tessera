class ShadowFigure extends Figure {
    onUpdateShapeInteractiveFigure = (figure:InteractiveFigure) => {
        let row = this.getScene().rows;
        figure.getPuzzles().forEach( p => {
            for (let r = 1; r < this.getScene().rows; r++) {
                let puzzle = this.getScene().getPuzzle(p.getCell(), r);
                if (puzzle && puzzle.getRow() < row) {
                    row = puzzle.getRow();
                }
            }
        });

        this.getPuzzles().forEach(p => {
            p.remove();
        });

        let shape = this.initShape();
        row -= 2;

        figure.getPuzzles().forEach((p) => {
            shape[row][p.getCell() - 1] = 1;
        });

        this.shape =  shape;
        this.insertPuzzles(this.scene.generatePuzzles(this.getCountPuzzlePlaces(), BorderPuzzle));
        console.log(row);
    };
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
}