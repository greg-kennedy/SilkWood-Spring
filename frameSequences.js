//Entire Script copyright 2007 Dexter Kofa/Reflective Layer

function framsetObject()
{
  //*** MOVEMENT
  this.walk = new framesObject("walk",1,15,-1,8,1,"walk");
  this.walkLeft = new framesObject("walkLeft",1,15,-1,8,1,"walk");
  this.climb = new framesObject("climb",0,16,-1,8,1.1,"climb");
  this.alignLeft = new framesObject("alignLeft",0,24,1,15,1,"null");

  //*** WORKING
  this.pickaxe = new framesObject("pickaxe",0,16,-1,8,4,"pickaxe");
  this.dump = new framesObject("dump",0,32,1,8,3,"dump");
  this.dig = new framesObject("dig",0,32,-1,8,4,"dig2");
  this.gatherFood = new framesObject("gatherFood",2,44,-1,8,2,"gatherFood2");
  this.takeBasket = new framesObject("drop_take_basket",48,0,1,8,3,"takeBasket");
  this.dropBasket = new framesObject("drop_take_basket",0,48,1,8,3,"dropBasket");
  this.pumpWater = new framesObject("pumpWater",0,21,-1,8,3,"handpump");
  this.hammerFloor = new framesObject("hammer",0,24,-1,8,4,"null");
  this.chisel = new framesObject("chisel",0,18,-1,8,2.3,"chisel");
  this.maktar = new framesObject("teleport",0,48,1,8,50,"magic");

  //*** LEISURE
  this.eat = new framesObject("eat2",0,64,-1,8,0.5,"eat");
  this.chairDance = new framesObject("chairDance",16,47,-1,16,0.5,"null");
  this.readBook = new framesObject("readBook",8,29,-1,4,0.5,"readBook");
  this.drinking = new framesObject("drinking",0,21,3,8,0.5,"null");
  this.dumbBell = new framesObject("exercise1",0,43,-1,16,3,"dumbBell");
  this.jumpJack = new framesObject("exercise2",0,40,-1,16,3,"jumpingJack");
  this.dance = new framesObject("dance",1,20,6,8,4,"disco2");
  this.swingArm = new framesObject("throw",0,6,-1,8,4,"swing3");
  this.swingArmLeft = new framesObject("throw2",0,6,-1,8,4,"swing3");
  this.bubbles = new framesObject("bubbles",15,157,-1,15,0.5,"null");
  this.meditate = new framesObject("meditate",0,21,12,15,4,"meditate");
  this.research = new framesObject("research",0,21,6,8,2,"null");
  this.stargazing = new framesObject("stargazing",8,88,2,8,2,"null");

  //*** EMOTION
  this.special = new framesObject("happy",1,21,4,8,0.5,"disco2");
  this.happy = new framesObject("happy",1,21,4,8,0.5,"null");
  this.mad = new framesObject("mad",1,22,1,8,0.5,"null");
  this.mad2 = new framesObject("mad2",1,22,1,8,0.5,"null");
  this.sad = new framesObject("sad",0,21,1,8,0.5,"cry");

  //*** POSTURE
  this.sittingRight = new framesObject("sittingRight",8,29,-1,8,0.5,"null");
  this.sitting = new framesObject("sitting",8,29,-1,8,0.5,"null");
  this.standing = new framesObject("standing",0,16,-1,8,0.5,"null");

  //*** SLEEP
  this.painSleep = new framesObject("painSleep",0,20,-1,5,1,"null");
  this.sickSleep = new framesObject("sickSleep",0,20,-1,4,1,"null");
  this.sleep = new framesObject("sleep",0,20,-1,8,0.1,"sleep");

  //*** FEELING
  this.shivering = new framesObject("shivering",1,21,-1,8,2,"null");
  this.sweating = new framesObject("sweating",1,21,-1,8,2,"null");
  this.sick = new framesObject("sick",0,20,-1,8,2,"null");
  this.convertToSick = new framesObject("frozen",0,79,1,2,2,"null");
  this.convertToSick2 = new framesObject("burned",0,79,1,2,2,"null");

}

function framesObject(s,sf,ef,lc,fr,e,sd)
{
  //creates an oject from animation frames
  this.src = s;
  this.startFrame = sf;
  this.endFrame = ef;
  this.loopCount = lc;
  this.frameRate = fr;
  this.energy = e;
  this.sound = sd;
}