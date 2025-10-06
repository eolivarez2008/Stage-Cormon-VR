window.addEventListener("DOMContentLoaded", () => {
  if (window.AFRAME && AFRAME.THREE) window.THREE = AFRAME.THREE;
  const THREE = (typeof AFRAME !== "undefined" && AFRAME.THREE) || window.THREE;

  AFRAME.registerComponent("hdr-env", {
    schema: {
      paths: { type: "string", default: "../background/golden_gate_hills_4k.jpg, ../background/sea.jpg" },
      models: { type: "string", default: "#ciel, #melec" },
      sounds: { type: "string", default: "#wind1, #wind2" }, // IDs des sons
      interval: { type: "int", default: 4000 },
    },

    init: function () {
      this.scene = this.el.object3D;
      this.loader = new THREE.TextureLoader();
      this.index = 0;

      // HDRI
      this.paths = this.data.paths.split(",").map(s => s.trim());
      // Modèles
      this.modelIDs = this.data.models.split(",").map(s => s.trim());
      this.modelsEls = this.modelIDs.map(id => document.querySelector(id)).filter(Boolean);

      // Sons
      this.soundIDs = this.data.sounds.split(",").map(s => s.trim());
      this.soundEl = document.querySelector('#ambientSound');

      if (this.modelsEls.length !== this.modelIDs.length) {
        console.warn("Certains modèles n'ont pas été trouvés :", this.modelIDs);
      }

      if (!this.soundEl) {
        console.warn("L'élément #ambientSound n'a pas été trouvé !");
      }

      // Initialise la visibilité des modèles
      this.modelsEls.forEach((el, i) => el.setAttribute("visible", i === 0));

      // Joue le son initial
      if (this.soundEl) {
        this.soundEl.setAttribute('sound', `src: ${this.soundIDs[0]}; autoplay: true; loop: true; volume: 0.5`);
        this.soundEl.components.sound?.playSound();
      }

      // Démarre le cycle
      this.updateScene();
      this.startTimer();
    },

    updateScene: function () {
      // Change le fond HDRI
      const bg = this.paths[this.index];
      this.loader.load(bg, tex => {
        tex.mapping = THREE.EquirectangularReflectionMapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        this.scene.background = tex;
        this.scene.environment = tex;
        console.log("🌅 Fond chargé :", bg);
      });

      // Alterne les modèles
      this.modelsEls.forEach(el => {
        el.setAttribute("visible", !el.getAttribute("visible"));
        console.log(`${el.id} est maintenant ${el.getAttribute("visible") ? "visible" : "caché"}`);
      });

      // Change le son
      if (this.soundEl) {
        const soundID = this.soundIDs[this.index % this.soundIDs.length];
        this.soundEl.components.sound?.stopSound();
        this.soundEl.setAttribute('sound', `src: ${soundID}; autoplay: true; loop: true; volume: 0.5`);
        this.soundEl.components.sound?.playSound();
        console.log("🔊 Son chargé :", soundID);
      }
    },

    startTimer: function () {
      setInterval(() => {
        // Change l'index de l'image
        this.index = (this.index + 1) % this.paths.length;
        this.updateScene();
      }, this.data.interval);
    }
  });

});
