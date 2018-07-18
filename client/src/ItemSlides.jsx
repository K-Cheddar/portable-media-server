import React from 'react';
import SlideInList from './SlideInList';
import LyricsBox from './LyricsBox';

class ItemSlides extends React.Component{

  constructor(){
    super();

    this.state = {
      lBoxOpen: false,
      mouseX: 0,
      mouseY: 0,
      indexBeingDragged:-1,
      mouseDown: false,
    }

    this.checkHeld = null;

    this.addSlide = this.addSlide.bind(this);
    this.deleteSlide = this.deleteSlide.bind(this);
    this.openLBox = this.openLBox.bind(this);
    this.closeLBox = this.closeLBox.bind(this);
    this.updateMouse = this.updateMouse.bind(this);
    this.setElement = this.setElement.bind(this);
    this.releaseElement = this.releaseElement.bind(this);

  }

  updateMouse(e){

    this.setState({
      mouseX: e.clientX,
      mouseY: e.clientY
    })
  }

  setElement(index, lyrics){

    this.props.setWordIndex(index, lyrics);

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

  setTarget(index){
    let {indexBeingDragged} = this.state;
    if((indexBeingDragged !== -1) && (indexBeingDragged !== index)){
      this.props.insertWords(index);
      this.setState({indexBeingDragged: index})
    }
  }

  releaseElement(){
    clearTimeout(this.checkHeld)
    this.setState({
      indexBeingDragged: -1,
      mouseDown: false
    })

  }

  openLBox(){
    this.setState({lBoxOpen: true})
  }

  closeLBox(){
    this.setState({lBoxOpen: false})
  }

  addSlide(){
    let {item, wordIndex} = this.props;
    item.words.splice(wordIndex+1, 0, {type: item.words[wordIndex].type, words:' '})
    this.props.updateItem(item);
    this.props.setWordIndex(item.words.length-1)
  }

  deleteSlide(index){
    let {item} = this.props;
    item.words.splice(index, 1);
    this.props.updateItem(item);
  }


  render() {
    let {item, backgrounds, wordIndex} = this.props;
    let {mouseX, mouseY, indexBeingDragged} = this.state;
    let type = item.type;
    let words = item.words ? item.words.map(a => a.words) : null;
    let that = this;
    let row = [];
    let fullArray = [];
    if(!words)
      return null;

    for(var i = 0; i < words.length; i+=3){
      for(var j = i; j < i+3; ++j){
        if(words[j])
          row.push(words[j]);
      }

      fullArray.push(row);
      row = [];
    }

    let style;

    let slideStyle = { border:'0.25vw', borderColor: '#d9e3f4', borderStyle:'solid',
      width:"12.24vw", height:"7.5vw"};
    let slideSelectedStyle = {border:'0.25vw', borderColor: '#4286f4', borderStyle:'solid',
       width:"12.24vw", height:"7.5vw"};
    let slideDraggedStyle = { border:'0.25vw', borderColor: '#4286f4', borderStyle:'solid',
      width:"12.24vw", height:"7.5vw", opacity:'0.5'};

    let ROWtest = fullArray.map((element, index) => {
      let row = element.map(function (lyrics, i){

        let selected = (index*3+i === wordIndex);
        let beingDragged = (indexBeingDragged === index*3+i)
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
          <div style={{display:'flex', width:'33%', userSelect:'none'}} key={i} id={"Slide"+(index*3+i)}>
            <div  style={style}
              onMouseDown={() => (that.setElement(index*3+i, lyrics))}
              onMouseOver={() => (that.setTarget(index*3+i))}
              >
              {(selected && beingDragged) &&
                <SlideInList words={lyrics} background={item.background} sBackground={item.words[index*3+i].background}
                  color={item.style.color}
                  fontSize={(index === 0 && i === 0) ? item.nameSize : item.style.fontSize}
                  backgrounds={backgrounds} x={mouseX} y={mouseY} moving={true}
                  />
              }
              {(!selected || !beingDragged) &&
                <SlideInList words={lyrics} background={item.background} sBackground={item.words[index*3+i].background}
                  color={item.style.color}
                  fontSize={(index === 0 && i === 0) ? item.nameSize : item.style.fontSize}
                  backgrounds={backgrounds}
                  />
              }

            </div>
          </div>
        );
      })
      return (
        <div style={{display:'flex', paddingBottom:'1vh'}} key={index}> {row}</div>
      );
    })

    let buttonLoggedIn = {fontSize: "calc(7px + 0.5vw)", width:'8vw'}

    return (
      <div>
        {(type === 'song') && <div>
          <div style={{display:'flex', marginTop:'1%', fontSize: "calc(7px + 0.5vw)",}}>
            <div style={{fontSize: 'calc(10px + 1vw)'}}> {item.name} </div>
            <div style={{marginLeft:'1vw'}}>
              <button style={buttonLoggedIn} onClick={this.openLBox}>Format Lyrics</button>
            </div>
          </div>
        <div style={{ overflowY: 'scroll', height: "36vh", width:"45vw"}}
          onMouseMove={this.updateMouse} onMouseUp={this.releaseElement}
          onMouseLeave={this.releaseElement}>{ROWtest}</div>
        {this.state.lBoxOpen &&<LyricsBox close={this.closeLBox} item={item}
        updateItem={this.props.updateItem} formatSong={this.props.formatSong}/>}
      </div>}
      {(type === 'bible') && <div>
        <div style={{display:'flex', marginTop:'1%', fontSize: "calc(7px + 0.5vw)",}}>
          <div style={{fontSize: 'calc(10px + 1vw)'}}> {item.name} </div>
        </div>
      <div style={{ overflowY: 'scroll', height: "36vh", width:"45vw"}}
        onMouseMove={this.updateMouse} onMouseUp={this.releaseElement}
        onMouseLeave={this.releaseElement}>{ROWtest}</div>
    </div>}
      {(type==='image') && <div style={{fontSize: 'calc(10px + 1vw)', margin:'1%'}}>
        {item.name}
      </div>}
      </div>
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
