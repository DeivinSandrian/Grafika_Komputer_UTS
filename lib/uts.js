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
    animations_id.push(interval);
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
    animations_id.push(interval);
}

function moveClawRight(claw, distance, speed, target_x, callback) {
    let step = 0;
    const steps = Math.ceil(Math.abs(distance / speed));
    const interval = setInterval(() => {
    claw.x += speed;
    reDraw(ctx, canvas, boxes, claw);
    step++;
    if (step >= steps) {
        claw.x = target_x; // pastikan tepat di target
        clearInterval(interval);
        if (callback) callback();
    }
    }, 10);
    animations_id.push(interval);
}

function moveClawLeft(claw, distance, speed, target_x, callback) {
    let step = 0;
    const steps = Math.ceil(Math.abs(distance / speed));
    const interval = setInterval(() => {
    claw.x -= speed;
    reDraw(ctx, canvas, boxes, claw);
    step++;
    if (step >= steps) {
        claw.x = target_x; // pastikan tepat di target
        clearInterval(interval);
        if (callback) callback();
    }
    }, 10);
    animations_id.push(interval);
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
    resetAll();
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

function moveToX(claw, index, callback) {
    let box = boxes[index];
    let target_x = box.x

    moveToXhelper(claw, target_x, animation_speed, callback);
}

function moveToXhelper(claw, target_x, speed, callback) {
    let dx = target_x - claw.x;

    if (dx > 0) {
        moveClawRight(claw, dx, speed, target_x, callback);
    } else if (dx < 0) {
        moveClawLeft(claw, -dx, speed, target_x, callback);
    } else {
        if (callback) callback();
    }
}

// ke atas box, turun, ambil box, naik lagi
function pickBox(claw, index, callback) {
    let box = boxes[index];
    let claw_label = claw.label;
    console.log("Pick box", claw_label, index);

    moveToX(claw, index, function () {
        let down_distance = box.y - (claw.y + claw.height + 60 );

        moveClawDown(claw, down_distance, animation_speed, function () {
        let item = {width: box.width, height: box.height, value: box.value };
        box.value = null;

        if (claw_label === "A") { 
            carrying_A = item;
        } else { 
            carrying_B = item; 
        }

        let up_distance = claw.y-100
        moveClawUp(claw, up_distance, animation_speed, callback);
        })
    })
}

// ke atas box, turun, letak box, naik lagi
function dropBox(claw, index, callback) {
    let box = boxes[index];
    let claw_label = claw.label;
    console.log(`Drop box at index ${index} by claw ${claw_label}`);

    moveToX(claw, index, function () {
        let down_distance = box.y - (claw.y + claw.height + 60 );

        moveClawDown(claw, down_distance, animation_speed, function () {
        let item;
        if (claw_label === "A") {
            item = carrying_A;
        } else {
            item = carrying_B;
        }

        box.value = item.value;

        if (claw_label === "A") {
            carrying_A = null;
        }
        else {
            carrying_B = null;
        }

        let up_distance = claw.y - 100;
        moveClawUp(claw, up_distance, animation_speed, callback);
        })
    })
}

function selectionSort() {
    is_sorting = true;
    let n = boxes.length;
    let i = 0;

    function selectPosition() {
        if (i >= n) { 
            is_sorting = false;
            return; 
        }
        let best = i;

        // ambil kotak i dengan claw A
        pickBox(claw_A, i, function () {
        let j = i + 1;

        function loop_j() {
            // selesai bandingkan semua posisi j
            if (j >= n) {
            if (best === i) {
                dropBox(claw_A, i, function () {
                    i += 1; 
                    selectPosition();
                });
            } else {
                // simpan A ke i, lalu isi best dengan item awal i (yang dipegang B)
                pickBox(claw_B, i, function () {
                dropBox(claw_A, i, function () {
                    // lanjut drop B ke best dan loop next position
                    dropBox(claw_B, best, function () { 
                        i += 1; 
                        selectPosition(); 
                    });
                });
                });
            }
            return;
            }

            // Bandingkan A vs B pada posisi j
            pickBox(claw_B, j, function () {
            // jeda kecil 150ms agar ada feedback visual
            let timeout = setTimeout(function () {
                let a, b, bIsBetter;
                if (carrying_A !== null) {
                    a = carrying_A.value;
                } else {
                    a = Infinity;
                }
                if (carrying_B !== null) {
                    b = carrying_B.value;
                } else {
                    b = Infinity;
                }
                if (mode_min) {
                    bIsBetter = (b < a);
                    console.log("Membandingkan A: " + a + " dengan B: " + b + " (mencari MIN) :"+ bIsBetter);
                } else {
                    bIsBetter = (b > a);
                    console.log("Membandingkan A: " + a + " dengan B: " + b + " (mencari MAX) :"+ bIsBetter);
                }

                if (bIsBetter) {
                // b lebih baik, best pindah ke a
                dropBox(claw_B, j, function () {
                    dropBox(claw_A, best, function () {
                    pickBox(claw_A, j, function () {
                        best = j;
                        j += 1;
                        loop_j();
                    });
                    });
                });
                } else {
                // b lebih buruk, kembalikan B ke posisi semula
                dropBox(claw_B, j, function () {
                    j += 1;
                    loop_j();
                });
                }
            }, 250);
            animations_id.push(timeout)
            });
        }

        loop_j();
        });
    }
    selectPosition();
}

function resetAll() {
    for (let i of animations_id) {
        clearTimeout(i);
        clearInterval(i);
    }
    is_sorting = false;
    carrying_A = null;
    carrying_B = null;
    claw_A.x = 100; claw_A.y = 100;
    claw_B.x = 200; claw_B.y = 100;
    reDraw();
}

function createRandomData() {
    resetAll();
    let count = 5;
    let min_value = 5;
    let max_value = 99;

    let n = count; 
    if (n < 2) {
        n = 2;
    } 
    if (n > MAX_COUNT) (
        n = MAX_COUNT
    )
    let min = min_value
    let max = max_value

    let values_input = [];
    for (let i = 0; i < n; i++) {
        let random_value = Math.floor(Math.random() * (max - min + 1)) + min;
        values_input.push(random_value);
    }

    let input = document.getElementById("valuesInput");
    input.value = values_input.join(", ");

    setDataFromString(input.value);
}