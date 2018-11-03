class ShadowPuzzle extends Puzzle {
    getColor(): number {
        return 0x00adb5;
    }

    initGraphics(): PIXI.Container {
        let width = this.getFigure().getScene().puzzleSize - 1;
        let height = this.getFigure().getScene().puzzleSize - 1;

        let app = this.getFigure().getScene().getApp();
        // let graphics = new PIXI.Graphics();
        // graphics.lineStyle(0);
        // graphics.beginFill(this.getColor(), 1);
        // graphics.drawRoundedRect(0, 0, width, height, Math.floor(width * 0.30));
        // graphics.endFill();
        let graphics = PIXI.Sprite.fromImage('assets/platformPack_tile042.png');
        graphics.width = width;
        graphics.height = height;

        graphics.anchor.set(0.5);
        this.graphics = graphics;
        this.graphics.alpha = 0;
        app.stage.addChild(this.graphics);
        return this.graphics;
    }

    setAlpha(alpha) {
        if (this.graphics) {
            this.graphics.alpha = alpha;
        }
    }


}