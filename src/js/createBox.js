import * as THREE from "three";
import CANNON from "cannon";

export const createBox = (
  width,
  height,
  depth,
  position,
  mass,
  material,
  boxMaterial,
  collisionFilterGroup,
  collisionFilterMask,
  world,
  scene
) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    boxMaterial
  );
  mesh.castShadow = true;

  mesh.position.copy(position);
  scene.add(mesh);

  const body = createBoxBody(
    width,
    height,
    depth,
    position,
    mass,
    material,
    collisionFilterGroup,
    collisionFilterMask,
    world
  );

  return { body, mesh };
};

export const createBoxBody = (
  width,
  height,
  depth,
  position,
  mass,
  material,
  collisionFilterGroup,
  collisionFilterMask,
  world
) => {
  // Cannon.js body
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );

  const body = new CANNON.Body({
    mass,
    position,
    shape,
    material,
    collisionFilterGroup,
    collisionFilterMask,
  });

  world.addBody(body);

  return body;
};
