import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

import { move } from "./controls";

export let camera;
export let controls;

export const cameraSetup = ({ ghost, sizes, canvas, scene }) => {
  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 0;
  camera.position.y = 3;
  camera.position.z = 8;
  scene.add(camera);

  // Controls
  controls = new OrbitControls(camera, canvas);

  //controls.enabled = false;

  controls.enableDamping = true;

  controls.enableZoom = false;

  controls.rotateSpeed = 0.2;

  controls.maxPolarAngle = 0.98;
  controls.minPolarAngle = 0.98;

  //controls.target.set(0, 0, 0);

  ghost.position.set(camera.position.x, 1, camera.position.z - 3);

  //camera.attach(ghost);
  ghost.attach(camera);
  //camera.lookAt(ghost.position);

  /* controls.addEventListener("change", () => {
    const vec = new Vector3();
    camera.getWorldDirection(vec);
    console.log(camera.rotation);
  }); */

  controls.addEventListener("lock", () => console.log("LOCK"));
  controls.addEventListener("unlock", () => console.log("UNLOCK"));

  const onKeyDown = function (event) {
    switch (true) {
      case event.code === "KeyW" || event.code === "ArrowUp":
        move(1, 0);
        break;
        a;
      case event.code === "KeyA" || event.code === "ArrowLeft":
        move(0, 1);
        break;
      case event.code === "KeyS" || event.code === "ArrowDown":
        move(-1, 0);
        break;
      case event.code === "KeyD" || event.code === "ArrowRight":
        move(0, -1);

        break;

      case event.code === "Space":
        jump();
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown, false);

  return camera;
};
