import "aframe";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

AFRAME.registerComponent("hdr-env", {
  init: function () {
    const sceneEl = this.el.sceneEl;
    const scene = sceneEl.object3D;

    new RGBELoader()
      .setPath("/background/")
      .load("golden_gate_hills_4k.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        // Utiliser l'HDRI comme environnement
        scene.environment = texture;

        // Créer une sphère "sky" qui affiche le HDRI
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1); // inverser pour que la texture soit visible de l'intérieur

        const material = new THREE.MeshBasicMaterial({ map: texture });
        this.sky = new THREE.Mesh(geometry, material);
        scene.add(this.sky);
      });
  },

  tick: function (time, deltaTime) {
    if (this.sky) {
      // faire tourner doucement autour de Y
      this.sky.rotation.y += 0.0005 * deltaTime; 
    }
  }
});
