class GridGenerator
{
    constructor()
    {

    }
    CalculateMeshPositions(width, length, isSimplexGrid = false)
    {
        let total = width*length;
        let p = [];

        for (let i = 0; i < total; i++)
        {
            let x = i%width,
                y = Math.floor(i/width);

            let tempArray = [
                x, y,
            ];
            p = p.concat(tempArray);

            // Then the .z
            if (isSimplexGrid === true)
            {
                p.push(NoiseInst.simplex2(x/4.0, y/4.0)/2.0);
            }
            else
            {
                p.push(0.0);
            }
        }
        return p;
    }

    CalculateMeshIndices(width, length)
    {
        let total = width*length;
        let p = [];

        // First draw the last two border lines that the pattern doesn't cover
        // It weirdly doesn't like this being done last
        for (let x = width-1; x < total-width; x+=width)
        {
            let tempArray = [x,x+width];
            p = p.concat(tempArray);
        }
        for (let x = total-width; x < total-1; x++)
        {
            let tempArray = [x,x+1];
            p = p.concat(tempArray);
        }

        // Look at each row in turn, += width shows the offset into the vertex array for the next row
        for (let y = 0; y < total; y += width)
        {
            // Look at each entry in that row except the last one, that gets drawn in later
            for (let x = 0; x < width-1; x++)
            {
                let tempArray = [
                    x+y, x+y+1,         // horiz
                    x+y, x+y+width,     // vert
                    x+y, x+y+width+1,   // diag
                ];
                p = p.concat(tempArray);
            }
        }
        return p;
    }
}

GridGeneratorInst = new GridGenerator();