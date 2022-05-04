//Entire Script copyright 2007 Dexter Kofa/Reflective Layer
var animationMasterStop = false;
var animationID;	//id for the instance of the anmation object;
var motionID;

function animation(n)
{
  //n name of instance of this object
  this.id = animationID;
  animationID++;
  this.currentFrame = 0;
  this.actualFrame = 0;		//the current frame that's playing taking into account the Reverse option.
  this.startFrame = 0;
  this.endFrame;
  this.frameRate = 8;
  this.defaultFrameRate = 8;
  this.frameDelay;
  this.animationMode;
  this.endMode;
  this.loopCount = -1;
  this.loop = 0;			//number of time loop has executed
  this.timerObj = null;
  this.state = "stop";
  this.src;
  this.srcObj;
  this.name = n;
  this.endCallBack = "";		//Callback function when animation is done;  
  this.reverse = false;			//animation direction
  this.adv = 1;				//number of images to advance per frame

  this.init = function()
  {

  }
  
  
  this.start = function()
  {
    if(silkIsPaused)
    {
      return;
    }
    this.stop();		//First stop any running animation;
    this.loop = 0;
    if(this.endFrame < this.startFrame)
    {
       //set for reverse
      this.currentFrame = this.endFrame;
      this.endFrame = this.startFrame;
      this.startFrame = this.currentFrame;
      this.reverse = true;
    }
    if(this.animationMode != "cont")
    {
      this.currentFrame = this.startFrame;
    }
    this.frameDelay = 1000/this.frameRate;
    this.timerObj = setInterval( this.name + ".animate()",this.frameDelay);
    this.state = "animate";
    this.srcObj.style.display ="block";
  }
  
  
  this.animate = function()
  {

    if(!animationMasterStop)
    {
      if(this.currentFrame > this.endFrame)
      {
        this.currentFrame = this.startFrame;
        if(this.loopCount != -1)
        {
          this.loopCount--;
          if(this.loopCount > 0)
          {
          }else
          {
            this.stop();
            eval(this.endCallBack);
            return;
          }
        }
        this.loop++;
      
      }
      if(this.reverse)
      {
        this.actualFrame = this.endFrame - this.currentFrame; 
      }else
      {
        this.actualFrame = this.currentFrame; 
      }

      this.srcObj.src = this.src + decFixedWidth(this.actualFrame,4) + ".png";
      this.currentFrame+=this.adv;
    }else
    {

    }
  }
  
  this.pause = function()
  {
    clearInterval(this.timerObj);    
  }
  
  this.cont = function()
  {
    this.animate();
  }
  
  this.stop = function()
  {
    clearInterval(this.timerObj);
    this.state = "stop";
    this.reverse = false;
  }
 
  this.reset = function()
  {
    //stops and putsanimation to frame first
    clearInterval(this.timerObj);
    this.state = "stop";
    this.reverse = false;
    this.srcObj.src = this.src + decFixedWidth(this.startFrame,4) + ".png";
  }
 
}



function animationStop()
{
  //stop all animations
}



function animationFreeze()
{
  //  stop/pause all animations
  animationMasterStop = true;

}



function animationUnfreeze()
{
  //restore all animations
  animationMasterStop = false;
}


//***************************************************************************
function motionControl(n)
{
  //n name of instance of this object
  this.id = animationID;
  this.isActive = false;
  this.endCallBack = "";		//Callback function when animation is done;  
  animationID++;
  this.object = null;
  this.speed = 2;    //    pixel/sec
  this.frameDelay = 66;
  this.startX = 300;
  this.startY = -40;
  this.curX = 300;
  this.curY = -40;
  this.endX;
  this.endY;
  this.dirX;     //true  = right movement   false = left movement
  this.dirY;     //true  = down movement   false = up movement
  this.timerObj = null;
  this.name = n;
  
  this.moveTo = function(x,y)
  {
    if(silkIsPaused)
    {
      return;
    }
    //moves object from currentlocation to x,y screen coord.
    this.stop();
    this.dirX = true;
    this.dirY = true;
    this.endX = x;
    this.endY = y;
    this.curX = this.startX;
    this.curY = this.startY;
    if(this.startX == this.endX && this.startY == this.endY)
    {
       clearInterval(this.timerObj);
       this.startX = this.endX;
       this.startY = this.endY;
       eval(silkMover.endCallBack);
       return;
    }
    
    if(this.endX < this.startX)
    {
      this.dirX = false;
    }

    if(this.endY < this.startY)
    {
      this.dirY = false;
    }
    
    this.isActive = true;
    this.timerObj = setInterval( this.name + ".animate()",this.frameDelay);
  }
    
  
  this.animate = function()
  {
     //main animation loop
     if(this.dirX)
     {
       this.curX = Math.min(this.curX + this.speed,this.endX);
     }else
     {
       this.curX = Math.max(this.curX - this.speed,this.endX);
     }
     
     if(this.dirY)
     {
       this.curY = Math.min(this.curY + this.speed,this.endY);
     }else
     {
       this.curY = Math.max(this.curY - this.speed,this.endY);
     }

     this.object.style.left = this.curX;
     this.object.style.top = this.curY; 
     silk.X = this.curX;
     silk.Y = this.curY;
     
     if(this.curX == this.endX && this.curY == this.endY)
     {
       clearInterval(this.timerObj);
       this.isActive = false;
       this.startX = this.endX;
       this.startY = this.endY;
       eval(silkMover.endCallBack);
       
     }
             
  }

  this.stop = function()
  {
     clearInterval(this.timerObj);
     this.startX = this.curX;
     this.startY = this.curY;
     this.isActive = false;
  }


  this.pause = function()
  {
    clearInterval(this.timerObj);  
  }

  this.cont = function()
  {
      if(this.curX != "undefined")
      {
        this.timerObj = setInterval( this.name + ".animate()",this.frameDelay);
      }
  }


}


