import React from 'react';
import DisplayWindow from './DisplayWindow'
import {Link} from 'react-router-dom';

class Presentation extends React.Component{

  constructor() {
    super();
    this.state = {
      width: 0,
      height: 0,
      localSlide: {},
      localTime: -1,
      fullScreen: false,
    }
  }

  componentDidMount(){
    this.updateDimensions();
    window.addEventListener("storage", this.updateStorage);
    window.addEventListener("resize", this.updateDimensions);
    document.addEventListener('fullscreenchange', this.updateDimensions);
    document.addEventListener('webkitfullscreenchange', this.updateDimensions);
    document.addEventListener('mozfullscreenchange', this.updateDimensions);
    document.addEventListener('MSFullscreenChange', this.updateDimensions);
  }

  isFullScreen = () => {
    let elem = document.getElementById("fullApp");
    if(elem.requestFullScreen || elem.mozRequestFullScreen || elem.webkitRequestFullScreen || elem.msRequestFullscreen)
      return true;
    return false;
  }

  goFullScreen = () => {
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

  fullScreenHandler = (e) => {
    const isFullScreen = this.isFullScreen();
    this.updateDimensions();
     this.setState({fullScreen: isFullScreen})
  }

  isMobileBrowser = () => {
    if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
  ){
    return true;
  }
  else 
    return false;
  }

  updateDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })

    if(this.isMobileBrowser())
      return;
    
      if(window.innerWidth < (window.screen.availWidth*.95) || window.innerHeight < (window.screen.availHeight*.95) ){
      this.setState({fullScreen: false})
    }
    else {
      this.setState({fullScreen: true})
    }
  }

  updateStorage = (e) => {
    if(e.key === 'presentation'){
      let val = JSON.parse(e.newValue);
      if (!val)
        return;
      this.setState({ localSlide: val.slide,localTime: val.time})
    }
  }

  render() {
    let {backgrounds, type, currentInfo = {}} = this.props;
    let {localSlide, localTime, width, height, fullScreen} = this.state;
    let slide;

    if(currentInfo.time > localTime)
      slide = currentInfo.slide;
    else
      slide = localSlide


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
      borderRadius:'2vmin', color: 'white'}

    let homeButton = {fontSize: "5vmin", backgroundColor:'#383838', border:'1.25vmin solid #06d1d1',
      borderRadius:'1.5vmin', color: 'white', position: 'absolute', left: '1vmin', top: '1vmin'}

    return (
      <div id="full-presentation">
        {!fullScreen && <div style={{width: '100vw', height: '100vh', display:'flex',
          alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: '90%'}}>
            {type === 'local' && <div style={{textAlign: 'center', fontSize: "8.5vmin", color: 'yellow',
              backgroundColor:'#383838', padding:'5vh', marginBottom: '10vh'}}>Drag To Intended Display</div>}
            {type === 'remote' && <div style={{ display:'flex', alignItems: 'center',
              justifyContent: 'center'}}>
              <Link to="/"><button style={homeButton}>Home</button></Link>
            </div>}
            <div style={{ display:'flex', alignItems: 'center', justifyContent: 'center'}}>
              <button onClick={this.goFullScreen} style={buttonStyle}>Click To Activate FullScreen</button>
            </div>
          </div>
        </div>}
        {fullScreen && <DisplayWindow type={type} slide={slide} backgrounds={backgrounds} width={'100vw'}
        title={''} titleSize={''} presentation={true} extraPadding={extraPadding}/>
        }
      </div>
    )
  }

}
export default Presentation;
