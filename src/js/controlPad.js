const moveField = document.querySelector("#move-field");
export const controlPad = document.querySelector("#control-pad");

const getControlPadXY = (
  controlPad,
  touchX,
  touchY,
  moveFieldSize,
  bottomSpace
) => {
  const bottom =
    window.innerHeight -
    bottomSpace -
    touchY -
    moveFieldSize / 4 +
    controlPad.style.width / 2;
  const left =
    touchX -
    window.innerWidth / 2 +
    moveFieldSize / 2 +
    controlPad.style.width / 2;

  console.log(bottomSpace);

  const controlPadY =
    bottom > moveFieldSize ? moveFieldSize : bottom <= 0 ? 0 : bottom;
  const controlPadX =
    left > moveFieldSize ? moveFieldSize : left <= 0 ? 0 : left;

  return { controlPadY, controlPadX };
};

let touchStart;

moveField.addEventListener("touchstart", ({ targetTouches }) => {
  touchStart = { x: targetTouches[0].clientX, y: targetTouches[0].clientY };
});

moveField.addEventListener("touchmove", ({ targetTouches }) => {
  const { clientY, clientX } = targetTouches[0];
  controlPad.style.position = "absolute";

  const moveFieldSize = 120;

  const bottomSpace = 55;

  const { controlPadY, controlPadX } = getControlPadXY(
    controlPad,
    clientX,
    clientY,
    moveFieldSize,
    bottomSpace
  );

  controlPad.style.bottom = controlPadY + "px";
  controlPad.style.left = controlPadX + "px";
});

moveField.addEventListener("touchend", () => {
  controlPad.style.position = "initial";
});
