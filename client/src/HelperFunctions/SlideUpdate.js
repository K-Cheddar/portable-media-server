export function setSlideBackground(props){
  let {background} = props;
  let {updateState, updateHistory} = props.parent;
  let {item, wordIndex, allItems, itemList, itemIndex, needsUpdate, boxIndex} = props.parent.state;

  let slides;
  if (item.type === 'song')
    slides = item.arrangements[item.selectedArrangement].slides || null;
  else
    slides = item.slides || null;

  slides[wordIndex].boxes[boxIndex].background = background;
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
  let {index, updateState, updateCurrent, timer} = props;
  let {item, wordIndex} = props.state;
  let slides;

  if (item.type === 'song')
    slides = item.arrangements[item.selectedArrangement].slides;
  else
    slides = item.slides;

  let scrollTo = index;

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

  updateState({wordIndex: index, boxIndex: 0});
  props.runTimer = false;
  timerUpdate(props);
}

function timerUpdate(props){
  let {index, updateCurrent, timer, runTimer} = props;
  let {item, wordIndex, freeze} = props.state;
  let slides;
  clearTimeout(timer);
  if (item.type === 'song')
    slides = item.arrangements[item.selectedArrangement].slides;
  else
    slides = item.slides;

  updateCurrent({slide: slides[index]});

  if(freeze)
    return;

  if(item.type === 'announcements'){
    let length = item.slides.length;
    let duration = item.slides[index].duration * 1000;
    runTimer = true;
    console.log(duration, index);
    if(runTimer){
      timer = setTimeout(function(){
        if(index < length-1) {
          props.index++;
          props.runTimer = true;
          timerUpdate(props)
        }
        else {
          props.index = 0;
          props.runTimer = true;
          timerUpdate(props)
        }
      },duration)
    }

  }

}
