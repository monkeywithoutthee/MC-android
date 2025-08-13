'use strict';
//m00m m m0 0m0m m /m00m m m0 0m0m m /m00m m m0 0m0m m /m00m m m0 0m0m m /m00m m m0 0m0m m
////m00m m m0 0m0m m /m00m m m0 0m0m m /m00m m m0 0m0m m /m00m m m0 0m0m m /m00m m m0 0m0m m
//morse code page stuff!
const dataset = [
{char:"0",res: "-----"}
,{char:"1",res: ".----"}
,{char:"2",res: "..---"}
,{char:"3",res: "...--"}
,{char:"4",res: "....-"}
,{char:"5",res: "....."}
,{char:"6",res: "-...."}
,{char:"7",res: "--..."}
,{char:"8",res: "---.."}
,{char:"9",res: "----."}
,{char:"a",res: ".-"}
,{char:"b",res: "-..."}
,{char:"c",res: "-.-."}
,{char:"d",res: "-.."}
,{char:"e",res: "."}
,{char:"f",res: "..-."}
,{char:"g",res: "--."}
,{char:"h",res: "...."}
,{char:"i",res: ".."}
,{char:"j",res: ".---"}
,{char:"k",res: "-.-"}
,{char:"l",res: ".-.."}
,{char:"m",res: "--"}
,{char:"n",res: "-."}
,{char:"o",res: "---"}
,{char:"p",res: ".--."}
,{char:"q",res: "--.-"}
,{char:"r",res: ".-."}
,{char:"s",res: "..."}
,{char:"t",res: "-"}
,{char:"u",res: "..-"}
,{char:"v",res: "...-"}
,{char:"w",res: ".--"}
,{char:"x",res: "-..-"}
,{char:"y",res: "-.--"}
,{char:"z",res: "--.."}
,{char:".",res: ".-.-.-"}
,{char:",",res: "--..--"}
,{char:"?",res: "..--.."}
,{char:"!",res: "-.-.--"}
,{char:"-",res: "-....-"}
,{char:"/",res: "-..-."}
,{char:"@",res: ".--.-."}
,{char:"(",res: "-.--."}
,{char:")",res: "-.--.-"}
,{char:" ",res: "/"}
];
var oMC = {toMorse:true,innerHTML:['morse to text','text to morse'],tenQuotes:[],favMorse:[]};
var  m = {};//the media player ui
if (getLocal('oMC')){
    oMC = getLocal('oMC');
    oMC.toMorse = true;//always start text to morse!
  //  console.log(oMC,'getLocal(oMC)::',getLocal('oMC'));
};
var addRemoveFavMorse = (()=>{
  //console.log('in addRemoveFavMorse::');
  var smorse = document.querySelector('.morseOutput').innerText;
    if (!oMC.toMorse){
      smorse = document.querySelector('.morseTextInput').value;
    };
    if (smorse.length > 0){
      var isInFav = isInFavs({morse:smorse});
      if (isInFav){//then take it out
        document.querySelector('.addFavMorse').innerHTML = 'favorite_border';
        //event.target.innerHTML = 'favorite_border';
        removeMorseFromFaves({morse:smorse});
        ons.notification.toast('Morse removed from favourites .', oPage.toastOptions);
      }else{//put it in
        //event.target.innerHTML = 'favorite';
        document.querySelector('.addFavMorse').innerHTML = 'favorite';
        oMC.favMorse.unshift({morse:smorse});
        setLocal('oMC',oMC);
        ons.notification.toast('Morse added to favourites .', oPage.toastOptions);
      };
    };
});
const morse = function(){
  console.log('morse()');
  var divPlayerHol = document.querySelector('.playerHolder');
//$(divPlayerHol).fadeOut('slow');
//  divPlayerHol.style.display = 'none';
  divPlayerHol.classList.remove('elShow');
  divPlayerHol.classList.add('elHide');
  var addFavMorse = document.querySelector('.addFavMorse');
    if (!addFavMorse.getAttribute('listener')) {
        addFavMorse.addEventListener('click',(event)=>{
          //add the morse to a favourites array
          addRemoveFavMorse();
          //console.log('addFavMorse click::',event);
          return;

      });
        addFavMorse.addEventListener('hold',(event)=>{
          //console.log('oMC.favMorse HOLD::',oMC.favMorse);
        //event.stopPropagation();
          //add the morse to a favourites array
          var o = document.querySelector('.divListFaveMorse');
          //o.style.display='none';
          o.classList.remove('elShow');
          o.classList.add('elHide');
          listFaveMorse();
          return;
      });
      addFavMorse.setAttribute('listener',true);
      //console.log(addFavMorse,'<<oMC.favMorse::',oMC.favMorse);
    };


  var morseSwitchInput = document.querySelector('.morseSwitchInput');
      if (!morseSwitchInput.getAttribute('listener')){
          morseSwitchInput.addEventListener('click',(event)=>{
            //console.log(morseSwitchInput,'<<in morseSwitchInput click::',event);
            var elTar = event.target;
          //  if (elTar.className.includes('switchInput')){
            //  document.querySelector('.morseTextInput').value = '';
            var sText = document.querySelector('.morseTextInput').value;
            m.stop();
            if(oMC.toMorse){//was morse to text, so switch!
                oMC.toMorse=false;elTar.innerHTML=oMC.innerHTML[0];
                document.querySelector('.morseTextInput').value = document.querySelector('.morseOutput').innerText;
                document.querySelector('.morseTextInput').placeholder = '- -.-- .--. . / ... --- -- . - .... .. -. --. / .. -. -.-.-- -.-.--';
                addEvent();//fakes an input and runs the string conversion function!
            }else{
                sText = document.querySelector('.morseOutput').innerText;
                oMC.toMorse=true;elTar.innerHTML=oMC.innerHTML[1];
                document.querySelector('.morseTextInput').value = sText;
                document.querySelector('.morseTextInput').placeholder = 'type something in!!';
                addEvent();//fakes an input and runs the string conversion function!
            };
          },true);
          morseSwitchInput.setAttribute('listener',true);
    };//ends morseSwitchInput




      var morseTextInput = document.querySelector('.morseTextInput');
      if (!morseTextInput.getAttribute('listener')){
          morseTextInput.addEventListener('input', function (event) {
            var elTar = event.target;
            //	console.log(oMC.toMorse,'<<in morseTextInput::',elTar.className);
              var inputValue = elTar.value.split("");
              var sspace = " ";
              if (!oMC.toMorse){inputValue = elTar.value.split(" ");sspace="";}

            var outputString = new Promise(function(resolve,reject){
              var output = '';
              inputValue.forEach((item) => {
        //  console.log(item,item.charCodeAt(),'<<inputValue::',returnNewValue({morse:oMC.toMorse,item:item}));
          //….-  …

                output += sspace + returnNewValue({morse:oMC.toMorse,item:removeSC(item)});
              });
              resolve(output);
              reject(false);
            });
            outputString.then((data)=>{
              //console.log(inputValue,'<<<in INPUT change!!!event::', event.target.value,data);
              document.querySelector('.morseOutput').innerHTML = data;
              return;
            });
          }, false);
          morseTextInput.setAttribute('listener',true);
    };



    var copyMorse = document.querySelector('.copyMorse');
    if (!copyMorse.getAttribute('listener')){
        copyMorse.addEventListener('click', function(event){
          //console.log(navigator,'<<in  copytoMorse;;',event.target.innerText);
          if (!oPage.islocal){
            if (device.platform.toLowerCase()==='ios') {
              window.plugins.socialsharing.share(event.target.innerText);
              }else{
              navigator.share(event.target.innerText);
            };
          };
          return;
        });
        copyMorse.setAttribute('listener',true);
    };


    const quotesLink = document.querySelector('.quotesLink')
      if (!quotesLink.getAttribute('listener')){
        quotesLink.addEventListener('click',function(){
          //console.log('in get quotes link');
          new Promise((resolve,reject)=>{
            resolve(fetchTenQuotes());
            reject(false);
          })
          .then((data)=>{
          //  console.log('fetchTenQuotes returns::',data);
            oMC.tenQuotes = data;
            drawTenQuotes();
          })
          .catch((error)=>{
            console.log('fetchTenQuotes error::',error);
          })
        });
        quotesLink.setAttribute('listener',true);
      }


      const quotesheader = document.querySelector('.quotesheader');
      if (!quotesheader.getAttribute('listener')){
        quotesheader.addEventListener('click',function(event){
        //console.log('quotesheader::',event);
        event.preventDefault();
          var el = document.querySelector('.quotesContainingHolder');
          var el2 = document.querySelector('.quotesLink');
          if (el){
            //if (el.style.display === 'none'){
            if (el.classList.contains('elHide')){
              $(quotesheader).removeClass('quotesclosed');
              $(el).slideDown('slow',function(){
              //  $(this).removeAttr('style');
                $(this).removeClass('elHide');
                $(this).addClass('elShow');

              });
              $(el2).fadeIn('slow',function(){
              //  $(this).removeAttr('style');
                $(this).removeClass('elHide');
                $(this).addClass('elShowi');
              });
            }else{
              $(el).slideUp('slow',function(){
              //  $(this).removeAttr('style');
                $(this).removeClass('elShow');
                $(this).addClass('elHide');
                $(quotesheader).addClass('quotesclosed');
              });
              $(el2).fadeOut('slow',function(){
              //  $(this).removeAttr('style');
                $(this).removeClass('elShowi');
                $(this).addClass('elHide');
                $(quotesheader).addClass('quotesclosed');
              });
            };
          //  divPlayerHol.classList.remove('elShow');
          //  divPlayerHol.classList.add('elHide');
          }
      },true);
      quotesheader.setAttribute('listener',true);
    };
    setUpPlayer();
    new Promise((resolve,reject)=>{
      resolve(fetchTenQuotes());
      reject(false);
    })
    .then((data)=>{
      //console.log('fetchTenQuotes returns::',data);
      oMC.tenQuotes = data;
      drawTenQuotes();
    })
    .catch((error)=>{
      console.log('fetchTenQuotes error::',error);
    });
    closeModal();
    return;
};

const fetchTenQuotes = function(){
    //console.log('in getTenQuotes;');
    const path = 'https://apiapi.monkeywithoutthee.com/getTenQuotes/58/'
      return window.fetch(path, {
      method: 'GET',
      headers: {'Accept': 'application/json','Content-Type': 'application/json','monkey':'1nth3suMMerth4su4alw4ys5hin3s'
      }
    })
  .then(response => response.json())
  .then(data => {
      //console.log('fetch getTenQuotes RETURN::', data);
      //[{id:"",title:'',body:'',score:0}]
      return data;
   })
   .catch(error => {
    //  toastSuccess("There was an error!");
      console.log("error::;", error);
      ons.notification.alert({message:error});
      return false;
   })
};
const drawTenQuotes = (()=>{
  //  console.log('drawTenQuotes IN::');
    var data = oMC.tenQuotes;
    //draw loop, truncate
    //sHTML
    var sHTML = '';
    for (var i = 0; i < data.length; i++) {
      sHTML += `<div class='quotesList'><span class='quotesListChild'>${data[i].quoteAuthor + '::' + data[i].quoteText.slice(0,15)+'...'}</span></div>`;
    };
    var o = document.querySelector('.quotesContaining');
    o.innerHTML = sHTML;
    setTimeout(()=>{
      o = document.querySelector('.quotesContainingHolder');
      $(o).slideDown('slow',function(){
        $(this).removeAttr('style');
        $(this).removeClass('elHide');
        $(this).addClass('elShow');
      });
      addTenQuoteListeners('quotesList');
    },200);
    return;

})
const addTenQuoteListeners = ((data)=>{
  //the tenQuote listeners
  var gp = document.querySelector('.quotesContaining');
  var o = document.querySelectorAll('.'+data);
  //var otwo = document.querySelectorAll('quotesListChild');
  //console.log(gp,o,'<<quotesListChild');
  o.forEach((item, i) => {

      if (!item.getAttribute('listener')){
          item.addEventListener('click', function(event){
          //  var gp = document.querySelector('.quotesContaining');
          var evTarget = event.target;
          if (evTarget.className === 'quotesListChild'){
            evTarget = event.target.parentElement;
          };
            m.stop();
            m.init();
            oMC.toMorse = true;
            var iClicked = Array.prototype.indexOf.call(gp.childNodes,evTarget);

            document.querySelector('.morseSwitchInput').innerHTML = oMC.innerHTML[1];
            makequoteMorse(iClicked);
          //  console.log(iClicked,m.getLength(),'<<quotesList clicked::',event.target,m);
        });
        item.setAttribute('listener',true);
      }
  });
  //return;
});
const makequoteMorse = function(data){
    //draw out quote as text
    document.querySelector('.morseTextInput').value = oMC.tenQuotes[data].quoteText + ' \n' + oMC.tenQuotes[data].quoteAuthor;
    var x = addEvent();
  //  if (x){
      setTimeout(()=>{
      var isInFav = isInFavs({morse:document.querySelector('.morseOutput').innerText});
    //  console.log(isInFav,'<<isInFav::',document.querySelector('.morseOutput').innerText);
        if(isInFav){
          document.querySelector('.addFavMorse').innerHTML = 'favorite';
        }else{
          document.querySelector('.addFavMorse').innerHTML = 'favorite_border';
        };
      },300);
  //  };
};
const addEvent = function(){
    //this "fakes" an input event
    var event = document.createEvent('Event');
    event.initEvent('input', true, true);
      //  console.log(event.initEvent('input', true, true),'<<addEvent::',document.querySelector('.morseTextInput').dispatchEvent(event));
    return document.querySelector('.morseTextInput').dispatchEvent(event);
};
 const isInFavs = ((data)=>{
    var a = oMC.favMorse;
    var retVal = false;
    if (a){
      for (var i = 0; i < a.length; i++) {
      //console.log(a[i].morse,'<<conpaning::',data.morse)
        if (a[i].morse == data.morse){
          retVal = true;
          break;
        }
      }
    }
    return retVal;
 });


 const listFaveMorse=(()=>{
   var aLists=oMC.favMorse;
   console.log('listFaveMorse::',aLists);
   var o=document.getElementById("listFaveMorse");
   if (o){
     o.show().then(()=>{
      // drawFavesLists({data:aLists});
        drawFavesMorseLists({data:aLists});
      })
    }
 //	console.log(o,'<<listFaveJokes');
 });


 const drawFavesMorseLists=((data)=>{
     var aLists=data.data;
     var o = document.querySelector('.divListFaveMorse');
    // o.style.display='none';
     o.innerHTML = "";
   	//console.log(screen,'<<drawFavesMorseLists::',aLists);
     if (aLists){
     //	console.log('IN IT');
       aLists.forEach((item, i) => {
         var newStr = '';
         var sItem = item.morse.split(" ");//here here here
         sItem.forEach((itemin) => {newStr += returnNewValue({morse:false,item:removeSC(itemin)});});
         var createEl = document.createElement('ons-button');
         createEl.classList.add('listOfMorseRow');
         createEl.innerHTML = newStr.slice(0,30)+'...';
         o.append(createEl);

         if (!createEl.getAttribute('listener')){
         createEl.addEventListener('click',function(event){
           //note, this data is saved as morse and needs translating back to text!
          oMC.toMorse = false;
           const row = Array.prototype.indexOf.call(event.target.parentElement.childNodes,event.target);
           const ar = oMC.favMorse[row].morse;
           document.querySelector('.addFavMorse').innerHTML = 'favorite';//is on faves list so no need to question!

           document.querySelector('.morseSwitchInput').innerHTML = oMC.innerHTML[0];
           document.querySelector('.morseTextInput').value = ar;
           var x = addEvent();
           if (x){
             var o=document.getElementById("listFaveMorse");
             m.stop();
             if (o){o.hide();};
           };
        //   console.log(row,ar,'<<createEl clicked');
         });
         createEl.setAttribute('listener',true);
       };
       });
     };
     o.style.maxHeight=oPage.screen.height-300+'px';
     $(o).slideDown('slow',function(){
       $(this).removeAttr('style');
       $(this).removeClass('elHide');
       $(this).addClass('elShow');
     });
 });

 const returnNewValue = ((data)=>{
   var returnValue = '';
   for (var i = 0; i < dataset.length; i++) {
     if (data.morse&&dataset[i].char.toLowerCase()===data.item.toLowerCase()){
       returnValue = dataset[i].res;
       break;
     };
     if (!data.morse&&dataset[i].res.toLowerCase()===data.item.toLowerCase()){
       //console.log(data.morse,' morse to text::',dataset[i].res,data.item)
       returnValue = dataset[i].char;
       break;
     };
   };
  //console.log(returnValue,'<<returnNewValue::',data);
   return returnValue;
 });
 const removeMorseFromFaves = ((data)=>{
   var ar = oMC.favMorse;
   var nar = [];
    for (var i = 0; i < ar.length; i++) {
      if(ar[i].morse !== data.morse){
        nar.push(ar[i]);
      };
    };
    //console.log(ar,'<<removeMorseFromFaves::',nar);
    oMC.favMorse = nar;
    setLocal('oMC',oMC);
    return;
 });

const removeSC = ((data)=>{
  //item.replaceAll('—','--').replaceAll('…','...') -
  //this is used because mac os replaces them as they look nicer on the screen.
  //Need placing back! ANy other that turn up can be added here!
  //console.log('removeSC::',data)
  var returndata = data;//android and desktop
  if (!oPage.islocal&&device.platform.toLowerCase()==='ios'){
    //returndata = data.replaceAll('—','--').replaceAll('…','...');//IOS
    returndata = data.replace(/\—/g,'--').replace(/\…/g,'...');
  };
  return returndata;
});

const setUpPlayer = (()=>{

  //  console.log('m loaded?::',m);

//  divPlayerHol.style.display = 'none';
  //  if (!m){
    m = new jscw({"wpm": 25, "freq": 600});
      m.renderPlayer('player', m);
  //  };
      m.onPlay = function () {
        var texttoPlay = document.querySelector('.morseTextInput').value;
        if (!oMC.toMorse){
          texttoPlay = document.querySelector('.morseOutput').innerText;
        };
        m.setText(texttoPlay);
      };
      m.el.style.width = 'unset';
        m.el.style.padding = '3px';
        m.el.style.boxShadow = '1px 1px 20px 0px rgb(0, 0, 0) inset';
        m.el.style.margin = '10px';
        m.el.style.borderStyle = 'solid';
        m.el.style.borderWidth = '0.5px';
      //  m.el.childNodes[3].style.display = 'none';
        m.el.childNodes[3].classList.add('elHide')
        m.el.childNodes[4].childNodes[0].style.left='-150px';
        m.el.childNodes[4].childNodes[0].style.backgroundColor = 'rgba(25, 25, 25, 0.9)';
        m.el.childNodes[4].childNodes[0].style.color = '#fafafa';
        var ndiv = document.createElement('div');
        ndiv.classList.add('loolinkholder');
        ndiv.innerHTML = `<div class='loopLink'>loop</div>`;
        m.el.appendChild(ndiv);
        m.onFinished = function(){console.log(m.inloop,'<<in onFinished::');
        if (m.inloop){
          setTimeout(()=>{
            m.play();
          },300);
        };
      };
      m.init();
      var divPlayerHol = document.querySelector('.playerHolder');
      $(divPlayerHol).slideDown('slow',function(){
        $(this).removeAttr('style');
        $(this).removeClass('elHide');
        $(this).addClass('elShow');
      });
    //  m.play('peace');
    //	console.log(m,'<<player::',m.el.style.width);

})


  const redrawFavesMorseLists=((data)=>{
    //data = {search:''};
    var aLists=oMC.favMorse;
    var o = document.querySelector('.divListFaveMorse');
    //console.log(oMC.favMorse,'<<divListFaveMorse::',data);
   // o.style.display='none';
    o.innerHTML = "";
  //	console.log(screen,'<<drawFavesMorseLists::',aLists);
    if (aLists){
    //	console.log('IN IT');
      aLists.forEach((item, i) => {
        var newStr = '';
        var sItem = item.morse.split(" ");//here here here
        sItem.forEach((itemin) => {newStr += returnNewValue({morse:false,item:removeSC(itemin)});});//here here here is the decoder

        var hidden = 'elHide';
        if (newStr.toLowerCase().indexOf(data.search.toLowerCase())!==-1){hidden=''};
        var createEl = document.createElement('ons-button');
        createEl.classList.add('listOfMorseRow');
        if (hidden!==''){createEl.classList.add(hidden);};
        createEl.innerHTML = newStr.slice(0,30)+'...';
        o.append(createEl);
        if (!createEl.getAttribute('listener')){
        createEl.addEventListener('click',function(event){
          //note, this data is saved as morse and needs translating back to text!
         oMC.toMorse = false;
          const row = Array.prototype.indexOf.call(event.target.parentElement.childNodes,event.target);
          const ar = oMC.favMorse[row].morse;
          document.querySelector('.addFavMorse').innerHTML = 'favorite';//is on faves list so no need to question!

          document.querySelector('.morseSwitchInput').innerHTML = oMC.innerHTML[0];
          document.querySelector('.morseTextInput').value = ar;
          var x = addEvent();
          if (x){
            var o=document.getElementById("listFaveMorse");
            m.stop();
            if (o){o.hide();};
          };
       //   console.log(row,ar,'<<createEl clicked');
        });
        createEl.setAttribute('listener',true);
      };
      });
    };
      $(o).slideDown('slow');
});
