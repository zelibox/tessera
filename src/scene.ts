class Scene {
    public figures: IFigure[] = [];

    addFigure(figure: IFigure) {
        this.figures.push(figure);
    }

    getPuzzle(cell, row) {
        for (let figure of this.figures) {
            for (let puzzle of figure.getPuzzles()) {
                if (((figure.getCell() + puzzle.getCell()) === cell)
                    && ((figure.getRow() + puzzle.getRow()) === row)) {
                    return puzzle;
                }
            }
        }
        return null;
    }
}
