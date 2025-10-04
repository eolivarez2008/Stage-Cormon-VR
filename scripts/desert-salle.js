const THREE = (typeof AFRAME !== 'undefined' && AFRAME.THREE) || window.THREE;

AFRAME.registerComponent("hdr-env", {
  init: function () {
    const scene = this.el.sceneEl.object3D;
    const waitForRGBE = (timeout = 4000, interval = 50) => new Promise((resolve, reject) => {
      const start = Date.now();
      (function check() {
        if (THREE && THREE.RGBELoader) return resolve(THREE.RGBELoader);
        if (Date.now() - start > timeout) return reject(new Error('RGBELoader not available'));
        setTimeout(check, interval);
      })();
    });

    waitForRGBE().then((Loader) => {
      new Loader()
        .setPath("../background/")
        .load("golden_gate_hills_4k.hdr", (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.background = texture;
          scene.environment = texture;
        });
  }).catch(() => {/* HDR loader not present; fallback will run */});
  }
});