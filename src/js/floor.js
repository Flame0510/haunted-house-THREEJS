import * as THREE from "three";

export const floor = ({ textureLoader, scene }) => {
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

  floor.receiveShadow = true;

  scene.add(floor);
};
