export function formatSong(item){
  let name = item.name;
  let songOrder = item.songOrder;
  let formattedLyrics = item.formattedLyrics;
  let fontSize = item.slides[1] ? item.slides[1].boxes[0].fontSize : 2.5;
  let nameSize = item.slides[0].boxes[0].fontSize;
  let slides = formatLyrics(name, songOrder, formattedLyrics, fontSize, nameSize);
  for (let i = 0; i < slides.length; i++) {
    if(item.slides[i]){
      slides[i].boxes[0].background = item.slides[i].boxes[0].background
      slides[i].boxes[0].fontColor = item.slides[i].boxes[0].fontColor
    }
    else{
      slides[i].boxes[0].background = item.slides[0].boxes[0].background
      slides[i].boxes[0].fontColor = 'rgba(255, 255, 255, 1)'
    }

  }
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
  let initFontSize = 2.5
  let slides = [
            {
              type: 'Bible',
              boxes: [
                {background: item.slides[0].boxes[0].background,
                 fontSize: item.slides[0].boxes[0].fontSize,
                 fontColor: item.slides[0].boxes[0].fontColor,
                 words: item.name,
                }
              ]
            }
          ]
  if(verses)
    slides.push(...formatBibleVerses(verses, initFontSize, item.slides[0].boxes[0].background, item.slides[0].boxes[0].fontColor, mode));
  else
    slides.push(...formatBibleVerses(item.slides.slice(1).map(a => a.boxes[0].words), item.slides[1].boxes[0].fontSize, item.slides[0].boxes[0].background, item.slides[0].boxes[0].fontColor, mode));

  item.slides = slides;
  return item;
}

function formatBibleVerses(verses, fontSize, background, fontColor, mode){

    let maxLines = getNumLines("verses", fontSize).maxLines;
    let formattedVerses = [];
    let slide = ""
    for(let i = 0; i < verses.length; ++i){
      let words;
      if(mode === 'create'){
         words = verses[i].text.split(" ");
         slide += "{" + verses[i].verse + "} ";
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
          formattedVerses.push({
                          type: 'Bible',
                          boxes: [
                            {background: background,
                             fontSize: fontSize,
                             fontColor: fontColor,
                             words: slide,
                            }
                          ]
                        })
          slide = words[j] +" ";
        }
      }

    }
    slide = slide.replace(/\s+/g,' ').trim();
    formattedVerses.push({
                    type: 'Bible',
                    boxes: [
                      {background: background,
                       fontSize: fontSize,
                       fontColor: fontColor,
                       words: slide,
                      }
                    ]
                  });
    return formattedVerses;
}

export function formatLyrics(name, songOrder, formattedLyrics, fontSize, nameSize){
  let slides = [
            {
              type: 'Name',
              boxes: [
                {
                 fontSize: nameSize,
                 words: name,
                }
              ]
            }
          ]
  let counter = 0;
  let lineCounter = 0;

  for (let i = 0; i < songOrder.length; ++i){
    let lyrics = formattedLyrics.find(e => e.name === songOrder[i]).words;
    slides.push(...formatSection(lyrics, songOrder[i]));
  }

  function formatSection(lyrics, type){
    let fLyrics = [];
    let obj = getNumLines(lyrics, fontSize);
    let maxLines = obj.maxLines;
    // if(!maxLines)
    //   return
    if(maxLines >= 7)
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
        fLyrics.push({
                  type: type,
                  boxes: [
                    {
                     fontSize: fontSize,
                     words: slide,
                     slideIndex: fLyrics.length
                    }
                  ]
                })

    }
    return fLyrics;
  }
  slides.push({
            type: 'end',
            boxes: [
              {
               fontSize: fontSize,
               words: ' ',
              }
            ]
          })
  return slides;
}


function getNumLines(text, fontSize){
  fontSize = fontSize + "vw"
  // let height = document.getElementById('displayEditor').style.height;
  let height = 23.9*.825
  // height = height.slice(0, height.length-1);
  // height = parseFloat(height);
  // let width = document.getElementById('displayEditor').style.width;
  let width = 42.5*.9
  // width = width.slice(0, width.length-1);
  // width = parseFloat(width);
  // let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;
  let h = height*.01*windowWidth;//

  let textSpan = document.createElement("textSpan");
  textSpan.innerHTML=text;
  textSpan.style.fontSize = fontSize;
  textSpan.style.fontStyle = document.getElementById('displayEditor') ? document.getElementById('displayEditor').style.fontStyle: 'normal';
  textSpan.style.whiteSpace = 'pre-wrap';
  textSpan.style.width = (width*0.85)+'vw'
  textSpan.style.position = 'fixed'
  document.body.appendChild(textSpan);
  let textSpanHeight = textSpan.offsetHeight;

  let singleSpan = document.createElement("singleSpan");
  singleSpan.innerHTML="Only Line";
  singleSpan.style.fontSize = fontSize;
  singleSpan.style.fontStyle = document.getElementById('displayEditor') ? document.getElementById('displayEditor').style.fontStyle: 'normal';
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
