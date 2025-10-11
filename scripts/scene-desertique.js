const THREE = (typeof AFRAME !== 'undefined' && AFRAME.THREE) || window.THREE;

// Composant pour l'environnement HDR
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

// Composant pour la vidéo sur le téléviseur
document.addEventListener("DOMContentLoaded", () => {
  const videoEl = document.querySelector("#myVideo");
  const screen = document.querySelector("#tvScreen");
  if (!videoEl || !screen) return;

  screen.addEventListener("click", () => {
    if (videoEl.paused) {
      videoEl.play().catch(err => console.error("video.play() failed:", err));
    } else {
      videoEl.pause();
    }
  });
});

// Composant pour alterner entre deux objets 3D au clic
document.addEventListener('DOMContentLoaded', () => {
  const scene = document.getElementById('scene');

  if (!scene) {
    console.error("La scène A-Frame n'a pas été trouvée.");
    return;
  }

  scene.addEventListener('loaded', () => {
    const obj1 = document.getElementById('obj1');
    const obj2 = document.getElementById('obj2');

    if (!obj1 || !obj2) {
      console.error("obj1 ou obj2 introuvable !");
      return;
    }

    obj1.addEventListener('click', () => {
      obj1.setAttribute('visible', 'false');
      obj2.setAttribute('visible', 'true');
    });

    obj2.addEventListener('click', () => {
      obj2.setAttribute('visible', 'false');
      obj1.setAttribute('visible', 'true');
    });
  });
});
