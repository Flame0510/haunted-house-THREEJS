import * as THREE from "three";
import { createBox } from "./createBox";

import { collisionFilterGroups } from "../environments";

const { FLOOR, BRICKS, HOUSE, GHOST } = collisionFilterGroups;

export const destructableWallSetup = ({
  x,
  z,
  wallLenght,
  wallHeight,
  ghostBody,
  textureLoader,
  defaultMaterial,
  world,
  scene,
}) => {
  const bricksColorTexture = textureLoader.load("textures/bricks/color.jpg");
  const bricksAmbientOcclusionTexture = textureLoader.load(
    "/textures/bricks/ambientOcclusion.jpg"
  );
  const bricksNormalTexture = textureLoader.load("textures/bricks/normal.jpg");
  const bricksRoughnessTexture = textureLoader.load(
    "/textures/bricks/roughness.jpg"
  );

  bricksColorTexture.repeat.set(0.09, 0.09);
  bricksAmbientOcclusionTexture.repeat.set(0.09, 0.09);
  bricksNormalTexture.repeat.set(0.09, 0.09);
  bricksRoughnessTexture.repeat.set(0.09, 0.09);

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

  const makeRow = (height) =>
    [...Array(wallLenght)].reduce((acc, _, i) => {
      const { body: brickBody, mesh: brick } = createBox(
        0.25,
        0.125,
        0.125,
        new THREE.Vector3(i / 4 + x, height, z),
        1000,
        defaultMaterial,
        brickMaterial,
        GHOST,
        FLOOR | BRICKS | HOUSE,
        world,
        scene
      );

      brickBody.addEventListener("collide", ({ body }) => {
        if (body === ghostBody) {
          Math.random() === 1 &&
            world.addConstraint(
              new CANNON.DistanceConstraint(ghostBody, brickBody, 1.2)
            );
        }
      });

      brickBody.sleep();

      /* brickBody.addEventListener(
        "collide",
        () => (brickBody.collisionFilterMask = FLOOR | BRICKS | GHOST)
      ); */

      acc.push({ brick, brickBody });

      return acc;
    }, []);

  const destructableWall = [];

  [...Array(wallHeight)].map((_, i) =>
    makeRow(i / 8 + 0.12).map((el) => destructableWall.push(el))
  );

  return destructableWall;
};
