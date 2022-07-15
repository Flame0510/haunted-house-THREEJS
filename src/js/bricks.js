import * as THREE from "three";
import { createBox } from "./createBox";

import { collisionFilterGroups } from "../environments";

const { FLOOR, BRICKS, HOUSE, GHOST } = collisionFilterGroups;

export const bricksSetup = ({
  ghostBody,
  textureLoader,
  defaultMaterial,
  world,
  scene,
}) => {
  const bricksColorTexture = textureLoader.load("textures/bricks/color.jpg");
  const bricksAmbientOcclusionTexture = textureLoader.load(
    "textures/bricks/ambientOcclusion.jpg"
  );
  const bricksNormalTexture = textureLoader.load("textures/bricks/normal.jpg");
  const bricksRoughnessTexture = textureLoader.load(
    "textures/bricks/roughness.jpg"
  );

  bricksColorTexture.repeat.set(0.1, 0.1);
  bricksAmbientOcclusionTexture.repeat.set(0.1, 0.1);
  bricksNormalTexture.repeat.set(0.1, 0.1);
  bricksRoughnessTexture.repeat.set(0.1, 0.1);

  bricksColorTexture.wrapS = THREE.RepeatWrapping;
  bricksAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
  bricksNormalTexture.wrapS = THREE.RepeatWrapping;
  bricksRoughnessTexture.wrapS = THREE.RepeatWrapping;

  bricksColorTexture.wrapT = THREE.RepeatWrapping;
  bricksAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
  bricksNormalTexture.wrapT = THREE.RepeatWrapping;
  bricksRoughnessTexture.wrapT = THREE.RepeatWrapping;

  const brickMaterial = new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  });

  //HIT SOUNDS
  const hitSound = new Howl({
    src: ["sounds/hit.mp3"],
    html5: true,
  });

  const hitSound2 = new Howl({
    src: ["sounds/hit-2.mp3"],
    html5: true,
  });
  const hitSound3 = new Howl({
    src: ["sounds/hit-3.mp3"],
    html5: true,
  });

  // const hitSound = new Audio("sounds/hit.mp3");
  // const hitSound2 = new Audio("sounds/hit-2.mp3");
  // const hitSound3 = new Audio("sounds/hit-3.mp3");

  const brickEventListener = (body, targetBody, brickHitSound) =>
    body === targetBody && brickHitSound.play();

  const bricks = [...Array(200)].reduce((acc, _, i) => {
    const { body: brickBody, mesh: brick } = createBox(
      Math.random() * 0.3,
      Math.random() * 0.3,
      0.05,
      new THREE.Vector3(Math.random() * 15 - 10, 1, Math.random() * 15 - 10),
      100,
      defaultMaterial,
      brickMaterial,
      GHOST,
      FLOOR | BRICKS | HOUSE,
      world,
      scene
    );

    brickBody.quaternion.x = Math.random() * 10;

    let brickHitSound;

    switch (true) {
      case i % 6 === 0:
        brickHitSound = hitSound2;
        break;

      case i % 8 === 0:
        brickHitSound = hitSound3;
        break;

      default:
        brickHitSound = hitSound;
    }

    brickBody.addEventListener("collide", ({ body }) =>
      brickEventListener(body, ghostBody, brickHitSound)
    );

    acc.push({ brick, brickBody, brickHitSound });

    // world.remove(brickBody);
    // scene.remove(brick);

    return acc;
  }, []);

  return bricks;
};
