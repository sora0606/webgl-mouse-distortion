uniform sampler2D uTexture;

void mainUv(inout vec2 uv) {
    vec4 tex = texture2D(uTexture, uv);
    float angle = -((tex.r) * (PI * 2.) - PI) ;
    float vx = -(tex.r *2. - 1.);
    float vy = -(tex.g *2. - 1.);
    float intensity = tex.b;
    uv.x += vx * 0.3 * intensity ;
    uv.y += vy * 0.3 * intensity;
    // uv.xy *= 1. - 0.5 * smoothstep( 0., 1., intensity) ;
    // uv.x +=  0.2 * intensity;
    // uv.y +=  0.2  *intensity;
}