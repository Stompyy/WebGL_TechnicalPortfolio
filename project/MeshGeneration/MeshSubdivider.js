class MeshSubdivider
{
    ReverseLookUp(array, value)
    {
        for (let i = 0; i < array.length; i++)
        {
            if (array[i] === value)
            {
                return i;
            }
        }
        return null;
    }

    CheckIfDuplicatedAddToArrayAndGetIndice(v, vector3Array)
    {
        if (vector3Array.includes(v))
        {
            // If vertex already processed, do not add to vertices, return index of vert in vector3 array for indice number
            return this.ReverseLookUp(vector3Array, v);
        }
        else
        {
            // Update the local array to allow look ups for future vertex look ups for duplications
            vector3Array.push(v);
            return vector3Array.length-1;
        }
    }

    AddSubdivision(shapeInstance)
    {
        let verticesArray = shapeInstance.vertices,
            indicesArray = shapeInstance.indices;
        // Convert vert array into an array of Vector3s
        let vector3Array = [];
        for (let i = 0; i < verticesArray.length; i+=3)
        {
            vector3Array.push(new Vector3(verticesArray[i], verticesArray[i+1], verticesArray[i+2]));
        }

        let newIndices = [];
        for (let i = 0; i < indicesArray.length; i+=3)
        {
            // Retrieve the vertices for each triangle being drawn currently
            let v0 = vector3Array[indicesArray[i]],
                v1 = vector3Array[indicesArray[i+1]],
                v2 = vector3Array[indicesArray[i+2]];

            // Get the midpoints
            let v3 = Vector3.ExtrudePoint(Vector3.Midpoint(v0, v1)),
                v4 = Vector3.ExtrudePoint(Vector3.Midpoint(v0, v2)),
                v5 = Vector3.ExtrudePoint(Vector3.Midpoint(v1, v2));

            // Next do the indices
            // Check for duplication before adding vertex to vertex array
            let i0 = this.CheckIfDuplicatedAddToArrayAndGetIndice(v0, vector3Array),
                i1 = this.CheckIfDuplicatedAddToArrayAndGetIndice(v1, vector3Array),
                i2 = this.CheckIfDuplicatedAddToArrayAndGetIndice(v2, vector3Array),

                i3 = this.CheckIfDuplicatedAddToArrayAndGetIndice(v3, vector3Array),
                i4 = this.CheckIfDuplicatedAddToArrayAndGetIndice(v4, vector3Array),
                i5 = this.CheckIfDuplicatedAddToArrayAndGetIndice(v5, vector3Array);

            /*
                          /\v0
                      v3/___\v4
                      / \  / \
                  v1/__v5\/___\v2
            */

            newIndices.push(
                i0, i3, i4,
                i1, i5, i3,
                i2, i4, i5,
                i5, i4, i3,
            );

        }

        // Copy the vector3Array into the ths.vertices array, have to change from Vector3 to float array
        let returnVerticesArray = [];
        for (let i = 0; i < vector3Array.length; i++)
        {
            returnVerticesArray = returnVerticesArray.concat(vector3Array[i].ToArray());
        }
        return {
            vertices: returnVerticesArray,
            indices: newIndices
        }
    }
}

MeshSubdividerInst = new MeshSubdivider();