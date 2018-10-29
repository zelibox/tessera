class ShadowPuzzle extends Puzzle {
    getColor(): number {
        return 0x00adb5;
    }


    initGraphics(): PIXI.Graphics {
        let g = super.initGraphics();
        g.alpha = 0;
        return g;
    }

    setAlpha(alpha) {
        if (this.graphics) {
            this.graphics.alpha = alpha;
        }
    }
}