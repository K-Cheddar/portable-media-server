import * as SlideCreation from './SlideCreation'

export function formatSong(item){

  let newSlides = formatLyrics(item);

  item.arrangements[item.selectedArrangement].slides = newSlides;

  let slides = item.arrangements[item.selectedArrangement].slides;

  let formattedLyrics = item.arrangements[item.selectedArrangement].formattedLyrics;
  let songOrder = item.arrangements[item.selectedArrangement].songOrder;
  for(let i = 0; i < formattedLyrics.length; ++i){
    let type = formattedLyrics[i].name
    let counter = 0;
    let songOrderCounter = 0;
    let slideSpan = 0;

    for (let j = 0; j < songOrder.length; j++) {
      if(type === songOrder[j])
        ++songOrderCounter;
    }
    for (let j = 0; j < slides.length; j++) {
      if(type === slides[j].type)
        ++counter;
    }
    if(songOrderCounter !== 0)
      slideSpan = counter/songOrderCounter;
    else
      slideSpan = counter;
    formattedLyrics[i].slideSpan = slideSpan;

  }
  return item;
}

export function formatLyrics(item){

  let slides = item.arrangements[item.selectedArrangement].slides || null;

  let boxes = slides[0].boxes;
  let lastSlide = slides.length-1;
  let lastBoxes = slides[lastSlide].boxes;
  let newSlides = [SlideCreation.newSlide({type: 'Title', boxes: slides[0].boxes, words: boxes[0].words})];
  let songOrder = item.arrangements[item.selectedArrangement].songOrder;
  let formattedLyrics = item.arrangements[item.selectedArrangement].formattedLyrics;
  let fontSize = slides[1] ? slides[1].boxes[0].fontSize : 2.5;

  for (let i = 0; i < songOrder.length; ++i){
    let lyrics = formattedLyrics.find(e => e.name === songOrder[i]).words;
    newSlides.push(...formatSection(lyrics, songOrder[i]));
  }

  function formatSection(lyrics, type){
    let lines = lyrics.split("\n");
    let fLyrics = [], currentBoxes = [], boxes=[];
    let lineContainer = {}, box = {};
    let maxLines = 0, lineHeight = 0, lineCounter = 0, counter = 0;
    let boxWords = "";

    for(let i = 0; i < lines.length; ++i){
      counter = 0;
      lineCounter = 0;
      boxWords= "";
      boxes=[];

      if(slides[newSlides.length+fLyrics.length])
        currentBoxes = slides[newSlides.length+fLyrics.length].boxes;
      else
        currentBoxes = lastBoxes;

      for(let j = 0; j < currentBoxes.length; ++j){
        lineContainer = getMaxLines(fontSize, currentBoxes[j].height)
        maxLines = lineContainer.maxLines;
        lineHeight = lineContainer.lineHeight;

        while(i+counter < lines.length && lineCounter < maxLines){
          boxWords+=lines[i+counter];
          if(i+counter < lines.length-1)
            boxWords+="\n";

          let lineCount = getNumLines(lines[i+counter], fontSize, lineHeight, currentBoxes[j].width);
          if(lineCount === 0)
            lineCount = 1;
          lineCounter+=lineCount;
          counter++;
        }
        box = Object.assign({}, currentBoxes[j]);
        if(boxWords === "")
          boxWords = " ";
        box.words = boxWords;
        boxes.push(box)
      }
      i+=counter-1;
      fLyrics.push(SlideCreation.newSlide({type: type, boxes: boxes, fontSize: fontSize, slideIndex: fLyrics.length}))
    }
    return fLyrics;
  }
  newSlides.push(SlideCreation.newSlide({type: 'blank', box: lastBoxes[0], words: ' '}))
  return newSlides;
}

export function formatBible(item, mode, verses, fit){
  let slides = item.slides;
  let box = slides[0].boxes[0]
  let newSlides = [SlideCreation.newSlide({type: 'Bible', box: box, words: box.words})];
  if(verses)
    newSlides.push(...formatBibleVerses(verses, item, mode));
  else
    newSlides.push(...formatBibleVerses('', item, mode));

  item.slides = newSlides;
  return item;
}

function formatBibleVerses(verses, item, mode){
  let slides = item.slides
  let currentSlide = slides[1];
  let currentBox = currentSlide.boxes[0]
  let obj = getMaxLines(currentBox.fontSize, currentBox.height);
  let maxLines = obj.maxLines;
  let lineHeight = obj.lineHeight;
  let formattedVerses = [];
  let slide = "";
  let type = slides[1].type;
  let fitProcessing = true;

  if (mode === 'create'){
    for(let i = 0; i < verses.length; ++i){
      let words = verses[i].text.split(" ");
       if(slide[slide.length-1] === ' ')
        slide = slide.substring(0, slide.length-1)
       slide += "{" + verses[i].verse + "}";

       for (let j = 0; j < words.length; j++) {
         let update = slide + words[j]
         if(getNumLines(update, currentBox.fontSize, lineHeight, currentBox.width) <= maxLines)
           slide = update + " ";
         else{
           slide = slide.replace(/\s+/g,' ').trim();
           formattedVerses.push(SlideCreation.newSlide({type: 'Verse '+(verses[i].verse), box: currentBox, words: slide}))
           slide = words[j] +" ";
         }
       }
       formattedVerses.push(SlideCreation.newSlide({type: 'Verse '+(verses[i].verse), box: currentBox, words: slide}))
       slide = " ";
    }
  }

  if (mode === 'fit'){
    while(fitProcessing){
      verseLoop: for(let i = 0; i < verses.length; ++i){
        let words = verses[i].text.split(" ");
         if(slide[slide.length-1] === ' ')
          slide = slide.substring(0, slide.length-1)
         slide += "{" + verses[i].verse + "}";

         for (let j = 0; j < words.length; j++) {
           let update = slide + words[j]
           if(getNumLines(update, currentBox.fontSize, lineHeight, currentBox.width) <= maxLines)
             slide = update + " ";
           else{
             currentBox.fontSize = currentBox.fontSize - 0.10;
             obj = getMaxLines(currentBox.fontSize, currentBox.height);
             maxLines = obj.maxLines;
             lineHeight = obj.lineHeight;
             formattedVerses = [];
             slide = "";
             break verseLoop;
           }
         }
         formattedVerses.push(SlideCreation.newSlide({type: 'Verse '+(verses[i].verse), box: currentBox, words: slide}))
         fitProcessing = false;
      }
    }

  }

  if(mode === 'edit'){
    for (let i = 1; i < slides.length; ++i){
      currentSlide = slides[i];
      currentBox = currentSlide.boxes[0];
      let words = currentBox.words.split(" ");
      if(type !== currentSlide.type){
        slide = slide.replace(/\s+/g,' ').trim();
        formattedVerses.push(SlideCreation.newSlide({type: type, box: currentBox, words: slide}))
        slide = "";
      }
      type = currentSlide.type;
      obj = getMaxLines(currentBox.fontSize, currentBox.height);
      maxLines = obj.maxLines;
      lineHeight = obj.lineHeight;

      for (let j = 0; j < words.length; j++) {
          let update = slide + words[j]
        if(getNumLines(update, currentBox.fontSize, lineHeight, currentBox.width) <= maxLines)
          slide = update + " ";
        else{
          slide = slide.replace(/\s+/g,' ').trim();
          formattedVerses.push(SlideCreation.newSlide({type: type, box: currentBox, words: slide}))
          slide = words[j] +" ";
          }
      }
    }
  }

  formattedVerses.push(SlideCreation.newSlide({type: 'blank', box: currentBox, words: ' '}));
  return formattedVerses;
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
