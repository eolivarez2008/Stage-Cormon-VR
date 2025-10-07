const roc = document.querySelector('#roc');
const camera = document.querySelector('a-camera');
const videoEntity = document.querySelector('#cartVideo');
const videoEl = document.querySelector('#CART_SECRET');
const clickableElements = document.querySelectorAll('.clickable');

// Fonction tremblement caméra
function shakeCamera(duration = 2000, magnitude = 0.3) {
  const start = Date.now();
  const originalPos = camera.getAttribute('position');

  function shake() {
    const elapsed = Date.now() - start;
    if (elapsed < duration) {
      const offsetX = Math.sin(elapsed * 0.1) * magnitude * (Math.random() * 0.5 + 0.5);
      const offsetY = Math.cos(elapsed * 0.1) * magnitude * (Math.random() * 0.5 + 0.5);
      const offsetZ = Math.sin(elapsed * 0.1) * magnitude * (Math.random() * 0.5 + 0.5);

      camera.setAttribute('position', {
        x: originalPos.x + offsetX,
        y: originalPos.y + offsetY,
        z: originalPos.z + offsetZ
      });

      requestAnimationFrame(shake);
    } else {
      camera.setAttribute('position', originalPos);
    }
  }

  shake();
}

// Gestion du clic sur le roc
roc.addEventListener('click', () => {
  shakeCamera(2000, 0.5);
});

// Gestion de la vidéo
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
