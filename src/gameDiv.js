import { resolutionHeight, resolutionWidth } from "./consts.js";

export const initGameDiv = () => {
  const gameDiv: HTMLDivElement = window.document.querySelector("#game");
  gameDiv.style.height = `${resolutionHeight}px`;
  gameDiv.style.width = `${resolutionWidth}px`;
  gameDiv.style.backgroundColor = "black";
  gameDiv.style.position = "fixed";
  gameDiv.style.top = "0px";
  gameDiv.style.left = "0px";
  return gameDiv;
};