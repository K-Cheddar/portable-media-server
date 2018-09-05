import React, { Component } from 'react';

import textbox_full from './assets/textbox_full.png';
import textbox_leftHalf from './assets/textbox_leftHalf.png';
import textbox_lowerThird from './assets/textbox_lowerThird.png';
import textbox_match from './assets/textbox_match.png';
import textbox_midThird from './assets/textbox_midThird.png';
import textbox_rightHalf from './assets/textbox_rightHalf.png';
import textbox_upperThird from './assets/textbox_upperThird.png';

export default class TextBoxEditor extends Component {

  constructor(){
    super();
    this.state = {
      applyAll: false,
    }
  }

  textboxFull = () => {
    let {applyAll} = this.state;
    this.props.updateBoxPosition({x: 0, y: 0, width: 100, height: 100, applyAll: applyAll})
  }

  textboxLeftHalf = () => {
    let {applyAll} = this.state;
    this.props.updateBoxPosition({x: 0, y: 0, width: 54.5, height: 100, applyAll: applyAll})
  }

  textboxRightHalf = () => {
    let {applyAll} = this.state;
    this.props.updateBoxPosition({x: 45.5, y: 0, width: 54.5, height: 100, applyAll: applyAll})
  }

  textboxMatch = () => {
    let {applyAll} = this.state;
    this.props.updateBoxPosition({applyAll: applyAll, match:true})
  }

  textboxLowerThird = () => {
    let {applyAll} = this.state;
    this.props.updateBoxPosition({x: 0, y: 62, width: 100, height: 37.5, applyAll: applyAll})
  }

  textboxMidThird = () => {
    let {applyAll} = this.state;
    this.props.updateBoxPosition({x: 0, y: 31.5, width: 100, height: 37.5, applyAll: applyAll})
  }

  textboxUpperThird = () => {
    let {applyAll} = this.state;
    this.props.updateBoxPosition({x: 0, y: 0, width: 100, height: 37.5, applyAll: applyAll})
  }

  applyAll = () => {
    this.setState({applyAll: true})
  }

  applySelected = () => {
    this.setState({applyAll: false})
  }

  render(){

    return(
      <div style={{display: 'flex'}}>
        <div style={{width:'14vw'}}>
          <div style={{display:'flex'}}>
            <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
               alt="textbox_full" src={textbox_full} onClick={this.textboxFull}
              />
            <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
               alt="textbox_leftHalf" src={textbox_leftHalf} onClick={this.textboxLeftHalf}
              />
            <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
               alt="textbox_rightHalf" src={textbox_rightHalf} onClick={this.textboxRightHalf}
              />
            <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
               alt="textbox_match" src={textbox_match} onClick={this.textboxMatch}
              />
          </div>
          <div style={{display:'flex'}}>
            <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
               alt="textbox_lowerThird" src={textbox_lowerThird} onClick={this.textboxLowerThird}
              />
            <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
               alt="textbox_midThird" src={textbox_midThird} onClick={this.textboxMidThird}
              />
            <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
               alt="textbox_upperThird" src={textbox_upperThird} onClick={this.textboxUpperThird}
              />
          </div>
        </div>
        <div style={{width:'8vw'}}>
          <div style={{fontSize: "calc(5px + 0.35vw)", marginBottom: '3%'}} onClick={this.applyAll}>
            <input style={{width: '0.75vw'}} type="checkbox" readOnly checked={this.state.applyAll}/>
            Apply To All
          </div>
          <div style={{fontSize: "calc(5px + 0.35vw)"}} onClick={this.applySelected}>
            <input style={{width: '0.75vw'}} type="checkbox" readOnly checked={!this.state.applyAll}/>
            Apply Selected
          </div>
        </div>
      </div>
    )
  }


}
