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