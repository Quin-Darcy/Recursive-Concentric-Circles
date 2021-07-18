// Display Constants
let W = window.innerWidth;
let H = window.innerHeight;

// Object Constants
let LAYERS = 5;
let A_RATIO = 0.3;
let BALL_NUM = 1;
let R = Math.sqrt(A_RATIO * W * H / (BALL_NUM * Math.PI));
let COLOR = 1;

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
    background(0);
    for (let i = 0; i < BALL_NUM; i++) {
        balls[i].collision();
        balls[i].move();
        balls[i].show();
    }
}

function reset() {
    W = window.innerWidth;
    H = window.innerHeight;
    R = Math.sqrt(A_RATIO * W * H / (BALL_NUM * Math.PI));
    balls = [];
    createCanvas(W, H);
    background(0);
    for (let i = 0; i < BALL_NUM; i++) {
        balls[i] = new Ball(random(R, W - R), random(R, H - R), i, 0, [], balls, 0); 
        balls[i].set_children();   
    }
    draw();
}

window.addEventListener("resize", onResize);

function onResize() {
    reset();
}

window.addEventListener('load', () => {
    document.getElementById('info-button').addEventListener('click', () => {
        document.getElementById('info').classList.toggle('hidden');
    });

    document.getElementById('reset-button').addEventListener('click', () => {
        reset();
    });

    document.getElementById('scale-dot').addEventListener('change', event => {
        LAYERS = parseFloat(event.target.value);
    });

    document.getElementById('style-select').addEventListener('change', event => {
        if (event.target.value === '1') {
            COLOR = 1;
        } else if (event.target.value === '2') {
            COLOR = 0;
        }
    });
    renderMathInElement(document.body);
});