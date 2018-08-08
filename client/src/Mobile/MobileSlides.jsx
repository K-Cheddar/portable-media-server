import React from 'react';
import left from '../assets/left-arrow.png';
import right from '../assets/right-arrow.png';
import MobileSlideInList from './MobileSlideInList';

export default class MobileSlides extends React.Component{

  constructor(){
    super();
    this.state ={
      slidesPerRow: 3
    }
  }

  clickSlide = (index) => {
    this.setWordIndex(index);
    window.scrollTo(0,0);
  }

  setWordIndex = (index) => {
    this.props.setWordIndex(index);
  }

  nextSlide = (index) => {
    let {item} = this.props;
    if(index < item.slides.length-1){
        this.props.setWordIndex(index+1)
    }

  }

  prevSlide = (index) => {
    if(index > 0)
      this.props.setWordIndex(index-1)
  }

  render() {
    let {item, backgrounds, wordIndex} = this.props;
    let {slidesPerRow} = this.state;
    let words = item.slides ? item.slides.map(a => a.boxes[0].words) : null;
    let row = [];
    let fullArray = [];
    let that = this;

    if(!words)
      return null;

    if(words[0] === "")
      words[0] = " "

    for(var i = 0; i < words.length; i+=slidesPerRow){
      for(var j = i; j < i+slidesPerRow; ++j){
        if(words[j])
          row.push(words[j]);
      }
      fullArray.push(row);
      row = [];
    }

    let style
    let widthNumber = 90/slidesPerRow;
    let width = widthNumber + "vw";
    let height = (widthNumber*.5625) + "vw";
    let titleSize = 1.5+ 3/slidesPerRow + "vw";
    //.5vw -> padding Top/Bot, .25vw -> border
    let fullHeight = `calc(${height} + ${titleSize} + 1vw)`;
    let slideWidth = 1/slidesPerRow*100 + '%';

    let slideStyle = { border:'1vw', borderColor: '#d9e3f4', borderStyle:'solid',
      width:width, height:fullHeight};
    let slideSelectedStyle = {border:'1vw', borderColor: '#4286f4', borderStyle:'solid',
       width:width, height:fullHeight};

    let slides = fullArray.map((element, index) => {
      let row = element.map(function (lyrics, i){

        let selected = (index*slidesPerRow+i === wordIndex);
        if(selected){
          style = slideSelectedStyle;
        }
        if(!selected){
          style = slideStyle;
        }
        return(
          <div style={{display:'flex', width:slideWidth, userSelect:'none'}} key={i} id={"MSlide"+(index*slidesPerRow+i)}>
            <div onClick={() => (that.clickSlide(index*slidesPerRow+i))} style={style}>
              <MobileSlideInList words={lyrics} style={item.slides[index*slidesPerRow+i].boxes[0]}
                 backgrounds={backgrounds}
                name={item.slides[index*slidesPerRow+i].type} width={width} height={height} titleSize={titleSize}/>

            </div>
          </div>
        );
      })
      return (
        <div style={{display:'flex', paddingBottom:'0.5vh'}} key={index}> {row}</div>
      );
    })

    return (
      <div>
      <div style={{ overflowY:'scroll', width: '100vw', height: "35vh"}}>{slides}</div>
      {words.length > 1 &&<div style={{ display:'flex', paddingTop:'1.5%'}}>
        <button style={{width:'50vw', height:'20vh', backgroundColor:'#d9e3f4', userSelect:'none'}}>
          <img style={{width:'45vw', height:'15vh', marginRight:'2vw'}}
             onClick={() => (that.prevSlide(wordIndex))}
             alt="left" src={left}
            />
        </button>
        <button style={{width:'50vw', height:'20vh', backgroundColor:'#d9e3f4'}}>
          <img style={{width:'45vw', height:'15vh', marginRight:'2vw'}}
             onClick={() => (that.nextSlide(wordIndex))}
             alt="right" src={right}
            />
        </button>
      </div>}
      </div>
    )
  }

}
