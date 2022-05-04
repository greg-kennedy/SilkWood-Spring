//Entire Script copyright 2007 Dexter Kofa/Reflective Layer
var heatUsed,heatTotal,heatLoss;
heatLoss = 0;

function species()
{
   //creates a main character
   //BIOLOGY
   
   this.X = 0;
   this.Y = 0;
   this.minAccess = 4;			//minmum acces required to perform function on the Elder(most important is 0)
   this.psych = 5;			//if high then Elder is happy else elder is sad
   this.stomach = 2500;			//7500 current amount of food in stomach
   this.energy = 0;				//10000 local energy buffer used by all motor functions 
   this.bodyHeat = 4400;			//current amount of heat the body is holding
   this.energyConRate = 0;		//rate at which energy is consumed
   this.heatConRate = 18;		//rate at which heat is consumed
   this.heatConRateMax = 50;		//maximum rate at which heat is consumed
   this.heatConRateMin = 10;		//minimum rate at which heat is consumed
   this.stomachFull = false;		//is true of stomach is full(to capacity)
   this.eatRate = 0;			//rate at which food is eaten
   this.bodyTemp = 0;			//current body temperature
   this.bodyTempArray = new Array(40,44,45,50);	//Body temperature ranges. Middle numbers are normal body temp range
   this.tempDir = 0;				//controls if body temp should be raised or lowered (0=no action, 1=down, 2=up)
   this.smartIndex;
   this.isHeating = false;				//wheather the body is heating up


   this.default_smartIndex = 1;		//how smart the Elder is
   this.defaultStomachSize = 10000;	//Max amount of food stomach can hold
   this.default_eatRate = 3;		//rate at which food is eaten
   this.default_sepSpeedHeat = 0.3;	//speed at which food for generating heat is allocated
   this.default_sepSpeedEnergy = 0.02;	//speed at which food for generating energy is allocated
   this.default_energyEff = 52;		//food to energy efficiency
   this.default_heatEff = 100;		//food to heat efficiency
   this.default_energyBufferSize = 20000;	//local energy buffer used by all motor functions 
   this.default_heatTransfer = 0;		//heat transfer rate of body
   this.default_bodyConduction = 1;	//body conduction coeffecient
   this.default_bodyHeatCapacity = 10000;	//amount of heat body can hold
   this.defaultMotionEnergy = 1;		//normal energy consumption
   this.defaultTiredLevel = .2;
   this.defaultUnTiredLevel = .9;

   this.bodyConduction = 0;			//(see default)body conduction coeffecient
   this.bodyHeatCapacity = 0;		//amount of heat body can hold

   
   this.bodyConductionMin = 0.5;	//body conduction coeffecient minimum
   this.bodyConductionMax = 10;		//body conduction coeffecient maximum
   this.sepSpeedHeat = 0;		//speed at which food for generating heat is allocated
   this.heatSepRateMax = 0.4;
   this.sepSpeedEnergy = 0;			//speed at which food for generating energy is allocated
   this.energyEff = 0;			//food to energy efficiency
   this.heatEff = 0;			//food to heat efficiency
   this.energyBufferSize = 0;		//local energy buffer used by all motor functions 
   this.heatTransfer = 0;			//heat transfer rate of body
   
   this.isCold = false;
   this.isHot = false;
   this.isTired = false;
   this.isHappy = false;
   this.isVeryHappy =false;
   this.isSick = false;
   this.inPainSleep = false;
   this.isRecovering = false;
   this.diseaseType = 0;
   this.diseaseVisible = false				//if true then disease visable to user
   this.tiredLevel =  this.defaultTiredLevel;		//in fraction of energy buffer size
   this.unTiredLevel = this.defaultUnTiredLevel;
   
   this.happyTimer = 0;			//timers are there to delay interval between success emotions
   this.veryHappyTimer = 0;
   this.shiverTimer = 0;
   this.shiverDelay = 15;
   this.sweatTimer = 0;
   this.sweatDelay = 15;
   this.sickTimer = 0;

   this.outOfParamTimer = 0;		//count # of time Elder is out of Parameter
   this.outOfParamLimit = 500;

   this.stomachSize = this.defaultStomachSize;
   this.defaultWalkHeight = 0; //default height at which character will walk
   this.defaultSitHeight = 60; //defualt height at which character will sit
   this.defaultSleepHeight = -40; //defualt height at which character will sleep
   this.defaultWalkMode = "walk"  //defaulk mode to use when walking a character.;
   this.defaultWalkSpeed = 2  //default walk speed;
   this.defaultClimbSpeed = 30  //default climb speed;
   this.smartIndex = this.default_smartIndex;
   
   this.climbSpeed = this.defaultClimbSpeed;
   this.walkSpeed = this.defaultWalkSpeed;
   this.walkHeight = this.defaultWalkHeight;
   this.sitHeight = this.defaultSitHeight;
   this.sleepHeight = this.defaultSleepHeight;
   this.walkMode = this.defaultWalkMode;
   this.walkDir = "right";		//direction facing when walking
   this.floor = 0;			//current hieght of floor under Elder
   this.hasBasket = false;
   this.hasCart = false;
   this.isInTown = false;
   this.townDelay = 1000;		//set for 1.5 hours
   this.isReturning = false;		//when silk is returning from town		
   this.townCounter = this.townDelay;   
   this.hasDisease = false;
   this.diseaseIndex = null;
   this.diseaseName = new Array("Hypothermia","Hyperthermia","Trypanosomiasis","Dyspepsia","Coeliac");
   this.diseaseInfectRate = new Array(-1,-1,1,10,5);
   this.diseaseDetect = 0;		//count before disease is detected
   this.sickRecovery = 0;		//recovery timer

   this.init = function()
   {
   
     this.bodyTemp = this.bodyTempArray[1] + (this.bodyTempArray[2] - this.bodyTempArray[1])/2;
     this.eatRate = this.default_eatRate;
     this.sepSpeedEnergy = this.default_sepSpeedEnergy;
     this.energyBufferSize = this.default_energyBufferSize;
     this.energy = this.energyBufferSize;
     this.energyEff = this.default_energyEff;
     this.sepSpeedHeat = this.default_sepSpeedHeat;
     this.bodyConduction = this.default_bodyConduction;
     this.bodyHeatCapacity = this.default_bodyHeatCapacity;
     this.heatEff = this.default_heatEff;
     
     //create action manager
     this.action = new actionObject();
     this.action.init();

     //create command manager
     this.command = new commandObject();

     //create Task manager
     this.task = new taskObject();
     this.task.parent = this;


     //this.action.init();
     //this.command.init();
   
   }

   
   this.updateLife = function()
   {
     
     this.energyEff =  Math.max(this.energyEff-0.0001,this.default_energyEff * 0.2);
     this.smartIndex = Math.max(this.smartIndex-0.000005,0.001);
     this.psych  = Math.max(this.psych-0.00005,0.001);
     this.foodToEnergy();
     this.foodToHeat();
     this.energyUsage();
     this.heatUsage();
     this.regBodyTemp();
     
     if(this.isSick)
     {
    //   this.stomach = this.stomachSize/2;
     }
     //addtional task processing
     switch(this.command.com)
     {
     	case "goRead":
     	  this.smartIndex =  Math.min(this.smartIndex+0.00002,this.default_smartIndex);
     	 break
     	case "research":
     	  this.smartIndex =  Math.min(this.smartIndex+0.0006,this.default_smartIndex);
     	 break;
     	case "meditate":
     	  this.smartIndex =  Math.min(this.smartIndex+0.001,this.default_smartIndex);
	  this.energyEff =  Math.min(this.energyEff+0.001,this.default_energyEff+1);
	 break
	case "stargazing":
	  this.psych =  Math.min(this.psych+0.0006,10);
	 break;
	case "watchTV":
	  this.psych =  Math.min(this.psych+0.0002,10);
	 break;
	case "exercise":
	  this.energyEff =  Math.min(this.energyEff+0.0005,this.default_energyEff+1);
	 break;
     }
   }
   
   
   this.getX = function()
   {
     //returns X coordinate of elder;
    return this.X;
   }

   this.getY = function()
   {
     //returns Y coordinate of elder;
    return srcToWorld(this.Y,this.imgDiv);
   }
   
   this.moveTo = function(x,y)
   {
   
     //put Elder at that location
     this.imgDiv.style.left = x;
     this.imgDiv.style.top = worldToScr(y,this.imgDiv);
     silkMover.curX = x;
     silkMover.curY = worldToScr(y,this.imgDiv);
     this.X = silkMover.curX;
     this.Y = silkMover.curY;
   }
   
   this.sync = function()
   {
     //sync objects visual location with object data
     this.moveTo(this.getX(),this.getY() )
   }
   
   this.stop = function()
   {
      silk.action.stop();
      silkMover.stop();
   }
   

  
  this.emoText = function(e)
  {
    //coverts mind set to emoText statement
    var t;
    switch(Math.round(e) )
    {
     case 0:
       t = "<span style='color:violet'>ARRRRRRRG...#@$%</span>";
     case 1:
       t = "<span style='color:violet'>I won't take it!</span>";
      break;
     case 2:
       t = "<span style='color:yellow'>I need time off now!</span>";
      break;
     case 3:
       t = "<span style='color:yellow'>Cut me some slack.</span>";
      break;
     case 4:
       t = "A little tired.";
      break;
     case 5:
       t = "Can't complain.";
      break;
     case 6:
       t = "It's a good day.";
      break;
     case 7:
       t = "<span style='color:lime'>Living nice.</span>";
      break;
     case 8:
       t = "<span style='color:lime'>I feel good!</span>";
      break;
     case 9:
       t = "A day in the park.";
      break;
     case 10:
       t = "Ahh, the easy life.";
      break;
    }
    return t;
     
  }
  
  this.foodToEnergy = function()
  {
    //converts food into energy
    if(this.stomach > 0)
    {
      if(this.energy < this.energyBufferSize)
      {
        this.energy += this.sepSpeedEnergy *  this.energyEff;
        this.stomach = Math.max(this.stomach-this.sepSpeedEnergy,0);
      }
    }
    
  }
  

  this.foodToHeat= function()
  {
    //converts food into heat when needed
    if(this.stomach > 0)
    {
      if(silk.isHeating)
      {
        heatUsed = this.sepSpeedHeat * this.heatEff;
        this.stomach = Math.max(this.stomach-this.sepSpeedHeat,0);
      }else
      {
        heatUsed =  0.2 * this.heatEff;;
       this.stomach = Math.max(this.stomach-0.2,0);
      }
      this.bodyHeat += heatUsed;
    }
    
  }

  
  this.energyUsage = function()
  {
    //amount of energy used per sec
    if(this.energy > 0)
    {
      this.energy -= this.energyConRate;
    }else
    {
      this.energy = 0;
    }
    
  }
  
  this.heatUsage = function()
  {
    //amount of heat lost per life update
    var h,st;
    if(silk.getX() < 530)
    {
      //Silk is considered outside
      st = theWeather.temperature
    }else
    {
      st = 19;
    }
    h = 0.25;	//heat transfer coefficent
    heatLoss = h * this.bodyConduction * (Math.abs(this.bodyTemp - st) );
    this.bodyHeat = this.bodyHeat - Math.min(this.bodyHeat,this.heatConRate)  - heatLoss;
    this.bodyTemp = Math.max(this.bodyHeat/100,st);
    
//    heatTotal = heatUsed - this.heatConRate - heatLoss;
  }
  
  
  this.regBodyTemp = function()
  {
    //regulates the temerature of the body

   if(this.tempDir == 0)
   {
     if(this.bodyTemp < this.bodyTempArray[2])
     {
       this.isHeating = true;
     }else
     {
       this.tempDir = 1;
     }
   }else
   {
     if(this.bodyTemp < this.bodyTempArray[1])
     {
       this.tempDir = 0;
     }else
     {
        this.isHeating = false;
     }
   }

   if(this.bodyTemp > this.bodyTempArray[1] && this.bodyTemp < this.bodyTempArray[2])
   {
     this.outOfParamTimer = Math.max((this.outOfParamTimer-0.01),0);
     silk.isCold = false;
     silk.isHot = false;      
   }

  }
  
  
  this.healthCheck = function()
  {
    //*****TOO COLD
    if(this.bodyTemp < (this.bodyTempArray[1] - 1) )
    {
      silk.isCold = true;
      silk.isHot = false;
    }else if(this.bodyTemp > (this.bodyTempArray[2] + 1) )
    {
      silk.isCold = false;
      silk.isHot = true;
    }else if(this.isTired && this.stomach == 0)
    {
      silk.isTired = false;     
    }else if(this.energy < (silk.tiredLevel * this.energyBufferSize) && !this.isTired && this.stomach != 0)
    { //*****TOO TIRED
      silk.isTired = true;
        
    }else if(this.isTired && this.energy > (silk.unTiredLevel * this.energyBufferSize))
    {//*****NOT TIRED
      silk.isTired = false;     
    }else if(!this.isTired)
    {//***** EMOTION
       switch(Math.round(this.psych) )
       {
        case 0:
          if(!this.isSad)
          {
             //this.elderBehaviour("sad");
           }
          break;
         case 5:
           if(!this.isContent)
           {
             this.isContent = true;
             this.isVeryHappy = false;
             this.isHappy = false;
             this.isSad = false;
           }
          break;
         case 7:
          if(!this.isHappy)
          {
            //this.elderBehaviour("happy");
          }
         break;
        case 9:
         if(!this.isVeryHappy)
         {
           //this.elderBehaviour("veryHappy");
         }
        break;
       }
    }
  }
 
  this.checkDisease = function()
  {
    var r;
    if(!this.hasDisease)
    {
      if(this.diseaseDetect == 0)
      {
        for(var a=0;a<this.diseaseInfectRate.length;a++)
        {
          r = Math.random() * 10000 * this.smartIndex;
          if(r < this.diseaseInfectRate[a])
          {
            this.aquireDisease(a);
            break;
          }
        }
      }else
      {
        this.diseaseDetect = Math.max(this.diseaseDetect-1,0);
      }
    }else
    {
      this.diseaseGrowth(this.diseaseIndex)
    }
  }
  
  
  this.aquireDisease = function(d)
  {
    this.diseaseIndex = d;
    this.diseaseDetect = 1;//Math.random() * 100;
    this.hasDisease = true;
  }
  
  this.diseaseGrowth = function(d)
  {
    if(this.diseaseDetect <= 0)
    { 
      this.diseaseDetect = 0;
      vital_disease.innerText = this.diseaseName[d];
      if(!this.diseaseVisible)
      {
        cureButton.style.display = "inline";
        this.diseaseVisible = true;
      }
    }

    this.diseaseDetect--;    
    
    switch(this.diseaseIndex)
    {
    
      case 2:
      //Trypanosomiase
       this.tiredLevel = Math.min(this.tiredLevel + 0.01,this.unTiredLevel - 0.05);
       this.sepSpeedEnergy = Math.max(this.sepSpeedEnergy - 0.001,(silk.defaultMotionEnergy-3.0)/this.energyEff);

       break;
      case 3:
      //Dyspepsia
       this.stomachSize = Math.max(this.stomachSize - 1,this.defaultStomachSize/2,this.stomach);

       break;
      case 4:
      //Coeliac
       this.energyEff = Math.max(this.energyEff - 0.1,0);

       break;
    
    }

  }
  //***********************      ELDER BEHAVIOURS  *****************
  
  this.elderBehaviour = function(b)
  {
    if(this.minAccess >= 3)
    {
      silk.imgDiv.style.top = worldToScr(silk.floor,silk.imgDiv);   //set to walk height
           
      switch(b)
      {
        case "tired":
          this.psych = Math.max(this.psych - 1,0);
          this.isTired = true;
          silk.command.com = "tired";
          this.command.run();
         break;
        case "unTired":
          this.isTired = false;
          this.restoreTask();
         break;
        case "sad":
          this.changePsychState("sad");
          this.command.com = "sad";
          this.command.run();
         break;
        case "happy":
          this.changePsychState("happy");
          this.command.com = "happy";
          this.command.run();
          if(silk.hasBasket)
          {
            silkWood.basket.drop(-30,0);
          }
         break;
        case "veryHappy":
          this.changePsychState("veryHappy");
          this.command.com = "veryHappy";
          this.command.run();
          if(silk.hasBasket)
          {
            silkWood.basket.drop(-30,0);
          }
         break;
        case "freezing":
          this.command.com = "tooCold";
          this.command.run();
         break;
        case "sweating":
          this.command.com = "tooHot";
          this.command.run();
         break;
      }
    } 
  }
  
  
  this.changePsychState = function(p)
  {
    switch(p)
    {
      case "verHappy":
        this.isVeryHappy = true;
        this.isHappy = false;
        this.isSad = false;
       break;
      case "happy":
        this.isVeryHappy = false;
        this.isHappy = true;
        this.isSad = false;
       break;
      case "sad":
        this.isVeryHappy = false;
        this.isHappy = false;
        this.isSad = true;
       break;
    
    }
  }
  
  this.pauseTask = function()
  {
    clearTimeout(silk.task.pollTimer);
    silk.action.stop();
    silk.minAccess = 1;
    silk.command.level = 1;
    silk.action.level = 1;
    schedulerActive = false;
    silk.task.pausedTask = silk.task.currentTask;
  }
  
  this.restoreTask = function()
  {
    //restores prvious behaviour;
    this.task.currentTask = this.task.pausedTask;
    this.command.level = 4;
    this.action.level = 4;
    this.minAccess = 4;
    schedulerActive = true;
    this.task.run();
  }
  
  //***********************  LIFE THREATENING PREVENTION BEHAVIOURS  *****************
  this.lifeCheck = function()
  {
    //check for and rectifies life treating situations
   if(this.bodyTemp < this.bodyTempArray[0])
   {  
    this.outOfParamTimer++;
    if(this.outOfParamTimer >= this.outOfParamLimit && (!this.isSick || gameLoading) && !townSequence)
    {
	  this.command.level = 1;
	  this.action.level = 1;
	  this.minAccess = 1;
          this.isSick = true;
          this.hasDisease = true;
          this.diseaseIndex = 0;	//Hypothermia
          vital_disease.innerText = this.diseaseName[this.diseaseIndex];
          vital_diseaseDetail.innerHTML = "<small>Core temp. too low for body to function.</small>" 
          this.command.com = "sick";
          silkWood.basket.drop(30,0);
          this.command.run();
    }
   }else if(this.bodyTemp > this.bodyTempArray[3])
   {  
    this.outOfParamTimer++;
    if(this.outOfParamTimer >= this.outOfParamLimit && (!this.isSick || gameLoading) && !townSequence)
    {
	  this.command.level = 1;
	  this.action.level = 1;
	  this.minAccess = 1;
          this.isSick = true;
          this.hasDisease = true;
          this.diseaseIndex = 1;	//Hyperthermia
          vital_disease.innerText = this.diseaseName[this.diseaseIndex];
          vital_diseaseDetail.innerHTML = "<small>Core temp. too high for body to function.</small>" 
          this.command.com = "sick";
          silkWood.basket.drop(30,0);
          this.command.run();
    }
   }
  }
  
  this.hospitalize  = function()
  {
    silk.stop();
    this.command.com = "cure";
    this.command.run();    
    cureButton.style.display = "none";
    closeVitalStats();
  }
  
  this.cured = function()
  {
    //puts silk back in the game

    this.outOfParamTimer = 0;
    this.sickRecovery = 0;
    this.isSick = false;
    this.isRecovering = false;
    this.hasDisease = false;
    this.diseaseDetect = 100;
    this.diseaseIndex = -1;
    this.diseaseVisible = false;
    cureButton.style.display = "none";
    
    
    this.command.level = 4;
    this.action.level = 4;
    this.minAccess = 4;
    this.diseaseType = "None";
    vital_disease.innerText = "None";
    vital_diseaseDetail.innerHTML = "";  
    this.task.run();
  }
}