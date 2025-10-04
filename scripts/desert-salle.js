const THREE = (typeof AFRAME !== 'undefined' && AFRAME.THREE) || window.THREE;

AFRAME.registerComponent("hdr-env", {
  init: function () {
    const scene = this.el.sceneEl.object3D;

    const loader = new THREE.TextureLoader();
    loader.setPath("../background/");
    loader.load("golden_gate_hills_4k.jpg", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });
  }
});
