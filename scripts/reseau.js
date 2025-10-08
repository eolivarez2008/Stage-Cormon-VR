// === CONFIGURATION ===
const CONFIG = {
  matrixColor: '#FF0000',
  sphereColor: '#FF0000',
  sphereRadius: 0.15,
  sphereIntensity: 300,
  sphereSpeed: 0.04,     // vitesse de base moyenne
  matrixFontSize: 32,
  matrixTrail: 0.05,
  matrixReflectivity: 0.6,
  envLightIntensity: 10,
  ambientIntensity: 10,
  sphereHeight: 1.6 // Hauteur fixe des boules
};

// === TRAJECTOIRES PAR ID ===
const TRAJECTORIES = [
  { startId: 'boy1Model', endId: 'boy1Model3' },
  { startId: 'boy1Model2', endId: 'boy1Model4' },
  { startId: 'boy1Model1', endId: 'boy1Model3' }
];

// === INITIALISATION SCÈNE ===
const scene = document.querySelector('a-scene');

// ------------------------
// Texture Matrix animée
// ------------------------
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

  ctx.fillStyle = CONFIG.matrixColor;
  ctx.font = CONFIG.matrixFontSize + 'px monospace';

  drops.forEach((drop, i) => {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * CONFIG.matrixFontSize, drop.y);
    drop.y += drop.speed;
    if (drop.y > canvas.height) {
      drop.y = 0;
      drop.speed = 3 + Math.random() * 5;
    }
  });

  texture.needsUpdate = true;
  requestAnimationFrame(animateMatrix);
}
animateMatrix();

// ------------------------
// Appliquer la texture Matrix aux modèles 3D
// ------------------------
document.querySelectorAll('a-gltf-model, a-obj-model').forEach(model => {
  model.addEventListener('model-loaded', () => {
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

// ------------------------
// Lumières globales
// ------------------------
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

// ------------------------
// Création et animation des boules avec IDs
// ------------------------
const spheres = [];

TRAJECTORIES.forEach((path, i) => {
  const startObj = document.getElementById(path.startId);
  const endObj = document.getElementById(path.endId);

  if (!startObj || !endObj) {
    console.warn(`❌ Trajectoire ignorée : ${path.startId} ou ${path.endId} introuvable.`);
    return;
  }

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

  // Décalage aléatoire et variation de vitesse
  const offset = Math.random();
  const speedFactor = 0.8 + Math.random() * 0.4;

  spheres.push({
    sphere,
    startObj,
    endObj,
    t: offset,             
    speed: CONFIG.sphereSpeed * speedFactor
  });
});

// ------------------------
// Animation asynchrone des boules
// ------------------------
function animateSpheres() {
  spheres.forEach(obj => {
    obj.t += obj.speed;

    if (obj.t >= 1) obj.t = 0;

    const startPos = new THREE.Vector3();
    const endPos = new THREE.Vector3();
    obj.startObj.object3D.getWorldPosition(startPos);
    obj.endObj.object3D.getWorldPosition(endPos);

    // Hauteur fixe
    startPos.y = CONFIG.sphereHeight;
    endPos.y = CONFIG.sphereHeight;

    const pos = new THREE.Vector3().lerpVectors(startPos, endPos, obj.t);
    obj.sphere.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
  });

  requestAnimationFrame(animateSpheres);
}
animateSpheres();
