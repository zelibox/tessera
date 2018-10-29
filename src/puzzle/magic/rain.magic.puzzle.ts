class RainMagicPuzzle extends Puzzle {
    animationTime = 2000;

    getColor(): number {
        return 0x00adb5;
    }


    initGraphics(): PIXI.Graphics {
        let width = this.getFigure().getScene().puzzleSize - 1;
        let height = this.getFigure().getScene().puzzleSize - 1;

        let app = this.getFigure().getScene().getApp();
        let rootGraphics = new PIXI.Graphics();
        // rootGraphics.lineStyle(0);
        // rootGraphics.beginFill(this.getColor(), 1);
        rootGraphics.drawRoundedRect(0, 0, width, height, Math.floor(width * 0.30));
        // rootGraphics.endFill();
        // rootGraphics.pivot.set(width/2, height/2);


        let rWidth = width / 2 - 2;

        let graphics1 = new PIXI.Graphics();
        graphics1.lineStyle(0);
        graphics1.beginFill(this.getColor(), 1);
        graphics1.drawRoundedRect( 0 , 0, rWidth, rWidth, Math.floor(rWidth * 0.3));
        graphics1.endFill();

        let graphics2 = new PIXI.Graphics();
        graphics2.lineStyle(0);
        graphics2.beginFill(this.getColor(), 1);
        graphics2.drawRoundedRect(rWidth + 2 , rWidth + 2, rWidth, rWidth, Math.floor(rWidth * 0.3));
        graphics2.endFill();

        rootGraphics.addChild(graphics1);
        rootGraphics.addChild(graphics2);

        let textures = [rootGraphics.generateCanvasTexture()];
        let max = rWidth + 2;
        for (let i = 0; i < max; i++ ) {
            graphics1.pivot.y -= 1;
            graphics2.pivot.y += 1;
            textures.push(rootGraphics.generateCanvasTexture());
        }
        for (let i = 0; i < max; i++ ) {
            graphics1.pivot.y += 1;
            graphics2.pivot.y -= 1;
            textures.push(rootGraphics.generateCanvasTexture());
        }
        for (let i = 0; i < max; i++ ) {
            graphics1.pivot.x -= 1;
            graphics2.pivot.x += 1;
            textures.push(rootGraphics.generateCanvasTexture());
        }
        for (let i = 0; i < max; i++ ) {
            graphics1.pivot.y -= 1;
            graphics2.pivot.y += 1;
            textures.push(rootGraphics.generateCanvasTexture());
        }


        let sprite =  new PIXI.extras.AnimatedSprite(textures, true);
        // sprite.position.x = 100;

        sprite.animationSpeed = 0.5;
        sprite.play();

        this.graphics = sprite;

        this.graphics.pivot.set(width/2, height/2);


        app.stage.addChild(sprite);

        return sprite;
        return super.initGraphics();
    }
}