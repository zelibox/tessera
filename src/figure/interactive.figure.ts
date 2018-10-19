abstract class InteractiveFigure extends Figure {
    private tickCount: number = 0;

    render(): void {
        this.tickCount++;
        if ((this.tickCount % 30) === 0) {
            this.move("down")
        }
        super.render();
    }
}

class InteractiveFigureI extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
        ];
    }
}

class InteractiveFigureO extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [1, 1],
            [1, 1]
        ];
    }
}

class InteractiveFigureT extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];
    }
}

class InteractiveFigureS extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ];
    }
}

class InteractiveFigureZ extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ];
    }
}

class InteractiveFigureJ extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ];
    }
}

class InteractiveFigureL extends InteractiveFigure {
    initShape(): number[][] {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ];
    }
}
