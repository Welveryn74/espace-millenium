import { Uniform } from "three";
import { Effect } from "postprocessing";

const fragmentShader = /* glsl */ `
  uniform float time;
  uniform float trackingIntensity;
  uniform float scanLineCount;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 coord = uv;

    // --- Tracking bar: slow-moving horizontal distortion band ---
    float barPos = fract(time * 0.08);
    float barDist = abs(coord.y - barPos);
    float barStrength = smoothstep(0.06, 0.0, barDist) * trackingIntensity;
    coord.x += barStrength * 0.03 * sin(time * 12.0 + coord.y * 40.0);

    // --- Horizontal jitter: subtle per-line wobble ---
    float jitter = (fract(sin(dot(vec2(floor(coord.y * scanLineCount), time * 3.0), vec2(12.9898, 78.233))) * 43758.5453) - 0.5);
    coord.x += jitter * 0.002 * trackingIntensity;

    // --- RGB split: slight chromatic offset per channel ---
    float splitAmount = 0.0015 * trackingIntensity;
    float r = texture2D(inputBuffer, vec2(coord.x + splitAmount, coord.y)).r;
    float g = texture2D(inputBuffer, coord).g;
    float b = texture2D(inputBuffer, vec2(coord.x - splitAmount, coord.y)).b;

    vec3 color = vec3(r, g, b);

    // --- Scan lines: horizontal darkening pattern ---
    float scanLine = sin(coord.y * scanLineCount * 3.14159) * 0.5 + 0.5;
    scanLine = mix(1.0, scanLine, 0.15 * trackingIntensity);
    color *= scanLine;

    // --- Subtle vertical roll hint at edges ---
    float edgeDark = smoothstep(0.0, 0.02, coord.y) * smoothstep(1.0, 0.98, coord.y);
    color *= edgeDark;

    outputColor = vec4(color, inputColor.a);
  }
`;

export default class VHSTrackingEffect extends Effect {
  constructor({ trackingIntensity = 0.5, scanLineCount = 240 } = {}) {
    super("VHSTrackingEffect", fragmentShader, {
      uniforms: new Map([
        ["time", new Uniform(0)],
        ["trackingIntensity", new Uniform(trackingIntensity)],
        ["scanLineCount", new Uniform(scanLineCount)],
      ]),
    });
  }

  update(_renderer, _inputBuffer, deltaTime) {
    this.uniforms.get("time").value += deltaTime;
  }
}
