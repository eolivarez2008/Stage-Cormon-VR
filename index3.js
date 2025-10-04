// A-Frame provides THREE as a global (AFRAME.THREE). Use that instead of importing
// another copy of Three to avoid multiple-instances conflicts.
const THREE = (typeof AFRAME !== 'undefined' && AFRAME.THREE) || window.THREE;

// Composant HDRI : background fixe, envMap fixe
AFRAME.registerComponent("hdr-env", {
  init: function () {
    const sceneEl = this.el.sceneEl;
    const scene = sceneEl.object3D;

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
  }).catch(() => {/* HDR loader not present; fallback will run */});

    // Fallback to JPG equirectangular if HDR loader not available
    waitForRGBE().catch(() => {
      try {
        console.warn('RGBELoader not available, using JPG fallback');
        const loader = new THREE.TextureLoader();
        loader.setPath('/background/');
        loader.load('golden_gate_hills_4k.jpg', (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.background = texture;
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

// Composant pour faire tourner le modèle
AFRAME.registerComponent("rotate-model", {
  schema: { speed: { default: 0.0002 } },
  tick: function (_t, delta) {
    const rot = this.el.object3D.rotation;
    rot.y += this.data.speed * delta;
  }
});