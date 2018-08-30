import React from 'react';
import open_all from './assets/open-all.png';
import collapse from './assets/collapse.png';
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
    this.props.updateCurrent({background: selectedBackground, displayImage: true})
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

    let itemStyle = {
        border:'0.25vw',   borderColor: '#d9e3f4',    borderStyle:'solid',
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
          <div style={{display:'flex', paddingBottom:'0.5vh'}} key={index}> {row}</div>
        );

    })
    }

    let backgroundsRowStyle = {
      display:'flex',     overflowX: 'scroll',    width: '38vmax',
      marginTop: '1vh',   border: '0.25vw solid #CCC',
    }
    let backgroundTableStyle = {
        overflowY: 'scroll',    width: '38vmax',     height: '38vh',
        background: '#d9e3f4',  marginTop: '1vh',   border: '0.25vw solid #CCC'
    }

    return (
      <div style={{position: 'relative', height: '22vh', zIndex: 3, marginBottom:'1%'}}>
          <div style={{display:'flex'}}>
          <div>Backgrounds</div>
          {(user!=='Demo') && <button style={{fontSize: "calc(5px + 0.35vw)", marginLeft: '1vw'}} onClick={openUploader}>Upload Backgrounds</button>}
            {!allOpen && <img className='imgButton'
              style={{display:'block', width:'1.5vmax', height:'1.5vmax', marginLeft:"2%"}}
               onClick={this.open}
               alt="open-all" src={open_all}
              />}
            {allOpen && <img className='imgButton'
              style={{display:'block', width:'1.5vmax', height:'1.5vmax', marginLeft:"2%"}}
               onClick={this.close}
               alt="collapse" src={collapse}
              />}
          </div>
          <div style={{display:'flex', paddingTop: '1vh'}}>
            <button style={{width: '7vw', fontSize: "calc(7px + 0.35vw)"}} onClick={this.displayImage}>Display Image</button>
            <button style={{marginLeft:'1%', width: '7vw',fontSize: "calc(7px + 0.35vw)"}} onClick={this.openName}>Add To List</button>
            {item.slides &&<button style={{marginLeft:'1%', width: '9vw', fontSize: "calc(7px + 0.35vw)"}} onClick={this.setItemBackground}>Set Item Background</button>}
            {item.type==='song' &&<button style={{marginLeft:'1%', width: '10vw',fontSize: "calc(7px + 0.35vw)"}} onClick={this.setSlideBackground}>Set Slide Background</button>}
          </div>
          {!allOpen && <div style={backgroundsRowStyle}>{BCKS}</div>}
          {allOpen && <div style={backgroundTableStyle}>{BCKS}</div>}
          {nameOpen && <CreateName option="create" name={selectedBackground} type={'image'} db={this.props.db}
          close={this.closeName} addItem={this.props.addItem} background={selectedBackground}
          />}
      </div>
    )
  }

}
