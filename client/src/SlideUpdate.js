export function setSlideBackground(background, item, wordIndex, itemIndex, allItems, itemList, updateState){

  item.slides[wordIndex].boxes[0].background = background;
  let index = allItems.findIndex(e => e.name === item.name)

  if(wordIndex === 0){
    itemList[itemIndex].background = background;
    allItems[index].background = background;
  }

  updateState({
    item: item,
    allItems: allItems,
    itemList: itemList,
    needsUpdate: true
  })
}

export function setWordIndex(index, lyrics, item, wordIndex, updateState, updateCurrent){
  let scrollTo = index;
  if(!item.slides)
    return;

  if(index > wordIndex && index+1 < item.slides.length)
    scrollTo+=1;
  if(index < wordIndex && index > 0){
    scrollTo-=1;
  }

  var mElement = document.getElementById("MSlide"+scrollTo);
  var element = document.getElementById("Slide"+index);
  if(mElement)
    mElement.scrollIntoView({behavior: "instant", block: "nearest", inline:'nearest'});
  if(element)
    element.scrollIntoView({behavior: "instant", block: "nearest", inline:'nearest'});
  updateState({wordIndex: index, needsUpdate: false});
  let fontSize = item.slides[index].boxes[0].fontSize;
  let color = item.slides[index].boxes[0].fontColor;
  let brightness = item.slides[index].boxes[0].brightness;
  let style = {
    fontColor: color,
    fontSize: fontSize,
    brightness: brightness
  }
  if(item.slides[index].boxes[0].background)
    updateCurrent({words: lyrics, style: style, background:item.slides[index].boxes[0].background});
  else
    updateCurrent({words: lyrics, style: style});
}
