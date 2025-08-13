'use strict';



/*window.addEventListener('devicemotion', () => {
  console.log(`${event.acceleration.x} m/s2 standard::`,event);
});

 window.addEventListener('shake', (event)=>{
   console.log(`shake::`,event);
   oPage.usrsettings.shake && onShake();
 }, false);
*/

window.addEventListener("orientationchange", function(event) {
//  console.log(event,"<<the orientation of the device is now ");
  afterLoadStuff({page:oPage.page});

});

document.addEventListener('DOMContentLoaded', function(event) {
//console.log(ons,oGaffer,'<<in DOMContentLoaded::',oGaffer.local);
  if (oPage&&oPage.islocal){
    innit();
  };

});//ends DOMCOntentLoaded

window.addEventListener('resize',function(event){
//  console.log('_orientationChange::');
  //if !portrait

});


window.addEventListener('touchstart',function(event){
  //console.log('touchSTART::',event.target,event.target.className);
  var evTarget = event.target;
  if(evTarget.className.includes('noPull')){
      var o = document.getElementById('pull-hook-'+oPage.page);
      if(o){o.disabled=true;};
  }
  //  console.log('in touchstart::',evTarget);
  if (evTarget.className.includes('list-item__center')){
    evTarget=evTarget.firstChild;
  };
  if(evTarget.className.includes('mainListsRow')){
    clearRowHighlights('touchOver');
    if(evTarget.className.includes('listBodyRow')){
      evTarget.classList.add('touchOver');
    }else{
      evTarget.parentElement.parentElement.classList.add('touchOver');
    };
    var selClass = getSelectedClass(evTarget);
    const iRow = parseInt(selClass.replace('mainListsRow_',''));
    oPage.lastRowClicked=iRow;
//
    //oPage.startPoint = iRow;//????
    return;
  };
  if (evTarget.className.includes('SquareMessage')){
    evTarget.classList.remove('elShow');
    evTarget.classList.add('elHide');
    return;
  };
  //elHide
});
window.addEventListener('touchend',function(event){
  var o = document.getElementById('pull-hook-'+oPage.page);
  if(o){o.disabled=false;};
  return;
    //  console.log('touchENd::',event.target);
    //  clearRowHighlights('touchOver');
},true);

document.addEventListener('click',function(event){
  event.preventDefault();
  //console.log('in click::', event.target);
  //here here here crete anoher popobver fro heaaders! SIMPLEST!
  var evTar = event.target;





  //user settings
  if (evTar.className.includes('reinlists')){

    //console.log('reinlists::',evTar);
    addiniteiallists(evTar);
    return;
  };
  if(evTar.className.includes('usrsetting')){
    const elp = document.getElementById('usrSet');
    const elc = document.querySelector('.usrsethandswitch');
    const elshake = document.querySelector('.usrsetshakeswitch')
    const setshanded = document.querySelector('.setshanded');
    const setsshakes = document.querySelector('.setsshake');

    if (oPage.usrsettings){
        elc.checked = oPage.usrsettings.rhanded;
        elshake.checked = oPage.usrsettings.shake;
      }else{
        elc.checked = oPage.usrsettings.rhanded;
        elshake.checked = oPage.usrsettings.shake;
    };
    oPage.usrsettings.rhanded ? setshanded.innerHTML = 'right handed' : setshanded.innerHTML = 'left handed';
    oPage.usrsettings.shake ? setsshakes.innerHTML = 'shake on' : setsshakes.innerHTML = 'shake off';
    elp.show(evTar);
    //console.log(elc,elc.checked,elshake,elshake.checked,'<<usrsetting::',getLocal('usrsettings'));
    return;
  };

    //QUOTES PAGE QUOTES PAGE QUOTES PAGE
    if (event.target.className.includes('getrandomquotes')){

      new Promise((resolve,reject)=>{
        resolve(fetchTenQuotes());
        reject(false);
      })
      .then((data)=>{
        //console.log('fetchTenQuotes returns::',data);
        oQuotes.returns = data;
        drawQuotes({highlight:'',row:-1});
      })
      .catch((error)=>{
        console.log('fetchTenQuotes error::',error);
      });
      return;
    };
    if (event.target.className.includes('addFavQuote')){
            addRemoveFavQuote(evTar);
            return;
    };
    if (event.target.className.includes('listOfQuotesRow')){
        var o=document.querySelector('.divListFaveQuotes');
        //o.style.display='none';
        const el = document.querySelector('.searchFavQuotes');
        const row = Array.prototype.indexOf.call(evTar.parentElement.children,evTar);
        o.classList.remove('elShow');
        o.classList.add('elHide');
        console.log(el.value,'<<listOfQuotesRow::',event.target);
        //return false;
        drawinquote({row:row,highlight:el.value,faves:true});
        var dialog=document.getElementById('listFaveQuotes');
        if (dialog) {
          dialog.hide();
        };
    };

    if (evTar.className.includes('quotesbut')){
      //fetches quotes based on the search input
      const el = evTar.parentElement.children[0].children[0];
      oQuotes.lastviewtxt = stripSC(el.value);
      fetchanddrawquote();
//      const o={text:stripSC(el._input.value)};
  /*    new Promise(function(resolve, reject) {
        resolve(gofetchquotes({search:oQuotes.lastviewtxt}));
        reject(false);
      })
      .then((data)=>{
        oQuotes.returns = data;
        drawQuotes({highlight:oQuotes.lastviewtxt,row:0});
      })
      .then(()=>{
        if (oQuotes.returns.length>0){
          drawinquote({row:0,highlight:oQuotes.lastviewtxt,faves:false});
        };
      })*/
      return;
    };
    if (evTar.className.includes('quotessearchList')){
      const el = (()=>{
        if (evTar.className.includes('quotessearchListChild')){return evTar.parentElement;}else{return evTar;};
      })();
      const parent = (()=>{
        var x = el;
        do {
          var i = false
          if (x.className.includes('quotesRS')){i = true}else{x = x.parentElement}
        } while (!i);
        return x;
      })();
      const a = document.querySelectorAll('.quotessearchList')
      //quotessearchList noPull touchOver
      clearQuoteHighlights('quotessearchList');
      const iRow = Array.prototype.indexOf.call(parent.children,el);
      parent.children[iRow].classList.add('touchOver');
      const searchthis = (()=>{
        const o = document.querySelector('.searchQuoteTxt');
          return o.children[0].value ? o.children[0].value : '';
      });
      drawinquote({row:iRow,highlight:searchthis(),faves:false});
    //  console.log(searchthis(),el,parent,iRow,'<<<quotessearchList::',evTar);
    return;
    };

    //ENDS QUOTES PAGE QUOTES PAGE QUOTES PAGE

    if (evTar.className.includes('clearInputText')){
      evTar.previousElementSibling.value = '';
      if (oPage.page==='morse'){
        addEvent();
      };
      //console.log(oPage.page,'<<clearInputText::',evTar)
        return;
    };

    if (evTar.className.includes('loopLink')){
      if (m.inloop){
        m.inloop = false;
        event.target.style.backgroundColor = 'unset';
        event.target.style.color = 'uset';
      }else{
        m.inloop = true;
        event.target.style.backgroundColor = 'rgba(33,33,33,0.9)';
        event.target.style.color = '#fafafa';
        //m.play();
      }
      //console.log('loopLink::',evTar);
      return;
    };

    if(evTar.className.includes('copyTo')){
      const el = evTar.className.includes('copyToChild') ? evTar.parentElement : evTar;
      //if (el.className.includes('copyToChild')){el=evTar.parentElement;};
      if (!oPage.islocal){
        if (device.platform.toLowerCase()==='ios') {
          window.plugins.socialsharing.share(el.innerText.replace('favorite_border','').replace('favorite',''))
          }else{
          navigator.share(el.innerText.replace('favorite_border','').replace('favorite',''));//i know - sloppy!
        };
      console.log(el,'copyTo::',el.innerText,cordova);
      };
      return;
    };

    if (evTar.className.includes('newButt')){
    //  console.log('in newButt::',evTar);
      addItem();
      return;
    };
//
    if (evTar.className.includes('checkIconClicked')){
        //event.stopPropagation();
        var selClass = getSelectedClass(evTar.parentElement.parentElement.parentElement.parentElement);
        const row = parseInt(selClass.replace('mainListsRow_',''));
      //  console.log(row,selClass,'<<in checkIconClicked::',evTar);
        gotListing(event,row);
    };
    if (evTar.className.includes('setVisibIconClicked')){
        //event.stopPropagation();
        var selClass = getSelectedClass(evTar.parentElement.parentElement.parentElement.parentElement);
        const row = parseInt(selClass.replace('mainListsRow_',''));
      //  console.log(row,selClass,'<<in setVisibIconClicked::',evTar);
        hideListing(row);

    };
    if(evTar.className.includes('mainListsRow_')){
    //  var selClass = getSelectedClass(evTar.offsetParent);
      //const row = parseInt(selClass.replace('mainListsRow_',''));
      //console.log(row,selClass,'<<in mainListsRow_::',evTar,evTar.parentElement.parentElement.lastElementChild);
      var o = evTar.parentElement.parentElement.lastElementChild;
    //  if(o.style.display==='block'){
      if (o.classList.contains('elShow')){
        $(o).slideUp('fast',function(){
          $(this).removeAttr('style');
          $(this).removeClass('elShow');
          $(this).addClass('elHide');
        });
      }else{
        $(o).slideDown('fast',function(){
          $(this).removeAttr('style');
          $(this).removeClass('elHide');
          $(this).addClass('elShow');
        });
      };

    };
    if (evTar.className.includes('newJokeAS')){
        //console.log('in newJokeAS::',evTar);
        newJokeAS();
    };
    if (evTar.className.includes('fetchJoke')){
        //console.log('in fetchJoke::',evTar);
        fetchJoke();
    };
    if (evTar.className.includes('sendNewJoke')){
        //console.log('in sendNewJoke::',evTar);
        sendNewJoke();
    };
    if (evTar.className.includes('getJokeFrom')){
      //  console.log('in getJokeFrom::',evTar);
        getJokeFrom();
    };
    if(evTar.className.includes('changeSQOption')){
      var selClass = returnSelectedClass({classes:evTar.classList,ellist:'changeSQOption'});

        //data{classes:evTar.classList,ellist:'mainListsRow_'}
      const row = parseInt(selClass.replace('changeSQOption_',''));
            //  console.log(selClass,evTar,'<<row::',row,evTar.classList);
        if(row===1){
          changeSQOption(evTar, 1);
        }else{
          changeSQOption(evTar, 0);
        }
      };


    if(event.target.className.includes('canedit_')){
      var el = document.getElementById('popover');
          oPage.pop.direction = 'down';
          el.setAttribute('direction',oPage.pop.direction);
          const iRow = oPage.activeListRow;
          document.querySelector('.popoverDiv').innerHTML=returnPopoverHeader({row:iRow});
          var thisTarget = event.target.getClientRects();
          el.show(event.target,{left:50,right:50})
          .then((data)=>{
            oPage.popRect = el.childNodes[3].getClientRects()[0];
            oPage.pop.direction = el.getAttribute('direction');
            //console.log(oPage.screen.height,'<<showed::',el.childNodes[3].getClientRects()[0]);
          })
          //  textAreaStretch();
        return;
      };


  if(event.target.className.includes('showHideClass')){
      var el=event.target;
    //  console.log('in showMoreClass::',event.target,el.classList[1]);

      if (el.classList[1]==='showMoreParent'){el=el.parentElement.parentElement;};
      if (el.classList[1]==='showMoreBut'){
    //  el.style.display='none';
      $(el).fadeOut('slow',function(){
        $(this).removeAttr('style');
        $(this).removeClass('elShow');
        $(this).addClass('elHide');
      });
      el=el.parentElement;
    //  console.log('showMoreBut::',el);
      };
      if (el.classList[1]==='showMoreClass'){
      $(el).animate({height:el.scrollHeight+'px'});
    //  console.log('computed:',el);
        el.classList.remove('showMoreClass');
        el.classList.add('showLessClass');
        $(el.lastElementChild).fadeOut('slow',function(){
          $(this).removeAttr('style');
          $(this).removeClass('elShow');
          $(this).addClass('elHide');
        });
      }else if (el.classList[1]==='showLessClass'){
        el.classList.remove('showLessClass');
        el.classList.add('showMoreClass');
        $(el).animate({height:'25px'})
        $(el.lastElementChild).fadeIn('slow',function(){
          $(this).removeAttr("style");
          $(this).removeClass('elHide');
          $(this).addClass('elShow');
        });
      };
      return false;
  };

  if (event.target.className.includes('exLink')){
    //should work for all links. just add class 'exLink'
    window.location = event.target.href;
  };

  if (event.target.className.includes('addFavJoke')){
          addRemoveFavJoke();
          return;
  };


  if (oPage.page==='square') {

    if (event.target.className.includes('gameCall')) {
    //  console.log('in GameCall::',event);
    //  if ((event.target.innerText).replace(/\s/g,'') === 'THEUNBEATENCHALLENGE') {
        draw10GameOptions();
    //  };
    };

  if (event.target.id === 'divSquareMessage') {
    $('#divSquareMessage').addClass('elHide');
    return;
  };
  if (event.target.className.includes('leaderCall')) {
    if (event.target.innerText === 'LEADERBOARD'){
        fetchGameLeaders();
        return;
    };
    if (event.target.innerText === 'GIVE UP'){
        giveUpChallange();
        return;
    };
  };
  if (event.target.parentElement.id === 'div10Game') {
      startGameChallange();
      return;
  };
  if (event.target.parentElement.id === 'divGiveUp') {
  //  $(this)[0].children[0].innerText = 'LEADERBOARD';
        stopChallenge();
        return;
    };

    if (event.target.parentElement.id === 'divPlayerUpdate') {
        resetPlayers();
        return;
    };
    if (event.target.className.includes('sclassOpt')) {
        drawSquaresOptions();
        return;
    };
    if (event.target.className.includes('classOptOut')) {
        closeSquaresOptions();
        return;
    };
    if (event.target.className.includes('refreshSquares')){
      //console.log(event.target,'<<refreshSquares click::',oSQ.tenGameChallange,oSQ.tenGameOptions,timeinterval,oTimeInterval);
      if (oSQ.tenGameChallange&&!event.target.className.includes('paused')){
        var oOptions = {buttonLabels:['continue', 'quit']};
        const sMessage = `You cannot start a new game whilst you are in Squares competition mode.<br><br> Don't forget, you are playing against the clock!`;
        ons.notification.confirm(sMessage, oOptions).then((data)=>{
          console.log('ZZZZZZ::',data);
          if (data){stopChallenge();};
        });
        return false;
          }else{
          refreshSquares();
        };
        return;
    };
    if (event.target.className.includes('replayBack')){
      //get current value, add or minus draw
      //the value being displayed
      oSQ.inReplay=true;
    /*  if (asquares){//oSQ.replayView on refresh, endstops on arrows
        oSQ.replayView=oSQ.asquares.length-1;
      }*/
    //  var is=parseInt(document.querySelector('.matchReplayX').innerHTML)-1;
      oSQ.replayView=oSQ.replayView-1;
      if(oSQ.replayView<-1){oSQ.replayView=-1;};
      if(oSQ.replayView>=oSQ.asquares.length){oSQ.replayView=oSQ.asquares.length-1;};
      //console.log('is back::',oSQ.replayView);
      if (oSQ.replayView<=-1){
          document.querySelector('.replayBack').style.color='grey';
          document.querySelector('.replayBack').disabled=true;
        }else{
          document.querySelector('.replayBack').style.color='';
          document.querySelector('.replayBack').disabled=false;
      }
          document.querySelector('.replayForw').style.color='';
          document.querySelector('.replayForw').disabled=false;
          drawBoard(oSQ.replayView);
          return;
    };
    if (event.target.className.includes('replayForw')){
      //get current value, add or minus draw
      //the value being displayed
    //  console.log('is forward::',oSQ.replayView);
      oSQ.inReplay=true;
      if (oSQ.replayView<=oSQ.asquares.length-1){
          document.querySelector('.replayForw').style.color='';
          document.querySelector('.replayForw').disabled=false;
          oSQ.replayView=oSQ.replayView*1+1;
          if(oSQ.replayView>=9){oSQ.replayView=9;};
          document.querySelector('.replayBack').style.color='';
          document.querySelector('.replayBack').disabled=false;
          drawBoard(oSQ.replayView);
      };
      if (oSQ.replayView>=oSQ.asquares.length-1){
          document.querySelector('.replayForw').style.color='grey';
          document.querySelector('.replayForw').disabled=true;
      };
      return;
    };

  };//ends squares calls
    if(event.target.className.includes('homeHeader')){
      if (oPage.homeView>0){
      //console.log('homeHeader::',oPage.homeView,oPage.aPages[oPage.homeView].page,oPage.aPages[oPage.homeView].title);
      showModal(5);
      document.querySelector('#myNavigator').bringPageTop(oPage.aPages[oPage.homeView].usesPage)
      .then(()=>{
        oPage.pageTitle=oPage.aPages[oPage.homeView].title;
        oPage.page=oPage.aPages[oPage.homeView].page;
        addpagetitle({title:oPage.pageTitle});
        afterLoadStuff({page:oPage.page});
        showhidetoolbars();
          if(oPage.page==='jokes'){
            getPullerReady({page:oPage.page});
            const d = getLocal('lastJoke');
          //  console.log('pressed ,last joke::',d);
            if (d){drawJoke({joke:d,highlight:''});}else{fetchJoke();};
          };
          if(oPage.page==='info'){
            checknopull();
            aboutSquares();
          };

          if(oPage.page==='square'){
            if(getLocal('soSQ')){
              oSQ=getLocal('soSQ');
            };
            getPullerReady({page:oPage.page});
            drawSquares();
            closeModal();
            $('#divSquares').slideDown('slow',function(){
              $(this).removeAttr("style");
              $(this).removeClass('elHide');
              $(this).addClass('elShow');
            });
            //console.log(screen,'<<oSQ.tenGameOptions::',oSQ.tenGameOptions);
            loadOnClick();
            drawBoard(9);
            if(!oSQ.bfirstMove){document.querySelector('.replayBack').disabled=false;};
            colourPlayerConts(oSQ.iSquarePlayer);
          };

          if(oPage.page==='lists'){
            getPopoverReady({page:oPage.page});
            getPullerReady({page:oPage.page});
            doDBStuff();
          //data={listID:'lists_1',startNo:0}
            drawMainList({search:''});
            document.querySelector('.mainList').style.maxHeight=oPage.screen.height-250+'px';
          };

          if(oPage.page==='morse'){
          //data={listID:'lists_1',startNo:0}
            getPullerReady({page:oPage.page});
            morse();
          };
        });
      };
      return;
    };
    if (event.target.className.includes('hpIcon')){
      const s=event.target.className.split(' ');
    //  console.log(s,'<<menuList::',s[0]);
      showModal(5);
      var el = document.querySelector('.homeHeader');
      const a=oPage.aPages;
    //  console.log('pages::',a);
      for (var i=0;i<a.length;i++){
      //  console.log(s[0].replace('m',''),'<<comparing::',a[i].page);
        if (s[0].replace('m','')===a[i].page){
          el.innerHTML=a[i].about;
          var o = document.querySelectorAll('.homeButtsHighlight');
          o.forEach((item, i) => {item.classList.remove('homeButtsHighlight');});
          event.target.classList.add('homeButtsHighlight');
          oPage.homeView=i;
          break;
        }
      };


      if (s[0]==='mhome'){
      document.querySelector('#myNavigator').bringPageTop('home.html')
      .then(()=>{
        oPage.pageTitle='Monkys Compendium';
        oPage.page='home';
        showhidetoolbars();
        //resetCards({top:oPage.topAdjuster,islandscape:ons.orientation.isLandscape()});
        afterLoadStuff({page:oPage.page});
        getPullerReady({page:oPage.page});
        addpagetitle({title:oPage.pageTitle});
        setHomePage();
        //here here here - remove bottom-border on
        //this is it one any page change, resize cards and check bottom-toolbar
      //  console.log('on home page::',oPage.page,oPage.pageTitle);
        oPage.usrsettings.rhanded ? setcardhand({rhand:true}) : setcardhand({rhand:false});
        closeModal();
      });
    };
      if (s[0]==='mjokes'){document.querySelector('#myNavigator').bringPageTop('jokes.html')
      .then(()=>{
        oPage.pageTitle='Jokes';
        oPage.page='jokes';
        addpagetitle({title:oPage.pageTitle});
        getPullerReady({page:oPage.page});
        //resetCards({top:oPage.topAdjuster,islandscape:ons.orientation.isLandscape()});
        afterLoadStuff({page:oPage.page});
        showhidetoolbars();
        const d = getLocal('lastJoke');
        //console.log(screen,'<<pressed ,last joke::',d);
        oPage.usrsettings.rhanded ? setcardhand({rhand:true}) : setcardhand({rhand:false});
        if (d){drawJoke({joke:d,highlight:''});}else{fetchJoke();};
      });
    };
      if (s[0]==='minfo'){document.querySelector('#myNavigator').bringPageTop('info.html')
      .then(()=>{
        oPage.page='info';
        oPage.pageTitle='About Info';
        addpagetitle({title:oPage.page});
        //resetCards({top:oPage.topAdjuster,islandscape:ons.orientation.isLandscape()});
        afterLoadStuff({page:oPage.page});
        showhidetoolbars();
        oPage.usrsettings.rhanded ? setcardhand({rhand:true}) : setcardhand({rhand:false});
        checknopull();
        aboutSquares();
      });
    };
      if (s[0]==='mlists'){
          document.querySelector('#myNavigator').bringPageTop('lists.html')
          .then(()=>{
              oPage.page='lists'
              oPage.pageTitle='Lists';
              addpagetitle({title:oPage.pageTitle});
              //resetCards({top:oPage.topAdjuster,islandscape:ons.orientation.isLandscape()});
              oPage.usrsettings.rhanded ? setcardhand({rhand:true}) : setcardhand({rhand:false});
              afterLoadStuff({page:oPage.page});
              showhidetoolbars();
              getPopoverReady({page:oPage.page});
              getPullerReady({page:oPage.page});
              doDBStuff();
            //data={listID:'lists_1',startNo:0}
              drawMainList({search:''});
              document.querySelector('.mainList').style.maxHeight=oPage.screen.height-250+'px';
          });
      };
      if (s[0]==='msquare'){
        //.replacePage(oPage.swipePages[i],{data:{title:oPage.swipePages[i].replace('.html','')+' page'}})
          document.querySelector('#myNavigator').bringPageTop('square.html')
          .then(()=>{
              if(getLocal('soSQ')){
                oSQ=getLocal('soSQ');
              };

            oPage.page='square';
            oPage.pageTitle='Games';
            afterLoadStuff({page:oPage.page});
          //  resetCards({top:oPage.topAdjuster,islandscape:ons.orientation.isLandscape()});
            showhidetoolbars();
            oPage.usrsettings.rhanded ? setcardhand({rhand:true}) : setcardhand({rhand:false});
            addpagetitle({title:oPage.pageTitle});
            getPullerReady({page:oPage.page});
        //    squareControllers();
            drawSquares();
            $('#divSquares').slideDown('slow',function(){
              $(this).removeAttr('style');
              $(this).removeClass('elHide');
              $(this).addClass('elShow');
              closeModal();
            });
            loadOnClick();
            if(!oSQ.bfirstMove){document.querySelector('.replayBack').disabled=false;};
          //  console.log('hpicon colourPlayerConts',oSQ.iSquarePlayer,oSQ);
            colourPlayerConts(oSQ.iSquarePlayer);
            drawBoard(9);
          })
      };
      if (s[0]==='mmorse'){
        //.replacePage(oPage.swipePages[i],{data:{title:oPage.swipePages[i].replace('.html','')+' page'}})
          document.querySelector('#myNavigator').bringPageTop('morse.html')
          .then(()=>{
            oPage.page='morse';
            oPage.pageTitle='Morse';
          //  resetCards({top:oPage.topAdjuster,islandscape:ons.orientation.isLandscape()});
            afterLoadStuff({page:oPage.page});
            oPage.usrsettings.rhanded ? setcardhand({rhand:true}) : setcardhand({rhand:false});
            showhidetoolbars();
            addpagetitle({title:oPage.pageTitle});
            getPullerReady({page:oPage.page});

            $('#divMorse').slideDown('slow',function(){
              $(this).removeAttr('style');
              $(this).removeClass('elHide');
              $(this).addClass('elShow');
              closeModal();
            });
            morse();
          })
      };
      if (s[0]==='mquotes'){
        //.replacePage(oPage.swipePages[i],{data:{title:oPage.swipePages[i].replace('.html','')+' page'}})
          document.querySelector('#myNavigator').bringPageTop('quotes.html')
          .then(()=>{
            oPage.page='quotes';
            oPage.pageTitle='Quotes';
          //  resetCards({top:oPage.topAdjuster,islandscape:ons.orientation.isLandscape()});
            oPage.usrsettings.rhanded ? setcardhand({rhand:true}) : setcardhand({rhand:false});
            afterLoadStuff({page:oPage.page});
            showhidetoolbars();
            addpagetitle({title:oPage.pageTitle});
            getPullerReady({page:oPage.page});
            $('#divQuotes').slideDown('slow',function(){
              $(this).removeAttr('style');
              $(this).removeClass('elHide');
              $(this).addClass('elShow');
              closeModal();
            });
            quotes();
          })
      };
      return;
    };
    if (event.target.className.includes('goHome')){
      showModal();
      document.querySelector('#myNavigator').bringPageTop('home.html')
      .then(()=>{
        oPage.pageTitle='Monkys Compendium';
        oPage.page='home';
        resetCards({top:oPage.topAdjuster,islandscape:ons.orientation.isLandscape()});
      /*  $('.bottom-bar').fadeOut('slow',function(){
        //  $(this).removeAttr('style');
          $(this).removeClass('elShow');
          $(this).addClass('elHide');
        });*/
        oPage.usrsettings.rhanded ? setcardhand({rhand:true}) : setcardhand({rhand:false});
        afterLoadStuff({page:oPage.page});
        getPullerReady({page:oPage.page});
        setHomePage();
        addpagetitle({title:oPage.pageTitle});
      //  console.log('on home page::',oPage.page,oPage.pageTitle);
      //  if (window.m){window.m.stop();};
        if (window.m){try{window.m.stop();}catch{//console.log('cannot stop m!!');
        };};
      });
    };


    if (event.target.className.includes('showNew')){
    //  console.log('showNew::',event.target);
      showNew();
      return;
    };
    if (event.target.className.includes('listLists')){
      //console.log('listLists::',event.target);
      listLists();
      return;
    };
    if (event.target.className.includes('listButton')){
      addnewliststuff();
    return;
    };


    if (event.target.className.includes('listOfListsRow')){
    //  console.log('getting in listOfListsRow click::',event)
       var o=document.querySelector('.listOfLists');
      // o.style.display='none';

        o.classList.remove('elShow');
        o.classList.add('elHide');

        var el=event.target;
        var iRow = Array.prototype.indexOf.call(o.children,el);
        oPage.activeListRow=iRow;
        oPage.startPoint=0;
        oPage.lastRowClicked=-1;
        oPage.showHiLi = false;
        document.querySelector('.showHiLi').innerHTML='check';
        setLocal('activeList',iRow);
      //  console.log(iRow,'<< listOfListsRow cliucked::',event.target,o);
        getPullerReady({page:oPage.page});
        doDBStuff();
        //data={listID:'lists_1',startNo:0}
        drawMainList({search:''});
        const dialog=document.getElementById('listLists')
        if (dialog) {
          dialog.hide();
        };
    };
    if (event.target.className.includes('listOfJokesRow')){
        var o=document.querySelector('.divListFaveJokes');
        //o.style.display='none';
        o.classList.remove('elShow');
        o.classList.add('elHide');
        var el=event.target;
        var iRow = parseInt(event.target.className.replace('listOfJokesRow row_','').replace(' button',''));
        drawJoke({joke:oPage.faveJokes[iRow],highlight:''});//{joke:data[0],highlight:''}
        var dialog=document.getElementById('listFaveJokes');
        if (dialog) {
          dialog.hide();
        }
    };

    if (event.target.className.includes('listOfListsDel')){
      const iRow = event.target.className.replace('material-icons deleterow_','').replace(' listOfListsRowDel','');
      const del = oPage.aLists[parseInt(iRow)];
      ons.notification.confirm('are you sure you want to delete list '+ del.name).then((data)=>{
        //console.log('listOfListsDel::',data);
        if (data){
          var o=document.querySelector('.listOfLists');
          var aa=[];
          oPage.aLists.forEach((item, i) => {
            if(i!==parseInt(iRow)){aa.push(item)}
          });
          oPage.aLists=aa;
          setLocal('lists',aa);
          ons.notification.toast(`${del.name} has been deleted from lists`,oPage.toastOptions);
        //  console.log(iRow,'<< deleting list ::',oPage.aLists);
          var el = document.getElementById('popover');
          el.hide();
          oPage.activeListRow=0;
          oPage.startPoint=0;
          drawMainList({search:''});
          listLists();
        };
      });
    };


    if (event.target.className.includes('deleteMainrow_')){
      const iRow = parseInt(event.target.className.replace('material-icons deleteMainrow_',''));
      const del = oPage.aLists[oPage.activeListRow].listData[iRow];
      ons.notification.confirm('are you sure you want to delete item '+del.item).then((data)=>{
      //  console.log(iRow,'<<then conf::',data);
        if (data){
          var aa=[];
          oPage.aLists[oPage.activeListRow].listData.forEach((item, i) => {
            if(i!==iRow){aa.push(item)}
          });
          oPage.aLists[oPage.activeListRow].listData=aa;
        //  console.log(iRow,'<< deleting list ::',oPage.aLists[oPage.activeListRow]);
          var el = document.getElementById('popover');
          setLocal('lists',oPage.aLists);
          ons.notification.toast(`${del.item} has been deleted from ${oPage.aLists[oPage.activeListRow].name}`,oPage.toastOptions);
          el.hide();
          drawMainList({search:''});
        };
      });
    };


    if (event.target.className.includes('pageClick_')){
        var newSP = event.target.className.split(' ');
        newSP=parseInt(newSP[0].replace('pageClick_',''));
        //console.log(newSP,'<<newStartPoint');
        oPage.startPoint=parseInt(newSP);
        drawMainList({search:''});
        clearRowHighlights();//note wont be needed when page chengeds!!
    };
    if (event.target.className.includes('showAll')){
      //console.log('showAll::',event.target);
      showHideAll();
    };
    if (event.target.className.includes('listSettings')){
      //console.log('listSettings::',event.target);
      var el = document.getElementById('popover');
      el.setAttribute('direction','down');
      oPage.pop.direction = 'down';
      el.show(event.target,{left:50,right:50});
      document.querySelector('.popoverDiv').innerHTML=returnSettingPopover();
    };
    if (event.target.className.includes('showSearchFilter')){
      //console.log('showSearchFilter::',event.target.getClientRects());
    var el = document.getElementById('popover');
    var thisTarget = event.target.getClientRects();
    oPage.pop.direction = 'down';
    el.setAttribute('direction',oPage.pop.direction);
  //  setPopoverToPa({top:thisTarget[0].top *1 + 25,bottom:oPage.screen.height - thisTarget[0].bottom,left:thisTarget[0].left});

    if(oPage.lastRowClicked!==-1&&oPage.blockSelected!==oPage.blockAmounts[oPage.blockAmounts.length-1]){
      oPage.startPoint=Math.floor(oPage.lastRowClicked/oPage.blockAmounts[oPage.blockSelected]);
    }else{
      oPage.startPoint=0;
    };
    if(isNaN(oPage.startPoint)){oPage.startPoint=0;};
    //console.log(oPage.startPoint,oPage.blockSelected,'<<showSearchFilter::',oPage.lastRowClicked,oPage.blockAmounts[oPage.blockSelected]);
      drawMainList({search:''});
      document.querySelector('.popoverDiv').innerHTML=returnSearchPopover();
      el.show(event.target,{left:50,right:50})
      .then((data)=>{
        oPage.popRect = el.childNodes[3].getClientRects()[0];
        oPage.pop.direction = el.getAttribute('direction');
        //oPage.screen.height
        //console.log(oPage.screen.height,'<<showed::',el.childNodes[3].getClientRects()[0]);
      })
      return;
    };

    if (event.target.className.includes('showHiLi')){
    //  console.log('showHiLi::',event.target);
      oPage.startPoint=0;
      if(oPage.showHiLi){
        event.target.innerHTML='check';
        oPage.showHiLi=false;
      }else{
        event.target.innerHTML='check_circle';
        oPage.showHiLi=true;
      }
      drawMainList({search:''});
    };
    if (event.target.className.includes('setPageAmount')){
      //console.log('listSettings::',event.target);
      var i=parseInt(event.target.innerText);
      var o = document.querySelectorAll('.setPageAmount');
      var x = Array.prototype.indexOf.call(o, event.target);
      oPage.blockSelected=x;
      //console.log(o,'<<TEMP::',x);

      oPage.startPoint=0;
      if(isNaN(i)){
        if(oPage.showAll){//viewAll
          oPage.maxBlock2Dispay=oPage.aLists[oPage.activeListRow].listData.length;
        }else{
          oPage.maxBlock2Dispay=oPage.aLists[oPage.activeListRow].listData.length-returnhiddenCount(oPage.aLists[oPage.activeListRow].listData);
        }
          i=oPage.maxBlock2Dispay;
        oPage.viewAll=true;
    //  console.log(i,'in isNan::',oPage.maxBlock2Dispay);
      }else{
        oPage.viewAll=false;
        oPage.maxBlock2Dispay=i;
      }

  //    return false;
      setLocal('settings',{maxBlock2Dispay:i,blockSelected:x});
      var el = document.getElementById('popover');
      el.hide(event.target);
      drawMainList({search:''});
    };
    if(event.target.className.includes('demoListBut')){
    //  console.log('demoListBut::',event.target);

      doaddemolist(evTar);
    };

    if(event.target.className.includes('upListofLists_')){
      if (!oPage.islocal&&device.platform.toLowerCase()==='android'){
        if (Keyboard.isVisible) {blurInputs();return false;};
      };

      var iRow = parseInt(event.target.className.replace('material-icons upListofLists_',''));
      //heres the plan, this up and down motion will have an effect on oPage.activeListRow
      //therefore we need to replace its have with the new row
      if(iRow>0){
        var o = oPage.aLists;
        var a = [];
        for (var i=0;i<o.length;i++){
          if (i*1+1<iRow){
            a.push(o[i]);
          };
          if (i*1+1===iRow){
            if (o[i*1+1]){a.push(o[i*1+1]);};
            a.push(o[i]);
          };
          if (i>iRow){
            a.push(o[i]);
          };
        };

        oPage.aLists=a;
        oPage.highlightListRow=iRow-1;
        oPage.lastRowClicked=oPage.highlightListRow;
        setLocal('lists',oPage.aLists);
        //console.log(iRow,'<<compare UP::',oPage.activeListRow*1+1,iRow===oPage.activeListRow*1+1,iRow===oPage.activeListRow);
        //oPage.activeListRow changes when reached (above current)
        if(iRow===oPage.activeListRow){
           //console.log('in UP THIS::',oPage.activeListRow);
          oPage.activeListRow-=1}
        else if(iRow===oPage.activeListRow*1+1){
          //console.log('in UP Ahead::',oPage.activeListRow);
          oPage.activeListRow+=1
        };
        if(iRow<=0){iRow=0;}else{iRow=iRow-1;};
        oPage.activeListListRow=iRow;
        drawLists();
        document.querySelector('.popoverDiv').firstChild.innerHTML=returnPopoverButtons({row:iRow});
        setLocal('activeList',oPage.activeListRow);
      //  textAreaStretch();
      };

    //  console.log(iRow,oPage.aLists,'<<upListofLists_::',oPage.activeListListRow,oPage.activeListRow);
    };
    if(event.target.className.includes('downListofLists_')){
      if (!oPage.islocal&&device.platform.toLowerCase()==='android'){
        if (Keyboard.isVisible) {blurInputs();return false;};
      };
      var iRow = parseInt(event.target.className.replace('material-icons downListofLists_',''));
      if (iRow<oPage.aLists.length-1){
        var o = oPage.aLists;
        var a = [];
        //var omoving={};
        for (var i=0;i<o.length;i++){
          if (i<iRow){
            a.push(o[i]);
          }
          if (i===iRow){
            if (o[i*1+1]){a.push(o[i*1+1])};
            a.push(o[i]);
          }
          if (i>iRow*1+1){
            a.push(o[i]);
          }
        }
        oPage.aLists=a;
        oPage.highlightListRow=iRow*1+1;
        oPage.lastRowClicked=oPage.highlightListRow;
        //console.log(iRow,'<<compare DOWN::',oPage.activeListRow-1,iRow===oPage.activeListRow-1,iRow===oPage.activeListRow);
        //oPage.activeListRow changes when reached (drops below current)
      //  if(iRow===oPage.activeListRow-1||iRow===oPage.activeListRow){oPage.activeListRow-=1;};

        if(iRow===oPage.activeListRow){
           //console.log('in DOWN THIS::',oPage.activeListRow);
          oPage.activeListRow+=1}
        else if(iRow===oPage.activeListRow-1){
          //console.log('in DOWN behind::',oPage.activeListRow);
          oPage.activeListRow-=1
        };

        if(iRow>=oPage.aLists.length){iRow=oPage.aLists.length-1;}else{iRow=iRow*1+1;};
        oPage.activeListListRow=iRow;
        //if >= length then disable button;
        setLocal('lists',oPage.aLists);
        drawLists();
      //  document.querySelector('.popoverDiv').innerHTML=returnPopoverText({row:oPage.activeListRow});
        document.querySelector('.popoverDiv').firstChild.innerHTML=returnPopoverButtons({row:iRow});
        setLocal('activeList',oPage.activeListRow);
        //textAreaStretch();
      };
      //console.log(iRow,oPage.aLists,'<<downListofLists_',oPage.activeListListRow,oPage.activeListRow);
    };

    var pushTillNext=((data)=>{
    //  console.log('pushTill hidden loop::',data);
      var tAdd=0;
      for(var j=data.start;j<data.data.length;j++){
        if (data.data[j].hidden){
        //  console.log(j,i,'::pushing in hidden loop::',data.data[j]);
          a.push(data.data[j]);
          tAdd+=1;
        }else{
          //console.log(j,'::BREAK hidden loop::',data[j]);
          a.push(data.data[j]);
          tAdd+=1;
          break;
        };
      };
      return tAdd;
    });

    var upTillNext=((data)=>{
    //  console.log('upTillNext hidden loop::',data);
      var tAdd=0;
      for(var j=data.start;j>=0;j--){
        if (data.data[j].hidden){
          oPage.tmpArr.unshift(data.data[j]);
          tAdd+=1;
          if(j===0){return tAdd;}
        }else{
          oPage.tmpArr.unshift(data.data[j]);
          tAdd+=1;
          return tAdd;
        };
      };

    });

    if(event.target.className.includes('upMainLists_')){
      //if(!oPage.showAll){showHideAll();};
    //  blurInputs();
      const iRow = parseInt(event.target.className.replace('material-icons upMainLists_',''));
      //console.log(iRow,oPage.aLists,'<<upMainLists_',event.target,iRow);
      if (!oPage.islocal&&device.platform.toLowerCase()==='android'){
        if (Keyboard.isVisible) {blurInputs();return false;};
      };
      if(iRow>0){
        const o = oPage.aLists[oPage.activeListRow].listData;
        const d = Array.from(o);

        //var omoving={};
        //heres the plan
        //reverse loop o;
        //iRow = o.length-1-iRow
        //unshift all < row
        var toAdd=0;
        var newRow=0;
        var a = [];
        oPage.tmpArr=[];
        //var revRow = o.length-1-iRow;
      //  (async ()=>{
        for (var i=o.length-1;i>=0;i--){
            if (i>iRow){
              oPage.tmpArr.unshift(o[i]);//all records below iRow
            };
            if (i===iRow){
              //console.log(o[i-1],'<<in this row::',i,iRow);
              if (o[i-1]){
                  if(o[i-1].hidden&&!oPage.showAll){//if hidden, add it and any others until hidden=false;
                    //toAdd=0;//resets
                    toAdd=upTillNext({start:i-1,data:d});//pushes all hidden till not hidden
                    //console.log(i-1,'<<upMainLists_ hidden loop::',toAdd);
                  }else{
              //      console.log('unshifting else::',o[i-1]);
                    oPage.tmpArr.unshift(o[i-1]);
                    toAdd=1;//resets
                  };
              };
              oPage.tmpArr.unshift(o[i]);//pushes itself
            };
            newRow=iRow-toAdd;
            if (i<newRow){
              oPage.tmpArr.unshift(o[i]);//all records over iRow
            };
        };
        setLocal('lists',oPage.aLists);
        //console.log('UP oPage.highlightListRow::',oPage.highlightListRow,' oPage.startPoint::',oPage.startPoint,' newRow::',newRow);
        document.querySelector('.popoverDiv').firstChild.innerHTML=returnPopoverMainButtons({row:newRow});
      //  textAreaStretch();
        oPage.aLists[oPage.activeListRow].listData=oPage.tmpArr;
        oPage.highlightListRow=newRow;
        oPage.lastRowClicked=oPage.highlightListRow;
        const r = resetPageNo({direction:'UP'});
         if(r){drawMainList({search:''});}
        };
    };

    if(event.target.className.includes('downMainLists_')){
      //if(!oPage.showAll){showHideAll();};
      if (!oPage.islocal&&device.platform.toLowerCase()==='android'){
        if (Keyboard.isVisible) {blurInputs();return false;};
      };
      var iRow = parseInt(event.target.className.replace('material-icons downMainLists_',''));
      if (iRow<oPage.aLists[oPage.activeListRow].listData.length-1){
        const o = oPage.aLists[oPage.activeListRow].listData;
        const d = o;
        var a = [];
        var toAdd=0;
        var newRow=0;
        for (var i=0;i<o.length;i++){
          //issue is if o.hidden we can to push it in regardless AND continue to do so untill no more hidden
          //so make funtion to return the number of hidden and add/remove from row
            if (i<iRow){
              a.push(o[i]);
            };
            if (i===iRow){
              if (o[i*1+1]){
                  if(o[i*1+1].hidden&&!oPage.showAll){
                    toAdd=0;//resets
                    toAdd+=pushTillNext({start:i*1+1,data:d});//pushes all hidden till not hidden or end
                  }else{
                    a.push(o[i*1+1]);
                    toAdd=1;
                  };
              };
              a.push(o[i]);//pushes itself
            };
            newRow=iRow*1+toAdd;
            if (i>newRow){
              a.push(o[i]);
            };
        }
        oPage.aLists[oPage.activeListRow].listData=a;
        oPage.highlightListRow=newRow;
        oPage.lastRowClicked=oPage.highlightListRow;
      //  console.log(oPage.highlightListRow,oPage.maxBlock2Dispay,oPage.startPoint,'oPage.highlightListRow DOWN::',newRow);
        setLocal('lists',oPage.aLists);
        document.querySelector('.popoverDiv').firstChild.innerHTML=returnPopoverMainButtons({row:newRow});
      //  textAreaStretch();
        const r = resetPageNo({direction:'DOWN'});
        if(r){drawMainList({search:''});}
      };
      //console.log(iRow,oPage.aLists,'<<downListofLists_',oPage.aLists[oPage.activeListRow].listData.length);
    };
    if (event.target.className.includes('updateListBut')){
      doupdateListStuff();
      return;
    };
    if (event.target.className.includes('updateListofListsBut')){
      //here here here - adjust fro updte comingbfrom headers - not correct
      const name=document.querySelector('.tedit_List_name')._input.value;
      const notes=document.querySelector('.tedit_list_notes').value;
      oPage.aLists[oPage.activeListListRow].name=name;
      oPage.aLists[oPage.activeListListRow].notes=notes;
      //console.log(oPage.activeListListRow,'updateListofListsBut::',name,notes);
      //return false;
      setLocal('lists',oPage.aLists);
      if (oPage.activeListRow===oPage.activeListListRow){
          document.querySelector('.canedit_name').innerHTML=oPage.aLists[oPage.activeListRow].name;
          document.querySelector('.canedit_notes').innerHTML=oPage.aLists[oPage.activeListRow].notes;
      }

      var el = document.getElementById('popover');
      el.hide();
      drawLists();
    };
    if (event.target.className.includes('updateListofListsHeadBut')){
      //here here here - adjust fro updte comingbfrom headers - not correct
      const name=document.querySelector('.tedit_List_name')._input.value;
      const notes=document.querySelector('.tedit_list_notes').value;
      oPage.aLists[oPage.activeListRow].name=name;
      oPage.aLists[oPage.activeListRow].notes=notes;
    //  console.log(oPage.activeListRow,'updateListofListsBut::',name,notes);
      //return false;
      setLocal('lists',oPage.aLists);

      document.querySelector('.canedit_name').innerHTML=oPage.aLists[oPage.activeListRow].name;
      document.querySelector('.canedit_notes').innerHTML=oPage.aLists[oPage.activeListRow].notes;
      var el = document.getElementById('popover');
      el.hide();
      drawLists();
    };
},true);

document.addEventListener('hold',(event)=>{
  event.stopPropagation();
  event.preventDefault();
  var evTarget = event.target;
  //console.log('in hold::',evTarget);
      if (evTarget.className.includes('list-item__center')){
        evTarget=evTarget.firstChild;
        return;
      };
      if(evTarget.className.includes('addFavJoke')){
        var o = document.querySelector('.divListFaveJokes');
      //  o.style.display='none';
        o.classList.remove('elShow');
        o.classList.add('elHide');
          const s = o.parentElement.children[0].children[1].children[0].children[0];
          var el=document.getElementById("listFaveJokes");
          if (s&&s.value===''){
            listFaveJokes({search:s.value||''})
          }else{
            redrawFavesLists({search:s.value});
        		if (el){el.show()};
          };
          return;
      };
      if(evTarget.className.includes('addFavMorse')){
          var o = document.querySelector('.divListFaveMorse');
          //o.style.display='none';
          o.classList.remove('elShow');
          o.classList.add('elHide');
          const s = o.parentElement.children[0].children[1].children[0].children[0];
          var el=document.getElementById("listFaveMorse");
          if (s&&s.value===''){
            console.log('IN DRAW')
            listFaveMorse();
          }else{
            console.log('IN RE-DRAW')
            redrawFavesMorseLists({search:s.value});
            if (el){el.show()};
          };
          console.log('addFavMorse::',s)
          return;
      };
      if(evTarget.className.includes('addFavQuote')){
        var o = document.querySelector('.divListFaveQuotes');
      //  o.style.display='none';
        o.classList.remove('elShow');
        o.classList.add('elHide');
          const s = o.parentElement.children[0].children[1].children[0].children[0];
          var el=document.getElementById("listFaveQuotes");
          if (s&&s.value===''){
            listFaveQuotes({search:s.value||''})

          }else{
            redrawFavesQuoteLists({search:s.value});
        		if (el){el.show()};
          };
          return;
      };
      if(evTarget.className.includes('listOfListsRow')){
          var popover = document.getElementById('popover');
            oPage.pop.direction = 'up';
            popover.setAttribute('direction',oPage.pop.direction);
          var o=document.querySelector('.listOfLists');
           var ell=evTarget;
           var iRow = Array.prototype.indexOf.call(o.children,ell);
           evTarget.classList.add('hightLightRow');
           document.querySelector('.popoverDiv').innerHTML=returnPopoverText({row:iRow});

            popover.show(evTarget,{left:50,right:50})
            .then((data)=>{
              oPage.popRect = popover.childNodes[3].getClientRects()[0];
              //oPage.pop.direction = popover.getAttribute('direction');
              //oPage.screen.height
              //console.log(oPage.screen.height,'<<showed::',popover.childNodes[3].getClientRects()[0]);
            });
            oPage.activeListListRow=iRow;
          return;
      };
      if(evTarget.className.includes('mainListsRow')){

      	var posOffset = offset(evTarget);
        var popover = document.getElementById('popover');
        //  console.log(screen,'<<isPortrait::',posOffset.top,'>',oPage.screen.height, evTarget);
          var thisTarget = evTarget.getClientRects();
            posOffset.top>oPage.screen.height/2 ? oPage.pop.direction = 'up' : oPage.pop.direction = 'down';
        var ell=evTarget;

        var selClass = getSelectedClass(ell);
        var o=document.getElementById('mainList');
        //var dispRow = Array.prototype.indexOf.call(o.childNodes,ell.offsetParent);
         const iRow = parseInt(selClass.replace('mainListsRow_',''));
         //var a=document.querySelectorAll('ons-list-item');
         oPage.highlightListRow=iRow;
          //and classList !inc listBodyRow
          if(evTarget.className.includes('listBodyRow')){
            ell.classList.add('hightLightRow');
          }else{
            ell.parentElement.parentElement.classList.add('hightLightRow');
          };
          var thisTarget = ell.getClientRects();
        //  console.log(oPage.highlightListRow,posOffset.top>oPage.screen.height/2,'<<in mainListsRow::',thisTarget,thisTarget[0]);
            document.querySelector('.popoverDiv').innerHTML=returnPopoverMain({row:iRow});
          //  textAreaStretch();
            //gives the current values of popover to central object (workaround for error in popover where it 'sometimes' opens in wrong place)
            //this is a fix - it sets the position of the popover direct to the coordinates of the clicked element
          //  console.log('top:',el.childNodes[3].style.top,'  bottom:',el.childNodes[3].style.bottom,'<<in listOfListsRow::');
            popover.setAttribute('direction',oPage.pop.direction);
            popover.show(evTarget,{left:50,right:50})
            .then((data)=>{
              oPage.popRect = popover.childNodes[3].getClientRects()[0];
            //  console.log(popover.getAttribute('direction'),oPage.pop.direction,data,oPage.screen.height,'<<showed::',popover.childNodes[3].getClientRects()[0]);
            })
            return;
    };

    if (evTarget.className.includes('hpIcon')){
        const s=evTarget.className.split(' ');
      //  console.log(s,'HOLD HOME PAGE::',s[0]);
        //var iWant = Array.prototype.indexOf.call(s, 'somestring');
        var el = document.querySelector('.homeHeader');
        const a=oPage.aPages;
      //  console.log('pages::',a);
        for (var i=0;i<a.length;i++){
        //  console.log(s[0].replace('m',''),'<<comparing::',a[i].page);
          if (s[0].replace('m','')===a[i].page){
            el.innerHTML=a[i].about;
            var o = document.querySelectorAll('.homeButtsHighlight');
            o.forEach((item, i) => {item.classList.remove('homeButtsHighlight');});
            evTarget.classList.add('homeButtsHighlight');
            oPage.homeView=i;
            break;
          }
        };
        return;
    };

  //};
},true);

    document.addEventListener('swipeleft', function(event) {
    //aPages:['home','square','shopping','jokes','info'],
        //console.log('Swipe left is detected::',event);
        //blurlastinput();
        showModal(5);
        const iPageCount = oPage.aPages.length;
        const a = oPage.aPages;
        var iRow = 0;//Array.prototype.indexOf.call(oPage.aPages, oPage.page);
        for(var i=0;i<a.length;i++){
          if(a[i].page===oPage.page){
            iRow=i;
            break;
          }
        };

        iRow = iRow*1+1;
        if (iRow>=oPage.aPages.length){
          iRow=0;
        };

        if (window.m){try{window.m.stop();}catch{//console.log('cannot stop m!!');
        };};

        document.querySelector('#myNavigator').bringPageTop(oPage.aPages[iRow].usesPage)
        .then(()=>{
          oPage.pageTitle=oPage.aPages[iRow].title;
          oPage.page=oPage.aPages[iRow].page;
          addpagetitle({title:oPage.pageTitle});
          oPage.usrsettings.rhanded ? setcardhand({rhand:true}) : setcardhand({rhand:false});
          //console.log('swiope left result page::',oPage.page,oPage.pageTitle);
          //resetCards({top:oPage.topAdjuster,islandscape:ons.orientation.isLandscape()});

          afterLoadStuff({page:oPage.page});
          showhidetoolbars();
          if (oPage.page==='home'){
            getPullerReady({page:oPage.page});
            setHomePage();
          //  closeModal();
          };
          if (oPage.page==='jokes'){
            //console.log('swipe left ,last joke::',d);

            getPullerReady({page:oPage.page});
                    const d = getLocal('lastJoke');
            if (d){drawJoke({joke:d,highlight:''});}else{fetchJoke();};
          //  closeModal();//
        };
          if (oPage.page==='info'){
              checknopull();
              aboutSquares();
          };
          if (oPage.page==='morse'){
              getPullerReady({page:oPage.page});
              morse();
          };
            if (oPage.page==='lists'){
              getPopoverReady({page:oPage.page});
              getPullerReady({page:oPage.page});
              doDBStuff();
              drawMainList({search:''});
              document.querySelector('.mainList').style.maxHeight=oPage.screen.height-250+'px';
            };
            if (oPage.page==='square'){
              if(getLocal('soSQ')){
                oSQ=getLocal('soSQ');
              };
              getPullerReady({page:oPage.page});
              drawSquares();
              $('#divSquares').slideDown('slow',function(){
                $(this).removeAttr('style');
                $(this).removeClass('elHide');
                $(this).addClass('elShow');
              });
              loadOnClick();
              if(!oSQ.bfirstMove){document.querySelector('.replayBack').disabled=false;};
              colourPlayerConts(oSQ.iSquarePlayer);
              drawBoard(9);
            };
            if (oPage.page==='quotes'){
              getPopoverReady({page:oPage.page});
              getPullerReady({page:oPage.page});
              quotes();
            };
            return;
        });
    },true);



    document.addEventListener('swiperight', function(event) {
      showModal(5);
    //  blurlastinput();
      //document.activeElement.blur();
      const iPageCount = oPage.aPages.length;
      const a = oPage.aPages;
      var iRow = 0;//Array.prototype.indexOf.call(oPage.aPages, oPage.page);
      for(var i=0;i<a.length;i++){
        if (a[i].page===oPage.page){
          iRow=i;
          break;
        };
      };


      iRow = iRow-1;
      if (iRow<0){
        iRow=oPage.aPages.length-1;
      };


      //if (window.m){window.m.stop();};
      if (window.m){try{window.m.stop();}catch{//console.log('cannot stop m!!');
      };};
    //  console.log(oPage.page,'<<Swipe right is detected::',iPageCount,iRow);
      document.querySelector('#myNavigator').bringPageTop(oPage.aPages[iRow].usesPage,{animation:'lift'})
      .then(()=>{
        oPage.pageTitle=oPage.aPages[iRow].title;
        oPage.page=oPage.aPages[iRow].page;
        oPage.usrsettings.rhanded ? setcardhand({rhand:true}) : setcardhand({rhand:false});
        addpagetitle({title:oPage.pageTitle});
      //  console.log('swiope right result page::',oPage.page,oPage.pageTitle);
        //resetCards({top:oPage.topAdjuster,islandscape:ons.orientation.isLandscape()});
        afterLoadStuff({page:oPage.page});
        showhidetoolbars();
        if (oPage.page==='home'){
            getPullerReady({page:oPage.page});
            setHomePage();
          //  closeModal();
        }
        if (oPage.page==='jokes'){
          getPullerReady({page:oPage.page});
          const d = getLocal('lastJoke');
          //console.log('swipe right ,last joke::',d);
          if (d){drawJoke({joke:d,highlight:''});}else{fetchJoke();};
        }
        if (oPage.page==='info'){
            checknopull();
            aboutSquares();
        };

        if (oPage.page==='morse'){
            getPullerReady({page:oPage.page});
            morse();
        };
          if (oPage.page==='lists'){
            setTimeout(function () {
              getPopoverReady({page:oPage.page});
              getPullerReady({page:oPage.page});
              doDBStuff();
              drawMainList({search:''});
              document.querySelector('.mainList').style.maxHeight=oPage.screen.height-300+'px';
            },100);
          };
          if (oPage.page==='square'){
              if(getLocal('soSQ')){
                oSQ=getLocal('soSQ');
              };
              getPullerReady({page:oPage.page});
              drawSquares();
              $('#divSquares').slideDown('slow',function(){
                $(this).removeAttr('style');
                $(this).removeClass('elHide');
                $(this).addClass('elShow');
              });
              loadOnClick();
              if(!oSQ.bfirstMove){document.querySelector('.replayBack').disabled=false;};
              colourPlayerConts(oSQ.iSquarePlayer);
              drawBoard(9);
          };
          if (oPage.page==='quotes'){
            getPopoverReady({page:oPage.page});
            getPullerReady({page:oPage.page});
            quotes();
          };
          return;
      });
    });

    document.addEventListener('input', function (event) {

    /*  if (event.target.tagName.toLowerCase() === 'textarea'){
         doTextAreaStuff(event.target);
      };*/
      if(event.target.className.includes('search-input')&&oPage.page==='lists'){
        oPage.startPoint = 0;
        searchList(event);
        //._input.focus()
      };
      if(event.target.className.includes('search-input')&&oPage.page==='morse'){
        if (event.target.parentElement.className.includes('searchFavMorse')){
                  redrawFavesMorseLists({search:event.target.value});
        };
      };
      if(event.target.className.includes('search-input')&&oPage.page==='jokes'){
        if (event.target.parentElement.className.includes('searchFavJokes')){
                  redrawFavesLists({search:event.target.value});
        };
      };
      if(event.target.className.includes('search-input')&&oPage.page==='quotes'){

        if (event.target.parentElement.className.includes('searchFavQuotes')){
          //console.log('search-input QUOTES::',event.target);
                  redrawFavesQuoteLists({search:event.target.value});
        };
      };
    //  return;
    }, false);
    document.addEventListener('change', function (event) {
      const evTar = event.target;
      //console.log(oPage.page,'<<in onchange!!!event::',event,evTar);
      if (evTar.className.includes('usrsethandswitch')) {
        //loop through .card and add cardLeft or cardRight then add to settings. change text in setshanded - done!!
        oPage.usrsettings.rhanded = evTar.children[0].checked;
        //setshanded
        const setshanded = document.querySelector('.setshanded');
        setLocal('usrsettings',oPage.usrsettings)
        //console.log(evTar.children[0].checked,'<<usrsethandswitch::',evTar,getLocal('usrsettings'),oPage.usrsettings.rhanded);
          oPage.usrsettings.rhanded ? setcardhand({rhand:true}) : setcardhand({rhand:false});
          oPage.usrsettings.rhanded ? setshanded.innerHTML = 'right handed' : setshanded.innerHTML = 'left handed';
        return;
      };

      if (evTar.className.includes('usrsetshakeswitch')) {
        const result = evTar.children[0].checked;
        oPage.usrsettings.shake = result;
        const setsshake = document.querySelector('.setsshake');
        //setLocal('usrsettings',oPage.usrsettings);//note removed to deal with the "DeviceMotionEvent on every load!". Shake needs to be re-requested on the session
        //console.log(evTar.children[0].checked,result,'<<usrsetshakeswitch::',evTar,getLocal('usrsettings'),oPage.usrsettings,oPage.usrsettings.shake);
          oPage.usrsettings.shake ? setsshake.innerHTML = 'shake on' : setsshake.innerHTML = 'shake off';
          result && setupdevicemotion(true);
        return;
      };

    }, false);

    document.addEventListener('focus',function(event){
        //event.preventDefault();
        event.stopPropagation();
        return;
    },true);

    document.addEventListener('blur',function(event){
      //  event.preventDefault();
      event.stopPropagation();
    //  console.log('in blur::',event);
        return;
    },true);
    document.addEventListener('postshow', function(event) {
        if (event.target.id==='popover'){
          //console.log(oPage.startPoint,oPage.lastStartPoint,'popover postshow::',event);
            oPage.lastStartPoint = oPage.startPoint;
            return;
        };
     });

    document.addEventListener('posthide', function(event) {
        if (event.target.id==='popover'){
          //  console.log(oPage.startPoint,oPage.lastStartPoint,'popover closed::',event);
            oPage.startPoint = oPage.lastStartPoint;


            return;
        };
     });

      document.addEventListener('keyup',function(event){
        const evTar = event.target;
        if (event.keyCode === 13){
            //console.log('keyup ENTER::',event);
            //tedit_title
            if(evTar.className.includes('text-input')&&oPage.page==='lists'){
              if (evTar.parentElement.className.includes('tedit_title')||evTar.parentElement.className.includes('tedit_notes')){
                  doupdateListStuff();
              };
              if (evTar.parentElement.className.includes('titem')||evTar.parentElement.className.includes('tnotes')){
                  addItem();
              };
              if (evTar.parentElement.className.includes('nlistName')||evTar.parentElement.className.includes('nListNotes')){
                  addnewliststuff()
              };
              return;
            };

            if(evTar.className.includes('search-input')&&oPage.page==='jokes'){
              if (evTar.parentElement.className.includes('searchJokeTxt')){
                getJokeFrom();
              };
              return;
            };

            if(evTar.className.includes('search-input')&&oPage.page==='quotes'){
              if (evTar.parentElement.className.includes('getQuoteFrom')){//
                oQuotes.lastviewtxt = stripSC(evTar.value);
                evTar.blur();
                fetchanddrawquote();
              };
              return;
            };
        };
      });
/*
        window.addEventListener('keyboardDidShow', (event) => {
        // Describe your logic which will be run each time when keyboard is about to be shown.
        console.log('keyboardDidShow::',event.keyboardHeight);
    });
*/
