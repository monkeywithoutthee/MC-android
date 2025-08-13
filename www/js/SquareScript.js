//heres the plan
  //default to squares.

'use strict';

//square colurs rgba(28, 28, 28, 0.4), red rgba(250, 250, 250, 0.5)
    const unbeatenAmount = 10;//the number of games in the challenge
    const maxOut = 3600;//total time allowed for the ten game challenege (seconds) 3600 secs = 1 hour!
    var oSQ = {
    	gameClicks:0,//the amount of squares pressed in a game
    	unbeatenAmount: unbeatenAmount,
      iSquarePlayer: 1,//player in action
      igamePlayer: 1,//who started the game
      bGameOver: false,
      bfirstMove: true,//is it the first move of the game
      bDramaticPause: false,
      strSQBackground: '#EAE6DA',
      strSquareColour: 'rgba(255,111,97,0.3)',
      strSquareText: 'rgba(250,250,250,0.9)',
      strColorRed: 'rgba(255,111,97,0.3)',
      strColorBlue: 'rgba(42,75,124,0.3)',
      swinRed: 'rgba(255,111,97,0.3)',
      swinBlue: 'rgba(42,75,124,0.3)',
      sdraw: 'rgba(28,28,28,0.4)',
      arrWinLines: [[1,2,3], [4,5,6], [7,8,9], [1,5,9], [3,5,7], [1,4,7], [2,5,8], [3,6,9]],
      asquares: [],
      arrScoreLines:[],
      arrCanWin:[],
      arrCanLoose:[],
      arrWinningLine:[],
      arrWinningLines:[],
      arrWinningCol:[],
      arrHighestValueRows:[],
      playerOption:['you', 'machine', 'friend'],
      playerX:'you',
      playerO:'machine',
      iGotClicked:-1,
      bWinner:false,
      iWinner:0,
      iHighestValue:0,
      iRow:-1,
      iColumn:-1,
      tenGameChallange:false,
      tenGameOptions:{gameTypeID: 1, sChallengeTitle: unbeatenAmount + ' game unbeaten challenge',player:-1, startTime:null, timeTaken:0, unbeaten:0, won:0, winnerName:'',maxOut:maxOut},
      iClickThis:'',
    	tenGameWinner:'',
    	inReplay:false,
    	replayView:-2,
      borderColour:'rgba(250,250,250,0.9)'
    }

    const asheet = {};
      ons.ready(function () {
      //  console.log('ons ready:',ons)
        ons.createElement('action-sheet.html', { append: true })
          .then(function (sheet) {
            asheet.showFromTemplate = sheet.show.bind(sheet);
            asheet.hideFromTemplate = sheet.hide.bind(sheet);
          });

        //  document.querySelector('ons-splitter-side').style.paddingTop='30px !important';

      });


    var drawBoard = ((data)=>{
      var a=oSQ.asquares;
      //data+=1;
        if (data>a.length-1){data=a.length-1};
          //console.log(a,'<<drawBoard::',data,a.length);
          if (data>=-1&&data<a.length){
            document.querySelector('.matchReplayX').innerHTML=data*1+1;
            //clear the board
            var o=document.querySelectorAll('.square');
            o.forEach((item, i)=>{
              item.innerText=''
              item.classList.remove('sqWinnerBlock0');
              item.classList.remove('sqWinnerBlockX');
              //console.log('o::',item);
            });


            for (var i=0;i<=data;i++){
              var j={};
            if (a[i].player===0){
                j={text:'O',bg:oSQ.strColorBlue,col:oSQ.borderColour,class:'sqWinnerBlock0'};
            }else{
                j={text:'X',bg:oSQ.strColorRed,col:oSQ.borderColour,class:'sqWinnerBlockX'};
            }
            var el=document.getElementById('sq_'+a[i].clicked);
        //  console.log(a,j,'<<j--',el);
            el.innerText=j.text;
          //  el.style.backgroundColor=j.bg;
          //  el.style.color=j.col;
            el.classList.add(j.class);
            //check if data===a.length-1 then disable. if data===0 disable
        };
      };
    });

    function switchPlayers(data){
      //data={player:1}
      //when the player has played, switch the game/in-player details to ST
      //note x=1,o=0
    //  oSQ.igamePlayer //the player who started the game
    //  oSQ.iSquarePlayer //the player in

      oSQ.iSquarePlayer = whosTurn(oSQ.iSquarePlayer);
      oSQ.igamePlayer = oSQ.iSquarePlayer[0];
      oSQ.iSquarePlayer = oSQ.iSquarePlayer[1];
      playerChanged(oSQ.iSquarePlayer);

    }
    function squareControllers() {
      //console.log(oSQ,'<<in squareControllers::',oPage);

      drawSquares();
      oSQ.iSquarePlayer = whosTurn(oSQ.iSquarePlayer);//whosTurn for new game
      oSQ.igamePlayer = oSQ.iSquarePlayer[0];
      oSQ.iSquarePlayer = oSQ.iSquarePlayer[1];
      playerChanged(oSQ.iSquarePlayer);


      //console.log(oSQ,'<<in squareControllers::',oPage);
      $('#divSquares').slideDown('slow',function(){
        $(this).removeAttr('style');
        $(this).removeClass('elHide');
        $(this).addClass('elShow');
      });

      loadOnClick();

  }

  function loadOnClick(){

    $('.square').click(function (event) {
    //    console.log('in clicked');
      //if oSQ.inReplay then reset the page before mving on
      if (oSQ.inReplay){//redraws the board if clicked
          drawBoard(9);
         oSQ.inReplay=false;
      };

        if ((!$(this).hasClass('Pressed'))&&(!oSQ.bGameOver)) {
            //here here here - this is the answer. create similar to this for the first brain click of the game
          //  var iGotClicked = (event.target.id).slice(3, 4);
            oSQ.iGotClicked = (event.target.id).slice(3, 4);
            document.querySelector('.replayForw').disabled=true;
            document.querySelector('.replayBack').disabled=false;
            var winClass = 'sqWinnerBlockX';
          //  console.log('oSQ.iGotClicked=' + oSQ.iGotClicked);

            if (oSQ.strSquareColour === oSQ.strColorRed) {//duh!
                $(this).html('X');
            } else {
                $(this).html('O');
                winClass = 'sqWinnerBlock0';
            }

            //changeclass
            $(this).addClass(winClass);
            $(this).addClass('Pressed');
          //  console.log('timeinterval::',timeinterval);
            checkforWinner(oSQ.iGotClicked);
        }
    });
  }
  function whosTurn(player) {
      //on new game, start with player 1(x). Otherwise at end of game refreshSquares() and whosTurn();
      //oSQ.igamePlayer is the player who began this game
      //oSQ.iSquarePlayer is the player whos turn it is currently
      oSQ.bGameOver = false;
      oSQ.bWinner = false;
      //oSQ.bfirstMove = true;//hello hello hello
    //  console.log('whos turn in game:' + oSQ.igamePlayer + ' - game starter :' + oSQ.iSquarePlayer);
      if (oSQ.igamePlayer === -1) {
          oSQ.igamePlayer = 1;
          oSQ.iSquarePlayer = 0;
      } else {
          if (oSQ.igamePlayer === 0) {
              oSQ.igamePlayer = 1;
              oSQ.iSquarePlayer = 0;
            //  oSQ.strSquareColour = oSQ.strColorRed;
          } else {
              oSQ.igamePlayer = 0;
              oSQ.iSquarePlayer = 1;
           //   oSQ.strSquareColour = oSQ.strColorBlue;
          }
      }
      return [oSQ.igamePlayer, oSQ.iSquarePlayer];
      //playerChanged(oSQ.iSquarePlayer);
    //  console.log('whos turn OUT:: ', oSQ.iSquarePlayer);
  }
  function colourPlayerConts(player){
    var strGotClicked = '';
    if (player === 1) {
        strGotClicked = 'Player X';
        $('#div_1').addClass('divPlayer');
        $('#div_1').removeClass('sqDivDisabled');
        $('#div_1').addClass('sqDivX');
      $('#div_0').addClass('sqDivDisabled');
    } else {
        strGotClicked = 'Player O';
        $('#div_0').addClass('divPlayer');
        $('#div_0').removeClass('sqDivDisabled');
        $('#div_0').addClass('sqDivO');
        $('#div_1').addClass('sqDivDisabled');
    }
    $('#divGameInfo').html(strGotClicked);
    $('#divGameInfo').addClass('sqBlockClass');
    //  console.log('colourPlayerConts::',player);
  };
  function playerChanged(player) {
      //switch players and the change the necassary
    //  console.log('playerChanged FROM:::' + player)

    if (player === 0) {//this is the switch
        oSQ.iSquarePlayer = 1;
        oSQ.strSquareColour = oSQ.strColorRed;
    } else {
        oSQ.iSquarePlayer = 0;
        oSQ.strSquareColour = oSQ.strColorBlue;
    }
    colourPlayerConts(oSQ.iSquarePlayer);

      //begining of the brain. For now the brain is player BLUE(0)!!
      if (oSQ.iSquarePlayer === 0) {//this is will be the switch for manual mode!
        if (oSQ.playerO === 'machine') {
          oSQ.bDramaticPause = true;
          //here here here
          if (oSQ.tenGameOptions.player !== oSQ.iSquarePlayer) {
            stopTimer();
          }
          showModal(0);
          theBrainMove();
        } else {
          oSQ.bDramaticPause = false
          if (oSQ.tenGameOptions.player === oSQ.iSquarePlayer) {
            if (oSQ.tenGameChallange){
              startTimer();//starts the timer if in challange
            };
          };
        };
      } else {
        if (oSQ.playerX === 'machine') {
          oSQ.bDramaticPause = true;
          //here here here
          if (oSQ.tenGameOptions.player !== oSQ.iSquarePlayer) {
            stopTimer();
          }
          showModal(0);
          theBrainMove();
        } else {
          oSQ.bDramaticPause = false
          if (oSQ.tenGameOptions.player === oSQ.iSquarePlayer) {
            startTimer();//starts the timer if in challange
          }
        }
      }
    //  console.log('playerChanged OUT oSQ.iSquarePlayer=' + oSQ.iSquarePlayer);
  }
  function checkforWinner(lastClicked) {
      oSQ.gameClicks += 1;
      //oSQ.iSquarePlayer  lastClicked=sq_2 oSQ.iSquarePlayer=1
      var strNew = JSON.parse('{\"player\":' + oSQ.iSquarePlayer + ',\"clicked\":' + lastClicked + '}');
      oSQ.asquares.push(strNew);
      document.querySelector('.matchReplayX').innerHTML=oSQ.asquares.length;
      oSQ.replayView=oSQ.asquares.length-1;
      //oSQ.amoves.push(strNew);
    //  console.log(strNew,'<<checkforWinner::',oSQ.asquares);
      //console.log('lastClicked=' + lastClicked + ' oSQ.iSquarePlayer=' + oSQ.iSquarePlayer + ' lastClicked=' + lastClicked + ' oSQ.asquares.length=' + oSQ.asquares.length);
    //  console.log('checking for winner ', oSQ);
      oSQ.bfirstMove = false;//here here here
      var isDraw = true;
  //    console.log('isDraw TOP::', isDraw);

    //  var iPlayer0 = 0;
    //  var iPlayer1 = 1;
    //  var bWinner = false;
    //  var iWinner = 0;
      //winning liones
      //1,2,3
      //4,5,6
      //7,8,9
      //1,5,9
      //3,5,7

      // the winner must get a full sett.5 possible sets
      //true,true,true

      //  oSQ.asquares = [{ 'player': 0, 'clicked': 5 }, { 'player': 1, 'clicked': 3 }, { 'player': 0, 'clicked': 2 }, { 'player': 1, 'clicked': 8 }, { 'player': 0, 'clicked': 9 }]
      for (var j = 0; j < oSQ.arrWinLines.length; j++) {
       //   var strThisCheck = oSQ.arrWinLines[j];
         // arrTmp = (strThisCheck).split(',');
          var arrTmp = oSQ.arrWinLines[j];
        //  console.log(' oSQ.iSquarePlayer=' + oSQ.iSquarePlayer);
          oSQ.iWinner = 0;
          for (var i = 0; i < arrTmp.length; i++) {
              oSQ.bWinner = false;
              for (var k = 0; k < oSQ.asquares.length; k++) {
                  // oSQ.bWinner = false;
                  if (oSQ.iSquarePlayer === oSQ.asquares[k].player) {
                      //    console.log('comparing arrTmp[i]=' + arrTmp[i] + ' oSQ.asquares[k].clicked=' + oSQ[k].clicked);
                      //we need 3 consecutive trues!!
                      if (arrTmp[i] === oSQ.asquares[k].clicked) {//!!!here!!!!
                          oSQ.bWinner = true;
                          oSQ.iWinner += 1;
                          //     console.log(oSQ.bWinner + ' comparing arrTmp[i] = ' + arrTmp[i] + ' oSQ.asquares[k].clicked =' + oSQ.asquares[k].clicked);
                      }
                  }
              }
            //  console.log('oSQ.bWinner:::', oSQ.bWinner);
            //  var iunbeaten = 3;//the challenge amount in the game!
            //  console.log(i + '::i     oSQ.iSquarePlayer::' + oSQ.iSquarePlayer + '  oSQ.playerX::'+ oSQ.playerX+ '  oSQ.playerO::'+ oSQ.playerO + '   oSQ.bWinner::'+ oSQ.bWinner + '    oSQ.iWinner::', oSQ.iWinner + '    arrTmp::', arrTmp.length - 1);
              if ((oSQ.bWinner === true) && (i === (arrTmp.length - 1)) && (oSQ.iWinner === 3)) {
                //here here here we need to find out if it as a draw. look at 9 played, check in game, add
                  //else if  here here here NEEDS MARKING AS DRAW
                  //to oSQ.tenGameOptions.unbeaten and change oSQ.tenGameOptions.unbeaten to oSQ.tenGameOptions.undeaten
                  //and return false
                  //oSQ.asquares = [];
                  oSQ.bGameOver = true;
                  //alert('we have a winner! in ' + oSQ.iSquarePlayer);
                  //return false;
                  var strDisplayWinner = '0';
                  if (oSQ.iSquarePlayer === 1) {
                      strDisplayWinner = 'X';
                  }
                  if (oSQ.tenGameOptions.player === oSQ.iSquarePlayer && oSQ.tenGameOptions.startTime !== null) {
                    stopTimer();
                    oSQ.tenGameOptions.unbeaten += 1;
                    oSQ.tenGameOptions.won += 1;
                    drawGameDetails();
                    isDraw = false;

                    if (oSQ.tenGameOptions.startTime !== null) {
                        $('#refreshSquares').addClass('paused');
                        $('#refreshSquares').html('Play Game ' + (oSQ.tenGameOptions.unbeaten + 1));
                        if (oSQ.tenGameOptions.unbeaten >= oSQ.unbeatenAmount) {
                          oWinnerResult = new Object(oSQ);
                        //  console.log('WINNER oWinnerResult::', oWinnerResult);
                          challangeWon();
                        }
                    }

                  } else if (oSQ.tenGameOptions.startTime !== null) {
                    isDraw = false;
                    stopTimer();
                  //  var iunbeaten = oSQ.tenGameOptions.unbeaten;
                    var oOptions = {callback:gameContinue, buttonLabels:['close', 'try again']};
                    var sLooser = 'you managed ' + oSQ.tenGameOptions.unbeaten + ' game' + ((oSQ.tenGameOptions.unbeaten !== 1) ? 's':'') + ' unbeaten!';
                    ons.notification.confirm(sLooser, oOptions);
                    oSQ.tenGameOptions = returnGamePlayerDefaults();
                    oSQ.tenGameChallange = false;
                  //  console.log('LOOSER oSQ.tenGameOptions::', ons.notification);
                  }
                  var el =document.getElementById('divSquareMessage');
                  $(el).removeClass('elHide');
                  $(el).addClass('elShow');
                  //const iCardHeight = document.getElementById('square').clientHeight;
                  //quick fix as will improve on object and rebuild this page so..
                  var swinnerCol='sqWinnerBannerX';
                  //console.log(oSQ.strSquareColour,'<<comparing::',oSQ.strColorRed);
                  if (oSQ.strSquareColour!==oSQ.strColorRed){
                    swinnerCol='sqWinnerBanner0';
                  };
                  el.style.top='0px';
                  $(el).removeClass('sqWinnerDraw');
                  $(el).removeClass('sqWinnerBannerX');
                  $(el).removeClass('sqWinnerBanner0');
                  $(el).addClass(swinnerCol);
                  $(el).html('we have a winner! '+strDisplayWinner+' wins!');
                  const iTop=Math.floor(document.getElementById('square').clientHeight/2-40);
                  //el.style.top=iTop+'px';
                  $(el).animate({top:iTop});
                  setLocal('soSQ',oSQ);
                //  console.log(el,'<<ON WIN::',iTop);
                  return false;
              }
          }
      }
    //  console.log('marking draw isDraw::', isDraw);

      if (oSQ.gameClicks === 9 && isDraw === true) {
        //its a draw
        //its being checked by the line - therefore
        if (oSQ.tenGameOptions.startTime !== null) {
            stopTimer();
            oSQ.tenGameOptions.unbeaten += 1;
            $('#refreshSquares').addClass('paused');
            $('#refreshSquares').html('Play Game ' + (oSQ.tenGameOptions.unbeaten + 1));
            drawGameDetails();
            if (oSQ.tenGameOptions.unbeaten >= oSQ.unbeatenAmount && oSQ.tenGameOptions.unbeaten > 0) {
              challangeWon();
            }
        }
        var el =document.getElementById('divSquareMessage');
        $(el).removeClass('elHide');
        $(el).addClass('elShow');
        el.style.top='0px';
        $(el).html('DRAW!!!');
        $(el).removeClass('sqWinnerBanner0');
        $(el).removeClass('sqWinnerBannerX');
        $(el).addClass('sqWinnerDraw');
        const iTop=Math.floor(document.getElementById('square').clientHeight/2-40);
        $(el).animate({top:iTop});
        setLocal('soSQ',oSQ);
        //console.log('the game draw::',getLocal('soSQ'));
        return false;
      //  console.log('in draw   oSQ.tenGameOptions.unbeaten::', oSQ.tenGameOptions.unbeaten, ' oSQ.unbeatenAmount::', oSQ.unbeatenAmount);
    };

    //  console.log('the game play::',getLocal('soSQ'));

      playerChanged(oSQ.iSquarePlayer);
      setLocal('soSQ',oSQ);
  }
  function theBrainMove() {
      //the idea is to build an opponent!
      //Their objectivce is to win the game.
          //they will..
          //1. Try win
          //2. check will loose else?
          //3. best mode
          //4. any move

  /*this is the plan, when it is the brains turn we run a loop
      through win wines.the numbers of each of the win lines
      call the function that looks up what has been clicked
      whilst in the loop we will write the possibilities, the value of
      what is already in this line with regard to spaces and clicks.
      whilst in this loop it will calculate the score of the row.
  1 point if brain has already clicked on row
          - 1 point in oponent has clicked on row
      1 point per space in row.
      end loop and begin another to find the highest scoring option.
      In the event of more than result, random the row count for the return square.
      oSQ.arrWinLines = [[1,2,3], [4,5,6], [7,8,9], [1,5,9], [3,5,7], [1,4,7], [2,5,8], [3,6,9]];
  */
    //  var arrScoreLines = [];
      oSQ.arrScoreLines = [];
      for (var i = 0; i < oSQ.arrWinLines.length; i++) {
          oSQ.arrScoreLines.push(JSON.parse(returnScoreLine(oSQ.arrWinLines[i], i)));
      }
      //look for the highest score
      //console.log(oSQ.arrWinLines);
      //console.log('oSQ.arrScoreLines updated :');
      //console.log(oSQ.arrScoreLines);
      //HERE BHERE HERE returnScoreLine IS WHERE THE ISSUE IS, SORT THAT AND ITS A DODLE

      var iSituation = 0;//get highest = 0, get winner = 1, Block Loose = 2
     // var arrScoreLine2Choose = [];
    //  var arrHighestValueRows = [];
      oSQ.arrHighestValueRows = [];
    //  var arrCanWin = [];
      oSQ.arrCanWin = [];
      //var arrCanLoose = [];
      oSQ.arrCanLoose = [];
    //  var iHighestValue = 0;
      oSQ.iHighestValue = 0;
      for (var i = 0; i < oSQ.arrScoreLines.length; i++) {
      //    console.log('oSQ.arrScoreLines[i] in the loop');
      //    console.log(oSQ.arrScoreLines[i]);
          if (oSQ.arrScoreLines[i].points === 4) {//brain can win
              oSQ.arrCanWin.push(oSQ.arrScoreLines[i]);
          } else if (oSQ.arrScoreLines[i].points === 0) {//your oppennt can win, you want this space!
             // console.log('we can loose!!');
              oSQ.arrCanLoose.push(oSQ.arrScoreLines[i]);
          }
          else {
            //  oSQ.arrHighestValueRows.push(oSQ.arrScoreLines[i]);
              if (oSQ.arrScoreLines[i].points > oSQ.iHighestValue) {
                  oSQ.iHighestValue = oSQ.arrScoreLines[i].points;
              }
              for (var j = 0; j < oSQ.arrScoreLines.length; j++) {
                  if (oSQ.arrScoreLines[j].points === oSQ.iHighestValue) {
                      oSQ.arrHighestValueRows.push(oSQ.arrScoreLines[j]);
                  }
              }
          }
      }
      //console.log('oSQ.iHighestValue=' + oSQ.iHighestValue);
      //console.log('oSQ.arrCanWin');
      //console.log(oSQ.arrCanWin, oSQ.arrCanWin.length);
      //console.log('oSQ.arrCanLoose');
      //console.log(oSQ.arrCanLoose, oSQ.arrCanLoose.length);
      //console.log('oSQ.arrHighestValueRows');
      //console.log(oSQ.arrHighestValueRows);
      //oSQ.arrHighestValueRows wiull be a list as [1,4,7] - all this will have the same top sccore value (ie 2)
    //  var iUseThisLine = -1;
    //  var arrWinningLines = [];
      oSQ.WinningLines = [];
      if (oSQ.arrCanWin.length > 0) {
        //  console.log('in can win');
          for (var i = 0; i < oSQ.arrScoreLines.length; i++) {
              if (oSQ.arrScoreLines[i].points === 4) {//brain can win
                  oSQ.WinningLines.push(oSQ.arrScoreLines[i]);
               //   break;
              }
          }
      } else if (oSQ.arrCanLoose.length > 0) {
      //    console.log('in can loose');
          for (var i = 0; i < oSQ.arrScoreLines.length; i++) {
              if (oSQ.arrScoreLines[i].points === 0) {//brain can win
                  oSQ.WinningLines.push(oSQ.arrScoreLines[i]);
                //  break;
              }
          }
      } else {
      //    console.log('in find highest');
          for (var i = 0; i < oSQ.arrScoreLines.length; i++) {
              if (oSQ.arrScoreLines[i].points === oSQ.iHighestValue) {
                  oSQ.WinningLines.push(oSQ.arrScoreLines[i]);
              }
          }
      };
   //   iUseThisLine = getRandomNumber(0, iScoreLength);//more than one line with same criteria. use this row in the next loop

   //   console.log(arrScoreLine2Choose[iUseThisLine]);
   //   var arrWhichofthe32Click = arrScoreLine2Choose[iUseThisLine];//just leaves the choice of the 3 eg [-1,2,-1] we would want the second column of the array else we would loose
    //  console.log('oSQ.WinningLines::',oSQ.WinningLines);//choose one of these

    //  var arrWinningLine = [];
    oSQ.WinningLine = [];
      var iDevRow = getRandomNumber(oSQ.WinningLines.length, 0)

      oSQ.WinningLine.push(oSQ.WinningLines[iDevRow]);//creates the line we will use


    //  console.log();
    //  console.log('oSQ.WinningLine::', oSQ.WinningLine);//the final line object

      //we want the best option to click. It will have a value of 2
      //var arrWinningCol = oSQ.WinningLine[0].sQs;
      oSQ.arrWinningCol = oSQ.WinningLine[0].sQs;

    //  var iRow = oSQ.WinningLine[0].winLineRow;
      oSQ.iRow = oSQ.WinningLine[0].winLineRow;
    //  console.log('oSQ.arrWinningCol', oSQ.arrWinningCol);//the final line object
    //  var iColumn = 0;
      oSQ.iColumn = 0;
      var aColumn = [];
      //brain improvement. The a line === XOX or OXO, check if the center square is available. If so take it!

      for (var i = 0; i < oSQ.arrWinningCol.length; i++) {

          if (oSQ.arrWinningCol[i] === 2) {//2 = space! - this can be improved, there might be more than one result with 2
              //oSQ.iColumn = i;//NOTE if you needed to add a difficulty level use oSQ.iColumn = i here and remove below for "beginner" - other is advanced!
            //  break;
              aColumn.push(i) ;         //therefore - make an array of the possibiklities and random pick 1 of them
          }
      }
      oSQ.iColumn = getRandomNumber(aColumn.length,0);
      oSQ.iColumn = aColumn[oSQ.iColumn];
      //console.log(oSQ.iRow, '<<row    iColumn>>', oSQ.iColumn, ' iColumn>>', aColumn);
    //  var iClickThis = (oSQ.arrWinLines[oSQ.iRow][oSQ.iColumn]).toString();//
      oSQ.iClickThis = (oSQ.arrWinLines[oSQ.iRow][oSQ.iColumn]).toString();//
    //  console.log('brain is trying to click ' + oSQ.arrWinLines[oSQ.iRow][oSQ.iColumn]);
    //  console.log('brain is trying to click ' + '#sq_' + oSQ.iClickThis);

      //hthis wont work on the first move. work out if its the first move and if so do similat to whats on line 46. else do the click
    //  setTimeout($('#sq_' + oSQ.iClickThis).click(), 3000);
    //  $('#sq_' + oSQ.iClickThis).click();
      var oClickedSquare = $('#sq_' + oSQ.iClickThis);
      //document.getElementById('sq_' + oSQ.iClickThis[0]).removeAttribute('style');
     // console.log('background color is:', document.getElementById('sq_' + oSQ.iClickThis));
     var iRandomNo = getRandomNumber(1500, 1000);
     if (oSQ.tenGameOptions.player > -1) {
       iRandomNo = 1000;//1 second  1000n????
     }
    const machinevmachine = oSQ.playerO==='machine'&&oSQ.playerX==='machine' ? true : false;
    if (machinevmachine){iRandomNo = 2000;};
      if (oSQ.bfirstMove === true) {
        //  console.log('oClickedSquare=', oClickedSquare, '  oSQ.strSquareColour::', oSQ.strSquareColour, ' oSQ.strSquareText::', oSQ.strSquareText);
          setTimeout(function () {
          var clickedClass = 'sqWinnerBlockX';
          if (oSQ.strSquareColour === oSQ.strColorRed) {//??
              oClickedSquare.html('X');
            } else {
              oClickedSquare.html('O');
              clickedClass = 'sqWinnerBlock0';
          };
        //  oClickedSquare.attr('style', 'background-color:' + oSQ.strSquareColour + ';color:' + oSQ.strSquareText, + ';border-width:10px;');
          //changeclass
          oClickedSquare.addClass(clickedClass);
          oClickedSquare.addClass('Pressed');
          //close modal
          checkforWinner(oSQ.iClickThis);
          //console.log(':::::::',oSQ,oSQ.playerX,oSQ.playerO);
          //this is a low grade patch!! - cant find the issue!  squares needs re-writing soz!!
          //only an issue when machine is playing against machine
          if (!machinevmachine){
              closeModal();
          };
        }, iRandomNo);

      } else {

        //if competition mode then make timout 1 second else...

          setTimeout(function () {
            closeModal();
              oClickedSquare.click();
              //close modal
          }, iRandomNo);
      }
  }
  function getRandomNumber(hi, lo) {
      //returns a randon number between hi and lo
      return Math.floor(Math.random() * (hi - lo)) + lo;
  }
  function refreshSquares() {
      oSQ.gameClicks = 0;
      oSQ.asquares = [];
      oSQ.arrScoreLines = [];
      oSQ.arrCanWin = [];
      oSQ.arrCanLoose = [];
      oSQ.iHighestValue = 0;
      oSQ.arrWinningLine = [],
      oSQ.arrWinningLines = [],
      oSQ.arrWinningCol = [],
      oSQ.arrHighestValueRows = [],
      oSQ.bGameOver = false;
      oSQ.bWinner = false;
      oSQ.bfirstMove = true;
      oSQ.inReplay=false;
      oSQ.replayView=-2
    //  oSQ.tenGameOptions.timeTaken += oSQ.tenGameOptions.timeTaken;
      $('#divSquareMessage').html('');
      $('#divSquareMessage').removeClass('elShow');
      $('#divSquareMessage').addClass('elHide');
      if (oSQ.tenGameOptions.startTime !== null) {
          $('#refreshSquares').removeClass('paused');
          $('#refreshSquares').html('Game On');
      }
      document.querySelector('.matchReplayX').innerHTML='0';
      document.querySelector('.replayBack').disabled=true;
      document.querySelector('.replayForw').disabled=true;
      if (oSQ.tenGameOptions.player === -1) {
        clearGameDetails();
      };
    squareControllers();
    setLocal('soSQ',oSQ);
  }
  function returnBeenClicked(square) {
      //this is it 'square'! is infact the relating
     //console.log('in return bveeclicked() receiving:' + square + ' oSQ.asquares=');
    //  console.log(oSQ.asquares);
      var ireturnClicked = -1;
      for (var i = 0; i < oSQ.asquares.length; i++) {
          if (oSQ.asquares[i].clicked === square) {
              ireturnClicked = oSQ.asquares[i].player;
              break;
          }
      }
      return ireturnClicked;
  }

  function returnScoreLine(line, i) {

      //console.log('line received');
      //console.log(line);
      var strOdds = '';
      var ipointsScored = 0;
      var ibeenClicked = 0;
      strOdds += '{\"winLineRow\":' + i + ', \"sQs\":[';
      for (var j = 0; j < line.length; j++) {
          ibeenClicked = returnBeenClicked(line[j]);//returns who has clicked
        //  console.log('ibeenClicked=' + ibeenClicked);
          if (ibeenClicked === -1) {//space, 2 points
              strOdds += '2,';
              ipointsScored += 2;
          } else if (ibeenClicked === 0) {//this player, 1 point NOTE 1 will be variable when options are in!
              strOdds += '1,';
              ipointsScored += 1;
          } else {//other player, -1 point
              strOdds += '-1,';
              ipointsScored += -1
          }
      }
      strOdds = strOdds.slice(0, (strOdds.length - 1));
      strOdds += '], \"points\":' + ipointsScored + '}';
    //  console.log(strOdds);
      return strOdds;
  }

  //.--. . .- -.-. . / .--. . .- -.-. . / .--. . .- -.-. . / .--. . .- -.-. . /\\\

  var draw10GameOptions = function() {
    var dialog = document.getElementById('squareCard');//main box
    var playerOptions = document.getElementById('divSquareCard')

    $(".squareCardContent").each(function() {
        $(this).removeAttr("style");
        $(this).removeClass('elShow');
        $(this).addClass('elHide');
    });

    var o10GameOpts = document.getElementById('div10Game');//editable
      o10GameOpts.classList.remove('elHide');
      o10GameOpts.classList.add('elShow');
      document.getElementById('divGiveUp').classList.remove('elShow');
      document.getElementById('divGiveUp').classList.add('elHide');
      document.getElementById('divPlayerUpdate').classList.remove('elShow');
      document.getElementById('divPlayerUpdate').classList.add('elHide');
    //    console.log('oPlayerSwitches:', o10GameOpts, ' this:', event);
      if (dialog) {
        dialog.show();
      };
  };

  var drawSquaresOptions = function(e) {

    //.removeAttribute("style");
    var dialog = document.getElementById('squareCard');
    dialog && dialog.removeAttribute("style");
    console.log(dialog,'<<<<<<<');
    $(".squareCardContent").each(function() {
        $(dialog).removeAttr("style");
        $(this).removeAttr("style");
        $(this).removeClass('elShow');
        $(this).addClass('elHide');
    });
    var oPlayerSwitches = document.getElementById('divSquareCard');
    oPlayerSwitches.classList.remove('elHide');
    oPlayerSwitches.classList.add('elShow');
    document.getElementById('divPlayerUpdate').classList.remove('elHide');
    document.getElementById('divPlayerUpdate').classList.add('elShow');
    document.getElementById('div10Game').classList.remove('elShow');
    document.getElementById('div10Game').classList.add('elHide');
    document.getElementById('divGiveUp').classList.remove('elShow');
    document.getElementById('divGiveUp').classList.add('elHide');

  console.log('squareCard:', dialog, ' oPlayerSwitches:', oPlayerSwitches, ' this:', event);
  //return false;
    if (dialog) {
      dialog.show();
    };
    //put in the option from the object
  //  var oPlayer1 = aOption[0];
  //  var oPlayer0 = aOption[2];
    oPlayerSwitches.firstElementChild.innerHTML = 'X ' + oSQ.playerX;
    oPlayerSwitches.lastElementChild.innerHTML = oSQ.playerO + ' 0';
  //  console.log('p1:',p1, ' p2:', p2);
  };

  var closeSquaresOptions = function(id) {
    var dialog = document.getElementById('squareCard');

    if (dialog) {
      dialog.hide();
    }
  };
  var drawSquares = function(id) {
    var sSquares = document.getElementById('divSquares');
    sSquares.innerHTML = `<div>
        <div class='square sqcorner dotHatch' id='sq_1'></div>
        <div class='square dotHatch' id='sq_2'></div>
        <div class='square sqcorner dotHatch' id='sq_3'></div>
        </div>
        <div>
          <div class='square dotHatch' id='sq_4'></div>
          <div class='square dotHatch' id='sq_5'></div>
          <div class='square dotHatch' id='sq_6'></div>
        </div>
        <div>
          <div class='square sqcorner dotHatch' id='sq_7'></div>
          <div class='square dotHatch' id='sq_8'></div>
          <div class='square sqcorner dotHatch' id='sq_9'></div>
        </div>
        <div>
        <div id='divResult'></div>
    </div>`;
  };
  //.--. . .- -.-. . /
  var aOption = oSQ.playerOption;
  //will need adding to enhanced game Options
  var oPlayer1 = aOption[0];
  var oPlayer0 = aOption[1];


  function changeSQOption(ell, player) {
    //  console.log(oSQ.playerO,oSQ.playerX,oSQ.playerOption,'changeSQOption:', ell, ' player:', player);
  //here are the rules
    //h=get players
    var thisOption;
    //options - you machine friend
      if (player === 1) {
    //    console.log('oPlayer1:', oPlayer1);
        thisOption = oPlayer1;
      } else {
    //    console.log('oPlayer0:', oPlayer0);
        thisOption = oPlayer0;
      };

      var iIndex = oSQ.playerOption.indexOf(thisOption);
    //  console.log('aOption.length:', aOption.length, ' iIndex:', iIndex);
      iIndex = (iIndex * 1 + 1);//clicks through to the next option on list (wont be a long list!)
      if (iIndex >= aOption.length) {
        iIndex = 0
      }

    //  thisOption = aOption[iIndex];
      if (player === 1) {
      //  console.log(iIndex,'<<oPlayer1:', oPlayer1);
        oPlayer1 = aOption[iIndex];
        ell.innerHTML = ('X ' + aOption[iIndex]);
      } else {
    //    console.log('oPlayer0:', oPlayer0);
        oPlayer0 = aOption[iIndex];
        ell.innerHTML = (aOption[iIndex] + ' O');
      };

      var oPlayerSwitches = document.getElementById('divSquareCard');
      oPlayerSwitches.firstElementChild.innerHTML = 'X ' + oPlayer1;
      oPlayerSwitches.lastElementChild.innerHTML = oPlayer0 + ' 0';
      oSQ.playerO = oPlayer0;
      oSQ.playerX = oPlayer1;
      //check that they are both not the same option (ie both you)
    //  console.log('new options oPlayer0:',oSQ.playerO,' oPlayerX:',oSQ.playerX)
  };
  function returnOpposite(iindex) {
  //  console.log('returnOpposite iindex:', iindex);
    //we want the opposite ends of the array
    if (iindex === 0 || iindex === (aOption.length - 1)){
      if (iindex === 0) {
        return (aOption.length - 1)
      } else if (iindex === (aOption.length - 1)) {
        return 0
      }
    } else {
      return iindex;
    }
  }

  function toastSuccess(LogDetails){
      ons.notification.toast(LogDetails,{timeout:4000,animation:'fall'}); // Shows from 0s to 2s
  };
  var returnPageIndex=((data)=>{
    const a=oPage.aPages;
    var retRow=0;
    for(var i=0;i<a.length;i++){
      if(a[i].page===data.page){
        retRow=i;
        break;
      }
    }
    return retRow;
  });
  var getSelectedClass=((data)=>{
    var sreturns = '';
    for (var i = 0; i < data.classList.length; i++) {
      if (data.classList[i].includes('mainListsRow_')){
        sreturns = data.classList[i];
        break;
      };
    };
    return sreturns;
  });
  var returnSelectedClass=((data)=>{
    //console.log('returnSelectedClass::',data);
    //data{classes:[],ellist:'mainListsRow_'}
    var sreturns = '';
    for (var i = 0; i < data.classes.length; i++) {
      if (data.classes[i].includes(data.ellist)){
        sreturns = data.classes[i];
        break;
      };
    };
    return sreturns;
  });



  var onError = function (error) {
    console.log('onError::', onError);
    ons.notification.alert({message:error});
    return false;
  };

  function showModal(messageType) {
    //messageType 1=game, 2=fetching leaderboard, 3=sending result, 4 joke

    var modalMessage = '.-.. --- ...- .';
    if (messageType === 0) {
      modalMessage = getModalMessage(messageType);
    }
    if (messageType === 2) {
      modalMessage = 'fetching leaderboard .-.. --- ...- .';
    }
    if (messageType === 3) {
      modalMessage = 'sending results .--. . .- -.-. .';
    }
    if (messageType === 4) {
      modalMessage = 'fetching a joke .--. . .- -.-. .';
    }
    if (messageType === 5) {
      modalMessage = '.--. . .- -.-. .';
    }
    var modal = document.querySelector('ons-modal');
    modal.show();
    document.getElementById('modalMessage').innerHTML = modalMessage;
      //  getModalContent(imageName);
    }
    function closeModal() {
        var modal = document.querySelector('ons-modal');
        //{animationOptions:{duration: 0.6, delay: 0.2, timing: 'ease-out'}}
        modal.hide();
    }
    function getModalMessage(messageType){
      //messageType 0=general, 1=winner, 2 = looser, 4=competition mode
    //  messageType = 1;
    //  var modalMessages =  arrThoughts[messageType];
      const modalMessages =  sBands;
    //  if (oSQ.tenGameOptions.player === -1) {
        return modalMessages[getRandomNumber(modalMessages.length, 0)];
    /*  } else {
        return 'Competition Mode';
      }*/
    }
    function gameContinue(event){
    //  console.log('gameContinue::', event);
      if (event === 1) {
        startGameChallange();
      } else {
        oSQ = null;
      //  console.log('oFreshSquares::', oFreshSquares);
      $('#refreshSquares').html('Refresh');
      $('#refreshSquares').removeClass('paused');
      $('.leaderCall').html('LEADERBOARD');
        oSQ = new Object(oFreshSquares);
        oSQ.tenGameOptions = returnGamePlayerDefaults();
        oSQ.igamePlayer = -1;
        oSQ.iSquarePlayer = -1;
        clearGameDetails();
      }
    }
    function startGameChallange(){
      //we need a fresh oSQ with new stuff
    //  var itmp = oSQ.iSquarePlayer;
    //NOTE still only challenges on player 1 (X)
    //  var unbeaten = oSQ.tenGameOptions.unbeaten;

    //  console.log('startGameChallange::', oSQ);
      //the challange is always against the machine.
      var aCurrentPlayer;
      if (oSQ.playerX === 'you') {
          aCurrentPlayer = ['you','machine',1];
      } else {
          aCurrentPlayer = ['machine','you',0];
      }
      oSQ = null;
      oSQ = new Object(oFreshSquares);
      oSQ.igamePlayer = 0;
      oSQ.gameClicks = 0;
      oSQ.playerX = aCurrentPlayer[0];
      oSQ.playerO = aCurrentPlayer[1];
      oSQ.tenGameChallange = true;
      oSQ.asquares = [],
      oSQ.arrScoreLines = [],
      oSQ.arrCanWin = [],
      oSQ.arrCanLoose = [],
      oSQ.arrWinningLine = [],
      oSQ.arrWinningLines = [],
      oSQ.arrWinningCol = [],
      oSQ.arrHighestValueRows = [],
      oSQ.inReplay=false;

      oSQ.tenGameOptions = {gameTypeID: 1, sChallengeTitle: oSQ.unbeatenAmount + ' game unbeaten challenge',player:aCurrentPlayer[2], startTime:returnDateStringFromJavaDate(new Date()), timeTaken:0, unbeaten:0, won:0, winnerName:'',maxOut:maxOut};
      closeSquaresOptions();
      $('#divSquareMessage').html('');
      $('#divSquareMessage').removeClass('elShow');
      $('#divSquareMessage').addClass('elHide');
      $('#refreshSquares').removeClass('paused');
      $('#refreshSquares').html('Game On');
      $('.leaderCall').html('GIVE UP');
    //  $('.gameCallIns').addClass('elHide');
    //  $('.gameCall').addClass('gameOnflashbut');
      resetgamecall({gameon:true});
      //
      squareControllers();
      drawGameDetails();
      document.querySelector('.matchReplayX').innerHTML='0';
      document.querySelector('.replayBack').disabled=true;
      document.querySelector('.replayForw').disabled=true;
      //create a 10 game object
      //
    //  oSQ.iSquarePlayer = itmp;
    //  console.log('in startGameChallange oSQ::', oSQ)
    }

    function resetPlayers(){
      //we need a fresh oSQ with new stuff
    //  var itmp = [oSQ.playerX,oSQ.playerO];

      $('.leaderCall').html('LEADERBOARD');
      stopTimer();
      $('#refreshSquares').html('Refresh');
      $('#refreshSquares').removeClass('paused');
      const currentPlayers = [oSQ.playerO,oSQ.playerX];
      oSQ = new Object(oFreshSquares);
    //  console.log('give up press::', oSQ);
      oSQ.playerO = currentPlayers[0];
      oSQ.playerX = currentPlayers[1];
      oSQ.tenGameOptions = returnGamePlayerDefaults();
      oSQ.igamePlayer = -1;
      oSQ.iSquarePlayer = -1;
      oSQ.bGameOver = true;
      closeSquaresOptions();
      $('#divSquareMessage').html('');
      $('#divSquareMessage').removeClass('elShow');
      $('#divSquareMessage').addClass('elHide');
      resetgamecall({gameon:false});
      refreshSquares();
      //create a 10 game object
    //  oSQ.iSquarePlayer = itmp;
    //  console.log(' in reset players oSQ::', oSQ)
    }
    var loop = null;
    var drawGameDetails = function (){
      clearInterval(loop);
        var sHTML = [];
          sHTML = [`<div class=\"gameMessage\">
        YOU HAVE GONE</div>`,
        `<div class=\"gameMessage\">` + oSQ.tenGameOptions.unbeaten + ` GAME` + ((oSQ.tenGameOptions.unbeaten !== 1) ? 'S':'') + ` UNBEATEN</div>`];
        $(".tenGameDetail")[0].innerHTML = sHTML[1];
            loop = setInterval(function() {
            //console.log('sHTML2::',sHTML);
              if ($(".tenGameDetail")[0].innerHTML === sHTML[0]) {
                  $(".tenGameDetail")[0].innerHTML = sHTML[1];
              } else {
                  $(".tenGameDetail")[0].innerHTML = sHTML[0];
              }
          }, 2000);
        $( ".tenGameDetail" ).slideDown("slow",function(){
          $(this).removeAttr('style');
          $(this).removeClass('elHide');
          $(this).addClass('elShow');
        });
      //  $(".tenGameDetail")[0].parentElement.children[0].style.display = 'none';
    }
    function clearGameDetails(){

        $(".tenGameDetail").html('');

        $( ".tenGameDetail" ).slideUp( "slow", function() {
          $(this).removeAttr('style');
          $(this).removeClass('elShow');
          $(this).addClass('elHide');
        });
      $(".tenGameDetail").html('&nbsp;THE UNBEATEN CHALLENGE&nbsp;');
      $(".challangeTimer").html('');
      resetgamecall({gameon:false});
      //  console.log('GameCall::', $(".tenGameDetail")[0].parentElement.children[0]);//.html('CHALLENGE IN PROGRESS')
    };

    var timeinterval = 0;
    var oTimeInterval;
    function startTimer(){
        //console.log('timer entry::', oSQ.tenGameOptions, ' timeinterval::', timeinterval);
      //stopStart 1=start, 0=stop
        var start = Date.now();
        var timeDisplay = oSQ.tenGameOptions.timeTaken;
            oTimeInterval = setInterval(function() {



                timeinterval = Date.now() - start; // milliseconds elapsed since start
                timeDisplay += 10;
                var tmp = timeDisplay.toString();
                var iseconds = tmp.slice(0,tmp.length - 3);//(timeDisplay.length - 3)
                var imseconds = tmp.slice(tmp.length - 3,tmp.length);
              //  console.log('tmp:', tmp, '   iseconds:', iseconds, '  imseconds::', imseconds);
                var clock = document.querySelector('.challangeTimer');
                    clock.innerHTML = `<div class='timerBlock'>playing time::</div><div class='timerBlock2'>${iseconds + ":" + imseconds}</div><div class='timerBlock'> seconds</div>`;
                //    console.log('start timer::', timeDisplay);
                //similar issue with regard to
                //setting a timeoput of 1 hour

                if(iseconds >= oSQ.tenGameOptions.maxOut){
                //  console.log(iseconds,'game over:::::',oSQ.tenGameOptions.maxOut);
                  stopTimer();
                  oSQ.tenGameOptions = returnGamePlayerDefaults();
                  endGameOnTime();
                };
                //3600 seconds in an hour
            }, 10); // update about every second
    };
    function stopTimer(){
        //console.log('in stop timer;;', timeinterval, '  timeTaken B4::', oSQ.tenGameOptions.timeTaken, ' oTimeInterval:', oTimeInterval);
        oSQ.tenGameOptions.timeTaken += timeinterval;
        clearInterval(oTimeInterval);
        timeinterval = 0;
      //  oTimeInterval = null;
        //console.log('timer stopped::', oSQ.tenGameOptions.timeTaken);
  };
  var endGameOnTime = (()=>{
    ons.notification.alert({message:'Game Over <br> You Snooze You Loose!'});
    oSQ = null;
  //  console.log('oFreshSquares::', oFreshSquares);
  $('#refreshSquares').html('Refresh');
  $('#refreshSquares').removeClass('paused');
  $('.leaderCall').html('LEADERBOARD');
    oSQ = new Object(oFreshSquares);
    oSQ.tenGameOptions = returnGamePlayerDefaults();
    oSQ.igamePlayer = -1;
    oSQ.iSquarePlayer = -1;
    oSQ.tenGameChallange = false;
    clearGameDetails();
    clearInterval(oTimeInterval);
    return false;
  });
    var sls = window.localStorage;
    //sls.setItem('winnerName','Sally ramma')
    var addGameBoard = function (event){
      //  console.log('addGameBoard::', event);
        if (event !== null && event.length > 0) {
        showModal(3);
        oWinnerResult.tenGameOptions.winnerName = (event).toString();

        if (typeof(sls) !== "undefined") {
          sls.setItem("winnerName", (event).toString());
        }

      //  console.log('addGameBoard::', oWinnerResult);
      // remember oWinnerResult.tenGameOptions.winnerName and highlight the most recent from that user
          //      var path = 'http://localhost:7555/addLeader/0/'
            var path = 'https://apiapi.monkeywithoutthee.com/addLeader/0/'
          //  console.log('oWinnerResult::',oWinnerResult);
            //return false;
            return window.fetch(path, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'monKey':'Beetroot775beetroot6'
                  },
                  body: JSON.stringify(oWinnerResult)
                })
              .then(response => response.json())
              .then(data => {
                //  console.log('addGameBoard RETURN::', data);
                  //[winnerName,wins,unbeaten,timeTaken]//add date time recorded here here here

                  asheet.showFromTemplate();
                  drawLeaderBoard(data);
                  oSQ.tenGameOptions = returnGamePlayerDefaults();
                //  $(".tenGameDetail")[0].parentElement.children[0].innerHTML = '&nbsp;THE UNBEATEN CHALLANGE&nbsp;';
                  $('.leaderCall').html('LEADERBOARD');
                  $('#refreshSquares').html('Refresh');
                  $('#refreshSquares').removeClass('paused');
                  oSQ = new Object(oFreshSquares);
                  oSQ.tenGameOptions = returnGamePlayerDefaults();
                  oSQ.igamePlayer = -1;
                  oSQ.iSquarePlayer = -1
                  clearGameDetails();
                  closeModal();

                //  refreshSquares();
               })
               .catch(error => {
                //  toastSuccess("There was an error!");
                  closeModal();
                  console.log("error::;", error);
                  ons.notification.alert({message:error});
                  return false;
               })
        } else {
        //  $(".tenGameDetail")[0].parentElement.children[0].innerHTML = '&nbsp;UNBEATEN CHALLANGE&nbsp;';
          $('.leaderCall').html('LEADERBOARD');
          $('#refreshSquares').html('Refresh');
          $('#refreshSquares').removeClass('paused');
          oSQ = new Object(oFreshSquares);
          oSQ.tenGameOptions = returnGamePlayerDefaults();
          oSQ.igamePlayer = -1;
          oSQ.iSquarePlayer = -1
          clearGameDetails();
        //  refreshSquares();
        }
      }

      function drawLeaderBoard(data){
      //  console.log('drawLeaderBoard;;RAW::', data);
        //make a counter from 9 to 0 AND loop
        //CREATE NEW object from wins (10) and sort by time timeTaken
        //draw html
        //loop
        //CREATE NEW object from wins (9 etc) and sort by time timeTaken
        //draw html
        //end
        var aData = [];
        var aOutputData = [];
        var sHTML = '';
        var iLoop = 0;
        var aDataSorted = [];
        //(async () => {
          for (var i = oSQ.unbeatenAmount; i >= 0; i--){
                  //   for (var i = 10; i >= 0; i--){
            //step at a time
            //push data into new array if it doesnt already exist (blocks bu win)
            //sort the block of data by timeTaken
            //add to output array
            //send to draw and draw

            //to highlight the user just posted, we want want the most recent submission from sls.getItem("winnerName")
            var x;
            aData = [];
            var iCount = 0;
            for (x of data){//full set
            iCount += 1;
          //  if (i===oSQ.unbeatenAmount){

              if (x.winnerName===sls.getItem("winnerName")){
                //  console.log(x.winnerName,'<<getting mostrecent::',sls.getItem("winnerName"));
                  x.mostRecent=isMostRecent(data,x.dateadded);
                }else{
                  x.mostRecent=false;
                }
          //  }
              //    console.log('in data loop:', iCount);
            //  console.log('x.wins::', x, '    i;;', i)

              if (x.wins === i) {
                if (!aData.includes(x)) {
                  //  console.log('in push::', iCount);
                    aData.push(x);
                };
              }
            //  console.log('aData::', aData);
              if (iCount === data.length) {//all data in. SOrt
                    aData.sort(function(a, b){
                  //  console.log('a.timeTaken::', a.timeTaken, b.timeTaken);
                    return parseInt(a.timeTaken) - parseInt(b.timeTaken);//sort by number
                 });
                // aData = aData.sort((a,b)=>b[4]-a[4]);
                  //  console.log('aData AFTER sort::', aData);
                  //  console.log('pushing 2 master::', aData)
//                aOutputData = aOutputData.concat(aData);//concat add the contents of the array rather than push thaty adds the array!
                  if (aData.length > 0) {
                    aOutputData.push(aData);//getting problems with the above due to new array re-ordering therefore push
                  }
              }
            //        console.log('aOutputData;;', aOutputData);
            }
            if (i === 0) {//note we in a reverse loop!
                    drawLeaderBoardHTML(aOutputData);
                //    console.log('final call and send  ', iCount);
            }
          }
        //})();

      }
      function drawLeaderBoardHTML(data) {
    //    console.log(data.length,'<<< drawLeaderBoardHTML::', data);
        var y;
        var iLoop = 0;
        var sHTML = '';
        var aData = data;
    //    console.log('aData::', aData);
      //looking for the 1 just sent
        for (var i = 0; i < aData.length; i++) {
          var oRow = aData[i];
          //  console.log('oRow::', oRow);
            for (var j = 0; j < oRow.length; j++) {
              iLoop += 1;
              var sBackground = 'drawLeaderBoardODD';
                if (iLoop % 2 !== 0) {
                  sBackground = 'drawLeaderBoardEVEN';
                }
                var srowClass = 'leaderRows';//mostRecent
                if (oRow[j].mostRecent){
                  srowClass += ' mostRecent';
                }
                var tmp = (oRow[j].timeTaken).toString();
                var iseconds = tmp.slice(0,tmp.length - 3);//(timeDisplay.length - 3)
                var imseconds = tmp.slice(tmp.length - 3,tmp.length);
                sHTML += `<div class='${srowClass} ${sBackground}'>No.${iLoop}::${oRow[j].winnerName}&nbsp;---&nbsp;playing time::${iseconds}:${imseconds} seconds&nbsp;---&nbsp;wins::${oRow[j].wins}&nbsp;---&nbsp;registered:${returnDateStringFromJavaDate(new Date(oRow[j].dateadded))}</div>`;
            };
        };
          $('.action-sheet-title').html('Unbeaten challenge Leaderboard');
          document.querySelector('.actionContent').innerHTML = sHTML;
      }
      var isMostRecent = ((data,date)=>{
        //if there is something more recent then false
        var returnvalue=true;
      //  console.log(data,'::in compare::',sls.getItem("winnerName"))
        for (var i=0;i<data.length;i++){

          if (data[i].winnerName===sls.getItem("winnerName")){
        //  console.log('comparing::',data[i].winnerName,sls.getItem("winnerName"))
            var dtLoop = new Date(data[i].dateadded);
            var dtCompare = new Date(date)
              if (dtLoop > dtCompare){
                returnvalue=false;
                break;
              }
            }
        }
      //  console.log('returning value::',returnvalue);
        return returnvalue;
      });
      function returnGamePlayerDefaults(){
        var o = {gameTypeID: 1, sChallengeTitle: oSQ.unbeatenAmount + ' game unbeaten challenge',player:-1, startTime:null, timeTaken:0, unbeaten:0, won:0, winnerName:'',maxOut:maxOut};
        return o;
      }
      function fetchGameLeaders(){
        showModal(2);
        //  console.log('in fetchGameLeaders;');
        //  var path = 'http://localhost:7555/fetchLeaders/0/';
          var path = 'https://apiapi.monkeywithoutthee.com/fetchLeaders/0/'
            return window.fetch(path, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'monKey':'Beetroot775beetroot6'
            }
          })
        .then(response => response.json())
        .then(data => {
            //console.log('fetch leaders RETURN::', data);
            //[winnerName,wins,unbeaten,timeTaken]
            asheet.showFromTemplate();
            drawLeaderBoard(data);
            closeModal();
         })
         .catch(error => {
          //  toastSuccess("There was an error!");
            closeModal();
            console.log("error::;", error);
            ons.notification.alert({message:error});
            return false;
         })
      }
      function challangeWon(){
        var oOptions = {callback:addGameBoard, buttonLabels:['close', 'send']};
        var swinner = 'you have completed the ' + oSQ.unbeatenAmount + ' game unbeaten challenge!<br>Enter your name and click continue to be added to the board!';
        ons.notification.prompt(swinner, oOptions);
      //  console.log('WINNER oSQ.tenGameOptions::', oSQ);
        oWinnerResult = new Object(oSQ);
        oSQ.tenGameChallange = false;
      //  console.log('WINNER oWinnerResult::', oWinnerResult);
        $('#refreshSquares').html('refresh');
        $('#refreshSquares').removeClass('paused');
      }
      function returnDateStringFromJavaDate(date){
        var dDate = new Date(date);
      //2020-04-28 09:48:20
        var sDay = '0' + dDate.getDate();
        var sMonth = ('0' + (parseInt(dDate.getMonth()) + parseInt(1)));
//        var sDate = sDay.slice(sDay.length - 2, sDay.length) + '-' + sMonth.slice(sMonth.length - 2, sMonth.length) + '-' + dDate.getFullYear()
        var sDate = dDate.getFullYear() + '-' + sMonth.slice(sMonth.length - 2, sMonth.length) + '-' + sDay.slice(sDay.length - 2, sDay.length) + ' ' + dDate.getHours() + ':' + dDate.getMinutes() + ':' + dDate.getMilliseconds()
        if (isNaN(dDate.getDate())) {
          sDate = '';
        }
        return sDate;
      }
    var giveUpChallange = function() {
    //  console.log('in giveUpChallange');
      //div10Game,divGiveUp
        //add a little sHTML
        //on click, rrset and refresh
        $(".squareCardContent").each(function() {
            $(this).removeAttr('style');
            $(this).removeClass('elShow');
            $(this).addClass('elHide');
        });
      var dialog = document.getElementById('squareCard');
      //var oPlayerSwitches = document.getElementById('divGiveUp');
      document.getElementById('div10Game').classList.remove('elShow');
      document.getElementById('div10Game').classList.add('elHide');
      document.getElementById('divGiveUp').classList.remove('elHide');
      document.getElementById('divGiveUp').classList.add('elShow');
      if (dialog) {
        dialog.show();
      }
    };
    var stopChallenge = (()=>{
      $('.leaderCall').html('LEADERBOARD');
      stopTimer();
      $('#refreshSquares').html('Refresh');
      $('#refreshSquares').removeClass('paused');
      oSQ = new Object(oFreshSquares);
    //  console.log('give up press::', oSQ);
      oSQ.tenGameOptions = returnGamePlayerDefaults();
      oSQ.igamePlayer = -1;
      oSQ.iSquarePlayer = -1;
      oSQ.bGameOver = true;
      oSQ.tenGameChallange = false;
      closeSquaresOptions();
      $('#divSquareMessage').html('');
      $('#divSquareMessage').removeClass('elShow');
      $('#divSquareMessage').addClass('elHide');
    //  $('.gameCall').removeClass('gameOnflashbut');
    //  $('.gameCallIns').removeClass('elHide');
    //  $('.gameCallIns').addClass('elShow');
      resetgamecall({gameon:true});

      refreshSquares();
    });
    var aboutSquares = function() {
    //  console.log('about squares');
        //add a little sHTML
        //on click, rrset and refresh

      //var oPlayerSwitches = document.getElementById('divGiveUp');
      var oEl = document.getElementById('divInfo');
      var sHTML = `<div class='infoCard'>${saboutMessage + '<br>' + suserguide}</div>`;
      oEl.innerHTML = sHTML;
      setcardhand({rhand:oPage.usrsettings.rhanded});
      $(oEl).fadeIn('fast',function(){
        $(this).removeAttr('style');
        $(this).removeClass('elHide');
        $(this).addClass('elShow');
      })
      closeModal();
    };

//m00m m m0 0m0m m /m00m m m0 0m0m m /m00m m m0 0m0m m /m00m m m0 0m0m m /m00m m m0 0m0m m
////m00m m m0 0m0m m /m00m m m0 0m0m m /m00m m m0 0m0m m /m00m m m0 0m0m m /m00m m m0 0m0m m


function onNotificationGCM(e) {
  console.log('onNotificationGCM::', e);
    switch(e.event){
        case 'registered':
            if (e.regid.length > 0){
                deviceRegistered(e.regid);
            }
        break;

        case 'message':
            if (e.foreground){
            	// When the app is running foreground.
                alert('The room temperature is set too high')
            }
        break;

        case 'error':
            console.log('Error: ' + e.msg);
        break;

        default:
          //console.log('An unknown event was received');
          break;
    }
};

  const resetgamecall = ((data)=>{
    //data = {gameon:true}
    if (data.gameon){
      $('.gameCall').addClass('gameOnflashbut');
      $('.gameCallIns').removeClass('elShow');
      $('.gameCallIns').addClass('elHide');
      $('.tenGameDetail').removeClass('elHide');
      $('.tenGameDetail').addClass('elShow');
    }else{
      $('.gameCall').removeClass('gameOnflashbut');
      $('.gameCallIns').removeClass('elHide');
      $('.gameCallIns').addClass('elShow');
      $('.tenGameDetail').removeClass('elShow');
      $('.tenGameDetail').addClass('elHide');
      //tenGameDetail
    };
    return true;
  })
