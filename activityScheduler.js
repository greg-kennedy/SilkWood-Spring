//Entire Script copyright 2007 Dexter Kofa/Reflective Layer
var hourSelectArray = new Array("12AM_0","1AM_1","2AM_2","3AM_3","4AM_4","5AM_5","6AM_6","7AM_7","8AM_8","9AM_9","10AM_10","11AM_11","12PM_12","1PM_13","2PM_14","3PM_15","4PM_16","5PM_17","6PM_18","7PM_19","8PM_20","9PM_21","10PM_22","11PM_23");
var actionSelectArray = new Array("Sleep_sleep","Watch TV_tvTime","Gather Berries_pickBerries","Study_study","Exercise_exercise","Meal Time_mealTime","Dig Habitat Shaft_digHabitatShaft","Dig Habitat Tunnel_digHabitatTunnel","Drain Cave Water_drainWater","Chisel Wall_chiselWall","Meditate_meditate","Play Ball!_playBall","Stargazing_stargaze","Research_research");
var actionStatusArray = new Array(true,true,true,true,true,true,false,false,false,false,true,false,true,true);
var schedulerInterval = 5000;   //in ms
var schedulerActive = true;
var normalScheduleArray = new Array();
var activeScheduleArray = new Array();
activeScheduleArray[0] = 0; //6
activeScheduleArray[1] = 0; //6
activeScheduleArray[2] = 0; //2
activeScheduleArray[3] = 0; //1
activeScheduleArray[4] = 0; //7
activeScheduleArray[5] = 0; //3 
activeScheduleArray[6] = 0; //0   
activeScheduleArray[7] = 0;  //0
activeScheduleArray[8] = 0;  //4
activeScheduleArray[9] = 0;  //5
activeScheduleArray[10] = 0;  //5
activeScheduleArray[11] = 0;  //5
activeScheduleArray[12] = 0;  //5
activeScheduleArray[13] = 0;  //5
activeScheduleArray[14] = 0;  //5
activeScheduleArray[15] = 0;  //5
activeScheduleArray[16] = 0;  //5
activeScheduleArray[17] = 0;  //5
activeScheduleArray[18] = 0;  //5
activeScheduleArray[19] = 0;  //5
activeScheduleArray[20] = 0;  //5
activeScheduleArray[21] = 0;  //5
activeScheduleArray[22] = 0;  //5
activeScheduleArray[23] = 0;  //5
var maxTask = 14;


function getSchedulerData()
{
  return activeScheduleArray.join(",");    
}

function setSchedulerData(d)
{
  activeScheduleArray = null;
  eval("activeScheduleArray = new Array(" + d + ")");
}


function scheduler()
{
   //manages silkwood's longterm activites
  this.currentActivity = "";
  this.nextActivity = "";
  this.activeSchedules = new Array();
  this.returnTimer = "";
  this.currentHourObj = null;
  this.taskBarHeightLevel = 0;
  this.maxTaskBarLevel = 1;

  this.init = function()
  {

    //create a "free creture medal"
    var ld,li,la,sp,db,yp,t;
    sp = 41;
    for(var a=0; a<24;a++)
    {
      ld = document.createElement("div");
      ld.style.position = "absolute";

      la = document.createElement("img");
      la.style.position = "absolute";


      if(a < 12)
      {
        ld.style.left = 244 + (a * sp);
        ld.style.top = 10;

        la.src = "screens/sch_handle_up.png";
        la.style.left = 10;
        la.style.top = 25;
      }else
      {
        ld.style.left = 244 + ((a-12) * sp);
        ld.style.top = 140;      

        la.src = "screens/sch_handle_down.png";
        la.style.left = 10;
        la.style.top = -25;
      }

      li = document.createElement("img");    
      li.src = "screens/hourImg.png";
      li.style.position = "absolute";
      li.id = "hourIcon_" + a;
      li.style.border = "1px solid white";
      li.onclick = function(){masterPlan.loadHourTask(this.id)};
      li.style.left = 0;
      li.style.top = 0;
      li.style.cursor = "pointer";
      li.style.backgroundColor = "ccc0b0";

      ld.appendChild(la);
      ld.appendChild(li);
      UI_scheduler.insertBefore(ld,sch_HourPlate);
    }
   //Render Task type icons    
    yp=0;
    for(var a=0; a<2;a++)
    {
      for(var b=0; b<8;b++)
      {
        if(yp <maxTask)
        {
          la = document.createElement("img");
          la.style.position = "absolute";
          la.style.border = "1px solid white";
          la.id = "taskMainIcon_" + yp;
          if(actionStatusArray[yp])
          {
            la.src = "screens/scheduler/taskIconB_" + yp + ".png";
            la.onmouseover = function(){masterPlan.loadHourTask2(this.id)};
            la.onmouseout = function(){masterPlan.unHiliteIcon(this)};
            la.onclick = function(){masterPlan.selectTask(this)};
          }else
          {
            la.src = "screens/scheduler/taskIconB_" + yp + "_bw.png";          
          }
          la.style.left = 10 + (b * 60);
          la.style.top = 25 + a * 80;
          sch_taskBar.insertBefore(la);
          yp++;
        }
      }

    }
    this.loadSchedule(activeScheduleArray)
  }

 
  this.updateTaskIcons = function()
  {
     //update Task type icons    
      var yp=0;
      for(var a=0; a<2;a++)
      {
        for(var b=0; b<8;b++)
        {
          if(yp <maxTask)
          {
            la = document.getElementById("taskMainIcon_" + yp);
            if(actionStatusArray[yp])
            {
              la.src = "screens/scheduler/taskIconB_" + yp + ".png";
              la.onmouseover = function(){masterPlan.loadHourTask2(this.id)};
              la.onmouseout = function(){masterPlan.unHiliteIcon(this)};
              la.onclick = function(){masterPlan.selectTask(this)};
            }else
            {
              la.src = "screens/scheduler/taskIconB_" + yp + "_bw.png";          
              la.onmouseover = null;
              la.onmouseout = null;
              la.onclick = null;
            }
            yp++;
          }
        }
  
      }

  }
  
  this.moveTaskBarUp= function()
  {
    this.taskBarHeightLevel = Math.max(this.taskBarHeightLevel-1,0);
    sch_taskBar.style.top = this.taskBarHeightLevel * -80;
  }

  this.moveTaskBarDown = function()
  {
    this.taskBarHeightLevel = Math.min(this.taskBarHeightLevel+1,this.maxTaskBarLevel);
    sch_taskBar.style.top = this.taskBarHeightLevel * -80;
  }

  this.selectTask = function(i)
  {
    //selects and binds a task to an hour slot
    //i = icon img object
    var e;
    if(this.currentHourObj != null)
    {
      e = i.src.split("taskIconB_")[1];
      this.currentHourObj.src = "screens/scheduler/taskIcon_" + e;
    }
  }
  
  this.unHiliteIcon = function(i)
  {
    //icon object
    i.style.border = "1px solid white";    
  }
  
  this.loadHourTask2 = function(h)
  {
    //loads the task for hour in the the detail Task window
    //h = string string name of image obejct
    var s,o,t,d;
    d = document.getElementById(h);
    t = d.src.split("taskIconB_")[1];
    sch_detailTaskImg.src = "screens/scheduler/task_" + t;
    d.style.border = "2px solid yellow";

  }

  this.loadHourTask = function(h)
  {
    //loads the task for hour in the the detail Task window
    //h = string string name of image obejct
    var s,o,t,d;
    d = document.getElementById(h);
    t = d.src.split("taskIcon_")[1];
    sch_detailTaskImg.src = "screens/scheduler/task_" + t;
    if(this.currentHourObj != null)
    {
      this.currentHourObj.style.border = "1px solid white";
    }
    d.style.border = "2px solid yellow";
    this.currentHourObj = d;

  }


 this.toggleTaskWindow = function()
 {
   if(sch_taskBarDiv.style.display == "none")
   {
     sch_taskBarDiv.style.display = "block";
   }else
   {
     sch_taskBarDiv.style.display = "none";   
   }
 }
 
 this.loadSchedule = function(ar)
 {
   //Loads all icons from schedule array ar
   //ar = schedule array
   var d,t;
   for(var a=0; a<24;a++)
   {
     d = document.getElementById("hourIcon_" + a);
     d.src = "screens/scheduler/taskIcon_" + ar[a] + ".png";
     t = a + ":00 AM - "; 
     if(a == 0)
     {
       t = "12:00 AM - "; 
     }else if(a > 12)
     {
       t = (a - 12) + ":00 PM - "; 
     }
     
     if(platform == "hta")
     {
       d.alt = t + this.iconToTask(d.src);
     }

   }
   
 }
 
 this.iconToTask = function(iS)
 {
   //converts icon src url to friendly task name
   //iS = string
   iS = iS.split("taskIcon_")[1];
   iS = parseInt(iS.split(".")[0]);
   return actionSelectArray[iS].split("_")[0];
 }
 
 
 this.useSchedule = function(sA)
 {
   //makes schedule array sA the Active Schedule
   var ai;
   this.activeSchedules.length = 0;	//clears activeSchedules
   for(var c=0;c<sA.length;c++)
   { 
     ai = parseInt(sA[c].split("_")[1]);
     this.addSchedule(parseInt(sA[c].split("_")[0]),0,actionSelectArray[ai].split("_")[1]);   
   }
   this.activeSchedules.sort(schedulerSort);

 }

 this.updateActive = function()
 {
   //updates the active schedule with whats in the scheduler
   var i,d;
   for(var a=0; a<24;a++)
   {
     i = document.getElementById("hourIcon_" + a);
     d = i.src.split("taskIcon_")[1];
     activeScheduleArray[a] = parseInt(d.split(".")[0]);
   }
   closeScheduler();
 }
 
 
 this.checkSchedule = function()
 {  

   //checks and runs the proper task for the current time
   if(schedulerActive)
   {
     var h = Math.floor(masterTime/60);
     var t;
     if(silk.minAccess >= 4)
     {
       t = actionSelectArray[activeScheduleArray[h] ].split("_")[1];
       if(silk.task.currentTask != t)
       {

         silk.task.currentTask = t;
         silk.isTired = false;
         silk.task.newTask();
       }
     }
   }
 }
 


 this.adjTaskStats = function()
 {
   //adjusts the status of all tasks based on current conditions
   if(silkWood.foodPile.isFull)
   {
     switch(gameStage)
     {
       case 1:
       case 3:
       case 5:
       case 7:
       case 9:
       break;
      default:
     }
   }else
   {
   }
   this.updateTaskIcons();
 }
}




