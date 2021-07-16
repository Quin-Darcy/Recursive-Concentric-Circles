// Display Constants
let W = window.innerWidth;
let H = window.innerHeight;

// Object Constants
let LAYERS = 5;
let R = 150;
let A_RATIO = 0.25;
let BALL_NUM = 3;

// Environment Constants
let g = 0/10;
let mu = -0.9;
let hardness = 1;
let cor = 0.99;

// Arrays 
balls = [];

function setup() {
    createCanvas(W, H);
    background(0);
    for (let i = 0; i < BALL_NUM; i++) {
        balls[i] = new Ball(random(R, W - R), random(R, H - R), i, 0, [], balls, 0); 
        balls[i].set_children();   
    }
}

function draw() {
    frameRate(10);
    background(0);
    for (let i = 0; i < BALL_NUM; i++) {
        balls[i].collision();
        balls[i].move();
        balls[i].show();
    }
}