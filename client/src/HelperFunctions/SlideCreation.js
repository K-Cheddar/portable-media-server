export function newSlide (props) {
  let {type, box, words, slideIndex, fontSize, background, brightness, boxes, textFontSize, title} = props;
  if(!words)
    words = ' '
  if(!box)
    box = {brightness: 100, height: 100, width: 100, x: 0, y: 0, fontSize: fontSize,
      background: '', fontColor: 'rgba(255, 255, 255, 1)'}
  if(!boxes){
    boxes = [
      {background: box.background,
       fontSize: box.fontSize,
       fontColor: box.fontColor,
       words: words,
       brightness: box.brightness,
       height: box.height,
       width: box.width,
       x: box.x,
       y: box.y,
      }
    ]
  }
  if(type === 'Announcement'){
    boxes = [];
    let obj = Object.assign({}, box);
    obj.words = ' ';
    boxes.push(obj);
    obj = Object.assign({}, box);
    obj.height = 23
    obj.fontSize = 2.1;
    obj.fontColor = 'rgba(255, 251, 43, 1)';
    obj.transparent = true;
    obj.topMargin = 1;
    obj.sideMargin = 2.5;
    obj.excludeFromOverflow = true;
    obj.words = title || ' ';
    boxes.push(obj);
    obj = Object.assign({}, box);
    obj.height = 77;
    obj.y = 23;
    obj.fontSize = textFontSize || 1.9;
    obj.textAlign = 'left';
    obj.transparent = true;
    obj.topMargin = 1;
    obj.sideMargin = 2.5;
    obj.excludeFromOverflow = true;
    obj.words = words || ' '
    boxes.push(obj);
  }

  let obj = {
    type: type,
    boxes: JSON.parse(JSON.stringify(boxes))
  }

  if(type === 'Announcement')
    obj.duration = 10;
  if(type === 'Announcement Title')
    obj.duration = 5;

  if(slideIndex >= 0)
      obj.boxes[0].slideIndex = slideIndex
  if(fontSize)
      obj.boxes[0].fontSize = fontSize
  if(background)
      obj.boxes[0].background = background
  if(brightness)
      obj.boxes[0].brightness = brightness

  return obj;

}
