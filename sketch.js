let xRes = window.innerWidth;
let yRes = window.innerHeight;

let bc,
		shapes,
		elems, numElems,
		controlWindowWidth, controlWindowHeight;

var elemPosNoiseCounter,
		scaleSlider, shapesSlider, resetButton,
		animateScale, animateScaleBtn,
		myTail;

function setup() {
	createCanvas(xRes, yRes);
	rectMode(CENTER);
	ellipseMode(CENTER);

	bc = createVector(random(10, 30), random(10, 30), random(10, 30));
	shapes = ['circle', 'triangle', 'square'];
	elems = [];
	numElems = 100;
	elemPosNoiseCounter = 0.0;
	controlWindowWidth = 500;
	controlWindowHeight = 200;
	animateScale = false;
	myTail = new Tail(10);

	setupControls();

	for (var i = 0; i < numElems; i += 1) {
		e = new Elem;
		elems.push(e)
	}
}

function setupControls() {
	setupScaleSlider(75);
	setupShapeSlider(numElems/2);
	setupAnimateBtn("Animate!");
}

function setupScaleSlider(defaultVal) {
	if (typeof scaleSlider != 'undefined') scaleSlider.remove();

	scaleSlider = createSlider(0, 200, defaultVal);
	scaleSlider.position(100, 15);
}

function setupShapeSlider(defaultVal) {
	if (typeof shapesSlider != 'undefined') shapesSlider.remove();

	shapesSlider = createSlider(1, numElems, defaultVal);
	shapesSlider.position(100, 35);
}

function setupAnimateBtn(txt) {
	animateScaleBtn = createButton(txt);
	animateScaleBtn.position(20, 65);
	animateScaleBtn.mousePressed(function(){
		animateScaleBtn.remove();
		animateScale = !animateScale;
		if(animateScale) setupAnimateBtn("Stop!");
		else setupAnimateBtn("Animate!");
	})
}

function draw () {
	myTail.update();
	background(color(bc.x, bc.y, bc.z));

	for (var i = 0; i < shapesSlider.value(); i += 1) elems[i].display();

	controls();
	drawCursor();
	animate();
}

function mousePressed() {
	if (!isMouseInsideControlWindow()) {
		bc = createVector(random(10, 50), random(10, 50), random(10, 50));

		setupScaleSlider(Math.floor(random(20,180)));
		setupShapeSlider(Math.floor(random(10,numElems - 10)));
		for (var i = 0; i < shapesSlider.value(); i += 1) elems[i].reset();
	}
}

function controls() {
	push();
	fill(0);
	rect(0, 0, controlWindowWidth + 5, controlWindowHeight + 5);
	fill(40);
	rect(0, 0, controlWindowWidth, controlWindowHeight);
	textSize(14);
	fill(200);
	textFont("Georgia");
	text("Scale ", 20, 30);
	text("Shapes ", 20, 50);
	pop();
}

function drawCursor() {
	if (isMouseInsideControlWindow()) {
		cursor(HAND);
	} else {
		noCursor();
		push();
		myTail.draw();
		pop();
	}
}

function animate() {
	sinVal = (sin(frameCount / 20) + 1) / 2
	if(animateScale) {
		setupScaleSlider(200 * sinVal);
	}
}

function isMouseInsideControlWindow() {
	return mouseX * 2 < controlWindowWidth && mouseY * 2 < controlWindowHeight;
}

function Elem() {
	this.reset = function() {
		this.x = random(10, xRes-10);
	  this.y = random(10, yRes-10);
		this.xDir = 1;
		this.yDir = 1;
		this.rotSpeed = random(-5, 5);
		this.size = random(5, 80);
	  this.color = randomColor();
		this.shape = randomShape();
	}

	this.reset();

	this.display = function() {
		noStroke();
    fill(this.color);

		push();
		translate(this.x, this.y);
		rotate(this.rotSpeed * radians(frameCount));
		translate(this.x / (10 * this.rotSpeed), this.y / (10 * this.rotSpeed));
		scale(scaleSlider.value() / 50);

		if (this.shape == 'triangle')
	    triangle(0, 0, this.size * 1.6, -this.size, this.size * 1.6,  this.size);
		else if (this.shape == 'circle')
			ellipse(0, 0, this.size);
		else
			rect(0, 0, this.size, this.size);

		pop();

		elemPosNoiseCounter += 0.01;

		this.x += noise(elemPosNoiseCounter) / 10 * this.xDir;
		this.y += noise(elemPosNoiseCounter) / 10 * this.yDir;

		dirChangeAt = 0.05;
		if(random(0, 1) < dirChangeAt) this.xDir *= -1;
		if(random(0, 1) < dirChangeAt) this.yDir *= -1;
  }
}

function Tail(n) {
  this.n = n;
  this.pos = [];
	this.shapes = [];
	this.colors = [];
  for (var i = 0; i < this.n; i++) {
    append(this.pos, createVector(0, 0));
		append(this.shapes, randomShape());
		append(this.colors, randomColor(255, 255));
  }
}

Tail.prototype.update = function(){
  this.pos[0] = createVector(mouseX, mouseY);
  for(var i = 1; i < this.n; i++) {
    this.pos[i] = p5.Vector.lerp(this.pos[i], this.pos[i-1], 0.1);
  }
}

Tail.prototype.draw = function(){
  noStroke();
  randomSeed(23);

  for (var i = 0; i < this.n; i++) {
		shape = this.shapes[i];
		x = this.pos[i].x;
		y = this.pos[i].y;
		size = 20;

		push();
		translate(x, y);
		rotate(4 * radians(frameCount));
		scale(scaleSlider.value() / 100);
		translate(-x, -y);

    fill(this.colors[i]);
		if (shape == 'triangle')
	    triangle(x, y, x + size * 1.6, y - size, x + size * 1.6,  y + size);
		else if (shape == 'circle')
			ellipse(x, y, size);
		else
			rect(x, y, size, size);
		pop();
  }
}

function randomColor(max = 150, alpha = random(100, 150)) {
	return color(random(10, max), random(10, max), random(10, max), alpha);
}

function randomShape() {
	return shapes[Math.floor(Math.random()*shapes.length)];
}
