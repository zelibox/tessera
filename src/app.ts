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

    let loader = PIXI.loader;
    loader.add(scene.getAllAssets());
    loader.load();
    loader.on('progress', () => {
        $('.cover .content').html(`${Math.floor(loader.progress)}%`);
    });

    loader.on('complete', () => {
        $('.cover').hide();
        $('.wrap').append(app.view);
        window.addEventListener('resize', resize);

        function resize() {
            let puzzleSize = window.innerWidth / scene.cols;
            let toolbarHeight = $('.toolbar').height();
            if ((puzzleSize * scene.rows) > (window.innerHeight - toolbarHeight)) {
                puzzleSize = (window.innerHeight - toolbarHeight) / scene.rows;
            }
            scene.puzzleSize = puzzleSize;
            scene.getAllPuzzles().forEach(p => p.clearGraphics());
            app.stage.removeChildren();
            app.renderer.resize(puzzleSize * scene.cols, puzzleSize * scene.rows);
        }

        setInterval(resize, 60000); // todo

        resize();

        app.ticker.add(function () {
            scene.render();
        });


        // controller

        let startX = 0;
        $(app.view)['swipe']({
            swipeStatus: function (event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
                if (scene.getPause()) {
                    return;
                }
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
                if (scene.getPause()) {
                    return;
                }
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
            if (scene.getPause()) {
                return;
            }
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

        let windowElement:JQuery|any = $(window);
        windowElement.on('blur', () => {
            pauseElement.trigger('click');
        });
        pauseElement.on('click', () => {
            scene.setPause(true);
            $('.cover').show();
            $('.cover .content').html('PLAY');
            $('.cover .content').css('cursor', 'pointer');
            $('.cover .content').on('click', () => {
                $('.cover').hide();
                scene.setPause(false);
            })
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
});
