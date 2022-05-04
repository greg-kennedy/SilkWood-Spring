//Entire Script copyright 2007 Dexter Kofa/Reflective Layer
function actionObject()
{
  this.action = null;
  this.fSpeed = 8;		//frame speed
  this.type = "movie";		//movie or code
  this.level = 4;		//action only happen when level is equal or lowe than action limit
  this.isRunning = false;
  this.caller = null;		//command that clled this action
  this.v1;			//general purpose variables
  this.v2;
  this.v3 = 0;			//also used by the walk routine
  this.pauseLevel;
  this.pauseAction;
  
  
  this.frameset = new framsetObject();

  this.init = function()
  {
     silkMover.object = document.getElementById("silkDiv");
     silkMover.endCallBack = "silk.action.endOfMotion()";
  }
  
 //************************* ACTION BEHAVIOURS ******************************
 
 //====================== WALK =============================
 this.ab_walk = function()
 {
   silk.imgDiv.style.top = worldToScr(silk.floor,silk.imgDiv);   //set to walk height
   this.walk();
 }
 
 this.walk = function()
 {

   //continuation of walk
   //this.v1 = x;
   //this.v2 = y;
   this.type = "movement";
   if(!frontDispOpen)
   {
     frontDisplay.style.display = "block";
   }
   if(this.v1 == silk.getX() && this.v2 == silk.getY())
   {
     if(!frontDispOpen)
     {
       frontDisplay.style.display = "none";
     }
     this.isRunning = false;
     silk.floor = silk.getY();
     silk.command.cont();
     return;
   }else
   {
     if(!frontDispOpen)
     {
       frontDisplay.style.display = "none";
     }
     if(silk.isSick)
     {
       if(silk.diseaseIndex == 0)
       {
         silk.walkMode = "frozenWalk";     
       }else if(silk.diseaseIndex == 1)
       {
         silk.walkMode = "burnedWalk";            
       }
     }else if(silk.hasBasket)
     {
       silk.walkMode = "basketWalk";
     }else if(silk.hasCart)
     {
       silk.walkMode = "cartWalk";
     }else
     {
       silk.walkMode = "walk";
     }
     if(this.v2 != silk.getY())
     {
        if(silk.getX() == silkWood.leftShaft)
        {
          oY = worldToScr(this.v2,silk.imgDiv);
          this.load(this.level,"climb");
          if(silk.hasBasket)
          {
            frameAnimation.src = "action/basketClimb/silk";
          }
          silkMover.moveTo(silk.getX(),oY);
          syncDisplay(oY);
        }else
        {
          if(silkWood.leftShaft < silk.getX())
          {
            silk.walkDir = "Left";
          }else
          {
             silk.walkDir ="Right";          
          }
          this.load(this.level,"walk");
          frameAnimation.src = "action/" + silk.walkMode + silk.walkDir + "/silk";
          silkMover.moveTo(silkWood.leftShaft,worldToScr(silk.getY(),silk.imgDiv) );
        }
     }else
     {
        if(this.v1 < silk.getX())
        {
          silk.walkDir = "Left";
        }else
        {
           silk.walkDir ="Right";          
        }
        this.load(this.level,"walk");
        frameAnimation.src = "action/" + silk.walkMode + silk.walkDir + "/silk";
        silkMover.moveTo(this.v1,silk.Y);
     }


   }
   //setTimeout('animator.animate()',100);     //moves object to x1,y1   
 }
 //====================== STANDING =============================
 this.ab_standing = function()
 {
 
 }
 //====================== Throw =============================
 this.ab_swingArm = function()
 {

 }
 //====================== Throw Left =============================
 this.ab_swingArmLeft = function()
 {

 }
 //====================== DANCE =============================
 this.ab_dance = function()
 {

 }
 //====================== MAD =============================
 this.ab_mad = function()
 {
 
 }
 //====================== MAD 2 =============================
 this.ab_mad2 = function()
 {
 
 }
 //====================== SAD =============================
 this.ab_sad = function()
 {
 
 }
 //====================== HAPPY =============================
 this.ab_special = function()
 {
 
 }
 //====================== HAPPY =============================
 this.ab_happy = function()
 {
 
 }
 //====================== VERY HAPPY  =============================
 this.ab_veryHappy = function()
 {
 
 }
 //====================== SITTING RIGHT =============================
 this.ab_sittingRight = function()
 {
     silk.imgDiv.style.top = worldToScr(silkWood.home.chair_y + silk.sitHeight,silk.imgDiv);  
 }
 //====================== SITTING =============================
 this.ab_sitting = function()
 {
     silk.imgDiv.style.top = worldToScr(silkWood.home.chair_y + silk.sitHeight,silk.imgDiv);  
 }
 //====================== CONVERT TO SICK =============================
 this.ab_convertToSick = function()
 {
 
 }
 //====================== CONVERT TO SICK =============================
 this.ab_convertToSick2 = function()
 {
 
 }
 //====================== SICK SLEEP =============================
 this.ab_sickSleep = function()
 {
 
 }
 //====================== PAIN SLEEP =============================
 this.ab_painSleep = function()
 {
 
 }
 //====================== SWEATING =============================
 this.ab_sweating = function()
 {
 
 }
 //====================== SHIVERINNG =============================
 this.ab_shivering = function()
 {
 
 }
  //====================== DIG =============================
 this.ab_alignLeft = function()
 {
 
 }
  //====================== MAKTAR =============================
 this.ab_maktar = function()
 {
 
 }
  //====================== DIG =============================
 this.ab_dig = function()
 {
 
 }
 //====================== PUMP WATER =============================
 this.ab_pumpWater = function()
 {
   setTimeout('handPumpImg.style.display = "none"',200);
 }
  //====================== PICKAXE =============================
 this.ab_pickaxe = function()
 {
 
 }
  //====================== BUBBLES =============================
 this.ab_bubbles = function()
 {
 
 }
  //====================== MEDITATE =============================
 this.ab_meditate = function()
 {

 }
  //====================== RESEARCH =============================
 this.ab_research = function()
 {

 }
  //====================== START GAZING =============================
 this.ab_stargazing = function()
 {

 }
  //====================== CHISEL =============================
 this.ab_chisel = function()
 {
 
 }
  //====================== HAMMER FLOOR =============================
 this.ab_hammerFloor = function()
 {
 
 }
  //====================== GATHER WOOD =============================
 this.ab_gatherWood = function()
 {
 
 }
  //====================== GATHER FOOD =============================
 this.ab_gatherFood = function()
 {
 
 }
  //====================== DUMP =============================
 this.ab_dump = function()
 {
 
 }
  //====================== EAT =============================
 this.ab_eat = function()
 {
 
 }
  //====================== CHAIR DANCE =============================
 this.ab_chairDance = function()
 {
 
 }
  //======================  DUMB BELL (exercise1) =============================
 this.ab_dumbBell = function()
 {
 
 }
  //======================  JUMPING JACK (exercise2) =============================
 this.ab_jumpJack = function()
 {
 
 }
  //====================== READ BOOK =============================
 this.ab_readBook = function()
 {
 
 }
  //====================== SLEEP =============================
 this.ab_sleep = function()
 {
 
 }
  //====================== TAKE BASKET =============================
 this.ab_takeBasket = function()
 {
    setTimeout('silkWood.basket.take()',700);
 }
  //====================== DROP BASKET =============================
 this.ab_dropBasket = function()
 {
    setTimeout('silkWood.basket.drop(' + this.v1 + ',' + this.v2 + ')',3000 );
 }
  //====================== UNLOAD BERRIES=============================
 this.ab_unloadBerries = function()
 {
    if(silkWood.basket.content == "Berries")
    {
      silkWood.foodPile.addFood(silkWood.basket.unload() );		//tranfer and clear food basket
    }else
    {
      silkWood.basket.unload();
    }
    setTimeout("silk.command.cont()",100);   
 }
 //**************************************************************************
  this.load = function(l,fs)
  {
    //plays frameset fs(string), l = access level;
    if(l <= silk.minAccess)
    {
      var f;
      this.action = fs;
      this.level = l;
      f = this.frameset[fs];
      frameAnimation.srcObj = document.getElementById("silkImg");
      frameAnimation.src = "action/" + f.src + "/silk";
      frameAnimation.startFrame = f.startFrame;
      frameAnimation.endFrame = f.endFrame;
      frameAnimation.loopCount = f.loopCount;
      frameAnimation.endCallBack = "silk.action.endOfAction()";
      frameAnimation.frameRate = f.frameRate;
      silk.energyConRate = f.energy * silk.defaultMotionEnergy;
      soundMan.play(f.sound,"silk");
    }
  }
  
  this.loadCode = function(l,c)
  {
    //plays frameset c(string), l = access level;
    if(l <= silk.minAccess)
    {
          
    }
  }

  this.setSpeed = function(s)
  {
    frameAnimation.frameRate = s;  
  }

  this.setLoopCount = function(l)
  {
    frameAnimation.loopCount = l;  
  }
  
  this.play = function(x,y)
  {

    //x,y  = offset to place Elder when executing action
    if(this.level <= silk.minAccess)
    {
      actionActive = true;
      silk.action["ab_" + this.action]();
      if(frameAnimation.src != "codeOnly")
      {
        frameAnimation.start();
        if(x != undefined && y != undefined)
	{
         setTimeout('silk.moveTo(' + (silk.getX() + x) + ',' + (silk.getY() + y) + ')',200);	
	}
        this.isRunning = true;
      }
    }
  }

  this.stop = function()
  {
    if(this.level <= silk.minAccess)
    {
      actionActive = false;
      frameAnimation.stop();
      this.isRunning = false;
    }
  }
  
  this.pause = function()
  {
    if(this.level <= silk.minAccess)
    {
      frameAnimation.stop();
      this.isRunning = false;
    }
  }
  
  this.cont = function()
  {
    if(this.level <= silk.minAccess)
    {
      frameAnimation.start();
      this.isRunning = true;
    }    
  }
  
  

  this.endOfAction = function()
  {
    if(actionActive)
    {
      silk.command.cont();
    }
  }

  this.endOfMotion = function()
  {
    if(actionActive)
    {
      silk.action.walk();
    }
  }
}


