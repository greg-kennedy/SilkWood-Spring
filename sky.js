//Entire Script copyright 2007 Dexter Kofa/Reflective Layer
var cloudX = 0;		//current xposition of cloud layer
function skyBase ()
{
    /*
     * manages sthe the look of the sky
     * Time is measured as the number of minutes after midnight for the each day
    */
    
  this.updateTimerObj;			//update timer object
  this.cloudMoveTimerObj;		//Cloud movement timer object

  this.updateRate = 1000;		//update interval in mSec/ Later should be 30000 mSec
  
  this.phase = null			//phase of the sky(day,dusk,etc.. in numbers)
  this.dayTransState = 0;		//show  when a day transition is happening and which half 0=none, 1=first half, 2= 2nd half	  
  this.cloudCoverage = 1;		//amount of sky covered by cloud (0 to 4);
  this.precipitation = false;		//if it's prcipiating
  this.precipitationType = null;	//type of prcipiating
  
  this.dawnThreshold = convertMasterTime(6,30) - 30; //time shen sunrise starts - 30 minutes
  this.duskThreshold = convertMasterTime(19,31) - 30; //time when sunset starts - 15 minutes
  
  this.transitLength = 90		//time to transition dawn/dusk in minutes

  this.lightingListO = new Array();	//Create an array to store image object to need to match the sky light
  this.lightingListS = new Array();	//Create an array to store image object src to need to match the sky light
  
  this.init = function()
  {
    this.addToLL("worldPlate","world/world");
    this.addToLL("worldPlateF","world/worldF");

    //setup Windmill animation
  
    windmill = new animation("windmill");
    windmill.init();
    windmill.endFrame = 74;
    windmill.frameRate = 1;
    windmill.adv = 1;
    windmill.src = "animation/windmill/windmill";
    windmill.srcObj = windmillImg;
    windmill.start();    
  }
  
  this.update = function()
  {
     //main routine to update the looks of  the sky;
     if(masterTime > this.duskThreshold + this.transitLength)
     {
       if(this.phase != 0)
       {
         this.showNight(); 
       }
       
     }else if(masterTime >= this.duskThreshold)
     {   
         this.showDusk();      
     }else if(masterTime >= this.dawnThreshold + this.transitLength)
     {
       if(this.phase != 2)
       {
         this.showDay(); 
       }     
       
     }else if(masterTime >= this.dawnThreshold)
     {
         this.showDawn();      
     }else
     {
       if(this.phase != 0)
       {
         this.showNight(); 
       }
     }
     
  }
  
  
  
  this.showNight = function()
  {
    this.phase = 0;
    this.dayTransState = 0;
    
    this.cloudLayerSwitch(1,0);   
 
    this.llNight();
  }


  this.showDay = function()
  {
    this.phase = 2;
    this.dayTransState = 0;
    
    this.cloudLayerSwitch(3,2);
    
    this.llDay();
    
  }


  this.showDawn = function()
  {
     var pp;
     this.phase = 1;

    if(masterTime >= this.dawnThreshold + (this.transitLength/2) )
    {
      if(this.dayTransState != 2)
      {
        this.cloudLayerSwitch(2,1);
  
      }
  
        pp =  (masterTime - this.dawnThreshold - (this.transitLength/2))/(this.transitLength/2) * 100;     
        setOpacity("skyPlate_b",100-pp);
        setOpacity("skyPlate_bb",100-pp);
        
        this.llDawn1(pp);
        this.dayTransState = 2;    
    }else
    {
      if(this.dayTransState != 1)
      {
        this.cloudLayerSwitch(1,0);
      }
  
      pp =  (masterTime - this.dawnThreshold)/(this.transitLength/2) * 100;   
      setOpacity("skyPlate_b",100-pp);
      setOpacity("skyPlate_bb",100-pp);

      this.llDawn2(pp);
      this.dayTransState = 1;    
      
      
    }
 
  }


  this.showDusk = function()
  {
     var pp;
     this.phase = 3;

    if(masterTime >= this.duskThreshold + (this.transitLength/2) )
    {
      if(this.dayTransState != 2)
      {
        this.cloudLayerSwitch(0,3);
      }
  
        pp =  (masterTime - this.duskThreshold - (this.transitLength/2))/(this.transitLength/2) * 100;     
        setOpacity("skyPlate_b",100-pp);
        setOpacity("skyPlate_bb",100-pp);
      
        this.llDusk1(pp);
        this.dayTransState = 2;
    }else
    {

      if(this.dayTransState != 1)
      {
        this.cloudLayerSwitch(3,2);
      }
  
      pp =  (masterTime - this.duskThreshold)/(this.transitLength/2) * 100;   
      setOpacity("skyPlate_b",100-pp);
      setOpacity("skyPlate_bb",100-pp);
      
      this.llDusk2(pp);
      this.dayTransState = 1;      
    }
 
  }

//   ********************* Lighting control stuff************************

  this.addToLL = function(o,s)
  {
     //adds image object to list of object to be affected by sunlight
     //id of image obejct (string)
     //s = base s = base src string
    
    this.lightingListO[this.lightingListO.length] = o;
    this.lightingListS[this.lightingListS.length] = s;
  }

  
  this.llNight = function()
  {
     //adjusts LL object for night;
    var ia,ib;
    for(var c=0; c < this.lightingListO.length; c++)
    {
      ia = document.getElementById(this.lightingListO[c] + "_a");
      ib = document.getElementById(this.lightingListO[c] + "_b");
     
      ia.src = this.lightingListS[c] + "_1.png";
      ib.src = this.lightingListS[c] + "_0.png";
      setOpacity(ia.id,0);     
      
      setOpacity(ib.id,100);
     
    }
  
  }

  this.llDawn1 = function(pp)
  {
     //adjusts LL object for dawn - top half; 
    var ia,ib,pp;
    for(var c=0; c < this.lightingListO.length; c++)
    {
      ia = document.getElementById(this.lightingListO[c] + "_a");
      ib = document.getElementById(this.lightingListO[c] + "_b");
      if(this.dayTransState != 2)
      {     
        ia.src = this.lightingListS[c] + "_2.png";
        ib.src = this.lightingListS[c] + "_1.png";
   setOpacity(ia.id,100);     
      }
      setOpacity(ib.id,100 - pp);  
    }
  }


  this.llDawn2 = function(pp)
  {
     //adjusts LL object for dawn - bottom half;
    var ia,ib,pp;
    for(var c=0; c < this.lightingListO.length; c++)
    {
      ia = document.getElementById(this.lightingListO[c] + "_a");
      ib = document.getElementById(this.lightingListO[c] + "_b");
      if(this.dayTransState != 1)
      {
        ia.src = this.lightingListS[c] + "_1.png";
        ib.src = this.lightingListS[c] + "_0.png";
        setOpacity(ia.id,100);     
      }
      setOpacity(ib.id,100 - pp);     
    }
  }
 
  
  
  this.llDay = function()
  {
     //adjusts LL object for day;

    var ia,ib;
    for(var c=0; c < this.lightingListO.length; c++)
    {
      ia = document.getElementById(this.lightingListO[c] + "_a");
      ib = document.getElementById(this.lightingListO[c] + "_b");
     
      ia.src = this.lightingListS[c] + "_3.png";
      ib.src = this.lightingListS[c] + "_2.png";
      setOpacity(ia.id,0);     
      
      setOpacity(ib.id,100);     
    }  
  }


  this.llDusk1 = function(pp)
  {
     //adjusts LL object for dawn - top half;

    var ia,ib,pp;
    for(var c=0; c < this.lightingListO.length; c++)
    {
      ia = document.getElementById(this.lightingListO[c] + "_a");
      ib = document.getElementById(this.lightingListO[c] + "_b");
      if(this.dayTransState != 2)
      {     
        ia.src = this.lightingListS[c] + "_0.png";
        ib.src = this.lightingListS[c] + "_3.png";
        setOpacity(ia.id,100);     
      }
      setOpacity(ib.id,100 - pp);  
    }
  }


  this.llDusk2 = function(pp)
  {
     //adjusts LL object for dawn - bottom half;   
 
    var ia,ib,pp;
    for(var c=0; c < this.lightingListO.length; c++)
    {
      ia = document.getElementById(this.lightingListO[c] + "_a");
      ib = document.getElementById(this.lightingListO[c] + "_b");
      if(this.dayTransState != 1)
      {
        ia.src = this.lightingListS[c] + "_3.png";
        ib.src = this.lightingListS[c] + "_2.png";
        setOpacity(ia.id,100);     
      }
      setOpacity(ib.id,100 - pp);     
    }
  }
 


//   ********************* Cloud Stuff ************************

  this.cloudLayerSwitch = function(a,b)
  {
    //utility function for switch the cloud layer
    
    skyPlate_a.src = "sky/sky_" + a + "_" + this.cloudCoverage + ".jpg";
    skyPlate_aa.src = "sky/sky_" + a + "_" + this.cloudCoverage + ".jpg";
    skyPlate_b.src = "sky/sky_" + b + "_" + this.cloudCoverage + ".jpg";
    skyPlate_bb.src = "sky/sky_" + b + "_" + this.cloudCoverage + ".jpg";
    setOpacity("skyPlate_b",100);
    setOpacity("skyPlate_bb",100);
  }




  this.setCloudCoverage = function(c)
  {
     //sets the cloud coverga 0 to 4    clear, few clouds, partly cloudy, mostly cloudy, overcast

      var av,a;

      av = skyPlate_a.src.split("_");
      a = av[av.length-2];
      skyPlate_a.src = "sky/sky_" + a + "_" + c + ".jpg";
      skyPlate_aa.src = "sky/sky_" + a + "_" + c + ".jpg";

      av = skyPlate_b.src.split("_");
      a = av[av.length-2];
      skyPlate_b.src = "sky/sky_" + a + "_" + c + ".jpg";
      skyPlate_bb.src = "sky/sky_" + a + "_" + c + ".jpg";
      
      this.cloudCoverage = c;
        

     //remove star if cloudCoverage is more than 1(few clouds);
      if(this.cloudCoverage > 1)
      {
        starPlate.style.display = "none";
      }else
      {
        starPlate.style.display = "block";      
      }
    
      
      //Stops any precipitation
      if(this.precipitation)
      {
        this.stopPrecip();
      }     
  }



  this.moveCloud = function()
  {
    //moves clouds across the sky
    cloudX++;
    //var cx = parseInt(skyPlate_a.offsetLeft) + 1;
    if(cloudX > 800)
    {
      cloudX = 0;
    }
    skyPlate_a.style.left = cloudX + "px";
    skyPlate_aa.style.left = (cloudX - 800) + "px";
    skyPlate_b.style.left = cloudX + "px";
    skyPlate_bb.style.left = (cloudX - 800) + "px";

    this.cloudMoveTimerObj = setTimeout("sky.moveCloud()",200);
  
  
  
  }


  this.stopCloud = function()
  {
    clearTimeout(this.cloudMoveTimerObj);
  }
  
  
//   ********************* Precipitation/wind Stuff ************************
  
  this.initPrecip =function()
  {
     //initilizes the precipitation animation
     precipAnimation = new animation('precipAnimation');
     precipAnimation.srcObj = document.getElementById("PrecipLayer");
     precipAnimation.src = null;
     precipAnimation.startFrame = 15;
     precipAnimation.endFrame = 59;
     precipAnimation.loopCount = -1;
     precipAnimation.endCallBack = "";
     precipAnimation.frameRate = 15;
  }  
  
  this.initWind =function()
  {
     //initilizes the wind animation
     windAnimation = new animation('windAnimation');
     windAnimation.srcObj = document.getElementById("grassLayer");
     windAnimation.src = "world/grass/grass";
     windAnimation.startFrame = 0;
     windAnimation.endFrame = 59;
     windAnimation.loopCount = -1;
     windAnimation.endCallBack = "";
     windAnimation.frameRate = 8;
  }  


  this.startPrecip = function()
  {
    //starts precifitation
  
     precipAnimation.start();
     this.precipitation = true;
  }
  
  this.stopPrecip = function()
  {
    //starts precifitation
    precipAnimation.stop();
    precipAnimation.srcObj.style.display = "none";
    if(theWeather.wind < 20)
    {
      weatherSound = "base_background";
      getSoundState();
    }
    this.precipitation = false;
  
  }
 
 
  this.setPrecip = function(p)
  {
    //sets the type of precipitation
    
    switch(p)
    {
    
      case "rain_3":
        precipAnimation.src = "sky/precip/rain3/rain";
        if(theWeather.wind < 20)
        {
          weatherSound = "rain";
          getSoundState();
        }
       break;
      case "snow_3":
        precipAnimation.src = "sky/precip/snow3/snow";
       break;
    }
    this.precipitationType = p;
    this.setCloudCoverage(4);
    this.startPrecip();

  }
  
}    
