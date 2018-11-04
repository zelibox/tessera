class BorderPuzzle extends Puzzle {
    getTile(): string {
        let tile = '';
        let sceneAssets = this.getFigure().getScene().assets.borderPuzzle;

        if (this.getRow() == 21 && this.getCell() == 1) {
            tile = sceneAssets.left;
        } else if (this.getRow() == 21 && this.getCell() == 10) {
            tile = sceneAssets.right;
        } else if (this.getRow() == 21 && this.getCell() > 1 && this.getCell() < 10) {
            tile = sceneAssets.mid;
        }
        return tile;
    }
}