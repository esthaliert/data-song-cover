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
      this.xPos = this.xPos + (this.speed*danceabilityValueCover*3) * this.xDir;
      this.yPos = this.yPos + (this.speed*danceabilityValueCover*2.5) * this.yDir;
      
      if (this.xPos >= this.xOrig+(dotDistanceX/2)-25 || this.xPos <= this.xOrig-(dotDistanceX/2)+25) {
        this.xDir *= -1;
      }
      
      if (this.yPos >= this.yOrig+(dotDistanceY/2)-25 || this.yPos <= this.yOrig-(dotDistanceY/2)+25) {
        this.yDir *= -1;
      }
    }
  }

class MarketIcon {
    constructor(diaStartX, diaStartY, diaEndX, diaEndY, column, number, speed, dir) {
        this.diaStartX = diaStartX;
        this.diaStartY = diaStartY;
        this.diaEndX = diaEndX;
        this.diaEndY = diaEndY;
        this.column = column;
        this.number = number;
        this.speed = speed;
        this.dir = dir;
    }
    drawDiagonal() {
        stroke(255);
        strokeWeight(2);
        // this.diaStartY = this.diaStartY+1;
        // this.diaEndY = this.diaEndY+1;
        line(this.diaStartX, this.diaStartY, this.diaEndX, this.diaEndY);
    }
    updateDiagonal() {
        this.diaStartY = this.diaStartY+((tempoValueCover)/10) * this.dir;
        this.diaEndY = this.diaEndY+((tempoValueCover)/10) * this.dir;
        if (this.diaStartY > height) {
            this.dir = -1;
            this.diaStartY = this.diaEndY;
            this.diaEndY = this.diaStartY-10;
        }
        if (this.diaStartY < 0) {
            this.dir = 1;
            this.diaStartY = this.diaEndY;
            this.diaEndY = this.diaStartY+10;
        }
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
var marketStartY = 0;

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
    [0,255,255],
    [0,128,255],
    [0,0,255],
    [128,0,255],
    [255,0,255],
    [255,0,128],
    [255,0,0],
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
    if (windowHeight > windowWidth) {
        coverCanvas = createCanvas((windowWidth/100)*88,(windowWidth/100)*88);
    } else {
        coverCanvas = createCanvas((windowHeight/100)*88,(windowHeight/100)*88);
    }
    
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

    let iterationCount = 0;
        for (let b = 0; b < rowCount; b++) {
            if (iterationCount < rowCount) {
                marketList[iterationCount++] = new MarketIcon(
                    marketStartX + (1 * 10),
                    marketStartY + (b * 10)+5,
                    (marketStartX + (1 * 10)) - 10,
                    (marketStartY + (b * 10)) + 15,
                    1,
                    iterationCount,
                    1,
                    1
                );
            }
            
        }
        console.log(marketList);

    
}

var iteration = 0;
var screenshotIteration = 0;
var r = 0;
var rowCount = 100;
// if ($(window).height() > $(window).width()) {
//     rowCount = ((($(window).width()/100)*88)/100)*1000;
// } else {
//     rowCount = ((($(window).height()/100)*88)/100)*1000;
// }
var yoff = 0.0;
var genrePositionY = $(window).height()*-1;
var genrePositionX = $(window).width()*-1;
var valenceRotation = 0.0;
var genreScaling = 0;
var randomWobble = Math.random();
// var ellipseScaling;
// if (windowHeight > windowWidth) {
//     ellipseScaling = (windowWidth/100)*88;
// } else {
//     ellipseScaling = (windowHeight/100)*88;
// }

function draw() {
    // console.log('drawing');
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

    if(requestSuccess){
        console.log("Handle Success");

        requestSuccess = false;
    }

    
    try {
        if (keyValueCover !== null && typeof keyValueCover !== 'undefined') {
            setColors();
        } else {
            background('#141115');
        }
    
        // Hintergrundfarbe ermitteln
        function setColors() {
            if (modeValueCover === 0) {
                mainColor = keyMol[keyValueCover];
            } else if (modeValueCover === 1){
                mainColor = keyDur[keyValueCover];
            } else {
                console.log('fail');
            }
            rValue = mainColor[0];
            gValue = mainColor[1];
            bValue = mainColor[2];
            keyColor = 'rgb(' + rValue + ',' + gValue + ',' + bValue + ')';
            background('#141115');
            rValueCont = 255-rValue;
            gValueCont = 255-gValue;
            bValueCont = 255-bValue;
            contColor = 'rgb(' + rValueCont + ',' + gValueCont + ',' + bValueCont + ')';
            ellipseMode(CENTER);
        }
    
        strokeWeight(1);
    
        // Particle-Grid generieren
        function callParticles() {
            if (danceabilityValueCover !== null && typeof danceabilityValueCover !== 'undefined') {
                //console.log(danceabilityValueCover);
                for (let i = 0; i < dotList.length; i++) {
                    dotList[i].update();
                    dotList[i].drawTriangle();
                  }
            }
        }
    
        callParticles();
    
        if (tempoValueCover !== null && typeof tempoValueCover !== 'undefined') {
            for (let i = 0; i < durationCount; i++) {
                push();
                //translate(0, -height*5);
                marketList[i].drawDiagonal();
                marketList[i].updateDiagonal();
                pop();
            }
        }
    
        if (genre !== null && typeof genre !== 'undefined') {
    
        // Genre-Blob generieren
            fill(keyColor);
            noStroke();
            push();
            translate(width/2, height/2);
            rectMode(CENTER);
            angleMode(DEGREES);
            if (windowHeight > windowWidth) {
                rotate(135);
            } else {
                rotate(-22.5);
            }
            scale(genreScaling);
    
            let firstPoint = pointsOrigin[pointsOrigin.length-1];
            let lastPoint = pointsOrigin[1];
    
            let zeroPoint = pointsOrigin[0];
    
            let lerpValueFirstPoint = genreSwitches[pointsOrigin.length-1];
            let lerpValueLastPoint = genreSwitches[1]-0.2;
    
            let lerpValueZeroPoint = genreSwitches[0];
    
            let lerpedFirstPoint = p5.Vector.mult(firstPoint, lerpValueFirstPoint);
            let lerpedLastPoint = p5.Vector.mult(lastPoint, lerpValueLastPoint);
    
            let lerpedZeroPoint = p5.Vector.mult(zeroPoint, lerpValueZeroPoint);
    
            let pointFirstVertex = p5.Vector.add(lerpedFirstPoint, 0);
            let pointLastVertex = p5.Vector.add(lerpedLastPoint, 0);
    
            let pointZeroVertex = p5.Vector.add(lerpedZeroPoint, 0);
    
            beginShape();
            // var index = 0;
            //console.log(pointsOrigin);
    
            curveVertex(pointFirstVertex.x+(randomWobble/50), pointFirstVertex.y+(randomWobble/50));
            for (var i = 0; i < pointsOrigin.length; i++){
                let p = pointsOrigin[i];
    
                iteration++;
                // Scaling ein bisschen abändern, damit sich der Rand etwas bewegt
                if(iteration%100 == 0) {
                    randomWobble = Math.random();
                }
                let lerpValue = genreSwitches[i];
                let lerpedPoint = p5.Vector.mult(p, lerpValue+(randomWobble/50));
                let point = p5.Vector.add(lerpedPoint, 0);
                curveTightness(-1);
                curveVertex(point.x, point.y);
    
                // index++;
            }
    
            // curveVertex(pointFirstVertex.x, pointFirstVertex.y);
    
            curveVertex(pointZeroVertex.x+(randomWobble/50), pointZeroVertex.y+(randomWobble/50));
            curveVertex(pointLastVertex.x+(randomWobble/50), pointLastVertex.y+(randomWobble/50));
    
            // curveVertex(pointLastVertex.x, pointLastVertex.y);
    
            endShape(CLOSE);
            
            pop();
            if(genreScaling < 0.4) {
                genreScaling = genreScaling+0.02;
            } else {
                genreScaling = 0.4;
            }
        }
        
    
        if (valenceValueCover !== null && typeof valenceValueCover !== 'undefined') {
            //console.log('valence: ' + valenceValueCover);
            // console.log('happiness: ' + happinessValue);
            try {
                
            } catch (error) {
                
            }
            push();
            angleMode(RADIANS);
            translate(width/2, height / 2);
            rotate(valenceRotation);
            noFill();
            beginShape();
            // radius = happiness
            // radius+ = radius / (valenceValueCover*10)
            var valenceRadius = 250/(valenceValueCover*60);
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
            valenceRotation = valenceRotation + (0.0001*tempoValueCover);
            //console.log(valenceRotation);
        }
    
        if (energyValueCover !== null && typeof energyValueCover !== 'undefined') {
            var energyInt = parseInt(energyValueCover*10);
            for (let i = 1; i <= energyInt; i++) {
                var scalingCounter = scalingCounter+1;
                var scaling = (1/energyInt)*i;
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
                //blendMode(SUBTRACT);
                stroke(keyColor);
                push();
                translate(-((1/energyInt)*0.5)*1000, -((1/energyInt)*0.5)*1000);
                angleMode(DEGREES);
                rotate(45);
                ellipse(pointList[a].xPos, 0, ellipseScaling/2.5,ellipseScaling/2.5*2);
                stroke('rgb(255,0,0)');
                strokeWeight(5);
                //point(pointList[a].xPos, 0, ellipseScaling/2.5,ellipseScaling/2.5*2);
                pop();
              }
        }
    } catch (error) {
        console.log('error');
        $('#error-alert').addClass('active');
    }
    

    if (screenshotTrigger == true) {
        screenshotIteration++;
        if (screenshotIteration == 1) {
            saveCanvas(coverCanvas,"screenshot_" + title.split(' ').join('-') + "_" + artist.split(' ').join('-'),"jpg");
        }
    }

}