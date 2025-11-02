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

function drawClaw(imageData, claw) {
    const x = claw.x;
    const y = claw.y;
    const w = claw.width;
    const h = claw.height;
    const r = 255, g = 0, b = 0;

    // Untuk memudahkan melihat variabel
    const x1 = x;
    y1 = y;
    const x2 = x + w;
    y2 = y + h;

    // Badan claw
    // Garis atas
    dda_line(imageData, x1, y1, x2, y1, r, g, b);
    // Garis kiri
    dda_line(imageData, x1, y1, x1, y2, r, g, b);
    // Garis kanan
    dda_line(imageData, x2, y1, x2, y2, r, g, b);
    // Garis bawah
    dda_line(imageData, x1, y2, x2, y2, r, g, b);

    // Tangkai
    const stickX = (x1 + x2) / 2;   // tengah badan claw
    const stickY1 = y2;             // bawah badan claw
    const stickY2 = stickY1 + 50;   // panjang tangkai 50 pix
    dda_line(imageData, stickX, stickY1, stickX, stickY2, r, g, b);

    // Capit
    const clawLeftX = stickX - 15;
    const clawRightX = stickX + 15;
    const clawY = stickY2 + 10;     // sedikit di bawah ujung tangkai

    dda_line(imageData, stickX, stickY2, clawLeftX, clawY, r, g, b);
    dda_line(imageData, stickX, stickY2, clawRightX, clawY, r, g, b);

    return { stickX, clawY };
}

function redraw(ctx, canvas, boxes, claw) {
    // Bersihkan kanvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Gambar kotak
    drawBoxes(imageData, boxes);

    // Gambar claw
    const clawPos = drawClaw(imageData, claw);
    ctx.putImageData(imageData, 0, 0);

    // Gambar angka
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    boxes.forEach(box => {
        ctx.fillText(box.value, box.x + box.width / 2, box.y + box.height / 2);
    });
}