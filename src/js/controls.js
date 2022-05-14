import * as THREE from "three";
import gsap from "gsap";

import { camera, controls } from "./camera.js";
import { ghost } from "./ghost.js";

export const moveForward = () => {
  let direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  gsap.to(ghost.position, {
    x: ghost.position.x + 1 * direction.x,
    z: ghost.position.z + 1 * direction.z,
  });

  //controls.moveForward(1);
  //controls.target.z = controls.target.z - 1;
};

export const moveLeft = () => {
  let direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  gsap.to(ghost.position, {
    x: ghost.position.x + 1 * direction.z,
    z: ghost.position.z - 1 * direction.x,
  });

  //controls.target.x = controls.target.x - 1;
};

export const moveBackward = () => {
  let direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  gsap.to(ghost.position, {
    x: ghost.position.x - 1 * direction.x,
    z: ghost.position.z - 1 * direction.z,
  });

  //controls.target.z = controls.target.z + 1;
};

export const moveRight = () => {
  let direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  gsap.to(ghost.position, {
    x: ghost.position.x - 1 * direction.z,
    z: ghost.position.z + 1 * direction.x,
  });

  //controls.target.x = controls.target.x + 1;
};
