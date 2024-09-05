// export default /*glsl*/ 
uniform vec3 lightPosition;
uniform vec3 baseColor;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 lightDir = normalize(lightPosition - vPosition);
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    vec3 diffuse = diff * baseColor;
    gl_FragColor = vec4(diffuse, 1.0);
}