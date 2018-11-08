/**
 * Holds the information about an object's buffer info needed to draw in webGL
 * @param _vertices
 * @param _indices
 * @param _normals
 * @param _colours
 * @param _glContext
 */
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

/**
 * Handler class manages a dictionary of buffers information
 * @param _glContext is needed for the BufferInfo instantiating which creates and binds the buffers to the glContext
 */
class BufferHandler
{
    constructor(_glContext)
    {
        this.glContext = _glContext;
        this.buffers = {};
        this.colours = [];

        this.FillWithWhite();
    }

    // Fills an list with the colour white. This project is fully greyscale
    FillWithWhite()
    {
        const white = [1.0, 1.0, 1.0, 1.0];
        for (let j = 0; j < 1000; j++)
        {
            this.colours = this.colours.concat(white, white, white, white,);
        }
    }

    // Adds a new buffer to the dictionary. As shapes are symmetrical geometric polygons, normals all face out from the centre so are equivalent to the vertex position
    AddNewBuffer(index, vertices, indices, normals = vertices, colours = this.colours)
    {
        this.buffers[index] = new BufferInfo(vertices, indices, normals, colours, this.glContext);
    }
}
