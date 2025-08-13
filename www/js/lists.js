'use strict';

const sl = window.localStorage;
    //  sl.clear();//be very very careful with this!! it wipes everything. Never ever put it live!!
  const oPage = {
    islocal:isLocal,
    aLists:null,
    activeListRow:-1,
    activeListListRow:-1,
    highlightListRow:-1,
    startPoint:0,
    lastStartPoint:0,
    lastRowClicked:-1,
    iPageLoopSize:0,
    maxBlock2Dispay:20,
    blockAmounts:[5,10,20,50,'all'],
    blockSelected:2,
    truncate:{land:80,port:30},
    aPages:[{page:'home',usesPage:'home.html',title:'Monkys Compendium',about:'<b>MONKYS COMPENDIUM</b><br>lists, jokes, 10 game challenge and morse!<br>PRESS - HOLD - PULL - SHAKE!',pullMessage:{initial:'view features',preaction:'view features',action:'viewing next feature',homeSummary:['fun app, personal lists, jokes, morse code and more to come!','lists, lists, lovely lists. Create new lists or edit the examples!','jokes, over a quarter of a million','ten game challenge, couldnt be easier!',' .-.. --- ...- . --..-- / .--. . .- -.-. . / .- -. -.. / ..- -. -.. . .-. ... - .- -. -.. .. -. --.','search for quotes that include..-','how does it work!!??']}}
    ,{page:'lists',usesPage:'lists.html',title:'Lists',about:'<b>LISTS:</b> A versatile list maker, secret lists, things to do lists, shopping lists, bucket lists, want lists, any lists!!',pullMessage:{initial:'move to next set of records',preaction:'moving to next set of records',action:'moving to . ..'}}
    ,{page:'jokes',usesPage:'jokes.html',title:'Jokes',about:'<b>A LUCKY-DIP OF JOKES:</b> As many as you like but only 1 at a time from our searchable joke database!',pullMessage:{initial:'add/remove from favourites',preaction:'add/remove from favourites',action:'adding/removing from favourite jokes'}}
    ,{page:'square',usesPage:'square.html',title:'Games',about:'<b>SQUARES:</b> tic-tac-toe. Play against the machine or if feeling lucky take the ten game unbeaten challenge!',pullMessage:{initial:'start new game',preaction:'start new game',action:'starting new game'}}
    //,{page:'instruction',usesPage:'info.html',title:'User Guide',about:'<b>USER GUIDE:</b> on how to use the software on this app. Nothing sinister, press, hold, shake, pull!',pullMessage:{initial:'',preaction:'pull for action',action:'ation starting'}}
    ,{page:'morse',usesPage:'morse.html',title:'Morse',about:'<b>Morse Code Translator:</b> converts text to morse and morse to text!',pullMessage:{initial:'add/remove from favourites',preaction:'add/remove from favourites',action:'adding/removing from favourites  morse'}}
    ,{page:'quotes',usesPage:'quotes.html',title:'Quotes',about:'<b>Quotes Search:</b> search for quotes that include..-',pullMessage:{initial:'add/remove from favourites',preaction:'add/remove from favourites',action:'adding/removing from favourites quotes!'}}
    ,{page:'info',usesPage:'info.html',title:'About',about:'<b>USER GUIDE:</b> on how to use the software on this app. Nothing sinister, press, hold, shake, pull!',pullMessage:{initial:'pull for info',preaction:'pull for action',action:'action starting'}}],
    page:'home',
    homeView:0,
    pageTitle:'Monkys Compendium',
    showAll:false,
    showHiLi:false,
    viewAll:false,
    wasShowAll:false,
    reload:false,
    faveJokes:[],
    firstLoad:true,
    tmpArr:[],
    pop:{top:0,bottom:0,left:0,direction:'down',buffer:50},
    popRect:{},
    screen:{height:0,top:0,left:0,width:0},
    toastOptions:{timeout:2000,animation:'fall',top:100},
    usrsettings:{rhanded:true,shake:false}
  };

//aLists[{name:'ssss',notes:'ffff',row:int,listData:[]}]


    const doupdateListStuff = (()=>{
      const title=document.querySelector('.tedit_title')._input.value || '';

          if (title.length===0){
            ons.notification.alert({message:'Please enter a name for the item!'}).then(()=>{document.querySelector('.tedit_title')._input.focus();});
            return;
          }else{
          const notes=document.querySelector('.tedit_notes').value || '';
          oPage.aLists[oPage.activeListRow].listData[oPage.highlightListRow].item=title;
          oPage.aLists[oPage.activeListRow].listData[oPage.highlightListRow].notes=notes;
          const t = oPage.aLists[oPage.activeListRow].listData[oPage.highlightListRow];
          ons.notification.toast(`${t.item} edited in list ${oPage.aLists[oPage.activeListRow].name} .`, { timeout: 2000,animation:'fall' });
          setLocal('lists',oPage.aLists);
          //console.log(activeListRow,dataRow,'updateListBut::',title,notes);
          var el = document.getElementById('popover');
          el.hide();
          drawMainList({search:''});
        };
    });

const addnewliststuff = (()=>{

        const listName = document.querySelector('.nlistName').value;
        const listNotes = document.querySelector('.nListNotes').value;
        //  console.log(listName,'<<listButton',event.target,listNotes);
      if (listName.length<1){
        ons.notification.alert({message:'Please enter a name for your list'}).then(()=>{document.querySelector('.nlistName')._input.focus();})
        //document.querySelector('.nlistName')._input.focus();
        return false;
      }else{
        const aLists=getLocal('lists');
        var iCount = 1;
        if (!aLists){aLists=[]}else{iCount=aLists.length*1+1;}
        const aDate=new Date();
        const oList = {name:listName,notes:listNotes,row:iCount,listData:[],dateadded:aDate.toISOString()};
        aLists.unshift(oList);
        oPage.aLists=aLists;
        setLocal('lists',aLists);
        ons.notification.toast(`${oList.name} added as new list .`, oPage.toastOptions);
        document.querySelector('.nlistName')._input.value='';
        document.querySelector('.nListNotes')._input.value='';
        //console.log(getLocal('lists'),'<<do this');
        drawLists();
      };
});

const doaddemolist = ((e)=>{
      const bL = drawBigTestList();
      const l=getLocal('lists');
      l.unshift(bL);
      oPage.aLists=l;
      setLocal('lists',oPage.aLists);
      oPage.activeListRow=0;
    //  console.log(l,'<<BIG ARRAY::',bL,oPage.aLists);
    document.getElementById('usrSet') && document.getElementById('usrSet').hide();
    document.querySelector('#myNavigator').bringPageTop('lists.html')
    .then(()=>{
      oPage.pageTitle='lists';
      oPage.page='lists';
      document.getElementById('popover') && document.getElementById('popover').hide(e);
      drawMainList({search:''});
    });
      return;
});

const sortInitialLists = ((data)=>{
    //data = [] // an array of arrays
    var a = data;
    a.forEach((item, i) => {
    //  console.log(a[i].listData,'<<sorting:::',item,i);
      a[i].dateadded = new Date().toISOString();
      a[i].listData.forEach((itemj, j) => {
        a[i].listData[j].dateadded = new Date().toISOString();
      });

      a[i].listData = a[i].listData.sort(() => Math.random() - 0.5);
    });
  //  console.log(a,'<<returns');
    return a;
});

const addiniteiallists = ((e)=>{

    const a = sortInitialLists(initialList);
    const newlists = getLocal('lists');

    a.forEach((item, i) => {
      newlists.push(item);
    });
    oPage.aLists = newlists;
    setLocal('lists',oPage.aLists);

    document.getElementById('usrSet') && document.getElementById('usrSet').hide();
    document.querySelector('#myNavigator').bringPageTop('lists.html')
    .then(()=>{
      oPage.pageTitle='lists';
      oPage.page='lists';
      document.getElementById('popover') && document.getElementById('popover').hide(e);
      drawMainList({search:''});
    //  console.log(oPage.aLists,'<<addiniteiallists::',e);
    });
      return;
})
//we need an array of lists containing the list object
const doDBStuff = (()=>{

      if(getLocal('lists')){
        oPage.aLists=getLocal('lists');
      };
      if (oPage.aLists===null){
        //add the initial list
          const a = sortInitialLists(initialList);
        //  console.log(a,'<<initialList::',initialList);
          setLocal('lists',a);
          oPage.aLists=a;
      };
      if (oPage.activeListRow===-1){
        oPage.activeListRow=getLocal('activeList');
        if (!oPage.activeListRow){
          oPage.activeListRow=0;
        }
      };

      if (getLocal('settings')){
        oPage.maxBlock2Dispay=getLocal('settings').maxBlock2Dispay;
        oPage.blockSelected=getLocal('settings').blockSelected;
      };


//  console.log(oPage.activeListRow, '<<doDBStuff::',oPage.aLists);
});
var returnDateStriung=((dtDateAdded)=>{
  var strDateAdded = dtDateAdded.getDate() +
      '-' + dtDateAdded.getMonth() +
      '-' + dtDateAdded.getFullYear() +
      ' ' + dtDateAdded.getHours() +
      ':' + dtDateAdded.getMinutes();// +
      //':' + dtDateAdded.getSeconds();

  return strDateAdded;
})
var drawMainList=((data)=>{
//setLocal('settings',{maxBlock2Dispay:5});
        var sHTML = '';
        var olists = document.getElementById('mainList');
        var iTotal4Display = 0;//all of the records that fit (not hidden etc) within the recorset
        var totalItems = 0;
        var iLoopUntill = oPage.maxBlock2Dispay;
        //data.startNo is which set of records we are on
//{id:oPage.aLists[oPage.activeListRow].listData.length*1+1,item:'gloves',status:1,dataadded:new Date()};
        var iStartNumber = oPage.startPoint;
        if (iStartNumber > 0) {
            iLoopUntill = (iLoopUntill * (iStartNumber + 1));
        };
        var startNo = oPage.startPoint;
        //  console.log(oPage.startPoint,oPage.maxBlock2Dispay,'<<drawMainList::');
        startNo = (startNo * oPage.maxBlock2Dispay);
      //  console.log(iLoopUntill,oPage.activeListRow,' hhhhhh ',oPage.aLists);
        if (oPage.activeListRow===-1){oPage.activeListRow=0;};
        if(oPage.activeListRow>oPage.aLists.length-1){oPage.activeListRow=oPage.aLists.length-1}
        var loopList =[];
        if (oPage.aLists.length>0){
          loopList=oPage.aLists[oPage.activeListRow].listData;
        };
        var hiddenCount = returnhiddenCount(loopList);
        //console.log('loopList::',loopList);
        //console.log('hidden count::',hiddenCount,' oPage.startPoint::',oPage.startPoint,' oPage.activeListRow::',oPage.activeListRow,' iLoopUntill::',iLoopUntill,' startNo::',startNo);
    //    var sListTitle = 'You have made no lists yet';
        if (oPage.aLists.length>0){
          document.querySelector('.canedit_name').innerHTML=oPage.aLists[oPage.activeListRow].name;
          document.querySelector('.canedit_notes').innerHTML=oPage.aLists[oPage.activeListRow].notes;
        }else{
          document.querySelector('.canedit_name').innerHTML='You have made no lists yet';
          document.querySelector('.canedit_notes').innerHTML='';
        };

        for (var i = 0; i < loopList.length; i++) {
                //  console.log('drawList::',data.search,loopList[i].item,loopList[i].item.indexOf(data.search));
            if (!loopList[i].hidden&&!oPage.showAll||oPage.showAll) {//or oPage.search

              if(data.search===''||loopList[i].item.toLowerCase().indexOf(data.search.toLowerCase())!==-1||loopList[i].notes.toLowerCase().indexOf(data.search.toLowerCase())!==-1){
                if (oPage.showHiLi&&loopList[i].gotIt||!oPage.showHiLi){

                totalItems += 1;

                if (startNo <= iTotal4Display && iTotal4Display < iLoopUntill) {
                    const dtDateAdded = new Date(loopList[i].dateadded);
                    const strDateAdded = returnDateStriung(dtDateAdded);
                    var cgotIt = '';
                    var checkIcon = 'check'
                    if (loopList[i].gotIt){cgotIt=' cgotIt '; checkIcon='check_circle'};
                    var setVisibIcon = 'visibility'
                    var setoffViewClass='';
                    var highLightRow = '';
                    var touchoverRow = '';
                    //oPage.lastRowClicked;
                    if (i===oPage.highlightListRow){highLightRow=' hightLightRow';};
                    if (loopList[i].hidden){setVisibIcon='visibility_off';setoffViewClass='offViewClass';};
                    if(i===oPage.lastRowClicked){touchoverRow=' touchOver';};
                  //  console.log(loopList[i].gotIt,cgotIt,'<<to draw::',loopList[i]);
                  var sListHead = loopList[i].item;
                  //if (sListHead.length > 40){sListHead = sListHead.slice(0,40)+'...'}
                    sHTML += `<div class='${cgotIt+highLightRow+' mainListsRow_'+i+' noPull'+touchoverRow+' listBodyRow'}'>
                      <div class='listBodyRowHeader noPull'>
                        <div class='mainListsRow_${i} noPull wideandtop'>${sListHead}</div>
                        <div class='right noPull iconBlock'>
                          <div class='iconRow noPull'><span class='material-icons noPull checkIconClicked'>${checkIcon}</span></div>
                          <div class='iconRow noPull'><span class='material-icons ${setoffViewClass} noPull setVisibIconClicked'>${setVisibIcon}</span></div>
                        </div>
                        </div>

                        <div class='expandable-contentDIs editDisplay noPull'>
                          <div class='listContent'>
                            <span class=''>added:${strDateAdded}<br>notes: ${loopList[i].notes}</span>
                            </div>
                          </div>
                        </div>`;
                };
                    iTotal4Display += 1;
              };

            }

            }
        };
        //console.log(loopList,'<<loopList iTotal4Display::',iTotal4Display);
        //divive totl by oPage.maxBlock2Dispay to get the amount of loops
        var iLoopSize = Math.ceil(totalItems / oPage.maxBlock2Dispay);
        oPage.iPageLoopSize = iLoopSize;
        olists.innerHTML = sHTML;
    //  })
        putPaging({divName:'divPaging',loopSize:iLoopSize,maxBlock2Dispay:oPage.maxBlock2Dispay,totalItems:totalItems,istartNo:startNo,hiddenCount:hiddenCount});
        scrollElIntoView({row:oPage.highlightListRow});
        addNoPull({name:'.list-item__center'});
        addNoPull({name:'.list-item__right'});
        closeModal();
});
function addNoPull(data){
  //data={name:''}
  var o=document.querySelectorAll(data.name);
  o.forEach((item, i) => {
    item.classList.add('noPull');
  });

}
function scrollElIntoView(data){
  if (data.row>-1){
    //  console.log(data,'mainListsRow_'+data.row,'<<hightLightRow::',document.querySelector('.mainListsRow_'+data.row));
    setTimeout(function () {
      document.querySelector(".hightLightRow") && document.querySelector(".hightLightRow").scrollIntoView(false);
    }, 100);
  };
};
function putPaging(data) {
//raceives {divName:'divPaging',loopSize:loopSize,maxBlock2Dispay:oPage.maxBlock2Dispay,totalItems:totalItems,istartNo:startNo}
     //PagingClkd
     var classGotclicked = '';
     //console.log('divName=' + data.divName + ', loopSize=' + data.loopSize + ',maxBlock2Dispay=' + data.maxBlock2Dispay + ', totalItems' + data.totalItems + ', istart=' + data.istartNo);
    var hidCount = data.hiddenCount;
    if (oPage.showAll){hidCount=0;};
     var strDisplayText = `You have ${data.totalItems} (${hidCount}) items`;
     var sHTML = '';

     sHTML += `<div class='pagingHolder noPull'>
               <div class='PagingStyle PagingHeader noPull'>${strDisplayText}</div>`;
     // sHTML += "<div class=\"button--outline\">" + totalItems + " wishes</div>";
     for (var i = 0; i < data.loopSize; i++) {
         classGotclicked = '';
         const iPageMin = ((i * data.maxBlock2Dispay) + 1);
         var iPageMax = ((i + 1) * data.maxBlock2Dispay);
         if (iPageMax > data.totalItems) {
             iPageMax = data.totalItems;
         };
         if ((data.istartNo / data.maxBlock2Dispay) == i) {
             classGotclicked = 'PagingClkd';
         };
         sHTML += `<div class='pageClick_${i} PagingStyle ${classGotclicked} noPull'>${iPageMin}-${iPageMax}</div>`;
     }
     sHTML += `</div>`;
   //  console.log('looking for div ' + divName);
     document.getElementById(data.divName).innerHTML = sHTML;
 //    document.getElementById(divName + 'Bottom').innerHTML = sHTML;
 if (data.loopSize>0){scrollToThis();};

};
function scrollToThis(){
  var el = document.querySelector('.pagingHolder');
  var eltwo = document.querySelector('.PagingClkd');
//var scrollOffset = document.querySelector('.pagingHolder .PagingClkd').offsetTop - document.querySelector('.pagingHolder').offsetTop;
  //scrollHeight

//divPaging
  //we want to know where is the top of  '.PagingClkd' relitive to pagingHolder
  //and scroll pagingHolder by similar amount

  if(eltwo){
    el.scrollTo(0,eltwo.getBoundingClientRect().top-el.getBoundingClientRect().top-10);
  };
  //console.log(el.getBoundingClientRect().top,eltwo.getBoundingClientRect().top,'<<scrollToThis::',el,eltwo);
};
function onShake(){
  //console.log(oPage.page,'<<onShake reveiving::'+ oPage.startPoint);

    if (oPage.page==='home') {
      homeMoveNext();
    }
    if (oPage.page==='lists') {
      var iNewStartNo = (oPage.startPoint+1*1);
      if (oPage.iPageLoopSize == iNewStartNo) {
          iNewStartNo = 0;
      }
      oPage.startPoint=iNewStartNo;
      drawMainList({search:''});
    };
    if (oPage.page==='square') {
        refreshSquares();
        toastSuccess('shakin .--. . .- -.-. . new game started!@!');
    };
    if(oPage.page==='jokes'){
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
    if(oPage.page==='morse'){
      var o = document.querySelector('.divListFaveMorse');
      o.classList.remove('elShow');
      o.classList.add('elHide');
      const s = o.parentElement.children[0].children[1].children[0].children[0];
      var el=document.getElementById("listFaveMorse");
      if (s&&s.value===''){
        //console.log('IN DRAW')
        listFaveMorse();
      }else{
        //console.log('IN RE-DRAW')
        redrawFavesMorseLists({search:s.value});
        if (el){el.show()};
      };
      console.log('addFavMorse::',s)
      return;
    };
    if(oPage.page==='quotes'){
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
};

  function getLocal(name){
      return JSON.parse(sl.getItem(name));
  }
  function setLocal(name,data){
    //  console.log(name,'<<setLocal::',JSON.stringify(data));
      sl.setItem(name,JSON.stringify(data))
      return true;
  }

  function hideListing(row){
    if (oPage.aLists[oPage.activeListRow].listData[row].hidden){
      oPage.aLists[oPage.activeListRow].listData[row].hidden=false;
    }else{
      oPage.aLists[oPage.activeListRow].listData[row].hidden=true;
      ons.notification.toast(`${oPage.aLists[oPage.activeListRow].listData[row].item} hidden .`, oPage.toastOptions);
    }
    setLocal('lists',oPage.aLists);
    oPage.startPoint = parseInt(row / oPage.maxBlock2Dispay);
    drawMainList({search:''});
  };
  function gotListing(event,row){
  //  console.log(oPage.aLists[oPage.activeListRow].listData[row],'<<gotListing::',document.querySelector('.mainListsRow_'+row),row,event.target);
    var a=document.querySelectorAll('ons-list-item');
    var bgotIt = true;
    if (oPage.aLists[oPage.activeListRow].listData[row].gotIt===true){
      bgotIt = false;
      document.querySelector('.mainListsRow_'+row).classList.remove('cgotIt');
      event.target.innerText='check';
    }else{
      document.querySelector('.mainListsRow_'+row).classList.add('cgotIt');
      event.target.innerText='check_circle';
    }
    oPage.aLists[oPage.activeListRow].listData[row].gotIt=bgotIt;
    setLocal('lists',oPage.aLists);
  };

    var showNew=(()=>{
      var o=document.getElementById("listEntry");
      //console.log('showNew::',oPage.aLists[oPage.activeListRow]);
      document.querySelector('.newListEntry').innerHTML = `will add a new record to list:: ${oPage.aLists[oPage.activeListRow].name}`;
      document.querySelector('.titem').firstElementChild.value='';
      document.querySelector('.tnotes').firstElementChild.value='';
      if (o){
      o.show();
    }else{
      ons.createElement('dialog.html',{append:true})
        .then(function(dialog) {
          dialog.show();
        });
    }
    //  console.log(o,'<<showNew')
    });

    const addItem =(()=>{
      const sitem=document.querySelector('.titem');
      const snotes=document.querySelector('.tnotes');
      //console.log(sitem.value.length,sitem.value,'<<<>>>',snotes.value,oPage.lastRowClicked);
      const o=document.getElementById("listEntry");
    //  console.log(oPage.aLists,' ttttt ',oPage.activeListRow);



      if (sitem.value.length===0){
        ons.notification.alert({message:'Please enter a name for item on your list!'}).then(()=>{document.querySelector('.titem')._input.focus();});
      }else{
        var t={item:sitem.value,notes:snotes.value,gotIt:false,hidden:false,dateadded:(new Date()).toISOString()};
      //  console.log(oPage.aLists[oPage.activeListRow],"<<Database is: ::",oPage.activeListRow);
    //heres the plan, put it above oPage.lastRowClicked
      const aList = oPage.aLists[oPage.activeListRow].listData;
      var bList = [];
          if (oPage.lastRowClicked>-1){
            for (var i = 0; i < aList.length; i++) {
              if (i<oPage.lastRowClicked){
                bList.push(aList[i]);
              };
              if (i===oPage.lastRowClicked){
                bList.push(t);
              };
              if (i>=oPage.lastRowClicked){
                bList.push(aList[i]);
              };
            };
            oPage.aLists[oPage.activeListRow].listData=bList;
            ons.notification.toast(`new item added to ${oPage.aLists[oPage.activeListRow].name} .`, oPage.toastOptions);
          }else{
            oPage.aLists[oPage.activeListRow].listData.unshift(t);
            ons.notification.toast(`new item added to ${oPage.aLists[oPage.activeListRow].name} .`, oPage.toastOptions);
          };
    //  console.log('aList::',aList,bList,oPage.aLists[oPage.activeListRow].listData)
      //  oPage.aLists[oPage.activeListRow].listData.unshift(t);
      //return false;
        setLocal('lists',oPage.aLists);
        o.hide();
      };

      var newBlock = oPage.lastRowClicked;
      if(isNaN(newBlock)){
        newBlock=0;
      }else{
        newBlock = parseInt(newBlock / oPage.maxBlock2Dispay);
      }
      //console.log(newBlock,'/',oPage.maxBlock2Dispay,'start from ',newBlock);
      oPage.startPoint = newBlock;
      //set the start point as the same block that this is in
    //  console.log(oPage.aLists[oPage.activeListRow].listData.length,Math.floor(oPage.aLists[oPage.activeListRow].listData.length/oPage.maxBlock2Dispay),'working out oPage.startPoint::',oPage.startPoint)
      /*const listatt = document.createAttribute("list");
        listatt.value = "listOps";
        document.querySelector('.nlistName')._input.setAttributeNode(listatt);*/
      drawMainList({search:''});
    });

    const listLists=(()=>{
      const o=document.getElementById("listLists");
      const el = document.querySelector('.listOfLists');//.style.display='none';
      //  el.classList.remove('elShow');
      //  el.classList.add('elHide');
      //console.log(el,'<< boooom::',o);
        if (o.style.display==='block'){
            drawLists();
          }else{
            o.show().then(()=>{
              drawLists();
            });
        };
      //console.log(o,'<<listlists');
    });

    const drawLists=(()=>{
        const aLists=getLocal('lists');
        var sHTML='You Have No Lists';
        //console.log('drawLists::',aLists);
        if (aLists){
          sHTML='';
          aLists.forEach((item, i) => {
            var highLightRow = '';
            if (i===oPage.highlightListRow){highLightRow='hightLightRow';};
            sHTML +=`<ons-button class='listOfListsRow ${highLightRow}'>${item.name}- ${item.listData.length}</ons-button>`;
          });
        }
        const o = document.querySelector('.listOfLists');
        o.innerHTML=sHTML;
        $(o).slideDown('slow',function(){
          $(this).removeAttr("style");
          $(this).removeClass('elHide');
          $(this).addClass('elShow');
        });
        scrollElIntoView({row:oPage.hightLightRow});
        return;
    });

    const returnPopoverHeader = ((data)=>{
      return `
      <div class='popoverInfo'>
      <div><ons-input class='tedit_List_name' value='${oPage.aLists[data.row].name}'></ons-input></div>
      <div>notes:</div><div><textarea class='textarea canResize tedit_list_notes wide'>${oPage.aLists[data.row].notes}</textarea></div>
      <div><ons-button class='updateListofListsHeadBut' type='submit'>update</button></div>
      </div>`;
      //console.log('returning popover text::',sHTML);
    });
    const returnPopoverText = ((data)=>{
      return `${returnPopoverButtons(data)}
      <div class='popoverInfo'>
      <div><ons-input class='tedit_List_name' value='${oPage.aLists[data.row].name}'></ons-input></div>
      <div>notes:</div><div><textarea class='textarea canResize tedit_list_notes wide'>${oPage.aLists[data.row].notes}</textarea></div>
      <div><ons-button class='updateListofListsBut' type='submit'>update</button></div>
      </div>`;
      //console.log('returning popover text::',sHTML);
    });
    const returnPopoverButtons = ((data)=>{
      const fl = oPage.usrsettings.rhanded ? 'flRight' : 'flLeft';
      return `<div class='flhanded ${fl}'>
         <div class='listListButs'><span class='material-icons deleterow_${data.row} listOfListsDel popOverBut'>delete</span></div>
         <div class='listListButs'><span class='material-icons upListofLists_${data.row} popOverBut'>keyboard_arrow_up</span></div>
         <div class='listListButs'><span class='material-icons downListofLists_${data.row} popOverBut'>keyboard_arrow_down</span></div>
      </div>`;
      //console.log('returning popover text::',sHTML);
    });
   const returnPopoverMain=((data)=>{
     //console.log(oPage.aLists[oPage.activeListRow].listData,oPage.activeListRow,data.row,'<<returning popover::',oPage.showHiLi);
     //here here here is the issue
      return `${returnPopoverMainButtons(data)}
      <div class='popoverInfo'>
        <div>added:${returnshortdate({date:oPage.aLists[oPage.activeListRow].listData[data.row].dateadded})}</div>
        <div><ons-input class="tedit_title canRise" value='${oPage.aLists[oPage.activeListRow].listData[data.row].item}'></ons-input></div>
        <div>notes:</div><div><textarea class='textarea canResize tedit_notes canRise wide'>${oPage.aLists[oPage.activeListRow].listData[data.row].notes}</textarea></div>
         <div><ons-button class='updateListBut' type='submit'>update</button></div>
      </div>`;
      //console.log('returning popover text::',sHTML);
    });
    const returnPopoverMainButtons=((data)=>{
      const fl = oPage.usrsettings.rhanded ? 'flRight' : 'flLeft';
       var sHTML = `<div class='flhanded ${fl}'>
          <div class='listListButs'><span class='material-icons deleteMainrow_${data.row} popOverBut'>delete</span></div>`;
          if (!oPage.showHiLi){
            sHTML += `<div class='listListButs'><span class='material-icons upMainLists_${data.row} popOverBut'>keyboard_arrow_up</span></div>
            <div class='listListButs'><span class='material-icons downMainLists_${data.row} popOverBut'>keyboard_arrow_down</span></div>`;
          };
       sHTML += `</div>`;
       return sHTML;

     });
     const returnSettingPopover =(()=>{
       const am=oPage.blockSelected;
       const arAmounts=oPage.blockAmounts;
       var hightestNo=0;
       //:[5,10,20,50,'all'],
       //console.log(am,'returnSettingPopover::',arAmounts);
       var sHTML = `<div>
                        <div class='popovermain1'>amount per view:</div>
                        <div class='popovermain1'>`;
                      arAmounts.forEach((item, i) => {
                        var sselected='';
                        if(item===arAmounts[am]){sselected=' setPageAmountSel';};
                        sHTML+=`<span class='setPageAmount${sselected}'>${item}</span>`;
                      });
                        sHTML+=`</div>
                        <div class='textLeft'><div class='demoListBut'>create big demo list</div></div>
                    </div>`;
         return sHTML;
     });
     const returnSearchPopover =(()=>{
       const am=oPage.maxBlock2Dispay;
       const arAmounts=oPage.blockAmounts;
       //:[5,10,20,50],
       const sHTML = `<div><ons-search-input class="searchTxt" id='listSearch' placeholder="search list"></ons-search-input></div>`;
         return sHTML;
     });
     function searchList(event){
       //console.log('in searchList::',event.target.value);
       drawMainList({search:event.target.value});
     };
    function setCaretAtStartEnd(node,atEnd){
      const sel = document.getSelection();
      node = node.firstChild;
      if( sel.rangeCount ){
          ['Start', 'End'].forEach((pos) =>{
            sel.getRangeAt(0)["set" + pos](node, atEnd ? node.length : 0);
            //  console.log(node,atEnd,'<<setCaretAtStartEnd::',pos,sel);
          })
      };
      //
    }





    const showhidetoolbars = (()=>{
      const time = !oPage.islocal&&device.platform.toLowerCase()==='android' ? 500 : 100;
      setTimeout(function () {
        //console.log(isSilicon(),'<<issilicone - showhidetoolbars orient::',ons.orientation.isPortrait());
      if (ons.orientation.isPortrait()){
          $('.toolbar').fadeIn('fast',function(){
          //  $(this).removeAttr("style");
            $(this).removeClass('elHide');
            $(this).addClass('elShow');
          });
          $('.bottom-bar').fadeIn('slow',function(){
          //  $(this).removeAttr("style");
            $(this).removeClass('elHide');
            $(this).addClass('elShow');
          })
        }else{
        /*  $('.toolbar').fadeOut('fast',function(){
          //    $(this).removeAttr("style");
              $(this).removeClass('elShow');
              $(this).addClass('elHide');
            });
          $('.bottom-bar').fadeOut('fast',function(){
          //    $(this).removeAttr("style");
              $(this).removeClass('elShow');
              $(this).addClass('elHide');
            })*/
        };
      }, time);
    })
    const resetCards = ((data)=>{
      //data = {top:topAdjuster,islandscape:true}
    //  console.log('resetCards::',data);
      const time = !oPage.islocal&&device.platform.toLowerCase()==='android' ? 300 : 10;
      setTimeout(function(){
      var o = document.querySelectorAll('.card')
        o.forEach((item, i)=>{
          if (data.islandscape){

            $(item).addClass('cardland');
          }else{
            $(item).removeClass('cardland');
          };
          //item.style.height='100%';
          $(item).animate(data);
        });
      },time);
    });
    function homeMoveNext(){
        var el = document.querySelector('.homeHeader');
        const a=oPage.aPages;
        oPage.homeView+=1;
        var oicons=document.querySelectorAll('.homePageIcons');
        //console.log(oPage.homeView,a.length,'<<pulling home::',a,oicons);
        if(oPage.homeView>a.length-1){oPage.homeView=0;};
      //  console.log('pages::',a);
        el.innerHTML=a[oPage.homeView].about;
        var o = document.querySelectorAll('.homeButtsHighlight');
        o.forEach((item, i) => {
          item.classList.remove('homeButtsHighlight');
        });
        if(oPage.homeView-1>=0){
          oicons[oPage.homeView-1].firstElementChild.classList.add('homeButtsHighlight');
        };
    };
    function clearRowHighlights(data){
      var a = document.querySelectorAll('.'+data)
      a.forEach((item, i) => {
        item.classList.remove(data);
      });
      //console.log('removed lighlights');
    };
    function getPopoverReady(data){
    //  console.log('getPopoverReady::',data);
        if (data.page==='lists'){
          document.querySelector('ons-popover').addEventListener('posthide', function(event){
            clearRowHighlights('hightLightRow');
            oPage.highlightListRow=-1;
          });
          document.querySelector('ons-popover').addEventListener('postshow', function(event){
        });
        }
    };

    var doTextAreaStuff = function(field) {
        // Reset field height
            field.style.height = 'inherit';
            // Get the computed styles for the element
            //var computed = window.getComputedStyle(field);
            // Calculate the height
            var height = parseInt(field.scrollHeight);
            field.style.height = height + 'px';
            field.style.overflow = 'auto';
     };
     var textAreaStretch = function(){
    //  console.log(document.querySelector('.canResize'));
      var o2Size = document.querySelectorAll('.canResize')
      //console.log(o2Size);
      if (o2Size.length > 0) {
        for (var i = 0; i < o2Size.length; i++) {
            doTextAreaStuff(o2Size[i]);
        }
      }
    };

    var returnhiddenCount = ((data)=>{
      //console.log('returnhiddenCount::',data);
        var hiddenCount=0;
        data.forEach((item,i)=>{if (item.hidden){hiddenCount+=1};});
        return hiddenCount;

    });
    var showHideAll =(()=>{
      if (oPage.showAll){
          oPage.showAll=false;
          document.querySelector('.listAll').innerHTML = 'visibility'
        }else{
          oPage.showAll=true;
          document.querySelector('.listAll').innerHTML = 'visibility_off'
      };
      var loopList =[];
      if (oPage.aLists.length>0){
        loopList=oPage.aLists[oPage.activeListRow].listData;
      }
      const r = resetPageNoSH();
      if(r){drawMainList({search:''});};
    });
    var resetPageNoSH =(()=>{
      var hiddenCount = returnhiddenCount(oPage.aLists[oPage.activeListRow].listData);
      var j;
      if(!oPage.showAll){
        j=Math.floor((oPage.aLists[oPage.activeListRow].listData.length-1-hiddenCount)/oPage.maxBlock2Dispay);
        if(oPage.startPoint>=j){oPage.startPoint=j;};
      }else{
        j=Math.floor((oPage.aLists[oPage.activeListRow].listData.length-1)/oPage.maxBlock2Dispay);
        if(oPage.startPoint>=j){oPage.startPoint=j;};

      }
      //console.log(j,'<<showSHOW ALL::',oPage.startPoint,hiddenCount,oPage.aLists[oPage.activeListRow].listData.length-1,((oPage.aLists[oPage.activeListRow].listData.length-hiddenCount) % oPage.maxBlock2Dispay));
      return true;
    });


    var resetPageNo=((data)=>{
      //data={direction:'up'}
      //as simple as you like. If heading upwards and element is no longer in the list then oPage.startPoint-=1
      var elp=document.getElementById('mainList');
      var el=document.querySelector('.mainListsRow_'+oPage.highlightListRow);
      var dispRow = Array.prototype.indexOf.call(elp.childNodes, el);
    //  console.log(elp,'<<resetPageNo V2::',el,dispRow,data,oPage.highlightListRow);
      if (data.direction==='UP'&&dispRow===-1){
        oPage.startPoint-=1;
        if(oPage.startPoint<1){oPage.startPoint=0;};
        }else if (data.direction==='DOWN'&&dispRow===-1){
          //here here here - and there are more than 5 records!!
        oPage.startPoint+=1;
      }
      return true;
    });

    var copyTextToClipboard = ((data)=>{
      //expecting data={text:'string',reason:'string'};
      //console.log(cordova,'<<in copyTextToClipboard::',data)
      cordova.plugins.clipboard.copy(data.text);
    //  window.navigator.clipboard.writeText(data.text);//NOTE LOCAL TESTING ONLY
      ons.notification.toast(data.reason+' copied to clipboard',oPage.toastOptions);
    });



    var drawBigTestList=(()=>{
      const arr=sBands.sort();
      var nList = {name:'BIG LIST OF BANDS',notes:'Just a big list to demonstrate the speed that data can be displayed!',listData:[],dateadded:(new Date()).toISOString()};

      //var a=[];
      //{item:sitem.value,notes:snotes.value,gotIt:false,hidden:false,dateadded:(new Date()).toString()}
      for (var i=0;i<arr.length;i++){
        nList.listData.push({item:arr[i],notes:'notes about '+arr[i],gotIt:false,hidden:false,dateadded:(new Date()).toISOString()});
      };

      return nList;
    });


    function offset(data) {
    	    var rect = data.getBoundingClientRect(),
    	    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    	    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    	    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    	};

      const setHomePage = (()=>{
         const o = document.querySelector('.homeButtons');
        const iwidth = o.clientWidth
        var el = document.querySelector('.homeHeader');
      //  console.log(o,'<<setHomePage::',iwidth,o.getClientRects())
        setTimeout(()=>{
        //  $(el).animate({width:iwidth-20});
        }, 100);
      });

    /*  var resetPosition = ((data)=>{
        //a problem with popover and android. it is repositioning itsef when body animates. this puts it back where it was
        //from the target, then reset its position. Seems to happen on focus and blur!
        //data::{top:0,bottom:0,direction:'up',delay:50}
        var popover = document.getElementById('popover');
      // console.log('resetPosition receiving::',data);
        if (popover){
        setTimeout(()=>{
            //console.log(data,'<<resetPosition::',popover.getAttribute('direction'))
            if (data.direction.toLowerCase() === 'up'){
              popover.childNodes[3].style.top = null;
              $(popover.childNodes[3]).animate({bottom:parseInt(data.bottom)});
            //  console.log(data,'<<UP RESET::',data.bottom,popover.childNodes[3].style.bottom);
          }else if (data.direction.toLowerCase() === 'down'){
              //WITH doiwn, the el.style.top tag is used
                popover.childNodes[3].style.bottom = null;
              $(popover.childNodes[3]).animate({top:parseInt(data.top)});
            //  console.log(data,'<<DOWN RESET::',data.top,popover.childNodes[3].style.top);
          };
        },data.delay);
      };
        return;
      });*/

      var blurInputs = (()=>{
        var inputs = document.querySelectorAll('.text-input');
        inputs.forEach((item, i) => {
          item.blur();
        });
      });
