class MeshSubdivider
{
    // Reverse look up of a value into an array. Returns the index.
    // Should be in a utilities class but it is only used here
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

    // Checks if value is in the list, adds it if not, and returns the value's place in that list
    CheckIfDuplicatedAddToListAndGetIndex(value, list)
    {
        if (list.includes(value))
        {
            // If vertex already processed, do not add to vertices, return index of value in list for index number
            return this.ReverseLookUp(list, value);
        }
        else
        {
            // Update the list to allow future look ups for duplications
            list.push(value);
            return list.length-1;
        }
    }

    // Takes the shapeInstance
    AddSubdivision(shapeInstance)
    {
        // Get the relevant information from the shapeInstance
        let verticesArray = shapeInstance.vertices,
            indicesArray = shapeInstance.indices;

        // Convert verticesList into a list of Vector3s
        let vector3Array = [];
        for (let i = 0; i < verticesArray.length; i+=3)
        {
            vector3Array.push(new Vector3(verticesArray[i], verticesArray[i+1], verticesArray[i+2]));
        }

        // declare an empty list to fill with new indices
        let returnIndices = [];

        // Step through the indices for the current shape instance to retrieve the current triangles
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
            let i0 = this.CheckIfDuplicatedAddToListAndGetIndex(v0, vector3Array),
                i1 = this.CheckIfDuplicatedAddToListAndGetIndex(v1, vector3Array),
                i2 = this.CheckIfDuplicatedAddToListAndGetIndex(v2, vector3Array),

                i3 = this.CheckIfDuplicatedAddToListAndGetIndex(v3, vector3Array),
                i4 = this.CheckIfDuplicatedAddToListAndGetIndex(v4, vector3Array),
                i5 = this.CheckIfDuplicatedAddToListAndGetIndex(v5, vector3Array);

            /*
                          /\v0
                      v3/___\v4
                      / \  / \
                  v1/__v5\/___\v2
            */

            // Push the new indices onto the return list
            returnIndices.push(
                i0, i3, i4,
                i1, i5, i3,
                i2, i4, i5,
                i5, i4, i3,
            );
        }

        // Copy the vector3Array into the returnVertices list, have to change from Vector3 to float array
        let returnVertices = [];
        for (let i = 0; i < vector3Array.length; i++)
        {
            // Populate the new list
            returnVertices = returnVertices.concat(vector3Array[i].ToArray());
        }

        // Return an object which contains the new vertices and indices
        return {
            vertices: returnVertices,
            indices: returnIndices
        }
    }
}

// Singleton class
MeshSubdividerInst = new MeshSubdivider();