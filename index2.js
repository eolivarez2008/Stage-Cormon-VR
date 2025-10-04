// Javascript avec un fichier jpg pour index2.html

// A-Frame provides THREE as a global (AFRAME.THREE). Use that instead of importing
// another copy of Three to avoid multiple-instances conflicts.
const THREE = (typeof AFRAME !== 'undefined' && AFRAME.THREE) || window.THREE;

AFRAME.registerComponent("hdr-env", {
  init: function () {
    const scene = this.el.sceneEl.object3D;

    const loader = new THREE.TextureLoader();
    loader.setPath("./background/");
    loader.load("salle.jpg", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });
  }
});
