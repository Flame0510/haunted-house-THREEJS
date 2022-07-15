import * as THREE from "three";

export const particlesSetup = ({ scene }) => {
  // Geometry
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 200000;

  const positions = new Float32Array(count * 3); // Multiply by 3 because each position is composed of 3 values (x, y, z)

  for (
    let i = 0;
    i < count * 3;
    i++ // Multiply by 3 for same reason
  ) {
    positions[i] = (Math.random() - 0.5) * 32; // Math.random() - 0.5 to have a random value between -0.5 and +0.5
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  ); // Create the Three.js BufferAttribute and specify that each information is composed of 3 values

  const particlesMaterial = new THREE.PointsMaterial();
  particlesMaterial.size = 0.002;
  particlesMaterial.sizeAttenuation = true;
  particlesMaterial.color = new THREE.Color("#0fffff");

  // Points
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);

  scene.add(particles);

  return particles;
};
