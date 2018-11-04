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


    onImpact(): void {
        if(this.getPuzzles().length) {
            let puzzle = this.getPuzzles()[0];
            if (puzzle instanceof ThiefMagicPuzzle) {
                puzzle.setClassicGraphic()
            }
        }
        super.onImpact();
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