export function setSlideBackground(props){
  let {item, wordIndex, allItems, itemList, itemIndex} = props.state;
  let {background, updateState} = props;
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

export function setWordIndex(props){
  let {index, updateState, updateCurrent} = props;
  let {item, wordIndex} = props.state;
  let lyrics = item.slides[index].boxes[0].words;

  let scrollTo = index;
  if(!item.slides)
    return;

  if(index > wordIndex && index+1 < item.slides.length)
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
  updateState({wordIndex: index, needsUpdate: false});
  let box = item.slides[index].boxes[0];
  let fontSize = box.fontSize;
  let color = box.fontColor;
  let brightness = box.brightness;
  let width = box.width;
  let height = box.height;
  let x = box.x;
  let y = box.y
  let style = {
    fontColor: color,
    fontSize: fontSize,
    brightness: brightness,
    width: width,
    height: height,
    x: x,
    y: y,
  }
  if(item.slides[index].boxes[0].background)
    updateCurrent({words: lyrics, style: style, background:item.slides[index].boxes[0].background});
  else
    updateCurrent({words: lyrics, style: style});
}
