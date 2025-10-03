import "aframe";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// HDRI loader pour A-Frame
AFRAME.registerComponent("hdr-env", {
  init: function () {
    const scene = this.el.sceneEl.object3D;
    new RGBELoader()
      .setPath("/background/") // place ton HDRI dans public/background/
      .load("golden_gate_hills_4k.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
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
