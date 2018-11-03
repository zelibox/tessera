class ThiefMagicPuzzle extends Puzzle {
    private classicMode: boolean = false;
    getTile(): string {
        return this.getFigure().getScene().assets.magicPuzzle.thief;
    }

    initGraphics(): PIXI.Container {
        if (this.classicMode) {
            return super.initGraphics();
        }
        let width = this.getFigure().getScene().puzzleSize - 1;
        let height = this.getFigure().getScene().puzzleSize - 1;

        let app = this.getFigure().getScene().getApp();

        let graphics = PIXI.Sprite.fromImage('assets/hudPlayer_beige.png');
        graphics.position.x = 0;
        graphics.position.y = 0;
        graphics.width = width;
        graphics.height = height;

        graphics.anchor.set(0.5);

        this.graphics = graphics;
        app.stage.addChild(this.graphics);
        return this.graphics;
    }

    setClassicGraphic() {
        if (this.graphics) {
            this.classicMode = true;
            this.clearGraphics();
            this.initGraphics();
        }
    }
}