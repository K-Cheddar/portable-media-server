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
  }

  updateDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  updateStorage = (e) => {
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

  goFullScreen(){
    let elem = document.getElementById("fullApp");
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
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
    let box = document.getElementById("presentation-text");
    if (box){
      let text = box.innerHTML;
      let newText = "";
      for (let i = 0; i < text.length; ++i){
        if(text[i-1] === '{' && text[i+1] === '}'){
          newText += text.charAt(i).fontcolor("#C462FF")
          i+=1;
        }
        else if(text[i-1] === '{' && text[i+2] === '}'){
          newText += text.charAt(i).fontcolor("#C462FF")
          newText += text.charAt(i+1).fontcolor("#C462FF")
          i+=2;
        }
        else if(text[i-1] === '{' && text[i+3] === '}'){
          newText += text.charAt(i).fontcolor("#C462FF")
          newText += text.charAt(i+1).fontcolor("#C462FF")
          newText += text.charAt(i+2).fontcolor("#C462FF")
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
      <div onClick={this.goFullScreen} id="full-presentation">
        {!isVideo &&<div style={backgroundStyle}>
          <div id="presentation-text" style={styleFull}>
              {words}
          </div>
        </div>
        }
        {isVideo &&<div style={{width: '100vw', height: '100vh', maxHeight:'75vw'}}>
          <video muted preload="auto" loop autoPlay id="background-video-presentation"
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
