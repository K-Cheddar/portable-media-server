import * as Sort from './Sort'
import * as Overflow from './Overflow'

export function setItemBackground(props){
  let {item, itemIndex, itemList, allItems} = props.state;
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

  updateState({item: item, itemList: itemList, allItems: allItems})
}

export function setItemIndex(props){
  let {index, updateState} = props;
  var mElement = document.getElementById("MItem"+index);
  var element = document.getElementById("Item"+index);
  if(mElement)
    mElement.scrollIntoView({behavior: "smooth", block: "center", inline:'center'})
  if(element)
    element.scrollIntoView({behavior: "instant", block: "nearest", inline: "nearest"});
  updateState({itemIndex: index, needsUpdate: false})
}

export function updateItem(props){
  let {itemList, itemIndex, allItems, wordIndex} = props.state;
  let {updateState, item} = props;

  itemList[itemIndex].name = item.name;
  allItems = Sort.sortNamesInList(allItems)
  let index = allItems.findIndex(e => e._id === item._id)
  allItems[index].name = item.name;

  if(item.type === 'song')
    item = Overflow.formatSong(item)
  if(item.type === 'bible')
    item = Overflow.formatBible(item, 'edit')

  updateState({item: item, itemList: itemList, allItems: allItems});
}

export function insertWords(props){
  let {item, wordIndex} = props.state;
  let {targetIndex, setWordIndex, updateState} = props;
  let words = item.slides[wordIndex].boxes[0].words;
  item.slides.splice(wordIndex, 1);
  item.slides.splice(targetIndex, 0, words);
  updateState({item: item});
  setWordIndex(targetIndex);
}
