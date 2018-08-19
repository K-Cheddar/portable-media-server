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

    return(
      <div style={{height:'95vh'}}>
        <nav class="welcome" style={{fontSize: "calc(14px + 0.35vmax)"}}>
          <h1 style={{padding: '1%'}}>Welcome to Portable Media</h1>
            <p>
              This software is in Beta. Use Google Chrome for the best experience.
              Other browsers are not currently supported and functionality may be limited.
            </p>
          <ul style={{paddingLeft: '1%'}}>
           {/* Link components are used for linking to other views */}
            {!isMobile && <li><Link to="/fullview">Controller</Link></li>}
            {isMobile &&<li><Link to="/mobile">Controller</Link></li>}
            <li><Link to="/presentation">Presentation</Link></li>
            {/*<li><button style={{fontSize: "calc(14px + 0.35vmax)"}} onClick={this.start}>Start Bible</button></li>*/}
            {/*<li><button style={{fontSize: "calc(14px + 0.35vmax)"}} onClick={this.test}>Test</button></li>*/}
            {!this.props.isLoggedIn && <li><button style={{fontSize: "calc(14px + 0.35vmax)"}}><Link to="/login">Login</Link></button></li>}
            {this.props.isLoggedIn && <li><button style={{fontSize: "calc(14px + 0.35vmax)"}} onClick={this.props.logout}>Logout</button></li>}
          </ul>
         </nav>
      </div>
    )
  }

}
