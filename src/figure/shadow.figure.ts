class ShadowFigure extends Figure {
    private latestFigure: InteractiveFigure = null;
    onUpdateShapeInteractiveFigure = (figure: InteractiveFigure) => {
        if (this.latestFigure !== figure) {
            this.getPuzzles().forEach(p => p.remove());
            this.latestFigure = figure;
            this.shape = this.initShape();
            this.insertPuzzles(this.scene.generatePuzzles(this.getCountPuzzlePlaces(), ShadowPuzzle));
        } else {
            let puzzles = this.getPuzzles();
            this.shape = this.initShape();
            this.insertPuzzles(puzzles);
        }

    };

    initShape(): number[][] {
        if (!this.latestFigure) {
            return [];
        }
        let shape = [];
        for (let row of this.latestFigure.getShape()) {
            let sRow = [];
            for (let cell of row) {
                sRow.push(typeof cell !== "number" ? 1 : 0)
            }
            shape.push(sRow)
        }

        return shape;
    }

    getCell(): number {
        return this.latestFigure.getCell();
    }

    getRow(): number {
        let barrier = null;
        let yIndex = this.latestFigure.getRow();
        labelStop:
            while (yIndex <= this.getScene().rows) {
                yIndex++;
                let y = yIndex;
                let x;
                for (let row of this.getShape()) {
                    x = this.latestFigure.getCell();
                    for (let puzzle of row) {
                        if (typeof puzzle !== "number") {
                            barrier = this.getScene().getPuzzle(x, y);
                            if (barrier && barrier.getFigure() !== this) {
                                break labelStop;
                            }
                        }
                        x += 1;
                    }
                    y += 1;
                }
            }
        yIndex -= 1;

        this.getPuzzles().forEach(puzzle => {
            if (puzzle instanceof ShadowPuzzle) {
                puzzle.setAlpha(0.3 / yIndex * (yIndex - this.latestFigure.getRow()))
            }
        });

        return yIndex;
    }


}