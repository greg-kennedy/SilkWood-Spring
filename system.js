//Entire Script copyright 2007 Dexter Kofa/Reflective Layer
var hardVersion = 2.0;
var gameVersion = 2.0;
var clk1 = 0;
var clk2 = 0;
var clk3 = 0;
var clk4 = 0;
var dispPos = "above";
var gameData = "";
var gameLoading = false;
var gameReady = false;
var gameStage = 1;
var missionTime = 0;
var vitalsOpen = false;
var schedulerOpen = false;
var settingsOpen = false;
var weatherOpen = false;
var frontDispOpen = true;
var resourcesOpen = false;
var silkIsPaused = false;
var townSequence = false;		//sequence of going to town;
var townStage = true;			//if true then Elder can go to town in this stage
var sysObject = new Object();
var reloading = false;
var autoSave = false;
var sound_mute = false;
var sound_lowVol = false;
var sound_music = true;
var sound_action = true;
var sound_environment = true;
var weatherSound = "base_background";
var worldArray = new Array();
var wasPrecipitating = false;
var objSerializer;
var goalsArray = new Array("2-1-2",false,"3-2-1",false,"4-5-1",false,"3-10-2",false,"8-15-3",false,false)

var clk1Length = 5;
var clk2Length = 60 * 15;

function genericObject()
{

}


if(platform == "hta")
{
  var fso = new ActiveXObject("Scripting.FileSystemObject");
}

function getSysData()
{
  sysObject.gameStage = gameStage;
  sysObject.missionTime = missionTime;
  sysObject.silkIsPaused = silkIsPaused;
  sysObject.townSequence = townSequence;
  sysObject.townStage = townStage;
  sysObject.autoSave = autoSave;
  sysObject.mute = sound_mute;
  sysObject.lowVol = sound_lowVol;
  sysObject.sndMusic = sound_music;
  sysObject.sndAction = sound_action;
  sysObject.sndEnviron = sound_environment;
}

function setSysData()
{
  gameStage = sysObject.gameStage;
  missionTime = sysObject.missionTime;
  silkIsPaused = sysObject.silkIsPaused;
  townSequence = sysObject.townSequence;
  townStage = sysObject.townStage;
  sound_mute = sysObject.mute;
  sound_lowVol = sysObject.lowVol;
  sound_music = sysObject.sndMusic;
  sound_action = sysObject.sndAction;
  sound_environment = sysObject.sndEnviron;
  autoSave = sysObject.autoSave;
}

function masterClockTick()
{
   //main loop that moves the world forward (1 sec)
   if(clk1 == clk1Length)
   {
 
     missionTime++;
     sky.update();
     if(!silkIsPaused && !silk.hasBasket && silk.action.currentAction != "climb" && !disp_animator.isAnimated() )
     {
       silk.lifeCheck();
       silk.healthCheck();
       masterPlan.checkSchedule();
       if(silk.isInTown)
       {
         silk.townCounter--;
         if(silk.townCounter == 0)
         {
           //return from town
           silk.townCounter = silk.townDelay;
           silk.command.com = "returnHome";
           silk.command.comPhase = "start";
           silkWood.cart.unload();
           silk.isReturning = true;
           silk.isInTown = false;
           silk.command.cb_returnHome();
         }
         gTimersDiv.innerText = "Returning home in: " + decFixedPoint(silk.townCounter*5/60,2) + " min";
       }
     }
     
     if(!silk.isInTown && !silk.isRecovering)
     {
       gTimersDiv.innerText = "Mission Time: " + decFixedPoint(missionTime*5/86400,2) + " days";         
     }
     clk1=0;
   }
   clk1++;

   if(clk2 == clk2Length)
   {
     if(wasPrecipitating && sky.precipitation && gameStage < 2)
     {
       waterLevel= Math.min(30,waterLevel+0.5);
     }
     wasPrecipitating = sky.precipitation;
     theWeather.update();
     silk.checkDisease();

     //Do resoruce growth update
     setRainGauge();
     chickenGrowth();
     plantMan();

     if(autoSave)
     {
       saveState();		//saveGame;
     }
     clk2=0;
     
     
   }
   clk2++;

  if(silk.sickRecovery == 0)
  {
    silk.updateLife();
  }
 
 //allStatus();
 vitalStatus();
}


function updateMasterTime()
{
  //syncronizes master time with computer clock;
  
  var d = new Date();
  currentHour = d.getHours();
  masterTime = convertMasterTime(currentHour,d.getMinutes());
}


function convertMasterTime(h,m)
{
  //converts to minutes
  // h= hours m = minutes
  return h * 60 + m;
}

function convertSunTime(t)
{
  //converts t to minutes
  //input for is example(6:12 am) string
 var h,m,a,d,r;
  a = t.split(":");
  h = parseInt(a[0]);
  m = parseInt(a[1].split(" ")[0]);
  d = a[1].split(" ")[1];
  if(h == 12)
  {
    h = 0;
  }
  
  if(d == "am")
  {
    r = h * 60 + m;
  }else
  {
    r = (h+12) * 60 + m;   
  }
  return r;
}

function setOpacity(i,op)
{
  //wrapper function for seeting the opacity on an image
  //i  is string
  var   e = document.getElementById(i);
  switch(platform)
  {
    case "hta":
      e.filters.item(0).opacity = op;
     break;  
    case "mac":
      if(op == 0)
      {
        e.style.display = "none";
      }else
      {
        e.style.display = "block";      
      }
      e.style.opacity = op/100;
     break;
  }


}


function decFixedWidth(n,p)
{
  //n = number    p = places BEFORE number
  var s,l,pre;
  pre = "";
  s = n.toString();
  l = p - s.length;
  for(var c=0; c<l;c++)
  {
    pre += "0";
  
  }
  return pre + s;
}

function decFixedPoint(n,p)
{
  //n = number    p = places AFTER number
  var s,sa,l,pre;
  pos = "";
  s = n.toString();
  sa = s.split(".");
  if(sa[1] == undefined)
  {
    sa[1] = "";
  }
  sa[1] = sa[1].substr(0,p);
  l = p - sa[1].length;
  for(var c=0; c<l;c++)
  {
    pos += "0";
  
  }
  return sa[0] + "." + sa[1] + pos;
}


function playAuxSound()
{
  if(platform == "hta")
  {
    aux_sound.beginElement();
  }else if(platform == "mac")
  {
    aux_sound.Play();
  }
  
}



function noFunction()
{
  //a Blank function
  
}


function seeUnderground()
{
  var y;
  if(frontDisplay.offsetTop <= -250)
  {
    y = 0;
  }else if(frontDisplay.offsetTop == 0 || frontDisplay.offsetTop == 8)
  {
    y = -260;
  }else
  {
    return;
  }
  disp_animator.attributes.top = {to: y};  
  disp_animator.duration = 2 + Math.abs(150)/silk.climbSpeed;        
  setTimeout('disp_animator.animate()',100);     //moves object to x1,y1   
}

function openFrontDisp()
{
  frontDispOpen = true;
  frontDisplay.style.display='block'; 
  if(!silkWood.tv.status)
  {
    silkWood.tv.animation.srcObj.style.display = "block";
    silkWood.tv.animation.srcObj.style.display = "none";
  }
}

function closeFrontDisp()
{
  frontDispOpen = false;
  frontDisplay.style.display='none'; 
}


function allStatus()
{
  foodSpan.innerHTML = silkWood.foodPile.amount;
  basketSpan.innerHTML = silkWood.basket.amount;
  stomachSpan.innerHTML = decFixedPoint(silk.stomach,1);
  stomachSizeSpan.innerHTML = decFixedPoint(silk.stomachSize,1);
  energyEffSpan.innerHTML = decFixedPoint(silk.energyEff,1);
  tiredSpan.innerHTML = decFixedPoint(silk.tiredLevel,1) * 100;
  energySpan.innerHTML = decFixedPoint(silk.energy,1);
  heatSpan.innerHTML = decFixedPoint(silk.bodyHeat,1);
  bodyTempSpan.innerHTML = decFixedPoint(silk.bodyTemp,1);
  heatConRateSpan.innerHTML = decFixedPoint(silk.heatConRate,1);
  taskSpan.innerHTML = silk.task.currentTask;
  commandSpan.innerHTML = silk.command.com
  minAccessSpan.innerHTML = silk.minAccess;
  psychSpan.innerHTML = decFixedPoint(silk.psych,3);
  deathTimerSpan.innerHTML = decFixedPoint(silk.outOfParamTimer,4);
  smartSpan.innerHTML =  decFixedPoint(silk.smartIndex,3);
  heatLossSpan.innerHTML = decFixedPoint(heatLoss,2);
  energyConSpan.innerHTML = decFixedPoint(silk.energyConRate,2);
}

function vitalStatus()
{
  vital_mind.innerHTML = silk.emoText(silk.psych);
  vital_temp.innerHTML = decFixedPoint(silk.bodyTemp,1) + " <sup>o</sup>C";
  vital_energy.innerHTML = decFixedPoint((silk.energy/silk.energyBufferSize) * 100,1) + "%";
  vital_stomach.innerHTML = decFixedPoint((silk.stomach/silk.stomachSize) * 100,1) + "% full";
  vital_silo.innerHTML = decFixedPoint(silkWood.foodPile.amount/100,1) + "ml";
  vital_basket.innerHTML = silkWood.basket.content + ":<br>" + silkWood.basket.amount + "g";
  vital_smart.innerHTML = decFixedPoint(silk.smartIndex,3);
  vital_eff.innerHTML = decFixedPoint((silk.energyEff/silk.default_energyEff) * 100,1) + "%";
  vital_eUsage.innerHTML = decFixedPoint(silk.energyConRate,1) + " joules";
}


function closeVitalStats()
{

  vitalsOpen = false;
  openFrontDisp();
  UI_vitals.style.display='none'; 
}

function openSettings()
{
  settingsOpen = true;
  UI_settings.style.display='block'; 
  closeFrontDisp();
}


function closeSettings()
{

  settingsOpen = false;
  openFrontDisp();
  UI_settings.style.display='none'; 
}


function openScheduler()
{
  schedulerOpen = true;
  masterPlan.adjTaskStats();
  sch_cTimeDiv.innerText = stdTime();
  UI_scheduler.style.display='block'; 
  closeFrontDisp();
}


function closeScheduler()
{

  masterPlan.loadSchedule(activeScheduleArray);
  schedulerOpen = false;
  openFrontDisp();
  UI_scheduler.style.display='none'; 
}

function openVitalStats()
{

  if(!townSequence)
  {
    vitalsOpen = true;
    UI_vitals.style.display='block'; 
    closeFrontDisp();

    if(!silk.hasDisease)
    {
      cureButton.style.display = "none";
    }
  }
  
}


function closeVitalStats()
{

  vitalsOpen = false;
  openFrontDisp();
  UI_vitals.style.display='none'; 
}


function openWeatherUI()
{
  if(!townSequence)
  {
    weatherOpen = true;
    WxStaName.innerHTML = theWeather.curWxName;
    forcast1Div.innerHTML = "<b>" + theWeather.forecast1Date + "</b><br>" + theWeather.forecast1Cond;
    forcast2Div.innerHTML  = "<b>" + theWeather.forecast2Date + "</b><br>" + theWeather.forecast2Cond;
    UI_weather.style.display='block'; 
    closeFrontDisp();
  }
}


function closeWeatherUI()
{

  weatherOpen = false;
  openFrontDisp();
  UI_weather.style.display='none'; 
}


function openResources()
{
  updateResourceStats();
  resourcesOpen = true;
  UI_resources.style.display='block'; 
  if(atGoal() && !townSequence && silk.stomach > 5000 && silk.energy > 10000 && !silk.isSick)
  {
    enableResourceBtn();
  }else
  {
    disableResourceBtn();
  }
  closeFrontDisp();

}

function closeResources()
{

  resourcesOpen = false;
  openFrontDisp();
  UI_resources.style.display='none'; 
}

function enableResourceBtn()
{
  toTownImg.style.cursor = "pointer";
  toTownImg.src = "images/btn_toTown.png";
}


function disableResourceBtn()
{
  toTownImg.style.cursor = "default";
  toTownImg.src = "images/btn_toTown_gry.png";  
}


function objCompleted(g)
{
  var a,a2,c,c2;
  if(atGoal() && !townSequence && silk.stomach > 5000 && silk.energy > 10000 && !silk.isSick)
  {
    closeResources();

    a = goalsArray[g-1];
    a2 = a.split("-");
    chickenBirthCounter = Math.max(0,chickenBirthCounter - parseInt(a2[0]) * 48);
    chickenMax = Math.round(Math.max(0,chickenBirthCounter/48) );
    
    
    c = 0;
    c2 = 0;
    while(c2<parseInt(a2[1]) )
    {
      if(plantArray[c].state == "flower")
      {
        plantArray[c].state = "flowerDeath";
        plantActive--;
        c2++;
      }
      c++;
      if(c > plantArray.length)
      {
        break;
      }
    }
    
    
    butterSpecial = butterActive - parseInt(a2[2]);

    silk.minAccess = 2;				//Special assignment
    silk.task.level = 2;
    silk.command.level = 2;
    silk.task.currentTask = "gotoTown";
    silk.isTired = false;
    silk.task.newTask();
  }
}

function setGoal(g)
{
  a = goalsArray[g-1];
  if(a == false)
  {
    objChickenDiv.innerHTML = "";
    objPlantDiv.innerHTML = "";
    objButterDiv.innerHTML = "";
  }else
  {
    a2 = a.split("-");
    objChickenDiv.innerHTML = a2[0];
    objPlantDiv.innerHTML = a2[1];
    objButterDiv.innerHTML = a2[2];    
  }
}



function atGoal()
{
  var g,a,a2;
  g = false;
  a = goalsArray[gameStage-1];
  if(a == false)
  {
  }else
  {
    a2 = a.split("-");
    if(chickenActive >= parseInt(a2[0]) && flowerCount >= parseInt(a2[1]) && butterActive >= parseInt(a2[2]) )
    {
      g = true;
    }
  }
  
  return g;
}


function setRainGauge()
{
   waterGaugeDiv.style.clip="rect(" + (86 - Math.round(2.86 * waterLevel)) + " auto auto auto)";
}


function toggleTempUnit()
{
  //toggle the temperature unit
  if(theWeather.unit == "F")
  {
    theWeather.unit = "C";
  }else
  {
    theWeather.unit = "F";  
  }
  theWeather.parseWeather(theWeather.rqObject.responseXML,true)
  theWeather.processWeather();
}


function toggleTimeUnit()
{
  //toggle the time unit
  if(theWeather.timeUnit == "24")
  {
    theWeather.timeUnit = "AP";
  }else
  {
    theWeather.timeUnit = "24";  
  }
  timeDiv.innerText = stdTime();
}

function checkStageComplete()
{
   //checks to see if a stage has been completed
   switch(gameStage)
   {
   
     case 1:
       if(silk.isInTown)
       {
         //The Elder Trade Route
         soundMan.mute();
         silkPause();
         UI_cutScene.style.backgroundImage = "url(images/chapter_" + gameStage + ".png)";
         frontDisplay.style.display = "none";
         UI_cutScene.style.display = "block";
         gameStage++; 
         townStage = false;
       }
      break;
     case 2:
        //The Elder Artifact
        if(silkWood.cave.stage > 1)
        {
         soundMan.mute();
         UI_cutScene.style.backgroundImage = "url(images/chapter_" + gameStage + ".png)";
         silkPause();
         frontDisplay.style.display = "none";
         UI_cutScene.style.display = "block";
         gameStage++;   
         underButtonDiv.style.display = "inline";
         townStage = true;
        }
      break;
     case 3:
       if(silk.isInTown)
       {
         //Chipping away the Mystery
         soundMan.mute();
         silkPause();
         UI_cutScene.style.backgroundImage = "url(images/chapter_" + gameStage + ".png)";
         frontDisplay.style.display = "none";
         UI_cutScene.style.display = "block";
         gameStage++; 
         townStage = false;
       }
      break;
     case 4:
        //The Discovery
        if(silkWood.cave.stage != 2)
        {
         soundMan.mute();
         UI_cutScene.style.backgroundImage = "url(images/chapter_" + gameStage + ".png)";
         silkPause();
         frontDisplay.style.display = "none";
         UI_cutScene.style.display = "block";
         gameStage++;                
	 townStage = true;
        }
      break;
     case 5:
       if(silk.isInTown)
       {
         // "Get pump"
         soundMan.mute();
         silkPause();
         UI_cutScene.style.backgroundImage = "url(images/chapter_" + gameStage + ".png)";
         frontDisplay.style.display = "none";
         UI_cutScene.style.display = "block";
         gameStage++; 
         townStage = false;
       }
      break;
     case 6:
       if(silkWood.cave.stage == 5)
       {
         // "Into the cave"
         soundMan.mute();
         silkPause();
         UI_cutScene.style.backgroundImage = "url(images/chapter_" + gameStage + ".png)";
         frontDisplay.style.display = "none";
         UI_cutScene.style.display = "block";
         gameStage++; 
         townStage = true;
       }
      break;
     case 7:
       if(silk.isInTown)
       {
         // "Get Chisel"
         soundMan.mute();
         silkPause();
         UI_cutScene.style.backgroundImage = "url(images/chapter_" + gameStage + ".png)";
         frontDisplay.style.display = "none";
         UI_cutScene.style.display = "block";
         gameStage++; 
         townStage = false;
       }
      break;
     case 8:
       if(silkWood.cave.deviceLevel == 100)
       {
         // "The sphere of power"
         soundMan.mute();
         silkPause();
         UI_cutScene.style.backgroundImage = "url(images/chapter_" + gameStage + ".png)";
         frontDisplay.style.display = "none";
         UI_cutScene.style.display = "block";
         gameStage++; 
         townStage = true;
       }
     case 9:
       if(silk.isInTown)
       {
         // "Get Power source"
         soundMan.mute();
         silkPause();
         actionStatusArray[9] = true;
         UI_cutScene.style.backgroundImage = "url(images/chapter_" + gameStage + ".png)";
         frontDisplay.style.display = "none";
         UI_cutScene.style.display = "block";
         gameStage++; 
         townStage = false;
       }
      break;
     case 10:
       if(silkWood.cave.deviceLevel <= 0)
       {
         // The Legend of the burning tree.
         soundMan.mute();
         silkPause();
         UI_cutScene.style.backgroundImage = "url(images/chapter_" + gameStage + ".png)";
         silkWood.radar.pulse();   
         handPumpImg.style.display = "none";
         waterPipeImg.style.display = "none";
         radarImg.style.display = "inline";
         frontDisplay.style.display = "none";
         UI_cutScene.style.display = "block";
         gameStage++; 
         townStage = false;
         undergroundImg.src = "world/undergroundC.png";

       }
   }
 setGoal(gameStage);
}


function openCutScene(s)
{
  //plays end stage sequence
  var scene,sceneString;
  switch(s)
  {
   
    case 1:


      break;
   
  }
  frontDisplay.style.display = "none";
  timeMasterDiv.style.display = "none";

  UI_cutScene.style.display = "block";
  scene = "images/chapter_" + s + ".swf";
  if(platform == "hta")
  {
    sceneString = "<object type=application/x-shockwave-flash width='296' height='160><PARAM NAME='loop' value='false'><PARAM NAME=Movie value='"+scene+"'></object>"
  }else
  {
    sceneString = '<embed src="'+scene+'" quality="high" width="296" height="160" type="application/x-shockwave-flash" />' 
  }
  cutSceneDiv.innerHTML = sceneString;
  btn_replayCut.style.display = "block";
  btn_exitCut.style.display = "block";
  chapterDiv.innerHTML = "Chapter: " + gameStage;
}



function closeCutScene()
{
  silkCont();
  if(gameStage == 2)
  {
    demoMsgImg.src = "images/demo.png";  
    demoMsgImg.style.display = "block";  
  }  
  frontDisplay.style.display = "block";
  timeMasterDiv.style.display = "block";
  UI_cutScene.style.display = "none";
  cutSceneDiv.innerHTML = '<img onclick="openCutScene(gameStage-1)" src="images/play_cine.png" style="cursor:pointer">';
  btn_replayCut.style.display = "none";
  btn_exitCut.style.display = "none";

  getSoundState();
}


function part2WebPreview()
{
  var reflectiveLink = "http://www.reflectivelayer.com/silkwood/part2prewiev187.asp";
  previewImg.style.display = "none";
  if(platform == "hta")
  {
    window.open(reflectiveLink,"silkWood")
  }else if(platform == "mac")
  {
    parent.openWLink(reflectiveLink);     
  }
}


function stdTemp(t,u)
{
  //convert the current temp unit of the game
  //if u is true, then the unit will be append to the returned value
  var v,ud,o;
  ud = "<sup>o</sup>C";
  v = t;
  if(theWeather.unit == "F")
  {
    ud = "<sup>o</sup>F";
    v = Math.round(1.8 * t + 32);
  }
  
  if(u)
  {
     o = v + ud;
  }else
  {
    o = v;
  }
  
  return o;
}

function stdTime()
{
  //convert the current time unit of the game
  var v,u,p,o;
  v = t;
  p = "am";
  if(theWeather.timeUnit == "24")
  {
    o = decFixedWidth(Math.floor(masterTime/60),2) + ":" + decFixedWidth(masterTime%60,2);
  }else
  {
    u = Math.floor(masterTime/60);
    if(u > 11)
    {
      p = "pm"
    }
    if(u > 12)
    {
      u = u - 12;
    }
    if(u == 0)
    {
      u = 12;
    }
    o = u + ":" + decFixedWidth(masterTime%60,2) + p ;
  
  }
  
  return o;
}

function silkPause()
{
  //pauses all silk related functions
    silkIsPaused = true;
    silk.action.pause();
    silkMover.pause();
}

function silkStop()
{
  silkPause();
  clearTimeout(silk.command.pollTimer);
  clearTimeout(silk.task.pollTimer);
}

function silkCont()
{
  //pauses all silk related functions
    silkIsPaused = false;
    silk.action.cont();
    if(gameStage == 11)
    {
      silk.command.com = "greetings";
      this.taskNextPhase = "end";         
      silk.command.run();      
    }else
    {
      silkMover.cont();
    }

}


function setSoundState()
{
  // set the state of the sound check boxes
  if(sound_mute){mutSoundSel.checked = true}else{mutSoundSel.checked = false};
  if(sound_lowVol){lowSoundSel.checked = true}else{lowSoundSel.checked = false};
  if(sound_music){musSoundSel.checked = true}else{musSoundSel.checked = false};
  if(sound_action){actSoundSel.checked = true}else{actSoundSel.checked = false};
  if(sound_environment){envSoundSel.checked = true}else{envSoundSel.checked = false};
  if(autoSave){autoSaveSel.checked = true}else{autoSaveSel.checked = false};
}

function getSoundState()
{
  // read the state of the sound check boxes;
  if(lowSoundSel.checked){sound_lowVol = true}else{sound_lowVol = false};
  if(autoSaveSel.checked){autoSave = true}else{autoSave = false};

  if(mutSoundSel.checked)
  {
    soundMan.mute();
    sound_mute = true;
  }else
  {
    sound_mute = false;
  }

  if(musSoundSel.checked)
  {
    sound_music = true;
    soundMan.play("bgmusic","music");
    
  }else
  {
    sound_music = false;
    soundMan.stop("music");
  }
  
  if(actSoundSel.checked)
  {
    sound_action = true;
    soundMan.play(silk.action.action,"silk");
    if(silkWood.tv.status)
    {
      soundMan.play("tv","aux");    
    }
  }else
  {
    sound_action = false;
    soundMan.stop("silk");
    soundMan.stop("aux");
  }
  
  if(envSoundSel.checked)
  {
    sound_environment = true
    soundMan.play(weatherSound,"env");
  }else
  {
    sound_environment = false
    soundMan.stop("env");
  }
  if(autoSaveSel.checked){autoSave = true}else{autoSave = false};
  

}

function showReflectiveTV()
{
  reflectiveLink = "http://www.reflectivelayer.com/reflectiveTV"
  if(platform == "hta")
  {
    window.open(reflectiveLink,"silkWood")
  }else if(platform == "mac")
  {
    parent.openWLink(reflectiveLink);     
  }
}


function reflectiveWeb()
{
  reflectiveLink = "http://www.reflectivelayer.com/silkwood/doc_spring"
  if(platform == "hta")
  {
    window.open(reflectiveLink,"silkWood")
  }else if(platform == "mac")
  {
    parent.openWLink(reflectiveLink);     
  }
}

//*********************** FILE SAVING ROUTINES *************************
function saveGame()
{
  if(!gameLoading)
  {
    saveState();
    closeSettings();
  
  
  }
}

function resetGame()
{
  if(!gameLoading)
  {
    saveGameData(gameVersion + "|restart|2|3|4|5|6|7|8|9|");
    window.location.reload();  
  }
}

function loadGame()
{
  gameLoading = true;
  if(!readState() )
  {
    gameLoading = false;
    return false;
  }
  silkIsPaused = false;
  if(townSequence)
  { 
    if(silk.isInTown)
    {
      silk.minAccess = 2;
    }else
    {
      silk.minAccess = 4;    
    }
    
    if(silk.hasCart)
    {
      silkWood.cart.hook(90);  
    }
    
    if(silk.isReturning)
    {
      silk.townCounter = silk.townDelay;
      silk.command.com = "returnHome";
      silk.command.comPhase = "start";
      silkWood.cart.unload();
      silk.isReturning = true;
      silk.isInTown = false;
      silk.command.cb_returnHome();    
    }else
    {
      silk.task.currentTask = "gotoTown";
      silk.task.newTask();
    }
    gameLoading = false;
  }
  
  if(silk.isSick)
  {
    if(silk.isRecovering || silk.diseaseIndex > 1)
    {
      silk.command.level = 1;
      silk.action.level = 1;
      silk.command.com = "cure";
      silk.command.run();  
    }else
    {
      silk.lifeCheck();
    }
  }
  
  silkWood.basket.drop(30,0);
  
  if(gameStage > 2)
  {
    underButtonDiv.style.display = "inline";
  }

  
  setSoundState();
  
  silk.checkDisease ()
  gameLoading = false;
  return true;

}


function saveState()
{
  gameData = "";
  appendGameData( gameVersion + "|saved|2|3|4|5|6|7|8|9|");

  appendGameData(doSerialize(silk,'silk') + "|");   //index 10

  appendGameData(doSerialize(silkWood.foodPile,'silkWood.foodPile') + "|"); //index 11

  appendGameData(doSerialize(silkWood.basket,'silkWood.basket') + "|"); //index 12

  appendGameData(doSerialize(silkWood.cart,'silkWood.cart') + "|"); //index 13

  appendGameData(doSerialize(silkWood.plyWood,'silkWood.plyWood') + "|"); //index 14

  appendGameData(doSerialize(silkWood.cave,'silkWood.cave')  + "|"); //index 15

  getSysData();
  appendGameData(doSerialize(sysObject,'sysObject')  + "|"); //index 16
        
  appendGameData(getSchedulerData()  + "|"); //index 17  Default Schedule

  appendGameData(theWeather.curWxSta + "|" + theWeather.curWxName + "|" + theWeather.unit + "|" + theWeather.timeUnit + "|");   //index 18,19,20,21
    
  appendGameData(actionStatusArray.join(",")  + "|"); //index 22  Default Schedule
    
  appendGameData(frontDisplay.offsetTop + "|"); //index 23  Default Schedule

//index 24+  Plant data
  for(var a=0;a<plantArray.length;a++)
  {
    appendGameData( "\n|" + plantArray[a].isActive + "-" + plantArray[a].state + "-" + plantArray[a].stage + "-" + plantArray[a].positionX + "-" + plantArray[a].positionY + "|");
  }
  appendGameData(plantActive + "|");
  appendGameData(plantMax + "|");
  appendGameData(chickenBirthCounter + "|");
  appendGameData(chickenMax + "|");
  appendGameData(waterLevel + "|");


  saveGameData(gameData);


}

function appendGameData(d)
{
  gameData += d;
}

function saveGameData(d)
{
  var fileIn,fileOut;
  if(platform == "hta")
  {
    fileIn = fso.GetAbsolutePathName("") + "\\saveFile.sww";
    fileOut = fso.OpenTextFile(fileIn,2,true);
    fileOut.write(d);
    fileOut.close();
  }else
  {
    parent.saveData("/bin/echo " + escape(d) + " > saveFile.sww",null);
  }
}

function doNothing()
{

}

function readState()
{
  var fa,sa,a;
  fa = getGameData();
  if(!fa)
  {
    return false;
  }
  fa = fa.split("|");
  
  if(fa[1] != "saved")
  {
    return false;
  }
  //System Data
  eval(fa[16]);
  setSysData();

  //Silk(Elder) Data
  eval(fa[10]);
  silk.sync();

  //Basket Data
  eval(fa[12]);
  silkWood.basket.sync();

  //Cart Data
  eval(fa[13]);
  silkWood.cart.sync();

  //Ply Wood Data
  eval(fa[14]);

  //Ply Cave Data
  eval(fa[15]);
  silkWood.cave.sync();
  if(silkWood.cave.waterPump)
  {
    handPumpImg.style.display = "inline";
    waterPipeImg.style.display = "inline";
  }

  //Food Pile Data
  eval(fa[11]);
  silkWood.foodPile.sync();

  //Default Schedule
  setSchedulerData(fa[17]);
  masterPlan.loadSchedule(activeScheduleArray);
  
  //Weather Setup data
  theWeather.curWxSta = fa[18];
  theWeather.curWxName = fa[19];
  theWeather.unit = fa[20];
  theWeather.timeUnit = fa[21];
  theWeather.sync();
   
  sa = fa[22].split(",");
  for(var a=0;a<sa.length;a++)
  {
    if(sa[a] == "true")
    {
      actionStatusArray[a] = true;
    }else
    {
      actionStatusArray[a] = false;
    }
  }
  
  if(gameStage > 10)
  {
     undergroundImg.src = "world/undergroundC.png";
     handPumpImg.style.display = "none";
     waterPipeImg.style.display = "none";
     radarImg.style.display = "inline";
     silkWood.radar.pulse();   

  }

  if(sound_mute)
  {
    soundMan.mute();
  }

  if(!sound_action)
  {
    soundMan.stop("silk");
    soundMan.stop("aux");
  }
 
  if(!sound_music)
  {
    soundMan.stop("music");
  }

  if(!sound_environment)
  {
    soundMan.stop("env");
  }
 
  silk.diseaseVisible = false;


  frontDisplay.style.top = fa[23];
  
  // index 24 is not used 
  for(var a=0;a<plantArray.length;a++)
  {
    
    sa = fa[25+(a*2)].split("-");
    
    if(sa[0] == "true")
    {
      plantArray[a].isActive = true;
    }else
    {
      plantArray[a].isActive = false;
    }    
    plantArray[a].state = sa[1];
    plantArray[a].stage = parseInt(sa[2]);
    plantArray[a].positionX = sa[3];
    plantArray[a].positionY = sa[4]
    plantArray[a].imgSrc.style.left = plantArray[a].positionX;
    plantArray[a].imgSrc.style.top = plantArray[a].positionY;
    plantArray[a].update();
  }
  var os = 25+(a*2)-1;
  plantActive = parseInt(fa[os + 0]);
  plantMax = parseInt(fa[os + 1]);
  chickenBirthCounter = parseInt(fa[os + 2]);
  chickenMax = parseInt(fa[os + 3]);
  waterLevel = parseFloat(fa[os + 4]);
  setRainGauge();
  return true;
}


function getGameData()
{
  var fleIn,fileOut,req,rData;
  if(platform == "hta")
  {
    fileIn = fso.GetAbsolutePathName("") + "\\saveFile.sww";
    if(fso.FileExists(fileIn) )
    {
      fileOut = fso.OpenTextFile(fileIn,1);
      return fileOut.ReadAll();
    }else
    {
      return false;
    }
  }else
  {
    req = new XMLHttpRequest(); 
    if(gameStage == -1)
    {
      req.open("GET", "startFile.sww" ,false);     
    }else
    {
      req.open("GET", "saveFile.sww" ,false);     
    }
    req.send(null); 
    rData = unescape(req.responseText); 
    if (rData)
    { 
        return rData; 
    } 
    return false;
  }
}

function doSerialize(o,s)
{
	
	var objString;
	var objSerializer = new JSSerializer();	
	
	//Prefs
	objSerializer.Prefs.SmartIndent = true;
	objSerializer.Prefs.ShowLineBreaks = true;
	objSerializer.Prefs.ShowTypes =	true;
	
	//Types
	objSerializer.Types.UseNull = true;
	objSerializer.Types.UseUndefined = true;
	objSerializer.Types.UseArray = false;
	objSerializer.Types.UseObject = true;
	objSerializer.Types.UseBoolean = true;
	objSerializer.Types.UseDate = true;
	objSerializer.Types.UseError = true;
	objSerializer.Types.UseFunction = false;
	objSerializer.Types.UseNumber = true;
	objSerializer.Types.UseRegExp = true;
	objSerializer.Types.UseString = true;
	objSerializer.Types.UseUserDefined = true;
	objSerializer.Types.UseObjectsForUserDefined = false;
	
	//Rules
	objSerializer.CheckInfiniteLoops = true;
	objSerializer.MaxDepth = 1;
	
	objSerializer.Serialize(o);		
	objString = objSerializer.GetJSString(s);
	return objString;	
}

// ************************ Sound Manager *************************************
function soundObject()
{
  this.stat_silk = null;
  this.stat_aux = null;
  this.stat_env = null;
  this.stat_music = null;
  
  
  

  this.play = function(s,o)
  {
    if(!sound_mute)
    {
      switch(o)
      {
        case "silk":
          if(sound_action)
          {  
            playSoundElement(s,o)
          }
         break;
        case "aux":
          if(sound_action)
          {        
            playSoundElement(s,o)
          }
         break;
        case "music":
          if(sound_music)
          {
            playSoundElement(s,o)
          }
         break;
        case "env":
          if(sound_environment)
          {
            playSoundElement(s,o)
          }
         break;
      }
    }
  }
  
  
  
  this.stop = function(o)
  {
    switch(o)
    {
      case "silk":
        stopSoundElement("silk");            
       break;
      case "aux":
        stopSoundElement("aux");            
       break;
      case "music":
        stopSoundElement("music");            
       break;
      case "env":
        stopSoundElement("env");            
       break;
    }
  }
  
  
  this.mute = function()
  {
    sound_mute = true;
    stopSoundElement("silk");            
    stopSoundElement("aux");            
    stopSoundElement("music");            
    stopSoundElement("env");            
  }

}


function stopSoundElement(e)
{
  var o;
  if(platform == "hta")
  {
    eval(e + "_sound.endElement()");
  }else
  {
    eval("soundMan.stat_" + e + " = 'null'");
    eval(e+"_sound.window.location.reload()");
  }
}

function playSoundElement(s,e)
{
  var o,i;
  if(platform == "hta")
  {
    eval(e + "_sound.src = 'sounds/" + s + ".mp3'");
    eval(e + "_sound.beginElement()");
  }else
  {
    eval("soundMan.stat_" + e + " = '" + s + "'");
    eval(e+"_sound.window.location.reload()");
  }
}


