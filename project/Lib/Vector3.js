class Vector3
{
    /*
        Vector3 - Standard Vector3 class
     */
    
    constructor(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static Add(v0, v1)
    {
        return new Vector3(
            v0.x+v1.x,
            v0.y+v1.y,
            v0.z+v1.z
        );
    }

    static Subtract(v0,v1)
    {
        return new Vector3(
            v0.x-v1.x,
            v0.y-v1.y,
            v0.z-v1.z
        );
    }

    static Multiply(v, f)
    {
        return new Vector3(v.x*f, v.y*f, v.z*f);
    }

    ToArray()
    {
        return [this.x, this.y, this.z,];
    }

    Set(vec)
    {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
    }

    Normalize()
    {
        var length = Length();

        this.x/= length;
        this.y/= length;
        this.z/= length;
    }

    static Length(v)
    {
        return Math.sqrt((v.x*v.x) + (v.y*v.y) + (v.z*v.z));
    }

    static Normal(vec)
    {
        var result = new Vector3(refIn);

        result.Normalize();

        return result;
    }

    static Cross(v0,v1)
    {
        var result = new Vector3();

        result.x = v0.y * v1.z - v0.z * v1.y;
        result.y = v0.z * v1.x - v0.x * v1.z;
        result.z = v0.x * v1.y - v0.y * v1.x;

        return result;
    }

    static Dot(v0,v1)
    {
        return (v0.x * v1.x) + (v0.y * v1.y) + (v0.z * v1.z);
    }

    static Normalise(v)
    {
        let l = Vector3.Length(v);
        return new Vector3(v.x/l, v.y/l, v.z/l);
    }

    static Midpoint(v0, v1)
    {
        return new Vector3(
            v1.x + (v0.x - v1.x)/2.0,
            v1.y + (v0.y - v1.y)/2.0,
            v1.z + (v0.z - v1.z)/2.0
        );
    }

    static ExtrudePoint(v, centre = new Vector3(0.0, 0.0, 0.0), radius = 1)
    {
        return Vector3.Normalise(v);
        return Vector3.Add(
            Vector3.Multiply(
                Vector3.Normalise(Vector3.Subtract(v, centre)),
                radius
            ), centre
        );
    }
}