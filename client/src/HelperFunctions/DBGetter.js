
export function init(props){
  let {db} = props;
  let {updateState, getSuccess, getAttempted} = props.parent;
  db.get('currentInfo').then(function(doc){
    updateState({currentInfo: doc.info})
    getSuccess('currentInfo')
  }).catch(function(){
    console.log('currentInfo not loaded');
  }).then(function(){
    getAttempted('currentInfo')
  })
  db.get('ItemLists').then(function (doc) {
    if(doc.itemLists[0]){
      db.get(doc.itemLists[0].id).then(function(doc2){
        getSuccess('Item Lists')
        updateState({itemList: doc2.items}) //actual list of items
      })
      updateState({
        itemLists: doc.itemLists,// list of item list names
        selectedItemList:{name: doc.itemLists[0].name, id: doc.itemLists[0].id}, //name of first item list
      })
    }
    else {
      getSuccess('Item Lists')
    }
  }).catch(function(){
    console.log('itemLists not loaded');
  }).then(function(){
    getAttempted('Item Lists')
  })
  db.get('allItemLists').then(function (doc) {
    updateState({
      allItemLists: doc.itemLists,// list of item list names
    })
    getSuccess('All Item Lists')
  }).catch(function(){
    console.log('itemLists not loaded');
  }).then(function(){
    getAttempted('All Item Lists')
  })
  db.get('allItems').then(function (doc) {
    updateState({allItems: doc.items})
    getSuccess('allItems')
  }).catch(function(){
    console.log('allItems not loaded');
  }).then(function(){
    getAttempted('allItems')
  });
  db.get('userSettings').then(function (doc) {
    updateState({userSettings: doc.settings})
    getSuccess('userSettings')
  }).catch(function(){
    console.log('user settings not loaded');
  }).then(function(){
    getAttempted('userSettings')
  });
}

export function changes(props){
  let {db, cloud, remoteDB} = props;
  let {updateState, getTime} = props.parent;
  db.changes({
    since: 'now',
    live: true,
    include_docs: true,
    timeout: false
  }).on('change', function(change) {
    if(change.id === 'images'){
      retrieveImages({parent: props.parent, db: db, cloud: cloud})
    }
    // if(change.id === 'allItemLists'){
    //   updateState({allItemLists: change.doc.itemLists})
    // }
    // if(change.id === 'ItemLists'){
    //   updateState({itemLists: change.doc.itemLists})
    // }
    if(change.id === 'allItems'){
      updateState({allItems: change.doc.items})
    }
    // if(change.id === getSelectedListId()){
    //   updateState({itemList: change.doc.items})
    // }
    // if(change.id === getItemId()){
    //   updateState({item: change.doc})
    // }

  })
  let dbchanges = remoteDB.changes({
    since: 'now',
    live: true,
    include_docs: true,
    timeout: false
  }).on('change', function(change) {
    if(change.id === "currentInfo"){
      if(getTime() < change.doc.info.time)
        updateState({currentInfo: change.doc.info})
    }
  }).on('error', function(){
  dbchanges.cancel()
    setTimeout(function(){
      changes(props)
    },2500)
  })
}

export function retrieveImages(props){
  let {db, cloud} = props;
  let {updateState, getSuccess, getAttempted} = props.parent;
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

          // var req = new XMLHttpRequest();
          // req.open('GET', 'video.mp4', true);
          // req.responseType = 'blob';
          //
          // req.onload = function() {
          //    // Onload is triggered even on 404
          //    // so we need to check the status code
          //    if (this.status === 200) {
          //       var videoBlob = this.response;
          //       var vid = URL.createObjectURL(videoBlob); // IE10+
          //       // Video is now downloaded
          //       // and we can set it as source on the video element
          //       video.src = vid;
          //    }
          // }

        let video = document.createElement("video");
        video.setAttribute("src", element.url);
         imgData = {
          name: element.name,
          image: img,
          category: element.category,
          type: type,
          video: video
        }
        video.preload = true;
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
    getAttempted('images')
  });
}

export function getItem(props){
  let {id} = props;
  let {updateState, setItemIndex} = props.parent;
  let {db, itemIndex} = props.parent.state;
  db.get(id).then(function(doc){
    updateState({item: doc})
    if(itemIndex < 0)
      setItemIndex(0)
    else
      setItemIndex(itemIndex+1)
  }).catch(function(){
    console.log('getItem not loaded');
  });
}

export function selectItemList(props){
  let {db, id, updateState} = props;
  db.get(id).then(function(doc){
    updateState({itemList: doc.items})
  }).catch(function(){
    console.log('selectitemlist not loaded');
  });
}

export function updateItem(props){
  let {db, itemID} = props;
  let {updateState, setWordIndex} = props.parent;
  db.get(itemID).then(function (doc) {
    updateState({item: doc});
    setWordIndex(0)
  })
}