import * as THREE from "three";
import gsap from "gsap";

import { camera, controls } from "./camera.js";
import { ghost } from "./ghost.js";

export const moveForward = () => {
  //console.log(camera.rotation);

  console.log("G X: " + ghost.position.x + " - SUM: " + 1 * camera.position.x);
  console.log(ghost.position.z - 1 * camera.rotation.z);

  let direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  console.log(direction);

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

let isJumping = false;

export const jump = () => {
  if (!isJumping) {
    isJumping = true;

    gsap
      .timeline({ onComplete: () => (isJumping = false) })
      .to(camera.position, {
        y: 3,
        duration: 0.2,
      })
      .to(camera.position, {
        y: 1.4,
        duration: 0.2,
      });
  }
};
