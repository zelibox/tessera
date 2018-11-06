class GearMagicPuzzle extends SimplePuzzle {
    private direction: number;
    getTile(): string {
        return this.getFigure().getScene().assets.magicPuzzle.gear;
    }

    render(): void {
        super.render();
        this.getGraphics().rotation += (this.direction ? 0.03 : -0.03);
    }

    setDirection(direction: number) {
        this.direction = direction;
    }
}