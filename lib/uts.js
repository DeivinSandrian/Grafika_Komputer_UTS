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
    const value = b.value;
    if (value === null) {
        continue;
    }
    let box = rectPointArray(b.x, b.y, b.width, b.height);
    polygon(imageData, box, 255, 0, 0);
  }
}

function drawBoxesText(boxes) {
    for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        
        let value = b.value;
        if (value === null) {
            continue;
        }
        
        let tengah_x = b.x + (b.width / 2);
        let tengah_y = b.y + (b.height / 2);
        
        ctx.fillText(value, tengah_x, tengah_y);
    }
}

function drawClaw(imageData, claw) {
    const x = claw.x;
    const y = claw.y;
    const w = claw.width;
    const h = claw.height;
    let r = 255, g = 0, b = 0;
    if (claw.label === "B") {
        r = 0; g = 0; b = 255;
    }

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

function reDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    drawBoxes(img, boxes);
    drawClaw(img, claw_A);
    drawClaw(img, claw_B);
    
    if (carrying_A !== null) {
        let box_A_x = claw_A.x; 
        let box_A_y = claw_A.y + claw_A.height + 60 

        let box_A = rectPointArray(box_A_x, box_A_y, carrying_A.width, carrying_A.height);
        polygon(img, box_A, 0, 0, 255);
    }

    if (carrying_B !== null) {
        let box_B_x = claw_B.x;
        let box_B_y = claw_B.y + claw_B.height + 60;

        let box_B = rectPointArray(box_B_x, box_B_y, carrying_B.width, carrying_B.height);
        polygon(img, box_B, 0, 0, 255);
    }
    
    ctx.putImageData(img, 0, 0);
    
    drawBoxesText(boxes);
    
    if (carrying_A !== null) {
        let center_A_x = claw_A.x + (claw_A.width / 2);
        let center_A_y = claw_A.y - 20
        ctx.fillText(carrying_A.value, center_A_x, center_A_y);
    }
    
    if (carrying_B !== null) {
        let center_B_x = claw_B.x + (claw_B.width / 2);
        let center_B_y = claw_B.y - 20
        ctx.fillText(carrying_B.value, center_B_x, center_B_y);
    }
    
    if (carrying_A !== null && carrying_B !== null) {
        let text = carrying_A.value + " vs " + carrying_B.value;
        let center_canvas = canvas.width / 2;
        ctx.fillText(text, center_canvas, 40);
    }
}

function moveClawDown(claw, distance, speed, callback) {
    let step = 0;
    const steps = Math.abs(distance / speed);
    const interval = setInterval(() => {
    claw.y += speed;
    reDraw(ctx, canvas, boxes, claw);
    step++;
    if (step >= steps) {
        clearInterval(interval);
        if (callback) callback();
    }
    }, 10);
}

function moveClawUp(claw, distance, speed, callback) {
    let step = 0;
    const steps = Math.abs(distance / speed);
    const interval = setInterval(() => {
    claw.y -= speed;
    reDraw(ctx, canvas, boxes, claw);
    step++;
    if (step >= steps) {
        clearInterval(interval);
        if (callback) callback();
    }
    }, 10);
}

function moveClawRight(claw, distance, speed, callback) {
    let step = 0;
    const steps = Math.abs(distance / speed);
    const interval = setInterval(() => {
    claw.x += speed;
    reDraw(ctx, canvas, boxes, claw);
    step++;
    if (step >= steps) {
        clearInterval(interval);
        if (callback) callback();
    }
    }, 10);
}

function moveClawLeft(claw, distance, speed, callback) {
    let step = 0;
    const steps = Math.abs(distance / speed);
    const interval = setInterval(() => {
    claw.x -= speed;
    reDraw(ctx, canvas, boxes, claw);
    step++;
    if (step >= steps) {
        clearInterval(interval);
        if (callback) callback();
    }
    }, 10);
}

function preProcessText(text) {
    let regex = /[\s,;]+/;
    let array_string = text.split(regex);
    
    let hasil = [];
    for (let i = 0; i < array_string.length; i++) {
        let str = array_string[i];
        
        if (str.length === 0) {
            continue;
        }
        let number = Number(str);
        hasil.push(number);
    }
    
    return hasil;
}

function setDataFromString(text) {
    let arr = preProcessText(text);
    boxes = boxesLayout(arr);
    reDraw();
}

function boxesLayout(array) {
    const box_width = 60;
    const box_height = 200;
    const gap = 15;
    const n_max = 15;
    

    let n = array.length;
    if (n > n_max) {
        n = n_max;
    }

    let all_box_width = (n * box_width) + ((n - 1) * gap);

    // Biar ketengah
    let start_x = x_start + Math.floor((area_width - all_box_width) / 2);

    let hasil = [];
    for (let i = 0; i < n; i++) {
        let value = array[i];

        let x = start_x + i * (box_width + gap);
        // posisi Y = lantai - box_height
        let y = area_baseY - box_height;

        hasil.push({
            x: x,
            y: y,
            width: box_width,
            height: box_height,     
            value: value
        });
    }

    return hasil;
}