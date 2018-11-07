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
    /*
          /\v0
      v4/___\v5
      / \  / \
  v1/__v7\/___\v2
          /\v0
      v5/___\v6
      / \  / \
  v2/__v8\/___\v3
          /\v0
      v6/___\v4
      / \  / \
  v3/__v9\/___\v1
          /\v1
      v7/___\v9
      / \  / \
  v2/__v8\/___\v3

     */

    ResetToBaseShape()
    {
        this.vertices = this.baseShapeVertices;
        this.indices = this.baseShapeIndices;
    }
}

TetGeneratorInst = new TetrahedronGenerator();