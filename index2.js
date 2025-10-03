// Javascript avec un fichier jpg pour index2.html

import * as THREE from "three";
import "aframe";

AFRAME.registerComponent("hdr-env", {
  init: function () {
    const scene = this.el.sceneEl.object3D;

    const loader = new THREE.TextureLoader();
    loader.setPath("/background/");
    loader.load("salle.jpg", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });
  }
});
