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
  
    waitForRGBE().catch(() => {
      try {
        console.warn('RGBELoader not available, using JPG fallback');
        const loader = new THREE.TextureLoader();
        loader.setPath('../background/');
        loader.load('golden_gate_hills_4k.jpg', (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.background = texture;
          const sceneEl = this.el.sceneEl;
          const renderer = sceneEl && sceneEl.renderer;
          if (renderer) {
            try {
              const pmremGenerator = new THREE.PMREMGenerator(renderer);
              const envMap = pmremGenerator.fromEquirectangular(texture).texture;
              scene.environment = envMap;
              pmremGenerator.dispose();
              console.log('Environment map created from JPG via PMREM');
            } catch (pmErr) {
              console.error('PMREM generation failed', pmErr);
              scene.environment = texture;
            }
          } else {
            scene.environment = texture;
            console.log('Applied JPG as environment without PMREM (renderer not ready)');
          }
        }, undefined, (e) => console.error('TextureLoader error', e));
      } catch (e) {
        console.error('Fallback JPG load failed', e);
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const videoEl = document.querySelector("#myVideo");
  const screen = document.querySelector("#tvScreen");

  if (!videoEl || !screen) {
    console.warn("⚠️ Video element or TV screen not found.");
    return;
  }

  screen.addEventListener("click", (ev) => {
    console.log("tvScreen clicked", ev);
    if (videoEl.paused) {
      videoEl.play().catch(err => console.error("video.play() failed:", err));
    } else {
      videoEl.pause();
    }
  });
});
