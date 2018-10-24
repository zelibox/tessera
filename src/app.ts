$(function() {
    const app = new PIXI.Application(
        {
            autoResize: true,
            resolution: devicePixelRatio
        }
    );
    app.stage.interactive = true;
    const scene = new Scene(app);


    document.body.appendChild(app.view);
    window.addEventListener('resize', resize);

    function resize() {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    }
    resize();

    app.ticker.add(function() {
       scene.render();
    });
});
