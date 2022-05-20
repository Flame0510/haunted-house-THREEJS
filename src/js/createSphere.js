import * as THREE from "three";
import CANNON from "cannon";

export const createSphere = (
  radius,
  position,
  mass,
  material,
  world,
  scene
) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 20, 20),
    new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMapIntensity: 0.5,
    })
  );
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  const body = createSphereBody(radius, position, mass, material, world);

  return { body, mesh };
};

const createSphereBody = (radius, position, mass, material, world) => {
  // Cannon.js body
  const shape = new CANNON.Sphere(radius);

  const body = new CANNON.Body({
    mass,
    position,
    shape,
    material,
  });
  body.position.copy(position);
  world.addBody(body);

  return body;
};
