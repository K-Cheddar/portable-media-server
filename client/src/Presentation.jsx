import React from 'react';
import blank from './assets/blank.png';

class Presentation extends React.Component{

  constructor() {
    super();
    this.state = {
      width: 0,
      height: 0,
      pBackground: '',
      pWords: '',
      pStyle: {},
      pTime: -1
    }

    this.updateDimensions = this.updateDimensions.bind(this);
    this.updateStorage = this.updateStorage.bind(this);
  }

  updateDimensions(){
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  updateStorage(e){
    if(e.key === 'presentation'){
      let val = JSON.parse(e.newValue);
      if (!val)
        return;
      this.setState({
        pBackground: val.background,
        pWords: val.words,
        pStyle: val.style,
        pTime: val.time
      })
    }
  }

  componentDidMount(){
    this.updateDimensions();
    window.addEventListener("storage", this.updateStorage);
    window.addEventListener("resize", this.updateDimensions);
    let video = document.getElementById('background-video-presentation');
    if(video)
      video.loop = true;
  }

  componentDidUpdate(prevProps){
    console.log('update');
    let {backgrounds, background} = this.props;
    // let backgroundP = this.prevProps.background || null;
    // let backgroundsP = this.prevProps.backgrounds || [];
    let assetN//, assetP;
    if(background !== prevProps.background ){
      if(backgrounds.some(e => e.name === background)){
        assetN = backgrounds.find(e => e.name === background);
      }
      // if(backgroundsP.some(e => e.name === backgroundP)){
      //   assetP = backgroundsP.find(e => e.name === backgroundP);
      // }
      let videoN = document.getElementById('background-video-presentation');
      if(videoN){
        videoN.src = assetN.video.src;
        videoN.loop = true;

      }
    }
  }

  render() {

    console.log('render');
    let {backgrounds, background, words, style, time} = this.props;
    let {pBackground, pWords, pStyle, pTime} = this.state;

    if(pTime >= time){
      background = pBackground;
      words = pWords;
      style = pStyle
    }

    let {width, height} = this.state;
    let img = blank, asset;
    let isVideo = false;

    let sixteenByNine = Math.round((16/9)*100)/100;
    let fourByThree = Math.round((4/3)*100)/100;
    let aspectRatio = Math.round((width/height)*100)/100;

    let styleFull = {
      textAlign: 'center',
      background: 'transparent',
      border: 0,
      resize:'none',
      height: '85%',
      width: '85%',
      whiteSpace:'pre-wrap',
      color: style.color,
      fontSize: style.fontSize*2.25+"vw",
      fontFamily: "Verdana",
      padding: "4% 7.5% 7.5%"
    }

    if(backgrounds.some(e => e.name === background)){
      asset = backgrounds.find(e => e.name === background);
      img = asset.image.src;
      if(asset.type === 'video')
        isVideo = true;
    }

    let backgroundStyle = {
      backgroundImage: 'url('+img+')',
      width: '100vw', height: '100vh', maxHeight:'75vw', backgroundSize: '100% 100%'
    }

    let fbt = Math.abs(aspectRatio - fourByThree)
    let sbn = Math.abs(aspectRatio - sixteenByNine)


    if(fbt < sbn){
      styleFull.padding = "15% 7.5% 7.5%"
    }


    return (
      <div>
        {!isVideo &&<div style={backgroundStyle}>
          <div style={styleFull}>
              {words}
          </div>
        </div>
        }
        {isVideo &&<div style={{width: '100vw', height: '100vh', maxHeight:'75vw'}}>
          <video preload="auto" loop autoPlay id="background-video-presentation"
            style={{width:'100%', height:'100%', position:'absolute', zIndex:'-1'}} >
            <source src={asset.video.src} type="video/mp4"/>
            <source src={asset.video.src} type="video/ogg" />
          </video>
          <div style={styleFull}>
              {words}
          </div>
        </div>}

      </div>
    )
  }

}
export default Presentation;
