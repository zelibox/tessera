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
        console.log(toolbarHeight);
        if ((puzzleSize * scene.rows) > (window.innerHeight - toolbarHeight)) {
            puzzleSize = (window.innerHeight - toolbarHeight) / scene.rows;
        }
        scene.puzzleSize = puzzleSize;
        app.renderer.resize(puzzleSize * scene.cols, puzzleSize * scene.rows);
    }

    resize();

    app.ticker.add(function () {
        scene.render();
    });


    // controller

    let startX = 0;
    $(app.view).swipe({
        swipeStatus: function (event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
            // console.log({
            //     event: event,
            //     phase: phase,
            //     direction: direction,
            //     distance: distance,
            //     duration: duration,
            //     fingers: fingers,
            //     fingerData: fingerData,
            //     currentDirection: currentDirection
            // });
            if (phase === 'start') {
                if (event.pageX) {
                    startX = event.pageX;
                } else {
                    startX = event.touches[0].pageX;
                }
            }
            if (phase === 'cancel' && distance == 0) {
                if (startX > (window.innerWidth / 2)) {
                    scene.getInteractiveFigure().move('right');
                } else {
                    scene.getInteractiveFigure().move('left');
                }
            }
        },
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if (duration < 300) {
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

    let fullScreenToggleElement = $('.full-screen-toggle');
    fullScreenToggleElement.on('click', function () {
        /* Get the documentElement (<html>) to display the page in fullscreen */
        let elem: any = document.documentElement;
        if (fullScreenToggleElement.hasClass('active')) {
            fullScreenToggleElement.removeClass('active');
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        } else {
            $('.full-screen-toggle').addClass('active');
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
        }
    })
});
