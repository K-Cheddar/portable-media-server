import React from 'react';

export default class AllBackgrounds extends React.Component{

  constructor(){
    super();
    this.state = {
      selected: -1,
      selectedBackground: ""
    }

  }

  componentDidMount(){
    let {backgrounds} = this.props
    this.setState({selectBackground: backgrounds[0]})
  }

  displayImage = () => {
    let {selectedBackground} = this.state;
    this.props.updateCurrent({background: selectedBackground, words: ''})
  }

  selectBackground = (index) => {
    let {backgrounds} = this.props
    this.setState({
      selected: index,
      selectedBackground: backgrounds[index].name
    })
  }

  setItemBackground = () => {
    let {selectedBackground} = this.state;
    this.props.setItemBackground(selectedBackground)
  }

  setSlideBackground = () => {
    let {selectedBackground} = this.state
    this.props.setSlideBackground(selectedBackground)
  }

  render() {

    let {backgrounds, item} = this.props;
    let {selected} = this.state;
    let BCKS = "";
    let row = [];
    let fullArray = [];
    let that = this;

    let itemStyle = {border:'0.25vw', borderColor: '#d9e3f4', borderStyle:'solid',
        height: '3vmax', width: '5.33vmax', padding: '.1vmax'}
    let itemSelectedStyle = {border:'0.25vw', borderColor: '#4286f4', borderStyle:'solid',
            height: '3vmax', width: '5.33vmax', padding: '.1vmax'}


    if(backgrounds){
      if(backgrounds.length > 0){

        for(var i = 0; i < backgrounds.length; i+=5){
          for(var j = i; j < i+5; ++j){
            if(backgrounds[j])
              row.push(backgrounds[j]);
          }
          fullArray.push(row);
          row = [];
        }

        BCKS = fullArray.map((element, index) => {
          let row = element.map(function (pic, i){
            let itemSelected = (index*5 + i === selected);
            return(
              <div key={index*5+i}>
                <img onClick={ () => that.selectBackground(index*5+i)}
                  style={itemSelected ? itemSelectedStyle: itemStyle} alt={pic.name} src={pic.image.src}/>
              </div>
            )
          })
          return (
            <div style={{display:'flex', paddingBottom:'1vh'}} key={index}> {row}</div>
          );

      })
      }
    }


    return (
      <div>
        <div style={{position:'fixed', zIndex:3, right:'0.5%', top:'10.5%',
          width:'36vw', height: '45vh', backgroundColor:"#d1d1d1", padding:'1%'}}>
          <div style={{display:'flex'}}>
            <button style={{width: '7vw'}} onClick={this.displayImage}>Display Image</button>
            <button style={{marginLeft:'1%', width: '9vw'}} onClick={this.setItemBackground}>Set Item Background</button>
            {item.type==='song' &&<button style={{marginLeft:'1%', width: '10vw'}} onClick={this.setSlideBackground}>Set Slide Background</button>}
          </div>
          <div style={{overflowY: 'scroll', height: '94%', margin:'2.5%'}}>{BCKS}</div>
        </div>

      </div>
    )
  }

}
