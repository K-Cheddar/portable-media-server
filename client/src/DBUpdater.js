import * as Sort from './Sort'

let updaterInterval = null;

// let previousItems = {};
export function update(db, item, selectedItemList, itemList, allItems, itemLists, allItemLists, updateState){
  console.log("Update Called");
  // if(JSON.stringify(previousItems.item) !== JSON.stringify(item)){
  //   console.log("Updating item");
  //   previousItems.item = item;
    db.get(item._id).then(function (doc) {
      doc.name = item.name;
      doc.background = item.background;
      doc.slides = item.slides;
      doc.formattedLyrics = item.formattedLyrics;
      doc.songOrder = item.songOrder;
     return db.put(doc);
   }).catch(function(err){
     console.log('update item not working');
   });
  // }

  // if(JSON.stringify(previousItems.selectedItemList) !== JSON.stringify(selectedItemList)){
  //   console.log("Updating selectedItemList");
  //   previousItems.selectedItemList = selectedItemList;
    db.get(selectedItemList.id).then(function (doc) {
      for(let i = 0; i <doc.items.length; ++i){
        let val = itemList.find(e => e.id === doc.items[i].id)
        if(!val)
         itemList.push(doc.items[i])
      }
      doc.items = itemList
      if(doc.items.length !== itemList.length)
       updateState({itemList: itemList, needsUpdate: false})
      db.put(doc)
    }).catch(function(){
      console.log('update selectedItemList not working');
    });
  // }


 // if(JSON.stringify(previousItems.allItemLists) !== JSON.stringify(allItemLists)){
 //   console.log("Updating allItemLists");
 //   previousItems.allItemLists = allItemLists;
   db.get('allItemLists').then(function (doc) {
       doc.itemLists = allItemLists;
       if(doc.itemLists.length === 0){
         let obj = {id: "Item List 1", name: "Item List 1"};
         doc.itemLists.push(obj)
         newList(obj)
       }
       db.put(doc);
   }).catch(function(){
     console.log('update all itemLists not working');
   });
 // }


 // if(JSON.stringify(previousItems.itemLists) !== JSON.stringify(itemLists)){
 //   console.log("Updating itemLists");
 //   previousItems.itemLists = itemLists;
   db.get('ItemLists').then(function (doc) {
      if(doc.itemLists.length === 1 && itemLists.length===1){
        let obj = doc.itemLists[0]
        db.get(obj.id).then(function(doc2){
            updateState({selectedItemList: obj, itemList: doc2.items, needsUpdate: false})
        })

      }
      let val = itemLists.find(e => e.id === selectedItemList.id)
      if(!val)
        updateState({selectedItemList: {}, itemList: [], item:{}, needsUpdate: false})
       doc.itemLists = itemLists;
       db.put(doc);
   }).catch(function(err){
     console.log('update itemLists not working');
     console.log(err);
   });
 // }


 // if(JSON.stringify(previousItems.allItems) !== JSON.stringify(allItems)){
 //   console.log("Updating allItems");
 //   previousItems.allItems = allItems;
   db.get('allItems').then(function (doc) {
     for(let i = 0; i <doc.items.length; ++i){
       let val = allItems.find(e => e.id === doc.items[i].id)
       if(!val)
        allItems.push(doc.items[i])
     }
       if(doc.items.length !== allItems.length)
          updateState({allItems: allItems})
       doc.items = allItems;
       db.put(doc);
   }).catch(function(err){
     console.log('update all items (update) not working');
     console.log(err);
   });
 // }

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
    updateState({item: doc, needsUpdate: false});
    let style = {
      color: doc.slides[0].boxes[0].fontColor,
      fontSize: doc.slides[0].boxes[0].fontSize,
    }
    setWordIndex(0)
    if(!freeze)
      updateCurrent({words: doc.slides[0].boxes[0].words, background: doc.background, style: style, index: 0});
  })
}

export function putInList(db, itemObj, selectedItemList, itemIndex, updateState){
  db.get(selectedItemList.id).then(function (doc) {
    doc.items.splice(itemIndex+1, 0, itemObj);
    updateState({itemList: doc.items});
    db.put(doc);
  })
}

export function addItem(db, item, itemIndex, updateState, setItemIndex, addItemToList){
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
        allItems.items = Sort.sortNamesInList(allItems.items)
        updateState({allItems: allItems.items})
        db.put(allItems);
      });
      db.put(item).then(function(){
        updateState({item: item});
        setItemIndex(itemIndex +1)
      });
  })
}

export function deleteItem(db, name, allItems, allItemLists, index, selectedItemList, setItemIndex, updateState){

  //delete item
  db.get(allItems[index]._id).then(function (doc) {
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
  for(let i = 1; i <= allItemLists.length; ++i){
    db.get("Item List "+i).then(function(doc){
      doc.items = doc.items.filter(e => e.name !== name)
      if(selectedItemList.id === "Item List "+i){
        updateState({itemList: doc.items })
        setItemIndex((doc.items.length > 0) ? index-1 : 0)
      }
      return db.put(doc);
    })
  }
}

export function deleteItemFromList(db, selectedItemList, itemList, updateState){

  db.get(selectedItemList.id).then(function (doc) {
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

export function newList(db, newList){
  db.get(newList.id).catch(function (err) {
    var SL = {
    "_id": newList.id,
    "items" : []
    };
     db.put(SL)
  })
}

export function deleteItemList(db, id){
  db.get(id).then(function(doc){
      return db.remove(doc);
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
