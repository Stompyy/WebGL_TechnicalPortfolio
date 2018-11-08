const aVertexPosition = 'aVertexPosition';
const aVertexNormal = 'aVertexNormal';
const aVertexColor = 'aVertexColor';
const uProjectionMatrix = 'uProjectionMatrix';
const uModelViewMatrix = 'uModelViewMatrix';
const uNormalMatrix = 'uNormalMatrix';
const uTime = 'uTime';

/**
 * Holds the information about an shader, and attaches it to the glContext
 * @param _glContext the glContext
 * @param _vertexShader the vertex shader
 * @param _fragmentShader the fragment shader
 */
class ShaderInfo
{
    constructor(_glContext, _vertexShader, _fragmentShader)
    {
        this.glContext = _glContext;

        // Load in the shaders
        const vertexShader = this.LoadShader(_vertexShader, this.glContext.VERTEX_SHADER);
        const fragmentShader = this.LoadShader(_fragmentShader, this.glContext.FRAGMENT_SHADER);

        // Create the shader program
        this.shaderProgram = this.glContext.createProgram();
        this.glContext.attachShader(this.shaderProgram, vertexShader);
        this.glContext.attachShader(this.shaderProgram, fragmentShader);
        this.glContext.linkProgram(this.shaderProgram);

        // Check if it has been created successfully
        if (!this.glContext.getProgramParameter(this.shaderProgram, this.glContext.LINK_STATUS))
        {
            alert('Unable to initialize shader program. ' + this.glContext.getProgramInfoLog(this.shaderProgram));
        }

        // Set up shader program.
        this.programInfo =
            {
                // Store the shader program
                program: this.shaderProgram,

                // Look up attribute locations
                attribLocations:
                    {
                        vertexPosition: this.glContext.getAttribLocation(this.shaderProgram, aVertexPosition),
                        vertexNormal: this.glContext.getAttribLocation(this.shaderProgram, aVertexNormal),
                        vertexColor: this.glContext.getAttribLocation(this.shaderProgram, aVertexColor),
                    },
                // Look up uniform locations
                uniformLocations:
                    {
                        projectionMatrix: this.glContext.getUniformLocation(this.shaderProgram, uProjectionMatrix),
                        modelViewMatrix: this.glContext.getUniformLocation(this.shaderProgram, uModelViewMatrix),
                        normalMatrix: this.glContext.getUniformLocation(this.shaderProgram, uNormalMatrix),
                        timeFloat: this.glContext.getUniformLocation(this.shaderProgram, uTime),
                    },
            };

    }

    // Creates, compiles, and returns the shader
    LoadShader(_shaderSource, _type)
    {
        // Create the shader
        const shader = this.glContext.createShader(_type);
        // Send the shaderSource to the shader object
        this.glContext.shaderSource(shader, _shaderSource);
        // Compile the shader program
        this.glContext.compileShader(shader);

        // Check if it has compiled successfully
        if (!this.glContext.getShaderParameter(shader, this.glContext.COMPILE_STATUS)) {
            alert('An error occurred compiling the shader. ' + this.glContext.getShaderInfoLog(shader));
            // Abort
            this.glContext.deleteShader(shader);
            return null;
        }
        return shader;
    }
}

/**
 * Handler class manages a dictionary of shader information
 * @param _glContext is needed for the creating and linking the new shader programs
 */
class ShaderHandler
{
    constructor(_glContext)
    {
        this.glContext = _glContext;
        this.shaders = {};
    }

    // Adds a new shader
    AddNewShader(index, _vertexShader, _fragmentShader)
    {
        this.shaders[index] = new ShaderInfo(this.glContext, _vertexShader, _fragmentShader);
    }
}