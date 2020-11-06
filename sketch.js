var START=10;
var PLAY=1;
var END=0;
var gameState=START;
var score=0;
var edge;
var left,leftI;
var right,rightI;
var play,playI;
var blue,blueI;
var red,redI;
var tap,tapI;
var scene,backgroundI;
var ground,groundI;
var bird,birdI;
var pipeUp,pipeUpI,pipeUpG;
var pipeDown,pipeDownI,pipeDownG;
var gameOverI,gameOver;

function preload(){
  
  backgroundI=loadImage("backAir.jpg");
  
  groundI=loadImage("realGround.png");

  leftI=loadImage("leftArrow.png");
  rightI=loadImage("rightArrow.png");
  
  birdI=loadImage("yellowBird.png");
  redI=loadImage("redBird.png");
  blueI=loadImage("blueBird.png");

  gameOverI=loadImage("RealgameOver.png");
  
  pipeUpI=loadImage("pipe1(down).png");
  pipeDownI=loadImage("pipe1.png");

  jumpSound=loadSound("Super Mario Jump.mp3");

  playI=loadImage("play.png");
  
//====================================================================//
//                           END PRELOAD                              //
//====================================================================//
}

function setup() {
  createCanvas(700,700);
  edge=createEdgeSprites();
  
  scene=createSprite(710,250,20,20);
  scene.addImage("scene",backgroundI);
  scene.scale=3;
  //scene.velocityX=-2;
  
  ground=createSprite(740,670,30,30);
  ground.addImage(groundI);
  ground.scale=2.2;
  
  
  
  bird=createSprite(350,200,20,20);
  bird.addImage("yellow",birdI);
  bird.addImage("blue",blueI);
  bird.addImage("red",redI);
  bird.scale=0.08;
  //bird.debug=true;
  bird.setCollider("circle",-100,-100,300);

  left=createSprite(225,400,20,20,20);
  left.addImage(leftI);
  left.scale=0.2;

  right=createSprite(475,400,30,30);
  right.addImage(rightI);
  right.scale=0.2;

  play=createSprite(350,400,40,40);
  play.addImage(playI);
  play.scale=0.1;
  
  gameOver=createSprite(350,300,30,30);
  gameOver.addImage(gameOverI);
  gameOver.scale=0.7;
  

  //GROUPS
  pipeUpG=createGroup();
  pipeDownG=createGroup();
  
  
  
//====================================================================//
//                              END SETUP                             //
//====================================================================//
}


function draw() {
  background(400);
  
  Pipes();
  
    if (gameState===START){
      gameOver.visible=false;

      left.visible=true;
      right.visible=true;

      bird.velocityY=0;
      ground.velocityX=0;
      pipeUpG.setVelocityXEach(0);
      pipeDownG.setVelocityXEach(0);

      if (mousePressedOver(left)){
       bird.changeAnimation("blue",blueI)
       bird.scale=0.2;
       //bird.debug=true;
       bird.setCollider("circle",20,0,130);
      }
      if (mousePressedOver(right)){
        bird.changeAnimation("red",redI);
        bird.scale=0.1;
        //bird.debug=true;
        bird.setCollider("circle",20,0,250);
      }
      if (touches.length>0 || keyDown("SPACE") || mousePressedOver(play)){
        gameState=PLAY;
        touches=[];
      }


    }else if (gameState===PLAY){
    
    Score();

    bird.collide(edge[2]);

    left.visible=false;
    right.visible=false;
    play.visible=false;

    gameOver.visible=false;
    ground.velocityX=-6;
    //BIRD VELOCITY
    if (touches.length<1 || keyWentDown("SPACE") || mousePressedOver(scene) || mousePressedOver(ground)){
      bird.velocityY=-15;
      jumpSound.play();
      touches=[""];
    }
    bird.velocityY+=1.5;
  
    //INFINITIVE GROUND
    if (ground.x<=0){
      ground.x=740;
    }
      
    if (bird.isTouching(pipeUpG) || bird.isTouching(pipeDownG) || bird.isTouching(ground)){
      gameOver.visible=true;
      gameState=END;
    }
      
 //IF I COMMENT LINE 93 TO 95 THE UPPER PIPES ARE DISPLAYED BUT BY NOT COMMENTING THESE LINES THEY ARE NOT DISPLAYED.
  
  
  } else if (gameState === END) {
      bird.velocityY=0;
      pipeUpG.setVelocityXEach(0);
      pipeUpG.setLifetimeEach(-1);
      pipeDownG.setVelocityXEach(0);
      pipeDownG.setLifetimeEach(-1);
      ground.velocityX=0;

      left.visible=false;
      right.visible=false;
      play.visible=false;
      
      if (mousePressedOver(gameOver) || touches.length<0){
        touches=[""];
        bird.y=300;
        Reset();
      }

  }
   
  drawSprites();
  
  console.log(gameState);
  
  fill("white");
  textSize(80);
  stroke("black");
  strokeWeight(7);
  text(score,340,120);
//====================================================================//
//                              END DRAW                              //
//====================================================================//
}

function Reset(){
  score=0;
  frameCount=0;
  pipeUpG.destroyEach();
  pipeDownG.destroyEach();
  gameState=PLAY;
}

function Pipes(){
  
  if (frameCount%100===0){
    pipeUp=createSprite(800,200,30,30);
    pipeUp.addImage(pipeUpI);
    pipeUp.scale=0.7;
    pipeUp.velocityX=-6;
    pipeUpG.add(pipeUp);
    pipeUp.lifetime=150;
    //pipeUp.debug=true;
    pipeUp.setCollider("rectangle",0,0,160,480);
    
    console.log(pipeUp.x);
  
    pipeDown=createSprite(800,400,40,40);
    pipeDown.addImage(pipeDownI);
    pipeDown.scale=0.7;
    pipeDown.velocityX=-6;
    pipeDownG.add(pipeDown);
    pipeDown.lifetime=150; 
    //pipeDown.debug=true;
    pipeDown.setCollider("rectangle",0,0,160,480);
    
    pipeDown.y=Math.round(random(400,600));

    pipeUp.x=pipeDown.x;
    
    pipeUp.y=pipeDown.y-500;
    
    ground.depth=pipeDown.depth;
    ground.depth+=1;
    
    bird.depth=pipeUp.depth;
    bird.depth=pipeDown.depth;
    bird.depth+=1;

    gameOver.depth=pipeUp.depth;
    gameOver.depth=pipeDown.depth;
    gameOver.depth+=1;
    //ground.debug=true;
  }
  
//====================================================================//
//                              END PIPES                             //
//====================================================================//
}

function Score(){
  if (frameCount===180){
    score+=1;
  }
  if (frameCount>200){
    if (frameCount%96===0){
      score+=1;
    }
  }
//====================================================================//
//                              END SCORE                             //
//====================================================================//
}
