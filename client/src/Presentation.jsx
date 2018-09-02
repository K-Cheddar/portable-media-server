import React from 'react';
import DisplayWindow from './DisplayWindow'

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

  componentDidMount(){
    this.updateDimensions();
    window.addEventListener("storage", this.updateStorage);
    window.addEventListener("resize", this.updateDimensions);
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

  render() {
    let {backgrounds} = this.props;
    let {background, words, style, time} = this.props.currentInfo
    let {pBackground, pWords, pStyle, pTime, width, height} = this.state;

    if(pTime >= time){
      background = pBackground;
      words = pWords;
      style = pStyle
    }

    let sixteenByNine = Math.round((16/9)*100)/100;
    let fourByThree = Math.round((4/3)*100)/100;
    let aspectRatio = Math.round((width/height)*100)/100;

    let fbt = Math.abs(aspectRatio - fourByThree)
    let sbn = Math.abs(aspectRatio - sixteenByNine)

    let extraPadding = false

    if(fbt < sbn){
      extraPadding = true
    }

    return (
      <div onClick={this.goFullScreen} id="full-presentation">
        <DisplayWindow words={words} style={style} background={background} backgrounds={backgrounds}
          width={'100vw'} height={'100vh'} title={''} titleSize={''} presentation={true} extraPadding={extraPadding}/>
      </div>
    )
  }

}
export default Presentation;
