export function setSlideBackground(props){
  let {item, wordIndex, allItems, itemList, itemIndex, needsUpdate} = props.state;
  let {background, updateState} = props;
  let slides;
  if (item.type === 'song')
    slides = item.arrangements[item.selectedArrangement].slides || null;
  else
    slides = item.slides || null;

  slides[wordIndex].boxes[0].background = background;
  let index = allItems.findIndex(e => e.name === item.name)

  if(wordIndex === 0){
    itemList[itemIndex].background = background;
    allItems[index].background = background;
    item.background = background
  }
  needsUpdate.updateItem = true;
  needsUpdate.updateAllItems = true;
  needsUpdate.updateItemList = true;
  updateState({ item: item, allItems: allItems, itemList: itemList, needsUpdate: needsUpdate})
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
