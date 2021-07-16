class Ball {
    constructor(x, y, id, layer, outer_balls, balls) {
        this.x = x; 
        this.y = y;
        this.id = id;
        this.layer = layer;
        this.outer_balls = outer_balls; 
        this.balls = balls; 
        this.inner_balls = [];
        this.v_x = 0; 
        this.v_y = 0;
        this.area = 0;
        this.r = 0;
        if (this.layer === 0) {
            this.r = R;
            this.area = Math.PI * Math.pow(this.r, 2);
        } else {
            this.r = Math.sqrt(A_RATIO * this.outer_balls[0].area / (Math.PI * BALL_NUM));
            this.area = Math.PI * Math.pow(this.r, 2);
        }
    }
    set_inner_balls() {
        if (this.layer + 1 < LAYERS) {
            let x = 0;
            let y = 0;
            let L_x = this.x - this.r / 4;
            let H_x = this.x + this.r / 4;
            let L_y = this.y - this.r / 4;
            let H_y = this.y + this.r / 4;
            for (let i = 0; i < BALL_NUM; i++) {
                x = random(L_x, H_x);
                y = random(L_y, H_y);                              

                this.inner_balls[i] = new Ball(x, y, i, this.layer+1, this.balls, this.inner_balls);
                this.inner_balls[i].set_inner_balls();
            }
        } else {
            return;
        }
    }
    show() { 
        if (this.layer < LAYERS) {
            stroke(255);
            noFill();
            ellipse(this.x, this.y, this.r);
            if (this.layer + 1 < LAYERS) {
                for (let i = 0; i < BALL_NUM; i++) {
                    this.inner_balls[i].show();
                }
            }
        } else {
            return;
        }
    }
}