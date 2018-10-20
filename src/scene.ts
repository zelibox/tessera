class Scene {
    public figures: IFigure[] = [];

    addFigure(figure: IFigure) {
        this.figures.push(figure);
    }

    getPuzzle(cell, row):IPuzzle {
        for (let figure of this.figures) {
            for (let puzzle of figure.getPuzzles()) {
                if (((puzzle.getCell()) === cell)
                    && ((puzzle.getRow()) === row)) {
                    return puzzle;
                }
            }
        }
        return null;
    }
}
