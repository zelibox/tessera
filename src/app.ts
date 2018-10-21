$(() => {
    let canvasElement = <HTMLCanvasElement>document.getElementById('wrap');
    let ctx = canvasElement.getContext('2d');

    config.scene = new Scene(ctx);

    $("body").on('keydown', function (e) {
        if (e.keyCode == 37) { // left
            config.scene.getInteractiveFigure().move('left')
        }
        else if (e.keyCode == 39) { // right
            config.scene.getInteractiveFigure().move('right')
        }
        else if (e.keyCode == 38) { // up
            config.scene.getInteractiveFigure().rotate('right')
        }
        else if (e.keyCode == 40) { // down
            config.scene.getInteractiveFigure().move('down')
        }
    });

    function draw() {
        ctx.clearRect(0, 0, 240, 440);
        config.scene.render();
        requestAnimationFrame(draw);
    }

    draw();
});
