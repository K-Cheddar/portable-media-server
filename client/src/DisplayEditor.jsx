import React from 'react';
import DisplayWindow from './DisplayWindow';

class DisplayEditor extends React.Component{

  componentDidMount(){
    let video = document.getElementById('background-video');
    if(video)
      video.loop = true;

  }

  componentDidUpdate(prevProps){
    let {item} = this.props;
    if(item !== prevProps.item ){
      let video = document.getElementById('background-video');
      if(video)
        video.loop = true;
    }
  }

  handleBoxChange = (x, y, width, height) => {
    let{wordIndex, item} = this.props;
    let box = item.slides[wordIndex].boxes[0];
    box.x = x;
    box.y = y;
    box.width = width;
    box.height = height;
    this.props.updateItem(item);
  }

  handleTextChange = (event) => {

    event.preventDefault();
    let cursor = event.target.selectionStart
    let {wordIndex, item} = this.props;
    let index = -1;
    let words = event.target.value;

    if(item.type === 'bible' && wordIndex === 0){
      item.slides[wordIndex].boxes[0].words = words
    }
    let slides = item.slides || null;
    let slide = slides ? slides[wordIndex] : null;

    if(slide && wordIndex < item.slides.length-1 && wordIndex !== 0){
      if(item.type === 'song'){
        index = item.formattedLyrics.findIndex(e => e.name === item.slides[wordIndex].type);
        let start = wordIndex - item.slides[wordIndex].boxes[0].slideIndex;
        let end = start + item.formattedLyrics[index].slideSpan - 1;
        let newWords = ""

        for (let i = start; i <= end; ++i){
          if(i === wordIndex)
            newWords+= words;
          else
            newWords+= item.slides[i].boxes[0].words;
        }
        if(newWords !== "")
          item.formattedLyrics[index].words = newWords
      }
    }
    else if(item.type === 'song' && wordIndex===0 && slide){
      if(words.length > 0)
        item.slides[wordIndex].boxes[0].words = words
    }

    this.props.updateItem(item);

    setTimeout(function(){
      document.getElementById("displayEditor").selectionEnd = cursor;
      document.getElementById("displayEditor").scrollTop = 0;
    }, 10)
    }

  render() {
    let {wordIndex, item, backgrounds, width, height} = this.props;
    let slides = item.slides || null;
    let slide = slides ? slides[wordIndex] : null;
    let box = slide ? slide.boxes[0] : null;

    let blankStyle = {width: width, height: height, background: 'black'}
    let blankTextStyle = {color: 'white', textAlign: 'center',
    fontSize: '4vw', paddingTop: '15%'}

    if(!box)
      return (<div style={blankStyle}><div style={blankTextStyle}>No Item Selected</div></div>)

    let words = box.words;
    let background = box.background;
    // let style = {
    //   fontColor: box.fontColor,
    //   fontSize: box.fontSize,
    //   brightness: box.brightness ? box.brightness+"%" : '100%',
    //
    // }

    return (
      <div style={{width: width, height: height, position: 'relative'}}>
        <DisplayWindow words={words} style={box} background={background} backgrounds={backgrounds}
          width={width} height={height} title={''} editor={true} handleTextChange={this.handleTextChange}
          handleBoxChange={this.handleBoxChange}>
        </DisplayWindow>
      </div>
    )
  }

}
export default DisplayEditor;
