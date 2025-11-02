function rectPointArray(x, y, w, h) {
return [
    { x: x,     y: y     }, // kiri atas
    { x: x+w,   y: y     }, // kanan atas
    { x: x+w,   y: y+h   }, // kanan bawah
    { x: x,     y: y+h   }  // kiri bawah
];
}

function drawBoxes(imageData, boxes) {
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    const pts = rectPointArray(b.x, b.y, b.width, b.height);
    polygon(imageData, pts, 255, 0, 0);
  }
}