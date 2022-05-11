import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";
import { RGBA_ASTC_10x10_Format } from "three";

import { lights } from "./js/lights.js";
import { cameraSetup } from "./js/camera.js";
import { floor } from "./js/floor.js";
import { walls } from "./js/walls.js";
import { roof } from "./js/roof.js";
import { bushes } from "./js/bushes.js";
import { graves } from "./js/graves.js";
import { door } from "./js/door.js";
import { ghosts } from "./js/ghosts.js";
import { fog } from "./js/fog.js";

import { createGhost } from "./js/ghost.js";

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

/**
 * Lights
 */
lights({ gui, scene });

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

const ghost = createGhost({ scene });

/**
 * Camera
 */
// Base camera
const camera = cameraSetup({ ghost, sizes, canvas, scene });

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
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const domEvents = new THREEx.DomEvents(camera, canvas);

//HOUSE
const house = new THREE.Group();
scene.add(house);

//WALLS
walls({ textureLoader, house });

// Roof
roof({ textureLoader, house });

// Door
door({ textureLoader, house });

// Bushes
//bushes({ loader, scene });

// Graves
const gravesArray = graves({ domEvents, textureLoader, loader, scene });

// Ghosts
const { ghost1, ghost2, ghost3 } = ghosts({ scene });

// FOG
fog({ scene });

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  camera.lookAt(ghost.position);

  gravesArray.map(({ grave, graveFloat }) => {
    graveFloat &&
      (grave.position.y = Math.sin(elapsedTime) / 10 + 0.5);
  });

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
