import * as Sort from './Sort'
import * as Overflow from './Overflow'

export function setItemBackground(props){
  let {item, itemIndex, itemList, allItems, needsUpdate} = props.state;
  let {background, updateState} = props;
  if(!item.slides)
    return;

  let index = allItems.findIndex(e => e.name === item.name)
  //set all slides to match item background
  for (var i = 0; i < item.slides.length; i++) {
    item.slides[i].boxes[0].background = background;
  }
  //update Item background in all places
  itemList[itemIndex].background = background;
  allItems[index].background = background;

  needsUpdate.updateItem = true;
  needsUpdate.updateItemList = true;
  needsUpdate.updateAllItems = true;
  updateState({item: item, itemList: itemList, allItems: allItems, needsUpdate: needsUpdate})
}

export function setItemIndex(props){
  let {index, updateState} = props;
  var mElement = document.getElementById("MItem"+index);
  var element = document.getElementById("Item"+index);
  if(mElement)
    mElement.scrollIntoView({behavior: "smooth", block: "center", inline:'center'})
  if(element)
    element.scrollIntoView({behavior: "instant", block: "nearest", inline: "nearest"});
  updateState({itemIndex: index})
}

export function updateItem(props){
  let {itemList, allItems, needsUpdate, wordIndex} = props.state;
  let oldItem = props.state.item;
  let {updateState, item} = props;

  let fontColor = item.slides[0].boxes[0].fontColor;
  let name = item.name
  let itemIndex = itemList.findIndex(e => e._id === item._id)
  if(itemIndex !== -1 && (itemList[itemIndex].nameColor !== fontColor || itemList[itemIndex].name !== name)){
    itemList[itemIndex].nameColor = fontColor;
    itemList[itemIndex].name = name;
    needsUpdate.updateItemList = true;
    updateState({itemList: itemList})
  }
  allItems = Sort.sortNamesInList(allItems)
  let index = allItems.findIndex(e => e._id === item._id)
  if(index !== -1 && (allItems[index].nameColor !== fontColor || allItems[index].name !== name)){
    allItems[index].nameColor = fontColor;
    allItems[index].name = name;
    needsUpdate.updateAllItems = true;
    updateState({allItems: allItems})
  }
  if(item.type === 'song')
    item = Overflow.formatSong(item, oldItem, wordIndex)
  if(item.type === 'bible')
    item = Overflow.formatBible(item, 'edit')
  needsUpdate.updateItem = true;
  updateState({item: item, needsUpdate: needsUpdate})
}

export function insertWords(props){
  let {item, wordIndex, needsUpdate} = props.state;
  let {targetIndex, setWordIndex, updateState} = props;
  let words = item.slides[wordIndex].boxes[0].words;
  item.slides.splice(wordIndex, 1);
  item.slides.splice(targetIndex, 0, words);
  needsUpdate.updateItem = true;
  updateState({item: item, needsUpdate: needsUpdate});
  setWordIndex(targetIndex);
}
