import * as THREE from "three";
import gsap from "gsap";

import { camera, controls } from "./camera.js";
import { ghost } from "./ghost.js";

export const moveForward = (velocity = 1) => {
  let direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  gsap.to(ghost.position, {
    x: ghost.position.x + velocity * direction.x,
    z: ghost.position.z + velocity * direction.z,
  });

  //controls.moveForward(velocity);
  //controls.target.z = controls.target.z - velocity;
};

export const moveLeft = (velocity = 1) => {
  let direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  gsap.to(ghost.position, {
    x: ghost.position.x + velocity * direction.z,
    z: ghost.position.z - velocity * direction.x,
  });

  //controls.target.x = controls.target.x - velocity;
};

export const moveBackward = (velocity = 1) => {
  let direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  gsap.to(ghost.position, {
    x: ghost.position.x - velocity * direction.x,
    z: ghost.position.z - velocity * direction.z,
  });

  //controls.target.z = controls.target.z + velocity;
};

export const moveRight = (velocity = 1) => {
  let direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  gsap.to(ghost.position, {
    x: ghost.position.x - velocity * direction.z,
    z: ghost.position.z + velocity * direction.x,
  });

  //controls.target.x = controls.target.x + 1;
};
