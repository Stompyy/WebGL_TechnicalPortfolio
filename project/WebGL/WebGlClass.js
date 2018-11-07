const icosahedron = 'icosahedron';
const tetrahedron = 'tetrahedron';
const grid = 'grid';
const simplexGrid = 'simplexGrid';

const litShader = 'litShader';
const gridWaveShader = 'gridWaveShader';

const topRotate = 'topRotate';
const midRotate = 'midRotate';
const lowStationary = 'lowStationary';
const veryLowStationary = 'veryLowStationary';

class WebGlClass
{
    constructor()
    {
        this.time = 0.0;
        this.scrollY = 0.0;
        this.parallexEffect = 70;
        this.mouseX = 0.0;
        this.mouseY = 0.0;
        this.meshSubDivisions = 0;

        NoiseInst.Seed(80085);
    }

    Run()
    {
        this.InitContext();
        this.InitShaders();
        this.InitBuffers();

        setInterval(function()
        {
            WebGlClassInst.ResizeCanvas();
            WebGlClassInst.DrawScene(0.02);//deltaTime);
        },17);
    }

    DrawScene(deltaTime)
    {
        this.SetUpContextForDraw();
        this.UpdateRenderTransforms();

        this.DrawObject(icosahedron, litShader, topRotate, this.glContext.TRIANGLES);
        this.DrawObject(tetrahedron, litShader, midRotate, this.glContext.TRIANGLES);
        this.DrawObject(grid, gridWaveShader, lowStationary, this.glContext.LINES);
        this.DrawObject(simplexGrid, gridWaveShader, veryLowStationary, this.glContext.LINES);

        // Update the rotation for the next draw or
        this.time += deltaTime;
    }

    DrawObject(bufferIndex, shaderIndex, renderTransformIndex, drawType)
    {
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        //const aspect = this.glContext.canvas.clientWidth / this.glContext.canvas.clientHeight;
        const aspect = 2.0 / 3.0;
        const zNear = 0.1;
        const zFar = 100.0;

        const projectionMatrix = Matrix.CreatePerspectiveFieldOfView(
            fieldOfView,
            aspect,
            zNear,
            zFar
        );

        let modelViewMatrix = RenderTransformHandlerInst.Update(renderTransformIndex);
        let normalMatrix = modelViewMatrix.Invert().Transpose();

        // vertexPosition attribute
        {
            const numComponents = 3;
            const type = this.glContext.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.bufferHandler.buffers[bufferIndex].vertexBuffer);

            this.glContext.vertexAttribPointer(this.shaderHandler.shaders[shaderIndex].programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.glContext.enableVertexAttribArray(this.shaderHandler.shaders[shaderIndex].programInfo.attribLocations.vertexPosition);
        }

        // vertexColour attribute
        {
            const numComponents = 4;
            const type = this.glContext.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.bufferHandler.buffers[bufferIndex].colourBuffer);

            this.glContext.vertexAttribPointer(this.shaderHandler.shaders[shaderIndex].programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.glContext.enableVertexAttribArray(this.shaderHandler.shaders[shaderIndex].programInfo.attribLocations.vertexColor);
        }

        // Normals
        {
            const numComponents = 3;
            const type = this.glContext.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.bufferHandler.buffers[bufferIndex].normalBuffer);
            this.glContext.vertexAttribPointer(
                this.shaderHandler.shaders[shaderIndex].programInfo.attribLocations.vertexNormal,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.glContext.enableVertexAttribArray(
                this.shaderHandler.shaders[shaderIndex].programInfo.attribLocations.vertexNormal);
        }

        // Tell WebGL which indices to use to index the vertices
        this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, this.bufferHandler.buffers[bufferIndex].indexBuffer);

        // Tell WebGL which program to use
        this.glContext.useProgram(this.shaderHandler.shaders[shaderIndex].shaderProgram);

        // Set the shader uniforms
        this.glContext.uniformMatrix4fv(
            this.shaderHandler.shaders[shaderIndex].programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix.m);
        this.glContext.uniformMatrix4fv(
            this.shaderHandler.shaders[shaderIndex].programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix.m);
        this.glContext.uniform1f(
            this.shaderHandler.shaders[shaderIndex].programInfo.uniformLocations.timeFloat,
            this.time);
        this.glContext.uniformMatrix4fv(
            this.shaderHandler.shaders[shaderIndex].programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix.m);

        let vertexCount = 0;

        // Temp until figure out grid indice.length issue
        if (drawType === this.glContext.LINES)
        {
            vertexCount = 5162;// 30*30: 5162 // 20*20: 2242 // 10*10: 522
        }
        else
        {
            vertexCount = this.bufferHandler.buffers[bufferIndex].indices.length;
        }

        const type = this.glContext.UNSIGNED_SHORT;
        const offset = 0;

        this.glContext.drawElements(drawType, vertexCount, type, offset);
    }

    InitContext()
    {
        const canvas = document.querySelector('#glcanvas');
        this.glContext = canvas.getContext('webgl', { preserveDrawingBuffer:true }) || canvas.getContext('experimental-webgl', { preserveDrawingBuffer:true });

        // If no GL context, abort
        if (!this.glContext) { alert('Unable to initialize WebGL.'); }

        this.devicePixelRatio = window.devicePixelRatio;
    }

    InitShaders()
    {
        this.shaderHandler = new ShaderHandler(this.glContext);

        this.shaderHandler.AddNewShader(litShader, VertexShadersInst.GetLitVertexShader(), FragmentShadersInst.GetLitFragmentShader());
        this.shaderHandler.AddNewShader(gridWaveShader, VertexShadersInst.GetSineVertexShader(), FragmentShadersInst.GetSineFragmentShader());
    }

    InitBuffers()
    {
        // Build the objects to draw
        this.bufferHandler = new BufferHandler(this.glContext);

        this.bufferHandler.AddNewBuffer(grid,
            GridGeneratorInst.CalculateMeshPositions(30,30),
            GridGeneratorInst.CalculateMeshIndices(30,30));

        // True argument tells the generator to generate a simplex grid
        this.bufferHandler.AddNewBuffer(simplexGrid,
            GridGeneratorInst.CalculateMeshPositions(30,30, true),
            GridGeneratorInst.CalculateMeshIndices(30,30));

        this.UpdateShapeBuffers();
    }

    StepSubdivisions()
    {
        // Any more than 6 will enter too large a loop and browser will crash
        if (this.meshSubDivisions < 6)
        {
            this.meshSubDivisions++;

            let newSubdividedShape = MeshSubdividerInst.AddSubdivision(IcoGeneratorInst);
            IcoGeneratorInst.vertices = newSubdividedShape.vertices;
            IcoGeneratorInst.indices = newSubdividedShape.indices;

            newSubdividedShape = MeshSubdividerInst.AddSubdivision(TetGeneratorInst);
            TetGeneratorInst.vertices = newSubdividedShape.vertices;
            TetGeneratorInst.indices = newSubdividedShape.indices;
            this.UpdateShapeBuffers();
        }
        else
        {
            this.ResetToBaseShapes();
        }
    }

    UpdateShapeBuffers()
    {
        // Overwrite the dictionary entries with the new values
        this.bufferHandler.AddNewBuffer(icosahedron,
            IcoGeneratorInst.vertices,
            IcoGeneratorInst.indices);
        this.bufferHandler.AddNewBuffer(tetrahedron,
            TetGeneratorInst.vertices,
            TetGeneratorInst.indices);
    }

    ResetToBaseShapes()
    {
        // Reset - no timeout value entered, but a shortcut to ensure function called after click event subdivision
        // Keeps it simple
        setTimeout(function () {
            WebGlClassInst.meshSubDivisions = 0;
            IcoGeneratorInst.ResetToBaseShape();
            TetGeneratorInst.ResetToBaseShape();
            WebGlClassInst.UpdateShapeBuffers();
        },0);
    }

    UpdateRenderTransforms()
    {
        RenderTransformHandlerInst.SetRenderTransform(
            topRotate,
            new Vector3(0.0, 2.0+this.scrollY/this.parallexEffect /* + NoiseInst.simplex2(this.time, this.time)*/, -20.0),
            new Vector3(this.mouseY, this.mouseX, 0.0)
        );
        RenderTransformHandlerInst.SetRenderTransform(
            midRotate,
            new Vector3(0.0, -1+this.scrollY/this.parallexEffect, -20.0),
            new Vector3(this.mouseY, this.mouseX, 0.0)
        );
        RenderTransformHandlerInst.SetRenderTransform(
            lowStationary,
            new Vector3(-14.5, -2.0+this.scrollY/this.parallexEffect, -40.0),
            new Vector3(97 * Math.PI/180, 0.0, 0.0)
        );
        RenderTransformHandlerInst.SetRenderTransform(
            veryLowStationary,
            new Vector3(-14.5, -12.0+this.scrollY/this.parallexEffect, -40.0),
            new Vector3(92 * Math.PI/180, 0.0, 0.0)
        );
    }

    ResizeCanvas()
    {
        // Resize gl context here
        this.glContext.canvas.width = window.innerWidth;//Math.floor(window.innerWidth * this.devicePixelRatio);
        this.glContext.canvas.height = Math.floor(window.innerWidth * 1.5);
        this.glContext.viewport(0, 0, this.glContext.canvas.width, this.glContext.canvas.height);
    }

    SetUpContextForDraw()
    {
        this.glContext.clearColor(0.0, 0.0, 0.0, 1.0);      // Clear to black, fully opaque
        this.glContext.clearDepth(1.0);                     // Clear everything
        this.glContext.enable(this.glContext.DEPTH_TEST);   // Enable depth testing
        this.glContext.depthFunc(this.glContext.LEQUAL);    // Near things obscure far things

        // Clear the canvas before we start drawing on it.
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT);
    }
}

// Singleton declaration
WebGlClassInst = new WebGlClass();