class Module {
    constructor(xOff, yOff, x, y, speed, unit, maxOffset) {
      this.xOff = xOff;
      this.yOff = yOff;
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.unit = unit;
      this.xDir = 1;
      this.yDir = 1;
      this.maxOffset = maxOffset;
    }
  
    // Custom method for updating the variables
    update() {
        this.x = this.x + this.speed * this.xDir;
        if (this.x >= this.unit || this.x <= 0) {
            this.xDir *= -1;
            this.x = this.x + 100 * this.xDir;
            this.y = this.y + 100 * this.yDir;
        }
        if (this.y >= this.unit || this.y <= 0) {
            this.yDir *= -1;
            this.y = this.y + 100 * this.yDir;
        }


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
        fill(255);
        noStroke();
        // push();
        // rotate(r);
        //ellipse(this.xOff + this.x, this.yOff + this.y, 6, 6);
        triangle(this.xOff + this.x, this.yOff + this.y - 5, this.xOff + this.x + 4, this.yOff + this.y + 3, this.xOff + this.x - 4, this.yOff + this.y + 3);
        // pop();
    }
  }

class ModulePosition {
    constructor(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
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

  
let unit = 50;
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


function setup() {
    createCanvas(500, 500);
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
                random(0.01, speedMax),
                unit,
                unit/2
            );
        }
    }

    index = 0;
    for (let y = 0; y < highCount; y++) {
        for (let x = 0; x < wideCount; x++) {
            modsPosition[index++] = new ModulePosition(
                x * unit,
                y * unit
            );
        }
    }

    
}

var iteration = 0;
var r = 0;
var rowCount = 40;
// let a = 0;
// let b = 0;

function draw() {
    var valueBgColor;
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
            valueBgColor = keyMol[keyValue];
        } else {
            valueBgColor = keyDur[keyValue];
        }
        var rValue = valueBgColor[0];
        var gValue = valueBgColor[1];
        var bValue = valueBgColor[2];
        background('rgb(' + rValue + ',' + gValue + ',' + bValue + ')');
        contColor = 'rgb(' + 255-rValue + ',' + 255-gValue + ',' + 255-bValue + ')';
    }



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

    if (markets !== null && typeof markets !== 'undefined') {
        let iterationCount = 0;
        var columnCount = Math.floor(markets/rowCount) + 1;
        for (let a = 0; a < columnCount; a++) {
            for (let b = 0; b < rowCount; b++) {
                if (iterationCount < markets) {
                    marketList[iterationCount++] = new MarketIcon(
                        marketStartX + (a * 10),
                        marketStartY + (b * 10)+5,
                        (marketStartX + (a * 10)) - 15,
                        (marketStartY + (b * 10)) + 20,
                        a,
                        iterationCount
                    );
                }
                
            }
        }
        if (marketList.length == markets) {
            for (let i = 0; i < markets; i++) {
                marketList[i].drawDiagonal();
            }
        }
    }

    

}