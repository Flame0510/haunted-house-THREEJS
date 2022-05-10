import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";
import { RGBA_ASTC_10x10_Format } from "three";

import gamepads from "html5-gamepad";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//LOADER MANAGER
const manager = new THREE.LoadingManager();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

manager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log("start");
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
  console.log("%");

  document.querySelector(".loader h1").innerHTML =
    "ITEMS LOADED: " + itemsLoaded + "/" + itemsTotal;
};

manager.onLoad = function () {
  console.log("FINISH");

  document.querySelector(".loader").style.display = "none";
};

//GLTFLoader
const loader = new GLTFLoader();

/**
 * House
 */
// Temporary sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ roughness: 0.7 })
);
sphere.position.y = 1;
scene.add(sphere);

// Floor
const grassColorTexture = textureLoader.load("/textures/rock/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/rock/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/rock/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/rock/roughness.jpg"
);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

//gui.destroy();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 1.4;
camera.position.z = 6;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
//controls.enableDamping = true;

/* controls.minDistance = 5;
controls.maxDistance = 12;

controls.maxPolarAngle = 1.2;
controls.minPolarAngle = 1.2; */

controls.addEventListener("lock", () => (menuPanel.style.display = "none"));
controls.addEventListener("unlock", () => (menuPanel.style.display = "block"));

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

let isJumping = false;

const onKeyDown = function (event) {
  switch (true) {
    case event.code === "KeyW" || event.code === "ArrowUp":
      gsap.to(camera.position, {
        z: camera.position.z - 1,
      });
      break;
      a;
    case event.code === "KeyA" || event.code === "ArrowLeft":
      gsap.to(camera.position, {
        x: camera.position.x - 1,
      });
      break;
    case event.code === "KeyS" || event.code === "ArrowDown":
      gsap.to(camera.position, {
        z: camera.position.z + 1,
      });
      break;
    case event.code === "KeyD" || event.code === "ArrowRight":
      gsap.to(camera.position, {
        x: camera.position.x + 1,
      });

      break;

    case event.code === "Space":
      jump();
      break;
  }
};
document.addEventListener("keydown", onKeyDown, false);

const jump = () => {
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

document.querySelector("#jump-btn").addEventListener("click", jump);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");
renderer.shadowMap.enabled = true;

//HOUSE
const house = new THREE.Group();
scene.add(house);

//WALLS
const bricksColorTexture = textureLoader.load("/textures/wall/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/wall/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/wall/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/wall/roughness.jpg"
);

bricksColorTexture.repeat.set(1.5, 1.5);
bricksAmbientOcclusionTexture.repeat.set(1.5, 1.5);
bricksNormalTexture.repeat.set(1.5, 1.5);
bricksRoughnessTexture.repeat.set(1.5, 1.5);

bricksColorTexture.wrapS = THREE.RepeatWrapping;
bricksAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
bricksNormalTexture.wrapS = THREE.RepeatWrapping;
bricksRoughnessTexture.wrapS = THREE.RepeatWrapping;

bricksColorTexture.wrapT = THREE.RepeatWrapping;
bricksAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
bricksNormalTexture.wrapT = THREE.RepeatWrapping;
bricksRoughnessTexture.wrapT = THREE.RepeatWrapping;

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 1.25;
house.add(walls);

// Roof
const roofColorTexture = textureLoader.load("/textures/roof/color.jpg");
const roofAmbientOcclusionTexture = textureLoader.load(
  "/textures/roof/ambientOcclusion.jpg"
);
const roofNormalTexture = textureLoader.load("/textures/roof/normal.jpg");
const roofRoughnessTexture = textureLoader.load("/textures/roof/roughness.jpg");

roofColorTexture.repeat.set(6, 6);
roofAmbientOcclusionTexture.repeat.set(6, 6);
roofNormalTexture.repeat.set(6, 6);
roofRoughnessTexture.repeat.set(6, 6);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofRoughnessTexture.wrapS = THREE.RepeatWrapping;

roofColorTexture.wrapT = THREE.RepeatWrapping;
roofAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;
roofRoughnessTexture.wrapT = THREE.RepeatWrapping;

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofAmbientOcclusionTexture,
    normalMap: roofNormalTexture,
    roughnessMap: roofRoughnessTexture,
  })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 2.5 + 0.5;
house.add(roof);

// Door
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

door.position.set(0, 1, 2.02);
door.scale.set(1, 1, 2);
house.add(door);

// loader.load("/models/door/door.gltf", (gltf) => {
//   const door = gltf.scene;
//   door.position.set(-0.5, 0, 2.2);
//   door.scale.set(0.5, 0.5, 0.5);

//  /*  gltf.traverse(
//     (d) =>
//       (d.material = new THREE.MeshStandardMaterial({
//         map: textureLoader.load(
//           "/models/door/textures/ugywdfqdw_2K_Albedo.jpg"
//         ),
//         //aoMap: textureLoader.load("/models/grave/color"),
//         normalMap: textureLoader.load(
//           "/models/door/textures/ugywdfqdw_2K_Normal.jpg"
//         ),
//         roughnessMap: textureLoader.load(
//           "/models/door/textures/ugywdfqdw_2K_Roughness.jpg"
//         ),
//       }))
//   ); */
//   house.add(door);
// });

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

/* loader.load("/models/plant.glb", (glb) => {
  const plant = glb.scene;

  plant.scale.set(1, 1, 1);
  plant.position.set(0.8, 0, 2.2);

  house.add(plant);
});

loader.load("/models/plant_c.glb", (glb) => {
  const plant = glb.scene;

  plant.scale.set(2, 2, 2);
  plant.position.set(1.4, 0, 2.1);

  house.add(plant);
});

loader.load("/models/plant_c.glb", (glb) => {
  const plant = glb.scene;

  plant.scale.set(1.2, 1.2, 1.2);
  plant.position.set(-0.8, 0, 2.2);

  house.add(plant);
});

loader.load("/models/plant_c.glb", (glb) => {
  const plant = glb.scene;

  plant.scale.set(1.2, 1.2, 1.2);
  plant.position.set(-1.2, 0, 2.2);

  house.add(plant);
}); */

/* const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4); */

for (let p = 0; p < 50; p++) {
  loader.load("/models/plant.glb", (glb) => {
    const plant = glb.scene;

    const angle = Math.random() * Math.PI * 2; // Random angle
    const radius = 3 + Math.random() * 6; // Random radius
    const x = Math.cos(angle) * radius; // Get the x position using cosinus
    const z = Math.sin(angle) * radius; // Get the z position using sinus

    //plant.scale.set(0.01, 0.01, 0.01);
    plant.position.set(x, 0, z);
    plant.rotation.y = angle;

    scene.add(plant);
  });
}

// Graves

const graves = new THREE.Group();
scene.add(graves);

const gravesColorTexture = textureLoader.load("/models/grave/color.jpg");
const gravesNormalTexture = textureLoader.load("/models/grave/normal.jpg");
const gravesRoughnessTexture = textureLoader.load(
  "/models/grave/roughness.jpg"
);

// gravesColorTexture.repeat.set(1, 1);
// gravesNormalTexture.repeat.set(1, 1);
// gravesRoughnessTexture.repeat.set(1, 1);

gravesColorTexture.wrapS = THREE.RepeatWrapping;
gravesNormalTexture.wrapS = THREE.RepeatWrapping;
gravesRoughnessTexture.wrapS = THREE.RepeatWrapping;

gravesColorTexture.wrapT = THREE.RepeatWrapping;
gravesNormalTexture.wrapT = THREE.RepeatWrapping;
gravesRoughnessTexture.wrapT = THREE.RepeatWrapping;

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: gravesColorTexture,
  //aoMap: textureLoader.load("/models/grave/color"),
  normalMap: gravesNormalTexture,
  roughnessMap: gravesRoughnessTexture,
});

for (let i = 0; i < 26; i++) {
  const angle = Math.random() * Math.PI * 2; // Random angle
  const radius = 3 + Math.random() * 6; // Random radius
  const x = Math.cos(angle) * radius; // Get the x position using cosinus
  const z = Math.sin(angle) * radius; // Get the z position using sinus

  // Create the mesh
  loader.load("/models//grave/grave.glb", (glb) => {
    const grave = glb.scene;

    grave.castShadow = true;

    // Position
    grave.position.set(x, -0.1, z);

    grave.scale.set(0.012, 0.012, 0.012);

    // Rotation
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;

    grave.traverse((g) => {
      //g.material = graveMaterial;
    });

    // Add to the graves container
    graves.add(grave);
  });
}

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost3);

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;

floor.receiveShadow = true;

moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.far = 15;

// ...

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

// ...

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

// ...

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

// ...

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

// ...

renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Fog
 */
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
