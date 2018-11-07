// Holds the information about an object's buffer info needed to draw in webGL
class BufferInfo
{
    constructor(_vertices, _indices, _normals, _colours, _glContext)
    {
        this.vertices = _vertices;
        this.indices = _indices;
        this.normals = _normals;
        this.colours = _colours;

        this.vertexBuffer = _glContext.createBuffer();
        _glContext.bindBuffer(_glContext.ARRAY_BUFFER, this.vertexBuffer);
        _glContext.bufferData(_glContext.ARRAY_BUFFER, new Float32Array(this.vertices), _glContext.STATIC_DRAW);

        this.indexBuffer = _glContext.createBuffer();
        _glContext.bindBuffer(_glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        _glContext.bufferData(_glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), _glContext.STATIC_DRAW);

        this.normalBuffer = _glContext.createBuffer();
        _glContext.bindBuffer(_glContext.ARRAY_BUFFER, this.normalBuffer);
        _glContext.bufferData(_glContext.ARRAY_BUFFER, new Float32Array(this.normals), _glContext.STATIC_DRAW);

        this.colourBuffer = _glContext.createBuffer();
        _glContext.bindBuffer(_glContext.ARRAY_BUFFER, this.colourBuffer);
        _glContext.bufferData(_glContext.ARRAY_BUFFER, new Float32Array(this.colours), _glContext.STATIC_DRAW);

    }
}
// Dictionary storing all buffer infos
class BufferHandler
{
    constructor(_glContext)
    {
        this.glContext = _glContext;
        this.buffers = {};
        this.colours = [];

        this.FillWithWhite();
    }

    FillWithWhite()
    {
        const white = [1.0, 1.0, 1.0, 1.0];
        for (let j = 0; j < 1000; j++)
        {
            this.colours = this.colours.concat(white, white, white, white,);
        }
    }

    AddNewBuffer(index, vertices, indices, normals = vertices, colours = this.colours)
    {
        this.buffers[index] = new BufferInfo(vertices, indices, normals, colours, this.glContext);
    }
}
