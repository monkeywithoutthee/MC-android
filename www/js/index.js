'use strict';
const isLocal = false;
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

      //create a new instance of shake.js.
  const myShakeEvent = new Shake({
    threshold: 15, // optional shake strength threshold
    timeout: 1000 // optional, determines the frequency of event generation
  });

const app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
      onDeviceReady: function() {
        if (getLocal('usrsettings')){
          oPage.usrsettings = getLocal('usrsettings');
        };
        //taking this out as the app needs to request DeviceMotionEvent every time its opened.
        //therefore as a cop out, the system will not save oPage.usrsettings.shake to drive and
        //will need to be called on every session!!!
        //oPage.usrsettings.shake && setupdevicemotion(false);

        // register a shake event
        window.addEventListener('shake', (e)=>{
        //  console.log(document.activeElement,'<<shaking!!',e);
          oPage.usrsettings.shake && onShake();//onShake deals with all shake actions!
        }, false);

      //}, 1000);



      innit();
      console.log(this,'<<deviceready::',device);
      document.addEventListener("resume", onResume, false);

      if (!oPage.islocal&&device.platform.toLowerCase()==='android'){
        window.addEventListener('native.keyboardshow',keyboardShowHandler,false);
        window.addEventListener('native.keyboardhide',keyboardHideHandler,false);
      };
    }
};

app.initialize();


//note - from morse player
// Handle the resume event
//
function onResume(event) {
  //there is an issue with the morse player after sleep.
  //best option if to reload the player.
  //console.log(oTimeInterval,'resuming::',timeinterval,oSQ.tenGameOptions);
  var divPlayerHol = document.querySelector('.playerHolder');
  if(divPlayerHol){
    divPlayerHol.style.display = 'none';
  };
  if(document.getElementById('player')){
    setUpPlayer();
  };
};//end from more player

var kbHeigth = 0;
var vPoint = 0;
function keyboardShowHandler(e){
    //var screenHeight = oPage.screen.height;
    kbHeigth = e.keyboardHeight;
    vPoint =  oPage.screen.height - kbHeigth;//the point at the top of the keboard on the screen

      const actEl = document.activeElement;

    //  if (actEl.type === 'text'||actEl.type ==='textarea'){
        const coactEl = actEl.getClientRects()[0];
        const popoverDir = oPage.pop.direction;// document.getElementById('popover').getAttribute('direction');
        const frombottom = oPage.screen.height-oPage.popRect.bottom;//ons popover needs the dispance from bottom of page to bottom of object
        const ob = {direction:popoverDir,
          height:oPage.popRect.height||200,
          eltop:coactEl.top||400,
          elbottom:coactEl.bottom||400,
          top:oPage.popRect.top||400,
          bottom:oPage.popRect.bottom||200,
          vpoint:vPoint||400,
          frombottom:frombottom||200};
      //  console.log(e,ob,actEl,kbHeigth,'<<kb height screen height::',oPage.screen.height,' VPoint tests::',oPage.pop.direction,popoverDir,'<< CHANGES TO POPOVER::',popoverDir===oPage.pop.direction)
        if (device.platform.toLowerCase()==='android'){
          pushUpScreen(ob);
        };
        //search-input
    //};
};
function keyboardHideHandler(){
  //  console.log(e,'<<Keyboard CLOSED');
    if (device.platform.toLowerCase()==='android'){
    //  const frombottom = oPage.screen.height-oPage.popRect.bottom;
    //  const fromtop = oPage.popRect.top;
    //  const popoverDir = document.getElementById('popover');
    //  if (popoverDir){
        var docBody = document.body;
        $(docBody).animate({top:0},function(){
          console.log('after hide::');
        });
    //  };
    };
};

const pushUpScreen = ((el)=>{
  //console.log('pushUpScreen receiving::',el);
  const popover = document.getElementById('popover');
        popover && popover.setAttribute('direction',el.direction);
        const padding = 0;
        var move = 0;
        if (el.direction.toLowerCase()==='down'){
          const istop = parseInt(el.eltop)+parseInt(el.height);
        //  console.log(parseInt(istop),'down comapre::',parseInt(el.vpoint),parseInt(istop)>parseInt(el.vpoint));
          if (parseInt(istop)>parseInt(el.vpoint)){
            move = parseInt(istop) - parseInt(el.vpoint);
          };
        };
        if (el.direction.toLowerCase()==='up'){
          const isbottom = parseInt(el.elbottom)+parseInt(el.height);
        //  console.log(parseInt(isbottom),'up comapre::',parseInt(el.vpoint),parseInt(isbottom)>parseInt(el.vpoint));
          if (parseInt(isbottom)>parseInt(el.vpoint)){
            move = parseInt(isbottom)-parseInt(el.vpoint);
          };
        };
        if (ons.orientation.isLandscape()){
          move -= 80;
        };
        //console.log(el.direction.toLowerCase(),'<<MOVE:::',move);
        if (move > 0){
          $(document.body).animate({top:-move},function(){
          });
        };
        //console.log(move,'<<final move DOWN::',el.vpoint,el.direction.toLowerCase());
});




function addpagetitle(data){
    document.querySelector('.toolbar__title').innerHTML=data.title;
};

const setsiliconcards = ((data)=>{
  //data = bool
  //data = true;
   //console.log('in setsiliconcards::',data);
  //assigns left/ right hand class based on data.rhand
  const os = document.querySelectorAll('.card');
  os.forEach((item, i) => {
    data ? os[i].classList.add('siliconcard') : os[i].classList.remove('siliconcard');
  });
});
const setcardhand = ((data)=>{
  //data = rhand:false}
  // /console.log('in setcardhand::',data);
  //assigns left/ right hand class based on data.rhand
  const os = document.querySelectorAll('.card');
  os.forEach((item, i) => {
    if (!os[i].className.includes('nohanded')){
      if (data.rhand){
        os[i].classList.remove('cardLeft');
        os[i].classList.add('cardRight');
      }else{
        os[i].classList.remove('cardRight');
        os[i].classList.add('cardLeft');
      };
    };
  });
  const handed = document.querySelectorAll(`.blockhanded`);//add to favourites
  handed.forEach((item, i) => {
    if (data.rhand){
      handed[i].classList.remove('lefthanded');
      handed[i].classList.add('righthanded');
    }else{
      handed[i].classList.remove('righthanded');
      handed[i].classList.add('lefthanded');
    };
  });
  const handedP = document.querySelectorAll(`.blockhandedP`);//element working with class right:??px or left!
  handedP.forEach((item, i) => {
    if (data.rhand){
      handedP[i].classList.remove('lefthandedP');
      handedP[i].classList.add('righthandedP');
    }else{
      handedP[i].classList.remove('righthandedP');
      handedP[i].classList.add('lefthandedP');
    };
  });
  const clearhanded = document.querySelectorAll(`.clearhanded`);//clear icon for text area
  clearhanded.forEach((item, i) => {
    if (data.rhand){
      clearhanded[i].classList.remove('clearleft');
      clearhanded[i].classList.add('clearright');
    }else{
      clearhanded[i].classList.remove('clearright');
      clearhanded[i].classList.add('clearleft');
    };
  });

  const textareahanded = document.querySelectorAll(`.areahanded`);//textarea - indents on the left
  // areahanded arearight
  textareahanded.forEach((item, i) => {
    if (data.rhand){
      textareahanded[i].classList.remove('arealeft');
      textareahanded[i].classList.add('arearight');
    }else{
      textareahanded[i].classList.remove('arearight');
      textareahanded[i].classList.add('arealeft');
    };
  });

  const lblockhanded = document.querySelectorAll(`.flhanded`);//jack up and delete box on lists
  // areahanded arearight
  lblockhanded.forEach((item, i) => {
    if (data.rhand){
      lblockhanded[i].classList.remove('flLeft');
      lblockhanded[i].classList.add('flRight');
    }else{
      lblockhanded[i].classList.remove('flRight');
      lblockhanded[i].classList.add('flLeft');
    };
  });

  const fabhanded = document.querySelectorAll('.fabBhanded');
  fabhanded.forEach((item, i) => {
    const cur = fabhanded[i].className;
  //  console.log(cur,'<<hab handed::',fabhanded[i]);
    if (cur.includes('defright')){
      data.rhand ? fabhanded[i].setAttribute('position','bottom right') : fabhanded[i].setAttribute('position','bottom left');
    }else{
      data.rhand ? fabhanded[i].setAttribute('position','bottom left') : fabhanded[i].setAttribute('position','bottom right');
    };
  });
});






//system functions bkkb b bk kbkb b / bkkb b bk kbkb b / bkkb b bk kbkb b / bkkb b bk kbkb b /
//bkkb b bk kbkb b / bkkb b bk kbkb b / bkkb b bk kbkb b / bkkb b bk kbkb b /
function innit() {

      console.log(oPage.usrsettings,'<<in init innit!',!ons.orientation.isLandscape());
      addpagetitle({title:oPage.pageTitle});
      showModal(5);
      setTimeout(()=> {
        /*  if (!oPage.islocal){
              navigator.splashscreen.hide();
          };*/


        if (!oPage.islocal&&device.platform.toLowerCase()==='ios'){console.log('IOS app running')};
        if (!oPage.islocal&&device.platform.toLowerCase()==='android'){console.log('ANDROID app running')};
      //  if (oPage.islocal){console.log('LOCAL app running')}else{console.log('<<APP app running::',device)};
         //setLocal('soSQ',null);//clear issues for testing ONLY VERY CAREFULL - NEVER EVER PUT LIVE!!
          afterLoadStuff({page:'home'});
    }, 100);
};



const isSilicon = (()=>{

  /*
      slight issue with regard to testing the ios catylist simulator
      */
      const issimulator = !oPage.islocal
          &&device.manufacturer.toLowerCase()==='apple'
          &&!device.model.toLowerCase().includes('iphone')
          &&!device.model.toLowerCase().includes('ipad') ? true : false;

        return !oPage.islocal ? device.isiOSAppOnMac || issimulator : false;

});

function afterLoadStuff(data){
  //use to merge and de-duplicate simple array - not part of app
/*var x=[];
  var alreadyIn=((data)=>{
    var ret = false;
    for (var i = 0; i < data.data.length; i++) {
      if (data.data[i]===data.name){
        ret = true;
        break;
      }
    };
    return ret;
  });
  sBands.forEach((item, i)=>{
        var o=alreadyIn({data:x,name:item});
        if(!o){
          x.push(item);
        };
  });
  return false;
        console.log(window.navigator,'<<afterLoadStuff::',data,sBands,x.sort());*/
  //data={page:'home'};

  if (!oPage.islocal){
      navigator.splashscreen.hide();
  };

  //getLocal('usrsettings') ? oPage.usrsettings = getLocal('usrsettings') : setLocal('usrsettings',oPage.usrsettings);

//showModal(5);
setTimeout(function () {

    //  if (oPage.firstLoad){
        //screen:{height:0,top:0,left:0,width:0}
      /*  issue with first load on devices. Top becomes the width so added this switch here to reset to the app!*/
          var newheight = window.innerHeight;//screen.availHeight;
          var newwid = window.innerWidth;//screen.availWidth;
          if (newheight<newwid){
            newheight = window.innerWidth;//screen.availWidth;
            newwid = window.innerHeight;//screen.availHeight;
          };
          oPage.screen.height = newheight;
          oPage.screen.top = 0;//screen.availTop;
          oPage.screen.left = 0;//screen.availLeft;
          oPage.screen.width = newwid;
      //  };
      const body = document.getElementsByTagName('body')[0];
      //  console.log(ons.orientation.isLandscape(),window.innerWidth,window.innerHeight,body.clientWidth,body.clientHeight,'<<FIRST LOAD::',screen);
    //};
  //  console.log(ons.platform.isIPhoneX(),'<<afterLoadStuff::',oPage.firstLoad);
  //this is getting a little messy!
  //heres the plan, if device comes back with model: "arm64" then its a silicon mac! I know, there must be something better - will do for now!
//gonna use window.innerWidth,window.innerHeight instead of screen and set body height to 100%
//if issilocon then ensure toolbars visible all the time


      var listadjuster = 260;
      var jokeadjuster = 300;
      var topAdjuster = 0;
      if (ons.platform.isIPhoneX()) { // all iphone x and after
        topAdjuster += 6;
        const t = document.querySelector('.toolbar');
        if (t){
          if (!t.className.includes('iphonextoolbar')){
            t.classList.add('iphonextoolbar');
            t.firstElementChild.classList.add('toolbar__titleiPhinex');
          };
        };
        //toolbar__title
      };
      if (!oPage.islocal&&device.platform.toLowerCase()==='ios'&&!ons.platform.isIPhoneX()){
          topAdjuster = -36;
      };
      if (!oPage.islocal&&device.platform.toLowerCase()==='android'){
          topAdjuster = 18;
      };
      if (!oPage.islocal&&device.model.includes('iPad')&&oPage.firstLoad) { // Utility function
        topAdjuster = -17;
      };
      if (ons.orientation.isLandscape()){
        listadjuster = 180;
        jokeadjuster = 100;
        topAdjuster = -77;
        if (!oPage.islocal&&device.platform.toLowerCase()==='ios'){
          topAdjuster = -77;
        };
        if (!oPage.islocal&&device.platform.toLowerCase()==='android'){
          topAdjuster = -26;
        };
      //  document.body.style.height=oPage.screen.height*1+25+'px';
        isSilicon() ? document.body.classList.add('siliconstretch') : $(document.body).animate({height:oPage.screen.height*1+25});
      }else{
      //  document.body.style.height=oPage.screen.height+'px';
        isSilicon() ? document.body.classList.add('siliconstretch') : $(document.body).animate({height:oPage.screen.height});;
      };
      if (isSilicon()){
        topAdjuster = -33;//here here here
        const el = document.querySelectorAll('ons-toolbar');
      //  console.log(document.querySelectorAll('ons-toolbar'),'<<blahhh::',document.querySelectorAll('.ons-toolbar'));
        el.forEach((item,i) => {
        //  console.log(el[i],'<<blahhh::',item);
          el[i].classList.remove('elHide');
          el[i].classList.add('elShow');
          el[i].classList.add('silicontt');
          el[i].removeAttribute('style');
        });
        const elt = document.querySelectorAll('ons-bottom-toolbar');
        elt.forEach((item,i) => {
          elt[i].classList.remove('elHide');
          elt[i].classList.add('elShow');
          elt[i].removeAttribute('style');
        });
      };
//  console.log(ons.orientation.isLandscape(),'<<orientation::',oPage.screen)
    oPage.topAdjuster = topAdjuster;
    if (data.page==='home'){

      var el = document.querySelector('.homeHeader');
      el.innerHTML = oPage.aPages[0].about;
    //  $(el).addClass('elShow');
      $(el).fadeIn('slow',function(){
        getPullerReady({page:oPage.page});
        setHomePage();
      //  $(this).removeClass('elHide');
      //  $(this).addClass('elShow');
      //  $(this).fadeIn('slow');
      });
    //  closeModal();
    };

    if(getLocal('faveQuotes')){
      oQuotes.faveQuotes=getLocal('faveQuotes');
    };
    if(data.page==='lists'){
      document.querySelector('.mainList').style.maxHeight=oPage.screen.height-listadjuster+'px';
    };
    if(data.page==='jokes'){
      if(getLocal('faveJokes')){
        oPage.faveJokes=getLocal('faveJokes');
      };
      document.querySelector('.divListFaveJokes').style.maxHeight=oPage.screen.height-jokeadjuster+'px';
    };
    if(data.page==='quotes'){
      if(getLocal('faveQuotes')){
        oPage.faveJokes=getLocal('faveQuotes');
      };
      //document.querySelector('.divFaveQuotes').style.maxHeight=oPage.screen.height-jokeadjuster+'px';
    };
    //  console.log(isSilicon(),'<<isLandscape::',screen);
    if (!isSilicon()&&ons.orientation.isLandscape()){
      $('.toolbar').fadeOut('fast',function(){//here here here - reset function for bottom bar
        resetCards({top:oPage.topAdjuster,islandscape:ons.orientation.isLandscape()});
      });
    }else{
      $('.toolbar').fadeIn('fast',function(){
        resetCards({top:oPage.topAdjuster,islandscape:ons.orientation.isLandscape()});
      });
    };

    showhidetoolbars();
    setsiliconcards(isSilicon());
    oPage.firstLoad=false;
    setTimeout(function () {
      closeModal();
    }, 1000);
  }, 100);
};


const getPullerReady = function(data){
          const pullHook=document.getElementById('pull-hook-'+data.page);
          //console.log('pull-hook-'+data.page,'<<pullHook.changestate::');
          var canPull = '';
          var state='';
          const a=oPage.aPages;
      /*    if (!oPage.islocal&&device.platform.toLowerCase()==='android'){
            pullHook.setAttribute('height','12px');
            pullHook.setAttribute('lineHeight','1');
          };
          if (!oPage.islocal&&device.platform.toLowerCase()==='ios'){
            pullHook.setAttribute('height','1px');
            pullHook.setAttribute('lineHeight','1');
          };*/
          if (!oPage.islocal&&device.platform.toLowerCase()==='ios'&&!ons.platform.isIPhoneX()){
              pullHook.classList.add('pullPreiPhoneX');
          };
          if (!oPage.islocal&&device.platform.toLowerCase()==='android'){
              //pullHook.setAttribute('top','-50px');
            //  checkandroidbottom(); //removing
              pullHook.classList.add('pullandroid');
          };
          if (!ons.orientation.isPortrait()){
            pullHook.classList.add('pullLandscape');
          }else{
            pullHook.classList.remove('pullLandscape');
          };
          pullHook.setAttribute('height','10px');
          pullHook.setAttribute('lineHeight','1');
          pullHook.addEventListener('changestate',function(event){
              const messText = (()=>{
                if (data.page === 'home'){
                  return {initial:oPage.aPages[0].pullMessage.homeSummary[oPage.homeView],preaction:oPage.aPages[0].pullMessage.homeSummary[oPage.homeView],action:'viewing next feature'};
                }else{
                  return oPage.aPages[returnPageIndex({page:data.page})].pullMessage;
                };
              })();

              if (!ons.orientation.isPortrait()){
                pullHook.classList.add('pullLandscape');
              }else{
                pullHook.classList.remove('pullLandscape');
              };

          //  console.log(pullHook,messText,oPage.aPages[0].pullMessage.homeSummary[oPage.homeView],'<<puller::',oPage.homeView,a,data.page,event,event.state);
              switch (event.state) {
                  case 'initial':
                      pullHook.innerHTML = messText.initial;
                      break;
                  case 'preaction':
                      pullHook.innerHTML = messText.preaction;
                      break;
                  case 'action':
                      pullHook.innerHTML = messText.action;
                      break;
                  default:
                      pullHook.innerHTML = messText.initial;
                      break;
              };
          });
          pullHook.onAction = function (done) {
            //console.log(pullHook,data.page,'<<pullHook.onAction::',oSQ.tenGameChallange);
          if(oSQ.tenGameOptions.timeTaken>0&&data.page==='square'&&oSQ.tenGameChallange){
            var oOptions = {buttonLabels:['continue', 'quit']};
            const sMessage = 'You cannot use the pull screen whilst you are in Squares competition mode.<br><br> You are playing against the clock!';
            ons.notification.confirm(sMessage, oOptions).then((data)=>{
              if(data){
                stopChallenge();
              };
              //console.log('conf pressed::',data);
            });
            //return false;
          }else{
            if (data.page==='home'){
              setTimeout(done,100);
              homeMoveNext();
            };
            if (data.page==='square'){
              setTimeout(done, 100);
                  refreshSquares();
            };
            if (data.page==='lists'){
              setTimeout(done, 100);
              onShake();//same as!
            };
            if (data.page==='jokes'){
              setTimeout(done,100);
              addRemoveFavJoke();
            };
            if (data.page==='morse'){
              setTimeout(done,100);
              addRemoveFavMorse();
            };
            if (data.page==='quotes'){
              setTimeout(done,100);
              addRemoveFavQuote();
            };
          };
        };
          //pullHook.disabled=false;
  };

  const checknopull = (()=>{

    if (!oPage.islocal&&device.platform.toLowerCase()==='android'){
      const el = document.querySelector('.nopullhook');
      if (el){
          el.classList.remove('nopullhook');
          el.classList.add('nopullhookandroid');
      };
    };

  })

const checkandroidbottom = (()=>{

  if (!oPage.islocal&&device.platform.toLowerCase()==='android'){
    const el = document.querySelectorAll('.fabToolbar');
    if (el){
        el.classList.add('fabandroidbottom');
    };
  };
});


const returnshortdate = ((data)=>{
  //{date:'date'}
  const dt = new Date((data.date).toString().replace(' ', 'T'));
//  console.log(dt,isNaN(Date.parse(dt)),Date.parse(dt),'<<returnshortdate::',data);
  if (isvaliddate(dt)) {
    const day = '0'+dt.getDate().toString();
    const month = '0'+(dt.getMonth()*1+1).toString();
    const year = dt.getFullYear().toString();
    const hours = '0'+dt.getHours().toString();
    const mins = '0'+dt.getMinutes().toString();
    const secs = '0'+dt.getSeconds().toString();
    //return `${day.slice(day.length-2,day.length)}-${month.slice(month.length-2,month.length)}-${year.slice(year.length-2,year.length)} ${hours.slice(hours.length-2,hours.length)}:${mins.slice(mins.length-2,mins.length)}:${secs.slice(secs.length-2,secs.length)}`;
    return `${day.slice(day.length-2,day.length)}-${month.slice(month.length-2,month.length)}-${year.slice(year.length-2,year.length)} ${hours.slice(hours.length-2,hours.length)}:${mins.slice(mins.length-2,mins.length)}`;
  } else {
    return data.date;
  };
});

const isvaliddate = ((date)=>{
  //data = date
  //should be a number
  return isNaN(Date.parse(date)) ? false : true;
});




const setupdevicemotion = ((requested)=>{

      if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              console.log('myShakeEvent shake started??');
              myShakeEvent.start();
              console.log(`setupdevicemotion::`,permissionState);
            };
          })
          .catch(console.error);
      } else {
        //non iOS 13+ devices
        console.log(`non iOS 13+ devices::`);
      requested && ons.notification.toast(`shake probably wont work on this device!`,oPage.toastOptions);
      };

});


const blurlastinput = (()=>{
  //not strictly, create a new input, select it and blur should leave nothing selected
  setTimeout(function () {
    const tmp = document.createElement('input');
        document.body.appendChild(tmp);
        tmp.focus();
        tmp.value = "hello!";
        setTimeout(function () {
          tmp.blur();
          document.body.removeChild(tmp);
          document.activeElement.blur();
          //console.log('blured!!',document.activeElement);
        }, 100);
  }, 10);



});

const blurinputs = ((data)=>{
  //data = el
  //blursd all inputs within an element
  data.forEach((item, i) => {
    item.blur();
    //console.log(data,'<<bluring::',item,document.activeElement);
  });
});
