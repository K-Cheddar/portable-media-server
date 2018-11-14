import React from 'react';
import SlideInList from './SlideInList';
import LyricsBox from '../LyricElements/LyricsBox';
import zoomIn from '../assets/zoomIn.png'
import zoomOut from '../assets/zoomOut.png'
import {HotKeys} from 'react-hotkeys';
import * as SlideCreation from '../HelperFunctions/SlideCreation';
import newButton from '../assets/new-button.png';
import deleteX from '../assets/deleteX.png';

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
    let {item} = this.props;
    if(item.type === 'announcements' || item.type === 'image'){
      if(index < this.props.item.slides.length)
        this.props.setWordIndex(index);

        this.setState({
          mouseDown: true
        })

        this.checkHeld = setTimeout(function() {
          let {mouseDown, indexBeingDragged } = this.state;
          if(mouseDown && indexBeingDragged ===-1){
            this.setState({indexBeingDragged: index})
          }

        }.bind(this), 250);
    }
    else
      this.props.setWordIndex(index);

  }

  setTarget = (index) => {
    let {indexBeingDragged} = this.state;
    if((indexBeingDragged !== -1) && (indexBeingDragged !== index)){
      this.insertWords(index);
      this.setState({indexBeingDragged: index})
    }
  }

  insertWords = (targetIndex) => {
    let {item, wordIndex} = this.props;
    let slides, slide;
    if(item.type === 'announcements' || item.type === 'image'){
      slides = item.slides;
      slide = slides[wordIndex];
      slides.splice(wordIndex, 1);
      slides.splice(targetIndex, 0, slide);
      item.slides = slides
    }

    this.props.setWordIndex(targetIndex);
    this.props.updateItem(item);
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

  updateDuration = (e) => {
    let {item, wordIndex} = this.props;
    let num = e.target.value;
    if(num <= 0)
      num = 1
    item.slides[wordIndex].duration = num
    this.props.updateItem(item);
  }

  addSlide = () => {
    let {item} = this.props;
    let slides;
    // if (item.type === 'song')
    //   slides = item.arrangements[item.selectedArrangement].slides || null;
    // else
    //   slides = item.slides || null;
    //
    // if(!slides)
    //   return;

    if(item.type === 'announcements'){
      slides = item.slides;
      let fontSize = slides[slides.length-1].boxes[2].fontSize;
      slides.push(SlideCreation.newSlide({type: "Announcement", textFontSize: fontSize}))
    }
    if(item.type === 'image'){
      slides = item.slides;
      slides.push(SlideCreation.newSlide({type: 'Image', background: '', fontSize: 4.5}))
    }
    // slides.splice(wordIndex+1, 0, [SlideCreation.newSlide({type: 'Static', fontSize: box.fontSize, words: '',
    //  background: box.background, brightness: box.brightness})])
    this.props.updateItem(item);
  }

  deleteSlide = (index) => {
    let {item} = this.props;
    let slides;
    // if (item.type === 'song')
    //   slides = item.arrangements[item.selectedArrangement].slides || null;
    // else

    slides = item.slides
    if(index === slides.length-1)
      this.props.setWordIndex(index-1)
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

  updateTimerHours = (e) => {
    let {item, wordIndex} = this.props;
    let num = parseInt(e.target.value, 10);
    if(isNaN(num))
      num = 0
    let words = item.slides[wordIndex].boxes[1].words;
    let numAsString = "0";
    if(num < 0)
      num = 0
    if(num > 99)
      num = 99;
    item.hours = num;
    if(num >= 0 && num <= 9)
      numAsString+=num;
    else
      numAsString= num.toString();
    item.slides[wordIndex].boxes[1].words = numAsString + words.substring(2);
    this.props.updateItem(item);
  }

  updateTimerMinutes = (e) => {
    let {item, wordIndex} = this.props;
    let num = parseInt(e.target.value, 10);
    if(isNaN(num))
      num = 0
    let words = item.slides[wordIndex].boxes[1].words;
    let numAsString = "0";
    if(num < 0)
      num = 0
    if(num > 59)
      num = 59;
    item.minutes = num;
    if(num >= 0 && num <= 9)
      numAsString+=num;
    else
      numAsString= num.toString();
    item.slides[wordIndex].boxes[1].words = words.substring(0,3) + numAsString + words.substring(5);
    this.props.updateItem(item);
  }

  updateTimerSeconds = (e) => {
    let {item, wordIndex} = this.props;
    let num = parseInt(e.target.value, 10);
    if(isNaN(num))
      num = 0

    let words = item.slides[wordIndex].boxes[1].words;
    let numAsString = "0";
    if(num < 0)
      num = 0
    if(num > 59)
      num = 59;
    item.seconds = num;
    if(num >= 0 && num <= 9)
      numAsString+=num;
    else
      numAsString= num.toString();
    item.slides[wordIndex].boxes[1].words = words.substring(0,6) + numAsString;
    this.props.updateItem(item);
  }


  render() {
    let {item, backgrounds, wordIndex, boxIndex} = this.props;
    let {mouseX, mouseY, indexBeingDragged, slidesPerRow} = this.state;
    let type = item.type;
    let that = this;
    let row = [];
    let fullArray = [];
    let name = item.name;
    let freeSlides = item.type === 'announcements' || item.type === 'image';

    let slides;
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides || null;
    else
      slides = item.slides || null;

    if(name && name.length > 31){
      name = name.substring(0, 32)
      name+="..."
    }
    if(!slides)
      return null;


    for(var i = 0; i < slides.length; i+=slidesPerRow){
      for(var j = i; j < i+slidesPerRow; ++j){
        if(slides[j])
          row.push(slides[j]);
      }
      fullArray.push(row);
      row = [];
    }
    if(freeSlides){
      let lastRow = fullArray[fullArray.length -1];
      if(lastRow.length < slidesPerRow)
        lastRow.push('newSection')
      else
        fullArray.push(['newSection'])
    }

    let style;

    let widthNumber = freeSlides ? 34/slidesPerRow : 37/slidesPerRow
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
      let row = element.map(function (subElement, i){
        let newSection = subElement === 'newSection';
        let selected = (index*slidesPerRow+i === wordIndex);
        let beingDragged = (indexBeingDragged === index*slidesPerRow+i);
        let deleteEnable = false;
        if(item.type === 'image')
          deleteEnable = item.slides.length > 1;
        if(item.type === 'announcements')
          deleteEnable = index+i > 1 || index > 0;
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
            <div style={style}
              onMouseDown={() => that.setElement(index*slidesPerRow+i)}
              onMouseOver={() => that.setTarget(index*slidesPerRow+i)}
              >
              {(selected && beingDragged && !newSection) &&
                <SlideInList slide={slides[index*slidesPerRow+i]} backgrounds={backgrounds}
                  x={mouseX} y={mouseY} moving={true} width={width} height={height}
                  titleSize={titleSize}
                  />
              }
              {((!selected || !beingDragged) && !newSection) &&
                <SlideInList slide={slides[index*slidesPerRow+i]}
                  name={slides[index*slidesPerRow+i].type} width={width} height={height}
                  backgrounds={backgrounds} titleSize={titleSize}
                  />
              }
              {newSection && <div className='imgButton' style={{backgroundColor: '#b7b7b7',
                 height:'95%', border: '0.25vw #2ECC71 solid',
                borderRadius:'0.5vw', fontWeight: 'bold'}}
              onClick={that.addSlide}>
              <div style={{textAlign: 'center', paddingTop: '5%', fontSize: `calc(5.6vw*${1/slidesPerRow})`,
                color: 'black'}}>New Slide</div>
              <img style={{display:'block', width:'50%', height:'60%', margin:'0.5vh auto'}}
                 alt="newButton" src={newButton}
                />
              </div>}
            </div>
            {(deleteEnable && !newSection) && <img className='imgButton'
              style={{display:'block', width:`calc(1.5vw*${4/slidesPerRow})`, height:`calc(1.5vw*${4/slidesPerRow})`}}
               onClick={() => that.deleteSlide(index*slidesPerRow+i)}
               alt="delete" src={deleteX}
              />
            }
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
        <div style={{display:'flex', margin:'1% 0%', fontSize: "calc(7px + 0.5vw)"}}>
          <div style={{fontSize: 'calc(10px + 1vw)', width: '60%', paddingLeft:'0.5vw'}}> {name} </div>
          {(type==='song') && <button style={buttonStyle} onClick={this.openLBox}>Arrange Lyric</button>}
          {(type==='timer' && <div style={{display: 'flex'}}>
            <div style={{fontSize: '0.85vw', margin: '0 0.5vw', display: 'flex', alignItems: 'center'}}>
              Hours</div>
            <input type='number' value={item.hours} onChange={this.updateTimerHours}
              style={{fontSize: '0.85vw', width:'2vw', padding: '0.25vh 0'}}/>
            <div style={{fontSize: '0.85vw', margin: '0 0.5vw', display: 'flex', alignItems: 'center'}}>
              Minutes</div>
            <input type='number' value={item.minutes} onChange={this.updateTimerMinutes}
              style={{fontSize: '0.85vw', width:'2vw', padding: '0.25vh 0'}}/>
            <div style={{fontSize: '0.85vw', margin: '0 0.5vw', display: 'flex', alignItems: 'center'}}>
              Seconds</div>
            <input type='number' value={item.seconds} onChange={this.updateTimerSeconds}
              style={{fontSize: '0.85vw', width:'2vw', padding: '0.25vh 0'}}/>
          </div>

          )}
          {(type==='announcements' && wordIndex >= 0) && <div style={{display: 'flex'}}>
            <div style={{fontSize: '0.85vw', marginRight: '0.5vw', display: 'flex', alignItems: 'center'}}>
              Duration</div>
            <input type='number' value={item.slides[wordIndex].duration} onChange={this.updateDuration}
              style={{fontSize: '0.85vw', width:'2vw', padding: '0.25vh 0'}}/>
          </div>}
          {(type !=='song' && type !== 'announcements') && <div style={{ width: '20%'}} ></div>}
          {(type !=='timer' && <div style={{display: 'flex'}}>
            <img className='imgButton' style={{display:'block', width:'2vw', height:'2vw', marginLeft:'1vw'}}
                onClick={this.decreaseRows}
                alt="zoomIn" src={zoomIn}
               />
            <img className='imgButton' style={{display:'block', width:'2vw', height:'2vw', marginLeft:'1vw'}}
                 onClick={this.increaseRows}
                 alt="zoomOut" src={zoomOut}
                />
          </div>)}
        </div>
      <div style={{overflowX: 'hidden', height: "86%", width:"100%"}}
        onMouseMove={this.updateMouse} onMouseUp={this.releaseElement}
        onMouseLeave={this.releaseElement}>{ROWtest}</div>
      {this.state.lBoxOpen &&<LyricsBox close={this.closeLBox} item={item} setWordIndex={this.props.setWordIndex}
      updateItem={this.props.updateItem} formatSong={this.props.formatSong} boxIndex={boxIndex}
      setSlideBackground={this.props.setSlideBackground}/>}
    </HotKeys>
    )
  }

}
export default ItemSlides;
