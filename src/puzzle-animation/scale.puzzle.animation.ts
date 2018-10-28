///<reference path="basic.puzzle.animation.ts"/>
class ScalePuzzleAnimation extends PuzzleAnimation {
    private startX: number;
    private startY: number;
    private startAlpha: number;
    onStart() {
        this.startX = this.getPuzzle().getGraphics().scale.x;
        this.startY = this.getPuzzle().getGraphics().scale.y;
        this.startAlpha = this.getPuzzle().getGraphics().alpha;
    }

    onEnd() {
        this.getPuzzle().getGraphics().scale.x = this.getParams().x;
        this.getPuzzle().getGraphics().scale.y = this.getParams().y;
        this.getPuzzle().getGraphics().alpha = this.getParams().alpha;
    }

    animate() {
        this.getPuzzle().getGraphics().scale.x = this.startX + (
            (this.getParams().x - this.startX) * this.getProgress()
        );

        this.getPuzzle().getGraphics().scale.y = this.startY + (
            (this.getParams().y - this.startY) * this.getProgress()
        );

        this.getPuzzle().getGraphics().alpha = this.startAlpha + (
            (this.getParams().alpha - this.startAlpha) * this.getProgress()
        );
    }
}