//Entire Script copyright 2007 Dexter Kofa/Reflective Layer
function commandObject()
{
  this.com = null;
  this.comPhase = "end";
  this.comNextPhase = "end";
  this.level = 4;
  this.v1;
  this.v2;
  this.v3;
  this.pollTimer;
  this.pollInterval = 10000;


 this.run = function()
 {
   if(this.level <= silk.minAccess)
   {
     //silk.action.stop();
     this.comPhase = "start";
     silk.command["cb_" + this.com]();   
   }
 }

 this.cont = function()
 {
   if(this.level <= silk.minAccess && !silkIsPaused)
   {
     this.comPhase = this.comNextPhase;
     if(this.comPhase != "end")
     {
       //silk.action.stop();
       silk.command["cb_" + this.com]();   
     }else
     {
       silk.task.cont();
     }
   }
 }
 
 //************************* COMMAND BEHAVIOURS ******************************
 
 //====================== GREETINGS WALK=============================
 this.cb_greetings = function()
 {
   switch(this.comPhase)
   {
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = 330;
       silk.action.v2 = 0;
       this.comNextPhase = "greet";		//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "greet":
       soundMan.stop("music");
       silk.action.load(2,"dance");
       this.comNextPhase = "done";
       silk.action.play(); 
      break;
     case "done":
       soundMan.play("bgmusic","music");
       silkStart();
      break;
   }
 }

 //====================== WALK =============================
 this.cb_walk = function()
 {
   switch(this.comPhase)
   {
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = this.v1;
       silk.action.v2 = this.v2;
       this.comNextPhase = "endWalk";		//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "endWalk":
       this.comNextPhase = "end";
       this.cont(); 
      break;
   }
 }

  //====================== RETURN HOME=============================
 this.cb_returnHome = function()
 {
   silk.minAccess = 2;				//Special assignment
   this.level = 2;
   switch(this.comPhase)
   {
     case "start":
     if(gameLoading)
     {
       this.comNextPhase = "toHome";		
       this.cont();     
     }else
     {
       silkWood.cart.unhook(-69);
       silk.action.load(this.level,"walk");
       silk.action.v1 = -259;
       silk.action.v2 = 0;	//walk to left of cart
       this.comNextPhase = "toHome";		
       silk.action.play();
     }
    break;
   case "toHome":
     silkWood.cart.hook(90);
     silk.action.load(this.level,"walk");
     silk.action.v1 = 250;
     silk.action.v2 = 0;
     this.comNextPhase = "home";		//phase that Action should use whem it returns
     silk.action.play(); 
     soundMan.play("cart","aux");
    break;
   case "home":
     soundMan.play("null","aux");
     silkWood.cart.unhook(90);
     silk.isReturning = false;
     soundMan.play("null","music");
     silk.action.load(2,"dance");
     this.comNextPhase = "toWork";		//phase that Action should use whem it returns
     silk.action.play(); 
    break;
   case "toWork":
     soundMan.play("bgmusic","music");
     silk.task.pausedTask = "study";
     silk.restoreTask();
     townSequence = false;
    break;
   }
 }

 //====================== GO TO TOWN =============================
 this.cb_gotoTown = function()
 {
   silk.minAccess = 2;				//Special assignment
   this.level = 2;
   switch(this.comPhase)
   {
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.cart.getX()-91;
       silk.action.v2 = silkWood.cart.getY();
       this.comNextPhase = "takeCart";		//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "takeCart":
       silkWood.cart.hook(90);			//varieble is x offset of cart
       this.comNextPhase = "toHome";		
       this.cont();
      break;
     case "toHome":
       soundMan.play("cart","aux");
       silk.action.load(this.level,"walk");
       silk.action.v1 =360;
       silk.action.v2 = silkWood.home.food_y;
       this.comNextPhase = "loadStuff";		
       silk.action.play(); 
      break;
     case "loadStuff":
     silkWood.cart.unhook(90);
     cartImg.src = "world/cart/cart.png";
     soundMan.play("null","aux");
     silk.action.load(this.level,"walk");
     silk.action.v1 = silkWood.cart.getX()+68;
     silk.action.v2 = silkWood.cart.getY();
     this.comNextPhase = "toTown";		//phase that Action should use whem it returns
     silk.action.play(); 
    break;
   case "toTown":
     silkWood.cart.hook(-69);
     silk.action.load(this.level,"walk");
     silk.action.v1 = -300;
     silk.action.v2 = 0;
     this.comNextPhase = "town";		//phase that Action should use whem it returns
     silk.action.play(); 
     soundMan.play("cart","aux");
    break;
   case "town":
     silk.action.load(this.level,"standing");
     silk.action.play(); 
     this.level = 4;			//Resstore Access
     silk.isInTown = true;
     silk.townCounter = Math.floor((silk.townDelay -  silk.townDelay * 0.1) +  (Math.random() * silk.townDelay * 0.2) );
     cartImg.src = "world/cart/cart_empty.png";
     checkStageComplete();
    break;
   }
 }


 //====================== FILL CART =============================
 this.cb_fillCart = function()
 {
   var s,c;
   silk.minAccess = 2;				//Special assignment
   this.level = 2;
   switch(this.comPhase)
   {
   
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.cart.getX()-91;
       silk.action.v2 = silkWood.cart.getY();
       this.comNextPhase = "takeCart";		//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "takeCart":
       silkWood.cart.hook(90);			//varieble is x offset of cart
       this.comNextPhase = "toFoodProc";		
       this.cont();
      break;
     case "toFoodProc":
       soundMan.play("cart","aux");
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.home.food_x-146;
       silk.action.v2 = silkWood.home.food_y;
       this.comNextPhase = "getBook";		
       silk.action.play(); 
      break;
     case "getBook":
       soundMan.play("null","aux");
       silkWood.cart.unhook(90);
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.home.bed_x - 30;
       silk.action.v2 = silkWood.home.bed_y;
       this.comNextPhase = "readBook";		//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "readBook":
       silk.action.load(this.level,"readBook");
       this.comNextPhase = "end";       
       silk.sitHeight = silkWood.home.bedHeight;
       silk.imgDiv.style.top = worldToScr(silk.sitHeight,silk.imgDiv);  //Go to sit height;      
       silk.action.play(); 
       silk.minAccess = 4;				//Special assignment
       this.level = 4;
       silk.action.endOfAction();
       soundMan.play("slurpyFlow","aux");
      break;
   }
 }
 //======================GENERIC END OF TASK =============================
 this.cb_taskCompleted = function()
 {
   switch(this.comPhase)
   {
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.home.basket_x;
       silk.action.v2 = silkWood.home.basket_y;

       if(silk.hasBasket)
       {
         this.comNextPhase = "dropBasket";  //by passing unloading of content
       }else
       {
         this.comNextPhase = "hangOut";  //by passing unloading of content
       }
       silk.action.play();
       
      break;
     case "hangOut":
      silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.home.bed_x - 30;
       silk.action.v2 = silkWood.home.bed_y;
       this.comNextPhase = "read";	
       silk.action.play(); 
      break;
     case "read":
      silk.action.load(this.level,"readBook");
       this.comNextPhase = "end";       
       silk.sitHeight = silkWood.home.bedHeight;
       silk.imgDiv.style.top = worldToScr(silk.sitHeight,silk.imgDiv);  //Go to sit height;      
       silk.action.play(); 
      break;
     case "dropBasket":
       silk.action.v1 = 30;
       silk.action.v2 = 0;
       silk.action.load(this.level,"dropBasket");
       this.comNextPhase = "hangOut";
       silk.action.play(); 
      break;
   }
 }
 
 //====================== GO DIG SHAFT =============================
 this.cb_goDigShaft = function()
 {
   switch(this.comPhase)
   {
     case "start":
       silk.action.load(this.level,"walk");
       switch(silkWood.cave.stage)
       {
         case 0:
           silk.action.v1 = 10;
           silk.action.v2 = 0;
          break;
         case 1:
           silk.action.v1 = 10;
           silk.action.v2 = -1 * silkWood.cave.L1;
         break;
       }
        this.comNextPhase = "dropBasket";	//phase that Action should use whem it returns
        silk.action.play(); 
      break;
     case "dropBasket":
       silk.action.v1 = 32;
       silk.action.v2 = 0;       
       silk.action.load(this.level,"dropBasket");
       this.comNextPhase = "dig";       
       silk.action.play(); 
      break;
     case "dig":
       if(silkWood.cave.stage == 0)
       {
         silk.moveTo(silk.getX(),-1*silkWood.cave.L1);
         silk.floor = silk.getY();
       }
       silkWood.basket.content = "Dirt";
       silk.action.load(this.level,"dig");
       this.comNextPhase = "end";       
       silk.action.play();
       silk.action.endOfAction();
      break;
   }
 }
 
 //====================== GO DIG TUNNEL =============================
 this.cb_goDigTunnel = function()
 {
   switch(this.comPhase)
   {
     case "start":
       silk.action.load(this.level,"walk");
       if(silkWood.cave.stage == 4)
       {
         silk.action.v1 = silkWood.cave.L3 + 14;
       }else
       {
         silk.action.v1 = silkWood.cave.L2 + 14;
       }
       silk.action.v2 = -1 * silkWood.cave.L1;
       this.comNextPhase = "dropBasket";	//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "dropBasket":
       silk.action.v1 = 32;
       silk.action.v2 = 0;
       silk.action.load(this.level,"dropBasket");
       this.comNextPhase = "dig";       
       silk.action.play(); 
      break;
     case "dig":
       silkWood.basket.content = "Dirt";
       silk.action.load(this.level,"pickaxe");
       this.comNextPhase = "end";       
       silk.action.play();
       silk.action.endOfAction();
      break;
   }
 }
 
 //====================== GO BUILD FLOOR =============================
 this.cb_goBuildFloor = function()
 {
   switch(this.comPhase)
   {
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.cave.L3max + silkWood.cave.floorLength + 10;
       silk.action.v2 = -1 * silkWood.cave.L1;
       this.comNextPhase = "dropBasket";	//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "dropBasket":
       silk.action.v1 = 32;
       silk.action.v2 = 0;
       silk.action.load(this.level,"dropBasket");
       this.comNextPhase = "dig";       
       silk.action.play(); 
      break;
     case "dig":
       silkWood.basket.content = "Dirt";
       silk.action.load(this.level,"hammerFloor");
       this.comNextPhase = "end";       
       silk.action.play();
       silk.action.endOfAction();
      break;
   }
 }
 
 //====================== CREATE WATER PUMP =============================
 this.cb_goCreatePump = function()
 {
   switch(this.comPhase)
   {
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silk.command.v1;
       silk.action.v2 = silk.command.v2;
       this.comNextPhase = "maktarStealthHaze";	//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "maktarStealthHaze":
       silk.action.load(this.level,"maktar");
       this.comNextPhase = "end";
       silk.action.play(); 
       setTimeout("handPumpImg.style.display='inline'",4000);
       setTimeout("waterPipeImg.style.display='inline'",24000);
      break;
   }
 }
 
 //====================== TELEPORT =============================
 this.cb_goTeleport = function()
 {
   switch(this.comPhase)
   {
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silk.command.v1;
       silk.action.v2 = silk.command.v2;
       this.comNextPhase = "maktarStealthHaze";	//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "maktarStealthHaze":
       silk.action.load(this.level,"maktar");
       this.comNextPhase = "end";
       silk.action.play(); 
      break;
   }
 }
 
 //====================== GO GATHER WOOD =============================
 this.cb_goGetWood  = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = 100;
       silk.action.v2 = 0;
       this.comNextPhase = "dropBasket";	//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "dropBasket":
       silk.action.v1 = 40;
       silk.action.v2 = 0;
       silk.action.load(this.level,"dropBasket");
       this.comNextPhase = "gatherWood";	//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "gatherWood":
       silkWood.basket.content = "Wood";
       silk.action.load(this.level,"gatherWood");  //uses same animatiob
       this.comNextPhase = "end";       
       silk.action.play(); 
       silk.action.endOfAction();
      break;
   }
 }
 
 //====================== GO DRAIN CAVE =============================
 this.cb_goDrainCave = function()
 {
   switch(this.comPhase)
   {
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.cave.L2 + 10;
       silk.action.v2 = -1 * silkWood.cave.L1;
       this.comNextPhase = "dropBasket";	//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "dropBasket":
       silk.action.v1 = 32;
       silk.action.v2 = 0;
       silk.action.load(this.level,"dropBasket");
       this.comNextPhase = "dig";       
       silk.action.play(); 
      break;
     case "dig":
       silkWood.basket.content = "Water";
       silk.action.load(this.level,"pumpWater");
       this.comNextPhase = "end";       
       silk.action.play();
       silk.action.endOfAction();
      break;
   }
 }
 
 //====================== GO GATHER FOOD =============================
 this.cb_goGatherFood  = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = Math.round(200 + Math.random() * 160);
       silk.action.v2 = 0;
       this.comNextPhase = "dropBasket";	//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "dropBasket":
       silk.action.v1 = 40;
       silk.action.v2 = 0;
       silk.action.load(this.level,"dropBasket");
       this.comNextPhase = "gatherFood";	//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "gatherFood":
       silkWood.basket.content = "Berries";
       silk.action.load(this.level,"gatherFood");
       this.comNextPhase = "end";       
       silk.action.play(); 
       silk.action.endOfAction();
      break;
   }
 }
 
 //====================== GO DUMP DIRT =============================
 this.cb_goDumpDirt = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
       if(silkWood.cave.stage < 1 && silk.getX() == silkWood.leftShaft)
       {
         silk.moveTo(silk.getX(),silkWood.surfaceHeight);
       }
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.dumpSite;
       silk.action.v2 = 0;
       this.comNextPhase = "dumpDirt";	//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "dumpDirt":
       silk.action.load(this.level,"dump");
       this.comNextPhase = "end";
       silkWood.basket.unload();
       silk.action.play(); 
      break;
   }
 }

 //====================== GO EAT =============================
 this.cb_goEat = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.home.chair_x;
       silk.action.v2 = silkWood.home.chair_y;
       this.comNextPhase = "eat";	
       silk.action.play(); 
      break;
     case "eat":
       silk.action.load(this.level,"eat");
       this.comNextPhase = "end";       
       silk.sitHeight = silk.defaultSitHeight;
       silk.imgDiv.style.top = worldToScr(silk.sitHeight,silk.imgDiv);  //Go to sit height;      
       silk.action.play(); 
       silk.action.endOfAction();
      break;
   }
 }

 //====================== CHISEL WALL =============================
 this.cb_chisel = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
      silk.action.load(this.level,"walk");
       silk.action.v1 = 405;
       silk.action.v2 = -245;
       this.comNextPhase = "chisel";	
       silk.action.play(); 
      break;
     case "chisel":
       silk.action.load(this.level,"chisel");
       this.comNextPhase = "end";       
       silk.action.play(); 
       silk.action.endOfAction();
      break;
   }
 }
 //====================== GO DUMB BELL EXERCISE =============================
 this.cb_exercise = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
      silk.action.load(this.level,"walk");
       silk.action.v1 = 250;
       silk.action.v2 = 0;
       this.comNextPhase = "exercise";	
       silk.action.play(); 
      break;
     case "exercise":
       if(Math.random() >=0.5)
       {
       silk.action.load(this.level,"dumbBell");
       }else
       {
         silk.action.load(this.level,"jumpJack");
       }
       this.comNextPhase = "end";       
       silk.action.play(); 
      break;
   }
 }

 //====================== STARGAZE =============================
 this.cb_stargazing = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
      silk.action.load(this.level,"walk");
       silk.action.v1 = 90;
       silk.action.v2 = 0;
       this.comNextPhase = "stargaze";	
       silk.action.play(); 
      break;
     case "stargaze":
      silk.action.load(this.level,"stargazing");
       this.comNextPhase = "end";       
       silk.action.play(); 
      break;
   }
 }

 //====================== RESEARCH =============================
 this.cb_research = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
      silk.action.load(this.level,"walk");
       silk.action.v1 = silk.command.v1;
       silk.action.v2 = 0;
       this.comNextPhase = "research";	
       silk.action.play(); 
      break;
     case "research":
      silk.action.load(this.level,"research");
       this.comNextPhase = "end";       
       silk.action.play(); 
      break;
   }
 }

 //====================== MEDITATE =============================
 this.cb_meditate = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
      silk.action.load(this.level,"walk");
       silk.action.v1 = 250;
       silk.action.v2 = 0;
       this.comNextPhase = "meditate";	
       silk.action.play(); 
      break;
     case "meditate":
      silk.action.load(this.level,"meditate");
       this.comNextPhase = "end";       
       silk.action.play(); 
      break;
   }
 }

 //====================== GO READ BOOK =============================
 this.cb_goRead = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
      silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.home.bed_x - 30;
       silk.action.v2 = silkWood.home.bed_y;
       this.comNextPhase = "read";	
       silk.action.play(); 
      break;
     case "read":
      silk.action.load(this.level,"readBook");
       this.comNextPhase = "end";       
       silk.sitHeight = silkWood.home.bedHeight;
       silk.imgDiv.style.top = worldToScr(silk.sitHeight,silk.imgDiv);  //Go to sit height;      
       silk.action.play(); 
      break;
   }
 }

 //====================== GO SLEEP =============================
 this.cb_goSleep = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.home.bed_x;
       silk.action.v2 = silkWood.home.bed_y;
       this.comNextPhase = "sleep";		//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "sleep":
       silk.action.load(this.level,"sleep");
       this.comNextPhase = "end";       
       silk.action.play(); 
      break;
   }
 }

 //====================== GET BASKET =============================
 this.cb_getBasket = function()
 {
   switch(this.comPhase)
   {
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.basket.getX()-33;
       silk.action.v2 = silkWood.basket.getY();
       this.comNextPhase = "takeBasket";		//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "takeBasket":
       silk.action.load(this.level,"takeBasket");
       this.comNextPhase = "end";
       silk.action.play(); 
      break;
   }
 }

 //====================== UNLOAD BERRIES =============================
 this.cb_unloadBerries = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.home.food_x-50;
       silk.action.v2 = silkWood.home.food_y;
       this.comNextPhase = "dropBasket";		//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "dropBasket":
       silk.action.v1 = 30;
       silk.action.v2 = 0;
       silk.action.load(this.level,"dropBasket");
       this.comNextPhase = "unload";
       silk.action.play(); 
       setTimeout('silkWood.foodProcessor.vacuum()',3500);
      break;
     case "unload":
       silk.action.action = "unloadBerries";
       this.comNextPhase = "takeBasket";
       frameAnimation.src = "codeOnly";
       silk.action.play(); 
      break;
     case "takeBasket":
       silk.action.load(this.level,"takeBasket");
       this.comNextPhase = "end";
       silk.action.play(); 
      break;
   }
 }
 //====================== RETURN BASKET =============================
 this.cb_returnBasket = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
       if(silk.hasBasket)
       {
         this.comNextPhase = "returnBasket";
         this.cont();
       }else
       {
         silk.action.load(this.level,"walk");
         silk.action.v1 = silkWood.basket.getX()-33;
         silk.action.v2 = silkWood.basket.getY();
         this.comNextPhase = "takeBasket";		//phase that Action should use whem it returns
         silk.action.play(); 
       }
      break;
     case "takeBasket":
       silk.action.load(this.level,"takeBasket");
       this.comNextPhase = "returnBasket";
       silk.action.play(); 
      break;
     case "returnBasket":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.home.basket_x;
       silk.action.v2 = silkWood.home.basket_y;
       this.comNextPhase = "dropBasket";  //by passing unloading of content
       silk.action.play();
      break;
     case "unloadBasket":
       silk.action.action = "unloadBerries";
       frameAnimation.src = "codeOnly";
       this.comNextPhase = "dropBasket";		
       silk.action.play(); 
      break;
     case "dropBasket":
       silk.action.v1 = 30;
       silk.action.v2 = 0;
       silk.action.load(this.level,"dropBasket");
       this.comNextPhase = "end";
       silk.action.play(); 
      break;
   }
 }
 //====================== SLEEP =============================
 this.cb_sleep = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.home.bed_x;
       silk.action.v2 = silkWood.home.bed_y;
       this.comNextPhase = "sleep";		//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "sleep":
       silk.action.load(this.level,"sleep");
       silk.action.play(); 
   }
 }
 //====================== FRESH AIR =============================
 //Silk enjoys nature
 this.cb_freshAir = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = 230;
       silk.action.v2 = 0;
       this.comNextPhase = "sit";		//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "sit":
       silk.action.load(this.level,"bubbles");
       frameAnimation.loopCount = 20;
       this.comNextPhase = "end";		//phase that Action should use whem it returns
       silk.action.play(); 
     break;
   }
 }
 //====================== WATCH TV =============================
 this.cb_watchTV = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = silkWood.home.chair_x;
       silk.action.v2 = silkWood.home.chair_y;
       this.comNextPhase = "watch";		//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "watch":
       silk.action.load(this.level,"sittingRight");
       silk.sitHeight = silk.defaultSitHeight;
       silk.action.play(); 
       silkWood.tv.on();
   }
 }
 //====================== PLAY BALL =============================
 this.cb_playBall = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = 10;
       silk.action.v2 = 0;
       this.comNextPhase = "throw";		//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "throw":
       throwButton.style.display = "inline";
       silk.action.load(this.level,"swingArm");
       silk.action.play();
       this.comNextPhase = "wait";		//phase that Action should use whem it returns
      break;
     case "wait":
       throwButton.style.display = "none";
       silk.action.load(this.level,"standing");
       silk.action.play();
      break;
     case "goodResult":
       silkWood.mushroom.magic();
       silk.action.load(this.level,"special");
       this.comNextPhase = "throw";		
       silk.action.play();
      break;
     case "badResult":
       silk.action.load(this.level,"sad");
       this.comNextPhase = "throw";		
       silk.action.play();
      if(silk.energy > (0.19 * silk.energyBufferSize) )
      {
        silk.energy = silk.energy - (0.01 * silk.energyBufferSize)  
        silkInfoDiv.style.left = 50;
        silkInfoDiv.style.top = 100;
        silkInfoDiv.style.color = "red";
        silkInfoDiv.innerHTML =  "Energy: " + decFixedPoint((silk.energy/silk.energyBufferSize) * 100,1) + "%";
        setTimeout('silkInfoDiv.innerHTML = ""',5000);
      }
      break;
   }
 }
 //====================== ACTIVATE DEVICE=============================
 this.cb_activateDevice = function()
 {
   switch(this.comPhase)
   {
   
     case "start":
       silk.action.load(this.level,"walk");
       silk.action.v1 = 650;
       silk.action.v2 = -245;
       this.comNextPhase = "throw";		//phase that Action should use whem it returns
       silk.action.play(); 
      break;
     case "throw":
       throwButton.style.display = "inline";
       silk.action.load(this.level,"swingArmLeft");
       silk.action.play();
       this.comNextPhase = "wait";		//phase that Action should use whem it returns
      break;
     case "wait":
       throwButton.style.display = "none";
       silk.action.load(this.level,"standing");
       silk.action.play();
      break;
     case "goodResult":
       //silkWood.mushroom.magic();
       silk.action.load(this.level,"special");
       this.comNextPhase = "end";       
       silk.action.play();
       silkWood.elderPower.magic();
       silkWood.cave.deviceLevel = Math.max(0,silkWood.cave.deviceLevel - 5);
       elderDeviceImg.src = "world/device/device" + decFixedWidth(silkWood.cave.deviceLevel,4) + ".png";       
       this.comNextPhase = "end";
      break;
     case "badResult":
       silk.action.load(this.level,"sad");
       this.comNextPhase = "end";       
       if(silk.energy > (0.19 * silk.energyBufferSize) )
       {
         silk.energy = silk.energy - (0.01 * silk.energyBufferSize)  
         silkInfoDiv.style.left = -50;
         silkInfoDiv.style.top = 130;
         silkInfoDiv.style.color = "yellow";
         silkInfoDiv.innerHTML =  "Energy: " + decFixedPoint((silk.energy/silk.energyBufferSize) * 100,1) + "%";
         setTimeout('silkInfoDiv.innerHTML = ""',5000);
       }
      break;
   }
 }
 //**************************************************************************
 //      INVOLUNTARY COMMANDS         
 //**************************************************************************
 //====================== UNLOAD BERRIES =============================
 this.cb_tooCold = function()
 {
   switch(this.comPhase)
   {   
     case "start":
       silk.action.load(4,"shivering");
       frameAnimation.loopCount = 3;
       this.comNextPhase = "end";
       silk.action.play(); 
      break;
   }
 }

 this.cb_tooHot = function()
 {
   switch(this.comPhase)
   {   
     case "start":
       silk.action.load(4,"sweating");
       frameAnimation.loopCount = 3;
       this.comNextPhase = "end";
       silk.action.play(); 
      break;
   }
 }

 this.cb_tired = function()
 {
   switch(this.comPhase)
   {   
     case "start":
       silk.action.load(4,"sitting");
       silk.sitHeight = silk.floor;
       silk.action.play(); 
       silk.action.endOfAction();
      break;
   }
 }

 this.cb_sad = function()
 {
   switch(this.comPhase)
   {   
     case "start":
       silk.psych = 5;
       silk.action.load(3,"sad");
       frameAnimation.loopCount = 3;
       this.comNextPhase = "returnToNormal";
       silk.action.play(); 
      break;
     case "returnToNormal":
       silk.restoreTask();
      break;
   }
 }


 this.cb_happy = function()
 {
   switch(this.comPhase)
   {   
     case "start":
       silk.action.load(3,"happy");
       silk.action.play(); 
      break;
   }
 }


 this.cb_pause = function()
 {
   switch(this.comPhase)
   {   
     case "start":
       silk.action.load(1,"happy");
       silk.action.play(); 
      break;
   }
 }

 this.cb_veryHappy = function()
 {
   switch(this.comPhase)
   {   
     case "start":
       silk.action.load(3,"veryHappy");
       silk.action.play(); 
      break;
   }
 }


 this.cb_sick = function()
 {
  switch(this.comPhase)
   {   
     case "start":
       if(gameLoading && silk.inPainSleep)
       {
         this.comNextPhase = "inPain";
         this.cont();
         return;
       }
       if(silk.diseaseIndex == 0)
       {
         silk.action.load(1,"convertToSick");
       }else
       {
         silk.action.load(1,"convertToSick2");       
       }
       this.comNextPhase = "sickWalk";
       silk.action.play(); 
      break;
     case "sickWalk":
       silk.walkMode ="frozenWalk"
       silk.action.load(1,"walk");
       silk.action.v1 = silkWood.home.bed_x-17;
       silk.action.v2 = silkWood.home.floor;
       this.comNextPhase = "inPain";
       silk.action.play(); 
      break
     case "inPain":
       silk.action.load(1,"painSleep");
       this.comNextPhase = "medicalSleep";
       silk.action.play(); 
       silk.inPainSleep = true;
       cureButton.style.display = "inline";
   }
 }


 this.cb_cure = function()
 {
   switch(this.comPhase)
   {   
     case "start":
       if(silk.diseaseIndex > 1)
       {
         if(silk.hasBasket)
         {
            this.comNextPhase = "dropBasket";         
            this.cont();
            return;
         }
         silk.command.level = 1;
         silk.action.level = 1;
         silk.minAccess = 1;
         silk.action.load(1,"walk");
         silk.action.v1 = silkWood.home.bed_x-17;
         silk.action.v2 = silkWood.home.floor;
         this.comNextPhase = "cure";
         silk.action.play(); 
         silk.isSick = true;
       }else
       {
         this.comNextPhase = "cure";		
         this.cont();       
       }
      break
     case "dropBasket":
       silk.action.v1 = 30;
       silk.action.v2 = 0;
       silk.action.load(this.level,"dropBasket");
       this.comNextPhase = "start";
       silk.action.play(); 
      break;
     case "cure":
       if(!gameLoading)
       {
         if(silk.diseaseIndex < 2)
         {
           silk.sickRecovery = Math.random() * 3000 + 10
         }else
         {
           silk.sickRecovery = Math.random() * 400 + 10       
         }
         
       }
//silk.sickRecovery = 2
       silk.inPainSleep = false;
       silk.isRecovering = true;
       silk.action.load(1,"sickSleep");
       this.comNextPhase = "sleeping";
       silk.action.play(); 
       silk.action.endOfAction();
      break;
     case "sleeping":
       silk.sickRecovery--;   
       if(silk.sickRecovery <= 0)
       {
         silk.smartIndex =  silk.default_smartIndex;
         silk.energyEff = silk.default_energyEff;
         silk.sepSpeedEnergy = silk.default_sepSpeedEnergy;
         silk.tiredLevel = silk.defaultTiredLevel;
         silk.stomachSize = silk.defaultStomachSize;
         silk.energy = silk.default_energyBufferSize * .25;
         silk.stomach = 9000; //silk.stomachSize;
         silk.cured();
       }else
       {
         gTimersDiv.innerText = "Will recover in: " + decFixedPoint(silk.sickRecovery*30/3600,2) + " hours";
         this.pollTimer = setTimeout("silk.command.cont()",30 * 1000);                
       }
      break
   }
 }
}