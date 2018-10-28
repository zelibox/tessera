interface IPuzzle {
    render()

    getCell(): number;

    getRow(): number;

    setFigure(figure: IFigure)

    getFigure(): IFigure

    remove();

    getGraphics(): PIXI.Graphics;

    clearGraphics();

    setPosition(x: number, y: number): void;

    getColor(): number;

    createAnimation(animationType, params?: any);

    deactivateAnimation(animation:IPuzzleAnimation);
}

abstract class Puzzle implements IPuzzle {
    public x = null;
    public y = null;
    public futureX = null;
    public futureY = null;
    public stepX = null;
    public stepY = null;
    public animationTime = 300;
    private cell: number = 5; //  todo!!!!!
    private row: number = 5; //  todo!!!!!
    private figure: IFigure;
    private renderStartDate: Date;
    protected graphics: PIXI.Graphics;
    private activeAnimationList:IPuzzleAnimation[] = [];

    abstract getColor(): number

    getCell() {
        return this.cell;
    }

    getRow() {
        return this.row;
    }

    getFigure(): IFigure {
        return this.figure;
    }

    setFigure(figure: IFigure) {
        this.figure = figure;
    }

    createAnimation(animationType, params?:any) {
        let animationFilter = this.activeAnimationList.filter( a => a instanceof animationType);
        if (animationFilter.length) {
            return animationFilter[0].run(params);
        } else {
            let animation:IPuzzleAnimation = new animationType(this);
            this.activeAnimationList.push(animation);
            return animation.run(params);
        }


    }

    deactivateAnimation(animation: IPuzzleAnimation) {
        let index = this.activeAnimationList.indexOf(animation);
        if (index !== -1) {
            this.activeAnimationList.splice(index, 1);
        }
    }

    remove() {
        let shape = this.figure.getShape();
        let x;
        let y = 0;
        for (let row of shape) {
            x = 0;
            for (let cell of row) {
                if (cell === this) {
                    shape[y][x] = 0;
                }
                x++;
            }
            y++;
        }
        this.clearGraphics();
        this.activeAnimationList = [];
        this.figure.updateShape(shape);
    }

    setPosition(x: number, y: number): void {
        this.cell = x;
        this.row = y;
    }

    clearGraphics() {
        if (this.graphics) {
            this.getFigure().getScene().getApp().stage.removeChild(this.graphics);
            this.graphics = null;
        }
    }

    initGraphics() {
        let width = this.figure.getScene().puzzleSize - 1;
        let height = this.figure.getScene().puzzleSize - 1;

        let app = this.figure.getScene().getApp();
        this.graphics = new PIXI.Graphics();
        this.graphics.lineStyle(0);
        this.graphics.beginFill(this.getColor(), 1);
        this.graphics.drawRoundedRect(0, 0, width, height, Math.floor(width * 0.30));
        this.graphics.endFill();
        this.graphics.pivot.set(width/2, height/2);

        // let text = new PIXI.Text(
        //     '1',
        //     {
        //         fontFamily : 'monospace',
        //         fontSize: this.getFigure().getScene().puzzleSize / 2,
        //         lineHeight: this.getFigure().getScene().puzzleSize / 2,
        //         fill : 0x393e46,
        //         align : 'center'
        //     });
        //
        // text.anchor.x =0.5;
        // text.anchor.y =0.5;
        // text.y = this.getFigure().getScene().puzzleSize / 2;
        // text.x = this.getFigure().getScene().puzzleSize / 2;
        // this.graphics.addChild(text);

        app.stage.addChild(this.graphics);
        return this.graphics;
    }

    getGraphics() {
        if (!this.graphics) {
            this.initGraphics();
        }

        return this.graphics;
    }

    render() {
        let x = this.cell * this.figure.getScene().puzzleSize + this.figure.getScene().puzzleSize / 2;
        let y = this.row * this.figure.getScene().puzzleSize + this.figure.getScene().puzzleSize / 2;
        if ((this.x === null) || (this.y === null)) {
            this.x = x;
            this.y = y;
            this.futureX = x;
            this.futureY = y;
            this.renderStartDate = new Date();
        } else {
            if ((x !== this.futureX) || (y !== this.futureY)) {
                this.futureX = x;
                this.futureY = y;
                this.renderStartDate = new Date();
            }
            let diff = new Date().getTime() - this.renderStartDate.getTime();

            if (this.x > this.futureX) {
                this.stepX = ((this.x - this.futureX) * (diff / this.animationTime)) * -1;
            } else {
                this.stepX = ((this.futureX - this.x) * (diff / this.animationTime));
            }
            if (this.y > this.futureY) {
                this.stepY = ((this.y - this.futureY) * (diff / this.animationTime)) * -1;
            } else {
                this.stepY = ((this.futureY - this.y) * (diff / this.animationTime));
            }

            this.x += this.stepX;
            this.y += this.stepY;

            if (diff >= this.animationTime) {
                this.x = this.futureX;
                this.y = this.futureY;
            }
        }

        let graphics = this.getGraphics();
        graphics.position.x = this.x;
        graphics.position.y = this.y;

        this.activeAnimationList.forEach( a => a.animate());
    }
}
