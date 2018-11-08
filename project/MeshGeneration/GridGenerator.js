/**
 * Procedurally generates vertices and indices lists for a grid
 * @param width the width of the grid in squares
 * @param length the length of the grid in squares
 * @param isSimplexGrid whether to apply simplex noise to each vertices height
 */
class GridGenerator
{
    // Returns the list of generated vertices
    CalculateMeshPositions(width, length, isSimplexGrid = false)
    {
        // The number of vertices to generate
        let total = width*length;

        // The list of vertices to return
        let verticesList = [];

        // Increment a count through each vertex to generate
        for (let i = 0; i < total; i++)
        {
            // The x is the remainder of the i/width (discounts the length portion)
            let x = i%width,
                // The y is the whole portion of the i/width (discounts the width portion)
                y = Math.floor(i/width);

            verticesList = verticesList.concat([x, y]);

            // Then the z value
            if (isSimplexGrid === true)
            {
                // If simplex noise is required, retrieve the height from the NoiseInst
                verticesList.push(NoiseInst.simplex2(x/4.0, y/4.0)/2.0);
            }
            else
            {
                // Else leave the height at zero for a flat grid
                verticesList.push(0.0);
            }
        }
        return verticesList;
    }

    // Returns the list of generated indices
    CalculateMeshIndices(width, length)
    {
        // The number of vertices to draw between
        let total = width*length;

        // The list of indices to return
        let indicesList = [];

        // First draw the last two border lines that the pattern doesn't cover
        for (let x = width-1; x < total-width; x+=width)
        {
            // The draw between lengthwise vertices
            indicesList = indicesList.concat([x,x+width]);
        }
        for (let x = total-width; x < total-1; x++)
        {
            // The draw between widthwise vertices
            indicesList = indicesList.concat([x,x+1]);
        }

        // Look at each row in turn, += width shows the offset into the vertex array for the next row
        for (let y = 0; y < total; y += width)
        {
            // Look at each entry in that row except the last one, that gets drawn in later
            for (let x = 0; x < width-1; x++)
            {
                let tempArray = [
                    x+y, x+y+1,         // horiz line
                    x+y, x+y+width,     // vert line
                    x+y, x+y+width+1,   // diag line
                ];
                // Add to the return list
                indicesList = indicesList.concat(tempArray);
            }
        }
        return indicesList;
    }
}

// Singleton class
GridGeneratorInst = new GridGenerator();