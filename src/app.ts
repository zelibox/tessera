import * as ololo from './figure'

namespace Tessera {
    function generatePuzzles(count, type) {
        let arr = [];
        for (let i = 0; i < count; i++) {
            arr.push(new type());
        }

        return arr;
    }


    $(() => {
        console.log(Tessera.Figure.BorderFigure);
        let canvasElement = <HTMLCanvasElement>document.getElementById('wrap');

        let ctx = canvasElement.getContext('2d');

        let f = new Tessera.Figure.InteractiveFigureS(ctx);
        f.insertPuzzles(generatePuzzles(f.getCountPuzzlePlaces(), SimplePuzzle));
        f.move('right');
        f.move('right');
        f.move('right');
        f.move('right');
        f.move('down');


        let w = new Tessera.Figure.BorderFigure(ctx);
        w.insertPuzzles(generatePuzzles(w.getCountPuzzlePlaces(), BorderPuzzle));


        $("body").on('keydown', function (e) {
            if (e.keyCode == 37) { // left
                f.move('left')
            }
            else if (e.keyCode == 39) { // right
                f.move('right')
            }
            else if (e.keyCode == 38) { // up
                f.rotate('right')
            }
            else if (e.keyCode == 40) { // down
                f.move('down')
            }
        });

        // f.flipMatrix();

        function draw() {
            ctx.clearRect(0, 0, 240, 440);
            f.render();
            w.render();
            requestAnimationFrame(draw);
        }

        draw();
    });
}