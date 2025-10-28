function gambarTitik(imageData, x, y, r, g, b) {
    let roundedX = Math.round(x);
    let roundedY = Math.round(y);

    if (roundedX < 0 || roundedX >= imageData.width || roundedY < 0 || roundedY >= imageData.height) {
        return;
    }

    let index = (roundedX + roundedY * imageData.width) * 4;

    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = 255;
}

// Fungsi pembantu untuk menggambar titik (diasumsikan sudah ada)
function gambar_titik(imageData, x, y, r, g, b) {
    let roundedX = Math.round(x);
    let roundedY = Math.round(y);
    let index = (roundedX + roundedY * imageData.width) * 4;
    imageData.data[index] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = 255;
}

/**
 * Fungsi utama untuk menggambar garis menggunakan algoritma DDA.
 * Fungsi ini sekarang menerima r, g, b sebagai parameter individual.
 */
// File: dda_line_sesuai_gambar.js

function dda_line(imageData, x1, y1, x2, y2, r, g, b) {
    var dx = x2 - x1;
    var dy = y2 - y1;

    // Kasus 1: Perubahan di 'x' lebih dominan
    if (Math.abs(dx) > Math.abs(dy)) {
        // Logika untuk menangani arah gambar (kanan-ke-kiri)
        // Berdasarkan gambar, kondisi ini sepertinya salah (seharusnya if (x1 > x2))
        if (y1 > y2) { // <- Kondisi ini kemungkinan besar keliru
            // Tukar titik agar loop selalu berjalan dari kiri ke kanan
            [x1, x2] = [x2, x1];
            [y1, y2] = [y2, y1];
        }

        var y = y1;
        for (var x = x1; x <= x2; x++) {
            // Bagian ini yang di-highlight di gambar
            y = y + dy / Math.abs(dx);
            gambar_titik(imageData, x, y, r, g, b);
        }
    }
    // Kasus 2: Perubahan di 'y' lebih dominan
    else {
        // Logika untuk menangani arah gambar (bawah-ke-atas)
        if (y1 > y2) {
            // Tukar titik agar loop selalu berjalan dari atas ke bawah
            [x1, x2] = [x2, x1];
            [y1, y2] = [y2, y1];
        }

        var x = x1;
        for (var y = y1; y <= y2; y++) {
            x = x + dx / Math.abs(dy);
            gambar_titik(imageData, x, y, r, g, b);
        }
    }
}



function getPixelColor(imageData, x, y) {
    if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) {
        return { r: -1, g: -1, b: -1 }; // Return an invalid color for out-of-bounds
    }
    var index = (x + y * imageData.width) * 4;
    return {
        r: imageData.data[index + 0],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2]
    };
}

function drawLine(imageData, x0, y0, x1, y1, color) {
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;

    while (true) {
        gambarTitik(imageData, x0, y0, color);
        if (x0 === x1 && y0 === y1) break;
        var e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

function polygon(imageData, ctx, points, color) {
    for (var i = 0; i < points.length; i++) {
        var p1 = points[i];
        var p2 = points[(i + 1) % points.length];
        drawLine(imageData, p1.x, p1.y, p2.x, p2.y, color);
    }
}

// Flood Fill Naif (Metode Rekursif) - dapat menyebabkan stack overflow untuk area besar
function FloodFillNaif(imageData, canvas, x, y, targetColor, replacementColor) {
    var currentColor = getPixelColor(imageData, x, y);

    if (currentColor.r === targetColor.r &&
        currentColor.g === targetColor.g &&
        currentColor.b === targetColor.b &&
        (currentColor.r !== replacementColor.r || currentColor.g !== replacementColor.g || currentColor.b !== replacementColor.b)) {

        gambarTitik(imageData, x, y, replacementColor);

        FloodFillNaif(imageData, canvas, x + 1, y, targetColor, replacementColor);
        FloodFillNaif(imageData, canvas, x - 1, y, targetColor, replacementColor);
        FloodFillNaif(imageData, canvas, x, y + 1, targetColor, replacementColor);
        FloodFillNaif(imageData, canvas, x, y - 1, targetColor, replacementColor);
    }
}

// Flood Fill menggunakan Stack (Metode Iteratif) - lebih efisien
function FloodFillStack(imageData, canvas, x, y, targetColor, replacementColor) {
    var stack = [];
    stack.push({ x: x, y: y });

    while (stack.length > 0) {
        var currentPoint = stack.pop();
        var px = currentPoint.x;
        var py = currentPoint.y;

        var currentColor = getPixelColor(imageData, px, py);

        if (currentColor.r === targetColor.r &&
            currentColor.g === targetColor.g &&
            currentColor.b === targetColor.b &&
            (currentColor.r !== replacementColor.r || currentColor.g !== replacementColor.g || currentColor.b !== replacementColor.b)) {

            gambarTitik(imageData, px, py, replacementColor);

            stack.push({ x: px + 1, y: py });
            stack.push({ x: px - 1, y: py });
            stack.push({ x: px, y: py + 1 });
            stack.push({ x: px, y: py - 1 });
        }
    }
}

function polygon(imageDataA, point_array, r, g, b) {

    for (var i = 0; i < point_array.length - 1; i++) {
        var x1 = point_array[i].x;
        var y1 = point_array[i].y;
        var x2 = point_array[i + 1].x;
        var y2 = point_array[i + 1].y;

        dda_line(imagedataA, x1, y1, x2, y2, r, g, b);
    }

    console.log(point_array.length-1);

    var xAkhir = point_array[point_array.length - 1].x;
    var yAkhir = point_array[point_array.length - 1].y;
    var xAwal = point_array[0].x;
    var yAwal = point_array[0].y;

    dda_line(imagedataA, xAkhir, yAkhir, xAwal, yAwal, r, g, b);
}