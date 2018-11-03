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
    getTile(): string {
        let keys = Object.keys(this.getFigure().getScene().assets.simplePuzzle);
        return this.getFigure().getScene().assets.simplePuzzle[
            keys[Math.floor(Math.random() * keys.length)]
            ];
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

    initGraphics(): PIXI.Container {
        //

        let width = this.getFigure().getScene().puzzleSize - 1;
        let height = this.getFigure().getScene().puzzleSize - 1;

        let app = this.getFigure().getScene().getApp();
        // let graphics = new PIXI.Graphics();
        // graphics.lineStyle(0);
        // graphics.beginFill(this.getColor(), 1);
        // graphics.drawRoundedRect(0, 0, width, height, Math.floor(width * 0.30));
        // graphics.endFill();

        let graphics = PIXI.Sprite.fromImage('assets/hudPlayer_pink.png');
        graphics.position.x = 0;
        graphics.position.y = 0;
        graphics.width = width;
        graphics.height = height;

        graphics.anchor.set(0.5);

        this.graphics = graphics;
        app.stage.addChild(this.graphics);
        return this.graphics;
    }
}