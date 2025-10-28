

function translasi(titik_lama, jarak_pindah) {
    var xBaru = titik_lama.x + jarak_pindah.x;
    var yBaru = titik_lama.y + jarak_pindah.y;
    return { x: xBaru, y: yBaru };
}

function skala(titik_lama, S) {
    var x_baru = titik_lama.x * S.x;
    var y_baru = titik_lama.y * S.y;

    return { x: x_baru, y: y_baru };
}

function rotasi(titik_lama, sudut) {
    var x_baru = titik_lama.x * Math.cos(sudut) - titik_lama.y * Math.sin(sudut);
    var y_baru = titik_lama.x * Math.sin(sudut) + titik_lama.y * Math.cos(sudut);

    return { x: x_baru, y: y_baru };
}

function rotasiFP(titik_lama, titik_putar, sudut) {
    var p1 = translasi(titik_lama, { x: -titik_putar.x, y: -titik_putar.y });
    var p2 = rotasi(p1, sudut);
    var p3 = translasi(p2, titik_putar);
    return p3;
    //
    var p3 = translasi(p2, { x: titik_putar.x, y: titik_putar.y });
}

// function rotation_fp(xc, yc, theta) {
//     var m1 = createTranslation(-xc, -yc);
//     var m2 = createRotation(theta);
//     var m3 = createTranslation(xc, yc);

//     var hasil;
//     hasil = multiplyMatrix(m3, m2);
//     hasil = multiplyMatrix(hasil, m1);
//     return hasil;
// }

function skalaFP(titik_lama, titik_skala, S) {
    var p1 = translasi(titik_lama, { x: -titik_skala.x, y: -titik_skala.y });
    var p2 = skala(p1, S);
    var p3 = translasi(p2, titik_skala);
    return p3;
}

function translasi_array(titik_lama, T) {
    var array_hasil = [];
    for (var i = 0; i < titik_lama.length; i++) {
        var temp = translasi(titik_lama[i], T);
        array_hasil.push(temp);
    }
    return array_hasil;
}

// function rotasi_array(titik_lama, titik_putar, sudut) {
//     var array_hasil = [];
//     for (var i = 0; i < titik_lama.length; i++) {
//         var temp = rotasiFP(titik_lama[i], titik_putar, sudut);
//         array_hasil.push(temp);
//     }
//     return array_hasil;
// }

function rotasi_array(titik_lama, sudut) {
    var array_hasil = [];
    for (var i = 0; i < titik_lama.length; i++) {
        var temp = rotasi(titik_lama[i], sudut);
        array_hasil.push(temp);
    }
    return array_hasil;
}

function skala_array(titik_lama, S) {
    var array_hasil = [];
    for (var i = 0; i < titik_lama.length; i++) {
        var temp = skala(titik_lama[i], S);
        array_hasil.push(temp);
    }
    return array_hasil;
}

function createIdentity() {
    var identity = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ];
    return identity;
}

function multiplyMatriks(m1, m2) {
    var hasil = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            for (var k = 0; k < 3; k++) {
                hasil[i][k] += m1[i][j] * m2[j][k];
            }
        }
    }

    return hasil;
}

function createTranslation(tx, ty) {
    var translasi = [
        [1, 0, tx],
        [0, 1, ty],
        [0, 0, 1]
    ];
    return translasi;
}

function createScale(sx, sy) {
    var skala = [
        [sx, 0, 0],
        [0, sy, 0],
        [0, 0, 1]
    ];
    return skala;
}

function createRotation(theta) {
    var rotasi = [
        [Math.cos(theta), -Math.sin(theta), 0],
        [Math.sin(theta), Math.cos(theta), 0],
        [0, 0, 1]
    ];
    return rotasi;
}

function rotation_fp(xc, yc, theta) {
    var m1 = createTranslation(-xc, -yc);
    var m2 = createRotation(theta);
    var m3 = createTranslation(xc, yc);

    var hasil = multiplyMatriks(m3, m2);
    hasil = multiplyMatriks(hasil, m1);

    return hasil;
}

function scale_fp(xc, yc, sx, sy) {
    var m1 = createTranslation(-xc, -yc);
    var m2 = createScale(sx, sy);
    var m3 = createTranslation(xc, yc);

    var hasil = multiplyMatriks(m3, m2);
    hasil = multiplyMatriks(hasil, m1);

    return hasil;
}

function transform_titik(titik_lama, m) {
    var x_baru = m[0][0] * titik_lama.x + m[0][1] * titik_lama.y + m[0][2] * 1;
    var y_baru = m[1][0] * titik_lama.x + m[1][1] * titik_lama.y + m[1][2] * 1;

    return { x: x_baru, y: y_baru };
}

function transform_array(array_titik, m) {
    var hasil = [];
    for (var i = 0; i < array_titik.length; i++) {
        var titik_baru = transform_titik(array_titik[i], m);
        hasil.push(titik_baru);
    }

    return hasil;
}