import * as Helper from './Helper'

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

export function formatLyrics(item){
  let box = item.slides[0].boxes[0];
  let lastSlide = item.slides.length-1;
  let lastBox = item.slides[lastSlide].boxes[0];
  let slides = [Helper.newSlide({type: 'Name', box: box, words: box.words})];
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
      fLyrics.push(Helper.newSlide({type: type, box: currentBox, words: slide, fontSize: fontSize, slideIndex: fLyrics.length}))
    }
    return fLyrics;
  }
  slides.push(Helper.newSlide({type: 'blank', box: lastBox, words: ' '}))
  return slides;
}

// export function formatVerse(verse, fontSize, background, color){
//   return formatBibleVerses(verse, fontSize, background, color);
// }

export function formatBible(item, mode, verses, fit){
  let box = item.slides[0].boxes[0]
  let slides = [Helper.newSlide({type: 'Bible', box: box, words: box.words})];
  if(verses)
    slides.push(...formatBibleVerses(verses, item, mode));
  else
    slides.push(...formatBibleVerses(item.slides.slice(1).map(a => a.boxes[0].words), item, mode));

  item.slides = slides;
  return item;
}

function formatBibleVerses(verses, item, mode){

  let currentSlide = item.slides[1];
  let currentBox = currentSlide.boxes[0]
  let obj = getMaxLines(currentBox.fontSize, currentBox.height);
  let maxLines = obj.maxLines;
  let lineHeight = obj.lineHeight;
  let formattedVerses = [];
  let slide = "";
  let type = item.slides[1].type;
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
           formattedVerses.push(Helper.newSlide({type: 'Verse '+(verses[i].verse), box: currentBox, words: slide}))
           slide = words[j] +" ";
         }
       }
       formattedVerses.push(Helper.newSlide({type: 'Verse '+(verses[i].verse), box: currentBox, words: slide}))
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
             currentBox.fontSize = currentBox.fontSize - 0.15;
             obj = getMaxLines(currentBox.fontSize, currentBox.height);
             maxLines = obj.maxLines;
             lineHeight = obj.lineHeight;
             formattedVerses = [];
             slide = "";
             break verseLoop;
           }
         }
         formattedVerses.push(Helper.newSlide({type: 'Verse '+(verses[i].verse), box: currentBox, words: slide}))
         fitProcessing = false;
      }
    }

  }

  if(mode === 'edit'){
    for (let i = 1; i < item.slides.length; ++i){
      currentSlide = item.slides[i];
      currentBox = currentSlide.boxes[0];
      let words = currentBox.words.split(" ");;
      if(type !== currentSlide.type){
        slide = slide.replace(/\s+/g,' ').trim();
        formattedVerses.push(Helper.newSlide({type: type, box: currentBox, words: slide}))
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
          formattedVerses.push(Helper.newSlide({type: type, box: currentBox, words: slide}))
          slide = words[j] +" ";
          }
      }

    }
    slide = slide.replace(/\s+/g,' ').trim();
    formattedVerses.push(Helper.newSlide({type: 'Bible', box: currentBox, words: slide}));
  }

  formattedVerses.push(Helper.newSlide({type: 'blank', box: currentBox, words: ' '}));
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
