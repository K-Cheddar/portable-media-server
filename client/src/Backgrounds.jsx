import React from 'react';
import expandDown from './assets/expandDown.png';
import collapseUp from './assets/collapseUp.png';
import CreateName from './CreateName';

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

  close = () => {
    this.setState({allOpen: false})
  }

  open = () => {
    this.setState({allOpen: true})
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
    this.props.updateCurrent({background: selectedBackground, displayDirect: true})
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

    let {backgrounds, item, openUploader, user} = this.props;
    let {selected, allOpen, nameOpen, selectedBackground} = this.state;
    let BCKS = "";
    let row = [];
    let fullArray = [];
    let that = this;
    let numCols = 6;
    let width = '38vw';

    let itemStyle = {
        border:'0.25vw',   borderColor: '#383838',    borderStyle:'solid',
        height: '3vmax',   width: '5.33vmax',         padding: '.1vmax'
      }
    let itemSelectedStyle = {
        border:'0.25vw',    borderColor: '#4286f4',     borderStyle:'solid',
        height: '3vmax',    width: '5.33vmax',          padding: '.1vmax'
      }

    if(backgrounds && !allOpen){
      BCKS = backgrounds.map((pic, index) => {
      let itemSelected = (index === selected);
      return(
        <div key={index}>
          <img onClick={ () => this.selectBackground(index)} style={itemSelected ? itemSelectedStyle: itemStyle} alt={pic.name} src={pic.image.src}/>
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
            <div key={index*numCols+i}>
              <img onClick={ () => that.selectBackground(index*numCols+i)}
                style={itemSelected ? itemSelectedStyle: itemStyle} alt={pic.name} src={pic.image.src}/>
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
        overflowY: 'scroll',    width: width,     height: '38vh',
        background: '#383838',  marginTop: '1vh',   border: '0.25vw solid #c4c4c4',
        position:'absolute'
    }

    return (
      <div style={{position: 'relative', height: '22vh', width: width, zIndex: 3, marginBottom:'1%', color: 'white'}}>
          <div style={{display:'flex'}}>
          <div>Backgrounds</div>
          {(user!=='Demo') && <button style={{fontSize: "calc(5px + 0.35vw)", marginLeft: '1vw'}} onClick={openUploader}>Upload Backgrounds</button>}
          </div>
          <div style={{display:'flex', paddingTop: '1vh'}}>
            <button style={{width: '7vw', fontSize: "calc(7px + 0.35vw)"}} onClick={this.displayImage}>Display Image</button>
            <button style={{marginLeft:'1%', width: '7vw',fontSize: "calc(7px + 0.35vw)"}} onClick={this.openName}>Add To List</button>
            {item.slides &&<button style={{marginLeft:'1%', width: '9vw', fontSize: "calc(7px + 0.35vw)"}} onClick={this.setItemBackground}>Set Item Background</button>}
            {item.type==='song' &&<button style={{marginLeft:'1%', width: '10vw',fontSize: "calc(7px + 0.35vw)"}} onClick={this.setSlideBackground}>Set Slide Background</button>}
          </div>
          <div >
            {!allOpen && <div style={backgroundsRowStyle}>
            {BCKS}
          </div>}
            {allOpen && <div style={backgroundTableStyle}>{BCKS}</div>}
            {!allOpen && <img className='imgButton'
              style={{display:'block', width:'1vw', height:'1vw', marginLeft:"2%", position: 'absolute', right: '-1.5vw', bottom: '3vh'}}
               onClick={this.open}
               alt="expandDown" src={expandDown}
              />}
            {allOpen && <img className='imgButton'
              style={{display:'block', width:'1vw', height:'1vw', marginLeft:"2%", position: 'absolute', right: '-1.5vw', bottom: "-25vh"}}
               onClick={this.close}
               alt="collapseUp" src={collapseUp}
              />}
          </div>

          {nameOpen && <CreateName option="create" name={selectedBackground} type={'image'} db={this.props.db}
          close={this.closeName} addItem={this.props.addItem} background={selectedBackground}
          />}
      </div>
    )
  }

}
