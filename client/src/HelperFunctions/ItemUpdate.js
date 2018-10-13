import * as Sort from './Sort'
import * as Overflow from './Overflow'

export function setItemBackground(props){
  let {background} = props;
  let {updateState, updateHistory} = props.parent;
  let {item, itemIndex, itemList, allItems, needsUpdate} = props.parent.state;

  let slides;
  if (item.type === 'song')
    slides = item.arrangements[item.selectedArrangement].slides || null;
  else
    slides = item.slides || null;

  if(!slides)
    return;

  let index = allItems.findIndex(e => e.name === item.name)
  //set all slides to match item background
  for (var i = 0; i < slides.length; i++) {
    slides[i].boxes[0].background = background;
  }
  //update Item background in all places
  itemList[itemIndex].background = background;
  allItems[index].background = background;
  item.background = background;

  needsUpdate.updateItem = true;
  needsUpdate.updateItemList = true;
  needsUpdate.updateAllItems = true;
  updateHistory({type: 'update', item: item, itemList: itemList, allItems: allItems})
  updateState({item: item, itemList: itemList, allItems: allItems, needsUpdate: needsUpdate})
}

export function setItemIndex(props){
  let {index} = props;
  let {updateState} = props.parent;

  var mElement = document.getElementById("MItem"+index);
  var element = document.getElementById("Item"+index);
  if(mElement)
    mElement.scrollIntoView({behavior: "smooth", block: "center", inline:'center'})
  if(element)
    element.scrollIntoView({behavior: "instant", block: "nearest", inline: "nearest"});
  updateState({itemIndex: index, boxIndex: 0})
}

export function updateItem(props){
  let {item} = props;
  let {updateHistory, updateState} = props.parent;
  let {itemList, allItems, needsUpdate} = props.parent.state;

  let slides;
  if (item.type === 'song')
    slides = item.arrangements[item.selectedArrangement].slides || null;
  else
    slides = item.slides || null;

  let fontColor = slides[0].boxes[0].fontColor;
  let name = item.name
  let itemIndex = itemList.findIndex(e => e._id === item._id)
  if(itemIndex !== -1 && (itemList[itemIndex].nameColor !== fontColor || itemList[itemIndex].name !== name)){
    itemList[itemIndex].nameColor = fontColor;
    itemList[itemIndex].name = name;
    needsUpdate.updateItemList = true;
  }
  allItems = Sort.sortNamesInList(allItems)
  let index = allItems.findIndex(e => e._id === item._id)
  if(index !== -1 && (allItems[index].nameColor !== fontColor || allItems[index].name !== name)){
    allItems[index].nameColor = fontColor;
    allItems[index].name = name;
    needsUpdate.updateAllItems = true;
  }
  if(item.type === 'song')
    item = Overflow.formatSong(item)
  if(item.type === 'bible')
    item = Overflow.formatBible(item, 'edit')
  needsUpdate.updateItem = true;

  updateHistory({type: 'update', item: item, itemList: itemList, allItems: allItems})
  updateState({item: item, itemList: itemList, allItems: allItems, needsUpdate: needsUpdate})
}

export function insertWords(props){
  let {targetIndex} = props;
  let {updateHistory, setWordIndex, updateState} = props.parent;
  let {item, wordIndex, needsUpdate, boxIndex} = props.parent.state;

  let slides;
  if (item.type === 'song')
    slides = item.arrangements[item.selectedArrangement].slides || null;
  else
    slides = item.slides || null;

  let words = slides[wordIndex].boxes[boxIndex].words;
  slides.splice(wordIndex, 1);
  slides.splice(targetIndex, 0, words);
  needsUpdate.updateItem = true;
  updateState({item: item, needsUpdate: needsUpdate});
  updateHistory({type: 'update', item: item})
  setWordIndex(targetIndex);
}

export function updateSkipTitle(props){
  let {val} = props;
  let {updateState, updateHistory} = props.parent;
  let {item, needsUpdate} = props.parent.state;
  item.skipTitle = val;
  needsUpdate.updateItem = true;
  updateState({item: item, needsUpdate: needsUpdate});
  updateHistory({type: 'update', item: item})
}
