class WeightMagicPuzzle extends SimplePuzzle {
    getTile(): string {
        return this.getFigure().getScene().assets.magicPuzzle.weight;
    }
}