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
    let {words, position, animate} = this.props;
    if(animate){
      if((words !== nextProps.words) || (position !== nextProps.position) ){
        let {fontSize, presentation, fsDivider, fontColor, extraPadding} = nextProps;
        let nextPosition = nextProps.position;
        this.setState({
          prevWords: nextProps.words,
          prevWordsStyle: this.computeWordsStyle(fontSize, fsDivider, fontColor, extraPadding, presentation, nextPosition),
          wordUpdaterIndex: 0})
      }
    }
    return true;
  }

  componentDidMount(){
    let box = document.getElementById(`background-text-${this.props.title}-${this.props.words}`);
    let box_prev = document.getElementById(`background-text-${this.props.title}-${this.props.words}-prev`);

    if(box){
      let text = box.innerHTML;
      let newText = "";
      for (let i = 0; i < text.length; ++i){
        if(text[i-1] === '{' && text[i+1] === '}'){
          newText += ' ';
          newText += text.charAt(i).fontcolor("#f6ff00")
          newText += ' ';
          i+=1;
        }
        else if(text[i-1] === '{' && text[i+2] === '}'){
          newText += ' ';
          newText += text.charAt(i).fontcolor("#f6ff00")
          newText += text.charAt(i+1).fontcolor("#f6ff00")
          newText += ' ';
          i+=2;
        }
        else if(text[i-1] === '{' && text[i+3] === '}'){
          newText += ' ';
          newText += text.charAt(i).fontcolor("#f6ff00")
          newText += text.charAt(i+1).fontcolor("#f6ff00")
          newText += text.charAt(i+2).fontcolor("#f6ff00")
          newText += ' ';
          i+=3;
        }
        else if(text[i]!== '{'){
          newText+= text[i]
        }
      }
      box.innerHTML = newText;
    }

    if(box_prev){
      let text = box_prev.innerHTML;
      let newText = "";
      for (let i = 0; i < text.length; ++i){
        if(text[i-1] === '{' && text[i+1] === '}'){
          newText += ' ';
          newText += text.charAt(i).fontcolor("#f6ff00");
          newText += ' ';
          i+=1;
        }
        else if(text[i-1] === '{' && text[i+2] === '}'){
          newText += ' ';
          newText += text.charAt(i).fontcolor("#f6ff00");
          newText += text.charAt(i+1).fontcolor("#f6ff00");
          newText += ' ';
          i+=2;
        }
        else if(text[i-1] === '{' && text[i+3] === '}'){
          newText += ' ';
          newText += text.charAt(i).fontcolor("#f6ff00");
          newText += text.charAt(i+1).fontcolor("#f6ff00");
          newText += text.charAt(i+2).fontcolor("#f6ff00");
          newText += ' ';
          i+=3;
        }
        else if(text[i]!== '{'){
          newText+=text[i]
        }
      }
      box_prev.innerHTML = newText;
    }
  }

  componentDidUpdate(prevProps){
      let {animate} = this.props;
    if(animate){
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
          newText += ' ';
          newText += text.charAt(i).fontcolor("#f6ff00")
          newText += ' ';
          i+=1;
        }
        else if(text[i-1] === '{' && text[i+2] === '}'){
          newText += ' ';
          newText += text.charAt(i).fontcolor("#f6ff00")
          newText += text.charAt(i+1).fontcolor("#f6ff00")
          newText += ' ';
          i+=2;
        }
        else if(text[i-1] === '{' && text[i+3] === '}'){
          newText += ' ';
          newText += text.charAt(i).fontcolor("#f6ff00")
          newText += text.charAt(i+1).fontcolor("#f6ff00")
          newText += text.charAt(i+2).fontcolor("#f6ff00")
          newText += ' ';
          i+=3;
        }
        else if(text[i]!== '{'){
          newText+= text[i]
        }
      }
      box.innerHTML = newText;
    }

    if(box_prev){
      let text = box_prev.innerHTML;
      let newText = "";
      for (let i = 0; i < text.length; ++i){
        if(text[i-1] === '{' && text[i+1] === '}'){
          newText += ' ';
          newText += text.charAt(i).fontcolor("#f6ff00");
          newText += ' ';
          i+=1;
        }
        else if(text[i-1] === '{' && text[i+2] === '}'){
          newText += ' ';
          newText += text.charAt(i).fontcolor("#f6ff00");
          newText += text.charAt(i+1).fontcolor("#f6ff00");
          newText += ' ';
          i+=2;
        }
        else if(text[i-1] === '{' && text[i+3] === '}'){
          newText += ' ';
          newText += text.charAt(i).fontcolor("#f6ff00");
          newText += text.charAt(i+1).fontcolor("#f6ff00");
          newText += text.charAt(i+2).fontcolor("#f6ff00");
          newText += ' ';
          i+=3;
        }
        else if(text[i]!== '{'){
          newText+=text[i]
        }
      }
      box_prev.innerHTML = newText;
    }
  }

  computeWordsStyle = (fontSize, fsDivider, fontColor, extraPadding, presentation, nextPosition) => {
    let actualfontSize = fontSize*fsDivider + "vw";
    let fs = fontSize*fsDivider/40;

    let strokeRadius = `calc(${fs*1.25}vw)`;
    if(!presentation && !this.props.editor)
      strokeRadius = `calc(${fs*0.35}vw)`;
    let strokeColor = "#000";
    let SS = `${fs*1.25}vw`;
    if(!presentation && !this.props.editor)
      SS = `${fs*4}vw`;

    let {position} = this.props;
    let marginT_B = position.topMargin || 3;
    let marginL_R = position.sideMargin || 4;
    if(extraPadding)
      marginT_B*=5;
    let top = 0;
    let left = 0;
    let width =  100 - (marginL_R*2) + '%';
    let height = 100 - (marginT_B*2) + '%';

    // if(nextPosition && nextPosition.width){
    //   width = .9*nextPosition.width + '%';
    //   height = .86*nextPosition.height + '%';
    //   top = Math.max((nextPosition.y - (marginT_B/2)),0) + '%';
    //   left = Math.max((nextPosition.x - (marginL_R/2)),0) + '%';
    // }
    // // else if(!this.props.editor && position.width){
    // //   width = .9*position.width + '%';
    // //   height = .86*position.height + '%';
    // //   top = Math.max((position.y - (marginT_B/2)),0)+ '%';
    // //   left = Math.max((position.x - (marginL_R/2)),0)+ '%';
    // // }

    let textAlign = position.textAlign ? position.textAlign : 'center'

    let wordsStyle = {
      textAlign: textAlign, background: 'transparent', resize:'none', outline: 'none', border: 'none',
      whiteSpace:'pre-wrap', color: fontColor, fontSize: actualfontSize, fontFamily: "Verdana",
      margin: `${marginT_B}% ${marginL_R}%`, textShadow: `${SS} ${SS} ${SS} black, ${SS} ${SS} ${SS} black`,
      width: width, height: height, position: 'absolute', zIndex: this.props.zIndex+1, top: top, left: left,
      WebkitTextStroke: `${strokeRadius} ${strokeColor}`, overflow: 'hidden'
    }

    return wordsStyle;

  }

  render(){
    let {id, words, fontSize, presentation, fsDivider, fontColor, extraPadding, animate, editor, index} = this.props;
    let {prevWords, wordUpdaterIndex, prevWordsStyle} = this.state;

    let wordsStyle = this.computeWordsStyle(fontSize, fsDivider, fontColor, extraPadding, presentation)

    return(
      <div>
        {(animate && !editor) &&
          <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
            {wordUpdaterIndex
              ? styles => <div id={id+'-prev'} style={{...styles, ...prevWordsStyle}}>{prevWords}</div>
              : styles => <div id={id} style={{...styles, ...wordsStyle}}>{words}</div>
            }
          </Transition>
        }
        {(!animate && !editor) &&
          <div id={id} style={wordsStyle}>{words}</div>
        }
        {editor && <textarea id={`displayEditor-${index}`} style={wordsStyle} value={words}
          onChange={this.props.handleTextChange}/>}
      </div>
    )

  }
}
