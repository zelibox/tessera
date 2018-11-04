class ShadowPuzzle extends Puzzle {
    getTile(): string {
        return this.getFigure().getScene().assets.shadowPuzzle.shadow;
    }

    setAlpha(alpha) {
        if (this.graphics) {
            this.graphics.alpha = alpha;
        }
    }


    initGraphics(): PIXI.Container {
        let graphics = super.initGraphics();
        graphics.alpha = 0;
        // todo if not set 0 => bug render
        return graphics;
    }
}