import React from 'react';
import AllBackgrounds from './AllBackgrounds';
import open_all from './assets/open-all.png';
import collapse from './assets/collapse.png';

export default class Backgrounds extends React.Component{

  constructor(){
    super();
    this.state = {
      selected: -1,
      selectedBackground: "",
      allOpen: false,
    }

    this.selectBackground = this.selectBackground.bind(this);
    this.setItemBackground = this.setItemBackground.bind(this);
    this.setSlideBackground = this.setSlideBackground.bind(this);
    this.displayImage = this.displayImage.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  close(){
    this.setState({allOpen: false})
  }

  open(){
    this.setState({allOpen: true})
  }

  componentDidMount(){
    let {backgrounds} = this.props
    this.setState({selectBackground: backgrounds[0]})
  }

  displayImage(){
    let {selectedBackground} = this.state;
    this.props.updateCurrent({background: selectedBackground, words: ''})
  }

  selectBackground(index){
    let {backgrounds} = this.props
    this.setState({
      selected: index,
      selectedBackground: backgrounds[index].name
    })
  }

  setItemBackground(){
    let {selectedBackground} = this.state;
    this.props.setItemBackground(selectedBackground)
  }

  setSlideBackground(){
    let {selectedBackground} = this.state
    this.props.setSlideBackground(selectedBackground)
  }

  render() {

    let {backgrounds, item, openUploader, user} = this.props;
    let {selected, allOpen} = this.state;
    let BCKS = "";

    let itemStyle = {border:'0.25vw', borderColor: '#d9e3f4', borderStyle:'solid',
        height: '3vmax', width: '5.33vmax', padding: '.1vmax'}
    let itemSelectedStyle = {border:'0.25vw', borderColor: '#4286f4', borderStyle:'solid',
            height: '3vmax', width: '5.33vmax', padding: '.1vmax'}

    if(backgrounds){
      if(backgrounds.length > 0){
        BCKS = backgrounds.map((pic, index) => {
        let itemSelected = (index === selected);
        return(
          <div key={index}>
            <img onClick={ () => this.selectBackground(index)} style={itemSelected ? itemSelectedStyle: itemStyle} alt={pic.name} src={pic.image.src}/>
          </div>
        )
      })
      }
    }


    return (
      <div>
        <div style={{display:'flex'}}>
        <div>Backgrounds</div>
        {(user!=='Demo') && <button style={{ marginLeft: '1vw'}} onClick={openUploader}>Upload Backgrounds</button>}
          {!allOpen && <img style={{display:'block', width:'1.5vmax', height:'1.5vmax', paddingLeft:"2%"}}
             onClick={this.open}
             alt="open-all" src={open_all}
            />}
          {allOpen && <img style={{display:'block', width:'1.5vmax', height:'1.5vmax', paddingLeft:"2%"}}
             onClick={this.close}
             alt="collapse" src={collapse}
            />}
        </div>
        <div style={{display:'flex', paddingTop: '1vh'}}>
          <button style={{width: '7vw'}} onClick={this.displayImage}>Display Image</button>
          <button style={{marginLeft:'1%', width: '9vw'}} onClick={this.setItemBackground}>Set Item Background</button>
          {item.type==='song' &&<button style={{marginLeft:'1%', width: '10vw'}} onClick={this.setSlideBackground}>Set Slide Background</button>}
        </div>
        <div style={{display:'flex', overflowX: 'scroll', width: '36vmax'}}>{BCKS}</div>
        {allOpen  &&<AllBackgrounds setItemBackground={this.props.setItemBackground} updateCurrent={this.props.updateCurrent}
          setSlideBackground={this.props.setSlideBackground} item={item} backgrounds={backgrounds}
          />}
      </div>
    )
  }

}
