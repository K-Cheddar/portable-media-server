import React from 'react';
import expandDown from '../assets/expandDown.png';
import collapseUp from '../assets/collapseUp.png';
import upload from '../assets/upload.png'
import CreateName from '../CreateName';

export default class Backgrounds extends React.Component{

  constructor(){
    super();
    this.state = {
      selected: -1,
      selectedBackground: "",
      nameOpen: false,
      allOpen: false,
    }
  }

  closeName = () => {
    this.setState({nameOpen: false})
  }

  openName = () => {
    this.setState({nameOpen: true})
  }

  componentDidMount = () => {
    let {backgrounds} = this.props
    this.setState({selectBackground: backgrounds[0]})
  }

  displayImage = () =>{
    let {selectedBackground} = this.state;
    this.props.updateCurrent({image: selectedBackground, displayDirect: true})
  }

  selectBackground = (index) => {
    let {backgrounds} = this.props
    this.setState({
      selected: index,
      selectedBackground: backgrounds[index].name
    })
  }

  setItemBackground = () =>{
    let {selectedBackground} = this.state;
    this.props.setItemBackground(selectedBackground)
  }

  setSlideBackground = () => {
    let {selectedBackground} = this.state
    this.props.setSlideBackground(selectedBackground)
  }

  render() {

    let {backgrounds, item, openUploader, user, allItems} = this.props;
    let {selected, allOpen, nameOpen, selectedBackground} = this.state;
    let BCKS = "";
    let row = [];
    let fullArray = [];
    let that = this;
    let numCols = 6;
    let width = '38vw';

    let slides;
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides;
    else
      slides = item.slides;

    let itemStyle = {
        border:'0.25vw',      borderColor: '#383838', borderStyle:'solid',
        height: '3vmax',      width: '5.33vmax',      padding: '.1vmax',
        position: 'relative', display: 'flex',        justifyContent: 'center'
      }
    let itemSelectedStyle = {
        border:'0.25vw',      borderColor: '#4286f4',   borderStyle:'solid',
        height: '3vmax',      width: '5.33vmax',        padding: '.1vmax',
        position: 'relative', display: 'flex',          justifyContent: 'center'
      }

    let imageStyle = {
      height: '100%' 
    }

    if(backgrounds && !allOpen){
      BCKS = backgrounds.map((pic, index) => {
      let itemSelected = (index === selected);
      return(
        <div key={index} style={itemSelected ? itemSelectedStyle: itemStyle}>
          <img onClick={ () => this.selectBackground(index)} alt={pic.name} src={pic.image.src} style={imageStyle}/>
        </div>
      )
    })
    }
    if(backgrounds && allOpen){
      for(var i = 0; i < backgrounds.length; i+=numCols){
        for(var j = i; j < i+numCols; ++j){
          if(backgrounds[j])
            row.push(backgrounds[j]);
        }
        fullArray.push(row);
        row = [];
      }

      BCKS = fullArray.map((element, index) => {
        let row = element.map(function (pic, i){
          let itemSelected = (index*numCols + i === selected);
          return(
            <div key={index*numCols+i} style={itemSelected ? itemSelectedStyle: itemStyle}>
              <img onClick={ () => that.selectBackground(index*numCols+i)}
                 alt={pic.name} src={pic.image.src} style={imageStyle}/>
            </div>
          )
        })
        return (
          <div style={{display:'flex', paddingBottom:'0.5vh', paddingRight: '0.5vw'}} key={index}> {row}</div>
        );

    })
    }

    let backgroundsRowStyle = {
      display:'flex',     overflowX: 'scroll',    width: width,
      marginTop: '1vh',   border: '0.25vw solid #c4c4c4', position:'absolute'
    }
    let backgroundTableStyle = {
        overflowY: 'scroll',    width: width,     maxHeight: '75vh',
        background: '#383838',  marginTop: '1vh',   border: '0.25vw solid #c4c4c4',
        position:'absolute'
    }

    let buttonStyle = {fontSize: "calc(7px + 0.4vw)", margin:"0.25vh 0.25vw", backgroundColor:'#383838',
       border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white', padding:'0.25vw',
       width: '9vw'}


    return (
      <div style={{position: 'relative', height: '22vh', width: width, zIndex: 4, marginBottom:'2vh', color: 'white'}}>
          <div style={{display:'flex'}}>
          <div style={{marginTop:'1vh'}}>Backgrounds</div>
          {(user!=='Demo') &&
            <img className='imgButton' style={{display:'block', margin: '1vh 1vw', width:'1.5vw', height:'1.5vw'}}
               onClick={openUploader}
               alt="upload" src={upload}
               />}
          </div>
          <div style={{display:'flex', paddingTop: '1vh'}}>
            <button style={buttonStyle} onClick={this.displayImage}>Display Image</button>
            <button style={buttonStyle} onClick={this.openName}>Add To List</button>
            {slides &&<button style={buttonStyle} onClick={this.setItemBackground}>Set Item Background</button>}
            {slides &&<button style={buttonStyle} onClick={this.setSlideBackground}>Set Slide Background</button>}
          </div>
          <div style={{ position: 'relative' }}>
            {!allOpen && <div style={backgroundsRowStyle}>
            {BCKS}
          </div>}
            {allOpen && <div style={backgroundTableStyle}>{BCKS}</div>}
            <img className='imgButton'
              style={{
                display:'block', width:'1vw', height:'1vw', marginLeft:"4px",
                position: 'absolute', right: '-2vw', top: '0', ...(allOpen && {transform: 'rotate(180deg)'} )
              }}
              onClick={() => this.setState( {allOpen: !allOpen })}
              alt="expandDown" 
              src={expandDown}

            />  
          </div>

          {nameOpen && <CreateName option="create" name={selectedBackground} type={'image'}
          close={this.closeName} addMedia={this.props.addMedia} background={selectedBackground}
          allItems={allItems} item={item}
          />}
      </div>
    )
  }

}
