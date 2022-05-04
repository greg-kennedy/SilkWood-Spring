function weatherObj()
{
  //controls getting/storing and distrubting the weather

  this.updateTimerObj;			//update timer object
  this.wind = 0;
  this.temperature = -50;
  this.sunrise;
  this.sunset;
  this.sky;
  this.forecast1Date;
  this.forecast2Date;
  this.forecast1Cond;
  this.forecast2Cond;
  this.obvTime;		//time the last weather was taken
  this.updatating = false;	//is true when world is getting new  weather data
  this.curWxSta = "USPA0311";
  this.curWxName = "Collegeville, PA";
  this.penWxSta = "uspa0311";
  this.penWxStaName = "Collegeville,PA";
  this.searchSize = 0;	//size of search result
  this.unit = "F";
  this.timeUnit = "24";
  this.rqObject;	//http request object
  if(platform == "hta")
  {
    this.xDoc = new ActiveXObject("Microsoft.XMLDOM");
  }

  this.xmlObj = function()
  {
     //xml object used to get data from weather server
     switch(platform)
     {
        case "hta":
          this.rqObject = new ActiveXObject("Msxml2.XMLHTTP");
         break;
        case "mac":
          this.rqObject = new XMLHttpRequest();
         break;
     }
  }
  

  this.sync = function()
  {
    this.penWxStaName = this.curWxName;
    WxFrontName.innerHTML = this.curWxName;
    this.update();  
  }
  
  this.update = function(mt)
  {
     //Main weather loop
     this.requestCurrentWeather(this.curWxSta);  
  }
  
  
  this.searchWeatherLocation = function()
  {
     //search for location ID for site s
    this.xmlObj();
    this.rqObject.onreadystatechange = theWeather.receiveLocation;
    if(platform == "mac")
    {
      this.rqObject.overrideMimeType("text/xml");
    }
    this.rqObject.open("GET", "http://xoap.weather.com/search/search?where=" + weatherCity_IN.value);
    this.rqObject.send(null); 
  
  }
  
  this.receiveLocation = function()
  {
    var wxR,r,rm,li;
    theWeather.clearSearch();
    if(theWeather.rqObject.readyState == 4 )
    {
      if(platform == "hta")
      {
        wxR = theWeather.rqObject.responseText;
        theWeather.xDoc.loadXML(wxR);
        theWeather.rqObject = theWeather.xDoc.documentElement;
        rm = theWeather.rqObject.selectNodes("loc");
        theWeather.searchSize = rm.length;
        for(var a=0;a<rm.length;a++)
        {
          li = document.createElement("div");    
          li.style.position = "absolute";
          li.title = rm[a].selectSingleNode("@id").text;
          li.style.left = 0;
          li.style.top = 20 * a;
          li.style.cursor = "pointer";
          li.innerHTML = rm[a].text;
          li.onclick = function(){theWeather.selectWeather(this.title,this.innerHTML)};
         weatherSearchResult.appendChild(li);
        }
      }else
      {
        wxR = theWeather.rqObject.responseXML;
        rm = wxR.getElementsByTagName("loc");	  
        theWeather.searchSize = rm.length;
        for(var a=0;a<rm.length;a++)
        {
          li = document.createElement("div");    
          li.style.position = "absolute";
          li.title = rm[a].getAttribute("id");
          li.style.left = 0;
          li.style.top = 20 * a;
          li.style.cursor = "pointer";
          li.innerHTML = rm[a].firstChild.nodeValue;
          li.onclick = function(){theWeather.selectWeather(this.title,this.innerHTML)};
          weatherSearchResult.appendChild(li);
        }      
      }
      if(theWeather.searchSize == 0)
      {
        weatherSearchResult.innerHTML = "<b>City not found</b>";
      }
    }
  }

  this.searchResultUp = function()
  {
   var y;
   y = Math.min(parseInt(weatherSearchResult.style.top.split("p")[0])+15,0);
   weatherSearchResult.style.top = y;
  }
  
  this.searchResultDn = function()
  {
   if(this.searchSize > 4)
   {
     var y;
     y = Math.max(parseInt(weatherSearchResult.style.top.split("p")[0])-15,-15 * this.searchSize);
     weatherSearchResult.style.top = y;
   }
  }
  
  this.selectWeather = function(wId,wName)
  {
  
     theWeather.penWxSta = wId;
     WxStaName.innerHTML = wName;
     theWeather.penWxStaName = wName;     
  }
  
  this.clearSearch = function()
  {
    //
    weatherSearchResult.innerHTML = "";
    weatherSearchResult.style.top = 0;
 }
  
  
  this.getNewWeather = function()
  {
    WxStaName.innerHTML = theWeather.penWxStaName;
    theWeather.curWxName = theWeather.penWxStaName;
    this.requestCurrentWeather(theWeather.penWxSta)
    closeWeatherUI();
  }
  
  
  this.requestCurrentWeather = function(wID)
  {
    //Sends a request to the weather server;
    //wID=weather string()
    this.curWxSta = wID;
    this.updating = true;
    this.xmlObj();
    this.rqObject.onreadystatechange = theWeather.receiveWeather;
    this.rqObject.open("GET", "http://xml.weather.yahoo.com/forecastrss?u=c&p=" + encodeURIComponent(this.curWxSta), true);
    this.rqObject.send(null); 
  }
  
  
  this.receiveWeather = function()
  {
    if(theWeather.rqObject.readyState == 4 )
    {
	if(theWeather.parseWeather(theWeather.rqObject.responseXML,false))
	{
	  WxFrontName.innerHTML = theWeather.penWxStaName;
	  theWeather.processWeather();
	}
    }
    this,updating = false;
  }


  this.parseWeather = function(wx,o)
  {
    //  if o = true , then it forces the system to reparse weather data 
    var l,c,t;
    c = true;
    if(platform == "hta")
    {
    //Check validity of returned data
	try
	{
	  l = this.obvTime;
	  this.obvTime = wx.selectSingleNode("rss/channel/item/yweather:condition/@date").text;	 
	  /*
	  if(l == this.obvTime && !o)
	  {
	    c = false;		//if weather has not changed then iqure the rest;

	  }else
	  {
	  */
	    this.wind = wx.selectSingleNode("rss/channel/yweather:wind/@speed").text;
	    this.temperature = parseInt(wx.selectSingleNode("rss/channel/item/yweather:condition/@temp").text);
	    this.sunrise = wx.selectSingleNode("rss/channel/yweather:astronomy/@sunrise").text;
	    this.sunset = wx.selectSingleNode("rss/channel/yweather:astronomy/@sunset").text;
	    this.sky = wx.selectSingleNode("rss/channel/item/yweather:condition/@code").text;
	    this.forecast1Date = wx.selectSingleNode("rss/channel/item/yweather:forecast[0]/@date").text;
	    this.forecast2Date = wx.selectSingleNode("rss/channel/item/yweather:forecast[1]/@date").text;

	    this.forecast1Cond = "Low: " + stdTemp(parseInt(wx.selectSingleNode("rss/channel/item/yweather:forecast[0]/@low").text),false);
	    this.forecast1Cond = this.forecast1Cond + "&nbsp;&nbsp;&nbsp;High: " + stdTemp(parseInt(wx.selectSingleNode("rss/channel/item/yweather:forecast[0]/@high").text),false);
	    this.forecast1Cond = this.forecast1Cond + "<br>Sky: " + wx.selectSingleNode("rss/channel/item/yweather:forecast[0]/@text").text;
	    this.forecast2Cond = "Low: " + stdTemp(parseInt(wx.selectSingleNode("rss/channel/item/yweather:forecast[1]/@low").text),false);
	    this.forecast2Cond = this.forecast2Cond + "&nbsp;&nbsp;&nbsp;High: " + stdTemp(parseInt(wx.selectSingleNode("rss/channel/item/yweather:forecast[1]/@high").text),false);
	    this.forecast2Cond = this.forecast2Cond + "<br>Sky: " + wx.selectSingleNode("rss/channel/item/yweather:forecast[1]/@text").text;
	  //}
	} catch (error) 
	{
	   tempDiv.style.color= "red";
	   return;
	}        
    }else if(platform == "mac")
    {
    //Check validity of returned data
	try
	{      
	  l = this.obvTime;
	  this.obvTime = wx.getElementsByTagName("condition")[0].getAttribute("date");
	  if(l == this.obvTime)
	  {
	    c = false;		//if weather has not changed then iqure the rest;

	  }else
	  {
	    this.wind = wx.getElementsByTagName("wind")[0].getAttribute("speed");	  
	    this.temperature = parseInt(wx.getElementsByTagName("condition")[0].getAttribute("temp") );	  
	    this.sunrise = wx.getElementsByTagName("astronomy")[0].getAttribute("sunrise");	  
	    this.sunset = wx.getElementsByTagName("astronomy")[0].getAttribute("sunset");	  
	    this.sky = wx.getElementsByTagName("condition")[0].getAttribute("code");	  
	    this.forecast1Date = wx.getElementsByTagName("forecast")[0].getAttribute("date"); 
	    this.forecast2Date = wx.getElementsByTagName("forecast")[1].getAttribute("date"); 
	    
	    this.forecast1Cond = "Low: " + stdTemp(parseInt(wx.getElementsByTagName("forecast")[0].getAttribute("low")),false); 
	    this.forecast1Cond = this.forecast1Cond + "&nbsp;&nbsp;&nbsp;High: " + stdTemp(parseInt(wx.getElementsByTagName("forecast")[0].getAttribute("high")),false); 
	    this.forecast1Cond = this.forecast1Cond + "<br>Sky: " + wx.getElementsByTagName("forecast")[0].getAttribute("text"); 
	    this.forecast2Cond = "Low: " + stdTemp(parseInt(wx.getElementsByTagName("forecast")[1].getAttribute("low")),false); 
	    this.forecast2Cond = this.forecast1Cond + "&nbsp;&nbsp;&nbsp;High: " + stdTemp(parseInt(wx.getElementsByTagName("forecast")[1].getAttribute("high")),false); 
	    this.forecast2Cond = this.forecast1Cond + "<br>Sky: " + wx.getElementsByTagName("forecast")[1].getAttribute("text"); 
	  }
	} catch (error) 
	{
	   tempDiv.style.color = "red";
	   return;
	}        
    }
    this.dawnThreshold = convertSunTime(this.sunrise) - 30; //time shen sunrise starts - 15 minutes
    this.duskThreshold = convertSunTime(this.sunset) - 30; //time when sunset starts - 15 minutes
    
    tempDiv.style.color = "white";
    return c;
  
  }



  this.processWeather = function()
  {
//this.temperature = 7;
//theWeather.wind = 19
    var s,w;
    tempDiv.innerHTML = stdTemp(theWeather.temperature,true);
    windDiv.innerText = Math.round(theWeather.wind) + "mph";
    windmill.frameRate = Math.round(theWeather.wind/2) + 1;
    windmill.start();
    grassLayer.src = "world/grass/grass_0.png"      
    if(theWeather.wind >=20)
    {
      if(theWeather.wind >=40)
      {
	grassLayer.src = "world/grass/grass_40.png";
        weatherSound = "storm_background";
        soundMan.play(weatherSound,"env");            
      }else
      {
        grassLayer.src = "world/grass/grass_20.png";
        weatherSound = "breeze_background";
        soundMan.play(weatherSound,"env");            

      }
      if(gameStage < 2)
      {
        startGust();
      }
    }else
    {
      weatherSound = "base_background";
      soundMan.play(weatherSound,"env");    
    }
    //Set the game world to the current Weather conditions
    //set sky conditions
//this.sky = "43"; 

    switch(this.sky)
    {
      case "0":
      	 sky.setCloudCoverage(4);
        break;
      case "1":
      	 sky.setCloudCoverage(4);      
        break;
      case "2":
      	 sky.setCloudCoverage(4);      
        break;
      case "3":
      	 sky.setCloudCoverage(4);      
        break;
      case "4":
      	 sky.setCloudCoverage(4);      
        break;
      case "5":
        sky.setPrecip("rain_3");      
        break;
      case "6":
        sky.setPrecip("rain_3");            
        break;
      case "7":
        sky.setPrecip("snow_3");      
        break;
      case "8":
        sky.setPrecip("rain_3");       
        break;
      case "9":
        sky.setPrecip("rain_3");       
        break;
      case "10":
        sky.setPrecip("rain_3");       
        break;
      case "11":
        sky.setPrecip("rain_3");       
        break;
      case "12":
        sky.setPrecip("rain_3");       
        break;
      case "13":
        sky.setPrecip("snow_3");       
        break;
      case "14":
        sky.setPrecip("snow_3");       
        break;
      case "15":
        sky.setPrecip("snow_3");       
        break;
      case "16":
        sky.setPrecip("snow_3");       
        break;
      case "17":
        sky.setPrecip("snow_3");       
        break;
      case "18":
        sky.setPrecip("snow_3");       
        break;
      case "19":
      
        break;
      case "20":
      	 sky.setCloudCoverage(4);       
        break;
      case "21":
      	 sky.setCloudCoverage(4);       
        break;
      case "22":
      	 sky.setCloudCoverage(4);       
        break;
      case "23":
      
        break;
      case "24":
      
        break;
      case "25":
      
        break;
      case "26":
      	 sky.setCloudCoverage(4);       
        break;
      case "27":
      	 sky.setCloudCoverage(3);       
        break;
      case "28":
      	 sky.setCloudCoverage(3);       
        break;
      case "29":
      	 sky.setCloudCoverage(2);       
        break;
      case "30":
      	 sky.setCloudCoverage(2);       
        break;
      case "31":
      	 sky.setCloudCoverage(0);       
        break;
      case "32":
      	 sky.setCloudCoverage(0);       
        break;
      case "33":
      	 sky.setCloudCoverage(1);       
        break;
      case "34":
      	 sky.setCloudCoverage(1);       
        break;
      case "35":
        sky.setPrecip("snow_3"); 
        break;
      case "36":

        break;
      case "37":
      	 sky.setCloudCoverage(1);
        break;
      case "38":
      	 sky.setCloudCoverage(2);      
        break;
      case "39":
      	 sky.setCloudCoverage(2);      
        break;
      case "40":
        sky.setPrecip("rain_3");      
        break;
      case "41":
        sky.setPrecip("snow_3");      
        break;
      case "42":
        sky.setPrecip("snow_3");      
        break;
      case "43":
        sky.setPrecip("snow_3");           
        break;
      case "44":
      	 sky.setCloudCoverage(2);           
        break;
      case "45":
      	 sky.setCloudCoverage(4);      
        break;
      case "46":
        sky.setPrecip("snow_3");       
        break;
      case "47":
      	 sky.setCloudCoverage(1);      
        break;
      case "3200":
      
        break;
    
    }

  }


}
