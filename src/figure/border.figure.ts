///<reference path="figure.ts"/>
namespace Tessera.Figure {
    export class BorderFigure extends Figure.Figure {
        initShape(): number[][] {
            let rows = 22;
            let cols = 12;
            let shape = [];
            for (let r = 0; r < rows; r++) {
                let row = [];
                for (let c = 0; c < cols; c++) {
                    let v = 0;
                    if (r === 0 || r === (rows - 1) || c === 0 || c === (cols - 1)) {
                        v = 1
                    }
                    row.push(v)
                }
                shape.push(row)
            }
            return shape;
        }
    }
}