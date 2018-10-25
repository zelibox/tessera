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

    $(app.view).swipe({
        //Generic swipe handler for all directions
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if (direction == 'left') { // left
                while (scene.getInteractiveFigure().move('left')) {
                }
                console.log('swipe left')
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
        },
        swipeStatus: function (event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
            var str = "<h4>Swipe Phase : " + phase + "<br/>";
            str += "Current direction: " + currentDirection + "<br/>";
            str += "Direction from inital touch: " + direction + "<br/>";
            str += "Distance from inital touch: " + distance + "<br/>";
            str += "Duration of swipe: " + duration + "<br/>";
            str += "Fingers used: " + fingers + "<br/></h4>";
            // console.log(event, phase, direction, distance, duration, fingers, fingerData, currentDirection);
            // if (distance < lastD) {
            //     lastD = distance;
            // }
            // if ()
            if (duration > 500) {
                if (currentDirection == 'left') { // left
                    scene.getInteractiveFigure().move(currentDirection);
                    // lastRight = 0;
                    // if ((distance - lastLeft) > 30 || (distance < lastLeft)) {
                    //     lastLeft = distance;
                    //     config.scene.getInteractiveFigure().move('left')
                    // }

                }
                else if (currentDirection == 'right') { // right
                    scene.getInteractiveFigure().move(currentDirection);
                    // lastLeft = 0;
                    // if ((distance - lastRight) > 30 || (distance < lastRight)) {
                    //     lastRight = distance;
                    //     config.scene.getInteractiveFigure().move('right')
                    // }
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

    app.ticker.add(function () {
        scene.render();
    });
});
