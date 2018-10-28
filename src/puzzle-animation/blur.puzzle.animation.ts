///<reference path="basic.puzzle.animation.ts"/>
class BlurPuzzleAnimation extends PuzzleAnimation {
    private blurFilter: PIXI.filters.BlurFilter | any;
    private startBlur: number;

    onStart() {
        this.blurFilter = new PIXI.filters.BlurFilter();
        this.blurFilter.blur = 0;
        this.startBlur = this.blurFilter.blur;

        this.getPuzzle().getGraphics().filters = [this.blurFilter]
    }

    onEnd() {
        this.blurFilter = this.getParams();
    }

    animate() {

        this.blurFilter.blur = this.startBlur + (
            (this.getParams() - this.startBlur) * this.getProgress()
        );

        console.log(this.blurFilter.blur);
    }
}