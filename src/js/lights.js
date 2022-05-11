import * as THREE from "three";

export const lights = ({ gui, scene }) => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
  gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
  scene.add(ambientLight);

  // Directional light
  const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
  moonLight.position.set(4, 5, -2);
  gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
  gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
  gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
  gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);

  moonLight.castShadow = true;

  moonLight.shadow.mapSize.width = 256;
  moonLight.shadow.mapSize.height = 256;
  moonLight.shadow.camera.far = 15;

  scene.add(moonLight);
};
