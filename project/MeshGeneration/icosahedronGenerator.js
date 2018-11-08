class IcosahedronGenerator
{
    constructor()
    {
        this.baseShapeVertices = [
            0.0, 0.0, 1.0,

            0.894425, 0.0, 0.447215,
            0.276385, 0.85064, 0.447215,
            -0.72360, 0.52572, 0.447215,
            -0.72360, -0.52572, 0.447215,
            0.276385, -0.85064, 0.447215,

            0.7236, 0.52572, -0.447215,
            -0.276385, 0.85064, -0.447215,
            -0.894425, 0.0, -0.447215,
            -0.276385, -0.85064, -0.447215,
            0.7236, -0.52572, -0.447215,

            0.0, 0.0, -1.0,
        ];
        this.vertices = this.baseShapeVertices;

        this.baseShapeIndices = [
            0,1,2, 0,2,3, 0,3,4, 0,4,5, 0,5,1,
            1,6,2, 2,7,3, 3,8,4, 4,9,5, 5,10,1,
            10,6,1, 6,7,2, 7,8,3, 8,9,4, 9,10,5,
            11,6,7, 11,7,8, 11,8,9, 11,9,10, 11,10,6,
        ];
        this.indices = this.baseShapeIndices;
    }

    ResetToBaseShape()
    {
        this.vertices = this.baseShapeVertices;
        this.indices = this.baseShapeIndices;
    }
}

// Singleton class
IcoGeneratorInst = new IcosahedronGenerator();