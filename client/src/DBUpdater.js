let interval = null
export function update(db, item, selectedItemList, itemList, allItems){
  if(item.name){
    db.get(item._id).then(function (doc) {
      doc.name = item.name;
      doc.background = item.background;
      doc.words = item.words;
      doc.style = item.style;
      doc.nameSize = item.nameSize;
      doc.formattedLyrics = item.formattedLyrics;
      doc.songOrder = item.songOrder;
     return db.put(doc);
   }).catch(function(err){
     console.log('get item to update not working');
   });
  }
  
 db.get(selectedItemList).then(function (doc) {
   doc.items = itemList
   db.put(doc)
 }).catch(function(){
   console.log('selectedItemList not working');
 });

 db.get('allItems').then(function (doc) {
     doc.items = allItems;
     db.put(doc);
 }).catch(function(){
   console.log('get all items (update) not working');
 });
}

export function keepPresentationAlive(db){

  var timer = null;
  clearInterval(interval)
  interval = setInterval(pUpdate,15000);

  function pUpdate(){
    db.get("currentInfo").then(function(doc){
      if(!doc.info.updated){
        //doc.info.toggle = !doc.info.toggle;
        doc.info.updated = true;
        db.put(doc);
        clearTimeout(timer);
        timer = setTimeout(function(){
          db.get("currentInfo").then(function(doc1){
            doc1.info.updated = false;
            db.put(doc1)
          })
        }, 15000)
      }
    }).catch(function(){
      console.log('current Info update not working not working');
    });
  }
}

export function updateCurrent(db, words, background, style){

  function updateValues(doc) {
    doc.info.words = words;
    doc.info.background = background;
    doc.info.style = style;
    doc.info.updated = true;
    return doc;
  }

  db.upsert('currentInfo', updateValues);
}

export function updateItem(db, itemID, updateState, freeze){
  db.get(itemID).then(function (doc) {
    updateState({
      item: doc,
      wordIndex: 0,
    })
    let style = {
      color: doc.style.color,
      fontSize: doc.nameSize,
    }
    if(!freeze)
      updateCurrent(db, doc.words[0].words, doc.background, style);
  })
}

export function selectList(db, itemObj, selectedItemList, itemIndex, updateState){
  db.get(selectedItemList).then(function (doc) {
    doc.items.splice(itemIndex+1, 0, itemObj);
    updateState({itemList: doc.items});
    db.put(doc);
  })
}

export function addItem(db, item, itemIndex, updateState, setItemIndex, addItemToList, sortItemList){
  db.get(item._id).then(function(doc){
    let itemObj = {
      "name": doc.name,
      "_id": doc._id,
      "background": doc.background,
      "nameColor": doc.style.color,
      "type": doc.type
    }
    addItemToList(itemObj);
  }).catch(function(){
      let itemObj = {
        "name": item.name,
        "_id": item._id,
        "background": item.background,
        "nameColor": item.style.color,
        "type": item.type
      }
      addItemToList(itemObj);
      db.get('allItems').then(function (allItems) {
        allItems.items.push(itemObj);
        allItems.items = sortItemList(allItems.items)
        updateState({allItems: allItems.items})
        db.put(allItems);
      });
      db.put(item).then(function(){
        updateState({item: item});
        let index = (itemIndex===0)? 0 : itemIndex +1
        setItemIndex(index)
      });
  })
}

export function deleteItem(db, name, allItems, index, selectedItemList, setItemIndex, updateState){

  //delete item
  db.get(allItems[index]._id).then(function (doc) {
    console.log("FOUND");
      return db.remove(doc);
  });
  allItems.splice(index, 1);
  db.get('allItems').then(function(doc){
    doc.items = allItems;
    updateState({allItems: doc.items});
    return db.put(doc);
  })
  //delete item from each list
  for(let i = 1; i <= 5; ++i){
    db.get("Item List "+i).then(function(doc){
      let sIndex = doc.items.findIndex(e => e.name === name);
      if(sIndex >= 0){
        db.get("Item List "+i).then(function (doc) {
            doc.items.splice(sIndex, 1);
            if(selectedItemList === "Item List "+i){
              updateState({itemList: doc.items})
                setItemIndex(index-1)
            }
            return db.put(doc);
          })

      }
    })
  }
}

export function deleteItemFromList(db, selectedItemList, itemList, updateState){

  db.get(selectedItemList).then(function (doc) {
    doc.items = itemList;
    updateState({itemList: doc.items})
    return db.put(doc);
  })
}


export function updateImages(db, uploads){
  db.get('images').then(function(doc){
    doc.backgrounds = doc.backgrounds.concat(uploads);
    return db.put(doc);
  })
}
