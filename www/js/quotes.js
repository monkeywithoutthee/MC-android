//quotes page
'use strict';

var oQuotes = {returns:[]
  ,lastviewed:-1
  ,lastviewtxt:'peace'
  ,faveQuotes:[]
};


    const quotes = (()=>{
      //console.log('in quotes');
      const el = document.querySelector('.getQuoteFrom');
      if (el){el.children[0].value = oQuotes.lastviewtxt; el.children[0].blur();};
        new Promise(function(resolve, reject) {
          resolve(gofetchquotes({search:el.value}));
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
        })
    });
    const gofetchquotes = function(data){
      //data = {search:''}
      //console.log(data,'<<gofetchquotes::',data.search);
        const path = 'https://apiapi.monkeywithoutthee.com/getQuoteFrom/58/'
          return window.fetch(path, {
          method: 'POST',
          headers: {'Accept': 'application/json','Content-Type': 'application/json','monkey':'1nth3suMMerth4su4alw4ys5hin3s'
          },
          body: JSON.stringify({text:data.search,fetchType:2})
        })
      .then(response => response.json())
      .then(data => {
          //console.log('fetch getQuotes RETURN::', data);
          return data;
       })
       .catch(error => {
        //  toastSuccess("There was an error!");
          console.log("error::;", error);
          ons.notification.alert({message:error});
          return false;
       })
    };
    const drawQuotes = ((data)=>{
      //data = {highlight:'',row:-1}
      //  console.log('drawQuotes IN::');
        const aa = oQuotes.returns;
        //draw loop, truncate
        //sHTML
        var sHTML = '';
        for (var i = 0; i < aa.length; i++) {
          var quoteAuthor = aa[i].quoteAuthor;
          if (aa[i].quoteAuthor===''){quoteAuthor = 'unknown';};
          var quoteAuthorString = quoteAuthor;
          var quoteTextString = aa[i].quoteText;
          if (data.highlight.length>0){
          //  quoteAuthorString=returnStringWithHi({checkThis:quoteAuthorString,highlight:data.highlight});
          //  quoteTextString=returnStringWithHi({checkThis:quoteTextString,highlight:data.highlight});
          };
          const trunk = (()=>{if (ons.orientation.isLandscape()){return oPage.truncate.land;}else{return oPage.truncate.port}})();
          const hl = (()=>{if(i===0&&data.row>-1){return 'touchOver'}else{return ''}});
          sHTML += `<div class='quotessearchList noPull ${hl()}'><span class='quotessearchListChild noPull'>${quoteAuthorString+ '::' + quoteTextString}</span></div>`;
        };
        var o = document.querySelector('.quotesRS');
        o.innerHTML = sHTML;
          $(o).slideDown('slow',function(){
            $(this).removeAttr('style');
            $(this).removeClass('elHide');
            $(this).addClass('elShow');
          });
        return true;

    });

  const drawinquote = ((data)=>{
    //data = {row:123,highlight:'',faves:bool}
    oQuotes.lastviewed = data.row;
    const d = (()=>{
      if (data.faves){return oQuotes.faveQuotes[data.row];}else{return oQuotes.returns[data.row];};
    })();
    const o = document.querySelector('.quotesCardContent');
    const author = (()=>{if (d.quoteAuthor.length>0){return d.quoteAuthor}else{return 'unknown'}})();

    //returnStringWithHi({checkThis:author,highlight:oQuotes.lastviewtxt})
  //  console.log(o,o.className.includes('elHide'),'<<drawinquote::',d);
  var quoteAuthorString = d.quoteAuthor;
  var quoteTextString = d.quoteText;
  if (data.highlight.length>0){
    quoteAuthorString=returnStringWithHi({checkThis:d.quoteAuthor,highlight:data.highlight});
    quoteTextString=returnStringWithHi({checkThis:d.quoteText,highlight:data.highlight});
  };
  if (quoteAuthorString.length===0){quoteAuthorString = 'unknown';};
    const favs = `<div class='addFavQuotePar noPull blockhanded'><span class='material-icons addFavQuote noPull blockhanded ${oPage.usrsettings.rhanded ? 'righthanded' : 'lefthanded'}'>${isInFaveQuotes(d)}</span></div>`
    const txttogo = `<div class='quoteHeader noPull copyToChild'>author::${quoteAuthorString}</div><div class='quoteText noPull copyToChild'>${quoteTextString}</div>`;
    if (o.className.includes('elHide')) {
      if (o){o.innerHTML = `${favs}${txttogo}`;};
      $(o).slideDown('slow',function(){
        $(this).removeAttr('style');
        $(this).removeClass('elHide');
        $(this).addClass('elShow');
      });
    }else{
      $(o.children[0]).fadeOut('fast',function(){
        if (o){o.innerHTML = `${favs}${txttogo}`;};
        $(this).removeAttr('style');
        $(this).removeClass('elHide');
        $(o.children[0]).fadeIn('slow',function(){
          $(this).addClass('elShow');
        });
      });
      $(o.children[1]).fadeOut('fast',function(){
        if (o){o.innerHTML = `${favs}${txttogo}`;};
        $(this).removeAttr('style');
        $(this).removeClass('elHide');
        $(o.children[1]).fadeIn('slow',function(){
          $(this).addClass('elShow');
        });
      });
    };
  });


  var addRemoveFavQuote=(()=>{
      const d =  oQuotes.returns[oQuotes.lastviewed];
    //  console.log(d,'<<addRemoveFavQuote::',e,document.querySelector('.addFavQuote').innerHTML);
      const el = document.querySelector('.addFavQuote');
      if (el.innerHTML==='favorite_border'){
      var o = oQuotes.faveQuotes;
      if (!o){o=[]};//
      o.unshift(d);
      oQuotes.faveQuotes=o;
      setLocal('faveQuotes',o);
      ons.notification.toast('quote added favourites .', oPage.toastOptions);
    //	console.log(o,' in addFavQuotes myquotes;;',getLocal('faveQuotes'));
    }else{
      //remove from array and redraw
      removeFromFaveQuotes(d);
      ons.notification.toast('quote removed from favourites .', oPage.toastOptions);
    };
    el.innerHTML = isInFaveQuotes(d);
  });

  var removeFromFaveQuotes=((data)=>{
		var a = oQuotes.faveQuotes;
		var aa=[]
		a.forEach((item, i) => {
			if (item.quoteText !== data.quoteText&&item.quoteAuthor !== data.quoteAuthor){
				aa.push(item);
			};
		});
    oQuotes.faveQuotes=aa;
  //  console.log(oQuotes.faveQuote,'<<removeFromFaves::',data);
    setLocal('faveQuotes',oQuotes.faveQuotes);
  });

  var isInFaveQuotes=((data)=>{
    var o = oQuotes.faveQuotes;
		var ret ='favorite_border';
    if (!o){console.log('in null');o=[]};
		// /console.log('is in faveQuotes::',data,o);
    for (var i = 0; i < o.length; i++) {
        if (o[i].quoteText === data.quoteText&&o[i].quoteAuthor === data.quoteAuthor){
          ret = 'favorite';
        };
    };
    return ret;
      //document.querySelector('.material-icons addFavJoke').innerHTML='favorite';
  });

  var listFaveQuotes=((data)=>{
    //data = {search:''};
    const aLists=oQuotes.faveQuotes;
    //console.log(data,'<<listFaveQuotes::',aLists);
		var o=document.getElementById("listFaveQuotes");
		if (o){o.show().then(()=>{drawFavesQuoteLists({data:aLists,search:data.search});});
  };
	//	console.log(o,'<<listFaveJokes');
	});

  const drawFavesQuoteLists=((data)=>{
    //{data:aLists,search:''}
      var aLists=data.data;
      var o = document.querySelector('.divListFaveQuotes');
      //o.style.display='none';
      //console.log(o,'<<drawFavesQuoteLists::',aLists,data);
      //if(!aLists){aLists=[];};
      oQuotes.faveQuotes=aLists;
      var sHTML='You Have No Fave Quotes';
      if (aLists){
      //	console.log('IN IT');
        sHTML='';
        aLists.forEach((item, i) => {
          var hidden = ' hiddenClass';
          //quoteAuthor
          if ((item.quoteText.toLowerCase().indexOf(data.search.toLowerCase())!==-1)
          || (item.quoteAuthor.toLowerCase().indexOf(data.search.toLowerCase())!==-1)){hidden=''};
          sHTML +=`<ons-button class='listOfQuotesRow${hidden}'>${item.quoteAuthor.slice(0,10)+'...'} ${item.quoteText.slice(0,20)+'...'}</ons-button>`;
        });
      };
    //  setTimeout(function () {
        o.innerHTML=sHTML;
      //}, 1000);
      o.style.maxHeight=oPage.screen.height-300+'px';
      $(o).slideDown('slow');
  });


  const redrawFavesQuoteLists=((data)=>{
    //{search:''}
			var aLists=oQuotes.faveQuotes;
      var o = document.querySelector('.divListFaveQuotes');
			//console.log(o,'<<redrawFavesLists::',aLists,data);
			var sHTML=`You Have No Fave quotes containing ${data.search}`;
			if (aLists){
				sHTML='';
				aLists.forEach((item, i) => {
        //  console.log(item.quoteAuthor,item.quoteAuthor.toLowerCase().indexOf(data.search.toLowerCase()),'<<items::',item.quoteText,item.quoteText.toLowerCase().indexOf(data.search.toLowerCase()));
          var hidden = ' elHide';
          if ((item.quoteAuthor.toLowerCase().indexOf(data.search.toLowerCase())!==-1)
          || (item.quoteText.toLowerCase().indexOf(data.search.toLowerCase())!==-1)){hidden=''};
					sHTML +=`<ons-button class='listOfQuotesRow${hidden}'>${item.quoteAuthor.slice(0,10)+'...'} ${item.quoteText.slice(0,20)+'...'}</ons-button>`;
  			});
			};
			o.innerHTML=sHTML;
	});

  const fetchanddrawquote = (()=>{

    new Promise(function(resolve, reject) {
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
    })
  })

  function clearQuoteHighlights(data){
    var a = document.querySelectorAll('.'+data)
    a.forEach((item, i) => {
      item.classList.remove('touchOver');
    });
    //console.log('removed lighlights');
  };
