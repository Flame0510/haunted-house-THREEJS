import * as THREE from "three";
import gsap from "gsap";

import CANNON from "cannon";

import { ghost } from "./ghost.js";

import { createBoxBody } from "./createBox";

export const graves = ({
  domEvents,
  textureLoader,
  loader,
  ghostBody,
  defaultMaterial,
  world,
  scene,
}) => {
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

  const gravesArray = [];

  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2; // Random angle
    const radius = 3 + Math.random() * 6; // Random radius
    let x = Math.cos(angle) * radius; // Get the x position using cosinus
    let z = Math.sin(angle) * radius; // Get the z position using sinus

    /* if (i > 2)
      while (x > gravesArray[i - 1].gravePosition.x + 0.5) {
        x = Math.cos(angle) * radius;
      } */

    // Create the mesh
    loader.load("/models/grave/grave.glb", (glb) => {
      const grave = glb.scene;

      gravesArray[i] = {};

      gravesArray[i].grave = grave;

      // Position
      grave.position.set(x, -0.1, z);

      grave.scale.set(0.012, 0.012, 0.012);

      // Rotation
      grave.rotation.z = (Math.random() - 0.5) * 0.8;
      grave.rotation.y = (Math.random() - 0.5) * 0.4;

      grave.traverse((g) => {
        g.castShadow = true;
        g.material = graveMaterial;
      });

      const body = createBoxBody(
        0.8,
        0.5,
        0.6,
        grave.position,
        150000,
        defaultMaterial,
        world
      );

      //body.sleep();

      /* body.addEventListener(
        "collide",
        ({ body }) =>
          body === ghostBody &&
          body.applyForce(new CANNON.Vec3(100, 10, 0), body.position
      ); */

      gravesArray[i].body = body;

      gravesArray[i].floatHeight = Math.random() / 2;

      // Add to the graves container
      graves.add(grave);
    });
  }

  return gravesArray;
};
