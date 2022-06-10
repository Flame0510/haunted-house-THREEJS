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
  const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
  const bricksAmbientOcclusionTexture = textureLoader.load(
    "/textures/bricks/ambientOcclusion.jpg"
  );
  const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
  const bricksRoughnessTexture = textureLoader.load(
    "/textures/bricks/roughness.jpg"
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

  const bricks = [...Array(300)].reduce((acc, _, i) => {
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

    brickBody.addEventListener("collide", ({ body }) => {
      if (body === ghostBody) {
        Math.random() === 1 &&
          world.addConstraint(
            new CANNON.DistanceConstraint(ghostBody, brickBody, 1.2)
          );
      }
    });

    acc.push({ brick, brickBody });

    // world.remove(brickBody);
    // scene.remove(brick);

    return acc;
  }, []);

  return bricks;
};
