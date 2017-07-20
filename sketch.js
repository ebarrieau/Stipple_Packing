var img;
var myPixels = [];
var stipples = [];
var stopped = false;

function preload() {
  img = loadImage("test.jpg");
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
}

function draw() {
  background(255);
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


  for (var i = 0; i < stipples.length; i++) {
    stipples[i].update();
  }

  var target = 1 + constrain(floor(frameCount / 120), 0, 20);
  var count = 0;
  for (var i = 0; i < 1000; i++) {
    if (addStipple()) {
      count++;
    }
    if (count == target) {
      break;
    }
  }

  if (count < 1) {
    noLoop();
    console.log("finished");
  }
}


function addStipple() {
  var newX = floor(random(width));
  var newY = floor(random(height));
  var index = (newX + newY * width);
  var brightness = myPixels[index];
  var newSize = map(brightness, 0, 255, .01, 10);
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
    ellipse(this.x, this.y, 1.5, 1.5);
  }
}
