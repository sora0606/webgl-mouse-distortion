import * as THREE from "three";
import TouchTexture from "./TouchTexture";
import { EffectComposer, RenderPass, EffectPass } from "postprocessing";
import WaterEffect from "./WaterEffect";

import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";

export default class App {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.composer = new EffectComposer(this.renderer);

        document.body.append(this.renderer.domElement);

        const FOV = 60;
	    const FOV_RAD = (FOV / 2) * (Math.PI / 180);
        const CAMERA_NEAR = 0.01;
        const CAMERA_FAR = 7000;

        this.camera = new THREE.PerspectiveCamera(
            FOV,
            window.innerWidth / window.innerHeight,
            CAMERA_NEAR,
            CAMERA_FAR
        );
        this.camera.position.z = window.innerHeight / 2 / Math.tan(FOV_RAD);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xeceef1);

        this.clock = new THREE.Clock();

        this.raycaster = new THREE.Raycaster();

        this.touchTexture = new TouchTexture(200, 64);

        this.render = this.render.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);

        this.init = this.init.bind(this);
        this.init();
    }
    initComposer() {
        const renderPass = new RenderPass(this.scene, this.camera);
        this.waterEffect = new WaterEffect({ texture: this.touchTexture.texture });
        const waterPass = new EffectPass(this.camera, this.waterEffect);
        waterPass.renderToScreen = true;
        renderPass.renderToScreen = false;
        this.composer.addPass(renderPass);
        this.composer.addPass(waterPass);
    }
    init() {
        this.touchTexture.initTexture();

        this.addObjects();
        this.initComposer();
        this.render();

        window.addEventListener("resize", this.onResize);
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("touchmove", this.onTouchMove);
    }

    addObjects() {
        const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 1, 1);

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
        });

        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    }

    onTouchMove(ev) {
        const touch = ev.targetTouches[0];
        this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }

    onMouseMove(ev) {
        const raycaster = this.raycaster;
        this.mouse = {
            x: ev.clientX / window.innerWidth,
            y: 1 - ev.clientY / window.innerHeight
        };
        this.touchTexture.addTouch(this.mouse);

        raycaster.setFromCamera(
            {
                x: (ev.clientX / window.innerWidth) * 2 - 1,
                y: -(ev.clientY / window.innerHeight) * 2 + 1
            },
            this.camera
        );
    }

    render() {
        this.composer.render(this.clock.getDelta());
        this.touchTexture.update();
        requestAnimationFrame(this.render);
    }
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.composer.setSize(window.innerWidth, window.innerHeight);
    }
}

new App();