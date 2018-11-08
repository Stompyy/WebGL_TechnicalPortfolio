/**
 * Holds the information about an object needed to look up those values in their respective dictionaries
 * @param _bufferIndex Dictionary key
 * @param _shaderIndex Dictionary key
 * @param _renderTransformIndex Dictionary key
 * @param _drawType Dictionary key
 */
class ObjectInfo
{
    constructor(_bufferIndex, _shaderIndex, _renderTransformIndex, _drawType)
    {
        this.bufferIndex = _bufferIndex;
        this.shaderIndex = _shaderIndex;
        this.renderTransformIndex = _renderTransformIndex;
        this.drawType = _drawType;
    }
}

/**
 * Handler class manages a list of objects information
 */
class ObjectHandler
{
    constructor()
    {
        this.objects = [];
    }

    // Adds a new ObjectInfo into the local list
    AddNewObject(bufferIndex, shaderIndex, renderTransformIndex, drawType)
    {
        this.objects.push(new ObjectInfo(bufferIndex, shaderIndex, renderTransformIndex, drawType));
    }
}

// Singleton class
ObjectHandlerInst = new ObjectHandler();