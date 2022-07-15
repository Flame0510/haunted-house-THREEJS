import * as THREE from "three";
import gsap from "gsap";

import { atmosphereSound } from "./sounds";

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

  const atmosphereSoundBtn = document.querySelector("#play-btn");

  atmosphereSoundBtn.addEventListener("click", () => {
    atmosphereSound.play();
    hideLoader();
  });

  //LOADER MANAGER
  const manager = new THREE.LoadingManager();
  const progressBar = document.querySelector(".progress-bar");
  const progressBarText = document.querySelector(".progress-bar-text");

  let progressBarValue = 5;

  let loaderInterval;

  manager.onStart = (url, itemsLoaded, itemsTotal) => {
    showLoader();

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
      gsap
        .timeline()
        .to(
          ".loader-progress-bar",
          {
            y: 50,
            opacity: 0,
            duration: 1,
          },
          0
        )
        .to(
          ".loader-title",
          {
            y: -20,
            duration: 1,
          },
          0
        )
        .to(
          ".play-btn",
          {
            x: 0,
            y: 20,
            opacity: 1,
            duration: 1,
          },
          0
        );

      //hideLoader();
      clearInterval(loaderInterval);
      //document.querySelector("#atmosphere-sound").play();
    }, 1000);
  };

  return manager;
};
