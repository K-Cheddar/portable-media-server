export function newSlide (props) {
  let {type, box, words, slideIndex, fontSize, background, brightness, boxes, textFontSize} = props;
  if(!words)
    words = ''
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
    boxes.push(obj);
    obj = Object.assign({}, box);
    obj.height = 24
    obj.fontSize = 2.1;
    obj.fontColor = 'rgba(255, 251, 43, 1)';
    obj.transparent = true;
    obj.topMargin = 2.5;
    obj.excludeFromOverflow = true;
    obj.words = '';
    boxes.push(obj);
    obj = Object.assign({}, box);
    obj.height = 76;
    obj.y = 24;
    obj.fontSize = textFontSize ? textFontSize : 1.5;
    obj.textAlign = 'left';
    obj.transparent = true;
    obj.topMargin = 1;
    obj.excludeFromOverflow = true;
    obj.words = ''
    boxes.push(obj);
  }

  let obj = {
    type: type,
    boxes: JSON.parse(JSON.stringify(boxes)),
    duration: 6,
  }

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
