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
    let {item, wordIndex, boxIndex} = this.props;

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
      let box = slide ? slide.boxes[boxIndex] : null;

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
    let {wordIndex, item, boxIndex} = this.props;
    let slides;
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides
    else
      slides = item.slides
    let box = slides[wordIndex].boxes[boxIndex];
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

    let {wordIndex, item, boxIndex} = this.props;
    let index = -1;
    let slides, formattedLyrics, newWords, start, end;

    if((item.type === 'bible' && wordIndex === 0) || item.type === 'image'
      || item.type === 'announcements'){
      slides = item.slides;
      slides[wordIndex].boxes[boxIndex].words = words;
    }

    else if (item.type === 'song'){
        slides = item.arrangements[item.selectedArrangement].slides
        if(wordIndex === 0)
            slides[wordIndex].boxes[boxIndex].words = words
        else if(wordIndex < slides.length-1){
            formattedLyrics = item.arrangements[item.selectedArrangement].formattedLyrics;
            index = formattedLyrics.findIndex(e => e.name === slides[wordIndex].type);

            start = wordIndex - slides[wordIndex].boxes[boxIndex].slideIndex;
            end = start + formattedLyrics[index].slideSpan - 1;
            newWords = ""

            for (let i = start; i <= end; ++i){
              if(i === wordIndex)
                newWords+= words;
              else
                newWords+= slides[i].boxes[boxIndex].words;
            }
            if(newWords !== "")
              formattedLyrics[index].words = newWords
        }
    }

    this.props.updateItem(item);

    setTimeout(function(){
      if(!enterPressed || item.type !== 'song')
        return;
      document.getElementById(`displayEditor-${boxIndex}`).selectionEnd = cursor;
      document.getElementById(`displayEditor-${boxIndex}`).scrollTop = 0;
    }, 10)
  }

  render() {
    let {wordIndex, item, backgrounds, width, height, boxIndex} = this.props;
    // let {text} = this.state;
    let slides;
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides || null;
    else
      slides = item.slides || null;
    let slide = slides ? slides[wordIndex] : null;

    let blankStyle = {width: width, height: height, background: 'black'}
    let blankTextStyle = {color: 'white', textAlign: 'center',
    fontSize: '4vw', paddingTop: '15%'}

    if(!slide)
      return (<div style={blankStyle}><div style={blankTextStyle}>No Item Selected</div></div>)

    return (
      <div onKeyUp={this.handleKeyUp} onKeyDown={this.props.overrideUndoRedo}
         style={{width: width, height: height, position: 'relative'}}>
        <DisplayWindow slide={slide}  backgrounds={backgrounds} boxIndex={boxIndex} wordIndex={wordIndex}
          width={width} height={height} title={''} editor={true} handleTextChange={this.handleTextChange}
          handleBoxChange={this.handleBoxChange} setBoxIndex={this.props.setBoxIndex} itemID={item._id}>
        </DisplayWindow>
      </div>
    )
  }

}
export default DisplayEditor;
// words={words} style={box} background={background}
