import * as THREE from "three";
import gsap from "gsap";

export const loaderSetup = () => {
  const showLoader = () => {
    gsap
      .timeline()
      .to(".loader-container", {
        opacity: 1,
        duration: 1,
      })
      .to(".bottom-right-text", {
        opacity: 1,
        duration: 1,
      });
  };

  const hideLoader = () => {
    //startAnimation();

    gsap
      .timeline()
      .to(".loader-container", {
        opacity: 0,
        duration: 1,
      })
      .to(".loader", {
        display: "none",
        opacity: 0,
        duration: 1,
      });
  };

  //LOADER MANAGER
  const manager = new THREE.LoadingManager();
  const progressBar = document.querySelector(".progress-bar");
  const progressBarText = document.querySelector(".progress-bar-text");

  let progressBarValue = 5;

  let loaderInterval;

  manager.onStart = (url, itemsLoaded, itemsTotal) => {
    showLoader();

    document.querySelector("#atmosphere-sound").play();

    loaderInterval = setInterval(() => {
      //progressBarValue <= 99 && (progressBarValue += 1);

      progressBarValue > 100 && (progressBarValue = 100);

      progressBar.style.width = `${progressBarValue}%`;
      progressBarText.innerHTML = `${progressBarValue} %`;
    }, 500);
  };

  manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    let percentage = ((itemsLoaded * 100) / itemsTotal).toFixed(0);

    progressBarValue = percentage;
  };

  manager.onLoad = () => {
    progressBarValue = 100;

    setTimeout(() => {
      hideLoader();
      clearInterval(loaderInterval);
    }, 1000);
  };

  return manager;
};
