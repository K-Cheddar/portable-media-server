import React, {Component} from 'react'

export default class DeleteConfirmation extends Component{

  render(){
    let {name} = this.props;
    let message = "Are you sure you want to delete?"
    let miniMessage = "This cannot be undone";

    let style = {
      position:'absolute',
      top:'45%',
      width:'100vw',
      right:0,
      backgroundColor:'#2f3133',
      zIndex: 10,
      color:'#FFF'
    }

    return(
      <div style={style}>
        <div style={{width:"50%", margin:'auto', textAlign:'center', fontSize: 'calc(11px + 1vmax)'}}>{name}</div>
        <div style={{width:"50%", margin:'auto', textAlign:'center',  fontSize: 'calc(10px + 0.7vmax)'}}>{message}</div>
        <div style={{width:"50%", margin:'auto', textAlign:'center',  fontSize: 'calc(9px + 0.6vmax)'}} >{miniMessage}</div>
        <div style={{width:"20%", margin:'auto', textAlign:'center', display:'flex'}}>
          <button style={{margin:'auto', fontSize: 'calc(10px + 0.7vmax)'}} onClick={this.props.confirm}>Delete</button>
          <button style={{margin:'auto', fontSize: 'calc(10px + 0.7vmax)'}} onClick={this.props.cancel}>Cancel</button>
        </div>

      </div>
    )

  }

}
