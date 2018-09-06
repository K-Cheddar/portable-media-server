import React, { Component } from 'react';
import {Link} from 'react-router-dom';
export default class Home extends Component {

  constructor(){
    super();
    this.state = {
      isMobile: false
    }

  }

  componentDidMount(){
    if( navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ){
      this.setState({isMobile: true})
    }
  }




  render(){

    let {isMobile} = this.state;
    let buttonStyle = {fontSize: "calc(14px + 0.5vmax)", margin:"1vw", backgroundColor:'#383838',
       border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white', padding:'0.5vw'}

    return(
      <div style={{height:'95vh'}}>
        <nav className="welcome" style={{fontSize: "calc(14px + 0.35vmax)"}}>
          <h1 style={{padding: '1%'}}>Welcome to Portable Media</h1>
            <div className='disclaimer'>
              This software is in Beta. Use Google Chrome for the best experience.
            </div>
            <div className='notesSection'>
              <div className='notesHeader'>
                Notes
              </div>
              <ul >
                <li className='notes' >If videos are choppy or don't play,&nbsp;
                  <a target="_blank" rel="noopener noreferrer"
                    href="https://www.technize.net/google-chrome-disable-hardware-acceleration/">disable hardware acceleration</a>
                </li>
                <li className='notes'>
                  'Direct Connect' works in Chrome and Firefox
                </li>
              </ul>
            </div>
          <ul style={{paddingLeft: '1%'}}>
           {/* Link components are used for linking to other views */}
            {!isMobile && <li><Link to="/fullview"><button style={buttonStyle}>Controller</button></Link></li>}
            {isMobile &&<li><Link to="/mobile"><button style={buttonStyle}>Controller</button></Link></li>}
            <li><Link to="/presentation"><button style={buttonStyle} onClick={this.props.setAsReceiver}>Presentation</button></Link></li>
            {/*<li><button style={{fontSize: "calc(14px + 0.35vmax)"}} onClick={this.start}>Start Bible</button></li>*/}
            {/*<li><button style={{fontSize: "calc(14px + 0.35vmax)"}} onClick={this.test}>Test</button></li>*/}
            {!this.props.isLoggedIn && <li><Link to="/login"><button style={{fontSize: "calc(14px + 0.35vmax)"}}>Login</button></Link></li>}
            {this.props.isLoggedIn && <li><button style={buttonStyle} onClick={this.props.logout}>Logout</button></li>}
          </ul>
         </nav>
      </div>
    )
  }

}
