class RainItemFigureMagicPuzzle extends InteractiveFigureDot {
    onImpact(): void {
        this.getScene().removeCustomFigure(this);
        this.updateShape([]);
    }

    public cell;
    public row;

    getSpeed(): number {
        return 150;
    }
}

class RainItemPuzzle extends Puzzle {
    private classicTile: string;
    getTile(): string {
        if (!this.classicTile) {
            let keys = Object.keys(this.getFigure().getScene().assets.simplePuzzle);
            this.classicTile = this.getFigure().getScene().assets.simplePuzzle[
                keys[Math.floor(Math.random() * keys.length)]
                ];
        }
        return this.classicTile;
    }

}

class RainMagicPuzzle extends Puzzle {
    animationTime = 2000;

    getTile(): string {
        return this.getFigure().getScene().assets.magicPuzzle.rain;
    }


    remove(): void {
        for (let r = 1; r <= Math.floor(this.getFigure().getScene().rows / 3); r++) {
            let cell = (Math.floor(Math.random() * ((this.getFigure().getScene().cols - 2) - 1 + 1)) + 1);
            let block = this.getFigure().getScene().getPuzzle(cell, r);
            if (!block) {
                let figure = new RainItemFigureMagicPuzzle(this.getFigure().getScene());
                figure.cell = cell;
                figure.row = r;
                figure.insertPuzzles([new RainItemPuzzle()]);
                this.getFigure().getScene().addCustomFigure(figure);
            }
        }
        super.remove();
    }
}