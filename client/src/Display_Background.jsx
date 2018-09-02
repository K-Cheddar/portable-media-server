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

  shouldComponentUpdate(nextProps, nextState){
    let {title, presentation} = this.props;
    if(title === 'Presentation' || presentation){
      if(this.props.img !== nextProps.img || this.props.brightness !== nextProps.brightness){
        let {img, brightness, width, height} = nextProps;
        this.setState({
          prevBackgroundStyle: this.computeBackgroundStyle(img, brightness, width, height),
          backgroundUpdaterIndex: 0})
      }
    }
    return true;
  }

  componentDidUpdate(prevProps){
    let {title, presentation} = this.props;
    if(title === 'Presentation' || presentation){
      if(prevProps.img !== this.props.img){
        setTimeout(function(){
          this.setState({backgroundUpdaterIndex: 1})
        }.bind(this),10)
      }
    }
  }

  computeBackgroundStyle = (img, brightness, width, height) => {

    let level = "100%";
    if(brightness)
      level = brightness+"%"

    let backgroundStyle= { position:'absolute', zIndex:1, backgroundImage: 'url('+img+')',
      backgroundSize: '100% 100%', filter: `brightness(${level})`,
      width: width, height: height, maxHeight:'80vw'}

    return backgroundStyle;

  }

  render(){
    let {img, brightness, width, height, title, presentation} = this.props;
    let {backgroundUpdaterIndex, prevBackgroundStyle} = this.state;

    let backgroundStyle = this.computeBackgroundStyle(img, brightness, width, height);

    let animate = (title === 'Presentation' || presentation)

    return(
      <div>
        {animate &&
          <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
            {backgroundUpdaterIndex
              ? styles => <div style={{...styles, ...prevBackgroundStyle}}></div>
              : styles => <div style={{...styles, ...backgroundStyle}}></div>
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
