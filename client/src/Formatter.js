export function formatSong(item){
  let words = formatLyrics(item.name, item.songOrder, item.formattedLyrics, item.style.fontSize);
  for (let i = 0; i < words.length; i++) {
    if(item.words[i])
      words[i].background = item.words[i].background
  }
  item.words = words;
  for(let i = 0; i < item.formattedLyrics.length; ++i){
    let type = item.formattedLyrics[i].name
    let counter = 0;
    let songOrderCounter = 0;
    let slideSpan = 0;

    for (let j = 0; j < item.songOrder.length; j++) {
      if(type === item.songOrder[j])
        ++songOrderCounter;
    }
    for (let j = 0; j < item.words.length; j++) {
      if(type === item.words[j].type)
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

export function formatBible(item, mode, verses){
  let words = [{type: 'bible', words:item.name}]
  if(verses)
    words.push(...formatBibleVerses(verses, item.style.fontSize, mode));
  else
    words.push(...formatBibleVerses(item.words.slice(1).map(a => a.words), item.style.fontSize, mode));
  item.words = words;
  return item;
}

function formatBibleVerses(verses, fontSize, mode){

    let maxLines = getNumLines("verses", fontSize).maxLines;
    let formattedVerses = [];
    let slide = ""
    for(let i = 0; i < verses.length; ++i){
      let words;
      if(mode === 'create'){
         words = verses[i].text.split(" ");
         slide += verses[i].verse + " ";
      }
      if(mode === 'edit')
        words = verses[i].split(" ")

      for (let j = 0; j < words.length; j++) {

        let update = slide + words[j] +" ";
        let lines = getNumLines(update, fontSize).lines;
        if(lines <= maxLines)
          slide = update;
        else{
          slide = slide.replace(/\s+/g,' ').trim();
          formattedVerses.push({type: 'bible', words:slide});
          slide = words[j] +" ";
        }
      }

    }
    slide = slide.replace(/\s+/g,' ').trim();
    formattedVerses.push({type: 'bible', words:slide});
    return formattedVerses;
}

export function formatLyrics(name, songOrder, formattedLyrics, fontSize){
  let words = [{type: 'Name', words: name}];
  let counter = 0;
  let lineCounter = 0;

  for (let i = 0; i < songOrder.length; ++i){
    let lyrics = formattedLyrics.find(e => e.name === songOrder[i]).words;
    words.push(...formatSection(lyrics, songOrder[i]));
    // console.log(words);
  }

  function formatSection(lyrics, type){
    let fLyrics = [];
    let obj = getNumLines(lyrics, fontSize);
    let maxLines = obj.maxLines;
    if(maxLines > 8)
      maxLines--;

    let lines = lyrics.split("\n");
    for(let i = 0; i < lines.length; ++i){
        counter = 0;
        lineCounter = 0;
        let slide = "";
        while(i+counter < lines.length && lineCounter < maxLines){
          if(i+counter< lines.length-1)
            slide+=lines[i+counter]+"\n";
          else
            slide+=lines[i+counter]
          let lineCount = getNumLines(lines[i+counter], fontSize).lines;
          if(lineCount === 0)
            lineCount = 1;
          lineCounter+=lineCount;
          counter++;
        }

        i+=counter-1;
        if(slide === "")
          slide = " "
        fLyrics.push({type: type, words: slide, slideIndex:fLyrics.length})
    }
    return fLyrics;
  }
  words.push({words: ' '})
  return words;
}


function getNumLines(text, fontSize){
  fontSize = fontSize*.95 + "vw"
  let height = document.getElementById('displayEditor').style.height;
  height = height.slice(0, height.length-2);
  height = parseFloat(height);
  let width = document.getElementById('displayEditor').style.width;
  width = width.slice(0, width.length-2);
  width = parseFloat(width);
  let windowHeight = window.innerHeight;
  let h = height*.01*windowHeight;//.85 is because there is 7.5% padding all around + a little wiggle room

  let textSpan = document.createElement("textSpan");
  textSpan.innerHTML=text;
  textSpan.style.fontSize = fontSize;
  textSpan.style.fontStyle = document.getElementById('displayEditor').style.fontStyle;
  textSpan.style.whiteSpace = 'pre-wrap';
  textSpan.style.width = (width*0.85)+'vw'
  textSpan.style.position = 'fixed'
  document.body.appendChild(textSpan);
  let textSpanHeight = textSpan.offsetHeight;

  let singleSpan = document.createElement("singleSpan");
  singleSpan.innerHTML="Only Line";
  singleSpan.style.fontSize = fontSize;
  singleSpan.style.fontStyle = document.getElementById('displayEditor').style.fontStyle;
  singleSpan.style.position = 'fixed'

  document.body.appendChild(singleSpan);
  let singleSpanHeight = singleSpan.offsetHeight

  let lines = Math.floor(textSpanHeight/singleSpanHeight)
  let maxLines = Math.floor(h/singleSpanHeight)
  document.body.removeChild(textSpan);
  document.body.removeChild(singleSpan);
  let obj = {lines: lines, maxLines: maxLines}
  return obj;
}
