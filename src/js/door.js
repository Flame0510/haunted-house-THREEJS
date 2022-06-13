import * as THREE from "three";

export const door = ({ textureLoader, house }) => {
  const doorColorTexture = textureLoader.load("textures/door/color.jpg");
  const doorAlphaTexture = textureLoader.load("textures/door/alpha.jpg");
  const doorAmbientOcclusionTexture = textureLoader.load(
    "/textures/door/ambientOcclusion.jpg"
  );
  const doorHeightTexture = textureLoader.load("textures/door/height.jpg");
  const doorNormalTexture = textureLoader.load("textures/door/normal.jpg");
  const doorMetalnessTexture = textureLoader.load(
    "/textures/door/metalness.jpg"
  );
  const doorRoughnessTexture = textureLoader.load(
    "/textures/door/roughness.jpg"
  );

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

  // Door light
  const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
  doorLight.position.set(0, 2.2, 2.7);

  doorLight.castShadow = true;

  house.add(doorLight);
};
