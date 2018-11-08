class Scene {
    public puzzleSize = 20;
    public rows = 22;
    public cols = 12;
    private interactiveFigure: InteractiveFigure;
    private borderFigure: BorderFigure;
    private wrapFigure: WrapFigure;
    private shadowFigure: ShadowFigure;
    private pause: boolean = false;
    private customFigures: IFigure[] = [];

    public assets = {
        control: {
            larger: 'assets/control/larger.png',
            numbers: 'assets/control/numbers.png',
            pause: 'assets/control/pause.png'
        },
        simplePuzzle: {
            blue: 'assets/puzzle/simple/blue.png',
            green: 'assets/puzzle/simple/green.png',
            red: 'assets/puzzle/simple/red.png',
            yellow: 'assets/puzzle/simple/yellow.png',
        },
        borderPuzzle: {
            left: 'assets/puzzle/border/left.png',
            mid: 'assets/puzzle/border/mid.png',
            right: 'assets/puzzle/border/right.png',
        },
        magicPuzzle: {
            rain: 'assets/puzzle/magic/rain.png',
            thief: 'assets/puzzle/magic/thief.png',
            gear: 'assets/puzzle/magic/gear.png',
            weight: 'assets/puzzle/magic/weight.png',
        },
        shadowPuzzle: {
            shadow: 'assets/puzzle/shadow/shadow.png',
        }
    };
    private activePoints = true;

    constructor(private app: PIXI.Application) {
        this.wrapFigure = new WrapFigure(this);

        this.borderFigure = new BorderFigure(this);
        this.borderFigure.insertPuzzles(
            this.generatePuzzles(this.borderFigure.getCountPuzzlePlaces(), BorderPuzzle)
        );
        this.shadowFigure = new ShadowFigure(this);

        this.renderPoints();
        this.initInteractiveFigure();
    }

    getApp(): PIXI.Application {
        return this.app;
    }

    getAllAssets() {
        let assets = [];
        for (let assetType in this.assets) {
            for (let assetTypeKey in this.assets[assetType]) {
                if (this.assets[assetType].hasOwnProperty(assetTypeKey)) {
                    assets.push(this.assets[assetType][assetTypeKey]);
                }
            }
        }
        return assets;
    }

    initInteractiveFigure() {
        let random = (Math.floor(Math.random() * (17 - 1 + 1)) + 1);
        if (random == 9) {
            this.interactiveFigure = new WeightMagicFigure(this);
        } else if (random == 10) {
            this.interactiveFigure = new GearMagicFigure(this);
        } else if (random == 11) {
            this.interactiveFigure = new ThiefMagicFigure(this);
        } else if (random == 12) {
            this.interactiveFigure = new RainMagicFigure(this);
        } else {
            let figures = [
                InteractiveFigureDot,
                InteractiveFigureI,
                InteractiveFigureO,
                InteractiveFigureT,
                InteractiveFigureS,
                InteractiveFigureZ,
                InteractiveFigureJ,
                InteractiveFigureL,
                InteractiveFigureISmall,
                InteractiveFigureILSmall,
                InteractiveFigureIMiddle,
            ];
            this.interactiveFigure = new figures[Math.floor(Math.random() * figures.length)](this);
        }

        this.interactiveFigure.onUpdateShape(this.shadowFigure.onUpdateShapeInteractiveFigure)
    }

    public getInteractiveFigure() {
        return this.interactiveFigure;
    }

    public getBorderFigure() {
        return this.borderFigure;
    }

    public getWrapFigure() {
        return this.wrapFigure;
    }

    public getShadowFigure() {
        return this.shadowFigure;
    }

    getPuzzle(cell, row): IPuzzle {
        let figures = this.customFigures.concat([
            this.borderFigure,
            this.wrapFigure
        ]);


        for (let figure of [this.borderFigure, this.wrapFigure]) {
            for (let puzzle of figure.getPuzzles()) {
                if (((puzzle.getCell()) === cell)
                    && ((puzzle.getRow()) === row)) {
                    return puzzle;
                }
            }
        }
        return null;
    }

    getAllPuzzles(): IPuzzle[] {
        let puzzles = [];

        let figures = this.customFigures.concat([
            this.shadowFigure,
            this.interactiveFigure,
            this.borderFigure,
            this.wrapFigure
        ]);

        for (let figure of figures) {
            for (let puzzle of figure.getPuzzles()) {
                puzzles.push(puzzle);
            }
        }

        return puzzles;
    }

    generatePuzzles(count, type) {
        let arr = [];
        for (let i = 0; i < count; i++) {
            arr.push(new type());
        }

        return arr;
    }

    addCustomFigure(figure: IFigure) {
        this.customFigures.push(figure)
    }

    removeCustomFigure(figure: IFigure) {
        this.customFigures.splice(this.customFigures.indexOf(figure), 1);
    }

    render() {
        if (this.pause) {
            return;
        }

        let figures = this.customFigures.concat([
            this.shadowFigure,
            this.interactiveFigure,
            this.borderFigure,
            this.wrapFigure
        ]);

        for (let figure of figures) {
            figure.render();
        }
    }

    setPause(pause: boolean) {
        this.pause = pause;
    }

    getPause() {
        return this.pause;
    }

    getPoints(): any {
        let points = window.localStorage.getItem('points');
        if (points === null) {
            window.localStorage.setItem('points', '0');
        }

        return window.localStorage.getItem('points');
    }

    disablePoints() {
        this.activePoints = false;
    }

    enablePoints() {
        this.activePoints = true;
    }

    addPoint(cost = 1) {
        if (this.activePoints) {
            window.localStorage.setItem('points', (this.getPoints() * 1 + cost).toString());
            this.renderPoints()
        }
    }

    renderPoints() {
        let numbers = this.getPoints().split('');
        let numberElements = $('.points').find('.d');
        for (let i = numberElements.length; i < numbers.length; i++) {
            $('.points').append('<span class="d">');
        }
        $('.points').find('.d').each((i, e) => {
            $(e)['attr']('class', `d p-${numbers[i]}`);
        });
    }


}
