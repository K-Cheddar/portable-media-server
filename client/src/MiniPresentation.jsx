import React from 'react';
import blank from './assets/blank.png';

export default class MiniPresentation extends React.Component{

  componentDidMount(){
    console.log(window);
    let video = document.getElementById('background-video-mini');
    if(video)
      video.loop = true;
  }

  componentDidUpdate(prevProps){
    let {background} = this.props;

    if(background !== prevProps.background ){
      let video = document.getElementById('background-video-mini');
      if(video)
        video.loop = true;
    }
    let box = document.getElementById("background-text");
    if(box){
      let text = box.innerHTML;
      let newText = "";
      for (let i = 0; i < text.length; ++i){
        if(text[i-1] === '{' && text[i+1] === '}'){
          newText += text.charAt(i).fontcolor("red")
          i+=1;
        }
        else if(text[i-1] === '{' && text[i+2] === '}'){
          newText += text.charAt(i).fontcolor("red")
          newText += text.charAt(i+1).fontcolor("red")
          i+=2;
        }
        else if(text[i-1] === '{' && text[i+3] === '}'){
          newText += text.charAt(i).fontcolor("red")
          newText += text.charAt(i+1).fontcolor("red")
          newText += text.charAt(i+2).fontcolor("red")
          i+=3;
        }
        else if(text[i]!== '{'){
          newText+=text[i]
        }
      }
      box.innerHTML = newText;
    }

  }

  render() {

    let {backgrounds, background, style, words} = this.props;

    let img = blank, asset;
    let isVideo = false;
    let styleFull = {
      textAlign: 'center',
      background: 'transparent',
      border: 0,
      resize:'none',
      whiteSpace:'pre-wrap',
      color: style.color,
      fontSize: style.fontSize*0.366+"vw",
      fontFamily: "Verdana",
      padding: "4% 7.5% 7.5%"
    }

    if(backgrounds.some(e => e.name === background)){
      asset = backgrounds.find(e => e.name === background);
      img = asset.image.src;
      if(asset.type === 'video')
        isVideo = true;
    }

    return (
      <div>
        <div style={{padding:'1vh'}}>
            Presentation:
        </div>
        {!isVideo && <div style={{backgroundImage: 'url('+img+')',
        width: '16vw', height: '9vw', backgroundSize: '100% 100%', position:'absolute'}}>
          <div id="background-text" style={styleFull}>{words}</div>
        </div>}
        {isVideo &&<div style={{width:'16vw', height:'9vw',position:'relative'}}>
          <video loop autoPlay id="background-video-mini"
            style={{width:'100%', height:'100%', position:'absolute', zIndex:'-1'}} >
            <source src={asset.video.src} type="video/mp4"/>
            <source src={asset.video.src} type="video/ogg" />
          </video>
          <div style={styleFull}>{words}</div>
        </div>}
      </div>
    )
  }

}
