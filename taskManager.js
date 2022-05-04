//Entire Script copyright 2007 Dexter Kofa/Reflective Layer
function taskObject()
{
  this.currentTask = "null";
  this.oldTask = null;
  this.pausedTask = null;	//task put on hold by higher priority object
  this.taskPhase = "end";
  this.taskNextPhase = "end";
  this.level = 4;
  this.pollTimer;
  this.pollInterval = 2000;
  this.v1;
  this.v2;


 this.run = function()
 {   
   if(this.level <= silk.minAccess)
   { 
     silk.action.stop();
     this.taskPhase = "start";
     silk.task["tb_" + this.currentTask]();
   }
 }

 this.newTask = function()
 {
   //set up for a new task
   if(this.level <= silk.minAccess)
   {
     if(this.oldTask == null)
     {
       this.oldTask = this.currentTask;
       this.run();
     }else
     { 
       this.taskNextPhase = "endgame";
       this.cont();
     }
   }
 }

 this.cont = function()
 {
   if(this.level <= silk.minAccess && !silkIsPaused)
   {
     this.taskPhase = this.taskNextPhase;
     switch(this.taskPhase)
     {
       case "endgame":
         //rap up old task
         clearTimeout(this.pollTimer);
         silk.task["tb_" + this.oldTask]();
         this.oldTask = this.currentTask;
        break;
       case "end":
         //rap up old task
         silk.task.run();
        break;
      default:
         //rap up old task
          silk.task["tb_" + this.currentTask]();   
        break;
     }
   }
 }


 //************************* TASK BEHAVIOURS ******************************
 
 //====================== GO TO TOWN =============================
 this.tb_gotoTown  = function()
 {
   var f = 500;
   switch(this.taskPhase)
   {
     case "start":
         schedulerActive = false;
         townSequence = true;
         silk.command.com = "gotoTown";
         silk.command.run();
      break;
     case "endgame":
         this.taskNextPhase = "end";
         this.cont();
      break;
   }
 }

 //====================== DIG HABITAT SHAFT =============================
 this.tb_digHabitatShaft  = function()
 {
   var pickupVolume = 3; 	//(3)how much dirt fits is pickup by shovel or axe /3
   var digDepth = 1;		//how far down to dug after each basket full
  if(silkWood.cave.stage > 1 && this.taskPhase != "endgame")
   {
      checkStageComplete();
      silk.command.com = "taskCompleted";
      this.taskNextPhase = "end";         
      silk.command.run();
      return;
   }
   switch(this.taskPhase)
   {      
     case "start":
       this.v1 = 15;
       if(silk.hasBasket)
       {
         silk.command.com = "goDigShaft";
         this.taskNextPhase = "digging";         
         silk.command.run();
       }else
       {
         silk.command.com = "getBasket";
         this.taskNextPhase = "goDig";         
         silk.command.run();
       }
      break;

     case "goDig":
         silk.command.com = "goDigShaft";
         this.taskNextPhase = "digging";
         silk.command.run();
      break;
      
     case "digging":
         silkWood.basket.addItem(pickupVolume);
         if(silkWood.basket.full)
         {
           this.taskNextPhase = "getBasket";
         }else
         {
           this.v1--;
	   if(this.v1 == 0)
	   { //used tyo sync sound and animation
              this.taskNextPhase = "start";            
           }
         }
   //----------------- Involuntary ------------
         if(silk.isTired)
         {
           this.taskNextPhase = "tired";         
         }else if(silk.isCold)
         {
           if(silk.shiverTimer <= 0)
           {
             this.taskNextPhase = "tooCold"; 
           }else
           {
             silk.shiverTimer--;
           }
         }else if(silk.isHot)
         {
           if(silk.sweatTimer <= 0)
           {
             this.taskNextPhase = "tooHot"; 
           }else
           {
             silk.sweatTimer--;
           }
         }
         this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);         
         break;
     case "tired":
          this.taskNextPhase = "resting";         
          silk.psych = Math.max(silk.psych - 1,0);
          silk.command.com = "tired";
          silk.command.run();
      break;
     case "resting":
       if(!silk.isTired)
       { 
         this.taskNextPhase = "digging";         
         silk.action.load(this.level,"dig");
         silk.action.play(); 
       }
       this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
        break;
     case "tooCold":
          this.taskNextPhase = "contWork";         
          silk.shiverTimer = silk.shiverDelay;
          silk.command.com = "tooCold";
          silk.command.run();
      break;
     case "tooHot":
          this.taskNextPhase = "contWork";         
          silk.sweatTimer = silk.sweatDelay;
          silk.command.com = "tooHot";
          silk.command.run();
      break;
     case "contWork":
          this.taskNextPhase = "digging";         
          silk.action.load(this.level,"dig");
          silk.action.play(); 
          this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
      break;
  //----------------- -------------- ------------     
     case "getBasket":
         if(silkWood.cave.stage == 0)
         {
           silk.moveTo(silk.getX(),silkWood.home.floor);
           silk.floor = silk.getY();
         }
         silk.command.com = "getBasket";
         this.taskNextPhase = "dump";         
         silk.command.run();
       break;
       
     case "dump":
         this.v1 = 15;
         setTimeout("silkWood.cave.dig(" + digDepth + ")",3000);       
         this.taskNextPhase = "goDig";               
         silk.command.com = "goDumpDirt";
         silk.command.run();
      break;

     case "completed":

      break;

     case "endgame":
         silk.command.com = "returnBasket";
         this.taskNextPhase = "end";
         silk.command.run();
      break;
   }
 }
 //====================== DIG HABITAT TUNNEL =============================
 this.tb_digHabitatTunnel  = function()
 {
   var pickupVolume = 3; 	//(3)how much dirt fits is pickup by shovel or axe /3
   var digDepth = 1;		//how far down to dug after each basket full

   if(silkWood.cave.stage != 2 && silkWood.cave.stage != 4 && this.taskPhase != "endgame")
   {
      checkStageComplete();
      silk.command.com = "taskCompleted";
      this.taskNextPhase = "end";         
      silk.command.run();
      return;
   }
   switch(this.taskPhase)
   {
     case "start":
       this.v1 = 20;
       if(silk.hasBasket)
       {
         silk.command.com = "goDigTunnel";
         this.taskNextPhase = "digging";         
         silk.command.run();
       }else
       {
         silk.command.com = "getBasket";
         this.taskNextPhase = "goDig";         
         silk.command.run();
       }
      break;

     case "goDig":
         silk.command.com = "goDigTunnel";
         this.taskNextPhase = "digging";
         silk.command.run();
      break;
      
     case "digging":
         silkWood.basket.addItem(pickupVolume);
         if(silkWood.basket.full)
         {
           this.taskNextPhase = "getBasket";
         }else
         {
           this.v1--;
	   if(this.v1 == 0)
	   { //used tyo sync sound and animation
              this.taskNextPhase = "start";            
           }
         }         
   //----------------- Involuntary ------------
         if(silk.isTired)
         {
           this.taskNextPhase = "tired";         
         }else if(silk.isCold)
         {
           if(silk.shiverTimer <= 0)
           {
             this.taskNextPhase = "tooCold"; 
           }else
           {
             silk.shiverTimer--;
           }
         }else if(silk.isHot)
         {
           if(silk.sweatTimer <= 0)
           {
             this.taskNextPhase = "tooHot"; 
           }else
           {
             silk.sweatTimer--;
           }
         }
         this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);         
         break;
     case "tired":
          this.taskNextPhase = "resting";         
          silk.psych = Math.max(silk.psych - 1,0);
          silk.command.com = "tired";
          silk.command.run();
      break;
     case "resting":
       if(!silk.isTired)
       { 
         this.taskNextPhase = "digging";         
         silk.action.load(this.level,"pickaxe");
         silk.action.play(); 
       }
       this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
        break;
     case "tooCold":
          this.taskNextPhase = "contWork";         
          silk.shiverTimer = silk.shiverDelay;
          silk.command.com = "tooCold";
          silk.command.run();
      break;
     case "tooHot":
          this.taskNextPhase = "contWork";         
          silk.sweatTimer = silk.sweatDelay;
          silk.command.com = "tooHot";
          silk.command.run();
      break;
     case "contWork":
          this.taskNextPhase = "digging";         
          silk.action.load(this.level,"pickaxe");
          silk.action.play(); 
          this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
      break;
  //----------------- -------------- ------------     
     
     case "getBasket":
         silk.command.com = "getBasket";
         this.taskNextPhase = "dump";         
         silk.command.run();
       break;
       
     case "dump":
         this.v1 = 20;
         setTimeout("silkWood.cave.dig(" + digDepth + ")",10000);       
         this.taskNextPhase = "goDig";         
         silk.command.com = "goDumpDirt";
         silk.command.run();
      break;

     case "endgame":
         silk.command.com = "returnBasket";
         this.taskNextPhase = "end";
         silk.command.run();
      break;
   }
 }
 //====================== DRAIN WATER =============================
 this.tb_drainWater  = function()
 {
   var pickupVolume = 2; 	//(3)how much dirt fits is pickup by shovel or axe /3
   var digDepth = 1;		//how far down to dug after each basket full
   if(silkWood.cave.stage != 3 && this.taskPhase != "endgame")
   {
      silk.command.com = "taskCompleted";
      this.taskNextPhase = "end";         
      silk.command.run();
      return;
   }else if(!silkWood.cave.waterPump)
   {
     silk.command.com = "goCreatePump";
     silk.command.v1 = 195;
     silk.command.v2 = -245;
     this.taskNextPhase = "start";         
     silk.command.run();
     silkWood.cave.waterPump = true;
     return;
   }
   switch(this.taskPhase)
   {
     case "start":
       if(silkWood.cave.stage == 4)
       {
         this.taskNextPhase = "openCave";
         this.cont();
       }else if(silk.hasBasket)
       {
         silk.command.com = "goDrainCave";
         this.taskNextPhase = "draining";         
         silk.command.run();
       }else
       {
         silk.command.com = "getBasket";
         this.taskNextPhase = "goDrain";         
         silk.command.run();
       }
      break;

     case "goDrain":
         if(silkWood.cave.stage == 4)
         {
           this.taskNextPhase = "openCave";
           this.cont();
         }else
         {
           silk.command.com = "goDrainCave";
           this.taskNextPhase = "draining";
           silk.command.run();
         }
      break;
      
     case "draining":
         silkWood.basket.addItem(pickupVolume);
         if(silkWood.basket.full)
         {
           this.taskNextPhase = "getBasket";
         }         
   //----------------- Involuntary ------------
         if(silk.isTired)
         {
           this.taskNextPhase = "tired";         
         }else if(silk.isCold)
         {
           if(silk.shiverTimer <= 0)
           {
             this.taskNextPhase = "tooCold"; 
           }else
           {
             silk.shiverTimer--;
           }
         }else if(silk.isHot)
         {
           if(silk.sweatTimer <= 0)
           {
             this.taskNextPhase = "tooHot"; 
           }else
           {
             silk.sweatTimer--;
           }
         }
         this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);         
         break;
     case "tired":
          this.taskNextPhase = "resting";         
          silk.psych = Math.max(silk.psych - 1,0);
          silk.command.com = "tired";
          document.getElementById("handPumpImg").style.display = "block";         
          silk.command.run();
      break;
     case "resting":
       if(!silk.isTired)
       { 
         this.taskNextPhase = "draining";         
         silk.action.load(this.level,"pumpWater");
         silk.action.play(); 
       }
       this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
        break;
     case "tooCold":
          this.taskNextPhase = "contWork";         
          silk.shiverTimer = silk.shiverDelay;
          silk.command.com = "tooCold";
          document.getElementById("handPumpImg").style.display = "block";         
          silk.command.run();
      break;
     case "tooHot":
          this.taskNextPhase = "contWork";         
          silk.sweatTimer = silk.sweatDelay;
          silk.command.com = "tooHot";
          document.getElementById("handPumpImg").style.display = "block";         
          silk.command.run();
      break;
     case "contWork":
          this.taskNextPhase = "draining";         
          silk.action.load(this.level,"pumpWater");
          silk.action.play(); 
          this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
      break;
  //----------------- -------------- ------------     
     
     case "getBasket":
         silk.command.com = "getBasket";
         this.taskNextPhase = "dump";         
         silk.command.run();
         document.getElementById("handPumpImg").style.display = "block";         
       break;
       
     case "dump":
         if(silkWood.cave.stage == 4)
         {
           silkWood.cave.dig(digDepth);         
         }else
         {
           silkWood.cave.drain(digDepth);        
         }
         this.taskNextPhase = "goDrain";         
         silk.command.com = "goDumpDirt";
         silk.command.run();

      break;
//******************** STAGE 4
     case "openCave":
       if(silk.hasBasket)
       {
         silk.command.com = "goDigTunnel";
         this.taskNextPhase = "digging";         
         silk.command.run();
       }else
       {
         silk.command.com = "getBasket";
         this.taskNextPhase = "goDig";         
         silk.command.run();
       }
      break;
     case "goDig":
         silk.command.com = "goDigTunnel";
         this.taskNextPhase = "digging";
         silk.command.run();
      break;
      
     case "digging":
         silkWood.basket.addItem(pickupVolume);
         if(silkWood.basket.full)
         {
           this.taskNextPhase = "getBasket";
         }         
         this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
      break;
//******************** END STAGE 4

     case "endgame":
         document.getElementById("handPumpImg").style.display = "block";         

         silk.command.com = "returnBasket";
         this.taskNextPhase = "end";
         silk.command.run();
      break;
   }
 }
 //====================== BUILD HABITAT FLOOR =============================
 this.tb_buildHabitatFloor  = function()
 {
   var pickupVolume = 10; 	//(3)how much dirt fits is pickup by shovel or axe /3
   var buildLength = 50;		//how far down to dug after each basket full
   if(silkWood.cave.stage != 5 || !silkWood.plyWood.available)
   {
      silk.command.com = "taskCompleted";
      this.taskNextPhase = "end";         
      silk.command.run();
      return;
   }
   switch(this.taskPhase)
   {
     case "start":
       if(!silkWood.plyWood.active)
       {
         silk.command.v1 = 100;
         silk.command.v2 = 0;
         silk.command.com = "goTeleport";
         this.taskNextPhase = "teleport";         
         silk.command.run();
         
       }else if(silk.hasBasket)
       {
         silk.command.com = "goGetWood";
         this.taskNextPhase = "gettingWood";         
         silk.command.run();
       }else
       {
         silk.command.com = "getBasket";
         this.taskNextPhase = "start";         
         silk.command.run();
       }
      break;

     case "teleport":
         silkWood.teleporter.start("woodPileImg"); 
         this.taskNextPhase = "teleporting";         
         this.cont();
       break;
      
     case "teleporting":
         if(silkWood.teleporter.active)
         {
           this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);         
         }else
         {
	   silkWood.plyWood.active = true;
           this.taskNextPhase = "start";
           this.cont();           
         }
      break;

     case "gettingWood":
         silkWood.basket.addItem(pickupVolume);
         if(silkWood.basket.full)
         {
           this.taskNextPhase = "getBasket";
         }
         this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
      break;
      

     case "goBuild":
         silk.command.com = "goBuildFloor";
         this.taskNextPhase = "building";
         silk.command.run();
      break;
      
     case "building":
         silkWood.basket.removeItem(pickupVolume);
         if(silkWood.basket.empty)
         {
           this.taskNextPhase = "getBasket2";
         }         
         this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
      break;
     
     case "getBasket":
         silkWood.plyWood.removeWood(pickupVolume);
         silk.command.com = "getBasket";
         this.taskNextPhase = "goBuild";         
         silk.command.run();
       break;
       
     case "getBasket2":
         silkWood.cave.buildFloor(buildLength);        
         silk.command.com = "getBasket";
         this.taskNextPhase = "start";         
         silk.command.run();
       break;

     case "endgame":
         silk.command.com = "returnBasket";
         this.taskNextPhase = "end";
         silk.command.run();
      break;
   }
 }
 //====================== PICK BERRIES =============================
 this.tb_pickBerries  = function()
 {
   var pickupVolume = 2; 	//(3)how much dirt fits is pickup by shovel or axe /3
   switch(this.taskPhase)
   {
     case "start":
       if(silkWood.foodPile.isFull)
       {
         silk.command.com = "taskCompleted";
         this.taskNextPhase = "end";         
         silk.command.run();
         return;
       }else if(silk.hasBasket)
       {       
         silk.command.com = "goGatherFood";
         this.taskNextPhase = "pickingBerries";         
         silk.command.run();
       }else
       {
         silk.command.com = "getBasket";
         this.taskNextPhase = "goPickBerries";         
         silk.command.run();
       }
      break;

     case "goPickBerries":
         if(silkWood.foodPile.isFull)
         {
           silk.command.com = "taskCompleted";
           this.taskNextPhase = "end";         
           silk.command.run();
           return;
         }else
         {
           silk.command.com = "goGatherFood";
           this.taskNextPhase = "pickingBerries";
           silk.command.run();
         }
      break;
      
     case "pickingBerries":
         silkWood.basket.addItem(pickupVolume);
         if(silkWood.basket.full)
         {
           this.taskNextPhase = "getBasket";
         }
         
   //----------------- Involuntary ------------
         if(silk.isTired)
         {
           this.taskNextPhase = "tired";         
         }else if(silk.isCold)
         {
           if(silk.shiverTimer <= 0)
           {
             this.taskNextPhase = "tooCold"; 
           }else
           {
             silk.shiverTimer--;
           }
         }else if(silk.isHot)
         {
           if(silk.sweatTimer <= 0)
           {
             this.taskNextPhase = "tooHot"; 
           }else
           {
             silk.sweatTimer--;
           }
         }
         this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);         
         break;
     case "tired":
          this.taskNextPhase = "resting";         
          silk.psych = Math.max(silk.psych - 1,0);
          silk.command.com = "tired";
          silk.command.run();
      break;
     case "resting":
       if(!silk.isTired)
       { 
         this.taskNextPhase = "pickingBerries";         
         silk.action.load(this.level,"gatherFood");
         silk.action.play(); 
       }
       this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
        break;
     case "tooCold":
          this.taskNextPhase = "contWork";         
          silk.shiverTimer = silk.shiverDelay;
          silk.command.com = "tooCold";
          silk.command.run();
      break;
     case "tooHot":
          this.taskNextPhase = "contWork";         
          silk.sweatTimer = silk.sweatDelay;
          silk.command.com = "tooHot";
          silk.command.run();
      break;
     case "contWork":
          this.taskNextPhase = "pickingBerries";         
          silk.action.load(this.level,"gatherFood");
          silk.action.play(); 
          this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
      break;
  //----------------- -------------- ------------

     case "getBasket":
         silk.command.com = "getBasket";
         this.taskNextPhase = "unloadBerries";
         silk.command.run();
      break;

     case "unloadBerries":
         silkWood.basket.take();
         silk.command.com = "unloadBerries";
         this.taskNextPhase = "goPickBerries";
         silk.command.run();
      break;

     case "endgame":
         silkWood.foodProcessor.stop();
         silk.command.com = "returnBasket";
         this.taskNextPhase = "end";
         silk.command.run();
      break;
   }
 }

 //====================== CHISEL WALL =============================
 this.tb_chiselWall  = function()
 {
   if((silkWood.cave.deviceLevel == 100 || gameStage != 8) && this.taskPhase != "endgame")
   {
      checkStageComplete();
      silk.command.com = "taskCompleted";
      this.taskNextPhase = "end";         
      silk.command.run();
      return;
   }
   
   switch(this.taskPhase)
   {
     case "start":
         this.v1 = 0;
         this.taskNextPhase = "startWork";
         this.cont();     
      break;
     case "startWork":
         silk.command.com = "chisel";
         this.taskNextPhase = "chisel";
         silk.command.run();
       break;
     case "getFreshAir": 
         silk.command.com = "freshAir";
         this.taskNextPhase = "startWork";
         silk.command.run();
       break;
     case "chisel":
         this.v1++;
         if(this.v1 >= 100)
         {
           this.v1 = 0;
           silkWood.cave.deviceLevel +=1;
           elderDeviceImg.src = "world/device/device" + decFixedWidth(silkWood.cave.deviceLevel,4) + ".png";
           this.taskNextPhase = "getFreshAir";         
         }
   //----------------- Involuntary ------------
         if(silk.isTired)
         {
           this.taskNextPhase = "tired";         
         }else if(silk.isCold)
         {
           if(silk.shiverTimer <= 0)
           {
             this.taskNextPhase = "tooCold"; 
           }else
           {
             silk.shiverTimer--;
           }
         }else if(silk.isHot)
         {
           if(silk.sweatTimer <= 0)
           {
             this.taskNextPhase = "tooHot"; 
           }else
           {
             silk.sweatTimer--;
           }
         }
         this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);         
         break;
     case "tired":
          this.taskNextPhase = "resting";         
          silk.psych = Math.max(silk.psych - 1,0);
          silk.command.com = "tired";
          silk.command.run();
      break;
     case "resting":
       if(!silk.isTired)
       { 
         this.taskNextPhase = "contWork";
         this.cont();
       }
       this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
        break;
     case "tooCold":
          this.taskNextPhase = "contWork";         
          silk.shiverTimer = silk.shiverDelay;
          silk.command.com = "tooCold";
          silk.command.run();
      break;
     case "tooHot":
          this.taskNextPhase = "contWork";         
          silk.sweatTimer = silk.sweatDelay;
          silk.command.com = "tooHot";
          silk.command.run();
      break;
     case "contWork":
          this.taskNextPhase = "chisel";         
          silk.action.load(this.level,"chisel");
          silk.action.play(); 
          this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
      break;
  //----------------- -------------- ------------     
     case "endgame":
         this.taskNextPhase = "end";
         this.cont();
      break;
   }
 }
 //====================== MEAL TIME =============================
 this.tb_mealTime  = function()
 {
   switch(this.taskPhase)
   {
     case "start":
         this.v1 = 20;
         silk.command.com = "goEat";
         this.taskNextPhase = "eating";
         silk.command.run();
      break;
      
     case "eating":
       if(!silkWood.tv.status)
       {
         silkWood.tv.on();
       }
       if(silkWood.foodPile.amount <= 0)
       {
         silkWood.foodPile.setFood(0);
         this.taskNextPhase = "justSit";
       }else if(!silk.stomachFull) 
       {
          if(silkWood.tv.station == 1)
          {
            silkWood.foodPile.removeFood(silk.eatRate);
            silk.stomach += silk.eatRate;      
          }
          if(silkWood.tv.station == 2)
          {
            silk.energyEff =  Math.min(silk.energyEff+0.005,silk.default_energyEff+1);            
          }

          if(silk.stomach >= silk.stomachSize)
          {
            silk.stomach = silk.stomachSize;
            silk.stomachFull = true;
            this.taskNextPhase = "justSit";
          }else
          {
            this.stomachFull = false;
            this.v1--;
            if(this.v1 == 0 && silkWood.tv.station == 1)
            { //used tyo sync sound and animation
              this.taskNextPhase = "start";            
            }
          }
       }
       this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
      break;
     case "justSit":
         silk.stomachFull = false;
	 silk.command.com = "watchTV";
         this.taskNextPhase = "endGame";
         silk.command.run();
      break;
     case "endgame":
         silkWood.tv.off();
         this.taskNextPhase = "end";
         this.cont();
      break;
   }
 }

 //====================== EXERCISE =============================
 this.tb_exercise  = function()
 {
   switch(this.taskPhase)
   {
     case "start":
         silk.command.com = "walk";
         silk.command.v1 = 250;
         silk.command.v2 = 0;
         this.taskNextPhase = "startWorkout";
         silk.command.run();
      break;
     case "startWorkout":       
         silk.command.com = "exercise";
         this.taskNextPhase = "workout";
         silk.command.run();
         this.cont();     
       break;
     case "workout":
   //----------------- Involuntary ------------
         if(silk.isTired)
         {
           this.taskNextPhase = "tired";         
         }else if(silk.isCold)
         {
           if(silk.shiverTimer <= 0)
           {
             this.taskNextPhase = "tooCold"; 
           }else
           {
             silk.shiverTimer--;
           }
         }else if(silk.isHot)
         {
           if(silk.sweatTimer <= 0)
           {
             this.taskNextPhase = "tooHot"; 
           }else
           {
             silk.sweatTimer--;
           }
         }
         this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);         
         break;
     case "tired":
          this.taskNextPhase = "resting";         
          silk.psych = Math.max(silk.psych - 1,0);
          silk.command.com = "tired";
          silk.command.run();
      break;
     case "resting":
       if(!silk.isTired)
       { 
         this.taskNextPhase = "contWork";
         this.cont();
       }
       this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
        break;
     case "tooCold":
          this.taskNextPhase = "contWork";         
          silk.shiverTimer = silk.shiverDelay;
          silk.command.com = "tooCold";
          silk.command.run();
      break;
     case "tooHot":
          this.taskNextPhase = "contWork";         
          silk.sweatTimer = silk.sweatDelay;
          silk.command.com = "tooHot";
          silk.command.run();
      break;
     case "contWork":
          this.taskNextPhase = "workout";         
          silk.action.load(this.level,"dumbBell");
          silk.action.play(); 
          this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
      break;
  //----------------- -------------- ------------     
     case "endgame":
         this.taskNextPhase = "end";
         this.cont();
      break;
   }
 }

 //====================== STUDY =============================
 this.tb_study  = function()
 {
   switch(this.taskPhase)
   {

     case "start":
         silk.command.com = "goRead";
         this.taskNextPhase = "endGame";
         silk.command.run();
      break;
     case "endgame":
         this.taskNextPhase = "end";
         this.cont();
      break;
   }
 }

 //====================== NULL (does nothing - ie blank task) =============================
 this.tb_null  = function()
 {
   switch(this.taskPhase)
   {
      
     case "endgame":
         this.taskNextPhase = "end";
         this.cont();
      break;
   }

 }

 //====================== SLEEP =============================
 this.tb_sleep  = function()
 {
   switch(this.taskPhase)
   {
     case "start":
         silk.command.com = "sleep";
         this.taskNextPhase = "endGame";
         silk.command.run();
      break;
      
     case "endgame":
         this.taskNextPhase = "end";
         this.cont();
      break;
   }
 }
 //====================== STARTGAZING =============================
 this.tb_stargaze  = function()
 {
   if(sky.phase != 0)
   {
     this.tb_study()
     return;
   }
   
   switch(this.taskPhase)
   {
     case "start":
         silk.command.com = "stargazing";
         this.taskNextPhase = "stargaze";
         silk.command.run();
      break;
     case "stargaze":
         silk.command.com = "stargazing";
         this.taskNextPhase = "stargaze";
         silk.command.run();
       break;
      
     case "endgame":
         this.taskNextPhase = "end";
         this.cont();
      break;
   }
 }

 //====================== RESEARCH =============================
 this.tb_research  = function()
 {
   switch(this.taskPhase)
   {
     case "start":
         silk.command.com = "research";
         silk.command.v1 = Math.round(Math.random() * 400)
         this.taskNextPhase = "researching";
         silk.command.run();
      break;
     case "researching":
         silk.command.com = "research";
         silk.command.v1 = Math.round(Math.random() * 400)
         this.taskNextPhase = "researching";
         silk.command.run();
       break;
      
     case "endgame":
         this.taskNextPhase = "end";
         this.cont();
      break;
   }
 }

 //====================== MEDITATE =============================
 this.tb_meditate  = function()
 {
   switch(this.taskPhase)
   { 
     case "start":
         silk.command.com = "meditate";
         this.taskNextPhase = "meditate";
         silk.command.run();
      break;
     case "meditate":
         silk.command.com = "meditate";
         this.taskNextPhase = "meditate";
         silk.command.run();
       break;
      
     case "endgame":
         this.taskNextPhase = "end";
         this.cont();
      break;
   }
 }

 //====================== TV TIME =============================
 this.tb_tvTime  = function()
 {
   switch(this.taskPhase)
   {
     case "start":
         silk.command.com = "watchTV";
         this.taskNextPhase = "endGame";
         silk.command.run();
      break;
      
     case "endgame":
         silkWood.tv.off();
         silk.imgDiv.style.top = worldToScr(silkWood.home.floor,silk.imgDiv); 
         this.taskNextPhase = "end";
         this.cont();
      break;
   }
 }
 //====================== PLAY BALL =============================
 this.tb_playBall  = function()
 {

   if(gameStage != 10)
   {
     switch(this.taskPhase)
     {
       case "start":
           silk.command.com = "playBall";
           silk.command.run();
        break;
       case "endgame":
           throwButton.style.display = "none";
           bBall.imgSrc.style.display="none";
           this.taskNextPhase = "end";
           this.cont();
        break;
     }
   }else
   {
     this.tb_activateDevice();
   }
 }

 //====================== ACTIVATE DEVICE=============================
 this.tb_activateDevice = function()
 {
   if(silkWood.cave.deviceLevel <= 0)
   {
      checkStageComplete();
      silk.command.com = "taskCompleted";
      this.taskNextPhase = "end";         
      silk.command.run();
      return;
   }
   minY = -260;
   switch(this.taskPhase)
   {
     case "start":
         silk.command.com = "activateDevice";
         this.taskNextPhase = "playing"; 
         silk.command.run();
      break;
     case "playing":
         silk.command.com = "activateDevice";
         silk.command.run();
   //----------------- Involuntary ------------
         if(silk.isTired)
         {
           this.taskNextPhase = "tired";         
         }else if(silk.isCold)
         {
           if(silk.shiverTimer <= 0)
           {
             this.taskNextPhase = "tooCold"; 
           }else
           {
             silk.shiverTimer--;
           }
         }else if(silk.isHot)
         {
           if(silk.sweatTimer <= 0)
           {
             this.taskNextPhase = "tooHot"; 
           }else
           {
             silk.sweatTimer--;
           }
         }
         break;
     case "tired":
          this.taskNextPhase = "resting";         
          silk.psych = Math.max(silk.psych - 1,0);
          silk.command.com = "tired";
          silk.command.run();
      break;
     case "resting":
       if(!silk.isTired)
       { 
         this.taskNextPhase = "contWork";
         this.cont();
       }
       this.pollTimer = setTimeout("silk.task.cont()",this.pollInterval);
        break;
     case "tooCold":
          this.taskNextPhase = "contWork";         
          silk.shiverTimer = silk.shiverDelay;
          silk.command.com = "tooCold";
          silk.command.run();
      break;
     case "tooHot":
          this.taskNextPhase = "contWork";         
          silk.sweatTimer = silk.sweatDelay;
          silk.command.com = "tooHot";
          silk.command.run();
      break;
     case "contWork":
          this.taskNextPhase = "playing";         
          silk.action.load(this.level,"swingArmLeft");
          silk.action.play(); 
      break;
  //----------------- -------------- ------------   
  case "endgame":
         minY = 0;
         throwButton.style.display = "none";
         bBall.imgSrc.style.display="none";
         this.taskNextPhase = "end";
         this.cont();
      break;
   }
 }
}

