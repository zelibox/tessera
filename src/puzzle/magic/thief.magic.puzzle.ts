class ThiefMagicPuzzle extends Puzzle{
    private classicMode: boolean = false;
    getColor(): number {
        return 0x00adb5;
    }

    initGraphics(): PIXI.Container {
        if (this.classicMode) {
            return super.initGraphics();
        }
        let width = this.getFigure().getScene().puzzleSize - 1;
        let height = this.getFigure().getScene().puzzleSize - 1;

        let app = this.getFigure().getScene().getApp();
        // let graphics = new PIXI.Graphics();
        // graphics.lineStyle(0);
        // graphics.beginFill(this.getColor(), 1);
        // graphics.drawRoundedRect(0, 0, width, height, Math.floor(width * 0.30));
        // graphics.endFill();

        let graphics = PIXI.Sprite.fromImage('assets/alienBlue_round.png');
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