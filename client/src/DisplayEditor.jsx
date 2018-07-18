import React from 'react';
import blank from './assets/blank.png';

class DisplayEditor extends React.Component{

  constructor(){
    super();

    this.handleTextChange = this.handleTextChange.bind(this);
  }

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

  handleTextChange(event) {

    event.preventDefault();
    let cursor = event.target.selectionStart
    let {wordIndex, item} = this.props;
    let index = -1;
    let words = event.target.value;

    if(item.type === 'bible' && wordIndex === 0){
      item.words[wordIndex].words = words
    }
    else if(item.words[wordIndex] && wordIndex < item.words.length-1 && wordIndex !== 0){
      if(item.type === 'song'){
        index = item.formattedLyrics.findIndex(e => e.name === item.words[wordIndex].type);
        let start = wordIndex - item.words[wordIndex].slideIndex;
        let end = start + item.formattedLyrics[index].slideSpan - 1;
        let newWords = ""

        for (let i = start; i <= end; ++i){
          if(i === wordIndex)
            newWords+= words;
          else
            newWords+= item.words[i].words;
        }
        if(newWords !== "")
          item.formattedLyrics[index].words = newWords
      }
    }
    else if(item.type === 'song' && wordIndex===0){
      if(words.length > 0)
        item.words[wordIndex].words = words
    }

    this.props.updateItem(item);

    setTimeout(function(){
      document.getElementById("displayEditor").selectionEnd = cursor;
    }, 10)
    }

  render() {
    let {wordIndex, item, backgrounds} = this.props;
    let words = item.words;
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
       text = item.words[wordIndex] ? item.words[wordIndex].words : "";
         style.color = item.style.color;
      if(wordIndex === 0)
        style.fontSize = item.nameSize + "vw";
      else
         style.fontSize = item.style.fontSize*.95 + "vw";
      if(item.words[wordIndex] && item.words[wordIndex].background)
      search = item.words[wordIndex].background;
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
