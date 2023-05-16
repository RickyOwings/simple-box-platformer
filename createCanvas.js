const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 160;
const canvas = document.createElement("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext("2d");
if (!ctx)
  throw new Error("ctx could not be generate");
document.body.appendChild(canvas);
export {
  canvas,
  ctx
};
