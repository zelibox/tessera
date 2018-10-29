$(function () {
    const app = new PIXI.Application(
        {
            autoResize: true,
            resolution: devicePixelRatio,
            transparent: true,
            antialias: true,
        }
    );
    app.stage.interactive = true;
    const scene = new Scene(app);

    $('.wrap').append(app.view);
    window.addEventListener('resize', resize);

    function resize() {
        let puzzleSize = window.innerWidth / scene.cols;
        let toolbarHeight = $('.toolbar').height();
        if ((puzzleSize * scene.rows) > (window.innerHeight - toolbarHeight)) {
            puzzleSize = (window.innerHeight - toolbarHeight) / scene.rows;
        }
        scene.puzzleSize = puzzleSize;
        // for (var i = app.stage.children.length - 1; i >= 0; i--) {	app.stage.removeChild(app.stage.children[i]);};
        scene.getAllPuzzles().forEach(p => p.clearGraphics());
        app.stage.removeChildren();
        app.renderer.resize(puzzleSize * scene.cols, puzzleSize * scene.rows);
        console.log(app, 'remove')
    }

    // setInterval(resize, 5000); // TODO

    resize();

    app.ticker.add(function () {
        scene.render();
    });


    // controller

    let startX = 0;

    let interval;
    $(app.view)['swipe']({
        swipeStatus: function (event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
            if (phase === 'start') {
                if (event.pageX) {
                    startX = event.pageX;
                } else {
                    startX = event.touches[0].pageX;
                }
            }
            if (phase === 'cancel' && distance <= scene.puzzleSize) {
                if (startX > (window.innerWidth / 2)) {
                    scene.getInteractiveFigure().move('right');
                } else {
                    scene.getInteractiveFigure().move('left');
                }
            }
        },
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if (duration < 350) {
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


    let pauseElement = $('.pause');
    pauseElement.on('click', function() {
        if (pauseElement.hasClass('active')) {
            pauseElement.removeClass('active');
            scene.setPause(false)
        } else {
            pauseElement.addClass('active');
            scene.setPause(true)
        }
    });

    let fullScreenToggleElement = $('.full-screen-toggle');
    fullScreenToggleElement.on('click', function () {
        let elem: any = document.documentElement;
        if (fullScreenToggleElement.hasClass('active')) {
            fullScreenToggleElement.removeClass('active');
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document['msExitFullscreen']) {
                document['msExitFullscreen']();
            }
        } else {
            $('.full-screen-toggle').addClass('active');
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        }
    })
});
