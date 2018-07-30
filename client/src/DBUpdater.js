let updaterInterval = null
export function update(db, item, selectedItemList, itemList, allItems, updateState){
  if(item.name){
    db.get(item._id).then(function (doc) {
      doc.name = item.name;
      doc.background = item.background;
      doc.slides = item.slides;
      doc.nameSize = item.nameSize;
      doc.formattedLyrics = item.formattedLyrics;
      doc.songOrder = item.songOrder;
     return db.put(doc);
   }).catch(function(err){
     console.log('get item to update not working');
   });
  }

 db.get(selectedItemList).then(function (doc) {
   console.log('updating');
   for(let i = 0; i <doc.items.length; ++i){
     let val = itemList.find(e => e.name === doc.items[i].name)
     if(!val)
      itemList.push(doc.item[i])
   }
   doc.items = itemList
   if(doc.items.length !== itemList.length)
    updateState({itemList: itemList})
   db.put(doc)
 }).catch(function(){
   console.log('selectedItemList not working');
 });

 db.get('allItems').then(function (doc) {
   for(let i = 0; i <doc.items.length; ++i){
     let val = allItems.find(e => e.name === doc.items[i].name)
     if(!val)
      allItems.push(doc.item[i])
   }
     if(doc.items.length !== allItems.length)
        updateState({allItems: allItems})
     doc.items = allItems;
     db.put(doc);
 }).catch(function(){
   console.log('get all items (update) not working');
 });
}

export function updateCurrent(db, words, background, style, time){
  function updateValues(doc) {
    doc.info.words = words;
    doc.info.background = background;
    doc.info.time = time;
    doc.info.style = style
    doc.info.updated = true;
    return doc;
  }

  db.upsert('currentInfo', updateValues);
}

export function updateItem(db, itemID, updateState, freeze, updateCurrent, setWordIndex){
  db.get(itemID).then(function (doc) {
    updateState({item: doc});
    let style = {
      color: doc.slides[0].boxes[0].fontColor,
      fontSize: doc.slides[0].boxes[0].fontSize,
    }
    if(!freeze)
      updateCurrent({words: doc.slides[0].boxes[0].words, background: doc.background, style: style, index: 0});
  })
}

export function putInList(db, itemObj, selectedItemList, itemIndex, updateState){
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
        "nameColor": item.slides[0].boxes[0].fontColor,
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
        setItemIndex(itemIndex +1)
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

  updateState({item: {}})
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

export function updateItemLists(db, itemLists, newList){
  db.get('ItemLists').then(function(doc){
    doc.itemLists = itemLists;
    return db.put(doc)
  })
  db.get(newList.id).catch(function (err) {
    var SL = {
    "_id": newList.id,
    "items" : []
    };
     db.put(SL)
  })
}

export function updateALL(db){
  db.get('allItems').then(function (doc) {
    let items = doc.items;
    let i = 0;
    clearInterval(updaterInterval);
    updaterInterval = setInterval(function(){
      if(i < items.length){
        db.get(items[i]._id).then(function(doc){
          let words = doc.words;
          let slides = [];
          for (let j = 0; j < words.length-1; ++j){
            let slide = {
                        "type": words[j].type,
                        "slideIndex": words[j].slideIndex || 0,
                        "boxes": [
                          {"background": words[j].background,
                           "fontSize": (j===0) ? doc.nameSize : doc.style.fontSize,
                           "fontColor": doc.style.color,
                           "words": words[j].words,
                          }
                        ]
                      }
              slides.push(slide);
          }
          console.log("Updated: ", doc.name);
          doc.slides = slides;
          delete doc.words;
          delete doc.background;
          delete doc.nameSize;
          delete doc.style;
          db.put(doc);
        })
        ++i
      }
      else{
        clearInterval(updaterInterval)
      }
    }, 250)

  })
}
