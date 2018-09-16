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
      pTime: -1,
      fullScreen: false,
    }
  }

  componentDidMount(){
    this.updateDimensions();
    window.addEventListener("storage", this.updateStorage);
    window.addEventListener("resize", this.updateDimensions);
  }

  goFullScreen = () => {
    if(this.props.type === 'remote')
      this.props.setAsReceiver();
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
        this.setState({fullScreen: true})
    }
  }

  updateDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
    if(window.innerWidth !== window.screen.width || window.innerHeight !== window.screen.height )
      this.setState({fullScreen: false})
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
    let {backgrounds, type} = this.props;
    let {background, words, style, time} = this.props.currentInfo
    let {pBackground, pWords, pStyle, pTime, width, height, fullScreen} = this.state;

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


    let buttonStyle = {fontSize: "10vmin", backgroundColor:'#383838', border:'1.5vmin solid #06d1d1',
      borderRadius:'2vmin', color: 'white', padding:'0.25vmin', height: '50%', width: '100%'}

    return (
      <div id="full-presentation">
        {!fullScreen && <div style={{width: '100vw', height: '100vh', display:'flex',
          alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: '90%'}}>
            {type === 'local' && <div style={{textAlign: 'center', fontSize: "8.5vmin", color: 'yellow',
              backgroundColor:'#383838', padding:'5vh', marginBottom: '10vh'}}>Drag To Intended Display</div>}
            <div style={{ display:'flex', alignItems: 'center', justifyContent: 'center'}}>
              <button onClick={this.goFullScreen} style={buttonStyle}>Click To Activate FullScreen</button>
            </div>
          </div>
        </div>}
        {fullScreen && <DisplayWindow words={words} style={style} background={background} backgrounds={backgrounds}
          width={'100vw'} height={'100vh'} title={''} titleSize={''} presentation={true} extraPadding={extraPadding}/>
        }
      </div>
    )
  }

}
export default Presentation;
