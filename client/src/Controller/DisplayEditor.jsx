import React from 'react';
import DisplayWindow from '../DisplayElements/DisplayWindow';

class DisplayEditor extends React.Component{

  constructor(){
    super();
    this.state = {
      text: '',
      cursor: 0,
      updating: false
    }

    this.throttle = null
  }

  componentDidMount(){
    let video = document.getElementById('background-video');
    if(video)
      video.loop = true;
  }

  componentDidUpdate(prevProps){
    let {item, wordIndex} = this.props;

    if(item !== prevProps.item || wordIndex !== prevProps.wordIndex){
      let video = document.getElementById('background-video');
      if(video)
        video.loop = true;

      let slides;
      if (item.type === 'song')
        slides = item.arrangements[item.selectedArrangement].slides || null;
      else
        slides = item.slides || null;

      let slide = slides ? slides[wordIndex] : null;
      let box = slide ? slide.boxes[0] : null;

      if(box)
        this.setState({text: box.words})
    }
  }

  handleKeyUp = (event) => {
    // let {text, cursor} = this.state;

    // if(event.key === 'Enter'){
    //   this.updateTextChange(text, cursor, true)
    //   clearTimeout(this.throttle)
    // }
    // if(event.key === 'Delete'){
    //   let selectionEnd = document.getElementById("displayEditor").selectionEnd;
    //   if(selectionEnd === cursor){
    //     this.updateTextChange(text, cursor, true)
    //     clearTimeout(this.throttle)
    //   }
    // }
  }

  handleBoxChange = (x, y, width, height) => {
    let{wordIndex, item} = this.props;
    let slides;
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides
    else
      slides = item.slides
    let box = slides[wordIndex].boxes[0];
    box.x = x;
    box.y = y;
    box.width = width;
    box.height = height;
    this.props.updateItem(item);
  }

  handleTextChange = (event) => {
    // let that = this;
    // let {updating} = this.state;
    event.preventDefault();
    this.updateTextChange(event.target.value, event.target.selectionStart, true)
    // this.setState({text: event.target.value, cursor: event.target.selectionStart})
    // clearTimeout(this.throttle);
    // if(updating){
    //   this.throttle = setTimeout(function(){
    //     let text = that.state.text;
    //     let cursor = that.state.cursor;
    //     that.setState({updating: false})
    //     that.updateTextChange(text, cursor, true)
    //   }, 350)
    // }
    // else{
    //   this.setState({updating: true})
    //   this.updateTextChange(event.target.value, event.target.selectionStart, true)
    // }

  }

  updateTextChange = (words, cursor, enterPressed) => {

    let {wordIndex, item} = this.props;
    let index = -1;
    let formattedLyrics = item.arrangements[item.selectedArrangement].formattedLyrics;
    let slides;
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides || null;
    else
      slides = item.slides || null;

    let slide = slides ? slides[wordIndex] : null;

    if((item.type === 'bible' && wordIndex === 0) || item.type === 'image'){
      slides[wordIndex].boxes[0].words = words
    }

    if(slide && wordIndex < slides.length-1 && wordIndex !== 0){
      if(item.type === 'song'){
        index = formattedLyrics.findIndex(e => e.name === slides[wordIndex].type);
        let start = wordIndex - slides[wordIndex].boxes[0].slideIndex;
        let end = start + formattedLyrics[index].slideSpan - 1;
        let newWords = ""

        for (let i = start; i <= end; ++i){
          if(i === wordIndex)
            newWords+= words;
          else
            newWords+= slides[i].boxes[0].words;
        }
        if(newWords !== "")
          formattedLyrics[index].words = newWords
      }
    }
    else if(item.type === 'song'&& slide){
      if(words.length > 0)
        slides[wordIndex].boxes[0].words = words
    }

    this.props.updateItem(item);

    setTimeout(function(){
      if(!enterPressed)
        return;
      document.getElementById("displayEditor").selectionEnd = cursor;
      document.getElementById("displayEditor").scrollTop = 0;
    }, 10)
  }

  render() {
    let {wordIndex, item, backgrounds, width, height} = this.props;
    // let {text} = this.state;
    let slides
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides || null;
    else
      slides = item.slides || null;
    let slide = slides ? slides[wordIndex] : null;
    let box = slide ? slide.boxes[0] : null;

    let blankStyle = {width: width, height: height, background: 'black'}
    let blankTextStyle = {color: 'white', textAlign: 'center',
    fontSize: '4vw', paddingTop: '15%'}

    if(!box)
      return (<div style={blankStyle}><div style={blankTextStyle}>No Item Selected</div></div>)

    let words = box.words;
    let background = box.background;

    return (
      <div onKeyUp={this.handleKeyUp} style={{width: width, height: height, position: 'relative'}}>
        <DisplayWindow words={words} style={box} background={background} backgrounds={backgrounds}
          width={width} height={height} title={''} editor={true} handleTextChange={this.handleTextChange}
          handleBoxChange={this.handleBoxChange}>
        </DisplayWindow>
      </div>
    )
  }

}
export default DisplayEditor;
