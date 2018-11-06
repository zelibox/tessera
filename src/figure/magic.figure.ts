class RainMagicFigure extends InteractiveFigure {
    constructor(scene: Scene) {
        super(scene);
        this.insertPuzzles([new RainMagicPuzzle()])
    }

    initShape(): number[][] {
        return [
            [1],
        ];
    }
}

class ThiefMagicFigure extends InteractiveFigure {
    constructor(scene: Scene) {
        super(scene);
        this.insertPuzzles([new ThiefMagicPuzzle()])
    }

    initShape(): number[][] {
        return [
            [1],
        ];
    }

    move(side): boolean {
        let r = super.move(side);
        if (side === 'down' && r) {
            let puzzles = this.getScene().getWrapFigure().getPuzzles();
            if (puzzles.length) {
                let puzzle = puzzles[Math.floor(Math.random()*puzzles.length)];

                puzzle.createAnimation(ScalePuzzleAnimation,
                    {x: 0, y: 0, alpha: 0}
                ).then(() => {
                    puzzle.remove();
                });
            }
        }
        return r;
    }
}

class GearMagicFigure extends InteractiveFigure {
    private direction: number;
    constructor(scene: Scene) {
        super(scene);
        this.direction = Math.floor(Math.random() * 2);
        let puzzle = new GearMagicPuzzle();
        puzzle.setDirection(this.direction);
        this.insertPuzzles([puzzle])
    }

    move(side): boolean {
        let r = super.move(side);
        if (side === 'down' && r) {
            let shape = this.getScene().getWrapFigure().getShape().map(row => {
                let move = false;
                let newRow = [];
                for (let cell of (this.direction ? row.reverse() : row)) {
                    if (typeof cell === "number" && !move) {
                        move = true;
                    } else {
                        newRow.push(cell);
                    }
                }
                if (move) {
                    newRow.push(0);
                } else {
                    newRow = row;
                }

                return (this.direction ? newRow.reverse() : newRow);
            });

            this.getScene().getWrapFigure().updateShape(shape);
        }
        return r;
    }

    initShape(): number[][] {
        return [
            [1]
        ];
    }
}
// LeftWind -- move all to right
// RightWind  -- move all to left
// TopWind -- move all to down
//
// Lava -- remove all under figure
//
// Bomb -- remove coming
// Dagger -- remove line

// TopCleaner -- remove all top
// LeftCleaner -- remove all left
// RightCleaner -- remove all right
//
// Thief -- remove random count
// Rain -- add random count
//
// Build -- replace all and paste building (circle, triangle, ...)
// Word -- replace all and paste random word