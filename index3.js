import "aframe";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// Composant HDRI : background fixe, envMap fixe
AFRAME.registerComponent("hdr-env", {
  init: function () {
    const sceneEl = this.el.sceneEl;
    const scene = sceneEl.object3D;

    new RGBELoader()
      .setPath("/background/")
      .load("golden_gate_hills_4k.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        const pmremGenerator = new THREE.PMREMGenerator(sceneEl.renderer);
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.environment = envMap;

        // Skybox fixe
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sky = new THREE.Mesh(geometry, material);
        scene.add(sky);

        texture.dispose();
        pmremGenerator.dispose();
      });
  }
});

// Composant pour faire tourner le modèle
AFRAME.registerComponent("rotate-model", {
  schema: { speed: { default: 0.0002 } },
  tick: function (_t, delta) {
    const rot = this.el.object3D.rotation;
    rot.y += this.data.speed * delta;
  }
});