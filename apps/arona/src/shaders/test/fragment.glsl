uniform float uTime;
uniform vec2 uResolution;

// 绘制单条线的函数
vec4 Line(vec2 uv, float speed, float height, vec3 col) {
    // 对 y 坐标进行动态偏移
    uv.y += smoothstep(1.0, 0.0, abs(uv.x)) * sin(uTime * speed + uv.x * height) * 0.2;
    // 计算线条的透明度并着色
    return vec4(
        smoothstep(0.06 * smoothstep(0.2, 0.9, abs(uv.x)), 0.0, abs(uv.y) - 0.004) * col,
        1.0
    ) * smoothstep(1.0, 0.3, abs(uv.x));
}

void main() {
    // 将片段坐标转换为归一化坐标
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

    // 初始化输出颜色
    vec4 color = vec4(0.0);

    // 绘制多条动态线
    for (float i = 0.0; i <= 5.0; i += 1.0) {
        float t = i / 5.0;
        color += Line(uv, t * 0.5, 4.0 + t, vec3(0.2 + t * 0.7, 0.2 + t * 0.4, 0.3));
    }

    // 将颜色输出到片段着色器
    gl_FragColor = color;
}
