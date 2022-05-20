import * as THREE from "three";

const clock = new THREE.Clock();

export const tick = ({
  oldElapsedTime,
  world,
  boxes,
  createBox,
  mesh,
  body,
  ghost,
  camera,
  wallsBody,
  walls,
  gravesArray,
  particles,
  ghost1,
  ghost2,
  ghost3,
  renderer,
  scene,
}) => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics
  world.step(1 / 60, deltaTime, 3);

  boxes.map(({ box, body }) => {
    box.position.copy(body.position);
    box.quaternion.copy(body.quaternion);

    /* body.addEventListener("collide", () =>
        body.applyForce(new CANNON.Vec3(0, 1, 0), body.position)
      ); */
  });

  if (Math.cos(elapsedTime) && false) {
    const { body: bbody, mesh: box } = createBox(
      0.1,
      0.1,
      0.1,
      new THREE.Vector3(ghost.position.x, 10, ghost.position.z),
      0.1,
      defaultMaterial,
      world,
      scene
    );

    boxes.push({ body: bbody, box });
  }

  mesh.position.copy(body.position);
  // mesh.quaternion.copy(body.quaternion);

  //body.applyForce(new CANNON.Vec3(10,0,0), body.position);

  body.position.x = ghost.position.x;
  body.position.y = 0;
  body.position.z = ghost.position.z;

  body.sleep();

  camera.lookAt(ghost.position);

  wallsBody.position.copy(walls.position);
  wallsBody.quaternion.copy(walls.quaternion);

  // walls.position.copy(wallsBody.position);
  // walls.quaternion.copy(wallsBody.quaternion);

  // wallsBody.position.set(0, 1.25, 0);
  // wallsBody.quaternion.set(0, 0, 0);

  wallsBody.sleep();

  //GRAVE FLOATING
  gravesArray.map(({ grave, graveFloat, body }) => {
    if (graveFloat) {
      grave.position.y = Math.sin(elapsedTime) / 10 + 0.5;
    } else {
      grave.position.copy(body.position);
      grave.quaternion.copy(body.quaternion);
    }
  });

  particles.rotation.y = elapsedTime * 0.01;
  particles.rotation.z = elapsedTime * 0.01;

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
  renderer.setPixelRatio(devicePixelRatio);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
