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
                let puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

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

class WeightMagicFigure extends InteractiveFigure {
    constructor(scene: Scene) {
        super(scene);
        this.insertPuzzles(
            this.getScene().generatePuzzles(
                this.getCountPuzzlePlaces(),
                WeightMagicPuzzle
            )
        )
    }


    rotate(side) {

    }

    move(side): boolean {
        if (!this.enableMove) {
            return false;
        }
        let moveX = this.getCell();
        let moveY = this.getRow();
        if (side === 'right') {
            moveX = this.getCell() + 1;
        }
        if (side === 'left') {
            moveX = this.getCell() - 1;
        }
        if (side === 'down') {
            moveY = this.getRow() + 1;
        }

        let x;
        let y = moveY;
        let barrierType = null;
        let barriers: IPuzzle[] = [];
        for (let row of this.getShape()) {
            x = moveX;
            for (let puzzle of row) {
                if (typeof puzzle !== "number") {
                    let barrier = this.getScene().getPuzzle(x, y);
                    if (barrier && barrier.getFigure() !== this) {
                        barrierType = side;
                        barriers.push(barrier);
                    }
                }
                x += 1;
            }
            y += 1;
        }

        if (barrierType) {
            if (barrierType === 'down') {
                if (this.getRow() === 1) {
                    this.scene.disablePoints();
                    this.scene.getWrapFigure().getPuzzles().forEach(p => p.remove());
                    this.scene.enablePoints();
                } else {
                    this.enableMove = false;
                    let notWrap = barriers.filter(b => !(b.getFigure() instanceof WrapFigure));
                    if (notWrap.length) {
                        notWrap[0].getFigure().impact(this);
                        return false;
                    } else {
                        let promises = barriers.map(p => {
                            return p.createAnimation(ScalePuzzleAnimation,
                                {x: 0, y: 0, alpha: 0}
                            );
                        });

                        Promise.all(promises).then(() => {
                            barriers.forEach(p => p.remove());
                            this.enableMove = true;
                            this.cell = moveX;
                            this.row = moveY;
                            this.updateShape(this.getShape());
                        });
                    }

                    return true;
                }
            }
        } else {
            this.cell = moveX;
            this.row = moveY;
            this.updateShape(this.getShape());
            return true;
        }
    }

    initShape(): number[][] {
        let shape = [[]];
        for (let i = 0; i < (Math.floor(Math.random() * 3) + 1); i++) {
            shape[0].push(1);
        }
        return shape;
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