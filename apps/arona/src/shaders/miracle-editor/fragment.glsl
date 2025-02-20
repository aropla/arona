uniform float uGridSpacingX;
uniform float uGridSpacingY;
uniform float uX;
uniform float uY;
uniform float uPointDistance;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vUv, 1.0, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
