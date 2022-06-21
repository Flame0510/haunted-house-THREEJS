import * as THREE from "three";

export let ghost;

export const createGhost = ({ scene }) => {
  ghost = new THREE.PointLight("#0fffff", 3, 3);
  ghost.castShadow = true;

  ghost.shadow.mapSize.width = 128;
  ghost.shadow.mapSize.height = 128;
  ghost.shadow.camera.far = 7;
  ghost.shadow.bias = 0.0001;
  ghost.radius = 0.01;

  scene.add(ghost);

  return ghost;
};
