function generatePuzzles(count, type) {
        let arr = [];
        for (let i = 0; i < count; i++) {
            arr.push(new type());
        }

        return arr;
    }


    $(() => {
        let canvasElement = <HTMLCanvasElement>document.getElementById('wrap');

        let ctx = canvasElement.getContext('2d');

        let f = new InteractiveFigureZ(ctx);
        let ps = generatePuzzles(f.getCountPuzzlePlaces(), SimplePuzzle);
        ps[0].color = "#f00";
        f.insertPuzzles(ps);
        f.move('right');
        f.move('right');
        f.move('right');
        f.move('right');
        f.move('down');


        let w = new BorderFigure(ctx);
        w.insertPuzzles(generatePuzzles(w.getCountPuzzlePlaces(), BorderPuzzle));

        config.scene.addFigure(f);
        config.scene.addFigure(w);

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
