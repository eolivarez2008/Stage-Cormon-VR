const roc = document.querySelector('#roc');
const camera = document.querySelector('a-camera');
const videoEntity = document.querySelector('#cartVideo');
const videoEl = document.querySelector('#CART_SECRET');

// Sons depuis <a-assets>
const gaspSound = document.querySelector('#gaspSound');  
const audioRumble = document.querySelector('#rumbleSound');
const finalSound = document.querySelector('#finalSound');

// Pop-up portail
const popup = document.createElement('div');
popup.id = 'popup';
popup.style.cssText = `
  display: none;
  position: fixed;
  top: 5%;
  left: 5%;
  width: 90%;
  height: 90%;
  background-color: rgba(0,0,0,0.95);
  color: white;
  border-radius: 10px;
  padding: 20px;
  z-index: 2000;
  overflow-y: auto;
  box-shadow: 0 0 20px #000;
`;
const closeBtn = document.createElement('button');
closeBtn.textContent = 'X';
closeBtn.style.cssText = `
  position: absolute;
  top: 15px;
  right: 20px;
  background: red;
  color: white;
  border: none;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
`;
const popupContent = document.createElement('div');
popupContent.id = 'popupContent';
popupContent.style.marginTop = '50px';
popup.appendChild(closeBtn);
popup.appendChild(popupContent);
document.body.appendChild(popup);

// Fermeture du popup
function closePopup() {
  popup.style.display = 'none';
}
closeBtn.addEventListener('click', closePopup);
document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' || e.code === 'Space') closePopup();
});

// Contenu des portails depuis JSON
let portalsData = {};
fetch('../data/portals.json')
  .then(res => res.json())
  .then(data => portalsData = data)
  .catch(err => console.error('Erreur chargement JSON:', err));

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

// Gestion des portails : affichage pop-up (uniquement portails)
const portalElements = document.querySelectorAll('.portal-clickable');
portalElements.forEach(el => {
  el.addEventListener('click', () => {
    const key = el.getAttribute('data-key');
    if (portalsData[key]) {
      popupContent.innerHTML = `<h1>${portalsData[key].title}</h1>${portalsData[key].content}`;
      popup.style.display = 'block';
    } else {
      popupContent.innerHTML = `<h1>Portail</h1><p>Contenu indisponible</p>`;
      popup.style.display = 'block';
    }
  });
});
