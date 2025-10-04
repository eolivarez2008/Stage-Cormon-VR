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
        .setPath("./background/")
        .load("golden_gate_hills_4k.hdr", (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.background = texture;
          scene.environment = texture;
        });
  }).catch(() => {/* HDR loader not present; fallback will run */});

    // Fallback: if RGBELoader wasn't available (CORS/404), load a JPG equirectangular instead
    // This provides a visible background and an environment map using PMREM where possible.
    waitForRGBE().catch(() => {
      try {
        console.warn('RGBELoader not available, using JPG fallback');
        const loader = new THREE.TextureLoader();
        loader.setPath('./background/');
        loader.load('golden_gate_hills_4k.jpg', (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.background = texture;
          // Try to create PMREM from the scene renderer if available
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
            // best-effort fallback
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

// Gestion de la vidéo sur la TV
document.addEventListener("DOMContentLoaded", () => {
  const videoEl = document.querySelector("#myVideo");
  const screen = document.querySelector("#tvScreen");

  if (!videoEl || !screen) {
    console.warn("⚠️ Video element or TV screen not found.");
    return;
  }

  // Debug events
  videoEl.addEventListener("canplay", () => console.log("video canplay"));
  videoEl.addEventListener("play",   () => console.log("video play"));
  videoEl.addEventListener("pause",  () => console.log("video pause"));
  videoEl.addEventListener("error",  (e) => console.error("video error", e));

  // Toggle play/pause on click
  screen.addEventListener("click", (ev) => {
    console.log("tvScreen clicked", ev);
    if (videoEl.paused) {
      videoEl.play().catch(err => console.error("video.play() failed:", err));
    } else {
      videoEl.pause();
    }
  });
});
