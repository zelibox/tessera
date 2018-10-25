$(function () {
    const app = new PIXI.Application(
        {
            autoResize: true,
            resolution: devicePixelRatio,
            transparent: true,
            antialias: true
        }
    );
    app.stage.interactive = true;
    const scene = new Scene(app);

    document.body.appendChild(app.view);
    window.addEventListener('resize', resize);

    function resize() {
        let puzzleSize = window.innerWidth / scene.cols;
        if ((puzzleSize * scene.rows) > window.innerHeight) {
            puzzleSize = window.innerHeight / scene.rows;
        }
        scene.puzzleSize = puzzleSize;
        app.renderer.resize(window.innerWidth, window.innerHeight);
    }
    resize();

    app.ticker.add(function () {
        scene.render();
    });


    // controller

    $(app.view).click(function (e) {
        if (e.offsetX < (scene.puzzleSize * scene.cols / 2)) {
            scene.getInteractiveFigure().move('left')
        } else {
            scene.getInteractiveFigure().move('right')
        }
    });

    $(app.view).swipe({
        //Generic swipe handler for all directions
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if (direction == 'left') { // left
                while (scene.getInteractiveFigure().move('left')) {
                }
            }
            else if (direction == 'right') { // right
                while (scene.getInteractiveFigure().move('right')) {
                }
            }
            if (direction == 'up') { // up
                scene.getInteractiveFigure().rotate('right')
            }
            else if (direction == 'down') { // down
                while (scene.getInteractiveFigure().move('down')) {
                }
            }
        }
    });

    $("body").on('keydown', function (e) {
        if (e.keyCode == 37) { // left
            scene.getInteractiveFigure().move('left')
        }
        else if (e.keyCode == 39) { // right
            scene.getInteractiveFigure().move('right')
        }
        else if (e.keyCode == 38) { // up
            scene.getInteractiveFigure().rotate('right')
        }
        else if (e.keyCode == 40) { // down
            scene.getInteractiveFigure().move('down')
        }
    });

    function requestFullScreen() {
        let element = document.body;
        // Supports most browsers and their versions.
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        }
    }
});
