import * as THREE from "three";
import { Effect } from "postprocessing";

import fragment from "./shader/effectFragment.glsl";

export default class WaterEffect extends Effect {
    constructor(options = {}) {
        super("WaterEffect", fragment, {
            uniforms: new Map([["uTexture", new THREE.Uniform(options.texture)]])
        });
    }
}