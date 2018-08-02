import React, {Component} from 'react';
import blank from '../assets/blank.png';

export default class DisplayEditor extends Component{

  componentDidMount(){
    let video = document.getElementById('background-video-mobile');
    if(video)
      video.loop = true;
  }

  componentDidUpdate(prevProps){
    let {background} = this.props;
    if(background !== prevProps.background ){
      let video = document.getElementById('background-video-mobile');
      if(video)
        video.loop = true;
    }
  }

  render() {

    let {wordIndex, item, backgrounds} = this.props;
    let text = "", background = blank, asset;
    let search = item.background;
    let isVideo = false;
    let style = {
      textAlign: 'center',
      background: 'transparent',
      border: 0,
      resize:'none',
      height: '33vh',
      fontFamily: "Verdana",
      padding: '7.5%',
      overflow: 'hidden',
      whiteSpace:'pre-wrap',
    }


    let slides = item.slides || null;
    let slide = slides ? slides[wordIndex] : null;

    text = slide ? item.slides[wordIndex].boxes[0].words : "";
    style.color = slide ? item.slides[wordIndex].boxes[0].fontColor: 'rgba(255, 255, 255, 1)';
    style.fontSize = slide ? item.slides[wordIndex].boxes[0].fontSize*2.25 + "vw" : '1vw';

    if(slide && item.slides[wordIndex].boxes[0].background)
      search = item.slides[wordIndex].boxes[0].background;

    if(backgrounds.some(e => e.name === item.background)){
      asset = backgrounds.find(e => e.name === search);
      background = asset.image.src;
      if(asset.type === 'video')
        isVideo = true;
    }

    return (
      <div>
        {!isVideo &&<div style={{backgroundImage: 'url('+background+')',
          width: "100vw", height: '35vh', backgroundSize: '100% 100%'}}>
        <div style={style}> {text} </div>
        </div>}
        {isVideo &&<div style={{width:'100vw', height: '35vh',position:'relative'}}>
          <video muted loop autoPlay id="background-video-mobile"
            style={{width:'100%', position:'absolute', zIndex:'-1', top:'1%'}} >
            <source src={asset.video.src} type="video/mp4"/>
            <source src={asset.video.src} type="video/ogg" />
          </video>
          <div style={style}> {text} </div>
        </div>}
      </div>

    )
  }


}
