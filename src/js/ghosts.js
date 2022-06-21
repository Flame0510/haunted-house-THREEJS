import * as THREE from "three";

export const ghosts = ({ scene }) => {
  const ghost1 = new THREE.PointLight("#ff00ff", 3, 3);
  scene.add(ghost1);

  const ghost2 = new THREE.PointLight("#00ffff", 3, 3);
  scene.add(ghost2);

  const ghost3 = new THREE.PointLight("#ffff00", 3, 3);
  scene.add(ghost3);

  ghost1.castShadow = false;
  ghost2.castShadow = false;
  ghost3.castShadow = false;

  ghost1.shadow.mapSize.width = 128;
  ghost1.shadow.mapSize.height = 128;
  ghost1.shadow.camera.far = 7;
  ghost1.shadow.bias = 0.0001;
  ghost1.radius = 0.01;

  // ...

  ghost2.shadow.mapSize.width = 128;
  ghost2.shadow.mapSize.height = 128;
  ghost2.shadow.camera.far = 7;
  ghost2.shadow.bias = 0.0001;
  ghost2.radius = 0.01;

  // ...

  ghost3.shadow.mapSize.width = 128;
  ghost3.shadow.mapSize.height = 128;
  ghost3.shadow.camera.far = 7;
  ghost3.shadow.bias = 0.0001;
  ghost3.radius = 0.01;

  return { ghost1, ghost2, ghost3 };
};
