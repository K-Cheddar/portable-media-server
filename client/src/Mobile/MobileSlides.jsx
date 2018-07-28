import React from 'react';
import left from '../assets/left-arrow.png';
import right from '../assets/right-arrow.png';
import MobileSlideInList from './MobileSlideInList';

export default class MobileSlides extends React.Component{

  constructor(){
    super();

    this.setWordIndex = this.setWordIndex.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.clickSlide = this.clickSlide.bind(this);
  }


  clickSlide(index, lyrics){
    this.setWordIndex(index, lyrics);
    window.scrollTo(0,0);
  }

  setWordIndex(index, lyrics){
    var element = document.getElementById("MSlide"+index);
    console.log("element")
    //if(element)
      element.scrollIntoView();
    this.props.setWordIndex(index, lyrics);
  }

  nextSlide(index){
    let {item} = this.props;
    if(index < item.slides.length-1){
        this.props.setWordIndex(index+1, item.slides[index+1].boxes[0].words)
    }

  }

  prevSlide(index){
    let {item} = this.props;
    if(index > 0)
      this.props.setWordIndex(index-1, item.slides[index-1].boxes[0].words)
  }

  render() {
    let {item, backgrounds, wordIndex} = this.props;
    let words = item.slides ? item.slides.map(a => a.boxes[0].words) : null;
    //let name = item.name;
    let that = this;

    if(!words)
      return null;


    let slides = words.map((lyrics, index) => {
      return (
        <div style={(index === wordIndex) ? {border:'0.5vmax', borderColor: '#4286f4', borderStyle:'solid',
           height:"13.4vmax"}
         : {border:'0.5vmax', borderColor: '#d9e3f4', borderStyle:'solid',
           height:"13.4vmax"}} key={index} id={"MSlide"+index}
          onClick={() => (that.clickSlide(index, lyrics))}
          >
          <MobileSlideInList words={lyrics} background={item.background} color={item.slides[wordIndex].boxes[0].fontColor}
            fontSize={(index === 0) ? item.nameSize : item.slides[wordIndex].boxes[0].fontSize} backgrounds={backgrounds}
            sBackground={item.slides[index].boxes[0].background}/>
        </div>
      );
    })

    return (
      <div>
      <div style={{ overflowX: 'scroll', overflowY:'hidden', display:'flex', height: "18vh"}}>{slides}</div>
      {words.length > 1 &&<div style={{ display:'flex'}}>
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
