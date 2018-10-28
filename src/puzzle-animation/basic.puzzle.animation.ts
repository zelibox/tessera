interface IPuzzleAnimation {
    run(params?: any): Promise<any>

    animate();

    getDuration(): number
}

abstract class PuzzleAnimation implements IPuzzleAnimation {
    private puzzle: IPuzzle;
    private startTime: Date;
    private params: any = null;

    constructor(puzzle: IPuzzle) {
        this.puzzle = puzzle;
    }

    abstract onStart()
    abstract animate()
    abstract onEnd()

    protected getParams() {
        return this.params;
    }

    run(params: any = null): Promise<any> {
        this.params = params;
        this.startTime = new Date();

        return new Promise((resolve) => {
            this.onStart();
            setTimeout(() => {
                resolve(this)
            }, this.getDuration())
        }).then(() => {
            this.onEnd();
            this.getPuzzle().deactivateAnimation(this)
        })
    }

    getProgress() {
        return this.getDiff() / this.getDuration();
    }

    getDiff() {
        return ((new Date()).getTime() - this.startTime.getTime());
    }

    getDuration(): number {
        return 300;
    }

    getPuzzle() {
        return this.puzzle;
    }
}
