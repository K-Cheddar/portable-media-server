import React, {Component} from 'react';
import edit from './assets/edit.png';
import check from './assets/check.png';
import cancel from './assets/cancel-icon.png';
import duplicate from './assets/duplicate.png';
import deleteX from './assets/deleteX.png';

export default class SongArrangements extends Component{
  constructor () {
    super();
    this.state = {
      name: '',
      editingIndex: -1,
    }
  }

  cancelArrangement = () => {
    this.setState({editingIndex: -1})
  }

  confirmName = (index, e) => {
    if(e)
      e.preventDefault()
    let {arrangements} = this.props;
    let {name} = this.state;
    arrangements[index].name = name;
    this.props.updateArrangements(arrangements)
    this.setState({editingIndex: -1})
  }

  duplicateArrangement = (element) => {
    let {arrangements} = this.props;
    let obj = {
      name: element.name + ' Copy',
      formattedLyrics: JSON.parse(JSON.stringify(element.formattedLyrics)),
      songOrder: JSON.parse(JSON.stringify(element.songOrder))
    }
    arrangements.push(obj);
    this.props.updateArrangements(arrangements)
  }

  editName = (event) => {
    this.setState({name: event.target.value})
  }

  selectToEdit = (index, name) => {
    this.setState({editingIndex: index, name: name})
  }

  deleteArrangement = (index) => {
    let {arrangements} = this.props;
    arrangements.splice(index, 1);
    this.props.updateArrangements(arrangements);
    this.props.selectArrangement(0);
  }

  render(){

    let {arrangements, selectedArrangement} = this.props;
    let {editingIndex, name} = this.state;

    let arrStyle = {display:'flex', marginBottom: '0.25vh', border: '0.1vw #b7b7b7 solid'}
    let arrSelected = Object.assign({}, arrStyle);
    arrSelected.border = '0.1vw #06d1d1 solid';
    let imageButtonStyle={display:'block', margin:"0% 1% 0% 1%",width:'1.5vw', height:'1.5vw'}

    let arrangementEditor = arrangements.map((element, index) => {
      let selectedToEdit = (editingIndex === index);
      let selected = selectedArrangement === index;
      let moreThanOne = arrangements.length > 1;
      return(
        <div style={selected ? arrSelected : arrStyle} key={index}>
          {!selectedToEdit && <div onClick={ () => (this.props.selectArrangement(index))}
            style={{margin:"0% 1% 0% 1%", width: '80%', textAlign: 'center'}}>
            {element.name}
          </div>}
          {selectedToEdit &&
            <form style={{width: '80%', margin:"0% 1% 0% 1%"}} onSubmit={(e) => (this.confirmName(index, e))}>
            <input style={{width: '100%'}} onChange={this.editName} value={name}/>
            </form>
          }
          {!selectedToEdit && <img className='imgButton' style={imageButtonStyle}
           onClick={() => (this.selectToEdit(index, element.name))}
           alt="edit" src={edit}
           />}
          {!selectedToEdit && <img className='imgButton' style={imageButtonStyle}
            onClick={() => (this.duplicateArrangement(element))}
            alt="duplicate" src={duplicate}
           />}
           {(!selectedToEdit && moreThanOne) && <img className='imgButton' style={imageButtonStyle}
            onClick={() => (this.deleteArrangement(index))}
            alt="delete" src={deleteX}
            />}
           {selectedToEdit && <img className='imgButton' style={imageButtonStyle}
            onClick={() => (this.confirmName(index))}
            alt="check" src={check}
            />}
           {selectedToEdit && <img className='imgButton' style={imageButtonStyle}
            onClick={() => (this.cancelArrangement())}
            alt="cancel" src={cancel}
            />}
        </div>
      )
    })

    return(
      <div style={{marginRight: '0.25vw'}}>
        <div style={{textAlign: 'center', fontSize: "calc(10px + 0.65vmax)",
          marginBottom: '0.65vh'}}>Arrangements</div>
        <div style={{backgroundColor: '#c4c4c4', color: 'black', fontSize:'1.15vw',
          height: '28vh', overflowX: 'hidden', border: '0.25vw #a5a5a5 solid', borderRadius:'0.5vw'}}>
          {arrangementEditor}
        </div>
      </div>
    )
  }
}
