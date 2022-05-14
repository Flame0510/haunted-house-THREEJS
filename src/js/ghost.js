import * as THREE from "three";

export let ghost;

export const createGhost = ({ scene }) => {
  ghost = new THREE.PointLight("#0fffff", 2, 3);
  ghost.castShadow = true;
  scene.add(ghost);

  return ghost;
};
