function gbr_titik(imageDataTemp, x, y, r, g, b) {
    var index;
    index = 4 * (Math.ceil(x) + Math.ceil(y) * imageDataTemp.width);
    imageDataTemp.data[index] = r;
    imageDataTemp.data[index + 1] = g;
    imageDataTemp.data[index + 2] = b;
    imageDataTemp.data[index + 3] = 255;
}

function dda_line(imageData, x1, y1, x2, y2, r, g, b) {
    var dx = x2 - x1; //bisa positif / negatif tergantung posisi x2 sebelum atau sesudah x1
    var dy = y2 - y1; //bisa positif / negatif tergantung posisi y2 sebelum atau sesudah y1
    
    // Kasus 1: Perubahan di 'x' lebih dominan

    if (Math.abs(dx) > Math.abs(dy)) {
        // jalan di x
        if (x2 > x1) {
            // ke kanan
            var y = y1;
            for (var x = x1; x < x2; x++) {
                y = y + dy / Math.abs(dx);
                gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
            }
        } else { // ke kiri
            var y = y1;
            for (var x = x1; x > x2; x--) {
                y = y + dy / Math.abs(dx);
                gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
            }
        }
    } else {
        // jalan di y
        if (y2 > y1) {
            // ke kanan
            var x = x1;
            for (var y = y1; y < y2; y++) {
                x = x + dx / Math.abs(dy);
                gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
            }
        } else { // ke kiri
            var x = x1;
            for (var y = y1; y > y2; y--) {
                x = x + dx / Math.abs(dy);
                gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
            }
        }
    }
}

function polyline(imageData, point_array, r, g, b) {
    var point = point_array[0];

    dda_line(ImageData, point.x, point.y, point_array[1].x, point_array[1].y, r, g, b);
    for (var i = 1; i < point_array.length; i++) {
        var point_2 = point_array[i];

        dda_line(imageData, point.x, point.y, point_2.x, point_2.y, r, g, b);
        point = point_2;
    }
}

function polygon(imageData, point_array, r, g, b) {
    var point = point_array[0];

    for (var i = 1; i < point_array.length; i++) {
        var point_2 = point_array[i];

        dda_line(imageData, point.x, point.y, point_2.x, point_2.y, r, g, b);
        point = point_2;
    }
    dda_line(imageData, point.x, point.y, point_array[0].x, point_array[0].y, r, g, b);
}


function lingkaran_polar(imageDataTemp, xc, yc, radius, r, g, b) {
    for (var theta = 0; theta < Math.PI * 2; theta += 0.001) {
        x = xc + radius * Math.cos(theta);
        y = yc + radius * Math.sin(theta);
        gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g, b);
    }
}

function ellipse_polar(imageDataTemp, xc, yc, radiusX, radiusY, r, g, b) {
    for (var theta = 0; theta < Math.PI * 2; theta = theta + 0.001) {
        x = xc + radiusX * Math.cos(theta);
        y = yc + radiusY * Math.sin(theta);
        gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g, b);
    }
}

function gbr_lingkaran(imageDataTemp, xc, yc, radius, r, g, b) {
    for (var x = xc - radius; x < xc + radius; x++) {
        var y = yc + Math.sqrt(Math.pow(radius, 2) - Math.pow((x - xc), 2));
        gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g, b);
        var y = yc - Math.sqrt(Math.pow(radius, 2) - Math.pow((x - xc), 2));
        gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g, b);
    }
    for (var x = xc - radius; x < xc + radius   ; x++) {
        var y = yc + Math.sqrt(Math.pow(radius, 2) - Math.pow((x - xc), 2));
        gbr_titik(imageDataTemp, Math.ceil(y), Math.ceil(x), r, g, b);
        var y = yc - Math.sqrt(Math.pow(radius, 2) - Math.pow((x - xc), 2));
        gbr_titik(imageDataTemp, Math.ceil(y), Math.ceil(x), r, g, b);
    }
}


// Versi awal yang menyebabkan error "too much recursion" (stack overflow)
function floodFillNaive(imageData, canvas, x, y, toFlood, color) {
    var index = 4 * (x + y * canvas.width);

    var r1 = imageData.data[index];
    var g1 = imageData.data[index + 1];
    var b1 = imageData.data[index + 2];

    if ((r1 == toFlood.r) && (g1 == toFlood.g) && (b1 == toFlood.b)) {
        imageData.data[index] = color.r;
        imageData.data[index + 1] = color.g;
        imageData.data[index + 2] = color.b;
        imageData.data[index + 3] = 255;

        floodFillNaive(imageData, canvas, x + 1, y, toFlood, color);
        floodFillNaive(imageData, canvas, x, y + 1, toFlood, color);
        floodFillNaive(imageData, canvas, x - 1, y, toFlood, color);
        floodFillNaive(imageData, canvas, x, y - 1, toFlood, color);
    }
}


// Versi perbaikan menggunakan stack buatan sendiri untuk menghindari error
function floodFillStack(imageData, canvas, x0, y0, toFlood, color) {
    var tumpukan = [];
    tumpukan.push({ x: x0, y: y0 });

    while (tumpukan.length > 0) {
        //saya ambil satu buah titik dari tumpukan
        //saya cek titik tersebut bisa diwarna atau tidak
        //jika bisa, maka warnai titik tersebut
        //lalu masukkan titik di atas, bawah, kiri, kanan ke dalam tumpukan
        //jika tidak bisa, buang titik tersebut

        var titik_skrg = tumpukan.pop();
        var index_skrg = 4 * (titik_skrg.x + titik_skrg.y * canvas.width);

        var r1 = imageData.data[index_skrg];
        var g1 = imageData.data[index_skrg + 1];
        var b1 = imageData.data[index_skrg + 2];

        if ((r1 == toFlood.r) && (g1 == toFlood.g) && (b1 == toFlood.b)) {
            //kalau warnanya sama dengan warna yang mau diisi, maka warnai
            imageData.data[index_skrg] = color.r;
            imageData.data[index_skrg + 1] = color.g;
            imageData.data[index_skrg + 2] = color.b;
            imageData.data[index_skrg + 3] = 255;

            tumpukan.push({ x: titik_skrg.x + 1, y: titik_skrg.y });
            tumpukan.push({ x: titik_skrg.x - 1, y: titik_skrg.y });
            tumpukan.push({ x: titik_skrg.x, y: titik_skrg.y + 1 });
            tumpukan.push({ x: titik_skrg.x, y: titik_skrg.y - 1 });
        }
    }
}

function rectPointArray(x, y, w, h) {
return [
    { x: x,     y: y     }, // kiri atas
    { x: x+w,   y: y     }, // kanan atas
    { x: x+w,   y: y+h   }, // kanan bawah
    { x: x,     y: y+h   }  // kiri bawah
];
}