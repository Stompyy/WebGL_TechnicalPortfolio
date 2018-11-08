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

const gridWidth = 30;
const gridLength = 30;
const timeStep = 0.02;

/**
 * My object orientated class implementation of WebGL!
 */
class WebGlClass
{
    constructor()
    {
        // Used by the shader programs to progress a sine wave
        this.time = 0.0;

        // Updated by an event listener for scrolling to be used to apply a parallax effect when scrolling the page
        this.scrollY = 0.0;
        this.parallexEffect = 70;

        // Updated by event listeners to be used applying rotations to certain scene objects
        this.mouseX = 0.0;
        this.mouseY = 0.0;

        // The count for subdivisions applied to the polyhedron
        this.meshSubDivisions = 0;

        // Seed the simplex noise generator
        NoiseInst.Seed(80085);
    }

    // Called by the html page when loaded. The entry point for the program
    Run()
    {
        // These Init functions initialise their respective components
        // Abstracted into functions purely for readability, and to show intent
        this.InitContext();
        this.InitShaders();
        this.InitBuffers();
        this.InitObjects();

        // The main loop
        setInterval(function()
        {
            WebGlClassInst.DrawScene();
        },17);
    }

    // Updates all values and draws each object
    DrawScene()
    {
        // Again, abstracted away functions for readability and statement of intent
        this.ResizeCanvas();
        this.SetUpContextForDraw();
        this.UpdateRenderTransforms();

        // Go through each object stored in the ObjectHandlerInst and draw
        for (let i = 0; i < ObjectHandlerInst.objects.length; i++)
        {
            let object = ObjectHandlerInst.objects[i];
            this.DrawObject(object.bufferIndex, object.shaderIndex, object.renderTransformIndex, object.drawType);
        }

        // Update the value used for the dynamic sine shader for the next draw
        // Instead of a call to get real time passing, using a literal value for ease and inexpensive value
        this.time += timeStep;
    }

    // Use the passed in indexes to look up the appropriate values for this draw
    DrawObject(bufferIndex, shaderIndex, renderTransformIndex, drawType)
    {
        // Update the model view matrix
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

        // Normals (all draws currently using the vertex position for the normals as mathematically centred models.
        // Have left in for completeness
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
            this.projectionMatrix.m);
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

        // vertexCount is the number of indices
        let vertexCount = this.bufferHandler.buffers[bufferIndex].indices.length;
        const offset = 0;

        // Tell WebGL to draw it!
        this.glContext.drawElements(drawType, vertexCount, this.glContext.UNSIGNED_SHORT, offset);
    }

    // Initialise the WebGL context
    InitContext()
    {
        const canvas = document.querySelector('#glcanvas');
        this.glContext = canvas.getContext('webgl', { preserveDrawingBuffer:true }) || canvas.getContext('experimental-webgl', { preserveDrawingBuffer:true });

        // If no GL context, abort
        if (!this.glContext) { alert('Unable to initialize WebGL.'); }

        // As we now know we can draw, start by setting up the projection matrix
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        // For scrolling effect to show, height = width * 1.5. Leaves a nice amount of scroll room
        const aspect = 2.0 / 3.0;
        const zNear = 0.1;
        const zFar = 100.0;

        // Set up the projectionMatrix
        this.projectionMatrix = Matrix.CreatePerspectiveFieldOfView(
            fieldOfView,
            aspect,
            zNear,
            zFar
        );
    }

    // Set up the shaderHandler with the glContext, load in the shader programs, link, and store in a dictionary
    InitShaders()
    {
        this.shaderHandler = new ShaderHandler(this.glContext);

        this.shaderHandler.AddNewShader(litShader, VertexShadersInst.GetLitVertexShader(), FragmentShadersInst.GetLitFragmentShader());
        this.shaderHandler.AddNewShader(gridWaveShader, VertexShadersInst.GetSineVertexShader(), FragmentShadersInst.GetSineFragmentShader());
    }

    // Set up the bufferHandler with the glContext, load in the vertices and indices, and store in a dictionary
    InitBuffers()
    {
        this.bufferHandler = new BufferHandler(this.glContext);

        this.bufferHandler.AddNewBuffer(grid,
            GridGeneratorInst.CalculateMeshPositions(gridWidth,gridLength),
            GridGeneratorInst.CalculateMeshIndices(gridWidth,gridLength));

        // True argument tells the generator to generate a simplex grid
        this.bufferHandler.AddNewBuffer(simplexGrid,
            GridGeneratorInst.CalculateMeshPositions(gridWidth,gridLength, true),
            GridGeneratorInst.CalculateMeshIndices(gridWidth,gridLength));

        // As these are changed throughout the program by subdivision, abstract out so no code duplication
        this.UpdateShapeBuffers();
    }

    // Set up the objectHandler with all the different desired indexes for the buffers, shaders, and render transforms, and store in a dictionary
    InitObjects()
    {
        ObjectHandlerInst.AddNewObject(icosahedron, litShader, topRotate, this.glContext.TRIANGLES);
        ObjectHandlerInst.AddNewObject(tetrahedron, litShader, midRotate, this.glContext.TRIANGLES);
        ObjectHandlerInst.AddNewObject(grid, gridWaveShader, lowStationary, this.glContext.LINES);
        ObjectHandlerInst.AddNewObject(simplexGrid, gridWaveShader, veryLowStationary, this.glContext.LINES);
    }

    // Procedurally subdivides the polyhedron into new shapes
    StepSubdivisions()
    {
        // Any more than this will enter too large a loop and loop time will take minutes to perform
        if (this.meshSubDivisions < 5)
        {
            // Increment the count
            this.meshSubDivisions++;

            // Call the subdivision function on each polyhedron, then copy out the returned values back into the polyhedron instance
            let newSubdividedShape = MeshSubdividerInst.AddSubdivision(IcoGeneratorInst);
            IcoGeneratorInst.vertices = newSubdividedShape.vertices;
            IcoGeneratorInst.indices = newSubdividedShape.indices;

            newSubdividedShape = MeshSubdividerInst.AddSubdivision(TetGeneratorInst);
            TetGeneratorInst.vertices = newSubdividedShape.vertices;
            TetGeneratorInst.indices = newSubdividedShape.indices;

            // Update the bufferHandler with the new vertices and indices
            this.UpdateShapeBuffers();
        }
        else
        {
            // Else if count is over 6, then reset. Not even my super laptop does well at that detail
            this.ResetToBaseShapes();
        }
    }

    // Set up the bufferHandler with the vertices and indices of the polyhedrons, and store in the dictionary
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

    // Resets the polyhedron to the base shape vertices and indices. Resets count
    ResetToBaseShapes()
    {
        // Reset - no timeout value entered, but a shortcut to ensure function called after the click event subdivision has been called
        // Keeps it simple
        setTimeout(function () {
            WebGlClassInst.meshSubDivisions = 0;
            IcoGeneratorInst.ResetToBaseShape();
            TetGeneratorInst.ResetToBaseShape();
            WebGlClassInst.UpdateShapeBuffers();
        },0);
    }

    // Update the renderTransform dictionary entries with parallax effect and mouse move rotation
    UpdateRenderTransforms()
    {
        // Overwrite the current dictionary entries
        RenderTransformHandlerInst.SetRenderTransform(
            topRotate,
            new Vector3(0.0, 2.0+this.scrollY/this.parallexEffect, -20.0),
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

    // Set the gl canvas size and gl context viewport size to the current window size. Doing this before every draw will account for window resizing
    ResizeCanvas()
    {
        this.glContext.canvas.width = window.innerWidth;
        this.glContext.canvas.height = Math.floor(window.innerWidth * 1.5);
        this.glContext.viewport(0, 0, this.glContext.canvas.width, this.glContext.canvas.height);
    }

    // Clears the canvas ready to draw
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