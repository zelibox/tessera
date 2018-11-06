class ThiefMagicPuzzle extends SimplePuzzle {
    getTile(): string {
        return this.getFigure().getScene().assets.magicPuzzle.thief;
    }
}