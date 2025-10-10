const CONFIG = {
  matrixColor: '#FF0000',
  matrixFontSize: 32,
  matrixTrail: 0.05,
  matrixReflectivity: 0.6
};

// === Création de la texture animée "Matrix" ===
function createMatrixTexture(color) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const cols = Math.floor(canvas.width / CONFIG.matrixFontSize);
  const drops = Array(cols).fill().map(() => ({
    y: Math.random() * canvas.height,
    speed: 3 + Math.random() * 5
  }));
  const texture = new THREE.CanvasTexture(canvas);

  function animateMatrix() {
    ctx.fillStyle = `rgba(0,0,0,${CONFIG.matrixTrail})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.font = CONFIG.matrixFontSize + 'px monospace';
    drops.forEach((drop, i) => {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * CONFIG.matrixFontSize, drop.y);
      drop.y += drop.speed;
      if (drop.y > canvas.height) drop.y = 0;
    });
    texture.needsUpdate = true;
    requestAnimationFrame(animateMatrix);
  }

  animateMatrix();
  return texture;
}

const matrixTexture = createMatrixTexture(CONFIG.matrixColor);

// === Fonction d'application de l'effet sur un mesh ===
function applyMatrixEffectToEntity(entity) {
  if (!entity || !entity.object3D) return;
  entity.object3D.traverse(node => {
    if (node.isMesh) {
      const mat = new THREE.MeshStandardMaterial({
        map: matrixTexture,
        color: 0xffffff,
        metalness: CONFIG.matrixReflectivity,
        roughness: 0.3,
        emissive: new THREE.Color(0x111111),
        emissiveIntensity: 0.05
      });
      mat.map.wrapS = THREE.RepeatWrapping;
      mat.map.wrapT = THREE.RepeatWrapping;
      node.material = mat;
    }
  });
}

// === Attente des modèles GLTF/GLB ===
document.querySelectorAll('[gltf-model]').forEach(el => {
  el.addEventListener('model-loaded', () => applyMatrixEffectToEntity(el));
});

// === Attente des modèles OBJ ===
document.querySelectorAll('[obj-model]').forEach(el => {
  el.addEventListener('object3dset', () => applyMatrixEffectToEntity(el));
});

// === Sécurité : scan global après 2 secondes pour choper ceux oubliés ===
setTimeout(() => {
  document.querySelectorAll('a-entity').forEach(el => applyMatrixEffectToEntity(el));
}, 2000);

console.log("Script rideaux chargé");

AFRAME.registerComponent('rideau-move', {
  init: function () {
    const player = document.querySelector('#player');
    let moving = false;
    let moveTarget = new THREE.Vector3();
    const speed = 5.0;

    const rideaux = document.querySelectorAll('[id^="rideau-"]');
    rideaux.forEach(groupe => {
      const gauche = groupe.querySelector('.rideau-gauche');
      const droite = groupe.querySelector('.rideau-droite');
      if (!gauche || !droite) return;

      let ouvert = false;

      function ouvrirFermerEtAvancer() {
        if (moving) return;

        console.log("Click sur rideau :", groupe.id);
        console.log("Position actuelle caméra :", player.object3D.position);

        // Ouvre / ferme rideau
        if (!ouvert) {
          gauche.setAttribute('animation', 'property: scale; to: 0.0001 0.001 0.0006; dur: 1000; easing: easeOutQuad');
          droite.setAttribute('animation', 'property: scale; to: 0.0001 0.001 0.0006; dur: 1000; easing: easeOutQuad');
        } else {
          gauche.setAttribute('animation', 'property: scale; to: 0.001 0.001 0.0006; dur: 1000; easing: easeOutQuad');
          droite.setAttribute('animation', 'property: scale; to: 0.001 0.001 0.0006; dur: 1000; easing: easeOutQuad');
        }
        ouvert = !ouvert;

        // Calcul position cible
        const groupPos = new THREE.Vector3();
        groupe.object3D.getWorldPosition(groupPos);
        moveTarget.set(0, 1.6, groupPos.z - 10);
        moving = true;
        console.log("Position cible :", moveTarget);
      }

      gauche.addEventListener('click', ouvrirFermerEtAvancer);
      droite.addEventListener('click', ouvrirFermerEtAvancer);
    });

    this.tick = function (time, timeDelta) {
      if (!moving) return;

      const pos = player.object3D.position;
      const dir = new THREE.Vector3().subVectors(moveTarget, pos);
      const dist = dir.length();

      if (dist < 0.05) {
        pos.copy(moveTarget);
        moving = false;
        console.log("Arrivé à la position :", moveTarget);
        return;
      }

      dir.normalize();
      pos.x += dir.x * speed * (timeDelta / 1000);
      pos.y += dir.y * speed * (timeDelta / 1000);
      pos.z += dir.z * speed * (timeDelta / 1000);
      console.log("Caméra avancée vers :", pos);
    };
  }
});
