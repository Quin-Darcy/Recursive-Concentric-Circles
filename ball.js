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
        this.child_num = random(1, 10);
        this.v_x = random(-2, 2); 
        this.v_y = random(-2, 2);
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
        this.v_y += g;
        this.x += this.v_x;
        this.y += this.v_y;
        if (this.layer === 0) {
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
        }
        for (let i = 0; i < this.children.length; i++) {
            let D = dist(this.x, this.y, this.children[i].x, this.children[i].y);
            let L = this.r - this.children[i].r;
            if (D >= L) {
                // CENTER TO CENTER VECTOR
                let P = createVector(this.children[i].x - this.x, this.children[i].y - this.y);
                let C2C_ANG = P.heading();
                let temp = createVector(this.x, this.y);
                temp.setMag(dist(this.x, this.y, this.children[i].x, this.children[i].y));
                temp.setHeading(C2C_ANG + Math.PI / 2);

                // DISPLAY OF THE ABOVE VECTOR
                //stroke(0, 255, 255);
                //fill(0, 255, 255);
                //line(this.x, this.y, this.x + temp.x, this.y + temp.y);
                //ellipse(this.x + temp.x, this.y + temp.y, 5);
                //console.log('CENTER TO CENTER: ', C2C_ANG * 180 / Math.PI);

                // COORDINATES TO POINT OF CONTACT
                let X = this.x + cos(P.heading()) * this.r;
                let Y = this.y + sin(P.heading()) * this.r;

                // CHILD VELOCITY VECTOR
                let Q = createVector(this.children[i].v_x, this.children[i].v_y);
                let CHILD_ANG = Q.heading();
                temp = createVector(this.children[i].x, this.children[i].y);
                temp.setMag(Q.mag());
                temp.setHeading(CHILD_ANG);
                let CHILD = temp;
                
                // DISPLAY OF THE VECTOR ABOVE
                //stroke(255, 0, 0);
                //fill(255, 0, 0);
                //line(X, Y, X + temp.x, Y + temp.y);
                //ellipse(X + temp.x, Y + temp.y, 5);

                // REFLECTED CHILD VELOCITY VECTOR
                let REFL_ANG = CHILD_ANG + 2 * (C2C_ANG + Math.PI / 2 - CHILD_ANG);
                temp = createVector(this.children[i].x, this.children[i].y);
                temp.setMag(Q.mag());
                temp.setHeading(REFL_ANG);
                let CHILD_R = temp;
                
                // DISPLAY OF THE VECTOR ABOVE
                //stroke(0, 255, 0);
                //fill(0, 255, 0);
                //line(this.children[i].x, this.children[i].y, this.children[i].x + temp.x, this.children[i].y + temp.y);
                //ellipse(this.children[i].x + temp.x, this.children[i].y + temp.y, 5);

                // PARENT VELOCITY VECTOR
                let R = createVector(this.v_x, this.v_y);
                let PARENT_ANG = R.heading();
                temp = createVector(this.children[i].x, this.children[i].y);
                temp.setMag(R.mag());
                temp.setHeading(PARENT_ANG);
                let PARENT = temp;
                
                // DISPLAY OF THE VECTOR ABOVE
                //stroke(255, 255, 0);
                //fill(255, 255, 0);
                //line(this.children[i].x, this.children[i].y, this.children[i].x + temp.x, this.children[i].y + temp.y);
                //ellipse(this.children[i].x + temp.x, this.children[i].y + temp.y, 5);

                // REFLECTED CHILD VELOCITY VECTOR
                let PREFL_ANG = PARENT_ANG + 2 * (C2C_ANG + Math.PI / 2 - PARENT_ANG);
                temp = createVector(this.children[i].x, this.children[i].y);
                temp.setMag(R.mag());
                temp.setHeading(PREFL_ANG);
                let PARENT_R = temp;
                
                // DISPLAY OF THE VECTOR ABOVE
                //stroke(0, 255, 255);
                //fill(0, 255, 255);
                //line(this.children[i].x, this.children[i].y, this.children[i].x + temp.x, this.children[i].y + temp.y);
                //ellipse(this.children[i].x + temp.x, this.children[i].y + temp.y, 5);


                // VECTORS WHICH ARE SUMS OF INTRINSIC AND EXTERNAL VELOCITIES
                let v1x = CHILD_R.x + PARENT.x;
                let v1y = CHILD_R.y + PARENT.y;
                let v2x = CHILD.x + PARENT_R.x;
                let v2y = CHILD.y + PARENT_R.y;

                let V1 = createVector(v1x, v1y);
                let V2 = createVector(v2x, v2y);

                V1.setMag(Math.log(V1.mag()));
                V2.setMag(Math.log(V2.mag()));

                // DISPLAY OF THE VECTORS ABOVE
                //stroke(255, 0, 0);
                //fill(255, 0, 0);
                //line(this.children[i].x, this.children[i].y, this.children[i].x + V1.x, this.children[i].y + V1.y);
                //ellipse(this.children[i].x + V1.x, this.children[i].y + V1.y);
                //stroke(0, 255, 0);
                //fill(0, 255, 0);
                //line(this.x, this.y, this.x + V2.x, this.y + V2.y);
                //ellipse(this.x + V2.x, this.y + V2.y);

                let dx = this.x - this.children[i].x;
                let dy = this.y - this.children[i].y;
                let sigma = Math.PI - atan2(-dy, dx);
                this.children[i].x = this.x + cos(sigma) * L;
                this.children[i].y = this.y + sin(sigma) * L;
                this.x = this.children[i].x + cos(Math.PI + sigma) * L;
                this.y = this.children[i].y + sin(Math.PI + sigma) * L;

                this.children[i].v_x = V1.x;
                this.children[i].v_y = V1.y;
                this.v_x = V2.x;
                this.v_y = V2.y;
            }
        }
        
    }
    show() { 
        if (this.layer < LAYERS) {
            stroke(255);
            strokeWeight(0.5);
            noFill();
            ellipse(this.x, this.y, 2 * this.r);
            /*let V = createVector(this.v_x, this.v_y);
            V.setMag(10*V.mag());
            strokeWeight(1);
            line(this.x, this.y, V.x + this.x, V.y + this.y);
            fill(255);
            ellipse(V.x + this.x, V.y + this.y, 5);*/
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