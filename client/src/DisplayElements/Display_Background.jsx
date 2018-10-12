import React, {Component} from 'react';
import { Transition } from 'react-spring'

export default class Display_Background extends Component {

  constructor(){
    super();
    this.state = {
      prevBackgroundStyle: {},
      backgroundUpdaterIndex: 0,
    }
  }

  componentDidMount(){
    let video1 = document.getElementById('background-video-mini-1');
    if(video1)
      video1.loop = true;
    let video2 = document.getElementById('background-video-mini-2');
    if(video2)
      video2.loop = true;
  }


  shouldComponentUpdate(nextProps, nextState){
    let {animate} = this.props;
    if(animate){
      if(this.props.img !== nextProps.img || this.props.brightness !== nextProps.brightness ||
      JSON.stringify(this.props.position) !== JSON.stringify(nextProps.position)){
        let {img, brightness, position} = nextProps;
        this.setState({
          prevBackgroundStyle: this.computeBackgroundStyle(img, brightness, position),
          backgroundUpdaterIndex: 0})
      }
    }
    return true;
  }

  componentDidUpdate(prevProps){
    let {title, presentation, animate, img} = this.props;
    if(animate){
      if(prevProps.img !== img || prevProps.title !== title){
        setTimeout(function(){
          this.setState({backgroundUpdaterIndex: 1})
        }.bind(this),10)
      }
      let video1 = document.getElementById('background-video-mini-1');
      if(video1){
        video1.loop = true;
        if(presentation)
          video1.muted = false
      }
      let video2 = document.getElementById('background-video-mini-2');
      if(video2){
        video2.loop = true;
        if(presentation)
          video2.muted = false
      }
    }
  }

  computeBackgroundStyle = (img, brightness, position) => {

    let level = "100%";
    if(brightness)
      level = brightness+"%"

    let backgroundStyle= { position:'absolute', backgroundSize: '100% 100%',
      filter: `brightness(${level})`, width: '100%', height: '100%',
      maxHeight:'80vw', zIndex: this.props.zIndex}
    if(position && position.transparent)
      backgroundStyle.background = 'transparent';
    else
      backgroundStyle.backgroundImage = 'url('+img+')'

    return backgroundStyle;

  }

  render(){
    let {img, brightness, position, isVideo, asset, animate} = this.props;
    let {backgroundUpdaterIndex, prevBackgroundStyle} = this.state;

    let backgroundStyle = this.computeBackgroundStyle(img, brightness, position);
    let videoStyle = {width:'100%', height:'100%', position:'absolute', zIndex:'-1'}

    return(
      <div>
        {(animate && !isVideo) &&
          <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
            {backgroundUpdaterIndex
              ? styles => <div style={{...styles, ...prevBackgroundStyle}}></div>
              : styles => <div style={{...styles, ...backgroundStyle}}></div>
            }
          </Transition>
        }
        {isVideo &&
          <Transition from={{ opacity: 0 }}  enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
            {backgroundUpdaterIndex
              ? styles => <video loop muted preload="true" autoPlay id="background-video-mini-1"
                          style={{...styles, ...videoStyle}}>
                            <source src={asset.video.src} type="video/mp4"/>
                          </video>
              : styles => <video loop muted preload="true" autoPlay id="background-video-mini-2"
                          style={{...styles, ...videoStyle}}>
                            <source src={asset.video.src} type="video/mp4"/>
                          </video>
            }
          </Transition>
        }
        {!animate &&
          <div style={backgroundStyle}></div>
        }
      </div>
    )

  }
}
