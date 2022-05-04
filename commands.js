tempCommandArray = new Array();
function selectCommand(c,v1,v2)
{
  //v1, v2 = general purpose variebles
  currentCommand = c;
  switch(c)
  {
    case "walkTo":
      var x,y;
      x = silk.imgObj.offsetLeft - v1;
      y = silk.imgObj.offsetTop - v2;
      if(silk.imgObj.offsetTop != v2)
      {
        tempCommandArray[tempCommandArray.length]="silk.action.walk(10)";
        tempCommandArray[tempCommandArray.length]="silk.action.climb(" + v2 + ")";
      }
      tempCommandArray[tempCommandArray.length]="silk.action.walk(" + v1 + ")";
     break;
    case "dumpDirt":
      tempCommandArray[tempCommandArray.length]="silk.action.dump()";
      tempCommandArray[tempCommandArray.length]="silk.action.emptyBasket()";
     break;
    case "digHole":
      tempCommandArray[tempCommandArray.length]="silk.action.dig()";
     break;
    case "pickaxe":
      tempCommandArray[tempCommandArray.length]="silk.action.pickaxe()";
     break;
    case "goSitOnRoot":
      tempCommandArray[tempCommandArray.length]="silk.action.walk(135)";
      tempCommandArray[tempCommandArray.length]="silk.action.sitting()";
     break;
     
    case "goSitOnBed":
      tempCommandArray[tempCommandArray.length]="silk.action.walk(570)";
      tempCommandArray[tempCommandArray.length]="silk.action.sitting()";
     break;

    case "goSkiping":
      tempCommandArray[tempCommandArray.length]="silk.action.skip(50)";
      tempCommandArray[tempCommandArray.length]="silk.action.standing()";
     break;

    case "goRead":
      tempCommandArray[tempCommandArray.length]="silk.action.walk(570)";
      tempCommandArray[tempCommandArray.length]="silk.action.readBook()";
     break;
    case "goSleep":
      tempCommandArray[tempCommandArray.length]="silk.action.walk(610)";
      tempCommandArray[tempCommandArray.length]="silk.action.sleep()";
     break;
     
    case "goDrink":
      tempCommandArray[tempCommandArray.length]="silk.action.walk(540)";
      tempCommandArray[tempCommandArray.length]="silk.action.drinking(3)";
      tempCommandArray[tempCommandArray.length]="silk.action.returnDrinkingGlass()";
     break;

    case "goEat":
      tempCommandArray[tempCommandArray.length]="silk.action.eat()";
     break;

    case "takeBasket":
      tempCommandArray[tempCommandArray.length]="silk.action.takeBasket()";
     break;
     
    case "dropBasket":
      tempCommandArray[tempCommandArray.length]="silk.action.dropBasket(" + v1 + "," + v2 + ")";
     break;

    case "gatherBerries":
      tempCommandArray[tempCommandArray.length]="silk.action.gatherFood()";
     break;
     
    case "goJumpingJack":
      tempCommandArray[tempCommandArray.length]="silk.action.walk(50)";
      tempCommandArray[tempCommandArray.length]="silk.action.jumpingJack(10)";
      tempCommandArray[tempCommandArray.length]="silk.action.walk(150)";
      tempCommandArray[tempCommandArray.length]="silk.action.jumpingJack(10)";
      tempCommandArray[tempCommandArray.length]="silk.action.walk(250)";
      tempCommandArray[tempCommandArray.length]="silk.action.jumpingJack(10)";
      tempCommandArray[tempCommandArray.length]="silk.action.walk(350)";
      tempCommandArray[tempCommandArray.length]="silk.action.jumpingJack(10)";
      tempCommandArray[tempCommandArray.length]="silk.action.standing()";
     break;

    case "returnBasket":
      tempCommandArray[tempCommandArray.length]="silk.action.unloadBasket()";
      tempCommandArray[tempCommandArray.length]="silk.action.dropBasket(0,0)";
      tempCommandArray[tempCommandArray.length]="silk.action.basketReturned()";
      tempCommandArray[tempCommandArray.length]="silk.action.standing()";
     break;

    case "goWatchTV":
      tempCommandArray[tempCommandArray.length]="silk.action.walk(560)";
      tempCommandArray[tempCommandArray.length]="silk.action.tvOn()";
      tempCommandArray[tempCommandArray.length]="silk.action.sittingRight()";
     break;
    case "sad":
      tempCommandArray[tempCommandArray.length]="silk.action.sad(0)";
      tempCommandArray[tempCommandArray.length]="silk.action.feelContent(2)";
      tempCommandArray[tempCommandArray.length]="silk.action.standing()";
     break;
    case "happy":
      tempCommandArray[tempCommandArray.length]="silk.action.happy(0)";
      tempCommandArray[tempCommandArray.length]="silk.action.feelContent(11)";
      tempCommandArray[tempCommandArray.length]="silk.action.standing()";
     break;
    case "veryHappy":
      tempCommandArray[tempCommandArray.length]="silk.action.dance(0)";
      tempCommandArray[tempCommandArray.length]="silk.action.feelContent(16)";
      tempCommandArray[tempCommandArray.length]="silk.action.standing()";
     break;
    case "freezing":
      tempCommandArray[tempCommandArray.length]="silk.action.shivering(0)";
      tempCommandArray[tempCommandArray.length]="silk.action.feelContent(-1)";
      tempCommandArray[tempCommandArray.length]="silk.action.standing()";
     break;
    case "sweating":
      tempCommandArray[tempCommandArray.length]="silk.action.sweating(0)";
      tempCommandArray[tempCommandArray.length]="silk.action.feelContent(-1)";
      tempCommandArray[tempCommandArray.length]="silk.action.standing()";
     break;
    case "sick":
      tempCommandArray[tempCommandArray.length]="silk.action.painSleep()";
     break;
    case "emcConvert":
      tempCommandArray[tempCommandArray.length]="silk.action.emcConvert()";
     break;
     
     
    case "testAll":
      tempCommandArray.length = 0;	//clears array
      tempCommandArray[tempCommandArray.length]="silk.action.gatherFood()";
      tempCommandArray[tempCommandArray.length]="silk.action.drinking()";
      tempCommandArray[tempCommandArray.length]="silk.action.returnDrinkingGlass()";
      tempCommandArray[tempCommandArray.length]="silk.action.readBook()";
      tempCommandArray[tempCommandArray.length]="silk.action.shivering()";
      tempCommandArray[tempCommandArray.length]="silk.action.painSleep()";
      tempCommandArray[tempCommandArray.length]="silk.action.tvOn()";
      tempCommandArray[tempCommandArray.length]="silk.action.sickSleep()";
      tempCommandArray[tempCommandArray.length]="silk.action.standing()";
      tempCommandArray[tempCommandArray.length]="silk.action.sleep()";
      tempCommandArray[tempCommandArray.length]="silk.action.skip(100)";
      tempCommandArray[tempCommandArray.length]="silk.action.sitting()";
      tempCommandArray[tempCommandArray.length]="silk.action.sittingRight()";
      tempCommandArray[tempCommandArray.length]="silk.action.tvOff()";
      tempCommandArray[tempCommandArray.length]="silk.action.walk(20)";
      tempCommandArray[tempCommandArray.length]="silk.action.mad2()";
      tempCommandArray[tempCommandArray.length]="silk.action.dance()";
      tempCommandArray[tempCommandArray.length]="silk.action.sad()";
      tempCommandArray[tempCommandArray.length]="silk.action.sick()";
      tempCommandArray[tempCommandArray.length]="silk.action.mad()";
      tempCommandArray[tempCommandArray.length]="silk.action.jumpingJack(1)";
      tempCommandArray[tempCommandArray.length]="silk.action.eat()";
      tempCommandArray[tempCommandArray.length]="silk.action.happy()";
     break;
  }
}