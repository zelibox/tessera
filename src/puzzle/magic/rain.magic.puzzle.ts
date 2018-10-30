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

class RainItemPuzzle extends Puzzle{
    getColor(): number {
        return 0x7acfdf;
    }

}

class RainMagicPuzzle extends Puzzle {
    animationTime = 2000;

    getColor(): number {
        return 0x7acfdf;
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
        let width = this.getFigure().getScene().puzzleSize - 1;
        let height = this.getFigure().getScene().puzzleSize - 1;

        let app = this.getFigure().getScene().getApp();
        let rootGraphics = new PIXI.Graphics();
        rootGraphics.drawRect(0, 0, width, height);


        let rWidth = Math.floor(width / 2);

        let graphics1 = new PIXI.Graphics();
        graphics1.lineStyle(0);
        graphics1.beginFill(this.getColor(), 1);
        graphics1.drawRoundedRect( 0 , 0, rWidth, rWidth, Math.floor(rWidth * 0.3));
        graphics1.endFill();



        let graphics3 = new PIXI.Graphics();
        graphics3.lineStyle(0);
        graphics3.beginFill(this.getColor(), 1);
        graphics3.drawRoundedRect(rWidth + 1 , rWidth + 1, rWidth, rWidth, Math.floor(rWidth * 0.3));
        graphics3.endFill();

        rootGraphics.addChild(graphics1);
        rootGraphics.addChild(graphics3);

        let textures = [rootGraphics.generateCanvasTexture()];
        let max = rWidth + 1;
        for (let i = 0; i < max; i++ ) {
            graphics1.position.x += 1;
            graphics3.position.x -= 1;
            textures.push(rootGraphics.generateCanvasTexture());
        }
        for (let i = 0; i < max; i++ ) {
            graphics1.position.y += 1;
            graphics3.position.y -= 1;
            textures.push(rootGraphics.generateCanvasTexture());
        }
        for (let i = 0; i < max; i++ ) {
            graphics1.position.x -= 1;
            graphics3.position.x += 1;
            textures.push(rootGraphics.generateCanvasTexture());
        }
        for (let i = 0; i < max; i++ ) {
            graphics1.position.y -= 1;
            graphics3.position.y += 1;
            textures.push(rootGraphics.generateCanvasTexture());
        }

        let sprite =  new PIXI.extras.AnimatedSprite(textures, true);

        sprite.animationSpeed = 0.5;
        sprite.play();

        this.graphics = sprite;

        this.graphics.pivot.set(width/2, height/2);

        app.stage.addChild(sprite);

        return sprite;
    }
}