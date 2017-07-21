var img;
var myPixels = [];
var stipples = [];
var imgDots = [];
var stopped = false;
var packDensity = .95;
var section = 0;
var horizontalDiv = 100;
var verticalDiv = 25;
var horizontalSections;
var verticalSections;
var totalSections;

function preload() {
  img = loadImage("zebra.jpg");
}
function setup() {
  createCanvas(img.width, img.height);
  pixelDensity(1);
  img.loadPixels();
  loadPixels();
  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var loc = (x + y * img.width) * 4;
      var index = (x + y * img.width);
      var r = img.pixels[loc + 0];
      var g = img.pixels[loc + 1];
      var b = img.pixels[loc + 2];
      var brightness = (r + g + b) / 3;
      myPixels[index] = constrain(brightness, 0, 255);
    }
  }
  horizontalSections = floor(img.width / horizontalDiv);
  verticalSections = floor(img.height/ verticalDiv);
  totalSections = horizontalSections * verticalSections;
  console.log("Total Sections" + totalSections);
  sectionHandler(0);
}


function sectionHandler(section) {
  //background(255);
  // Uncomment the below text to show the base image
  // loadPixels();
  // for (var x = 0; x < width; x++) {
  //   for (var y = 0; y < height; y++) {
  //     var loc = (x + y * width) * 4;
  //     var index = (x + y * width);
  //     pixels[loc + 0] = myPixels[index];
  //     pixels[loc + 1] = myPixels[index];
  //     pixels[loc + 2] = myPixels[index];
  //     pixels[loc + 3] = 255;
  //   }
  // }
  // updatePixels();
  if (section < totalSections) {
    var oldX = (section % horizontalSections) * horizontalDiv;
    var oldY = floor(section / horizontalSections) * verticalDiv;
    // var oldX = ((section - 1) % horizontalSections + 1) * horizontalDiv + 1;
    // var oldY = floor((section - 1) / horizontalSections + 1) * verticalDiv + 1;
    var callX = oldX + horizontalDiv;
    var callY = oldY + verticalDiv;
    generateStipples(oldX, oldY, callX, callY);
  } else if (section == totalSections) {
    var oldX = ((section - 1) % horizontalSections + 1) * horizontalDiv + 1;
    var oldY = floor((section - 1) / horizontalSections + 1) * verticalDiv + 1;
    generateStipples(0, oldY, img.width, img.height);
    generateStipples(oldX, 0, img.width, oldY);
  } else {
    background(255);
    for (var i = 0; i < imgDots.length; i++) {
      imgDots[i].update();
    }
  }

}

function generateStipples(oldX, oldY, callX, callY) {
  var finished = false;
  while (!finished) {
    var target = 100;
    var count = 0;
    for (var i = 0; i < target; i++) {
      if (addStipple(oldX, oldY, callX, callY)) {
        count++;
      }
      if (count == target) {
        break;
      }
    }
    if (count <= (target + 1 - packDensity * target)) {
      finished = true;
    }
  }
  section += 1;
  for (var i = 0; i < stipples.length; i++) {
    imgDots.push(stipples[i]);
  }
  stipples = [];
  if (section != (totalSections + 1)) {
    console.log("Section:" + section);
    sectionHandler(section);
  }
}

function addStipple(oldX, oldY, callX, callY) {
  var newX = floor(random(oldX, callX));
  var newY = floor(random(oldY, callY));
  var index = (newX + newY * width);
  var brightness = myPixels[index];
  var newSize = map(brightness, 0, 255, .1, 15);
  var newStipple = new Stipple(newX, newY, newSize);

  if (brightness < 250) {
    for (var i = 0; i < stipples.length; i++) {
      var other = stipples[i];
      var d = dist(newStipple.x, newStipple.y, other.x, other.y);
      if (d < (newStipple.size)) {
        newStipple = undefined;
        break;
      }
    }
  } else {
    newStipple = undefined;
  }
  if (newStipple) {
    stipples.push(newStipple);
    return true;
  } else {
    return false;
  }
}

function mousePressed() {
  stopped = !stopped;
  if (stopped) {
    noLoop();
  } else if (!stopped) {
    loop()
  }
}

function Stipple(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size;

  this.update = function() {
    fill(0, 0, 0);
    noStroke();
    ellipse(this.x, this.y, 2.5, 2.5);
  }
}
