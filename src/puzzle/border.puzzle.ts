class BorderPuzzle extends Puzzle {
    getColor(): number {
        return 0x393e46;
    }


    initGraphics(): PIXI.Container {
        let img = '';
        if (this.getRow() == 21 && this.getCell() == 1) {
            img = 'stoneCliff_left.png';
        } else if (this.getRow() == 21 && this.getCell() == 10) {
            img = 'stoneCliff_right.png';
        } else if (this.getRow() == 21 && this.getCell() > 1 && this.getCell() < 10) {
            img = 'stoneMid.png';
        }


        let width = this.getFigure().getScene().puzzleSize;
        let height = this.getFigure().getScene().puzzleSize - 1;

        let app = this.getFigure().getScene().getApp();
        // let graphics = new PIXI.Graphics();
        // graphics.lineStyle(0);
        // graphics.beginFill(this.getColor(), 1);
        // graphics.drawRoundedRect(0, 0, width, height, Math.floor(width * 0.30));
        // graphics.endFill();

        let graphics = PIXI.Sprite.fromImage('assets/' + img);
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