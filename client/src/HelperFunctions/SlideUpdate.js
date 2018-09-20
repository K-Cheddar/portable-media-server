export function setSlideBackground(props){
  let {background} = props;
  let {updateState, updateHistory} = props.parent;
  let {item, wordIndex, allItems, itemList, itemIndex, needsUpdate} = props.parent.state;

  let slides;
  if (item.type === 'song')
    slides = item.arrangements[item.selectedArrangement].slides || null;
  else
    slides = item.slides || null;

  slides[wordIndex].boxes[0].background = background;
  let index = allItems.findIndex(e => e.name === item.name)

  needsUpdate.updateItem = true;

  if(wordIndex === 0){
    itemList[itemIndex].background = background;
    allItems[index].background = background;
    item.background = background;
    needsUpdate.updateAllItems = true;
    needsUpdate.updateItemList = true;
    updateHistory({type: 'update', item: item, itemList: itemList})
    updateState({allItems: allItems, itemList: itemList, needsUpdate: needsUpdate})
  }
  else{
    updateHistory({type: 'update', item: item})
    updateState({ item: item, needsUpdate: needsUpdate})
  }

}

export function setWordIndex(props){
  let {index, updateState, updateCurrent} = props;
  let {item, wordIndex} = props.state;
  let slides;
  if (item.type === 'song')
    slides = item.arrangements[item.selectedArrangement].slides || null;
  else
    slides = item.slides || null;

  let lyrics = slides[index].boxes[0].words;

  let scrollTo = index;
  if(!slides)
    return;

  if(index > wordIndex && index+1 < slides.length)
    scrollTo+=1;
  if(index < wordIndex && index > 0){
    scrollTo-=1;
  }

  var mElement = document.getElementById("MSlide"+scrollTo);
  var element = document.getElementById("Slide"+scrollTo);
  if(mElement)
    mElement.scrollIntoView({behavior: "instant", block: "nearest", inline:'nearest'});
  if(element)
    element.scrollIntoView({behavior: "instant", block: "nearest", inline:'nearest'});
  updateState({wordIndex: index});
  let box = slides[index].boxes[0];
  if(box.background)
    updateCurrent({words: lyrics, style: box, background: box.background});
  else
    updateCurrent({words: lyrics, style: box});
}
