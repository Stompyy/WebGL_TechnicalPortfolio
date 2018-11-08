class VertexShaders
{
    constructor()
    {
        // Vertex shader program
        this.sineWaveVertexShaderProgram = `
            attribute vec4 aVertexPosition;
            attribute vec3 aVertexNormal;
            attribute vec4 aVertexColor;
            
            uniform mat4 uModelViewMatrix;
            uniform mat4 uNormalMatrix;
            uniform mat4 uProjectionMatrix;
            uniform float uTime;
            
            varying lowp vec4 vertexColour;
            varying highp vec3 vLighting;
            
            void main(void)
            {
                gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(
                    aVertexPosition.xy,
                    aVertexPosition.z + 0.2 * sin(-(0.7*aVertexPosition.x + 0.4*aVertexPosition.y) + uTime),
                    aVertexPosition.w
                );
              
                vertexColour = vec4(0.0,0.0,0.0,0.5);// (1.0-(aVertexPosition.y/10.0)) );
                //vertexColour = aVertexColor;
              
                // Apply lighting effect
                highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
                highp vec3 directionalLightColor = vec3(1, 1, 1);
                highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
                highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
                highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
                vLighting = ambientLight + (directionalLightColor * directional);
            }`;

        this.litVertexShader = `
            attribute vec4 aVertexPosition;
            attribute vec3 aVertexNormal;
            attribute vec4 aVertexColor;
            uniform float uTime;
                    
            uniform mat4 uNormalMatrix;
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            varying highp vec3 vLighting;
            void main(void)
            {
                  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                  // Apply lighting effect
                  highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
                  highp vec3 directionalLightColor = vec3(1, 1, 1);
                  highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
                  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
                  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
                  vLighting = ambientLight + (directionalLightColor * directional);
            }`;

    }

    GetSineVertexShader()
    {
        return this.sineWaveVertexShaderProgram;
    }

    GetLitVertexShader()
    {
        return this.litVertexShader;
    }
}

VertexShadersInst = new VertexShaders();