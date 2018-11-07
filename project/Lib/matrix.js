class Matrix
{
    /*
        Matrix - Standard math Matrix 4x4 class and associated methods
        
        This is a webgl matrix wrapper with metrix defined as Float32Array()
        
        Matrix functions are defined following XNA/Monogame nomenclature
        i.e. static functions that return matrix objects
        
        TransformVector2, TransformVector3 & TransformVector4 will transform vectors
     */
    constructor()
    {
        this.m = new Float32Array(16);

        this.m[0] = this.m[5] = this.m[10] = this.m[15] = 1;
    }

    static CreateTranslation(vec3)
    {
        let m = new Matrix();

        m.m[12] = vec3.x;
        m.m[13] = vec3.y;
        m.m[14] = vec3.z;

        return m;
    }

    static CreateScale(x, y, z)
    {
        var m = new Matrix();

        m.m[0] = x;
        m.m[5] = y;
        m.m[10] = z;

        return m;
    }

    static CreateRotationX(angle)
    {
        var m = new Matrix();

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        m.m[5] = cos; m.m[6] = sin;
        m.m[9] = -sin; m.m[10] = cos;

        return m;
    }

    static CreateRotationY(angle)
    {
        var m = new Matrix();

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        m.m[0] = cos; m.m[1] = -sin;
        m.m[8] = sin; m.m[10] = cos;

        return m;
    }

    static CreateRotationZ(angle)
    {
        var m = new Matrix();

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        m.m[0] = cos; m.m[1] = sin;
        m.m[4] = -sin; m.m[5] = cos;

        return m;
    }

    TransformVector2(v0)
    {
        var result = new Vector2();

        result.x = (v0.x * this.m[0]) + (v0.y * this.m[4]) + this.m[12];
        result.y = (v0.x * this.m[1]) + (v0.y * this.m[5])+ this.m[13];

        return result;
    }

    TransformVector3(v0)
    {
        var result = new Vector3();

        result.x = (v0.x * m.m[0]) + (v0.y * m.m[4]) + (v0.z * m.m[8]);
        result.y = (v0.x * m.m[1]) + (v0.y * m.m[5]) + (v0.z * m.m[9]);
        result.z = (v0.x * m.m[2]) + (v0.y * m.m[6]) + (v0.z * m.m[10]);

        return result;
    }

    TransformVector4(v0)
    {
        var result = new Vector4();

        result.x = (v0.x * m.m[0]) + (v0.y * m.m[4]) + (v0.z * m.m[8]) + (v0.w *m.m[12]);
        result.y = (v0.x * m.m[1]) + (v0.y * m.m[5]) + (v0.z * m.m[9]) + (v0.w *m.m[13]);
        result.z = (v0.x * m.m[2]) + (v0.y * m.m[6]) + (v0.z * m.m[10]) + (v0.w *m.m[14]);
        result.w = (v0.x * m.m[3]) + (v0.y * m.m[7]) + (v0.z * m.m[11]) + (v0.w *m.m[15]);

        return result;
    }

    static Multiply(src, rMat)
    {
        var result = new Matrix();

        result.m[0] = src.m[0] * rMat.m[0] + src.m[1] * rMat.m[4] + src.m[2] * rMat.m[8] + src.m[3] * rMat.m[12];
        result.m[1] = src.m[0] * rMat.m[1] + src.m[1] * rMat.m[5] + src.m[2] * rMat.m[9] + src.m[3] * rMat.m[13];
        result.m[2] = src.m[0] * rMat.m[2] + src.m[1] * rMat.m[6] + src.m[2] * rMat.m[10] + src.m[3] * rMat.m[14];
        result.m[3] = src.m[0] * rMat.m[3] + src.m[1] * rMat.m[7] + src.m[2] * rMat.m[11] + src.m[3] * rMat.m[15];

        result.m[4] = src.m[4] * rMat.m[0] + src.m[5] * rMat.m[4] + src.m[6] * rMat.m[8] + src.m[7] * rMat.m[12];
        result.m[5] = src.m[4] * rMat.m[1] + src.m[5] * rMat.m[5] + src.m[6] * rMat.m[9] + src.m[7] * rMat.m[13];
        result.m[6] = src.m[4] * rMat.m[2] + src.m[5] * rMat.m[6] + src.m[6] * rMat.m[10] + src.m[7] * rMat.m[14];
        result.m[7] = src.m[4] * rMat.m[3] + src.m[5] * rMat.m[7] + src.m[6] * rMat.m[11] + src.m[7] * rMat.m[15];

        result.m[8] = src.m[8] * rMat.m[0] + src.m[9] * rMat.m[4] + src.m[10] * rMat.m[8] + src.m[11] * rMat.m[12];
        result.m[9] = src.m[8] * rMat.m[1] + src.m[9] * rMat.m[5] + src.m[10] * rMat.m[9] + src.m[11] * rMat.m[13];
        result.m[10] = src.m[8] * rMat.m[2] + src.m[9] * rMat.m[6] + src.m[10] * rMat.m[10] + src.m[11] * rMat.m[14];
        result.m[11] = src.m[8] * rMat.m[3] + src.m[9] * rMat.m[7] + src.m[10] * rMat.m[11] + src.m[11] * rMat.m[15];

        result.m[12] = src.m[12] * rMat.m[0] + src.m[13] * rMat.m[4] + src.m[14] * rMat.m[8] + src.m[15] * rMat.m[12];
        result.m[13] = src.m[12] * rMat.m[1] + src.m[13] * rMat.m[5] + src.m[14] * rMat.m[9] + src.m[15] * rMat.m[13];
        result.m[14] = src.m[12] * rMat.m[2] + src.m[13] * rMat.m[6] + src.m[14] * rMat.m[10] + src.m[15] * rMat.m[14];
        result.m[15] = src.m[12] * rMat.m[3] + src.m[13] * rMat.m[7] + src.m[14] * rMat.m[11] + src.m[15] * rMat.m[15];

        return result;
    }

    static CreateLookAt(Eye, At, Up)
    {
        var m = new Matrix();

        var zaxis = Vector3.Normal(Eye - At);
        var xaxis = Vector3.Normal(Vector3.Cross(Up, zaxis));
        var yaxis = Vector3.Cross(zaxis, xaxis);

        m.m[0] = xaxis.x; m.m[1] = yaxis.x; m.m[2] = zaxis.x; m.m[3] = 0;
        m.m[4] = xaxis.y; m.m[5] = yaxis.y; m.m[6] = zaxis.y; m.m[7] = 0;
        m.m[8] = xaxis.z; m.m[9] = yaxis.z; m.m[10] = zaxis.z; m.m[11] = 0;
        m.m[12] = -Vector3.Dot(xaxis, Eye); m.m[13] = -Vector3.Dot(yaxis, Eye); m.m[14] = -Vector3.Dot(zaxis, Eye); m.m[15] = 1.0;

        return m;
    }


    static CreatePerspectiveFieldOfView(fov, aspectratio, nearPlane, farPlane)
    {
        var m = new Matrix();

        var f = 1.0 / Math.tan(fov / 2.0);

        m.m[0]  = f / aspectratio;   m.m[1]  = 0.0;  m.m[2]  = 0.0;                                              m.m[3]  =  0.0;
        m.m[4]  = 0.0;               m.m[5]  = f;    m.m[6]  = 0.0;                                              m.m[7]  =  0.0;
        m.m[8]  = 0.0;               m.m[9]  = 0.0;  m.m[10] = (nearPlane + farPlane) / (farPlane-nearPlane);                m.m[11] = -1.0;
        m.m[12] = 0.0;               m.m[13] = 0.0;  m.m[14] = (nearPlane * farPlane) / (farPlane-nearPlane);  m.m[15] =  0.0;

        return m;
    }

    static CreateOrthoOffCenter(left, right, bottom, top, nearPlane, farPlane)
    {
        var m = new Matrix();

        m.m[0] = 2 / (right - left);
        m.m[1] = 0;
        m.m[2] = 0;
        m.m[3] = 0;

        m.m[4] = 0;
        m.m[5] = 2 / (top - bottom);
        m.m[6] = 0;
        m.m[7] = 0;

        m.m[8] = 0;
        m.m[9] = 0;
        m.m[10] = 1 / (farPlane - nearPlane);
        m.m[11] = nearPlane / (farPlane - nearPlane);

        m.m[12] = -1;
        m.m[13] = 1;
        m.m[14] = 0;
        m.m[15] = 1;

        return m;
    }

    Invert()
    {
        let returnM = new Matrix();

        let a00 = this.m[0],
            a01 = this.m[1],
            a02 = this.m[2],
            a03 = this.m[3];
        let a10 = this.m[4],
            a11 = this.m[5],
            a12 = this.m[6],
            a13 = this.m[7];
        let a20 = this.m[8],
            a21 = this.m[9],
            a22 = this.m[10],
            a23 = this.m[11];
        let a30 = this.m[12],
            a31 = this.m[13],
            a32 = this.m[14],
            a33 = this.m[15];

        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        returnM.m[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        returnM.m[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        returnM.m[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        returnM.m[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        returnM.m[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        returnM.m[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        returnM.m[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        returnM.m[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        returnM.m[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        returnM.m[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        returnM.m[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        returnM.m[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        returnM.m[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        returnM.m[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        returnM.m[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        returnM.m[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return returnM;
    }

    Transpose() {

        if (this === null)
        {
            return null;
        }
        let returnM = new Matrix();

        returnM.m[0] = this.m[0];
        returnM.m[1] = this.m[4];
        returnM.m[2] = this.m[8];
        returnM.m[3] = this.m[12];
        returnM.m[4] = this.m[1];
        returnM.m[5] = this.m[5];
        returnM.m[6] = this.m[9];
        returnM.m[7] = this.m[13];
        returnM.m[8] = this.m[2];
        returnM.m[9] = this.m[6];
        returnM.m[10] = this.m[10];
        returnM.m[11] = this.m[14];
        returnM.m[12] = this.m[3];
        returnM.m[13] = this.m[7];
        returnM.m[14] = this.m[11];
        returnM.m[15] = this.m[15];

        return returnM;
    }

    Rotate(rad, axis)
    {
        let returnM = new Matrix();

        let x = axis.x,
            y = axis.y,
            z = axis.z;

        let len = Math.sqrt(x * x + y * y + z * z);

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        let s = Math.sin(rad),
        c = Math.cos(rad),
        t = 1 - c;

        let a00 = this.m[0],
            a01 = this.m[1],
            a02 = this.m[2],
            a03 = this.m[3];
        let a10 = this.m[4],
            a11 = this.m[5],
            a12 = this.m[6],
            a13 = this.m[7];
        let a20 = this.m[8],
            a21 = this.m[9],
            a22 = this.m[10],
            a23 = this.m[11];

        // Construct the elements of the rotation matrix
        let b00 = x * x * t + c,
            b01 = y * x * t + z * s,
            b02 = z * x * t - y * s;
        let b10 = x * y * t - z * s,
            b11 = y * y * t + c,
            b12 = z * y * t + x * s;
        let b20 = x * z * t + y * s,
            b21 = y * z * t - x * s,
            b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        returnM.m[0] = a00 * b00 + a10 * b01 + a20 * b02;
        returnM.m[1] = a01 * b00 + a11 * b01 + a21 * b02;
        returnM.m[2] = a02 * b00 + a12 * b01 + a22 * b02;
        returnM.m[3] = a03 * b00 + a13 * b01 + a23 * b02;
        returnM.m[4] = a00 * b10 + a10 * b11 + a20 * b12;
        returnM.m[5] = a01 * b10 + a11 * b11 + a21 * b12;
        returnM.m[6] = a02 * b10 + a12 * b11 + a22 * b12;
        returnM.m[7] = a03 * b10 + a13 * b11 + a23 * b12;
        returnM.m[8] = a00 * b20 + a10 * b21 + a20 * b22;
        returnM.m[9] = a01 * b20 + a11 * b21 + a21 * b22;
        returnM.m[10] = a02 * b20 + a12 * b21 + a22 * b22;
        returnM.m[11] = a03 * b20 + a13 * b21 + a23 * b22;

        returnM.m[12] = this.m[12];
        returnM.m[13] = this.m[13];
        returnM.m[14] = this.m[14];
        returnM.m[15] = this.m[15];

        this.m = returnM.m;
        return returnM;
    }
}