class SimpleGreenPuzzle extends Puzzle {
    getTile() {
        return this.getFigure().getScene().assets.simplePuzzle.green
    }
}
class SimpleBluePuzzle extends Puzzle {
    getTile() {
        return this.getFigure().getScene().assets.simplePuzzle.blue
    }
}
class SimpleRedPuzzle extends Puzzle {
    getTile() {
        return this.getFigure().getScene().assets.simplePuzzle.red
    }
}
class SimpleYellowPuzzle extends Puzzle {
    getTile() {
        return this.getFigure().getScene().assets.simplePuzzle.yellow
    }
}
