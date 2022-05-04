var butterArray = new Array(5);
var chickenArray = new Array(10);
var plantArray = new Array(20);
var leavesArray = new Array(20);
var plantActive = 0;
var plantMax = 0;
var plantWxStat = false;	//true if weather condition is good
var chickenEnter = false;
var chickenActive = 0;	//number of chickens currently on screen
var chickenBirthCounter = 0;
var chickenMax = 1;
var chickenWxStat = false;	//true if weather condition is good
var bioTimer;
var butterActive = 0;	//number of butterfly currently on screen
var butterSpecial = 0;	//special var used by butterfly manager
var butterWxStat = false;	//true if weather condition is good
var waterLevel = 0;
var flowerCount;

			//     0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3
var butterSchedule = new Array(0,0,0,0,0,0,1,2,3,3,3,4,4,5,5,4,3,3,3,2,1,0,0,0);

function leafObj(n)
{
  this.obj = n;
  this.physics = new physicsObj();
  this.physics.parent = this;
  this.physics.bounce = true;
  this.physics.group = "leaves";
  this.physics.glide = 0;
  this.physics.direction = degreeRadian(0);
  


  this.index;				//index in array
  this.isActive = true;
  this.imgSrc = document.createElement("img");
  this.imgSrc.style.position = "absolute";
  this.imgSrc.style.width = 38;
  this.imgSrc.style.height = 31;
  this.positionX = 0;
  this.positionY = 0;
  this.imgSrc.style.left = this.positionX;
  this.imgSrc.style.top = this.positionY;
  this.imgSrc.style.zIndex = 8;
  this.imgSrc.src = "animation/leaves/leaf_" + Math.floor(Math.random()*3) + ".png";
  frontDisplay.appendChild(this.imgSrc);

}

function plantObj()
{
  this.isActive = true;
  this.state = "seed";
  this.stage = 0;
  this.imgSrc = document.createElement("img");
  this.imgSrc.style.position = "absolute";
  this.imgSrc.style.width = 160;
  this.imgSrc.style.height = 120;
  this.positionX = 105;
  this.positionY = Math.round(Math.random() * 30 + 70);
  this.imgSrc.style.left = this.positionX;
  this.imgSrc.style.top = this.positionY;
  this.imgSrc.style.zIndex = 8;
  this.imgSrc.src = "animation/grow/grow0000.png";
  frontDisplay.appendChild(this.imgSrc);
  

  this.update = function()
  {
  
  
    if(this.isActive)
    {
     switch(this.state)
     {
        case "grow":
        this.stage = Math.min(80,this.stage+1);
        this.imgSrc.src = "animation/grow/grow" + decFixedWidth(this.stage,4) +".png";
        if(this.stage == 80)
        {
          this.state = "flower";
        }
       break;      
        case "flower":
        this.stage = 80;
        this.imgSrc.src = "animation/grow/grow" + decFixedWidth(this.stage,4) +".png";
       break;      
        case "flowerDeath":
        this.stage = Math.min(120,this.stage+1);
        this.imgSrc.src = "animation/grow/dead_flower" + decFixedWidth(this.stage,4) +".png";
        if(this.stage == 120)
        {
          this.stage = 0;
          this.state = "seed";
        }
       break;      
        case "bulbDeath":
        this.stage = Math.min(45,this.stage+1);
        this.imgSrc.src = "animation/grow/dead_bulb" + decFixedWidth(this.stage,4) +".png";
        if(this.stage == 45)
        {
          this.stage = 0;
          this.state = "seed";
          plantMax--;
        }
       break;      
     }
    }
  
   
  }

}

function chickenObj(n)
{
  this.obj = n;
  this.walkType = "exit";
  this.isWalking = false;
  this.target = 0;
  this.atTarget = false;
  this.imgSrc = document.createElement("img");
  this.imgSrc.style.position = "absolute";
  this.imgSrc.style.width = 20;
  this.imgSrc.style.height = 21;
  this.imgSrc.style.left = 0;
  this.imgSrc.style.top = 0;
  this.imgSrc.style.zIndex = 1;
  this.imgSrc.style.display = "none";

  frontDisplay.appendChild(this.imgSrc);

  this.anim = new animation(this.obj + ".anim");
  this.anim.init();
  this.anim.endFrame = 46;
  this.anim.frameRate = 5 + Math.random() * 3;
  this.anim.src = "animation/chicken/chicken";
  this.anim.srcObj = this.imgSrc;
  this.anim.start();
  
  this.x = 0;
  this.y = 0;
  this.z = 0;

  this.startWalk = function()
  {
     //start chicken walking
    this.anim.start();
    this.isWalking = true;
    this.walkType = "normal";
    this.atTarget = false;
    this.target = Math.random() * 300;
  }

  this.sleep = function()
  {
    //walk chicken out ofscene.

    this.target = 30;
    this.atTarget = false;
    this.walkType = "exit";
  }

  this.setPosition = function(x,z)
  {
    //sets postiion in screen coordinates(370 = max x)
    this.x = x;
    this.z = z;
    this.imgSrc.style.left = this.x + 50;
    switch(z)
    {
      case 0:
       this.imgSrc.style.width = 12;
       this.imgSrc.style.height = 11;
       this.imgSrc.style.top = 130;
      break;
      case 1:
       this.imgSrc.style.width = 18;
       this.imgSrc.style.height = 17;
       this.imgSrc.style.top = 135;
      break;
      case 2:
       this.imgSrc.style.width = 24;
       this.imgSrc.style.height = 22;
       this.imgSrc.style.top = 140;
      break;
    }
  }  
/*  
  this.moveTo = function(x,s)
  {
    //moves to postiion x at rate of s per call; returns false if not at target
    var dx;
    tx = x - this.x;
    this.x = Math.min(430,Math.max(0,this.x+s) );
    this.imgSrc.style.left = this.x + 50;
    
    if((tx > 0 && this.x > x) || (tx < 0 && this.x < x) || tx == 0)
    {
      return true;
    }else
    {
      return false;
    }
  }  

*/
  this.moveBy = function(x,z)
  {
    //sets postiion in screen coordinates(300 = max x)
    this.x = Math.round(Math.min(300,Math.max(0,this.x+x) ) );
    this.z =  Math.round(Math.min(2,Math.max(0,this.z+z) ) );
    this.imgSrc.style.left = this.x + 50;
    switch(this.z)
    {
      case 0:
       this.imgSrc.style.width = 12;
       this.imgSrc.style.height = 11;
       this.imgSrc.style.top = 130;
      break;
      case 1:
       this.imgSrc.style.width = 18;
       this.imgSrc.style.height = 17;
       this.imgSrc.style.top = 135;
      break;
      case 2:
       this.imgSrc.style.width = 24;
       this.imgSrc.style.height = 22;
       this.imgSrc.style.top = 140;
      break;
    }
  }  
}


function butterflyObj(n)
{
  this.obj = n;
  this.physics = new physicsObj();
  this.physics.parent = this;
  this.physics.bounce = false;
  this.flightType = "exit";
  this.isFlying = true;
  this.timer1;				//general timer object
  this.counter1 = 0;			//general counter
  this.counter2 = 0;			//general counter
  this.physics.glide = 0.08;
  this.targetX = 480;				//destination to fly
  this.targetY = 60;
  this.targetValid = false;		//valdity of the targetX and targetY
  this.physics.direction = degreeRadian(90);

  this.imgSrc = document.createElement("img");
  this.imgSrc.style.position = "absolute";
  this.imgSrc.style.width = 20;
  this.imgSrc.style.height = 21;
  this.imgSrc.style.left = 0;
  this.imgSrc.style.top = 0;
  this.imgSrc.style.zIndex = 9;

  frontDisplay.appendChild(this.imgSrc);

  this.anim = new animation(this.obj + ".anim");
  this.anim.init();
  this.anim.endFrame = 7;
  this.anim.frameRate = 30;
  this.anim.src = "animation/butterfly/butterfly_1R";
  this.anim.srcObj = this.imgSrc;



  this.flightControl = function()
  {
    //provides flight control
    //If TRUE the creature accelarated upward at +1
    //else if moves acording to gravity;
    var dx,dy;
    
    this.counter1++;
    if(this.counter1 > 3)
    {

      if(this.physics.Y < this.targetY && this.physics.speedY < 2)
      {
       this.physics.setImpulseY(2,100);      
      }

      if(this.physics.speedY < -2)
      {      
       this.physics.setImpulseY(2,100);          
      }
      
      if(this.physics.X > this.targetX)
      {
        if(Math.abs(this.physics.speedX) < 2)
        {
          this.physics.setImpulseX(Math.random() * -1,100);      
        }
      }else
      {
        if(Math.abs(this.physics.speedX) < 2)
        {
          this.physics.setImpulseX(Math.random() * 1,100);      
        }      
      }
      
      if(this.physics.speedX > 0)
      {
         this.anim.src = "animation/butterfly/butterfly_1R";
      }else
      {
         this.anim.src = "animation/butterfly/butterfly_1L";
      }
      this.counter1 = 0;
    }
    
    if(this.physics.X > (this.targetX-10) && this.physics.X < (this.targetX+10) && this.physics.Y > this.targetY && this.physics.Y < (this.targetY+10))
    {
      if(this.flightType == "normal")
      {
         this.timer1 = setTimeout(this.obj + '.flightControl()', 150);         
      }else
      {
        this.stopFlight();
      }
    }else
    {
      this.timer1 = setTimeout(this.obj + '.flightControl()', 150);   
    }
    

  }
  
  
  this.startFlight = function()
  {
     //start butterfly flying
    this.anim.start();
    this.physics.active = true;
    this.physics.move();
    this.flightControl();    
    this.isFlying = true;
  }
  
  this.stopFlight = function()
  {
     //stop butterfly flying
    this.physics.stop();
    this.anim.stop();
    this.imgSrc.src = "animation/butterfly/butterfly_1L0003.png";
    this.isFlying = false;
  }

  
  this.randomFlight = function()
  {
    this.flyTo(80 + Math.random() * 620,80 + Math.random() * 80) 
  }
  
  this.flyTo = function(x,y)
  {
    //files to a specific point
    this.targetX = x;				//destination to fly
    this.targetY = y;  
  }
  
  this.sleep = function()
  {
    //flys butterfly out ofscene.
    if(Math.random() > 0.5)
    {
      this.flyTo(850,135);
    }else
    {
      this.flyTo(-50,135);    
    }
    this.flightType = "exit";
  }
}



function initSpring()
{
  for(var a=0;a<butterArray.length;a++)
  {
    butterArray[a] = new butterflyObj("butterArray[" + a + "]");
    butterArray[a].physics.setSize(20,21);
    butterArray[a].physics.setPosition(-50,100);
  }
  
  for(var a=0;a<chickenArray.length;a++)
  {
    chickenArray[a] = new chickenObj("chickenArray[" + a + "]");
    chickenArray[a].setPosition(30,0);
    chickenArray[a].anim.srcObj.src = "animation/chicken/chicken0000.png";
    chickenArray[a].anim.srcObj.style.display = "none";
    
  }
  
  for(var a=0;a<plantArray.length;a++)
  {
    plantArray[a] = new plantObj();
    plantArray[a].positionX = Math.round(Math.random() * 800);
    plantArray[a].imgSrc.style.left = plantArray[a].positionX;
  }

  for(var a=0;a<leavesArray.length;a++)
  {
    leavesArray[a] = new leafObj("leavesArray[" + a + "]");
    leavesArray[a].index = a;
    leavesArray[a].physics.setSize(38,31);
    leavesArray[a].physics.setPosition(-10,0);

    leavesArray[a].physics.active = false;
    leavesArray[a].physics.move();
  }

 setRainGauge();
 startSpring();
  
}


function startSpring()
{

   chickenGrowth();
   biosphere();
    
}


function biosphere()
{
  butterflyMan();
  chickenMan();
  bioTimer = setTimeout("biosphere()",20000)
  if(theWeather.wind >=20)
  {
    startGust();
  }
}

function startGust()
{
  var w = Math.min((theWeather.wind-20)/2,leavesArray.length)
  for(var a=0;a<w;a++)
  {
    if(!leavesArray[a].physics.active)
    {
      leavesArray[a].physics.active = true;
      windGust(a);
    }
  }
}


function windGust(a)
{
  ///blows leaves around
  var w,wind;
  leavesArray[a].physics.setPosition(-20,Math.random()*100+20);
  leavesArray[a].physics.active = false;
  if(theWeather.wind >=20)
  {
    wind = theWeather.wind;
    w = wind - (wind * Math.random() * 0.5)
    leavesArray[a].physics.speedX = w ;  
    leavesArray[a].physics.speedY = 1;  
    leavesArray[a].physics.active = true;
    leavesArray[a].physics.move();  
  }
}

function updateResourceStats()
{
   flowerCount = 0;
   if(theWeather.temperature >= 10 && theWeather.temperature < 40 && theWeather.wind < 20)
   {
     plantStatDiv.src = "images/goodWeatherImg.png";   
   }else
   {
    plantStatDiv.src = "images/badWeatherImg.png";
   }
   
   if(theWeather.temperature > 20 && theWeather.temperature < 30)
   {
     chickenStatDiv.src = "images/goodWeatherImg.png";         
   }else
   {
     chickenStatDiv.src = "images/badWeatherImg.png";   
   }
   
   if(sky.precipitation || theWeather.temperature < 10 || theWeather.wind > 20)
   {
     butterStatDiv.src = "images/badWeatherImg.png";      
   }else
   {
     butterStatDiv.src = "images/goodWeatherImg.png";      
   }
   
   for(var a=0;a<plantArray.length;a++)
   {
 
    if(plantArray[a].state == "flower")
    {
      flowerCount++;
    }
    curPlantDiv.innerHTML = flowerCount;
    
   }
  

}

function plantMan()
{
  var r,d,limit,plantSeed,waterUsage;
  waterUsage = 0.003;
  flowerCount = 0;
  plantSeed = true;

  plantMax = Math.floor(Math.min(waterLevel,plantArray.length) );
  limit = plantMax;
  if(gameStage > 1)
  {
    limit = 0;
  }
  for(var a=0;a<plantArray.length;a++)
  {
     //*************** Adjust plant count based seeds ****************************
    if(limit > plantActive)
    {
      if(plantArray[a].state == "seed" && plantSeed)
      {
        plantArray[a].imgSrc.style.left = Math.random() * 700;
        plantArray[a].state = "grow";
        plantActive++;
        plantSeed = false;
      }
    
    }
    
    if(limit < plantActive && plantArray[a].state == "flower")
    {
      plantArray[a].state = "flowerDeath";
      plantActive--;
    }else if(limit < plantActive  && plantArray[a].state == "grow" && plantArray[a].stage > 10 && plantArray[a].stage < 30 )
    {
      plantArray[a].state = "bulbDeath";
      plantActive--;
    }
     

    if(theWeather.temperature >= 10 && theWeather.temperature < 40 && theWeather.wind < 20)
    {
      plantArray[a].update();
    } 

    if(plantArray[a].state == "flower")
    {
      flowerCount++;
    }
    
 }
  
  //Plants water usage
  waterLevel = Math.max(0,waterLevel - plantActive * waterUsage);
  curPlantDiv.innerHTML = flowerCount;
  setRainGauge();

}



function chickenMan()
{
  var limit,d,speed;
  speed = 10; 

  if((gameStage > 1 || sky.precipitation || theWeather.temperature < -10 || theWeather.wind > 30) || sky.phase != 2)
  {
    limit = 0;
  }else
  {
    limit = chickenMax;
  }
  
  for(var a=0;a<chickenArray.length;a++)
  {
    
    //*************** Adjust Chicken count ****************************
    if(limit > chickenActive)
    {
      if(chickenArray[a].walkType == "exit")
      {
        chickenArray[a].imgSrc.style.display = "inline";
        chickenArray[a].startWalk();
        chickenActive++;
        
      }
    
    }else if(limit < chickenActive)
    {
      if(chickenArray[a].walkType == "normal")
      {
        chickenArray[a].sleep();
        chickenActive--;
      }        
    }
    
    switch(chickenArray[a].walkType)
    {
    
      case "normal":
       if(!chickenArray[a].atTarget)
       {
        d = chickenArray[a].target - chickenArray[a].x;
        if(d>0)
        {
          chickenArray[a].moveBy(Math.random() * speed,0);
          if(chickenArray[a].target - chickenArray[a].x < 0)
          {
           chickenArray[a].atTarget = true;          
          }
        }else if(d<0)
        {
          chickenArray[a].moveBy(Math.random() * speed * -1,0);
          if(chickenArray[a].target - chickenArray[a].x > 0)
          {
           chickenArray[a].atTarget = true;          
          }
        }else
        {
          chickenArray[a].atTarget = true;
        }
       }else
       {
         chickenArray[a].moveBy(speed - Math.random() * speed * 2,1 - Math.random() * 2);       

       }
       break;
      case "exit":
        if(!chickenArray[a].atTarget)
        {
          if(chickenArray[a].x>chickenArray[a].target)
          {
            chickenArray[a].moveBy(-10,-1);        
          }else
          {
            chickenArray[a].isWalking = false;
            chickenArray[a].atTarget = true;            
            chickenArray[a].imgSrc.style.display = "none";
            chickenArray[a].anim.stop();
          }
        }
       break;
    
    
    }
    
  }
  curChickenDiv.innerHTML = chickenActive;

}

function chickenGrowth()
{
  //update chicken max based on weather history
  if(sky.precipitation)
  {
    chickenBirthCounter = Math.max(0,chickenBirthCounter - 1);
    chickenMax = Math.round(Math.max(1,chickenBirthCounter/48) );

  }else if(theWeather.temperature > 20 && theWeather.temperature < 30)
  {
    chickenBirthCounter = Math.min(chickenArray.length * 48+1,chickenBirthCounter + 1);
    chickenMax = Math.round(Math.min(chickenArray.length,chickenBirthCounter/48 + 1) );
  }

}

function stopAllChicken()
{
  for(var a=0;a<chickenArray.length;a++)
  {
    chickenArray[a].anim.stop();
  }
}

function startAllChicken()
{
  for(var a=0;a<chickenArray.length;a++)
  {
    chickenArray[a].mode = "normal";
    chickenArray[a].anim.start();
  }
}



function butterflyMan()
{
  var d,limit;
  //*** Butterfly schedule
  limit = butterSchedule[currentHour];
  if(gameStage > 1 || sky.precipitation || theWeather.temperature < 10 || theWeather.wind > 20)
  {
    limit = 0;
  }else if(townSequence)
  {
    limit = butterSpecial;
  }
  for(var a=0;a<butterArray.length;a++)
  {
     //*************** Adjust butterfly count based on time of day ****************************
    if(limit > butterActive)
    {
      if(butterArray[a].flightType == "exit")
      {
        butterArray[a].flightType = "normal";
        butterArray[a].startFlight();
        butterActive++;
      }
    
    }else if(limit < butterActive)
    {
      if(butterArray[a].flightType == "normal")
      {
        butterArray[a].sleep();
        butterActive--;
      }        
    }


     //*******************************************
    if(butterArray[a].flightType == "normal")
    {
      if(!butterArray[a].isFlying)
      {
        butterArray[a].startFlight();
      }
      butterArray[a].randomFlight();
    }else if(butterArray[a].flightType == "landing")
    {
      if(!butterArray[a].isFlying)
      {
        butterArray[a].flightType = "normal";
        butterArray[a].startFlight();
      }
    
    }else if(butterArray[a].flightType == "exit")
    {
    
    
    }

    
    
    
    d = Math.round(Math.random() * 10);
    if(d == 5 && butterArray[a].flightType == "normal")
    {
      butterArray[a].targetX = 480;
      butterArray[a].targetY = 60;
      butterArray[a].flightType = "landing";
    }
  
  }
 curButterDiv.innerHTML = butterActive;
  
}