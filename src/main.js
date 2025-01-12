// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// // Scene, Camera, Renderer
// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x101010); // Set a dark gray background for better contrast

// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer({ antialias: true });

// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.shadowMap.enabled = true; // Enable shadows
// renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows
// document.body.appendChild(renderer.domElement);

// // Lighting
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Softer ambient light for better contrast
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 1);
// pointLight.position.set(5, 5, 5);
// pointLight.castShadow = true;
// scene.add(pointLight);

// // Moving Light
// const movingLight = new THREE.PointLight(0x00ff00, 5, 50); // Increased intensity and range
// movingLight.castShadow = true;
// scene.add(movingLight);

// // Add a helper for debugging the moving light
// const lightHelper = new THREE.PointLightHelper(movingLight, 0.5); // Visualize the light
// scene.add(lightHelper);

// // Rotating Cube with Texture
// const cubeGeometry = new THREE.BoxGeometry();
// const texture = new THREE.TextureLoader().load(
//   '/assets/oak_veneer_01_diff_4k.jpg',
//   () => console.log("Texture loaded successfully"), // Log success
//   undefined,
//   (error) => console.error("Error loading texture:", error) // Log errors
// );
// const cubeMaterial = new THREE.MeshStandardMaterial({ map: texture });
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// cube.castShadow = true;
// cube.position.set(0, 2, 0); // Cube floats above the sphere
// scene.add(cube);

// // Bouncing Sphere
// const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
// const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// sphere.castShadow = true;
// sphere.position.set(0, 1, 0); // Start above the plane
// scene.add(sphere);

// // Shader Plane (Gradient Background)
// const vertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;

// const fragmentShader = `
//   varying vec2 vUv;
//   void main() {
//     gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
//   }
// `;

// const planeMaterial = new THREE.ShaderMaterial({
//   vertexShader,
//   fragmentShader,
// });

// const planeGeometry = new THREE.PlaneGeometry(10, 10);
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.rotation.x = -Math.PI / 2;
// plane.receiveShadow = true;
// scene.add(plane);

// // Camera Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.1;

// // Animation Variables
// let velocity = 0; // Initial velocity of the sphere
// const gravity = -0.01; // Gravity force
// const bounceDamping = 0.8; // Energy lost after each bounce

// // Animation Function
// function animate() {
//   requestAnimationFrame(animate);

//   // Rotate Cube
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;

//   // Bounce Sphere
//   velocity += gravity; // Apply gravity
//   sphere.position.y += velocity; // Update sphere's position

//   // Check for collision with the plane
//   if (sphere.position.y < 0.5) {
//     sphere.position.y = 0.5; // Set position to just above the plane
//     velocity *= -bounceDamping; // Reverse velocity and apply damping
//   }

//   // Move Light in a Circular Path
//   movingLight.position.set(
//     Math.sin(Date.now() * 0.002) * 10, // Circular motion on x-axis
//     3, // Constant height
//     Math.cos(Date.now() * 0.002) * 10 // Circular motion on z-axis
//   );

//   controls.update();
//   renderer.render(scene, camera);
// }

// camera.position.set(0, 5, 10);
// animate();

// // Handle Resize
// window.addEventListener('resize', () => {
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
// });

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101010); // Dark gray background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft ambient light
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(5, 10, 5);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
scene.add(spotLight);

// Moving Green Light
const movingLight = new THREE.PointLight(0x00ff00, 5, 50);
movingLight.castShadow = true;
scene.add(movingLight);
const lightHelper = new THREE.PointLightHelper(movingLight, 0.5);
scene.add(lightHelper);

// Post-Processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

// Ground
// const planeGeometry = new THREE.PlaneGeometry(20, 20);
// const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
// const ground = new THREE.Mesh(planeGeometry, planeMaterial);
// ground.rotation.x = -Math.PI / 2;
// ground.receiveShadow = true;
// scene.add(ground);

// Shader Plane (Gradient Background)
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
  }
`;

const gradientPlaneMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
});

const gradientPlaneGeometry = new THREE.PlaneGeometry(10, 10);
const gradientPlane = new THREE.Mesh(gradientPlaneGeometry, gradientPlaneMaterial);
gradientPlane.rotation.x = -Math.PI / 2;
gradientPlane.receiveShadow = true;
scene.add(gradientPlane);

// Rotating Cube with Texture
const cubeGeometry = new THREE.BoxGeometry();
const texture = new THREE.TextureLoader().load(
  '/assets/oak_veneer_01_diff_4k.jpg',
  () => console.log("Texture loaded successfully"),
  undefined,
  (error) => console.error("Error loading texture:", error)
);
const cubeMaterial = new THREE.MeshStandardMaterial({ map: texture });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
cube.position.set(0, 2, 0);
scene.add(cube);

// Bouncing Sphere
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.position.set(0, 1, 0);
scene.add(sphere);

// Particle System
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 500;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 50;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({ size: 0.2, color: 0xffffff });
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Load 3D Model
const loader = new GLTFLoader();
loader.load('/assets/model.glb', (gltf) => {
  const model = gltf.scene;
  model.position.set(2, 0, 2); // Offset from cube and sphere
  model.castShadow = true;
  model.scale.set(1, 1, 1);
  scene.add(model);
});

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// Animation Variables
let velocity = 0; // Initial velocity of the sphere
const gravity = -0.01; // Gravity force
const bounceDamping = 0.8; // Energy lost after each bounce

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate Cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Bounce Sphere
  velocity += gravity;
  sphere.position.y += velocity;

  if (sphere.position.y < 0.5) {
    sphere.position.y = 0.5;
    velocity *= -bounceDamping; // Reverse velocity with damping
  }

  // Move Light in a Circular Path
  movingLight.position.set(
    Math.sin(Date.now() * 0.002) * 10,
    3,
    Math.cos(Date.now() * 0.002) * 10
  );

  composer.render();
}

animate();

// Handle Resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  composer.setSize(window.innerWidth, window.innerHeight);
});



