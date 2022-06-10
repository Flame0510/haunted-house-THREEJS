import "./style.css";
import * as THREE from "three";
import CANNON from "cannon";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

import { lights } from "./js/lights.js";
import { cameraSetup } from "./js/camera.js";
import { floor } from "./js/floor.js";
import { wallsSetuo, wallsSetup } from "./js/walls.js";
import { roof } from "./js/roof.js";
import { bushes } from "./js/bushes.js";
import { graves } from "./js/graves.js";
import { door } from "./js/door.js";
import { ghosts } from "./js/ghosts.js";
import { fog } from "./js/fog.js";
import { bricksSetup } from "./js/bricks.js";
import { destructableWallSetup } from "./js/destructableWall";

import { createGhost } from "./js/ghost.js";
import { particlesSetup } from "./js/particles";
import { physicsSetup } from "./js/physics";

import { createSphere } from "./js/createSphere";
import { createBox, createBoxBody } from "./js/createBox";

import { collisionFilterGroups } from "./environments";

const { FLOOR, BRICKS, HOUSE, GHOST } = collisionFilterGroups;

var initializeDomEvents = require("threex-domevents");
var THREEx = {};
initializeDomEvents(THREE, THREEx);

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

//LOADER MANAGER
const manager = new THREE.LoadingManager();

//GLTFLoader
const loader = new GLTFLoader();

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

/**
 * House
 */

// Floor
floor({ textureLoader, scene });

// PARTICLES
const particles = particlesSetup({ scene });

/**
 * Lights
 */
lights({ intensity: 0.12, gui, scene });

gui.destroy();

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

//PHYSICS
const { defaultMaterial, plasticMaterial, world } = physicsSetup();

const { body: ghostBody, mesh: ghostMesh } = createSphere(
  0.8,
  new THREE.Vector3(0, 0, 4),
  100,
  defaultMaterial,
  2,
  4,
  world,
  scene
);

scene.remove(ghostMesh);

const ghost = createGhost({ scene });

/**
 * Camera
 */
const camera = cameraSetup({ ghost, sizes, canvas, scene });

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  antialiasing: true,
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const domEvents = new THREEx.DomEvents(camera, canvas);

const bricks = bricksSetup({
  ghostBody,
  textureLoader,
  defaultMaterial,
  world,
  scene,
});

const destructableWalls = [];

/* destructableWalls.push(
  destructableWallSetup({
    x: 3,
    z: 3,
    wallLenght: 6,
    wallHeight: 5,
    ghostBody,
    textureLoader,
    defaultMaterial,
    world,
    scene,
  })
);

destructableWalls.push(
  destructableWallSetup({
    x: -6,
    z: 5,
    wallLenght: 6,
    wallHeight: 5,
    ghostBody,
    textureLoader,
    defaultMaterial,
    world,
    scene,
  })
); */

//HOUSE
const house = new THREE.Group();
scene.add(house);

//WALLS
const { walls, wallsBody } = wallsSetup({
  textureLoader,
  house,
  defaultMaterial,
  world,
});

// Roof
//roof({ textureLoader, house });

// Door
//door({ textureLoader, house });

// Bushes
//bushes({ loader, scene });

// Graves
/* const gravesArray = graves({
  domEvents,
  textureLoader,
  loader,
  ghostBody,
  defaultMaterial,
  world,
  scene,
}); */

const gravesArray = [];

loader.load("/models/graveyard.glb", (glb) => {
  const stoneWall = glb.scene;

  stoneWall.position.set(0, 0, 0);
  stoneWall.scale.set(2, 2, 2);

  let i = 0;

  stoneWall.traverse((el) => {
    const { name, position } = el;

    el.castShadow = true;

    if (name.includes("grave")) {
      gravesArray[i] = {};

      gravesArray[i].grave = el;

      const body = createBoxBody(
        0.8,
        0.5,
        0.6,
        position,
        100000,
        defaultMaterial,
        GHOST,
        FLOOR | BRICKS,
        world
      );

      gravesArray[i].body = body;

      gravesArray[i].floatHeight = Math.random() / 2;
      i++;
    }
  });

  console.log(gravesArray);

  scene.add(stoneWall);
});

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2, 2);

doorLight.castShadow = true;

scene.add(doorLight);

// Ghosts
const { ghost1, ghost2, ghost3 } = ghosts({ scene });

// FOG
fog({ scene });

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics
  world.step(1 / 60, deltaTime, 3);

  bricks.map(({ brick, brickBody }) => {
    brick.position.copy(brickBody.position);
    brick.quaternion.copy(brickBody.quaternion);

    /* body.addEventListener("collide", () =>
      body.applyForce(new CANNON.Vec3(0, 1, 0), body.position)
    ); */
  });
  destructableWalls.map((destructableWall) =>
    destructableWall.map(({ brick, brickBody }) => {
      brick.position.copy(brickBody.position);
      brick.quaternion.copy(brickBody.quaternion);
    })
  );

  //GHOST BODY
  ghostMesh.position.copy(ghostBody.position);
  ghostBody.sleep();

  ghostBody.position.copy(ghost.position);
  ghostBody.position.y = 0.2;

  //ghostBody.sleep();

  //CAMERA LOOK
  camera.lookAt(ghost.position);

  //WALL COLLISION
  wallsBody.position.copy(walls.position);
  wallsBody.quaternion.copy(walls.quaternion);

  wallsBody.sleep();

  //GRAVE FLOATING
  gravesArray.map(({ grave, body, floatHeight }) => {
    grave.position.copy(body.position);
    //grave.quaternion.copy(body.quaternion);

    grave.position.y =
      body.position.y + floatHeight + Math.sin(elapsedTime) / 10;
  });

  particles.rotation.y = elapsedTime * 0.01;
  particles.rotation.z = elapsedTime * 0.01;

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
  renderer.setPixelRatio(devicePixelRatio);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
