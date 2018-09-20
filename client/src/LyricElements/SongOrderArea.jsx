import React, {Component} from 'react'
import deleteX from '../assets/deleteX.png';

export default class SongOrderArea extends Component{

  constructor(){
    super();
    this.state = {
      mouseX: 0,
      mouseY: 0,
      indexBeingDragged:-1,
      mouseDown: false,
    }
  }


  addSection = () => {
    let {songOrder, songIndex, newType} = this.props;
    songOrder.splice(songIndex+1, 0, newType);
    this.props.updateSongOrder(songOrder)
    this.props.updateSongIndex(songIndex+1)
  }

  changeNewType = (e) => {
    let newType = e.target.value;
    this.props.updateNewType(newType);
  }

  releaseElement = () => {
    clearTimeout(this.checkHeld)
    this.setState({indexBeingDragged: -1,mouseDown: false})
  }

  setElement = (index) => {
    this.props.updateSongIndex(index)
    this.setState({mouseDown: true})

    this.checkHeld = setTimeout(function() {
      let {mouseDown} = this.state;
      if(mouseDown){
        this.setState({indexBeingDragged: index})
      }

    }.bind(this), 350);

  }

  setTarget = (index) => {
    let {indexBeingDragged} = this.state;
    if((indexBeingDragged !== -1) && (indexBeingDragged !== index)){
      this.insertSongIntoOrder(index);
      this.setState({indexBeingDragged: index})
    }
  }

  updateMouse = (e) => {
    this.setState({ mouseX: e.clientX, mouseY: e.clientY})
  }

  render(){
    let {songOrder, songIndex, sectionsPresent, newType} = this.props;
    let {indexBeingDragged, mouseX, mouseY} = this.state;

    let style;
    let songStyle = {width: "10vw", border:'0.1vmax', borderColor: '#b7b7b7', borderStyle:'solid',
        textAlign: 'center'}
    let songDraggedStyle = {width: "10vw", position:'fixed', left:(mouseX +2) + 'px',
        top: (mouseY + 2) + 'px', border:'0.1vmax', borderColor: '#b7b7b7', borderStyle:'solid',
        textAlign: 'center'};

    let buttonStyle = {fontSize: "calc(8px + 0.4vw)", margin:"1vw", backgroundColor:'#383838',
       border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white', padding:'0.5vw'}

    let songOrderDiv = {display:'flex', padding:'1vmax', userSelect:'none', width: '75%', margin: 'auto'};
    let songOrderSelected = Object.assign({}, songOrderDiv);
    songOrderSelected.borderBottom = '0.5vh solid #06d1d1';

    let SO = songOrder.map((element, index) => {

      let beingDragged = (indexBeingDragged === index)
      if(beingDragged){
        style = songDraggedStyle;
      }
      if(!beingDragged){
        style = songStyle
      }
      return(
        <div style={(index === songIndex) ? songOrderSelected : songOrderDiv} key={index}>
          <div style={style}
            onMouseDown={() => this.setElement(index)}
            onMouseOver={() => this.setTarget(index)}>
            {element}
          </div>
          {beingDragged && <div style={songStyle}></div>}
          <img className='imgButton' style={{display:'block', width:'1.5vmax', height:'1.5vmax', paddingLeft:"2%"}}
             onClick={() => this.props.deleteSectionFromOrder(index)}
             alt="delete" src={deleteX}
            />
        </div>
      )
    })

    return(
      <div style={{borderBottom: '0.1vw #a5a5a5 solid', height: "85vh", width:"17vw"}}>
        <div style={{paddingLeft:'1vmax', overflowX: 'hidden', height: '90%'}}>
          <div style={{fontSize: "calc(10px + 0.65vmax)", textAlign: 'center',
            marginBottom: '0.65vh'}}>Song Order</div>
          <div style={{fontSize: "calc(8px + 0.4vmax)"}}
            onMouseMove={this.updateMouse} onMouseUp={this.releaseElement}
            onMouseLeave={this.releaseElement}>{SO}</div>
        </div>
        <div style={{display:'flex', height: '8vh'}}>
          <select style={{...buttonStyle, padding:'0.25vw'}}
            value={newType} onChange={(e) => (this.changeNewType(e))}>
            {sectionsPresent.map((element, index) =>
              <option key={index}> {element} </option>
            )}
          </select>
          <button style={{...buttonStyle, padding:'0.25vw'}}
            onClick={this.addSection}> Add Section </button>
        </div>
      </div>
    )
  }
}
