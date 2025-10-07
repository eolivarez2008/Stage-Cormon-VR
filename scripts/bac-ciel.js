const roc = document.querySelector('#roc');
const camera = document.querySelector('a-camera');
const videoEntity = document.querySelector('#cartVideo');
const videoEl = document.querySelector('#CART_SECRET');
const clickableElements = document.querySelectorAll('.clickable');

// Sons depuis <a-assets>
const gaspSound = document.querySelector('#gaspSound');  
const audioRumble = document.querySelector('#rumbleSound');
const finalSound = document.querySelector('#finalSound');

// Fonction tremblement caméra et roc
function shakeCameraAndRoc(duration = 6000, magnitude = 0.5, callback) {
  const start = Date.now();
  const originalCamPos = { x: 0, y: 1.6, z: 0 };
  const originalRocPos = { 
    x: roc.getAttribute('position').x, 
    y: roc.getAttribute('position').y, 
    z: roc.getAttribute('position').z 
  };

  function shake() {
    const elapsed = Date.now() - start;
    if (elapsed < duration) {
      const factor = magnitude;
      roc.object3D.position.x = originalRocPos.x + (Math.random() - 0.5) * factor;
      roc.object3D.position.y = originalRocPos.y + (Math.random() - 0.5) * factor;
      roc.object3D.position.z = originalRocPos.z + (Math.random() - 0.5) * factor;

      camera.object3D.position.x = originalCamPos.x + (Math.random() - 0.5) * factor;
      camera.object3D.position.y = originalCamPos.y + (Math.random() - 0.5) * factor;
      camera.object3D.position.z = originalCamPos.z + (Math.random() - 0.5) * factor;

      requestAnimationFrame(shake);
    } else {
      roc.object3D.position.set(originalRocPos.x, originalRocPos.y, originalRocPos.z);
      camera.object3D.position.set(originalCamPos.x, originalCamPos.y, originalCamPos.z);

      if (callback) callback();
    }
  }

  shake();
}

// Clic sur le roc : enchaînement des sons et tremblement
roc.addEventListener('click', () => {
  gaspSound.currentTime = 0;
  gaspSound.play();

  gaspSound.onended = () => {
    audioRumble.currentTime = 0;
    audioRumble.play();
    shakeCameraAndRoc(6000, 0.5, () => {
      finalSound.currentTime = 0;
      finalSound.play();
      audioRumble.pause();
    });
  };
});

// Clic sur la vidéo : toggle play/visible
videoEntity.addEventListener('click', () => {
  if (!videoEntity.getAttribute('visible')) {
    videoEntity.setAttribute('visible', true);
    videoEl.play();
  } else {
    videoEntity.setAttribute('visible', false);
    videoEl.pause();
    videoEl.currentTime = 0;
  }
});

// Gestion des portails
clickableElements.forEach(el => {
  el.addEventListener('click', () => {
    const url = el.getAttribute('data-url');
    if (url) window.location.href = url;
  });
});
