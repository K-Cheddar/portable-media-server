import * as Overflow from './Overflow';

export function updateFontSize(props){

    let {item, itemList, itemIndex, allItems, wordIndex, boxIndex} = props.state;
    let {fontSize, updateState} = props;

    let slides = item.slides || null;
    let slide = slides ? slides[wordIndex] : null;

    if(!slide)
      return

    if(boxIndex === 0){
      if(wordIndex !== 0)
        for(let i = 1; i < item.slides.length; ++i)
            item.slides[i].boxes[0].fontSize = fontSize;
      else
        item.slides[0].boxes[0].fontSize = fontSize;
    }

    if(item.type === 'bible' && wordIndex !== 0)
      item = Overflow.formatBible(item, 'edit');

    if(item.type === 'song' && wordIndex !== 0)
      item = Overflow.formatSong(item);

    if(wordIndex >= item.slides.length)
      wordIndex = item.slides.length-1

    updateState({
      item: item,
      wordIndex: wordIndex,
      needsUpdate: true
    });

}

export function updateFontColor(props){

    let {item, itemList, itemIndex, allItems, wordIndex, boxIndex} = props.state;
    let {updateState} = props;
    let c = props.fontColor;

    let color = 'rgba('+c.r+' , ' +c.g+' , '+c.b+' , '+c.a+')';;
    let slides = item.slides || null;
    let slide = slides ? slides[wordIndex] : null;

    if(!slide)
      return

    slide.boxes[0].fontColor = color;
    let index = allItems.findIndex(e => e._id === item._id)

    let background = slide.boxes[boxIndex].background;

    for(let i = 0; i < slides.length; ++i){
      if(slides[i].boxes[boxIndex].background === background){
        slides[i].boxes[boxIndex].fontColor = color;
        if(i === 0)
          {
            itemList[itemIndex].nameColor = color
            allItems[index].nameColor = color
          }
      }
    }


    if(wordIndex === 0 && boxIndex === 0){
      //update color of item in current list
      itemList[itemIndex].nameColor = color
      //update color of item in full list
      allItems[index].nameColor = color
    }

    if(item.type === 'bible' && wordIndex !== 0){
      for(let i = 1; i < item.slides.length; ++i){
        item.slides[i].boxes[0].fontColor = color;
      }
    }

    updateState({
      item: item,
      itemList: itemList,
      allItems: allItems,
      needsUpdate: true
    });


}

export function updateBrightness(props){
    let {item, wordIndex, boxIndex} = props.state;
    let {level, updateState} = props;
    let slides = item.slides || null;
    let slide = slides ? slides[wordIndex] : null;

    if(!slide)
      return

    slide.boxes[boxIndex].brightness = level;
    let background = slide.boxes[boxIndex].background;

    for(let i = 0; i < slides.length; ++i){
      if(slides[i].boxes[boxIndex].background === background)
        slides[i].boxes[boxIndex].brightness = level
    }

    updateState({
      item: item,
      needsUpdate: true
    });

}

export function updateBoxPosition(props){
  let {item, wordIndex, boxIndex} = props.state;
  let {x, y, width, height, applyAll, match} = props.position;
  if(match){
    let box = item.slides[wordIndex].boxes[0];
    x = box.x;
    y = box.y;
    width = box.width;
    height = box.height;
  }

  if (!applyAll){
    let box = item.slides[wordIndex].boxes[0];
    box.x = x;
    box.y = y;
    box.width = width;
    box.height = height;
  }
  else{
    for(let i = 1; i < item.slides.length; ++i){
      let box = item.slides[i].boxes[0];
      box.x = x;
      box.y = y;
      box.width = width;
      box.height = height;
    }
  }

  props.updateItem(item);
}
