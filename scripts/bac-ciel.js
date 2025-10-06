const sceneEl = document.querySelector("#scene");
const THREE = AFRAME.THREE;

function loadHDRI() {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("../background/space.jpg", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    sceneEl.object3D.background = texture;

    const renderer = sceneEl.renderer;
    if (renderer) {
      const pmremGen = new THREE.PMREMGenerator(renderer);
      pmremGen.compileEquirectangularShader();
      sceneEl.object3D.environment = pmremGen.fromEquirectangular(texture).texture;
      pmremGen.dispose();
    } else {
      sceneEl.object3D.environment = texture;
    }

    console.log("🌌 Background spatial chargé !");
  }, undefined, (err) => {
    console.error("Erreur chargement HDRI :", err);
  });
}

document.querySelectorAll(".clickable").forEach(el => {
  el.addEventListener("click", () => {
    const url = el.getAttribute("data-url");
    if (url) window.location.href = url;
  });
});

// Charger l'espace au démarrage
loadHDRI();
