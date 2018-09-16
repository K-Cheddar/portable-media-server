import React from 'react';
import SlideInList from './SlideInList';
import LyricsBox from '../LyricElements/LyricsBox';
import zoomIn from '../assets/zoomIn.png'
import zoomOut from '../assets/zoomOut.png'
import {HotKeys} from 'react-hotkeys';
import * as SlideCreation from '../HelperFunctions/SlideCreation'

class ItemSlides extends React.Component{

  constructor(){
    super();

    this.state = {
      lBoxOpen: false,
      mouseX: 0,
      mouseY: 0,
      indexBeingDragged:-1,
      mouseDown: false,
      slidesPerRow: 4
    }

    this.handlers = {
      'nextSlide': this.nextSlide,
      'prevSlide': this.prevSlide
    }
    this.checkHeld = null;
  }

  updateMouse = (e) => {
    if(!this.state.mouseDown)
      return;
    this.setState({
      mouseX: e.clientX,
      mouseY: e.clientY
    })
  }

  setElement = (index) => {

    this.props.setWordIndex(index);

    // this.setState({
    //   mouseDown: true
    // })
    //
    // this.checkHeld = setTimeout(function() {
    //   let {mouseDown} = this.state;
    //   if(mouseDown){
    //     this.setState({indexBeingDragged: index})
    //   }
    //
    // }.bind(this), 350);

  }

  setTarget = (index) => {
    let {indexBeingDragged} = this.state;
    if((indexBeingDragged !== -1) && (indexBeingDragged !== index)){
      this.props.insertWords(index);
      this.setState({indexBeingDragged: index})
    }
  }

  releaseElement = () => {
    if(!this.state.mouseDown)
      return;
    clearTimeout(this.checkHeld)
    this.setState({
      indexBeingDragged: -1,
      mouseDown: false
    })

  }

  openLBox = () => {
    this.setState({lBoxOpen: true})
  }

  closeLBox = () => {
    this.setState({lBoxOpen: false})
  }

  addSlide = () => {
    let {item, wordIndex} = this.props;
    let slides;
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides || null;
    else
      slides = item.slides || null;

    if(!slides)
      return;

    let box = slides[wordIndex].boxes[0]

    slides.splice(wordIndex+1, 0, [SlideCreation.newSlide({type: 'Static', fontSize: box.fontSize, words: '',
     background: box.background, brightness: box.brightness})])

    this.props.updateItem(item);
    this.props.setWordIndex(slides.length-1)
  }

  deleteSlide = (index) => {
    let {item} = this.props;
    let slides;
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides || null;
    else
      slides = item.slides || null;
    slides.splice(index, 1);
    this.props.updateItem(item);
  }

  increaseRows = () => {
    let {slidesPerRow} = this.state;
    if(slidesPerRow < 8)
      this.setState({slidesPerRow: slidesPerRow+1})
  }

  decreaseRows = () => {
    let {slidesPerRow} = this.state;
    if(slidesPerRow > 2)
      this.setState({slidesPerRow: slidesPerRow-1})
  }

  nextSlide = () => {
    let {item, wordIndex} = this.props;
    let slides;
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides || null;
    else
      slides = item.slides || null;
    if(!slides)
      return;
    let lastSlide = slides.length-1;
    if(wordIndex < lastSlide)
      this.props.setWordIndex(wordIndex+1)
  }

  prevSlide = () => {
    let {item, wordIndex} = this.props;
    let slides;
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides || null;
    else
      slides = item.slides || null;
    if(!slides)
      return;
    if(wordIndex > 0)
      this.props.setWordIndex(wordIndex-1)
  }

  render() {
    let {item, backgrounds, wordIndex} = this.props;
    let {mouseX, mouseY, indexBeingDragged, slidesPerRow} = this.state;
    let type = item.type;
    let that = this;
    let row = [];
    let fullArray = [];
    let name = item.name;

    let slides;
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides || null;
    else
      slides = item.slides || null;

    let words = slides ? slides.map(a => a.boxes[0].words) : null;

    if(name && name.length > 32){
      name = name.substring(0, 33)
      name+="..."
    }

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

    let style;

    let widthNumber = 37/slidesPerRow
    let width = widthNumber + "vw"
    let height = (widthNumber*.5625) + "vw"
    let titleSize = .5+ 1.25/slidesPerRow + "vw"
    //.5vw -> padding Top/Bot, .25vw -> border
    let fullHeight = `calc(${height} + ${titleSize} + .5vw + .25vw)`
    let slideWidth = 1/slidesPerRow*100 + '%'


    let slideStyle = { border:'0.25vw', borderColor: '#383838', borderStyle:'solid',
      width:width, height:fullHeight};
    let slideSelectedStyle = {border:'0.25vw', borderColor: '#06d1d1', borderStyle:'solid',
       width:width, height:fullHeight};
    let slideDraggedStyle = { border:'0.25vw', borderColor: '#ffdb3a', borderStyle:'solid',
      width:width, height:fullHeight, opacity:'0.5'};

    let ROWtest = fullArray.map((element, index) => {
      let row = element.map(function (lyrics, i){

        let selected = (index*slidesPerRow+i === wordIndex);
        let beingDragged = (indexBeingDragged === index*slidesPerRow+i)
        if(selected){
          style = slideSelectedStyle;
        }
        if(!selected){
          style = slideStyle;
        }
        if(beingDragged){
          style = slideDraggedStyle;
        }
        return(
          <div style={{display:'flex', width:slideWidth, userSelect:'none'}} key={i} id={"Slide"+(index*slidesPerRow+i)}>
            <div  style={style}
              onMouseDown={() => (that.setElement(index*slidesPerRow+i))}
              onMouseOver={() => (that.setTarget(index*slidesPerRow+i))}
              >
              {(selected && beingDragged) &&
                <SlideInList words={lyrics} style={slides[index*slidesPerRow+i].boxes[0]}
                  backgrounds={backgrounds} x={mouseX} y={mouseY} moving={true}
                  name={slides[index*slidesPerRow+i].type} width={width} height={height}
                  titleSize={titleSize}
                  />
              }
              {(!selected || !beingDragged) &&
                <SlideInList words={lyrics} style={slides[index*slidesPerRow+i].boxes[0]}
                  name={slides[index*slidesPerRow+i].type}  width={width} height={height}
                  backgrounds={backgrounds} titleSize={titleSize}
                  />
              }

            </div>
          </div>
        );
      })
      return (
        <div style={{display:'flex', paddingBottom:'0.5vh'}} key={index}> {row}</div>
      );
    })

    let buttonStyle = {fontSize: "calc(7px + 0.5vw)", margin:"0.25vh 0.25vw", backgroundColor:'#383838',
       border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white', padding:'0.25vw',
       width:'20%'}


    return (
      <HotKeys style={{color: 'white', height: '100%', width: '100%'}} handlers={this.handlers}>
        <div style={{display:'flex', margin:'1% 0%', fontSize: "calc(7px + 0.5vw)",}}>
          <div style={{fontSize: 'calc(10px + 1vw)', width: '60%', paddingLeft:'0.5vw'}}> {name} </div>
          {(type==='song') && <button style={buttonStyle} onClick={this.openLBox}>Arrange Lyrics</button>}
          {(type!=='song') && <div style={{ width: '20%'}} ></div>}
          <img style={{display:'block', width:'2vw', height:'2vw', marginLeft:'1vw'}}
              onClick={this.decreaseRows}
              alt="zoomIn" src={zoomIn}
             />
          <img style={{display:'block', width:'2vw', height:'2vw', marginLeft:'1vw'}}
               onClick={this.increaseRows}
               alt="zoomOut" src={zoomOut}
              />
        </div>
      <div style={{overflowX: 'hidden', height: "88%", width:"100%"}}
        onMouseMove={this.updateMouse} onMouseUp={this.releaseElement}
        onMouseLeave={this.releaseElement}>{ROWtest}</div>
      {this.state.lBoxOpen &&<LyricsBox close={this.closeLBox} item={item} setWordIndex={this.props.setWordIndex}
      updateItem={this.props.updateItem} formatSong={this.props.formatSong}
      setSlideBackground={this.props.setSlideBackground}/>}
    </HotKeys>
    )
  }

}
export default ItemSlides;


// import deleteX from './assets/deleteX.png';

// let deleteEnable = (index+i !== 0 && type === 'song');

// <div style={{padding:'1.5%'}}>
//   {deleteEnable && <img style={{display:'block', width:'1.5vw', height:'1.5vw'}}
//      onClick={() => (that.deleteSlide(index*3+i))}
//      alt="delete" src={deleteX}
//     />
//   }
// </div>
