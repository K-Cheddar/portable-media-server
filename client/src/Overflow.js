export function formatSong(item){

  let slides = formatLyrics(item);
  item.slides = slides;
  for(let i = 0; i < item.formattedLyrics.length; ++i){
    let type = item.formattedLyrics[i].name
    let counter = 0;
    let songOrderCounter = 0;
    let slideSpan = 0;

    for (let j = 0; j < item.songOrder.length; j++) {
      if(type === item.songOrder[j])
        ++songOrderCounter;
    }
    for (let j = 0; j < item.slides.length; j++) {
      if(type === item.slides[j].type)
        ++counter;
    }
    if(songOrderCounter !== 0)
      slideSpan = counter/songOrderCounter;
    else
      slideSpan = counter;
    item.formattedLyrics[i].slideSpan = slideSpan;

  }
  return item;
}

// export function formatVerse(verse, fontSize, background, color){
//   return formatBibleVerses(verse, fontSize, background, color);
// }

export function formatBible(item, mode, verses){
  let box = item.slides[0].boxes[0]
  let slides = [newSlide('Bible', box, item.name)];
  if(verses)
    slides.push(...formatBibleVerses(verses, item, mode));
  else
    slides.push(...formatBibleVerses(item.slides.slice(1).map(a => a.boxes[0].words), item, mode));

  item.slides = slides;
  return item;
}

function formatBibleVerses(verses, item, mode){

  let lastSlide = item.slides.length-1;
  let lastBox = item.slides[lastSlide].boxes[0];
  let currentBox = item.slides[1].boxes[0]
  let obj = getMaxLines(currentBox.fontSize, currentBox.height);
  let maxLines = obj.maxLines;
  let lineHeight = obj.lineHeight;
  let formattedVerses = [];
  let slide = ""

  for(let i = 0; i < verses.length; ++i){
    let words;
    if(mode === 'create'){
       words = verses[i].text.split(" ");
       if(slide[slide.length-1] === ' ')
        slide = slide.substring(0, slide.length-1)
       slide += "{" + verses[i].verse + "}";
    }
    if(mode === 'edit')
      words = verses[i].split(" ")

    for (let j = 0; j < words.length; j++) {

      let update = slide + words[j]
      if(getNumLines(update, currentBox.fontSize, lineHeight, currentBox.width) <= maxLines)
        slide = update + " ";
      else{
        slide = slide.replace(/\s+/g,' ').trim();
        formattedVerses.push(newSlide('Bible', currentBox, slide))
        slide = words[j] +" ";

        if(item.slides[formattedVerses.length+1])
          currentBox = item.slides[formattedVerses.length+1].boxes[0]
        else
          currentBox = lastBox;

        obj = getMaxLines(currentBox.fontSize, currentBox.height);
        maxLines = obj.maxLines;
        lineHeight = obj.lineHeight;
      }
    }

  }
  slide = slide.replace(/\s+/g,' ').trim();
  formattedVerses.push(newSlide('Bible', currentBox, slide));
  return formattedVerses;
}

export function formatLyrics(item){
  let box = item.slides[0].boxes[0];
  let lastSlide = item.slides.length-1;
  let lastBox = item.slides[lastSlide].boxes[0];
  let slides = [newSlide('Name', box, item.name)];
  let songOrder = item.songOrder;
  let formattedLyrics = item.formattedLyrics;
  let fontSize = item.slides[1] ? item.slides[1].boxes[0].fontSize : 2.5;

  for (let i = 0; i < songOrder.length; ++i){
    let lyrics = formattedLyrics.find(e => e.name === songOrder[i]).words;
    slides.push(...formatSection(lyrics, songOrder[i]));
  }

  function formatSection(lyrics, type){
    let lines = lyrics.split("\n");
    let fLyrics = [];
    let currentBox = {}, obj = {};
    let maxLines = 0, lineHeight = 0, lineCounter = 0, counter = 0;
    let slide = "";

    for(let i = 0; i < lines.length; ++i){
      counter = 0;
      lineCounter = 0;
      slide= "";

      if(item.slides[slides.length+fLyrics.length])
        currentBox = item.slides[slides.length+fLyrics.length].boxes[0]
      else
        currentBox = lastBox;

      obj = getMaxLines(fontSize, currentBox.height);
      maxLines = obj.maxLines;
      lineHeight = obj.lineHeight;

      while(i+counter < lines.length && lineCounter < maxLines){
        if(i+counter< lines.length-1)
          slide+=lines[i+counter]+"\n";
        else
          slide+=lines[i+counter]
        let lineCount = getNumLines(lines[i+counter], fontSize, lineHeight, currentBox.width);
        if(lineCount === 0)
          lineCount = 1;
        lineCounter+=lineCount;
        counter++;
      }

      i+=counter-1;
      if(slide === "")
        slide = " ";
      fLyrics.push(newSlide(type, currentBox, slide, {fontSize: fontSize, slideIndex: fLyrics.length}))
    }
    return fLyrics;
  }
  slides.push(newSlide('blank', lastBox, ' '))
  return slides;
}

function getMaxLines(fontSize, height){
  fontSize = fontSize + "vw"
  let windowWidth = window.innerWidth;

  if(!height)
    height = 86
  else
    height*=.86;
  height /= 100; // % -> decimal
  height = height*windowWidth*.239 //Height of Display Editor = 23.9vw

  let singleSpan = document.createElement("singleSpan");
  singleSpan.innerHTML="Only Line";
  singleSpan.style.fontSize = fontSize;
  singleSpan.style.fontFamily = 'Verdana';
  singleSpan.style.position = 'fixed';
  document.body.appendChild(singleSpan);
  let lineHeight = singleSpan.offsetHeight
  document.body.removeChild(singleSpan);

  let maxLines = Math.floor(height/lineHeight)
  let obj = {maxLines: maxLines, lineHeight: lineHeight}
  return obj;
}

function getNumLines(text, fontSize, lineHeight, width){
  fontSize = fontSize + "vw"
  let windowWidth = window.innerWidth;
  if(!width)
    width = 90
  else
    width*=.90
  width /= 100;
  width= width*windowWidth*.425 //Width of Display Editor = 42.5vw

  let textSpan = document.createElement("textSpan");
  textSpan.innerHTML=text;
  textSpan.style.fontSize = fontSize;
  textSpan.style.fontFamily = 'Verdana';
  textSpan.style.whiteSpace = 'pre-wrap';
  textSpan.style.width = width + 'px';
  textSpan.style.position = 'fixed';
  // textSpan.style.zIndex = 10;
  document.body.appendChild(textSpan);
  let textSpanHeight = textSpan.offsetHeight;
  document.body.removeChild(textSpan);

  let lines = Math.floor(textSpanHeight/lineHeight)
  return lines;
}

function newSlide (type, box, newWords, extras){

  let obj = {
    type: type,
    boxes: [
      {background: box.background,
       fontSize: box.fontSize,
       fontColor: box.fontColor,
       words: newWords,
       brightness: box.brightness,
       height: box.height,
       width: box.width,
       x: box.x,
       y: box.y,
      }
    ]
  }
  if(!extras)
    return obj

  if(extras.slideIndex >= 0){
    obj.boxes[0].slideIndex = extras.slideIndex
  }
  if(extras.fontSize){
    obj.boxes[0].fontSize = extras.fontSize
  }

  return obj;

}
