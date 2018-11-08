class TetrahedronGenerator
{
    constructor()
    {
        this.baseShapeVertices = [
            0.0, 0.0, 1,
            Math.sqrt(8.0 / 9.0), 0.0, -1.0 / 3.0,
            -Math.sqrt(2.0 / 9.0), Math.sqrt(2.0 / 3.0), -1.0 / 3.0,
            -Math.sqrt(2.0 / 9.0), -Math.sqrt(2.0 / 3.0), -1.0 / 3.0
        ];
        this.vertices = this.baseShapeVertices;

        this.baseShapeIndices = [
            0,1,2, 0,2,3, 0,3,1, 1,2,3
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
TetGeneratorInst = new TetrahedronGenerator();