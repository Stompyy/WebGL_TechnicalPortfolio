class RenderTransform
{
    constructor(_translation, _rotation)
    {
        this.translation = _translation;
        this.rotation = _rotation;
    }
}

class RenderTransformHandler
{
    constructor()
    {
        this.renderTransforms = {};
    }

    SetRenderTransform(_index, _translation, _rotation)
    {
        this.renderTransforms[_index] = new RenderTransform(_translation, _rotation);
    }

    Update(_index)
    {
        let returnM = Matrix.CreateTranslation(RenderTransformHandlerInst.renderTransforms[_index].translation);
        returnM.Rotate(RenderTransformHandlerInst.renderTransforms[_index].rotation.x, new Vector3(1.0,0.0,0.0));
        returnM.Rotate(RenderTransformHandlerInst.renderTransforms[_index].rotation.y, new Vector3(0.0,1.0,0.0));
        return returnM;
    }
}

// Singleton class declaration
RenderTransformHandlerInst = new RenderTransformHandler();
