import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

import {
  moveForward,
  moveLeft,
  moveBackward,
  moveRight,
  jump,
} from "./controls";

export let camera;
export let controls;

export const cameraSetup = ({ ghost, sizes, canvas, scene }) => {
  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 2;
  camera.position.y = 2;
  camera.position.z = 6;
  scene.add(camera);

  // Controls
  controls = new OrbitControls(camera, canvas);

  //controls.enabled = false;

  controls.enableDamping = true;

  controls.enableZoom = false;

  controls.minDistance = 5;
  controls.maxDistance = 12;

  controls.maxPolarAngle = 1.2;
  controls.minPolarAngle = 1.2;

  //controls.target.set(0, 0, 0);

  ghost.position.set(camera.position.x, 1, camera.position.z - 3);

  //camera.attach(ghost);
  ghost.attach(camera);
  //camera.lookAt(ghost.position);

  controls.addEventListener("change", () => {
    const vec = new Vector3();
    camera.getWorldDirection(vec);
    console.log(camera.rotation);
    //camera.position.y = 2;
  });

  controls.addEventListener("lock", () => console.log("LOCK"));
  controls.addEventListener("unlock", () => console.log("UNLOCK"));

  const moveField = document.querySelector("#move-field");
  const controlPad = document.querySelector("#control-pad");

  let touchStart;

  moveField.addEventListener("touchstart", ({ targetTouches }) => {
    touchStart = { x: targetTouches[0].clientX, y: targetTouches[0].clientY };
    /* controls.moveForward(
        targetTouches[0].clientY > moveFieldSize / 2 ? 0.1 : -0.1
      ); */
  });

  moveField.addEventListener("touchmove", ({ targetTouches }) => {
    controlPad.style.position = "absolute";

    const bottom = window.innerHeight - targetTouches[0].clientY;
    const left = targetTouches[0].clientX - controlPad.style.width / 2;

    const moveFieldSize = 120;

    const controlPadY =
      bottom > moveFieldSize ? moveFieldSize : bottom <= 0 ? 0 : bottom;
    const controlPadX =
      left > moveFieldSize ? moveFieldSize : left <= 0 ? 0 : left;

    console.log(controlPadY);

    controlPad.style.bottom = controlPadY + "px";
    controlPad.style.left = controlPadX + "px";

    controls.moveForward((touchStart.y - targetTouches[0].clientY) / 1000);
    controls.moveRight(((touchStart.x - targetTouches[0].clientX) / 1000) * -1);

    /*  controls.moveForward(
        targetTouches[0].clientY > moveFieldSize / 2 ? 0.1 : -0.1
      ); */
  });

  moveField.addEventListener(
    "touchend",
    () => (controlPad.style.position = "initial")
  );

  const onKeyDown = function (event) {
    switch (true) {
      case event.code === "KeyW" || event.code === "ArrowUp":
        moveForward();
        break;
        a;
      case event.code === "KeyA" || event.code === "ArrowLeft":
        moveLeft();
        break;
      case event.code === "KeyS" || event.code === "ArrowDown":
        moveBackward();
        break;
      case event.code === "KeyD" || event.code === "ArrowRight":
        moveRight();

        break;

      case event.code === "Space":
        jump();
        break;
    }

    /* controls.target.set(
      camera.position.x,
      camera.position.y - 0.5,
      camera.position.z - 1
    ); */

    //camera.lookAt(ghost);
  };

  /* document.querySelector("canvas").addEventListener("mousemove", (e) => {
    let vector = new THREE.Vector3();
    vector.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1,
      0
    );
    //vector.unproject(camera);

    console.log(vector.x);

    ghost.position.set(0, camera.position.y, camera.position.z);
  }); */

  document.addEventListener("keydown", onKeyDown, false);

  //document.querySelector("#jump-btn").addEventListener("click", jump);

  document
    .querySelector("#jump-btn")
    .addEventListener("click", () => controls.lock(), false);

  return camera;
};
