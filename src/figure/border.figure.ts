class BorderFigure extends Figure {
        initShape(): number[][] {
            let rows = config.rows;
            let cols = config.cols;
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
