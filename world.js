//Entire Script copyright 2007 Dexter Kofa/Reflective Layer
var minAccess;			//minmum acces required to perform function on the Elder

function worldObj()
{
     this.surfaceHeight = 0;	//height of surface level
     this.leftShaft = 10;	//x position of left shaft
     this.dumpSite = 150;	//
     this.home;			//defines where elder will stay.
     this.waterLevel= 248;
     //initilizes TV set
     this.tv = new tvSetObject();

     //initilizes Food Processor
     this.foodProcessor = new foodProcObject();

     //initilizes Food Pile
     this.foodPile = new foodPileObject();

     //initilizes Basket
     this.basket = new basketObject();

     //initilizes Cart
     this.cart = new cartObject();

     //initilizes teleport
     this.teleporter = new teleportObject();

     //initilizes Elder Power
     this.elderPower = new elderPowerObject();

     //initilizes Radar
     this.radar = new radarObject();

     //initilizes mushroom
     this.mushroom = new mushroomObject();


     //initilizes woodpile
     this.plyWood = new woodPileObject();

     //initilizes Cave
     this.cave = new caveObject();
//this.cave.setCave(248,180);

     //initilizes Tree House
     this.treeHouse = new treeHouseObject();
     
     
     this.home = this.treeHouse;    


    this.init = function()
    {
      //initializes world
     this.foodPile.setFood(0);
     this.basket.moveTo(600,this.surfaceHeight);
     this.cart.moveTo(350,0);  //must me at surface height

     this.cave.setCave(0,0,0);   //max 240, max 250
     this.cave.setWaterLevel(248); 
     this.cave.setFloorLength(0);

     this.teleporter.init();

    }
}

function worldDynObject(img)
{
  //creates an virtual object that can interact with the world
  //i = object index
  //img = string(image path)
  i = worldArray.length;
  
  worldArray[i] = this;
  this.obj = "worldArray[" + i + "]";	//name of current object
  this.imgSrc = document.createElement("img");
  this.imgSrc.style.display = "none";
  this.imgSrc.style.position = "absolute";
  this.imgSrc.style.left = 0;
//this.imgSrc.style.border = "2px solid red";
  this.imgSrc.style.top = 0;
  this.imgSrc.style.zIndex = 15;

  this.imgSrc.src = img;
  this.physics = new physicsObj();
  this.physics.parent = this;
  frontDisplay.appendChild(this.imgSrc);  
  this.physics.init();
  
  
}




function syncDisplay(y1)
{
  //sync display to keep Elder in view
  //disp_animator.stop();		//stops all current motion in screen.
  if(y1 < silk.Y)
  {
    disp_animator.attributes.top = {to: -1*(y1+40)};  
  }else
  {
    disp_animator.attributes.top = {to: -1*(y1+60)};  
  }
  disp_animator.duration = 2 + Math.abs(silk.Y - y1)/silk.climbSpeed;        
  setTimeout('disp_animator.animate()',100);     //moves object to x1,y1   
}

function caveObject()
{
  //represents the cave where the Elder will live
  this.L1 = 0;		//depth of vertical tunnel
  this.L1b = 40;	//depth of vertical tunnel where ladder is needed
  this.L2 = 0;		//length of horizontal tunnel
  this.L3 = 0;		//width of chamber
  this.L1max = 240;	//final depth of vertical tunnel
  this.L2max = 175;	//final length of horizontal tunnel
  this.L3max = 205;	//final width of chamber
  this.stage = 0;	//stage of cave development
  this.waterLevel = 248;
  this.floorLength = 0;
  this.waterPump = false;
  this.deviceLevel = 0;
  
  this.dig = function(d)
  {
    var t;
    //dig down with shovel addtional depth d
    if(this.stage < 2)
    {
      this.setCave_L1(this.L1 + d);  
    }else if(this.stage == 2)
    {
      this.setCave_L2(this.L2 + d);  
    }else if(this.stage == 4)
    {
      this.setCave_L3(this.L3 + d);      
    }
    
    
    if(this.stage == 4 && this.L2 >= this.L3max)
    {
      this.stage = 5;
      this.L2 = this.L3max;
      this.setCave_L3(this.L2 + d);  
    }else if(this.stage == 2 && this.L2 >= this.L2max)
    {
      this.stage = 3;
      this.L2 = this.L2max;
      this.setCave_L2(this.L2);  
    }else if(this.stage == 1 && this.L1 >= this.L1max)
    {
      this.stage = 2;
      this.L1 = this.L1max;
      this.setCave_L1(this.L1);  
    }else if(this.stage < 2 && this.L1 > this.L1b)
    {
      this.stage = 1;
    }
    
  }
  
  this.setCave_L1 = function(d)
  {
    this.L1 = Math.min(d,this.L1max);    
    t = document.getElementById("ug_l1");
    t.style.clip = "rect(" + this.L1 + " auto auto auto)";        
  }

  this.setCave_L2 = function(d)
  {
    this.L2 = Math.min(d,this.L2max);    
    t = document.getElementById("ug_l2");
    t.style.clip = "rect(auto auto auto " + this.L2 + ")";      
  }

  this.setCave_L3 = function(d)
  {
    this.L3 = Math.min(d,this.L3max);    
    if(d > this.L2max)
    {
      t = document.getElementById("ug_l2");
      t.style.clip = "rect(auto auto auto " + this.L3 + ")";
      if(this.L3 == this.L3max)
      {
        this.stage = 5;
      }
    }
  }

  this.setCave = function(l1,l2,l3)
  {
    //sets the configuration of the cave
   this.setCave_L1(l1);  
   this.setCave_L2(l2); 
   this.setCave_L3(l3); 
   if(!gameLoading)
   {
     if(this.L1 >= this.L1b)
     {
       this.stage = 1;
     }
     
     if(this.stage == 1 && this.L1 >= this.L1max)
     {
       this.stage = 2;
       this.L1 = this.L1max;
     }else if(this.stage < 2 && this.L1 > this.L1b)
     {
       this.stage = 1;
     }
     
     if(this.stage == 2  && this.L2 >= this.L2max)
     {
       this.stage = 3;
       this.L2 = this.L2max;
     
     }

     if(this.stage == 4  && this.L3 >= this.L3max)
     {
       this.stage = 5;
       this.L3 = this.L3max;
   
     }
   }
  }
  
  this.sync = function()
  {
    this.setCave(this.L1,this.L2,this.L3);
    this.setWaterLevel(this.waterLevel);
    elderDeviceImg.src = "world/device/device" + decFixedWidth(this.deviceLevel,4) + ".png";
  }

  
  this.drain = function(d)
  {
    //drain amount d of water from cave;
    this.setWaterLevel(this.waterLevel - d);   
  }
  
  this.setWaterLevel = function(lv)
  {
    t = document.getElementById("caveWater");
    lv = Math.max(lv,0);    
    t.style.clip = "rect(" + (248-lv) + " auto auto auto)";            
    this.waterLevel = lv;
    if(this.waterLevel == 0 && !gameLoading)
    {
      this.stage = 4;
      this.L3 = this.L2;
    }    
    
  }
  


  this.buildFloor = function(d)
  {
    //build amount d to add to floor;
    this.setFloorLength(this.floorLength + d);   
  }
  
  this.setFloorLength = function(lv)
  {
    t = document.getElementById("caveFloor");
    lv = Math.min(lv,486);    
    t.style.clip = "rect(auto " + lv + " auto auto)";            
    this.floorLength = lv;
    if(this.floorLength == 486)
    {
      this.stage = 6;
    }    
    
  }
}

function tvSetObject()
{
  this.status = false;		//false if tv is off
  this.animation = new animation('silkWood.tv.animation');
  this.animation.srcObj = document.getElementById("tvSet");
  this.animation.src = "world/tv/tv";
  this.animation.startFrame = 158;
  this.animation.endFrame = 370;
  this.animation.loopCount = -1;
  this.animation.endCallBack = "";
  this.animation.frameRate = 4;
  this.station = 1;
  
  this.on = function()
  {
    this.animation.srcObj.style.display = "block";
    this.changeStation(1);
    this.status = true;
  }


  this.off = function()
  {
    this.animation.srcObj.style.display = "none";
    this.animation.stop();
    soundMan.play("null","aux");
    this.status = false;
  }
  
  this.changeStation = function(s)
  {
    //changes the TV to a different Channel
    soundMan.play("tv_" + s,"aux");
    
    switch(s)
    {
      case 1:
        this.animation.src = "world/tv/tv";
        this.animation.startFrame = 158;
        this.animation.endFrame = 370;      
        this.animation.frameRate = 4;
        this.animation.start();
       break;
      case 2:
        this.animation.src = "world/tv2/tv";
        this.animation.startFrame = 0;
        this.animation.endFrame = 163;      
        this.animation.frameRate = 10;
        this.animation.start();      
       break;
    }
    this.station = s;
  }

}



function mushroomObject()
{
  this.animation = new animation('silkWood.mushroom.animation');
  this.animation.srcObj = document.getElementById("mushroomImg");
  this.animation.src = "world/mushroom/mushroom";
  this.animation.startFrame = 1;
  this.animation.endFrame = 47;
  this.animation.loopCount = 1;
  this.animation.endCallBack = "";
  this.animation.frameRate = 15;
  
  this.magic = function()
  {
    this.animation.loopCount = 1;
    this.animation.start();
    soundMan.play("puff2","aux");
    if(gameStage != 10)
    {
      if(silk.energy < (0.89 * silk.energyBufferSize) )
      {
        silk.energy = silk.energy + (0.05 * silk.energyBufferSize)  
        silkInfoDiv.style.left = 50;
        silkInfoDiv.style.top = 100;
        silkInfoDiv.style.color = "lime";
        silkInfoDiv.innerHTML =  "Energy: " + decFixedPoint((silk.energy/silk.energyBufferSize) * 100,1) + "%";
      }    
    }
    setTimeout('soundMan.play("null","aux")',3000);
    setTimeout('silkInfoDiv.innerHTML = ""',5000);
  }

}

function radarObject()
{
  this.status = false;
  this.animation = new animation('silkWood.radar.animation');
  this.animation.srcObj = document.getElementById("radarImg");
  this.animation.src = "world/radar/radar";
  this.animation.startFrame = 0;
  this.animation.endFrame = 99;
  this.animation.loopCount = -1;
  this.animation.endCallBack = "";
  this.animation.frameRate = 15;
  this.animation.animationMode = "cont";
  
  this.pulse = function()
  {
    var l1,l2;
    l1 = 10000;
    l2 = 30000;
    
    this.animation.srcObj.style.display = "inline";
    this.on();
    setTimeout('silkWood.radar.off()',3000 + Math.random() * l1)
    setTimeout('silkWood.radar.pulse()',30000 + Math.random() * l2)
  }

  this.on = function()
  {
    this.animation.start();
    this.status = true;
  }


  this.off = function()
  {
    this.animation.stop();
    this.status = false;
  }

}


function elderPowerObject()
{
  this.animation = new animation('silkWood.elderPower.animation');
  this.animation.srcObj = document.getElementById("ePowerImg");
  this.animation.src = "world/device/energy";
  this.animation.startFrame = 0;
  this.animation.endFrame = 105;
  this.animation.loopCount = 1;
  this.animation.endCallBack = "";
  this.animation.frameRate = 30;
  
  this.magic = function()
  {
    this.animation.loopCount = 1;
    this.animation.start();
    soundMan.play("magic","aux");
    setTimeout('soundMan.play("null","aux")',4000);
  }

}


function foodProcObject()
{
  this.status = "off";
  this.animation = new animation('silkWood.foodProcessor.animation');
  this.animation.srcObj = document.getElementById("foodProcImg");
  this.animation.src = "world/miniSilo/process";
  this.animation.startFrame = 0;
  this.animation.endFrame = 180;
  this.animation.loopCount = 1;
  this.animation.endCallBack = "";
  this.animation.frameRate = 15;
  
  this.process = function()
  {
    this.animation.startFrame = 90;
    this.animation.endFrame = 241;
    this.animation.loopCount =4;
    this.animation.frameRate = 30;
    this.animation.start();
    soundMan.play("siloProcess","aux");
  }


  this.vacuum = function()
  {
    this.animation.startFrame = 89;
    this.animation.endFrame = 0;
    this.animation.loopCount = 1;
    this.animation.frameRate = 20;
    this.animation.start();
    soundMan.play("siloVacuum","aux");
    setTimeout("silkWood.foodProcessor.stop()",20000);
  }
  
  this.stop = function()
  {
    this.animation.reset();
    soundMan.play("null","aux");
  }

}




function cartObject()
{
  this.amount = 0;		//amount of content in cart
  this.content = "food"		// type of stuff in cart
  this.maxSize = 30000;
  this.full = false;
  this.X = 0;
  this.Y = 0;
  
  
  this.addItem = function(a)
  {
    this.amount += a;
    if(this.amount >= this.maxSize)
    {
      this.full = true;
      this.amount = this.maxSize;
    }
    this.setContent(this.amount);
  }
  

  this.hook = function(d)
  {
    //hook  cart to the Silk DIV
    //d = distant offset of hook
    s = document.getElementById("silkDiv");
    c = document.getElementById("cartDiv");
    s.insertBefore(c);
    c.style.left= d;
    c.style.top = 189;
    silk.hasCart = true;
  }

  this.unhook = function(d)
  {
    //unhook cart from the Silk DIV
    //d = distant offset of hook
    f = document.getElementById("frontDisplay");
    s = document.getElementById("silkDiv");
    c = document.getElementById("cartDiv");
    f.insertBefore(c,s);
    this.updateLocation(d,0);
    silk.hasCart = false;

  }
  
  this.getX = function()
  {
    //returns X coordinate;
   return this.X;
  }

  this.getY = function()
  {
    //returns Y coordinate;
   return srcToWorld(this.Y,cartDiv);
  }
   
  this.moveTo = function(x,y)
  {
    //put basket at that location
    cartDiv.style.left = x;
    this.X = x;
    this.Y = worldToScr(y,cartDiv);
    cartDiv.style.top = this.Y;
  }
  
  this.sync = function()
  {
    //sync objects visual location with object data
    this.moveTo(this.getX(),this.getY() );
  }
  
  this.updateLocation = function(x,y)
  {
    //updates the location of the cart
    //x,y are offset to where basket is played relative to the Elder
    var b;
    b = document.getElementById("cartDiv");
    if(silk.hasCart)
    {
      this.moveTo(silk.getX() + x,silk.getY() + y);
    }else
    {
      this.moveTo(this.getX() + x,this.getY() + y);
    }
  }
  
  this.unload = function()
  {
     //unloads entire content of cart and returns amount
     var a;
     a = this.amount;
     this.amount = 0;
     this.full = false;
     return a;
  }

}


function basketObject()
{
  this.amount = 0;		//amount of content in basket
  this.content = "Air"		// type of stuff in basket
  this.size = 50;
  this.full = false;
  this.empty = true;
  this.X = 0;
  this.Y = 0;
  
  this.addItem = function(a)
  {
    this.amount += a;
    this.empty = false;
    if(this.amount >= this.size)
    {
      this.full = true;
      this.amount = this.size;
    }
  }
  
  
  this.removeItem = function(a)
  {
    this.amount -= a;
    this.full = false;
    if(this.amount <= 0)
    {
        this.empty = true;
	this.amount = 0;
    }
  }

  this.take = function()
  {
    //hide and updates location
    document.getElementById("imgBasket").style.display = "none"; 
    silk.hasBasket = true;;
  }

  this.drop = function(x,y)
  {
    //show and updates location
    this.updateLocation(x,y);
    document.getElementById("imgBasket").style.display = "inline";
    silk.hasBasket = false;;
    silk.walkMode = "walk";
  }
  
  this.getX = function()
  {
    //returns X coordinate of elder;
   return this.X;
  }

  this.getY = function()
  {
    //returns Y coordinate of elder;
   return srcToWorld(this.Y,imgBasket);
  }
   
  this.moveTo = function(x,y)
  {
    //put basket at that location
    imgBasket.style.left = x;
    this.X = x;
    this.Y = worldToScr(y,imgBasket);
    imgBasket.style.top = this.Y;
    
  }
    
  this.sync = function()
  {
    //sync objects visual location with object data
    this.moveTo(this.getX(),this.getY() )
  }

  this.updateLocation = function(x,y)
  {
    //updates the location of the basket
    //x,y are offset to where basket is played relative to the Elder
    var b;
    b = document.getElementById("imgBasket");
    if(silk.hasBasket)
    {
      this.moveTo(silk.getX() + x,silk.getY() + y);
    }else
    {
      this.moveTo(this.getX() + x,this.getY() + y);
    }
  }
  
  this.unload = function()
  {
     //unloads entire content of basket and returns amount
     var a;
     a = this.amount;
     this.amount = 0;
     this.content = "Air";
     this.full = false;
     this.empty = true;
     return a;
  }

}


function foodPileObject()
{
  this.amount = 0;		//food that silk has availble to eat(i.e. food in pile at home)
  this.maxSize = 40000;
  this.isFull = false;
  this.x = null;			//Food pile location
  this.y = null;

  this.addFood = function(f)
  {
    setTimeout('silkWood.foodProcessor.process()',2000);
    this.setFood(this.amount + f*4);
  }
  
  
  this.removeFood = function(f)
  {
    this.setFood(this.amount - f);  
  }
  
  
  this.setFood = function(f)
  {
    if(f < 0)
    {
      f = 0;
    }    
    this.amount = f;
    if(this.amount >= this.maxSize)
    {
      this.amount = this.maxSize;
      this.isFull = true;
    }else
    {
      this.isFull = false;
    }
    foodPile.style.clip="rect(" + (55 - Math.round(48/this.maxSize * f) - 7 ) + " auto auto auto)";
    
  }
  
  this.sync = function()
  {
    this.setFood(this.amount);
  }

}



function woodPileObject()
{
  this.maxSize = 100;
  this.amount = 100;
  this.available = true;
  this.active = false;
  this.srcObj = document.getElementById("woodPileImg");
  
  
  this.removeWood = function(f)
  {
    this.setWood(this.amount - f);  
  }
  
  
  this.setWood = function(f)
  {
    if(f < 0)
    {
      f = 0;
    }    
    this.amount = Math.max(f,0);
    
    woodPileImg.style.clip="rect(" + (120 - Math.round(120/this.maxSize * f) - 7 ) + " auto auto auto)";
    
    if(this.amount >= this.maxSize)
    {
      woodPile.style.display = "none";
    }else
    {
      woodPile.style.display = "block";    
    }
  }
}




function treeHouseObject()
{
  this.bed_x = 610;
  this.bed_y = 0;
  this.bedHeight = 50;
  this.chair_x = 557;
  this.chair_y = 0;
  this.basket_x = 570;
  this.basket_y = 0;
  this.glass_x;
  this.glass_y;
  this.food_x = 550;
  this.food_y = 0;
  this.floor = 0;

}

function teleportObject()
{
  this.srcObj;		//object to teleport in(string);
  this.vis = 10;
  this.dec = 10;
  this.active = false;
  this.timer;
  this.objStat;

  this.init = function()
  {
    tlpAnimation.srcObj = document.getElementById("teleportImg");
    tlpAnimation.src = "action/" + "teleport2"+ "/silk";
    tlpAnimation.startFrame = 14;
    tlpAnimation.endFrame = 78;
    tlpAnimation.loopCount = -1;
    tlpAnimation.frameRate = 15;
    tlpAnimation.init();  
  }
  
  
  this.start = function(o)
  {
    //example = silkWood.waterPump
    if(!this.active)
    {
      this.srcObj =  document.getElementById(o);
      this.srcObj.style.display = "inline";
      this.vis = 100;
      tlpAnimation.srcObj.style.left = this.srcObj.offsetLeft;
      tlpAnimation.srcObj.style.top = this.srcObj.offsetTop-10;
      tlpAnimation.srcObj.style.width = this.srcObj.offsetWidth+20;
      tlpAnimation.srcObj.style.height = this.srcObj.offsetHeight+20;
      tlpAnimation.start();  
      this.active = true;
      this.timer = setTimeout('silkWood.teleporter.cont()',500);
    }
  }
  
  
  this.cont = function()
  {
    this.vis = Math.max(this.vis - this.dec,0);
    setOpacity("teleportImg",this.vis);
    if(this.vis != 0)
    {
      this.timer = setTimeout('silkWood.teleporter.cont()',500);    
    }else
    {
     tlpAnimation.srcObj.style.display = "none";    
     setOpacity("teleportImg",100);
     this.active = false;
    }
  }
}

//**************************************  NON OBJECTS


function changeTVStation()
{
   if(silkWood.tv.station == 1)
   {
     silk.action.v1 = silk.action.action;
     silkWood.tv.changeStation(2);
     silk.action.load(silk.task.level,"chairDance");
     silk.sitHeight = silk.defaultSitHeight;
     silk.action.play(); 
   }else
   {
     silkWood.tv.changeStation(1); 
     silk.action.load(silk.task.level,silk.action.v1);     
     silk.sitHeight = silk.defaultSitHeight;
     silk.action.play(); 
   }
}
