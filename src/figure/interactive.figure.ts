///<reference path="figure.ts"/>
namespace Tessera.Figure {
    abstract class InteractiveFigure extends Figure.Figure {
        private tickCount: number;

        render(): void {
            this.tickCount++;
            if ((this.tickCount % 30) === 0) {
                this.move("down")
            }
            super.render();
        }
    }
    export class InteractiveFigureI extends InteractiveFigure {
        initShape(): number[][] {
            return [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ];
        }
    }

    export class InteractiveFigureO extends InteractiveFigure {
        initShape(): number[][] {
            return [
                [1, 1],
                [1, 1]
            ];
        }
    }

    export class InteractiveFigureT extends InteractiveFigure {
        initShape(): number[][] {
            return [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0],
            ];
        }
    }

    export class InteractiveFigureS extends InteractiveFigure {
        initShape(): number[][] {
            return [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0],
            ];
        }
    }

    export class InteractiveFigureZ extends InteractiveFigure {
        initShape(): number[][] {
            return [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
            ];
        }
    }

    export class InteractiveFigureJ extends InteractiveFigure {
        initShape(): number[][] {
            return [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0],
            ];
        }
    }

    export class InteractiveFigureL extends InteractiveFigure {
        initShape(): number[][] {
            return [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1],
            ];
        }
    }
}