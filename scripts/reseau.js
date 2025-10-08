// === CONFIGURATION ===
const CONFIG = {
  matrixColorGLB: '#FF0000',   // Couleur des lettres Matrix pour les modèles GLB / GLTF
  matrixColorOBJ: '#00FF00',   // Couleur des lettres Matrix pour les modèles OBJ
  sphereColor: '#00FF00',      // Couleur des sphères lumineuses
  sphereRadius: 0.15,          // Taille (rayon) des sphères
  sphereIntensity: 300,        // Intensité de la lumière émise par les sphères
  sphereSpeed: 0.02,           // Vitesse moyenne de déplacement des sphères
  matrixFontSize: 32,          // Taille de la police utilisée pour les lettres Matrix
  matrixTrail: 0.05,           // Transparence de la traînée Matrix (effet de chute des lettres)
  matrixReflectivity: 0.6,     // Réflectivité du matériau Matrix appliqué sur les modèles
  envLightIntensity: 10,       // Intensité de la lumière directionnelle globale
  ambientIntensity: 10,        // Intensité de la lumière ambiante
  sphereHeight: 3,           // Hauteur fixe du déplacement des sphères
  linkCount: 20               // Nombre de sphères animées actives simultanément
};

const scene = document.querySelector('a-scene');

// === TEXTURE MATRIX ANIMÉE ===
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

const textureGLB = createMatrixTexture(CONFIG.matrixColorGLB);
const textureOBJ = createMatrixTexture(CONFIG.matrixColorOBJ);

// === APPLICATION DES TEXTURES ===
document.querySelectorAll('a-gltf-model, a-obj-model').forEach(model => {
  model.addEventListener('model-loaded', () => {
    const isOBJ = model.tagName === 'A-OBJ-MODEL';
    const texture = isOBJ ? textureOBJ : textureGLB;

    model.object3D.traverse(node => {
      if (node.isMesh) {
        const mat = new THREE.MeshStandardMaterial({
          map: texture,
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
  });
});

// === LUMIÈRES ===
const envLight = document.createElement('a-entity');
envLight.setAttribute(
  'light',
  `type: directional; color: #ffcccc; intensity: ${CONFIG.envLightIntensity}; position: 10 10 0`
);
scene.appendChild(envLight);

const ambientLight = document.createElement('a-entity');
ambientLight.setAttribute(
  'light',
  `type: ambient; intensity: ${CONFIG.ambientIntensity}; color: #ffffff`
);
scene.appendChild(ambientLight);

// === OBJETS DISPONIBLES ===
const objModels = Array.from(document.querySelectorAll('a-obj-model')).filter(o => o.id);
if (objModels.length < 2) {
  console.warn("⚠️ Pas assez d'objets pour créer des liaisons !");
}

// === CRÉATION DES BOULES DYNAMIQUES ===
const spheres = [];

for (let i = 0; i < CONFIG.linkCount; i++) {
  const sphere = document.createElement('a-sphere');
  sphere.setAttribute('radius', CONFIG.sphereRadius);
  sphere.setAttribute('color', CONFIG.sphereColor);
  sphere.setAttribute(
    'material',
    `emissive: ${CONFIG.sphereColor}; emissiveIntensity: 2; metalness: 0.2; roughness: 0`
  );
  scene.appendChild(sphere);

  const light = document.createElement('a-entity');
  light.setAttribute(
    'light',
    `type: point; color: ${CONFIG.sphereColor}; intensity: ${CONFIG.sphereIntensity}; distance: 30; decay: 2; castShadow: true`
  );
  sphere.appendChild(light);

  const startObj = objModels[Math.floor(Math.random() * objModels.length)];
  let endObj;
  do {
    endObj = objModels[Math.floor(Math.random() * objModels.length)];
  } while (endObj === startObj);

  spheres.push({
    sphere,
    startObj,
    endObj,
    t: Math.random(),
    speed: CONFIG.sphereSpeed * (0.8 + Math.random() * 0.4)
  });
}

// === ANIMATION DES BOULES ===
function animateSpheres() {
  spheres.forEach(obj => {
    obj.t += obj.speed;
    if (obj.t >= 1) {
      obj.t = 0;

      // Nouveau trajet aléatoire
      obj.startObj = obj.endObj;
      do {
        obj.endObj = objModels[Math.floor(Math.random() * objModels.length)];
      } while (obj.endObj === obj.startObj);
    }

    const startPos = new THREE.Vector3();
    const endPos = new THREE.Vector3();
    obj.startObj.object3D.getWorldPosition(startPos);
    obj.endObj.object3D.getWorldPosition(endPos);

    startPos.y = CONFIG.sphereHeight;
    endPos.y = CONFIG.sphereHeight;

    const pos = new THREE.Vector3().lerpVectors(startPos, endPos, obj.t);
    obj.sphere.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
  });
  requestAnimationFrame(animateSpheres);
}
animateSpheres();
