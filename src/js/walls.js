import * as THREE from "three";

import { createBoxBody } from "./createBox";

import { collisionFilterGroups } from "../environments";

const { FLOOR, BRICKS, HOUSE, GHOST } = collisionFilterGroups;

export const wallsSetup = ({
  textureLoader,
  house,
  defaultMaterial,
  world,
}) => {
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

  walls.castShadow = true;

  const wallsBody = createBoxBody(
    4,
    2.5,
    4,
    walls.position,
    10,
    defaultMaterial,
    HOUSE,
    FLOOR | BRICKS,
    world
  );

  house.add(walls);

  return { walls, wallsBody };
};
