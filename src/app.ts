$(() => {
    let wrapJqueryElement: any | JQuery = $('#wrap');
    let canvasElement = wrapJqueryElement[0];
    let ctx = canvasElement.getContext('2d');


    config.scene = new Scene(ctx);


    $(window).resize(function () {
        renderCanvas();
    });
    renderCanvas();


    function renderCanvas() {
        config.puzzleSize = window.innerHeight / config.rows;
        ctx.canvas.height = config.puzzleSize * config.rows;
        ctx.canvas.width = config.puzzleSize * config.cols;
    }

    let lastLeft = 0;
    let lastRight = 0;
    wrapJqueryElement.swipe({
        //Generic swipe handler for all directions
        swipeStatus: function (event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
            var str = "<h4>Swipe Phase : " + phase + "<br/>";
            str += "Current direction: " + currentDirection + "<br/>";
            str += "Direction from inital touch: " + direction + "<br/>";
            str += "Distance from inital touch: " + distance + "<br/>";
            str += "Duration of swipe: " + duration + "<br/>";
            str += "Fingers used: " + fingers + "<br/></h4>";
            console.log(currentDirection, distance);
            // if (distance < lastD) {
            //     lastD = distance;
            // }

            if (currentDirection == 'left') { // left
                lastRight = 0;
                if ((distance - lastLeft) > 30 || (distance < lastLeft)) {
                    lastLeft = distance;
                    config.scene.getInteractiveFigure().move('left')
                }

            }
            else if (currentDirection == 'right') { // right
                lastLeft = 0;
                if ((distance - lastRight) > 30 || (distance < lastRight)) {
                    lastRight = distance;
                    config.scene.getInteractiveFigure().move('right')
                }
            }


            // if(phase==$.fn.swipe.phases.PHASE_CANCEL) {
            //     $(this).text("swipe cancelled (due to finger count) "  );
            // }
        },
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            // if (direction == 'left') { // left
            //     config.scene.getInteractiveFigure().move('left')
            // }
            // else if (direction == 'right') { // right
            //     config.scene.getInteractiveFigure().move('right')
            // }
            if (direction == 'up') { // up
                config.scene.getInteractiveFigure().rotate('right')
            }
            else if (direction == 'down') { // down
                config.scene.getInteractiveFigure().move('down')
            }
        }
    });

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
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        config.scene.render();
        requestAnimationFrame(draw);
    }

    draw();
});
