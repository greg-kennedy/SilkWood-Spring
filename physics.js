//Entire Script copyright 2007 Dexter Kofa/Reflective Layer
// orgin is lower left y rises as one goes up
// orgin is lower left y rises as one goes up
var minX = 0;
var maxX = 800;
var minY = 0;
var maxY = 450;

var scrXmin = 0;
var scrXmax = 800;
var scrYmin = -250;
var scrYmax = 200;
var gravity = -0.25;
var wind = 0;		//wind only blows in x
var airResistance = 0.99;




function physicsObj()
{
  //creates an virtual object that can interact with the world
  //i = object index

  this.parent;
  this.mass = 1;
  this.surface = 1;			//index for relative surface area(used in wind calculation)
  this.heatXfer = 1;			//heat transfer
  this.waterXfer = 1;			//water transfer
  this.friction = 1;
  this.elastic = 0.5;
  this.sound = "";
  this.mStat = false;			//  motion status. if false world skips over object for motion
  this.speedX = 0;			//  pix/sec
  this.speedY = 0;			//  pix/sec
  this.impX = 0;			//impulse force X
  this.impY = 0;			//impulse force Y
  this,impulse = false;			//if true, impulse is currently on
  this.accX = 0;			//  acceleration pix/sec;
  this.accY = 0;			//  cceleration pix/sec;
  this.scaleX;
  this.scaleY;
  this.glide = 0;			//controls if ab onject glids top ground 0=not glide, 1=max glide
  this.direction = 1;			//in radian 0 is horizontal to the left
  this.action = "";			//current action loop function being executed
  this.X = 0;				//position X
  this.Y = 0;				//position Y
  this.width;
  this.height;
  this.oWidth;				//original width
  this.oHeight;				//original height
  this.mTimer;				//timer object for motion
  this.ontheground = false		// if true then physics is still active when speedY < 1
  this.bounce = true;		//if true then object will bounce when it hit the edge of the screen back
  this.active = true;		//if false then phyics wont work
  this.group;			//arbitrary object grouping

  this.init = function()
  {
    this.width = 0;  
    this.height = 0;
    
  }
  
  

  this.stop = function()
  {
    //stops object
    this.active = false;
    this.speedX = 0;			//  pix/sec
    this.speedY = 0;			//  pix/sec
    this.impX = 0;			//impulse force X
    this.impY = 0;			//impulse force Y
    this,impulse = false;			//if true, impulse is currently on
    this.accX = 0;			//  acceleration pix/sec;
    this.accY = 0;			//  cceleration pix/sec; 
    clearTimeout(this.mTimer);
  }
  
  this.setSize = function(w,h)
  {    
    this.parent.imgSrc.style.width = w;
    this.parent.imgSrc.style.height = h;
    this.oWidth = w;
    this.oHeight = h;
    this.width = this.oWidth;
    this.height = this.oHeight;
    this.setPosition(this.X,this.Y);
  }
  
  this.tsyncSize = function()
  {
    //DO NOT USE
    //sync the width of the image to the width,height properties
    
    this.oWidth = this.parent.imgSrc.offsetWidth;  
    this.oHeight = this.parent.imgSrc.offsetHeight;
    this.width = this.oWidth;
    this.height = this.oHeight;
  }
  
  this.scale = function(x,y)
  {
    //scales graphic image of object
    this.scaleX = x;
    this.scaleY = y;
    this.width = this.oWidth * this.scaleX;
    this.height = this.oHeight * this.scaleY;
    this.parent.imgSrc.style.width = this.width;  
    this.parent.imgSrc.style.height = this.height;

    this.setPosition(this.X,this.Y);
  }

  this.setImpulse = function(f,d)
  {
    // give object force f for d duration in mSec
    var x,y;
    this.impX = (Math.cos(this.direction) * f)/this.mass;
    this.impY = (Math.sin(this.direction) * f)/this.mass;
    
    this.accX = this.impX;
    this.accY = this.impY;
    this.impulse = true;
    setTimeout(this.parent.obj + '.physics.endImpulse()',d)
  }

  this.setImpulseX = function(f,d)
  {
    // give object force f for d duration in mSec
    var x;
    this.impX = f/this.mass;
    
    this.accX = this.impX;
    setTimeout(this.parent.obj + '.physics.accX=0',d)
  }

  this.setImpulseY = function(f,d)
  {
    // give object force f for d duration in mSec
    var y;
    this.impY = f/this.mass;
    
    this.accY = this.impY;
    setTimeout(this.parent.obj + '.physics.accY=0',d)
  }
  
  
  this.endImpulse = function()
  {
     //restore accX, accY  to non-impulse level
    this.accX = 0;
    this.accY = 0;
    this.impulse = false;
  }
  
  
  
  this.setSpeed = function(s)
  {
    this.speedX = Math.cos(this.direction) * s;
    this.speedY = Math.sin(this.direction) * s;
  }
  
  
  this.setForce = function(f)
  {
    //gives object f;
    this.accX = (Math.cos(this.direction) * f)/this.mass;
    this.accY = (Math.sin(this.direction) * f)/this.mass;
  }


  this.setPosition = function(x,y)
  {
    //position object location x,y
    this.X = x;
    this.Y = y;
    this.parent.imgSrc.style.left = this.X;
    this.parent.imgSrc.style.top = XlateCoord(this.Y + this.height);
  }


  this.move = function()
  {

   if(this.active)
   {
    //starts physics routine. Moves object thru space
    var maxL;
    this.speedX += this.accX + wind;
    this.speedX *= airResistance;
    maxL = maxY - this.height;
    if(this.speedY < 0)
    {
      this.speedY += this.accY + gravity + this.glide;
    }else
    {
      this.speedY += this.accY + gravity;    
    }
    
    this.X += this.speedX;
    this.Y += this.speedY;
   if(this.bounce)
   {
    
    if(this.Y < 0 && this.group == "leaves")
    {
        windGust(this.parent.index);
        return;
    }
   
    if(this.Y < minY)
    {
      if(this.group != "leaves")
      {
        silk.command.comNextPhase = "badResult";
        silk.command.cont();
      }
      return;
      
       //this.Y = minY + (minY-this.Y)  * this.elastic ;
       //this.speedY = this.speedY * -1 * this.elastic;
    }else if(this.Y > maxL)
    {
      this.Y = maxL - (this.Y - maxL);
      this.speedY = this.speedY * -1 * this.elastic;
    
    }
    
    if(this.X < minX)
    {
      if(this.group != "leaves")
      {
        this.X = minX + (minX-this.X);
        this.speedX = this.speedX * -1 * this.elastic;
      }
    }else if(this.X > maxX - this.width)
    {    
      if(this.group != "leaves")
      {
        this.X = maxX - (maxX-this.X);
        this.speedX = this.speedX * -1 * this.elastic;    
      }
    }
   }
    
//statDiv.innerText =  creatureArray[0].bombyx.physics.speedX;
    this.parent.imgSrc.style.left = this.X;  
    this.parent.imgSrc.style.top = XlateCoord(this.Y + this.height);  

      this.mTimer = setTimeout(this.parent.obj + '.physics.move()',40);
    
    if(colDetect() && this.bounce && this.group != "leaves")
    {
      clearTimeout(this.mTimer);
      collisionAction();
    }
    
  }
 }
}

function worldToScr(y,io)
{
  //convert y world coord. to screen coord
  //io = image object. uses the offset height yo position correctly
  if(io == null)
  {
    return 200 - y;
  }else
  {
    return 200 - y - parseInt(io.style.height);
  }

}

function srcToWorld(y,io)
{
  //convert y screen coord. to World coord
  //io = image object. uses the offset height yo position correctly
  if(io == null)
  {
    return 200 - y;
  }else
  {
    return 200 - y - parseInt(io.style.height);
  }

}

function XlateCoord(y)
{
  //convert y world coord. to screen coord
  
  return 200 - y;

}

function degreeRadian(a)
{
  //converts degree into radian
  return a * 0.0174539;

}

