class Module {
    constructor(xOff, yOff, x, y, speed, unit, maxOffset, xOrig, yOrig, maxRight, maxBottom, maxLeft, maxTop) {
      this.xOff = xOff;
      this.yOff = yOff;
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.unit = unit;
      this.xDir = -2;
      this.yDir = 1.5;
      this.maxOffset = maxOffset;
      this.xOrig = xOrig;
      this.yOrig = yOrig;
      this.maxRight = maxRight;
      this.maxBottom = maxBottom;
      this.maxLeft = maxLeft;
      this.maxTop = maxTop;
    }
  
    // Custom method for updating the variables
    update() {
        
        //console.log('x: ' + this.x + ', maxRight: ' + this.maxRight + ', maxLeft: ' + this.maxLeft)

        // if (this.x <= this.maxLeft||this.x >= this.maxRight) {
        //     this.speed = this.speed*-1;
        // }
        // if (this.y <= this.maxTop||this.y >= this.maxBottom) {
        //     this.speed = this.speed*-1;
        // }
        // this.x = this.x + this.speed * (this.xDir * danceabilityValue);
        // this.y = this.y + this.speed * (this.yDir * danceabilityValue);

        this.x = this.x + this.speed * this.xDir;
        this.y = this.y + this.speed * this.yDir;

        // Test to see if the shape exceeds the boundaries of the screen
        // If it does, reverse its direction by multiplying by -1
        if (this.x > this.maxRight || this.x < this.maxLeft) {
            this.xDir *= -1;
        }
        if (this.y > this.maxBottom || this.y < this.maxTop) {
            this.yDir *= -1;
        }

        // this.x = this.x + this.speed * this.xDir;
        // if (this.x >= this.unit || this.x <= 0) {
        //     this.xDir *= -1;
        //     this.x = this.x + 100 * this.xDir;
        //     this.y = this.y + 100 * this.yDir;
        // }
        // if (this.y >= this.unit || this.y <= 0) {
        //     this.yDir *= -1;
        //     this.y = this.y + 100 * this.yDir;
        // }


        // this.speed = danceabilityValue*2;
        // this.x = modsPosition[i].xPos + scalar * cos(angle);
        // this.y = startY + scalar * sin(angle);
        // if (this.x >= this.maxOffset || this.x <= 0) {
        //     this.xDir *= -1;
        //     this.x = this.x + 1 * this.xDir;
        // }
        // return(this.x);
    }
  
    // Custom method for drawing the object
    drawEllipse() {
        //fill('rgba(255,255,255, 1)');
        fill(255);
        noStroke();
        // push();
        // rotate(r);
        ellipse(this.xOff + this.x, this.yOff + this.y, 6, 6);
        //triangle(this.xOff + this.x, this.yOff + this.y - 5, this.xOff + this.x + 4, this.yOff + this.y + 3, this.xOff + this.x - 4, this.yOff + this.y + 3);
        // pop();
    }
  }

class MarketIcon {
    constructor(diaStartX, diaStartY, diaEndX, diaEndY, column, number) {
        this.diaStartX = diaStartX;
        this.diaStartY = diaStartY;
        this.diaEndX = diaEndX;
        this.diaEndY = diaEndY;
        this.column = column;
        this.number = number;
    }
    drawDiagonal() {
        stroke(255);
        strokeWeight(2);
        line(this.diaStartX-(35*this.column), this.diaStartY, this.diaEndX-(35*this.column), this.diaEndY);
    }
}


  
let unit = 100;
let count;
let mods = [];
let modsPosition = [];
let marketList = [];
var reset = false;
var speedMax;

var theta = 0.0;      // Start angle at 0
var amplitude = 30.0; // Height of wave

var angle = 0;	// initialize angle variable
var scalar = 1;  // set the radius of circle
var startX = 100;	// set the x-coordinate for the circle center
var startY = 100;

var marketStartX = 166.666;
var marketStartY = 25;

  // Farbpaletten
const keyDur = [
    [0,255,0], 
    [0,255,128],
    [0,255,128],
    [0,255,255],
    [0,128,255],
    [0,0,255],
    [128,0,255],
    [255,0,255],
    [255,0,128],
    [255,0,0,],
    [255,128,0],
    [255,255,0],
    [128,255,0]
];
const keyMol = [
    [0,151,0],
    [0,151,76],
    [0,151,151],
    [0,76,151], 
    [0,0,151], 
    [76,0,151], 
    [151,0,151], 
    [151,0,76], 
    [151,0,0], 
    [151,76,0], 
    [151,151,0],
    [76,151,0]
];
var contColor;

var gridBalls = [];

var pointsOrigin = [];
var centerPoint;


function setup() {
    createCanvas((windowHeight/100)*88,(windowHeight/100)*88);
    frameRate(20);


    let wideCount = width / unit;
    let highCount = height / unit;
    count = wideCount * highCount;

    var offsetX = (width/100)*7;
    var offsetY = (height/100)*7;
    var gridWidth = width-(offsetX*2);
    var gridHeight = height-(offsetY*2);

    let index = 0;
    for (let y = 0; y < highCount; y++) {
        for (let x = 0; x < wideCount; x++) {
            mods[index++] = new Module(
                x * unit,
                y * unit,
                unit / 2,
                unit / 2,
                (random(0.01, danceabilityValue))*100,
                unit,
                unit/2,
                x * unit,
                y * unit,
                (x * unit) + (unit / 4),
                (y * unit) + (unit / 4),
                (x * unit) - (unit / 4),
                (y * unit) - (unit / 4)
            );
        }
    }
    console.log(mods);

    centerPoint = createVector(width/2, height/2);

    for(var phi = 0; phi <= 2*PI+2*PI/16; phi += 2*PI/16){
        pointsOrigin.push(p5.Vector.fromAngle(phi, 230));
        //points.push(p5.Vector.fromAngle(phi, 230));
    }

    
}

var iteration = 0;
var r = 0;
var rowCount = 40;
// let a = 0;
// let b = 0;
var yoff = 0.0;
/* valores entre -3 e 3 */

function draw() {
    var mainColor;
    var keyColor;
    var rValue;
    var gValue;
    var bValue;
    var rValueCont;
    var gValueCont;
    var bValueCont;
    var contColor;
    var yWave = height/2 + sin(theta) * amplitude;
    iteration++;
    r = r+0.2;

    if (keyValue !== null && typeof keyValue !== 'undefined') {
        setColors();
    } else {
        background(0);
    }

    // Hintergrundfarbe ermitteln
    function setColors() {
        if (modeValue === 0) {
            mainColor = keyMol[keyValue];
        } else {
            mainColor = keyDur[keyValue];
        }
        rValue = mainColor[0];
        gValue = mainColor[1];
        bValue = mainColor[2];
        keyColor = 'rgb(' + rValue + ',' + gValue + ',' + bValue + ')';
        background(keyColor);
        rValueCont = 255-rValue;
        gValueCont = 255-gValue;
        bValueCont = 255-bValue;
        contColor = 'rgb(' + rValueCont + ',' + gValueCont + ',' + bValueCont + ')';
    }

    strokeWeight(1);



    // Particle-Grid generieren
    function callParticles() {
        if (danceabilityValue !== null && typeof danceabilityValue !== 'undefined') {
            for (let i = 0; i < count; i++) {
                mods[i].drawEllipse();
            }
            animateParticles();
        }
    }
    callParticles();
    
    function animateParticles() {
        for (let i = 0; i < count; i++) {
            mods[i].update();
            mods[i].drawEllipse();
        }
    }

    // if (markets !== null && typeof markets !== 'undefined') {
    //     let iterationCount = 0;
    //     var columnCount = Math.floor(markets/rowCount) + 1;
    //     for (let a = 0; a < columnCount; a++) {
    //         for (let b = 0; b < rowCount; b++) {
    //             if (iterationCount < markets) {
    //                 marketList[iterationCount++] = new MarketIcon(
    //                     marketStartX + (a * 10),
    //                     marketStartY + (b * 10)+5,
    //                     (marketStartX + (a * 10)) - 15,
    //                     (marketStartY + (b * 10)) + 20,
    //                     a,
    //                     iterationCount
    //                 );
    //             }
                
    //         }
    //     }
    //     if (marketList.length == markets) {
    //         for (let i = 0; i < markets; i++) {
    //             marketList[i].drawDiagonal();
    //         }
    //     }
    // }

    if (genre !== null && typeof genre !== 'undefined') {
        //console.log(genreFamilies);
        fill(contColor);
        noStroke();
        beginShape();
        var index = 0;
        //console.log(pointsOrigin);
        for (p of pointsOrigin){
            let lerpValue = genreSwitches[index];
            let lerpedPoint = p5.Vector.mult(p, lerpValue);
            let point = p5.Vector.add(lerpedPoint, centerPoint);
            curveVertex(point.x, point.y);
            index++;
        }
        endShape(CLOSE);
    }

    if (valenceValue !== null && typeof valenceValue !== 'undefined') {
        // console.log('valence: ' + valenceValue);
        // console.log('happiness: ' + happinessValue);
        translate(width/2, height / 2);
        noFill();
        beginShape();
        // radius = happiness
        // radius+ = radius / (valenceValue*10)
        var valenceRadius = 250/(valenceValue*80);
        var happinessSize = happinessValue*2.3;
        for (var radius = 0; radius < happinessSize; radius += valenceRadius) {
            //stroke('rgb(' + rValue + ',' + gValue + ',' + bValue + ')');
            stroke(255);
            strokeWeight(1.2);
            var xoff = 0;
            for (var a = 0; a < TWO_PI; a += 0.04) {
                var offset = map(noise(xoff, yoff), 0, 1, -30, 30);
                var r = radius + offset;
                //var r = radius;
                var x = r * cos(a);
                var y = r * sin(a);
                curveVertex(x, y);
                xoff += 0.1;
            }
        }
        endShape(CLOSE);
    }


}