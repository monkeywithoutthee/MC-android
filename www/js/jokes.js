'use strict';
const fetchJoke = function(){
  showModal(4);
    console.log('in fetchJoke;');
		const path = 'https://apiapi.monkeywithoutthee.com/getJoke/58/'
      return window.fetch(path, {
      method: 'GET',
      headers: {'Accept': 'application/json','Content-Type': 'application/json','monkey':'Sp00tMu7e4u4u7e'
      }
    })
  .then(response => response.json())
  .then(data => {
      //console.log('fetch joke RETURN::', data);
			//[{id:"",title:'',body:'',score:0}]
      drawJoke({joke:data[0],highlight:''});
      closeModal();
   })
   .catch(error => {
    //  toastSuccess("There was an error!");
      closeModal();
      console.log("error::;", error);
      ons.notification.alert({message:error});
      return false;
   })
};
const getJokeFrom = function(){
  showModal(4);

	const el=document.querySelector('.searchJokeTxt');

	if (el._input.value==''){
		closeModal();
		ons.notification.alert({message:'Please enter something!',top:el.getClientRects()[0].top}).then(()=>{el._input.focus();});
		return false;
	};

	const o={text:stripSC(el._input.value)};
	//	console.log(ons.notification,el._input.value,'<<in getJokeFrom::',o);

		const path = 'https://apiapi.monkeywithoutthee.com/getJokeFrom/58/'
      return window.fetch(path, {
      method: 'POST',
      headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
        'monkey':'Sp00tMu7e4u4u7e'
      },
			body:JSON.stringify(o)
    })
  .then(response => response.json())
  .then(data => {
      //console.log('getJokeFrom RETURN::', data);
			//[{id:"",title:'',body:'',score:0}]
      el._input.blur()
      drawJoke({joke:data[0],highlight:o.text});
      closeModal();
      showhidetoolbars();
   })
   .catch(error => {
    //  toastSuccess("There was an error!");
      closeModal();
      console.log("error::;", error);
      ons.notification.alert({message:error});
      return false;
   })
};
//

var drawJoke = function(data){
	//data={joke:data[0],highlight:''}
	//console.log('in drawJoke::',data.highlight,data);

  var playerOptions = document.getElementById('divSquareCard')

//  $(".squareCardContent").each(function() {//clears all other divs in the div
    //  $(this).css('display','none');
//  });

  var sHTML = '';
  var sJokeType = '';//floor in th e plan
  //using regedit, find forst on, cut off all before, add to tmpStringTo, add span add compare string, ad close Span
    //then keep doing it until tmpStringFrom = -1, add remainder to tmpStringTo


  //{checkThis:tmpStringFrom,highlight:data.highlight}

	var sJokeTitleString=data.joke.title;
	var sJokeBodyString=data.joke.body;
  if (data.highlight.length>0){
    sJokeTitleString=returnStringWithHi({checkThis:data.joke.title,highlight:data.highlight});
    sJokeBodyString=returnStringWithHi({checkThis:data.joke.body,highlight:data.highlight});
  };
  //console.log('sJokeTitleString::',sJokeTitleString,'   sJokeBodyString::',sJokeBodyString);

  sHTML += `<div class='copyToParent noPull'><p class='noPull copyToChild'>${sJokeTitleString}</p><p class='noPull copyToChild'>${sJokeBodyString}</p></div>`;

  var oJoke = document.querySelector('.jokeDisp');//editable
      oJoke.innerHTML  = sHTML;
			$('.squareCardContent').fadeIn('fast');
			isInFaves(data.joke);
			setLocal('lastJoke',data.joke);
      //console.log('drawJoke END title:', sJokeTitleString,data.joke.title ,' body:', sJokeBodyString,data.joke.body);
  	  closeModal();
};
  function returnStringWithHi(string){
    //console.log('returnStringWithHi::',string,string.highlight.length);
    var tmpStringFrom=string.checkThis;
    var tmpStringTo = '';
    while(tmpStringFrom.length>=0){
        const x = tmpStringFrom.toLowerCase().match(string.highlight.toLowerCase());
        if(x){
          tmpStringTo+=tmpStringFrom.slice(0,x.index);//adds old to new
          tmpStringFrom=tmpStringFrom.substring(x.index);//removes from old
          const scut=tmpStringFrom.slice(0,string.highlight.length);//cuts the high;lighted cut
          tmpStringTo+=`<span class='textHighlist'>${scut}</span>`;//adding  cut to new
          tmpStringFrom=tmpStringFrom.substring(scut.length);//removing cut from old
        //  console.log(tmpStringFrom.length,string.highlight.length,'<<<HAS MATCH highlight::',string.highlight,'tmpStringFrom::',tmpStringFrom,'<<tmpStringLoop::',x,tmpStringTo,' checkThis::',string.checkThis);
        }else{
          tmpStringTo+=tmpStringFrom;
          tmpStringFrom='';
          //console.log('HAS MATCH END:::',tmpStringTo,tmpStringFrom,x);
        };
        //console.log(tmpStringFrom,'<<tmpStringFrom MATCH END:',tmpStringTo);
        if(tmpStringFrom.length===0){
          return tmpStringTo;
        };
    };
  };
var closeJoke = function(id) {

};


  function newJokeAS(){
    console.log('in newJokeAS');
      closeJoke();
      var oEl = document.querySelector('.action-sheet');
      $('.action-sheet-title').html('Submit New Joke');
    //  console.log('action sheet::', oEl);
      oEl.children[0].innerHTML = 'Submit New Joke';
      asheet.showFromTemplate();
      drawNJoke(0);
  }

  function drawNJoke(type){
    //type - zero = single, else = twopart
    var sHTML = '';
    sHTML += `<div class='newJokeHolder'>
									<div class='newJokeDDs'>Title</div>
                      <div class='textCenter'><textarea id='newJokeSetup' class='textarea canResize txtAreaWide'></textarea></div>
                      <div  class='newJokeDDs'>Joke</div>
                      <div class='textCenter'><textarea id='newJokeDelivery' class='textarea canResize txtAreaWide2'></textarea></div>
              </div>
              <ons-button class='button sendNewJoke' modifier='outline'>Submit Joke</ons-button>`
              document.querySelector('.actionContent').innerHTML = sHTML;
							//look at append instead of innerHTML here here here
              console.log('new joke drawn');
  };

  function sendNewJoke(){
    const setUp = document.getElementById('newJokeSetup');
    const deliv = document.getElementById('newJokeDelivery');
    var oNewJoke = {id:null,title:rSC(setUp.value),body:rSC(deliv.value),score:0};

    //console.log(' iDelivery   - - obj to send::', oNewJoke);
      //validation
        if (oNewJoke.title==='') {
          //{message:'Please enter a title! (it could be the first line of the title)',top:el.getClientRects()[0].top})
          ons.notification.alert({message:'Please enter a title! (it could be the first line of the title)',top:setUp.getClientRects()[0].top}).then(function() { setUp.focus() });
          return false;
        }
        if (oNewJoke.body === '') {
          //
          ons.notification.alert({message:'Please enter your delivery!',top:deliv.getClientRects()[0].top}).then(function() { document.getElementById('newJokeDelivery').focus() });
          return false;
        };
        sendJoke(oNewJoke);
  }
  function sendJoke(joke) {
  //ensure validation is Complete
//  showModal(2, ' sending to server...')

	var path = 'https://apiapi.monkeywithoutthee.com/sendJoke/28/'
	console.log('joke sending::',joke);
	//return false;
	return window.fetch(path, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'monKey':'zi44pit5zi44pit5zi44pit5zi44pit5'
				},
				body: JSON.stringify(joke)
			})
		.then(response=>response.json())
		.then(data=>{
			//console.log('send new joke::', data);
      asheet.hideFromTemplate();
      toastSuccess('Your joke has been sent for consideration!');
		 })
		 .catch(error => {
			//  toastSuccess("There was an error!");
				closeModal();
				console.log("error::;", error);
        ons.notification.alert({message:error});
        return false;
		 })

  }
  function changeType(){
    var row = document.getElementById('njDelivery').selectedIndex;
  //  console.log('i change type::', row);
    if (row === 1) {
      drawNJoke(1);
    } else {
      drawNJoke(0);
    }
  }

	var getSavedJokeCount=(()=>{
		var a =oPage.faveJokes;
		if (!a){
			a=[];
		}
		return a.length;
	});

	var isInFaves=((data)=>{
    var o = oPage.faveJokes;
		var el=document.querySelector('.addFavJoke');
		el.innerHTML='favorite_border';
    if (!o){console.log('in null');o=[]};
		//console.log('is in faves::',data,o);
			o.forEach((item, i)=>{
				if (item.iid===data.iid){
					el.innerHTML='favorite';
					return false;
				}
			});
      //document.querySelector('.material-icons addFavJoke').innerHTML='favorite';
  });
	var removeFromFaves=((data)=>{
		//console.log('removeFromFaves::',data);
		var a = oPage.faveJokes;
		var aa=[]
		a.forEach((item, i) => {
			if (item.iid!==data.iid){
				aa.push(item);
			}
		});
		document.querySelector('.addFavJoke').innerHTML='favorite_border'
		oPage.faveJokes=aa;
		setLocal('faveJokes',aa);
	})



	var listFaveJokes=((data)=>{
    //data = {search:''};
    const aLists=oPage.faveJokes;
    //console.log(data,'<<listFaveJokes::',aLists);
		var o=document.getElementById("listFaveJokes");

		if (o){
		o.show().then(()=>{drawFavesLists({data:aLists,search:data.search});});
  };
	//	console.log(o,'<<listFaveJokes');
	});


	var drawFavesLists=((data)=>{
    //{data:aLists,search:''}
			var aLists=data.data;
      var o = document.querySelector('.divListFaveJokes');
      //o.style.display='none';
			console.log(o,'<<drawFavesLists::',aLists,data);
			//if(!aLists){aLists=[];};
			oPage.faveJokes=aLists;
			var sHTML='You Have No Fave Jokes';
			if (aLists){
			//	console.log('IN IT');
				sHTML='';
				aLists.forEach((item, i) => {
          var hidden = ' elHide';
          if ((item.title.toLowerCase().indexOf(data.search.toLowerCase())!==-1)
          || (item.body.toLowerCase().indexOf(data.search.toLowerCase())!==-1)){hidden=''};
					sHTML +=`<ons-button class='listOfJokesRow row_${i}' ${hidden}>${item.title}</ons-button>`;
					//<ons-button class='listOfJokesRowDel'><span class='material-icons deleteJoke_${i} listOfJokesRowDel'>delete</span></ons-button>
				});
			};
    //  setTimeout(function () {
        o.innerHTML=sHTML;
      //}, 1000);

      o.style.maxHeight=oPage.screen.height-300+'px';
      $(o).slideDown('slow');
	});


  var redrawFavesLists=((data)=>{
    //{search:''}
			var aLists=oPage.faveJokes;
      var o = document.querySelector('.divListFaveJokes');
			//console.log(screen,o,'<<redrawFavesLists::',aLists,data);
			var sHTML=`You Have No Fave Jokes containing ${data.search}`;
			if (aLists){
				sHTML='';
				aLists.forEach((item, i) => {
          var hidden = ' elHide';
          if ((item.title.toLowerCase().indexOf(data.search.toLowerCase())!==-1)
          || (item.body.toLowerCase().indexOf(data.search.toLowerCase())!==-1)){hidden=''};
          //console.log(item,'<<redrawFavesLists::');
					sHTML +=`<ons-button class='listOfJokesRow row_${i}${hidden}'>${item.title}</ons-button>`;
					//<ons-button class='listOfJokesRowDel'><span class='material-icons deleteJoke_${i} listOfJokesRowDel'>delete</span></ons-button>
  			});
			};
			o.innerHTML=sHTML;
	});


	var addRemoveFavJoke=(()=>{
			var addorremove = document.querySelector('.addFavJoke').innerHTML; //favorite_border
			var oLastJoke=getLocal('lastJoke');
			if (addorremove==='favorite_border'){
			var o = oPage.faveJokes;//note to self = work into onject and just use local minimal
		//	console.log('oLastJoke::',oLastJoke);
			if (!o){o=[]};//
			o.unshift(oLastJoke);
			oPage.faveJokes=o;
			setLocal('faveJokes',o);
			isInFaves(oLastJoke);
      ons.notification.toast('Joke added favourites .', oPage.toastOptions);
		//	console.log(o,' in addFavJoke myJokes;;',getLocal('faveJokes'),getLocal('lastJoke'));
		}else{
			//remove from array and redraw
			removeFromFaves(oLastJoke);
      ons.notification.toast('Joke removed from favourites .', oPage.toastOptions);
		};
	});

	function stripSC(data){
	//the objective it to replace any special characters which might conflict with JS within a string
	//console.log('rsc receiving::',data);
		data=data.replace(/\’/g,'')
			.replace(/\‘/g,'')
			.replace(/\”/g,'')
			.replace(/\“/g,'')
			.replace(/\"/g,'')
			.replace(/\'/g,'')
			.replace(/\•/g,'')
			.replace(/\¥/g,'')
			.replace(/\€/g,'')
			.replace(/\£/g,'')
			.replace(/\`/g,'')
      .replace(/\—/g,'')
      .replace(/\…/g,'');
	//  console.log('rsc returning::',data);
		return data;
};
function rSC(data){
	//the objective it to replace any special characters which might conflict with JS within a string
	//console.log('rsc receiving::',data);
		data=data.replace(/\’/g,"&apos;")
			.replace(/\‘/g,"&apos;")
			.replace(/\”/g,"&prime;")
			.replace(/\“/g,"&prime;")
			.replace(/\"/g,"&prime;")
			.replace(/\'/g,"&apos;")
			.replace(/\•/g,"&bull;")
			.replace(/\¥/g,"&yen;")
			.replace(/\€/g,"&euro;")
			.replace(/\£/g,"&pound;")
			.replace(/\`/g,"&grave;");

	//  console.log('rsc returning::',data);
		return data;
};
