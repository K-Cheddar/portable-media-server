export function newSlide (props) {
  let {type, box, words, slideIndex, fontSize, background} = props;
  if(!words)
    words = ''
  if(!box)
    box = {brightness: 100, height: 100, width: 100, x: 0, y: 0, fontSize: fontSize,
      background: '', fontColor: 'rgba(255, 255, 255, 1)'}
  // console.log("BOX", box);
  let obj = {
    type: type,
    boxes: [
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

  if(slideIndex >= 0){
    obj.boxes[0].slideIndex = slideIndex
  }
  if(fontSize){
    obj.boxes[0].fontSize = fontSize
  }
  if(background){
    obj.boxes[0].background = background
  }

  return obj;

}
