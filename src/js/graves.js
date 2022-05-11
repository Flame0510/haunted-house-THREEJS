import * as THREE from "three";
import gsap from "gsap";

import { ghost } from "./ghost.js";

export const graves = ({ domEvents, textureLoader, loader, scene }) => {
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

      gravesArray[i] = {
        grave,
        graveFloat: false /* , gravePosition: { x, z } */,
      };

      // glb.shadow.mapSize.width = 256;
      // glb.shadow.mapSize.height = 256;
      // glb.shadow.camera.far = 7;

      //x > gravesArray[i - 1].gravePosition.x + 0.5 && (x += 0.5);

      // Position
      grave.position.set(x, -0.1, z);

      grave.scale.set(0.012, 0.012, 0.012);

      // Rotation
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      grave.rotation.y = (Math.random() - 0.5) * 0.4;

      grave.traverse((g) => {
        g.castShadow = true;
        g.material = graveMaterial;
      });

      let graveFloat = false;

      const graveFloatStart = gsap.timeline().to(grave.position, {
        y: 1,
        duration: 1,
      });

      const graveFloatEnd = gsap.timeline().to(grave.position, {
        y: 0,
        duration: 1,
      });

      domEvents.addEventListener(grave, "click", () => {
        console.log(graveFloat);

        graveFloat && (gravesArray[i].graveFloat = false);

        gsap
          .timeline({
            onComplete: () => {
              gravesArray[i].graveFloat = graveFloat;

              //ghost.attach(grave);

              /* graveFloat &&
                gsap
                  .timeline({
                    repeat,
                  })
                  .to(grave.position, {
                    y: grave.position.y + 0.1,
                    duration: 1,
                  })
                  .to(grave.position, {
                    y: grave.position.y,
                    duration: 1,
                  }); */
            },
          })
          .to(grave.position, {
            x: graveFloat ? grave.position.x : ghost.position.x,
            y: graveFloat ? 0 : 0.5,
            z: graveFloat ? grave.position.z : ghost.position.z,
          });

        //graveFloat ? ghost.remove(grave) : ghost.attach(grave);
        //graveFloat ? graveFloatEnd.play() : graveFloatStart.play();
        graveFloat = !graveFloat;

        //gravesArray[i].graveFloat = graveFloat;
      });

      // Add to the graves container
      graves.add(grave);
    });
  }

  return gravesArray;
};
