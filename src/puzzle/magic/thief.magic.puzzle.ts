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
        let rootGraphics = new PIXI.Graphics();
        rootGraphics.lineStyle(0);
        rootGraphics.beginFill(this.getColor(), 1);
        rootGraphics.drawRoundedRect(0, 0, width, height, Math.floor(width * 0.30));
        rootGraphics.endFill();
        rootGraphics.pivot.set(width/2, height/2);

        let rWidth = Math.floor(width / 2);
        let graphics1 = new PIXI.Graphics();
        graphics1.lineStyle(0);
        graphics1.beginFill(0x222831, 1);
        graphics1.drawRoundedRect( 0 , 0, rWidth, rWidth, Math.floor(rWidth * 0.3));
        graphics1.endFill();
        graphics1.position.x = rWidth ;
        graphics1.position.y = rWidth;
        graphics1.pivot.x = rWidth/2;
        graphics1.pivot.y = rWidth/2;
        rootGraphics.addChild(graphics1);
        // graphics1.position.x = rWidth;
        // graphics1.position.y = rWidth * -1;
        let textures = [rootGraphics.generateCanvasTexture()];
        for (let i = 1; i > 0.3; i-=0.05 ) {
            graphics1.scale.x = i;
            graphics1.scale.y = i;
            textures.push(rootGraphics.generateCanvasTexture());
        }
        for (let i = 0.3; i < 1; i+=0.05 ) {
            graphics1.scale.x = i;
            graphics1.scale.y = i;
            textures.push(rootGraphics.generateCanvasTexture());
        }
        let sprite =  new PIXI.extras.AnimatedSprite(textures, true);

        sprite.animationSpeed = 0.5;
        sprite.play();

        this.graphics = sprite;
        this.graphics.pivot.set(width/2, height/2);

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