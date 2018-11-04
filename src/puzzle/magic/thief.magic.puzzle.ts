class ThiefMagicPuzzle extends Puzzle {
    private classicMode: boolean = false;
    private classicTile = null;

    getTile(): string {
        if (!this.classicTile) {
            let keys = Object.keys(this.getFigure().getScene().assets.simplePuzzle);
            this.classicTile = this.getFigure().getScene().assets.simplePuzzle[
                keys[Math.floor(Math.random() * keys.length)]
                ];
        }

        return this.classicTile;
    }


    initGraphics(): PIXI.Container {
        if (this.classicMode) {
            return super.initGraphics();
        }

        let width = this.getFigure().getScene().puzzleSize - 1;
        let height = this.getFigure().getScene().puzzleSize - 1;

        let app = this.getFigure().getScene().getApp();

        let t1 = PIXI.Texture.fromImage(this.getFigure().getScene().assets.magicPuzzle.thief1);
        let t2 = PIXI.Texture.fromImage(this.getFigure().getScene().assets.magicPuzzle.thief2);

        let sprite =  new PIXI.extras.AnimatedSprite([
            t1,
            t2,
        ], true);

        sprite.width = width;
        sprite.height = height;
        sprite.anchor.set(0.5);
        sprite.animationSpeed = 0.1;
        sprite.play();

        this.graphics = sprite;

        app.stage.addChild(sprite);

        return sprite;
    }

    setClassicGraphic() {
        if (this.graphics) {
            this.classicMode = true;
            this.clearGraphics();
            this.initGraphics();
        }
    }
}