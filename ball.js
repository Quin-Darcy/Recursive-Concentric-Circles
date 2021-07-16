class Ball {
    constructor(x, y, id, layer, parents, siblings, pid) {
        this.x = x; 
        this.y = y;
        this.id = id;
        this.layer = layer;
        this.parents = parents; 
        this.pid = pid;
        this.siblings = siblings; 
        this.children = [];
        this.child_num = random(1, 5);
        this.v_x = random(-1, 1); 
        this.v_y = random(-1, 1);
        this.area = 0;
        this.r = 0;
        if (this.layer === 0) {
            this.r = R;
            this.area = Math.PI * Math.pow(this.r, 2);
        } else {
            this.r = Math.sqrt(A_RATIO * this.parents[0].area / (Math.PI * this.parents[this.pid].child_num));
            this.area = Math.PI * Math.pow(this.r, 2);
        }
    }
    set_children() {
        if (this.layer + 1 < LAYERS) {
            let x = 0;
            let y = 0;
            let L_x = this.x - this.r / 4;
            let H_x = this.x + this.r / 4;
            let L_y = this.y - this.r / 4;
            let H_y = this.y + this.r / 4;
            for (let i = 0; i < this.child_num; i++) {
                x = random(L_x, H_x);
                y = random(L_y, H_y);                              
                this.children[i] = new Ball(x, y, i, this.layer+1, this.siblings, this.children, this.id);
                this.children[i].set_children();
            }
        } else {
            return;
        }
    }
    collision() {
        for (let i = this.id + 1; i < this.siblings.length; i++) {
            let dx = this.siblings[i].x - this.x;
            let dy = this.siblings[i].y - this.y;
            let center_dist = dist(dx, dy, 0, 0);
            let touching_dist = this.siblings[i].r + this.r;
            if (center_dist < touching_dist) {
                let theta = atan2(dy, dx);
                let new_x = this.x + cos(theta) * touching_dist;
                let new_y = this.y + sin(theta) * touching_dist;
                let a_x = (new_x - this.siblings[i].x) * cor;
                let a_y = (new_y - this.siblings[i].y) * cor;
                this.v_x -= a_x*hardness;
                this.v_y -= a_y*hardness;
                this.siblings[i].v_x += a_x*hardness;
                this.siblings[i].v_y += a_y*hardness; 
            }
        }
    }

    move() {
        if (this.layer === 0) {
            this.v_y += g;
            this.x += this.v_x;
            this.y += this.v_y;
            if (this.x + this.r > W) {
                this.x = W - this.r;
                this.v_x = this.v_x*cor*mu;
            } else if (this.x - this.r < 0) {
                this.x = this.r;
                this.v_x = this.v_x*cor*mu;
            }
            if (this.y + this.r >= H) {
                this.y = H - this.r;
                this.v_y = this.v_y*cor*mu;
            } else if (this.y - this.r < 0) {
                this.y = this.r;
                this.v_y = this.v_y*cor*mu;
            }
        } else {
            this.v_y += g;
            this.x += this.v_x;
            this.y += this.v_y;
            let L = this.parents[0].r;
            let C = createVector(this.parents[this.pid].x, this.parents[this.pid].y);
            let P = createVector(this.x, this.y);
            let D = C.dist(P);
            if (D >= L - this.r) {
                let theta1 = atan2(this.parents[this.pid].y - this.y, this.parents[this.pid].x - this.x);
                let theta2 = Math.PI - atan2(-this.v_y, this.v_x);
                this.x = this.parents[this.pid].x - (L - this.r) * cos(theta1);
                this.y = this.parents[this.pid].y - (L - this.r) * sin(theta1);
                this.v_x = this.v_x*cor*mu;
                this.v_y = this.v_y*cor*mu;
                let V = createVector(this.v_x, this.v_y);
                V.setHeading(theta2);
                this.v_x = V.x;
                this.v_y = V.y;
                this.parents[this.pid].v_x = -this.v_x;
                this.parents[this.pid].v_y = -this.v_y;
            }
        }
        for (let i = 0; i < this.children.length; i++) {
            let D = dist(this.x, this.y, this.children[i].x, this.children[i].y);
            let L = this.r - this.children[i].r - 0.1;
            if (D >= L) {
                let dx = this.x - this.children[i].x;
                let dy = this.y - this.children[i].y;
                let sigma = Math.PI - atan2(-dy, dx);

                this.children[i].x = this.x + cos(sigma) * L;
                this.children[i].y = this.y + sin(sigma) * L;
                this.x = this.children[i].x + cos(Math.PI + sigma) * L;
                this.y = this.children[i].y + sin(Math.PI + sigma) * L;

                let R_x = this.v_x + this.children[i].v_x;
                let R_y = this.v_y + this.children[i].v_y;
                let theta = atan2(R_y, R_x);
                let CV = createVector(R_x, R_y);
                let PV = createVector(R_x, R_y);
                PV.setHeading(Math.PI + 2* theta);
                PV.setMag(Math.sqrt(PV.mag()));
                CV.setMag(Math.sqrt(CV.mag()));
                this.children[i].v_x = CV.x;
                this.children[i].v_y = CV.y;
                CV.rotate(Math.PI);
                this.v_x = CV.x;
                this.v_y = CV.y;
            }
        }
        
    }
    show() { 
        if (this.layer < LAYERS) {
            stroke(255);
            strokeWeight(0.5);
            noFill();
            ellipse(this.x, this.y, 2 * this.r);
            /* let V = createVector(this.v_x, this.v_y);
            V.setMag(10*V.mag());
            strokeWeight(1);
            line(this.x, this.y, V.x + this.x, V.y + this.y);
            fill(255);
            ellipse(V.x + this.x, V.y + this.y, 5); */
            if (this.layer + 1 < LAYERS) {
                for (let i = 0; i < this.children.length; i++) {
                    this.children[i].collision();
                    this.children[i].move();
                    this.children[i].show();
                }
            }
        } else {
            return;
        }
    }
}