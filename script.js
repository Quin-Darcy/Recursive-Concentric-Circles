// Display Constants
let W = window.innerWidth;
let H = window.innerHeight;

// Object Constants
let LAYERS = 3;
let R = 200;
let A_RATIO = 0.1;
let BALL_NUM = 3;

// Arrays 
balls = [];

function setup() {
    createCanvas(W, H);
    background(0);
    for (let i = 0; i < BALL_NUM; i++) {
        balls[i] = new Ball(random(R, W - R), random(R, H - R), i, 0, [], balls); 
        balls[i].set_inner_balls();
        
    }
}

function draw() {
    background(0);
    for (let i = 0; i < BALL_NUM; i++) {
        balls[i].show();
    }
}