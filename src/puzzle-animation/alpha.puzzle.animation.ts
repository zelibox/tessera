///<reference path="basic.puzzle.animation.ts"/>
class AlphaPuzzleAnimation extends PuzzleAnimation {
    private startAlpha: number;
    onStart() {
        this.startAlpha = this.getPuzzle().getGraphics().alpha;
    }

    onEnd() {
        this.getPuzzle().getGraphics().alpha = this.getParams();
    }

    animate() {
        this.getPuzzle().getGraphics().alpha = this.startAlpha + (
            (this.getParams() - this.startAlpha) * this.getProgress()
        );
    }
}