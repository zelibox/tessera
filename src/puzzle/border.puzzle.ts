class BorderPuzzle extends Puzzle {
    getTile(): string {
        let tile = '';
        let sceneAssets = this.getFigure().getScene().assets.borderPuzzle;

        if (this.getRow() == 21 && this.getCell() == 1) {
            tile = sceneAssets.left;
        } else if (this.getRow() == 21 && this.getCell() == 10) {
            tile = sceneAssets.right;
        } else if (this.getRow() == 21 && this.getCell() > 1 && this.getCell() < 10) {
            tile = sceneAssets.mid;
        }
        return tile;
    }


    initGraphics(): PIXI.Container {
        let width = this.getFigure().getScene().puzzleSize;
        let height = this.getFigure().getScene().puzzleSize - 1;

        let app = this.getFigure().getScene().getApp();

        let graphics = PIXI.Sprite.fromImage(this.getTile());
        graphics.width = width;
        graphics.height = height;

        graphics.anchor.set(0.5);
        this.graphics = graphics;
        app.stage.addChild(this.graphics);

        return this.graphics;
    }
}