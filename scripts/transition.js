window.addEventListener("DOMContentLoaded", () => {
  if (window.AFRAME && AFRAME.THREE) window.THREE = AFRAME.THREE;
  const THREE = (typeof AFRAME !== "undefined" && AFRAME.THREE) || window.THREE;

  AFRAME.registerComponent("hdr-env", {
    schema: {
      paths: { type: "string", default: "../background/golden_gate_hills_4k.jpg, ../background/sea.jpg" },
      models: { type: "string", default: "#ciel, #melec" },
      interval: { type: "int", default: 4000 },
    },

    init: function () {
      this.scene = this.el.sceneEl.object3D;
      this.loader = new THREE.TextureLoader();
      this.index = 0;

      // Transforme les chaînes en tableau
      this.paths = this.data.paths.split(",").map(s => s.trim());
      this.modelIDs = this.data.models.split(",").map(s => s.trim());

      // Récupère les éléments <a-gltf-model> en s'assurant qu'ils existent
      this.modelsEls = this.modelIDs.map(id => document.querySelector(id)).filter(Boolean);

      if (this.modelsEls.length !== this.modelIDs.length) {
        console.warn("Certains modèles n'ont pas été trouvés :", this.modelIDs);
      }

      // Initialise le premier modèle visible
      this.modelsEls.forEach((el, i) => {
        el.setAttribute("visible", i === this.index);
      });

      this.updateScene();
      this.startTimer();
    },

    updateScene: function () {
      const bg = this.paths[this.index];
      this.loader.load(bg, tex => {
        tex.mapping = THREE.EquirectangularReflectionMapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        this.scene.background = tex;
        this.scene.environment = tex;
        console.log("🌅 Fond chargé :", bg);
      });

      // Alterne la visibilité des modèles
      this.modelsEls.forEach((el, i) => {
        el.setAttribute("visible", i === this.index);
        console.log(`🔁 ${el.id} → ${i === this.index ? "visible" : "caché"}`);
      });
    },

    startTimer: function () {
      setInterval(() => {
        this.index = (this.index + 1) % this.paths.length;
        this.updateScene();
      }, this.data.interval);
    }
  });
});
