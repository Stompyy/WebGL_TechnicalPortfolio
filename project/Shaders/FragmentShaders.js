class FragmentShaders
{
    constructor()
    {
        // Fragment shader programs
        this.sineWaveFragmentShaderProgram = `
            varying lowp vec4 vertexColour;
            varying highp vec3 vLighting;
            void main(void)
            {
                gl_FragColor = vec4(vertexColour.rgb * vLighting, vertexColour.a);
            }`;

        this.litFragmentShader = `
            varying highp vec3 vLighting;
            void main(void)
            {
                highp vec4 texelColor = vec4(0.5,0.5,0.5,1.0);
                gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
            }`;

    }

    GetSineFragmentShader()
    {
        return this.sineWaveFragmentShaderProgram;
    }

    GetLitFragmentShader()
    {
        return this.litFragmentShader;
    }
}

FragmentShadersInst = new FragmentShaders();