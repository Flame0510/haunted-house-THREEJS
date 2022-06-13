import * as THREE from "three";

export const bushes = ({ loader, scene }) => {
  /* loader.load("models/plant.glb", (glb) => {
      const plant = glb.scene;
    
      plant.scale.set(1, 1, 1);
      plant.position.set(0.8, 0, 2.2);
    
      house.add(plant);
    });
    
    loader.load("models/plant_c.glb", (glb) => {
      const plant = glb.scene;
    
      plant.scale.set(2, 2, 2);
      plant.position.set(1.4, 0, 2.1);
    
      house.add(plant);
    });
    
    loader.load("models/plant_c.glb", (glb) => {
      const plant = glb.scene;
    
      plant.scale.set(1.2, 1.2, 1.2);
      plant.position.set(-0.8, 0, 2.2);
    
      house.add(plant);
    });
    
    loader.load("models/plant_c.glb", (glb) => {
      const plant = glb.scene;
    
      plant.scale.set(1.2, 1.2, 1.2);
      plant.position.set(-1.2, 0, 2.2);
    
      house.add(plant);
    }); */

  /* const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(1.4, 0.1, 2.1);
    
    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.4, 0.4, 0.4);
    bush3.position.set(-0.8, 0.1, 2.2);
    
    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.15, 0.15, 0.15);
    bush4.position.set(-1, 0.05, 2.6);
    
    house.add(bush1, bush2, bush3, bush4); */

  for (let p = 0; p < 50; p++) {
    loader.load("models/plant.glb", (glb) => {
      const plant = glb.scene;

      const angle = Math.random() * Math.PI * 2; // Random angle
      const radius = 3 + Math.random() * 6; // Random radius
      const x = Math.cos(angle) * radius; // Get the x position using cosinus
      const z = Math.sin(angle) * radius; // Get the z position using sinus

      //plant.scale.set(0.01, 0.01, 0.01);
      plant.position.set(x, 0, z);
      plant.rotation.y = angle;

      scene.add(plant);
    });
  }
};
