abstract class SimplePuzzle extends Puzzle {
    remove(): void {
        this.getFigure().getScene().addPoint();
        super.remove();
    }
}

class SimpleGreenPuzzle extends SimplePuzzle {
    getTile() {
        return this.getFigure().getScene().assets.simplePuzzle.green
    }
}
class SimpleBluePuzzle extends SimplePuzzle {
    getTile() {
        return this.getFigure().getScene().assets.simplePuzzle.blue
    }
}
class SimpleRedPuzzle extends SimplePuzzle {
    getTile() {
        return this.getFigure().getScene().assets.simplePuzzle.red
    }
}
class SimpleYellowPuzzle extends SimplePuzzle {
    getTile() {
        return this.getFigure().getScene().assets.simplePuzzle.yellow
    }
}
