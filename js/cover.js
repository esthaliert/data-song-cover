function setup() {
    createCanvas(500, 500);
}
  



// document.addEventListener('DOMContentLoaded',domloaded,false);
// function domloaded(){
//     // your code here.
// }


// var canvas = document.getElementById('cover');
// var ctx = canvas.getContext('2d');


const keyDur = ["#00ff00", "#00ff00", "#00ffff", "#00ffff", "#0000ff", "#0000ff", "#ff00ff", "#ff00ff", "#ff00ff", "#ff8000", "#ffff00", "#80ff00"];
const keyMol = ["#80ff00", "#80ff00", "#80ff00", "#80ff00", "#000097", "#000097", "#970097", "#97004c", "#970000", "#974c00", "#979700", "#4c9700"];

function setColors(key, mode){
    var valueKey = key;
    var valueMode = mode;
    var valueBgColor;
    //drawBackground(valueKey, valueMode);
    draw(valueKey, valueMode);
}

// function drawBackground(key, mode) {
//     var keyValue = key;
//     var modeValue = mode;
//     if (modeValue == 0) {
//         valueBgColor = keyMol[keyValue];
//     } else {
//         valueBgColor = keyDur[keyValue];
//     }
//     console.log(valueBgColor);
//     ctx.fillStyle = valueBgColor;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
// }

function setGrid() {
    var xCoord;
    var yCoord;
    for (y = 0; y < 15; y++) {
        console.log(y);

        for (x = 0; x < 15; x++) {
            console.log(x);
        }
    }
}

function draw(key, mode) {
    var keyValue = key;
    var modeValue = mode;
    if (modeValue == 0) {
        valueBgColor = keyMol[keyValue];
    } else {
        valueBgColor = keyDur[keyValue];
    }
    background(valueBgColor);
}