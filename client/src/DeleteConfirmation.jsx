import React from 'react'

const DeleteConfirmation = function(props) {
  let {name} = props;
  let message = "Are you sure you want to delete?"
  let miniMessage = "This cannot be undone and will clear your undo history";

  let style = { position:'absolute', top:'45%', width:'100vw', right:0, backgroundColor:'#2f3133',
    zIndex: 10, color:'#FFF'
  }

  let buttonStyle = {fontSize: "calc(10px + 0.7vmax)", margin:"auto", backgroundColor:'#383838',
     border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white', padding:'0.25vw',
     width: '9vw'}

  let wordStyle = {width:"50%", margin:'auto', textAlign:'center'}
  let nameStyle = Object.assign({}, wordStyle);
  nameStyle.fontSize = '1.25vmax';
  let messageStyle = Object.assign({}, wordStyle);
  messageStyle.fontSize = '1vmax'
  let miniStyle = Object.assign({}, wordStyle);
  miniStyle.fontSize = '0.75vmax';
  miniStyle.color = '#f0f986'

  return(
    <div style={style}>
      <div style={nameStyle}>{name}</div>
      <div style={messageStyle}>{message}</div>
      <div style={miniStyle} >{miniMessage}</div>
      <div style={{width:"20%", margin:'auto', textAlign:'center', display:'flex'}}>
        <button style={buttonStyle} onClick={props.confirm}>Delete</button>
        <button style={buttonStyle} onClick={props.cancel}>Cancel</button>
      </div>
    </div>
  )


}
export default DeleteConfirmation
