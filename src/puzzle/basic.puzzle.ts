interface IPuzzle {
    render()

    getCell(): number;

    getRow(): number;

    setFigure(figure: IFigure)

    getFigure(): IFigure

    remove();

    clearGraphics();

    setPosition(x: number, y: number): void;

    getColor(): number;
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

    getGraphics() {
        if (!this.graphics) {
            let width = this.figure.getScene().puzzleSize - 1;
            let height = this.figure.getScene().puzzleSize - 1;

            let app = this.figure.getScene().getApp();
            this.graphics = new PIXI.Graphics();
            this.graphics.lineStyle(0);
            this.graphics.beginFill(this.getColor(), 1);
            this.graphics.drawRoundedRect(0, 0, width, height, Math.floor(width * 0.30));
            this.graphics.endFill();
            app.stage.addChild(this.graphics);
        }

        return this.graphics;
    }


    render() {
        let x = this.cell * this.figure.getScene().puzzleSize;
        let y = this.row * this.figure.getScene().puzzleSize;
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
    }
}


class SimplePuzzle extends Puzzle {
    getColor(): number {
        return 0x00adb5;
    }
}

class BorderPuzzle extends Puzzle {
    getColor(): number {
        return 0x393e46;
    }
}

class ShadowPuzzle extends Puzzle {
    private blurFilter: PIXI.filters.BlurFilter;
    private alpha: number = 0;
    private renderBlurStartDate: Date = new Date();
    getColor(): number {
        return 0x00adb5;
    }

    getGraphics(): PIXI.Graphics {
        if (!this.graphics) {
            let graphics = super.getGraphics();
            graphics.alpha = 0.10;
            this.blurFilter = new PIXI.filters.BlurFilter();
            this.blurFilter.blur = 0;
            // graphics.filters = [this.blurFilter];
        }

        return this.graphics;
    }

    setAlpha(blur:number) {
        this.alpha = blur;
        this.renderBlurStartDate = new Date();
    }

    render(): void {
        super.render();
        let diff = (new Date().getTime() - this.renderBlurStartDate.getTime() / this.animationTime);
        if (diff > 1) {
            diff = 1;
        }
        this.getGraphics().alpha = this.alpha * diff;
        // this.blurFilter.blur = this.blur * diff;
    }
}
