import React from 'react';
import blank from './assets/blank.png';

class DisplayEditor extends React.Component{

  componentDidMount(){
    let video = document.getElementById('background-video');
    if(video)
      video.loop = true;
  }

  componentDidUpdate(prevProps){
    let {item} = this.props;
    if(item !== prevProps.item ){
      let video = document.getElementById('background-video');
      if(video)
        video.loop = true;
    }
  }

  handleTextChange = (event) => {

    event.preventDefault();
    let cursor = event.target.selectionStart
    let {wordIndex, item} = this.props;
    let index = -1;
    let words = event.target.value;

    if(item.type === 'bible' && wordIndex === 0){
      item.slides[wordIndex].boxes[0].words = words
    }
    let slides = item.slides || null;
    let slide = slides ? slides[wordIndex] : null;

    if(slide && wordIndex < item.slides.length-1 && wordIndex !== 0){
      if(item.type === 'song'){
        index = item.formattedLyrics.findIndex(e => e.name === item.slides[wordIndex].type);
        let start = wordIndex - item.slides[wordIndex].boxes[0].slideIndex;
        let end = start + item.formattedLyrics[index].slideSpan - 1;
        let newWords = ""

        for (let i = start; i <= end; ++i){
          if(i === wordIndex)
            newWords+= words;
          else
            newWords+= item.slides[i].boxes[0].words;
        }
        if(newWords !== "")
          item.formattedLyrics[index].words = newWords
      }
    }
    else if(item.type === 'song' && wordIndex===0 && slide){
      if(words.length > 0)
        item.slides[wordIndex].boxes[0].words = words
    }

    this.props.updateItem(item);

    setTimeout(function(){
      document.getElementById("displayEditor").selectionEnd = cursor;
      document.getElementById("displayEditor").scrollTop = 0;
    }, 10)
    }

  render() {
    let {wordIndex, item, backgrounds} = this.props;
    let words = item.slides;
    let text = "", background = blank, asset;
    let search = item.background;
    let isVideo = false;
    let style = {
      textAlign: 'center',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      resize:'none',
      height: '40vh',
      maxHeight:"30vw",
      width: '36vw',
      fontFamily: "Verdana",
      padding: '7.5%',
      overflow: 'hidden'
    }

    if(words){
      let slides = item.slides || null;
      let slide = slides ? slides[wordIndex] : null;
       text = slide ? item.slides[wordIndex].boxes[0].words : "";
       style.color = slide ? item.slides[wordIndex].boxes[0].fontColor : 'rgba(255, 255, 255, 1)';
       style.fontSize = slide ? item.slides[wordIndex].boxes[0].fontSize*.95 + "vw" : '1vw';
      if(slide && item.slides[wordIndex].boxes[0].background)
        search = item.slides[wordIndex].boxes[0].background;
    }
    if(backgrounds){
      if(backgrounds.some(e => e.name === search)){
          asset = backgrounds.find(e => e.name === search);
          background = asset.image.src;
          if(asset.type === 'video')
            isVideo = true;
        }
    }


    return (
      <div>
        {!isVideo &&<div style={{backgroundImage: 'url('+background+')',
          width: "100%", height: "100%", backgroundSize: '100% 100%'}}>
        <div>
          <textarea id="displayEditor" style={style} value={text} onChange={this.handleTextChange}/>
          </div>
      </div>}
      {isVideo &&<div style={{width:'100%', height:'100%',position:'relative'}}>
        <video loop autoPlay id="background-video"
          style={{width:'100%', position:'absolute', zIndex:'-1', top:'1%'}} >
          <source src={asset.video.src} type="video/mp4"/>
          <source src={asset.video.src} type="video/ogg" />
        </video>
        <div>
          <textarea id="displayEditor" style={style} value={text} onChange={this.handleTextChange}/>
          </div>
      </div>}
      </div>
    )
  }

}
export default DisplayEditor;
