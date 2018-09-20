import React, {Component} from 'react';
import Bible from './Bible';
import {HotKeys} from 'react-hotkeys';
import closeIcon from '../assets/closeIcon.png'
import ExistingItems from './ExistingItems';

export default class AllItems extends Component {

  constructor(){
    super();
    this.state = {
      tab : 'Existing'
    }
    this.handlers = {
      'close': this.close,
      // 'nextField': this.nextField,
    }
  }

  componentDidMount(){
    this.setState({tab: this.props.tab})
  }

  close = () => {
    this.props.close();
  }

  render(){

    let {tab} = this.state;

    let tabNames = ['Existing', 'Song', 'Bible', 'Image', 'Video', 'Announcements'];

    let tabStyle = {width: '13.25vw', padding: '0 1vw', height: '5vh', borderLeft:'0.15vw solid #06d1d1',
      borderBottom:'0.15vw solid #c4c4c4', display: 'flex', alignItems: 'center', textAlign: 'center',
      opacity: 0.75};
    let tabSelected = Object.assign({}, tabStyle);
    tabSelected.opacity = 1;
    tabSelected.borderBottom ='0.15vw solid #06d1d1';
    tabSelected.backgroundColor = '#6b6a6a'

    let tabs = tabNames.map((element, index) => {
      let selected = element === tab;

      return(
        <div key={index} className='imgButton' style={selected ? tabSelected : tabStyle}
          onClick={() => this.setState({tab: element})}>{element}
        </div>
      )
    })

    let windowBackground = {position: 'fixed',top: 0, left:0, height: '100vh', width: '100vw',
      zIndex: 4, backgroundColor: 'rgba(62, 64, 66, 0.5)'}

    let style = {position:'fixed', zIndex:5, right:'1%', top:'1%', color:'white',
      width:'95vw', height: '93vh', backgroundColor:"#383838", padding:'1%', border: '0.1vw solid white',
      borderRadius: '1vw'}

    return(
      <HotKeys handlers={this.handlers} style={windowBackground}>
        <div style={style}>
          <div style={{display: 'flex'}}>
            {tabs}
            <img className='imgButton' style={{display:'block', width:'1.25vw', height:'1.25vw',
              padding: '0.25vh 0.25vw', position: 'absolute', right: '1vw'}}
               alt="closeIcon" src={closeIcon}
              onClick={this.close}
              />
          </div>
          {tab === 'Bible' && <Bible formatBible={this.props.formatBible}
          functions={this.props.functions} state={this.props.state} close={this.props.close}/>}
          {tab === 'Existing' && <ExistingItems functions={this.props.functions} state={this.props.state}/>}
        </div>
      </HotKeys>
    )
  }

}
