// JavaScript pour index1.html avec hdr

import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import "aframe";

AFRAME.registerComponent("hdr-env", {
  init: function () {
    const scene = this.el.sceneEl.object3D;
    new RGBELoader()
      .setPath("/background/") // HDR dans le dossier public
      .load("golden_gate_hills_4k.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
      });
  }
});
