import { Uniform } from "three";
import { Effect } from "postprocessing";

const fragmentShader = /* glsl */ `
  uniform float warmth;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 color = inputColor.rgb;

    // --- Slight desaturation (VHS tape degradation) ---
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(color, vec3(luma), 0.15);

    // --- Warm tint: boost reds/yellows ---
    color.r += warmth * 0.6;
    color.g += warmth * 0.25;
    color.b -= warmth * 0.2;

    // --- Sepia touch ---
    vec3 sepia = vec3(
      dot(color, vec3(0.393, 0.769, 0.189)),
      dot(color, vec3(0.349, 0.686, 0.168)),
      dot(color, vec3(0.272, 0.534, 0.131))
    );
    color = mix(color, sepia, warmth * 0.4);

    // --- Black crush: darken shadows ---
    color = smoothstep(vec3(-0.05), vec3(1.05), color);

    // --- Slight contrast boost ---
    color = (color - 0.5) * 1.08 + 0.5;

    outputColor = vec4(clamp(color, 0.0, 1.0), inputColor.a);
  }
`;

export default class VHSColorGrading extends Effect {
  constructor({ warmth = 0.12 } = {}) {
    super("VHSColorGrading", fragmentShader, {
      uniforms: new Map([
        ["warmth", new Uniform(warmth)],
      ]),
    });
  }
}
