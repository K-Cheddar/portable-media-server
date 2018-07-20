export function init(db, updateState, getSuccess, getAttempted){
  db.get('currentInfo').then(function(doc){
    updateState({currentInfo: doc.info})
    getSuccess('currentInfo')
  }).catch(function(){
    console.log('currentInfo not loaded');
  }).then(function(){
    getAttempted('currentInfo', db)
  })
  db.get('Item List 1').then(function (doc) {
    updateState({itemList: doc.items}) //actual list of items
    getSuccess('Item List')
  }).catch(function(){
    console.log('item list 1 not loaded');
  }).then(function(){
    getAttempted('Item List 1', db)
  });
  db.get('ItemLists').then(function (doc) {
    updateState({
      itemLists: doc.itemLists,// list of item list names
      selectedItemList: doc.itemLists[0] //name of first item list
    })
    getSuccess('Item Lists')
  }).catch(function(){
    console.log('itemLists not loaded');
  }).then(function(){
    getAttempted('Item Lists', db)
  })
  db.get('allItems').then(function (doc) {
    updateState({allItems: doc.items}) //every single Item
    getSuccess('allItems')
  }).catch(function(){
    console.log('allItems not loaded');
  }).then(function(){
    getAttempted('allItems', db)
  });
}

export function changes(db, updateState, getTime){
  db.changes({
    since: 'now',
    live: true,
    include_docs: true
  }).on('change', function(change) {
    if(change.id === "currentInfo"){
      if(getTime() < change.doc.info.time){
        updateState({currentInfo: change.doc.info})
      }
      console.log("getTime", getTime(), "time", change.doc.info.time);
    }
  })
}

export function retrieveImages(db, updateState, cloud, getSuccess, getAttempted){
  let backgrounds = []
  db.get('images').then(function(doc){
    for (let i = 0; i < doc.backgrounds.length; i++) {
      let element = doc.backgrounds[i];
      let tag, imgData;
      let type = element.type;
      if(type === 'video'){
        tag = element.url.substring(0,(element.url.lastIndexOf('.'))) + '.jpg'
        let img = new Image();
        img.src = tag;
        let video = document.createElement("video");
        video.setAttribute("src", element.url);
         imgData = {
          name: element.name,
          image: img,
          category: element.category,
          type: type,
          video: video
        }
      }
      else {
        tag = cloud.url(element.name);
        let img = new Image();
        img.src = tag;
         imgData = {
          name: element.name,
          image: img,
          category: element.category,
          type: type,
        }
      }

      backgrounds.push(imgData);
    }
    getSuccess('images')
    updateState({backgrounds: backgrounds})
  }).catch(function(){
    console.log('images not loaded');
  }).then(function(){
    getAttempted('images', db)
  });
}

export function getItem(db, id, updateState, setItemIndex, itemIndex){
  db.get(id).then(function(doc){
    updateState({item: doc})
    setItemIndex(itemIndex+1)
  }).catch(function(){
    console.log('getItem not loaded');
  });
}

export function selectItemList(db, id, updateState){
  db.get(id).then(function(doc){
    updateState({itemList: doc.items})
  }).catch(function(){
    console.log('selectitemlist not loaded');
  });
}
