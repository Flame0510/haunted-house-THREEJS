import CANNON from "cannon";

export const physicsSetup = () => {
  /**
   * Physics
   */
  const world = new CANNON.World();

  world.gravity.set(0, -9.82, 0);

  world.broadphase = new CANNON.SAPBroadphase(world);

  //MATERIALS
  const defaultMaterial = new CANNON.Material("default");

  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1,
      restitution: 0.2,
    }
  );
  world.addContactMaterial(defaultContactMaterial);

  const concreteMaterial = new CANNON.Material("concrete");
  const plasticMaterial = new CANNON.Material("plastic");

  const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
      friction: 0.1,
      restitution: 0.7,
    }
  );

  world.addContactMaterial(concretePlasticContactMaterial);

  const sphereShape = new CANNON.Sphere(0.5);

  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 2, 4),
    shape: sphereShape,
    material: defaultMaterial,
  });

  /* sphereBody.applyLocalForce(
    new CANNON.Vec3(50, 0, 0),
    new CANNON.Vec3(0, 0, 0)
  ); */

  world.addBody(sphereBody);

  const floorShape = new CANNON.Plane();

  const floorBody = new CANNON.Body();
  floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5
  );
  floorBody.mass = 0;
  floorBody.material = defaultMaterial;
  floorBody.collisionFilterGroup = 1;
  floorBody.collisionFilterMask = 4;
  floorBody.addShape(floorShape);
  world.addBody(floorBody);
  //world.allowSleep = true;

  return { defaultMaterial, plasticMaterial, world };
};
