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
    if(title === 'Presentation' || this.props.presentation){
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
      let {title, presentation} = this.props;
    if(title === 'Presentation' || presentation){
      if(prevProps.words !== this.props.words){
        setTimeout(function(){
          this.setState({wordUpdaterIndex: 1})
        }.bind(this),10)
      }
    }
    let box = document.getElementById(`background-text-${this.props.title}-${this.props.words}`);
    let box_prev = document.getElementById(`background-text-${this.props.title}-${this.props.words}-prev`);

    if(box){
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

    if(box_prev){
      let text = box_prev.innerHTML;
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
      box_prev.innerHTML = newText;
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

    let animate = (title === 'Presentation' || presentation)

    return(
      <div>
        {animate &&
          <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
            {wordUpdaterIndex
              ? styles => <div id={id+'-prev'} style={{...styles, ...prevWordsStyle}}>{prevWords}</div>
              : styles => <div id={id} style={{...styles, ...wordsStyle}}>{words}</div>
            }
          </Transition>
        }
        {!animate &&
          <div id={id} style={wordsStyle}>{words}</div>
        }
      </div>
    )

  }
}
