import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
scene.add(pointLight);

// Geometry and Material
const geometry = new THREE.BoxGeometry();
const texture = new THREE.TextureLoader().load('./assets/texture.jpg');
const material = new THREE.MeshStandardMaterial({ map: texture });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Bouncing Sphere
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 3, 0);
scene.add(sphere);

// Shader Material (Plane)
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

const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
});

const planeGeometry = new THREE.PlaneGeometry(5, 5);
const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = 0;
scene.add(plane);

// Moving Light
const movingLight = new THREE.PointLight(0x00ff00, 1, 10);
scene.add(movingLight);

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.05;

// Variables for Animation
let velocity = 0;
const gravity = -0.02;

// Animation Function
function animate() {
  requestAnimationFrame(animate);

  // Rotate Cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Update Bouncing Sphere
  velocity += gravity;
  sphere.position.y += velocity;

  if (sphere.position.y < 0.5) {
    sphere.position.y = 0.5;
    velocity *= -0.8; // Reverse direction and reduce speed
  }

  // Update Moving Light
  movingLight.position.set(
    Math.sin(Date.now() * 0.002) * 5,
    3,
    Math.cos(Date.now() * 0.002) * 5
  );

  // Update Controls and Render
  controls.update();
  renderer.render(scene, camera);
}

camera.position.z = 5;
animate();

// Handle Resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});