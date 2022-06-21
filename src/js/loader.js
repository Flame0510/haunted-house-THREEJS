import * as THREE from "three";

export const loaderSetup = () => {
  //LOADER MANAGER
  const manager = new THREE.LoadingManager();

  console.log(manager);

  manager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log("start");
  };

  manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log("%");

    document.querySelector(".loader h1").innerHTML =
      "ITEMS LOADED: " + itemsLoaded + "/" + itemsTotal;
  };

  manager.onLoad = () => {
    console.log("FINISH");

    document.querySelector(".loader").style.display = "none";
  };

  return manager;
};
