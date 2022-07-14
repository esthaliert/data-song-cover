class Dots {
    constructor(xPos, yPos, xOrig, yOrig, speed, xDir, yDir ) {
      this.xPos = xPos;
      this.yPos = yPos;
      this.xOrig = xOrig;
      this.yOrig = yOrig;
      this.speed = speed;
      this.xDir = 1.5;
      this.yDir = 1;
    }
    
    drawTriangle(){
      fill(255);
      noStroke();
      //ellipse(this.xPos, this.yPos, 6, 6);
      triangle(this.xPos, this.yPos - 5, this.xPos + 4, this.yPos + 3, this.xPos - 4, this.yPos + 3);
    }
    
    update() {
      this.xPos = this.xPos + (this.speed*danceabilityValue*3) * this.xDir;
      this.yPos = this.yPos + (this.speed*danceabilityValue*2.5) * this.yDir;
      
      if (this.xPos >= this.xOrig+(dotDistanceX/2)-25 || this.xPos <= this.xOrig-(dotDistanceX/2)+25) {
        this.xDir *= -1;
      }
      
      if (this.yPos >= this.yOrig+(dotDistanceY/2)-25 || this.yPos <= this.yOrig-(dotDistanceY/2)+25) {
        this.yDir *= -1;
      }
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

class pointsDiagonal {
    constructor (xPos, yPos) {
      this.xPos = xPos;
      this.yPos = yPos;
    }
  }


  
let unit = 75;
//let unit = 95;
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

let screenshotTrigger = false;

var dotAreaWidth;
var dotAreaHeight;
var dotCount = 10;
var dotDistanceX;
var dotDistanceY;

let dotList = [];

var positionMaxScale;
var pointList = [];
var centerPoint;

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
    coverCanvas = createCanvas((windowHeight/100)*88,(windowHeight/100)*88);
    frameRate(20);

    dotAreaWidth = width-100;
    dotAreaHeight = height-100;
    dotDistanceX = dotAreaWidth / dotCount;
    dotDistanceY = dotAreaHeight / dotCount;

    positionMaxScale = createVector(Math.sqrt(width*width + height*height), Math.sqrt(width*width + height*height));
    centerPoint = createVector(width/2, height/2);

    let wideCount = width / unit;
    let highCount = height / unit;
    count = wideCount * highCount;

    var offsetX = (width/100)*7;
    var offsetY = (height/100)*7;
    var gridWidth = width-(offsetX*2);
    var gridHeight = height-(offsetY*2);

    let index = 0;
    for (var d = 0; d <= dotCount; d++) {
        for (var c = 0; c <= dotCount; c++) {
        dotList[index++] = new Dots (
            (width-dotAreaWidth)/2 + d * dotDistanceX,
            (height-dotAreaHeight)/2 + c * dotDistanceY,
            (width-dotAreaWidth)/2 + d * dotDistanceX,
            (height-dotAreaHeight)/2 + c * dotDistanceY,
            random(0.4, 0.8)
        )
        }
    }

    centerPoint = createVector(width/2, height/2);

    for(var phi = 0; phi <= 2*PI; phi += 2*PI/16){
        pointsOrigin.push(p5.Vector.fromAngle(phi+centerPoint.x, 200+centerPoint.y));
        //points.push(p5.Vector.fromAngle(phi, 230));
    }

    
}

var iteration = 0;
var screenshotIteration = 0;
var r = 0;
var rowCount = 40;
var yoff = 0.0;
var genrePositionY = $(window).height()*-1;
var genrePositionX = $(window).width()*-1;
var valenceRotation = 0.0;
var genreScaling = 0;
var randomWobble = Math.random();

function draw() {
    console.log('drawing');
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
        background(0);
        rValueCont = 255-rValue;
        gValueCont = 255-gValue;
        bValueCont = 255-bValue;
        contColor = 'rgb(' + rValueCont + ',' + gValueCont + ',' + bValueCont + ')';
        // console.log(keyColor);
        // console.log(contColor);
        ellipseMode(CENTER);
        //fill(0);
        //ellipse(width/2, height/2, width-(width/4),height-(height/4));
    }

    strokeWeight(1);

    // Particle-Grid generieren
    function callParticles() {
        if (danceabilityValue !== null && typeof danceabilityValue !== 'undefined') {
            //console.log(danceabilityValue);
            for (let i = 0; i < dotList.length; i++) {
                dotList[i].update();
                dotList[i].drawTriangle();
              }
        }
    }
    callParticles();


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
        
        fill(keyColor);
        noStroke();
        push();
        translate(width/2, height/2);
        rectMode(CENTER);
        rotate(-2*PI/20);
        scale(genreScaling);
        beginShape();
        var index = 0;
        //console.log(pointsOrigin);
        for (p of pointsOrigin){
            iteration++;
            if(iteration%100 == 0) {
                randomWobble = Math.random();
            }
            let lerpValue = genreSwitches[index];
            let lerpedPoint = p5.Vector.mult(p, lerpValue+(randomWobble/100));
            let point = p5.Vector.add(lerpedPoint, 0);
            curveVertex(point.x, point.y);
            index++;
        }
        endShape(CLOSE);
        pop();
        if(genreScaling < 0.4) {
            genreScaling = genreScaling+0.02;
        } else {
            genreScaling = 0.4;
        }
    }
    

    if (valenceValue !== null && typeof valenceValue !== 'undefined') {
        // console.log('valence: ' + valenceValue);
        // console.log('happiness: ' + happinessValue);
        push();
        angleMode(RADIANS);
        translate(width/2, height / 2);
        rotate(valenceRotation);
        noFill();
        beginShape();
        // radius = happiness
        // radius+ = radius / (valenceValue*10)
        var valenceRadius = 250/(valenceValue*60);
        var happinessSize = happinessValue*3.6;
        for (var radius = 0; radius < happinessSize; radius += valenceRadius) {
            //stroke('rgb(' + rValue + ',' + gValue + ',' + bValue + ')');
            stroke(contColor);
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
        pop();
        valenceRotation = valenceRotation + (0.0001*bpm);
        //console.log(valenceRotation);
    }

    if (energyValue !== null && typeof energyValue !== 'undefined') {
        for (let i = 1; i <= energyValue*10; i++) {
            var scalingCounter = scalingCounter+1;
            var scaling = i/(energyValue*10+1);
            let multipliedPoint = p5.Vector.mult(positionMaxScale, scaling);
            pointList[i-1] = new pointsDiagonal (
              multipliedPoint.x,
              multipliedPoint.y
            )
            
        } 
    
        for (a = 0; a < pointList.length; a++) {
            var maxHalf = positionMaxScale.x/2;
            ellipseMode(CENTER);
            var ellipseScaling;
              if (pointList[a].xPos > maxHalf) {
                ellipseScaling = pointList[pointList.length-1-a].xPos;
              } else {
                ellipseScaling = pointList[a].xPos;
              }
            
            noFill();
            blendMode(SUBTRACT);
            stroke(keyColor);
            push();
            angleMode(DEGREES);
            rotate(45);
            ellipse(pointList[a].xPos, 0, ellipseScaling/1.5,ellipseScaling/1.5*2);
            pop();
          }
    }

    if (screenshotTrigger == true) {
        screenshotIteration++;
        if (screenshotIteration == 1) {
            saveCanvas(coverCanvas,"screenshot_" + title.split(' ').join('-') + "_" + artist.split(' ').join('-'),"jpg");
        }
    }

}