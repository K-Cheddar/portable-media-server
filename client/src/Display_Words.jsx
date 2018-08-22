import React, {Component} from 'react';
import { Transition } from 'react-spring'

export default class Display_Words extends Component {

  constructor(){
    super();
    this.state = {
      prevWords: '',
      prevWordsStyle: {},
      wordUpdaterIndex: 0,
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    let {words, title} = this.props;
    if(title === 'Presentation'){
      if(words !== nextProps.words){
        let {fontSize, presentation, fsDivider, fontColor, extraPadding} = nextProps;
        this.setState({
          prevWords: nextProps.words,
          prevWordsStyle: this.computeWordsStyle(fontSize, fsDivider, fontColor, extraPadding, presentation),
          wordUpdaterIndex: 0})
      }
    }
    return true;
  }

  componentDidUpdate(prevProps){
    if(this.props.title === 'Presentation'){
      if(prevProps.words !== this.props.words){
        setTimeout(function(){
          this.setState({wordUpdaterIndex: 1})
        }.bind(this),10)
      }
    }
  }

  computeWordsStyle = (fontSize, fsDivider, fontColor, extraPadding, presentation) => {
    let actualfontSize = fontSize*fsDivider + "vw";
    let fs = fontSize*fsDivider/40;
    if(!presentation){
      fs = fontSize*fsDivider/140
    }

    let strokeRadius = `calc(${fs*0.5}vw)`;
    let strokeColor = "#000";

    let SS = `${fs*2}vw`;
    if(!presentation){
      SS = `${fs*12}vw`;
    }

    let wordsStyle = {
      textAlign: 'center', background: 'transparent', border: 0, resize:'none',
      whiteSpace:'pre-wrap', color: fontColor, fontSize: actualfontSize, fontFamily: "Verdana",
      padding: extraPadding ? "12.5% 5%" : "5%", textShadow: `${SS} ${SS} ${SS} black, ${SS} ${SS} ${SS} black`,
      width: '90%', height:'85%', position: 'absolute', zIndex: 2,
      WebkitTextStroke: `${strokeRadius} ${strokeColor}`
    }

    return wordsStyle;

  }

  render(){
    let {id, words, fontSize, presentation, fsDivider, fontColor, extraPadding, title} = this.props;
    let {prevWords, wordUpdaterIndex, prevWordsStyle} = this.state;

    let wordsStyle = this.computeWordsStyle(fontSize, fsDivider, fontColor, extraPadding, presentation)

    return(
      <div>
        {title=== 'Presentation' &&
          <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
            {wordUpdaterIndex
              ? styles => <div style={{...styles, ...prevWordsStyle}}>{prevWords}</div>
              : styles => <div style={{...styles, ...wordsStyle}}>{words}</div>
            }
          </Transition>
        }
        {title !== 'Presentation' &&
          <div id={id} style={wordsStyle}>{words}</div>
        }
      </div>
    )

  }
}
