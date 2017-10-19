
(function(){
  window.onload = function(){


    if(document.getElementById("ion-animated-logo")){
      var target = document.getElementById("ion-animated-logo");
      var target_width = target.offsetWidth;
      var logo_flex = target_width/screen.width; //i.e. fraction of screen
      var ball_flex = 0.03; //i.e. ball radius relative to canvas
      var canvas_width = screen.width * logo_flex;
      var canvas = document.createElement('canvas');
      canvas.id = "ionCanvas";
      canvas.width = canvas_width;
      canvas.height = canvas_width; //assume square.
      target.appendChild(canvas);
    }else{
      return false;
    }

    var bgc = window.getComputedStyle(document.body).backgroundColor;
    var context = canvas.getContext("2d");

    var t=0;
    //var frameInterval = 25; // in ms
    var frameInterval = 10; // in ms

    var i = 0;  //incrementer for orbiter1
    // ball globals
    //var ballRadius = 10;

    // physics globals
    var collisionDamper = 0.3;
    //var floorFriction = 0.0005 * frameInterval;
    var floorFriction = 0.0010 * frameInterval;
    var mouseForceMultiplier = 1 * frameInterval;
    var restoreForce =0.002 * frameInterval;

    var mouseX = 99999;
    var mouseY = 99999;

    var balls = null;

    function Ball(id,x,y,vx,vy,color,radius) {
      this.id=id;
    	//this.x=x;
    	//this.y=y;
    	this.vx=vx;
    	this.vy=vy;
    	this.color=color;
    	this.radius=radius;

    	this.origX = x;
    	this.origY = y;
      this.x = Math.random() * canvas_width;
      this.y = Math.random() * canvas_width;

      this.home = false;
    }

    function initStageObjects() {
    	balls = new Array();

      /*
        animated gif size = 200px
        ball width about 10px
        i starts at 50px
        o starts at 70px
        n starts at about 120px
      */

    	var white="#FFFFFF";
    	var salmon="#D34941";
    	var blue="#118EE3";
    	//var hole="#280A37";
      var hole = bgc;
    	var i_x = (canvas_width * 0.277);    // i.e. ball centre at 55/200
    	var o_x = (canvas_width * 0.447);     // i.e. 'o' balls' centres at x,y of 90,100
    	var n_x = (canvas_width * 0.618);
      var y_base = (canvas_width * 0.447);

      var vx0 = 0;
      var vy0 = 0;

    	// i
    	balls.push(new Ball('i1',i_x,y_base,vx0,vy0,white,canvas_width * ball_flex));

    	balls.push(new Ball('i2',i_x,y_base+(0.09*canvas_width),vx0,vy0,blue,canvas_width * ball_flex));

    	balls.push(new Ball('i3',i_x,y_base+(0.06*canvas_width),vx0,vy0,salmon,canvas_width * ball_flex));
    	balls.push(new Ball('i4',i_x,y_base+(0.12*canvas_width),vx0,vy0,white,canvas_width * ball_flex));

    	// O
    	balls.push(new Ball('o1',o_x,0.504*canvas_width,vx0,vy0,white,canvas_width * ball_flex * 3));
    	balls.push(new Ball('o2',o_x,0.504*canvas_width,vx0,vy0,hole,canvas_width * ball_flex));

    	// N
    	balls.push(new Ball('n1',n_x,y_base,vx0,vy0,white,canvas_width * ball_flex));
    		balls.push(new Ball('n2',n_x+(0.025*canvas_width),y_base+(0.025*canvas_width),vx0,vy0,white,canvas_width * ball_flex));

    	balls.push(new Ball('n3',n_x,y_base+(0.06*canvas_width),vx0,vy0,salmon,canvas_width * ball_flex));
    	balls.push(new Ball('n4',n_x,y_base+(0.09*canvas_width),vx0,vy0,salmon,canvas_width * ball_flex));
    	balls.push(new Ball('n5',n_x,y_base+(0.12*canvas_width),vx0,vy0,salmon,canvas_width * ball_flex));


    	balls.push(new Ball('n6',n_x+(0.12*canvas_width),y_base+(0.03*canvas_width),vx0,vy0,salmon,canvas_width * ball_flex));
    	balls.push(new Ball('n7',n_x+(0.12*canvas_width),y_base+(0.08*canvas_width),vx0,vy0,salmon,canvas_width * ball_flex));
     	balls.push(new Ball('n8',n_x+(0.12*canvas_width),y_base,vx0,vy0,white,canvas_width * ball_flex));
    	balls.push(new Ball('n9',n_x+(0.12*canvas_width),y_base+(0.06*canvas_width),vx0,vy0,white,canvas_width * ball_flex));
    	balls.push(new Ball('n10',n_x+(0.12*canvas_width),y_base+(0.12*canvas_width),vx0,vy0,blue,canvas_width * ball_flex));
    		balls.push(new Ball('n11',n_x+(0.10*canvas_width),y_base+(0.09*canvas_width),vx0,vy0,white,canvas_width * ball_flex));
    		balls.push(new Ball('n12',n_x+(0.06*canvas_width),y_base+(0.06*canvas_width),vx0,vy0,blue,canvas_width * ball_flex));

    }

    function drawStageObjects(context) {
    	for (var n=0; n<balls.length; n++) {
    		context.beginPath();
    		context.arc(balls[n].x,balls[n].y,balls[n].radius,0,2*Math.PI,false);
    		context.fillStyle=balls[n].color;
    		context.fill();
    	}


    }

    function updateStageObjects(context) {

    	for (var n=0; n<balls.length; n++) {      i++;

        //bypass if ball has already arrived home.
        if(balls[n].home == true){
          continue;
        }

    		// set ball position based on velocity
    		balls[n].y+=balls[n].vy;
    		balls[n].x+=balls[n].vx;

    		// restore forces



    		if (balls[n].x > balls[n].origX) {
    			balls[n].vx -= restoreForce;
    		}
    		else {
    			balls[n].vx += restoreForce;
    		}
    		if (balls[n].y > balls[n].origY) {
    			balls[n].vy -= restoreForce;
    		}
    		else {
    			balls[n].vy += restoreForce;
    		}



    		// mouse forces
    		var distX = balls[n].x - mouseX;
    		var distY = balls[n].y - mouseY;

    		var radius = Math.sqrt(Math.pow(distX,2) +
    			Math.pow(distY,2));

    		var totalDist = Math.abs(distX) + Math.abs(distY);

    		var forceX = (Math.abs(distX) / totalDist) *
    			(1/radius) * mouseForceMultiplier;
    		var forceY = (Math.abs(distY) / totalDist) *
    			(1/radius) * mouseForceMultiplier;

    		if (distX>0) { // mouse is left of ball
    			balls[n].vx += forceX;
    		}
    		else {
    			balls[n].vx -= forceX;
    		}
    		if (distY>0) { // mouse is on top of ball
    			balls[n].vy += forceY;
    		}
    		else {
    			balls[n].vy -= forceY;
    		}


    		// floor friction
    		if (balls[n].vx>0) {
    			balls[n].vx-=floorFriction;
    		}
    		else if (balls[n].vx<0) {
    			balls[n].vx+=floorFriction;
    		}
    		if (balls[n].vy>0) {
    			balls[n].vy-=floorFriction;
    		}
    		else if (balls[n].vy<0) {
    			balls[n].vy+=floorFriction;
    		}

    		// floor condition
    		if (balls[n].y > (canvas.height-balls[n].radius)) {
    			balls[n].y=canvas.height-balls[n].radius-2;
    			balls[n].vy*=-1;
    			balls[n].vy*=(1-collisionDamper);
    		}

    		// ceiling condition
    		if (balls[n].y < (balls[n].radius)) {
    			balls[n].y=balls[n].radius+2;
    			balls[n].vy*=-1;
    			balls[n].vy*=(1-collisionDamper);
    		}

    		// right wall condition
    		if (balls[n].x > (canvas.width-balls[n].radius)) {
    			balls[n].x=canvas.width-balls[n].radius-2;
    			balls[n].vx*=-1;
    			balls[n].vx*=(1-collisionDamper);
    		}

    		// left wall condition
    		if (balls[n].x < (balls[n].radius)) {
    			balls[n].x=balls[n].radius+2;
    			balls[n].vx*=-1;
    			balls[n].vx*=(1-collisionDamper);
    		}

        if(balls[n].id == 'i1'){
          var ball = balls[n];
          //console.log('i1: x=' + ball.x + ' y=' + ball.y);
        }

        //set home run if ball has made it...
        if((Math.abs(balls[n].origX - balls[n].x) < 0.01) && (Math.abs(balls[n].origY - balls[n].y) < 0.01)){
          balls[n].home = true;
        }

    	}
    }

    function clearCanvas(context) {
    	context.clearRect(0,0,canvas.width, canvas.height);
    }

    function handleMouseMove(evt) {
    	mouseX = evt.clientX - canvas.offsetLeft;
    	mouseY = evt.clientY - canvas.offsetTop;
    }

    function handleMouseOut() {
    	mouseX = 99999;
    	mouseY = 99999;
    }

    var circle = function(context,color, r) {
        context.fillStyle = color;
        context.beginPath();
        context.arc(0, 0, r, 0, 2 * Math.PI, true);
        context.closePath();
        context.fill();
    }


      var orbiter1 = function(context) {
      	  var salmon="#D34941";
          context.save();
          context.translate((0.447*canvas_width), (0.504*canvas_width));
          context.rotate(-i / 4900);
          context.translate((0.41*canvas_width), 0);
          circle(context,salmon, canvas_width * ball_flex);
          context.restore();
      };

      var orbiter2 = function(context) {
      	  var blue="#118EE3";
          context.save();
          context.translate((0.447*canvas_width), (0.504*canvas_width));
          context.rotate(i / 1500);
          context.translate((0.293*canvas_width), 0);
          circle(context,blue, canvas_width * ball_flex);
          context.restore();
      };

      var orbiter3 = function(context) {
      	  var white="#FFFFFF";
          context.save();
          context.translate((0.447*canvas_width), (0.504*canvas_width));
          context.rotate(i / 2200);
          context.translate((0.17*canvas_width), 0);
          circle(context,white, canvas_width * ball_flex);
          context.restore();
      };


    function handleMouseMove(evt) {
    	mouseX = evt.clientX - canvas.offsetLeft;
    	mouseY = evt.clientY - canvas.offsetTop;
    }

    function handleMouseOut() {
    	mouseX = 99999;
    	mouseY = 99999;
    }

    function updateStage() {
      t+=frameInterval;
      clearCanvas(context);
      updateStageObjects(context);
      orbiter1(context);
      orbiter2(context);
      orbiter3(context);
      drawStageObjects(context);
      orbiter3(context);
      i++;
    }

    function init() {
    	initStageObjects();
    	setInterval(updateStage, frameInterval);
    }

    //lets go...
      init();

    }

})();