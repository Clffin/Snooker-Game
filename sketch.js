/////////////////// Commentary///////////////////////////////////
// For this assigment I decided to use the basic programming techniques I have learnt from the intro to pragramming one and two. For the design of the snooker table, i followed the normal conventions and design from various sources in the internet. In the implementation of the cue  ball, I used both the mouse and key interaction for the user to place the cue ball on the D-zone. I also added the option to allow users to change its placement if they are not happy with the current placement. 

// For the cue stick, i drew a very basic cue and did not implement matter.js physics and instead, used it as a visual element. The force being applied to the ball is actually based on the distance from the mouse pointer to the cueball with a limit to avoid too much force from being applied. I have implemented physics on the cushions and balls but unfortunaly I was not able to make it more realistic. The bounciness of the wall is not the best but does the job for now. Even though I followed the measurement ratios for the balls and pockets, scoring the balls have proven to be a challenge. 

// For the set up choices, as required I developed the three states, but the randomness alogirthm used for this was very basic. It does generate the balls in a random order but I was not too sure about what the examiner was looking for.

// In terms of extensions, I was informed that implementing scoring features or adding sounds and other features already implemented were not allowed so I was not too sure about what to create. So, I just added a very basic strength meter so that users can gauge the strength being applied to the ball. Although it isn't complete yet, it still is in its experimental stage. The same goes for the force lines I made. My initial idea was to draw a force line that follows the direction of the cue ball and stops when it comes into contact with the cue ball. I also implemented an algorithm to show the resultant force line on the ball that will be in contact with the cue ball. Unfortunately I was unable to get the force line to stop when it comes into contact with another ball, so I had to scrap the whole idea. To make the game more realistic, I added a function to make sure that you can only shoot the ball again if the ball is not in motion.

//Reflecting on this assinment I believe I could have made a better designed and a more functional application if I spent more time on it but I made the mistake of dividing the assignment load evenly and focus on other assignments more.

//////////THE APPLICATION/////////////////////////////
// moduele aliases
var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Vertices = Matter.Vertices;

var engine;
var cueBall;
var yellowBall;
var greenBall;
var brownBall;
var blueBall;
var pinkBall;
var blackBall;
var Cushionwall;

//the arrays
var walls;
var balls;
var pockets;
var colorBalls;
var cushions;
var prevPosition;//to store prev positions

var tableWidth;
var ballWidth;

var inZone = false;
var gameMode;// 0 - choose set up, 1 - place ball, 2 - either move ball or start game, 3 - shoot ball, 4 - let balls move and press enter to shoot again
var setupMode;
var inMotion = false;

//decleration for the randomness
var redRandom = false;
var colRandom = false;

//declare variables for the pockets
var PocX;
var PocY;
var PocW;

var counter = 0;

function setup() {
  createCanvas(800, 600);

  // create an engine
  engine = Engine.create();
  engine.world.gravity.y = 0;

  tableWidth = 300;    
  ballWidth = tableWidth / 72; 
  walls = [];
  cushions = [];
  colorBalls = [];
  balls = [];
  prevPosition = [];
  PocX = 103 + ballWidth * 1.5;
  PocY = 153 + ballWidth * 1.5;
  PocW = ballWidth * 3; 
  //to store the position of the pockets
  pockets = [
     {x: PocX, y: PocY, diameter: PocW},
     {x: PocX + 581, y: PocY, diameter: PocW},
     {x: PocX, y: PocY + 282, diameter: PocW},
     {x: PocX + 581, y: PocY + 282, diameter: PocW},
     {x: PocX + 290.5, y: PocY - 2, diameter: PocW},
     {x: PocX + 290.5, y: PocY + 285, diameter: PocW}
  ];
 
  setupWalls();
  generateCushionWall();
    
  gameMode = 0;
  setupMode = 0;

  // Add collision event listener
  Matter.Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      if (pair.bodyA === cueBall || pair.bodyB === cueBall) {
        var otherBody = pair.bodyA === cueBall ? pair.bodyB : pair.bodyA;
        console.log('Cue ball collided with:', otherBody);
        //alert('Cue ball collided with another ball!');
      }
    }
  });
}

function draw() {
  background(0);

  Engine.update(engine);

  push();
  fill(0, 255, 0);
  rect(100, 150, 600, 300);
  pop();
  
  drawStartLines();
  drawWalls();
  drawPocketHouse();
  drawCushionWall();
  drawTexts();
    
  // Make the cueBall follow the mouse if gameMode is 0 and in the D zone
  if (gameMode == 1 && inZone) {
    generateCueBall(mouseX, mouseY);
  }

  // Always draw the cueBall if it exists
  if (cueBall) {
    drawCueBall();  
  }
     

  if (setupMode == 1) {
    drawRedBalls();
    drawColorBalls();
  } 
  else if (setupMode == 2) {
    drawRedBalls();
    drawColorBalls();
  } 
  else if (setupMode == 3) {
    drawRedBalls();
    drawColorBalls();  
  }

  checkIfCueInD();
  drawForceLine(); 
  checkIfPocketed();
    
  // Check if the cue ball is in motion
  if (cueBall) {
    isObjectInMotion(cueBall);
    console.log('Cue ball in motion:', inMotion);
  }
    
  // to change cursor
  if(gameMode == 1){
     cursor(HAND);
  }
  else{
      cursor(ARROW);
  }
    
}

// to check if the cue ball is in the D zone
function checkIfCueInD() {
  var d_zone = dist(mouseX, mouseY, 110 + (tableWidth * 2) / 5, 300);
  if (d_zone <= 50 && mouseX <= (110 + (tableWidth * 2) / 5)) {
    inZone = true;
    //console.log("In the D zone");
  } else {
    inZone = false;
  }
}

function keyPressed() {
  if (keyCode == 49 && gameMode == 0) {
    console.log("Normal Set up Selected");
    setupMode = 1;
    gameMode = 1;
    generateRedBalls();
    generateColorBalls();
  } 
  else if (keyCode == 50 && gameMode == 0) {
    console.log("Random Set up (reds only) Selected");
    setupMode = 2;
    gameMode = 1;
    redRandom = true;
    generateRedBalls();
    generateColorBalls();
  } 
  else if (keyCode == 51 && gameMode == 0) {
    console.log("Random Set up (all colors) Selected");
    setupMode = 3;
    gameMode = 1;
    redRandom = true;
    colRandom = true;
    generateRedBalls();
    generateColorBalls();
  } 
  else if (keyCode == 13 &&  gameMode == 2) { // to start game
  //else if (keyCode == 13 &&  gameMode >= 2) { // to start game
    console.log("Start Game");
    gameMode = 3;
  } 
  else if (keyCode == 13 &&  gameMode == 4 && inMotion == false) { // to start game
    console.log("Start Game");
    gameMode = 3;
  } 
    
  else if (keyCode == 82 && gameMode == 2) {
    gameMode = 1;
    console.log("Reset cueball");
  }
  else if (keyCode == 52) { // to restart everything
    console.log("Restart Game");
    restartGame();
  }
}


function mousePressed() {
  if(mouseButton == LEFT){
    //to place the cue ball
      if (gameMode == 1 && inZone == true) {
        gameMode = 2;
        console.log("Ball Placed");
      }

        // only apply force on the cueball if in the start game mode
      if (gameMode == 3) {
        var force = 100000;
        var forceX = (cueBall.position.x - mouseX) / force;
        var forceY = (cueBall.position.y - mouseY) / force;
        var appliedForce = createVector(forceX, forceY);
        appliedForce.limit(0.002);
        console.log(appliedForce.mag());
        //var appliedForce = {x: forceX, y: forceY};
        console.log(forceX, forceY);
        Body.applyForce(cueBall, {x: cueBall.position.x, y: cueBall.position.y}, appliedForce);

        gameMode = 4;
      } 
  }
}

function restartGame() {
  // Clear all bodies from the world
  World.clear(engine.world, true);

  // Remove the cue ball
  if (cueBall) {
    World.remove(engine.world, cueBall);
    cueBall = null;
  }
    
  // Reset arrays
  balls = [];
  walls = [];
  pocketHouse = [];
  colorBalls = [];
  cushions = [];
  balls = [];
  prevPosition = [];
  PocX = 103 + ballWidth * 1.5;
  PocY = 153 + ballWidth * 1.5;
  PocW = ballWidth * 3; 
  pockets = [
     {x: PocX, y: PocY, diameter: PocW},
     {x: PocX + 581, y: PocY, diameter: PocW},
     {x: PocX, y: PocY + 282, diameter: PocW},
     {x: PocX + 581, y: PocY + 282, diameter: PocW},
     {x: PocX + 290.5, y: PocY - 2, diameter: PocW},
     {x: PocX + 290.5, y: PocY + 285, diameter: PocW}
  ];
  
  // Reset modes
  gameMode = 0;
  setupMode = 0;
  redRandom = false;
  colRandom = false;

  // Recreate initial setup
  setupWalls();
  generateCushionWall();
  console.log("Game Reset");
}

//function to draw the instructions
function drawTexts(){
     push();
     noStroke();
     fill(255,0,0);
     textSize(16);
     text('Press "4" to restart', 350, 40, 600);
     pop();
    
    if(gameMode == 0){
         push();
         noStroke();
         fill(255,0,0);
         textSize(16);
         text('Press "1" for normal set up, "2" for random red ball set up, or "3" for random color ball set up', 120, 80, 600);
         pop();
    }
    else if(gameMode == 1){
         push();
         noStroke();
         fill(255,0,0);
         textSize(16);
         text('Click the left mouse button to place the cue ball when the cue ball is in the D zone', 120, 80, 600);
         pop();
    } 
    else if(gameMode == 2){
         push();
         noStroke();
         fill(255,0,0);
         textSize(16);
         text('Press "R" to change the placement of the cueball or press "ENTER" to start', 120, 80);
         pop();
    }
    else if(gameMode == 3){
         push();
         noStroke();
         fill(255,0,0);
         textSize(16);
         text('Click on the left mouse button to shoot', 120, 80);
         pop();
    }
    else if(gameMode == 4 && inMotion == false){
         push();
         noStroke();
         fill(255,0,0);
         textSize(16);
         text('Press "ENTER" to shoot again', 120, 80);
         pop();
    }
    
}

function isObjectInMotion(body) {
  var velocity = body.velocity;
  var speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

  // Threshold to consider the object as in motion
  if(speed > 0.005){
      inMotion = true;
  }
  else{
      inMotion = false;
  }
}

function checkIfPocketed(){
  
  //to check if the red ball is pocketed
  for (var i = 0; i < balls.length; i++) {
    var ball = balls[i];
    var ballPos = {x: ball.position.x, y: ball.position.y};

    for (var j = 0; j < pockets.length; j++) {
      var pocket = pockets[j];
      var ballDistance = dist(ballPos.x, ballPos.y, pocket.x, pocket.y);

      if (ballDistance < pocket.diameter/2) {
        counter = 0;
        World.remove(engine.world, ball);
        balls.splice(i, 1);
        break;
      }
    }
  }
    
  //to check if the colored balls are pocketed
  for (var i = 0; i < colorBalls.length; i++) {
    var colBall = colorBalls[i];
    var colBallPos = {x: colBall.position.x, y: colBall.position.y};

    for (var j = 0; j < pockets.length; j++) {
      var pocket = pockets[j];
      var colBallDistance = dist(colBallPos.x, colBallPos.y, pocket.x, pocket.y);

      if (colBallDistance < pocket.diameter/2) {
        counter += 1;
        Matter.Body.setPosition(colBall, prevPosition[i]);
        Body.setVelocity(colBall, { x: 0, y: 0 });
        Body.setAngularVelocity(colBall, 0);
        console.log("col ball is potted");
        if(counter == 2){
            alert("Error! Pocketed 2 Color Balls in a row")
        }
        
        break;
      }
    }
  }
  
  //to check if cueBall is pocketed
if (cueBall) {
    for (var i = 0; i < pockets.length; i++) {
      var pocket = pockets[i];
      var cueBallDistance = dist(cueBall.position.x, cueBall.position.y, pocket.x, pocket.y);

      if (cueBallDistance < pocket.diameter / 2) {
        World.remove(engine.world, cueBall);
        cueBall = null;
        gameMode = 1; 
        alert("Cue Ball has been Pocketed! Place the cue ball back in the D zone");
        break;
      }
    }
  }
    
}


//////////////////////////////////////////////////////////////
function drawStartLines() {
  push();
  stroke(255);
  strokeWeight(1.5);
  line(110 + (tableWidth * 2) / 5, 150, 110 + (tableWidth * 2) / 5, 450);
  noFill();
  arc(110 + (tableWidth * 2) / 5, 300, 100, 100, HALF_PI, PI + HALF_PI);
  pop();
}

function drawPocketHouse() {

  //to draw the yellow pocket housing
  push();
  fill(255, 255, 0);
  rect(95, 145, ballWidth * 4, ballWidth * 4, 10, 0, 0, 0);
  rect(95, 438, ballWidth * 4, ballWidth * 4, 0, 0, 0, 10);
  rect(688, 145, ballWidth * 4, ballWidth * 4, 0, 10, 0, 0);
  rect(688, 438, ballWidth * 4, ballWidth * 4, 0, 0, 10, 0);
  rect(391.5, 145, ballWidth * 4, ballWidth * 2 + 2);
  rect(391.5, 440 + ballWidth, ballWidth * 4, ballWidth * 2 + 2);

  //to draw pockets
  
  for(var i=0; i < pockets.length; i++){
      fill(0);
      ellipse(pockets[i].x, pockets[i].y, pockets[i].diameter);
  }
  pop();

}

function generateCushionWall() {
  var Cushion1Vertices = Vertices.fromPath('0 0 280 0 270 8 10 8'); // top left
  var Cushion2Vertices = Vertices.fromPath('0 0 280 0 270 8 10 8'); // top right
  var Cushion3Vertices = Vertices.fromPath('0 0 280 0 270 -8 10 -8'); // bottom left
  var Cushion4Vertices = Vertices.fromPath('0 0 280 0 270 -8 10 -8'); // bottom right
  var Cushion5Vertices = Vertices.fromPath('0 0 0 274 8 264 8 10'); // left
  var Cushion6Vertices = Vertices.fromPath('0 0 0 274 -8 264 -8 10'); // right
    
  var Cushion1 = Bodies.fromVertices(253, 159, Cushion1Vertices, {isStatic: true, restitution: 2});
  var Cushion2 = Bodies.fromVertices(547, 159, Cushion2Vertices, {isStatic: true, restitution: 2});
  var Cushion3 = Bodies.fromVertices(253, 442, Cushion3Vertices, {isStatic: true, restitution: 2});
  var Cushion4 = Bodies.fromVertices(547, 442, Cushion4Vertices, {isStatic: true, restitution: 2});
  var Cushion5 = Bodies.fromVertices(109, 300.5, Cushion5Vertices, {isStatic: true, restitution: 2});
  var Cushion6 = Bodies.fromVertices(691, 300.5, Cushion6Vertices, {isStatic: true, restitution: 2});
    
  World.add(engine.world, [Cushion1, Cushion2, Cushion3, Cushion4, Cushion5, Cushion6]);
    
  cushions.push(Cushion1);
  cushions.push(Cushion2);
  cushions.push(Cushion3);
  cushions.push(Cushion4);
  cushions.push(Cushion5);
  cushions.push(Cushion6);
}

function drawCushionWall() {
  push();
  noStroke();
  fill(0, 128, 0);
  for (var i = 0; i < cushions.length; i++) {
    drawVertices(cushions[i].vertices);
  }
  pop();
}

function setupWalls() {
  var wall1 = Bodies.rectangle(400, 450, 610, 10, {isStatic: true, restitution: 2}); // bottom wall
  var wall2 = Bodies.rectangle(400, 150, 610, 10, {isStatic: true, restitution: 2}); // top wall
  var wall3 = Bodies.rectangle(100, 300, 10, tableWidth + 10, {isStatic: true, restitution: 2}); // left wall
  var wall4 = Bodies.rectangle(700, 300, 10, tableWidth + 10, {isStatic: true, restitution: 2}); // right wall

  walls.push(wall1);
  walls.push(wall2);
  walls.push(wall3);
  walls.push(wall4);
  World.add(engine.world, [wall1, wall2, wall3, wall4]);
}

function drawWalls() {
  noStroke();
  fill(165, 42, 42);
  for (var i = 0; i < walls.length; i++) {
    drawVertices(walls[i].vertices);
  }
}

function drawCueStick(){
    noStroke();
    fill(255,165,0); // Brown color for the cue stick
    beginShape();
    vertex(200, 2); // Front right point
    vertex(200, -2); // Front left point
    vertex(0, -1); // Back left point
    vertex(0, 1);  // Back right point

    endShape(CLOSE);
}

function drawForceLine() {
    
if (cueBall && gameMode == 3) {
    stroke(255);
    var mouse = createVector(mouseX, mouseY);
    var center = createVector(cueBall.position.x, cueBall.position.y);
    var normal = mouse.copy();
      
    //var direction = p5.Vector.sub(mouse, center);
    var direction = mouse.copy();
    var startPoint = center.copy();
    var direction = direction.sub(center);

    // To draw the cue stick
    direction.normalize();
    startPoint = center.add(direction.mult(20));
    
    //line(startPoint.x, startPoint.y, mouseX, mouseY);
    
    push();
    translate(startPoint.x, startPoint.y);
    rotate(direction.heading());
    
    drawCueStick();
    
//    noStroke();
//    fill(255,165,0); // Brown color for the cue stick
//    beginShape();
//    vertex(200, 2); // Front right point
//    vertex(200, -2); // Front left point
//    vertex(0, -1); // Back left point
//    vertex(0, 1);  // Back right point
//
//    endShape(CLOSE);
    
    //rect(5, -5, 40, 10); // Adjust the rectangle size and position as needed
    pop();
    
    //to draw force line
    mouse.sub(center);
    normal = normal.mult((mouse.mag())*4);
    
    push();
    translate(cueBall.position.x, cueBall.position.y);
      
    line(0, 0, 0 - mouse.x, 0 - mouse.y);
    pop();
    
    //to display strength meter  
    text("strength: " + int(mouse.mag()), 10, 10);
    rect(10, 20, mouse.mag(), 10);
  }
}

///////////////BALL DRAWING/////////////////////////////

//function generateColorBalls(randomize) {
function generateColorBalls() {
    generateYellowBall();
    generateGreenBall();
    generateBrownBall();
    generateBlueBall();
    generatePinkBall();
    generateBlackBall();
}

function drawColorBalls() {
  drawYellowBall();
  drawGreenBall();
  drawBrownBall();
  drawBlueBall();
  drawPinkBall();
  drawBlackBall();
}

function generateCueBall(x, y) {
  if (cueBall) {
    World.remove(engine.world, cueBall);
  }
  cueBall = Bodies.circle(x, y, ballWidth, {restitution: 1, friction: 0.2});
  World.add(engine.world, cueBall);
}

function drawCueBall() {
  push();
  stroke(0);
  fill(255);
  drawVertices(cueBall.vertices);
  pop();
}

function generateYellowBall() {
  if(colRandom == false){
      yellowBall = Bodies.circle(width / 2 - 170, height / 2 + 50, ballWidth, {restitution: 1, friction: 0.2});
    
      var prevPosY = createVector(yellowBall.position.x, yellowBall.position.y);
      prevPosition.push(prevPosY);
      
      colorBalls.push(yellowBall);
      World.add(engine.world, yellowBall);
  }
  else {
      var x = random(120, 680);
      var y = random(170, 430);
      
      yellowBall = Bodies.circle(x, y, ballWidth, {restitution: 1, friction: 0.2});
      
      var prevPosY = createVector(x, y);
      prevPosition.push(prevPosY);
      
      colorBalls.push(yellowBall);
      World.add(engine.world, yellowBall);
  }
}

function drawYellowBall() {
  if (yellowBall) {
    push();
    stroke(0);
    fill(255, 250, 0);
    drawVertices(yellowBall.vertices);
    pop();
  }
}

function generateGreenBall() {
  if(colRandom == false){
      greenBall = Bodies.circle(width / 2 - 170, height / 2 - 50, ballWidth, {restitution: 1, friction: 0.2});
    
      var prevPosG = createVector(greenBall.position.x, greenBall.position.y);
      prevPosition.push(prevPosG);
      
      colorBalls.push(greenBall);
      World.add(engine.world, greenBall);
  }
  else {
      var x = random(120, 680);
      var y = random(170, 430);
      
      greenBall = Bodies.circle(x, y, ballWidth, {restitution: 1, friction: 0.2});
      
      var prevPosG = createVector(x, y);
      prevPosition.push(prevPosG);
      
      colorBalls.push(greenBall);
      World.add(engine.world, greenBall);
  }
}

function drawGreenBall() {
  if (greenBall) {
    push();
    stroke(0);
    fill(0, 100, 0);
    drawVertices(greenBall.vertices);
    pop();
  }
}

function generateBrownBall() {
  if(colRandom == false){
      brownBall = Bodies.circle(width / 2 - 170, height / 2, ballWidth, {restitution: 1, friction: 0.2});
    
      var prevPosBr = createVector(brownBall.position.x, brownBall.position.y);
      prevPosition.push(prevPosBr);
      
      colorBalls.push(brownBall);
      World.add(engine.world, brownBall);
  }
  else {
      var x = random(120, 680);
      var y = random(170, 430);
      
      brownBall = Bodies.circle(x, y, ballWidth, {restitution: 1, friction: 0.2});
     
      var prevPosBr = createVector(x, y);
      prevPosition.push(prevPosBr);
      
      colorBalls.push(brownBall);
      World.add(engine.world, brownBall);
  }
}

function drawBrownBall() {
  if (brownBall) {
    push();
    stroke(0);
    fill(139, 69, 19);
    drawVertices(brownBall.vertices);
    pop();
  }
}

function generateBlueBall() {
  if(colRandom == false){
      blueBall = Bodies.circle(width / 2, height / 2, ballWidth, {restitution: 1, friction: 0.2});
    
      var prevPosBu = createVector(blueBall.position.x, blueBall.position.y);
      prevPosition.push(prevPosBu);
      
      colorBalls.push(blueBall);
      World.add(engine.world, blueBall);
  }
  else {
      var x = random(120, 680);
      var y = random(170, 430);
      
      blueBall = Bodies.circle(x, y, ballWidth, {restitution: 1, friction: 0.2});
      
      var prevPosBu = createVector(x, y);
      prevPosition.push(prevPosBu);
      
      colorBalls.push(blueBall);
      World.add(engine.world, blueBall);
  }
}

function drawBlueBall() {
  if (blueBall) {
    push();
    stroke(0);
    fill(0, 0, 255);
    drawVertices(blueBall.vertices);
    pop();
  }
}

function generatePinkBall() {
  if(colRandom == false){
      pinkBall = Bodies.circle(width / 2 + 140, height / 2, ballWidth, {restitution: 1, friction: 0.2});
    
      var prevPosP = createVector(pinkBall.position.x, pinkBall.position.y);
      prevPosition.push(prevPosP);
      
      colorBalls.push(pinkBall);
      World.add(engine.world, pinkBall);
  }
  else {
      var x = random(120, 680);
      var y = random(170, 430);
      
      pinkBall = Bodies.circle(x, y, ballWidth, {restitution: 1, friction: 0.2});
      
      var prevPosP = createVector(x, y);
      prevPosition.push(prevPosP);
      colorBalls.push(pinkBall);
      World.add(engine.world, pinkBall);
  }
}

function drawPinkBall() {
  if (pinkBall) {
    push();
    stroke(0);
    fill(255, 182, 193);
    drawVertices(pinkBall.vertices);
    pop();
  }
}

function generateBlackBall() {
  if(colRandom == false){
      blackBall = Bodies.circle(width / 2 + 235, height / 2, ballWidth, {restitution: 1, friction: 0.2});
    
      var prevPosBa = createVector(blackBall.position.x, blackBall.position.y);
      prevPosition.push(prevPosBa);
      
      colorBalls.push(blackBall);
      World.add(engine.world, blackBall);
  }
  else {
      var x = random(120, 680);
      var y = random(170, 430);
      
      blackBall = Bodies.circle(x, y, ballWidth, {restitution: 1, friction: 0.2});
      
      var prevPosBa = createVector(x, y);
      prevPosition.push(prevPosBa);
      
      colorBalls.push(blackBall);
      World.add(engine.world, blackBall);
  }
}

function drawBlackBall() {
  if (blackBall) {
    push();
    stroke(0);
    fill(0);
    drawVertices(blackBall.vertices);
    pop();
  }
}

function generateRedBalls(randomize) {
  var ballLoc = [];
  var baseX = width * (3 / 4) - 50;
  var baseY = height / 2;

  if (redRandom == false) {
    for (var i = 0; i < 5; i++) {
      for (var j = -i; j <= i; j += 2) {
        ballLoc.push({x: baseX + ballWidth * 2 * i, y: baseY + ballWidth * j});
      }
    }
  } 
  else {
    for (var i = 0; i < 15; i++) {
      var x = random(120, 680);
      var y = random(170, 430);
      ballLoc.push({x: x, y: y});
    }
  }

  for (var i = 0; i < ballLoc.length; i++) {
    var redX = ballLoc[i].x;
    var redY = ballLoc[i].y;
    var redBall = Bodies.circle(redX, redY, ballWidth, {restitution: 1, friction: 0.4});
    balls.push(redBall);
    console.log(balls);
  }
  World.add(engine.world, balls);
}


function drawRedBalls() {
  push();
  stroke(0);
  fill(255, 0, 0);
  for (var i = 0; i < balls.length; i++) {
    drawVertices(balls[i].vertices);
  }
  pop();
}

// HELPER FUNCTION
function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}

