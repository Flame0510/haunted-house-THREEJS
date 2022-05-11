import * as THREE from "three";

export const roof = ({ textureLoader, house }) => {
  const roofColorTexture = textureLoader.load("/textures/roof/color.jpg");
  const roofAmbientOcclusionTexture = textureLoader.load(
    "/textures/roof/ambientOcclusion.jpg"
  );
  const roofNormalTexture = textureLoader.load("/textures/roof/normal.jpg");
  const roofRoughnessTexture = textureLoader.load(
    "/textures/roof/roughness.jpg"
  );

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
};
