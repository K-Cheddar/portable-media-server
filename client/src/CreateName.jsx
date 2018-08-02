import React from 'react';

export default class CreateName extends React.Component{

  constructor() {
    super();

    this.state = {
      name: "",
      message: "",
    }
  }

  componentDidMount(){
    this.setState({name: this.props.name})
    document.getElementById("nameChange").focus();
  }

  nameAvailable = () => {
      let {name} = this.state;
      var that = this;
      this.props.db.get(name).then(function(){
        that.setState({message: "Name Not Available"})
      }).catch(function(){
        that.setState({message: ""})
        that.props.close();
        that.addItem(name)
      })
    }

  nameChange = (event) => {
    this.setState({name: event.target.value})
  }

  submitName = (event) => {
    event.preventDefault();
    let {option} = this.props;
    if(option === 'edit'){
      this.editName()
    }
    if(option === 'create'){
      this.nameAvailable();
    }
    // this.props.submitName(this.state.name)
  }

  addItem = (name) =>{

    let {type} = this.props;

    let firstSlide = "";
    // let {backgrounds} = this.props;
    // let background = "";
    //
    // if (backgrounds[0])
    //   background = backgrounds[0].name

    if(type === 'song')
      firstSlide = name;


    let item = {
        "_id": name,
        "name": name,
        "slides": [
          {
            "type": 'Name',
            "boxes": [
              {"background": "",
               "fontSize": 4.5,
               "fontColor": 'rgba(255, 255, 255, 1)',
               "words": firstSlide,
              }
            ]
          }
        ],
        "formattedLyrics": [],
        "songOrder": [],
        "type": type
      }

      this.props.addItem(item);
    }

  editName = () => {

    let {name} = this.state;
    let {id, updateItem, db} = this.props;

    db.get(id).then(function(doc){
      doc.name = name;
      if(doc.type === 'song')
        doc.words[0].words = name;
      updateItem(doc);
    })
    this.props.close();
  }

  render(){
    let {message} = this.state;

    let style={
      position:'absolute',
      zIndex:5,
      left:'35%',
      top:'45%',
      backgroundColor: '#EEE',
      boxShadow: '0 5px 10px rgb(0, 0, 0)',
      border: '1px solid #CCC',
      borderRadius: 3,
      padding: 10
    }

      return (
        <div style={{position:'fixed', top:0, left:0, height:'100vh',
          zIndex: 4, backgroundColor:'rgba(62, 64, 66, 0.5)', width:'100vw'}}>
          <div style={style}>
          {(message.length > 0) && <div>{message}</div>}
          <form onSubmit={this.submitName}>
            <label>Item Name:</label>
              <input id="nameChange" type="text" value={this.state.name} onChange={this.nameChange}/>
              <button type="submit">
                Submit Name
              </button>
              <button onClick={this.props.close}>
                Cancel
              </button>
          </form>
          </div>
        </div>

      )
  }
}
