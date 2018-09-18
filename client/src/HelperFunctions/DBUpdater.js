import * as Sort from './Sort'
import * as DateFunctions from './DateFunctions'

let updaterInterval = null;

export function updateItem(props){
  console.log("Updating Item");
  let {db, item} = props;
  db.get(item._id).then(function (doc) {
    doc.name = item.name;
    doc.background = item.background;
    if(doc.type === 'song'){
      doc.selectedArrangement = item.selectedArrangement;
      doc.arrangements = item.arrangements;
    }
    else
      doc.slides = item.slides;

    return db.put(doc);
   }).catch(function(){
     console.log('update item not working');
   });
}

export function updateItemList(props, updateState){
  let {db, selectedItemList, itemList} = props;
  console.log("Updating ItemList");
  db.get(selectedItemList.id).then(function (doc) {
    for(let i = 0; i <doc.items.length; ++i){
      let val = itemList.find(e => e.id === doc.items[i].id)
      if(!val)
       itemList.push(doc.items[i])
    }
    doc.items = itemList
    if(doc.items.length !== itemList.length)
     updateState({itemList: itemList})
    db.put(doc)
  }).catch(function(){
    console.log('update selectedItemList not working');
  });
}

export function updateItemLists(props, updateState){
  let {db, selectedItemList, itemLists} = props;
  console.log("Updating Item Lists");
  db.get('ItemLists').then(function (doc) {
     if(doc.itemLists.length === 1 && itemLists.length===1){
       let obj = doc.itemLists[0]
       db.get(obj.id).then(function(doc2){
           updateState({selectedItemList: obj, itemList: doc2.items})
       })

     }
     let val = itemLists.find(e => e.id === selectedItemList.id)
     if(!val)
       updateState({selectedItemList: {}, itemList: [], item:{}})
      doc.itemLists = itemLists;
      db.put(doc);
  }).catch(function(){
    console.log('update itemLists not working');
  });
}

export function updateAllItemLists(props){
  let {db, allItemLists} = props;
  console.log("Updating All Item Lists");
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
}

export function updateAllItems(props, updateState){
  let {db, allItems} = props;
  console.log("Updating All Items");
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
  }).catch(function(){
    console.log('update all items (update) not working');
  });
}

export function updateCurrent(props){
  let {db} = props;
  let {words, background, style, time} = props.obj;
  time-=1;
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

export function updateUserSettings(props){
  let {userSetting, updateState} = props;
  let {db, userSettings} = props.state;
  db.get('userSettings').then(function(doc){
    doc.settings[userSetting.type] = userSetting.obj;
    userSettings[userSetting.type] = userSetting.obj;
    updateState({userSettings: userSettings});
    db.put(doc);
  })
}


export function putInList(props){
  let {itemObj} = props;
  let {updateState} = props.parent;
  let {db, selectedItemList, itemIndex} = props.parent.state;
  db.get(selectedItemList.id).then(function (doc) {
    doc.items.splice(itemIndex+1, 0, itemObj);
    updateState({itemList: doc.items});
    db.put(doc);
  })
}

export function addItem(props){
  let {item} = props;
  let {updateState, setItemIndex, addItemToList} = props.parent;
  let {db, itemIndex} = props.parent.state;

  db.get(item._id).then(function(doc){
    let slides;
    if (doc.type === 'song')
      slides = doc.arrangements[item.selectedArrangement].slides;
    else
      slides = doc.slides;
    let itemObj = {
      "name": slides[0].boxes[0].words,
      "_id": doc._id,
      "background": slides[0].boxes[0].background,
      "nameColor": slides[0].boxes[0].fontColor,
      "type": doc.type
    }
    addItemToList(itemObj);
  }).catch(function(){

    let slides;
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides;
    else
      slides = item.slides;

      let itemObj = {
        "name": item.name,
        "_id": item._id,
        "background": item.background,
        "nameColor": slides[0].boxes[0].fontColor,
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
        if(itemIndex < 0)
          setItemIndex(0)
        else
          setItemIndex(itemIndex +1)
      });
  })
}

export function deleteItem(props){
  let {name, index} = props;
  let {updateState} = props.parent;
  let {db, allItems, allItemLists, selectedItemList} = props.parent.state;
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

  //delete item from each list
  for(let i = 0; i < allItemLists.length; ++i){
    db.get(allItemLists[i].id).then(function(doc){
      doc.items = doc.items.filter(e => e.name !== name)
      if(selectedItemList.id === allItemLists[i].id){
        updateState({itemList: doc.items })
      }
      return db.put(doc);
    })
  }
}

export function deleteItemFromList(props){
  let {index} = props;
  let {updateState} = props.parent;
  let {db, selectedItemList, itemList} = props.parent.state;

  db.get(selectedItemList.id).then(function (doc) {
    itemList.splice(index, 1);
    doc.items = itemList;
    updateState({itemList: itemList})
    return db.put(doc);
  })
}

export function updateImages(props){
  let {db, uploads} = props;
  db.get('images').then(function(doc){
    doc.backgrounds = doc.backgrounds.concat(uploads);
    return db.put(doc);
  })
}

export function newList(props){
  let {db, newList} = props;
  db.get(newList.id).catch(function (err) {
    var SL = {
    "_id": newList.id,
    "items" : []
    };
     db.put(SL)
  })
}

export function duplicateList(props){
    let {id} = props;
    let {updateState} = props.parent;
    let {db, allItemLists, itemLists} = props.parent.state;

    let newID = allItemLists[allItemLists.length-1].id;
    let newNumber = parseInt(newID.slice(-1), 10) + 1;
    newID = "Item List " + newNumber;
    let name = DateFunctions.getDateofNextDay('Saturday');
    db.get(id).then(function(doc){
      let newListFull = {
        id: newID,
        name: name
      }
      let newList = {
        "_id": newID,
        items: doc.items
      }
      db.put(newList)
      allItemLists.push(newListFull);
      itemLists.push(newListFull);
      updateState({allItemLists: allItemLists, itemLists: itemLists, itemList: doc.items,
        selectedItemList:{name: name, id: id}})
    })

}

export function deleteItemList(props){
  let {db, id, selectItemList, itemLists} = props;
  db.get(id).then(function(doc){
      return db.remove(doc);
  }).then(function(){
    if(itemLists.length > 0){
      selectItemList(itemLists[0].name)
    }
  })
}

export function updateItemStructure(db){
  db.get('allItems').then(function (doc) {
    let items = doc.items;
    let i = 0;
    clearInterval(updaterInterval);
    updaterInterval = setInterval(function(){
      if(i < items.length){
        db.get(items[i]._id).then(function(doc2){
          if(doc2.type === 'song' && doc2.slides){
            let arrangements = doc2.arrangements.slice();
            for( let p = 0; p < arrangements.length; ++p){
              arrangements[p].slides = doc2.slides;
            }
            doc2.arrangements = arrangements;
            delete doc2.slides;
            console.log("Updated:", doc2.name);
          }
          else{
            console.log("Skipped:", doc2.name);
          }
          db.put(doc2);
        })
        ++i
      }
      else{
        clearInterval(updaterInterval)
      }
    }, 100)

  })
}
