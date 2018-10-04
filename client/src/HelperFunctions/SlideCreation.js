export function newSlide (props) {
  let {type, box, words, slideIndex, fontSize, background, brightness, boxIndex, boxes} = props;
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
  let obj = {
    type: type,
    boxes: boxes
  }

  if(slideIndex >= 0){
    obj.boxes[boxIndex].slideIndex = slideIndex
  }
  if(fontSize){
    obj.boxes[boxIndex].fontSize = fontSize
  }
  if(background){
    obj.boxes[boxIndex].background = background
  }
  if(brightness){
    obj.boxes[boxIndex].brightness = brightness
  }

  return obj;

}
