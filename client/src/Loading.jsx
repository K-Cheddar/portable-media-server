import React, {Component} from 'react'

export default class Loading extends Component {

  render(){
    let {retrieved} = this.props;
    let percent = (Object.keys(retrieved).length/5).toFixed(2)*100;

    return(
      <div style={{position:'fixed', top:0, left:0, height:'100vh',
        zIndex: 10, backgroundColor:'rgba(62, 64, 66, 0.5)', width:'100vw'}}>
        <div style={{display: 'flex', position:'absolute', top:'45%', right:'45%'}}>
          <div style={{color: '#FFF', fontSize:"calc(15px + 1vw)", textAlign: 'center'}}>Loading Documents {percent}%</div>
          <div className="loader"></div>
        </div>
      </div>
    )
  }
}
