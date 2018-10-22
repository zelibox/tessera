$(() => {
    let wrapJqueryElement:any|JQuery = $('#wrap');
    let canvasElement = wrapJqueryElement[0];
    let ctx = canvasElement.getContext('2d');

    config.scene = new Scene(ctx);


    wrapJqueryElement.swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
            if (direction == 'left') { // left
                config.scene.getInteractiveFigure().move('left')
            }
            else if (direction == 'right') { // right
                config.scene.getInteractiveFigure().move('right')
            }
            else if (direction == 'up') { // up
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
        ctx.clearRect(0, 0, 240, 440);
        config.scene.render();
        requestAnimationFrame(draw);
    }

    draw();
});
