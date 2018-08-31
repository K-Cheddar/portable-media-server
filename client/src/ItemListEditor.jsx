import React, {Component} from 'react'
import deleteX from './assets/deleteX.png';
import edit from './assets/edit.png';
import add from './assets/addItem.png';
import check from './assets/check.png';
import cancel from './assets/cancel.png';
import duplicate from './assets/duplicate.png';
import DeleteConfirmation from './DeleteConfirmation'

export default class ItemListEditor extends Component{

  constructor(){
    super();

    this.state = {
      selectedIndex: -1,
      name: '',
      deleteOverlay: false,
      deleteIndex: -1,
      ailsSearch: '',
      ilsSearch: '',
      message: '',
    }

    this.messageDisplay = null;
  }

  updateAilsSearch = (event) => {
    this.setState({ailsSearch: event.target.value})
  }

  updateIlsSearch = (event) => {
    this.setState({ilsSearch: event.target.value})
  }

  confirm = (id) => {
    let {name} = this.state;
    let {itemLists, allItemLists} = this.props;
    let index = itemLists.findIndex(e => e.id === id)
    let indexAll = allItemLists.findIndex(e => e.id === id)
    itemLists[index].name = name;
    allItemLists[indexAll].name = name;
    this.props.updateState({ itemLists: itemLists, allItemLists: allItemLists })
    this.setState({selectedIndex: -1, name: ''})
  }

  openConfirmation = (name, id) => {
    let index = this.props.allItemLists.findIndex(e => e.id === id)
    this.setState({
      deleteOverlay: true,
      name: name,
      deleteIndex: index
    })
  }

  cancel = () => {
    this.setState({
      selectedIndex: -1,
      name: '',
      deleteOverlay: false,
      deleteIndex: -1
    })
  }

  editName = (event) => {
    this.setState({name: event.target.value})
  }

  edit = (index, name) => {
    this.setState({
      selectedIndex: index,
      name: name
    })
  }

  deleteList = (type, id) => {
    let {itemLists, allItemLists} = this.props;
    let {deleteIndex} = this.state;
    if(type==='one'){
      let index = itemLists.findIndex(e => e.id === id)
      if(index === -1)
        return
      itemLists.splice(index, 1);
      this.props.updateState({itemLists: itemLists})
    }
    if(type==='all'){
      let id = allItemLists[deleteIndex].id
      let index = itemLists.findIndex(e => e.id === id)
      this.props.deleteItemList(id)
      allItemLists.splice(deleteIndex, 1);
      if(index !== -1){
        itemLists.splice(index, 1);
      }
      this.props.updateState({
        itemLists: itemLists,
        allItemLists: allItemLists
      })
      this.setState({deleteOverlay: false})
    }

  }

  newItemList = () => {
    let {itemLists, allItemLists} = this.props;
    let id = allItemLists[allItemLists.length-1].id;
    let newNumber = parseInt(id.slice(-1), 10) + 1;
    let name = "Item List " + newNumber
    let newList = {id: name, name: name}
    itemLists.push(newList);
    allItemLists.push(newList);
    this.props.updateState({
      itemLists: itemLists,
      allItemLists: allItemLists
    })
    this.props.newItemList(newList);
    // DBUpdater.updateItemLists(this.state.db, itemLists, newList);
  }

  addToList = (name) => {
    let {itemLists, allItemLists} = this.props;
    let index = allItemLists.findIndex(e => e.name === name)
    let val = itemLists.find(e => e.id === allItemLists[index].id)
    if(val){
      this.setState({message: val.name + ' has already been added'});
      let that = this;
      clearTimeout(this.messageDisplay)
      this.messageDisplay = setTimeout(function(){
        that.setState({message:''})
      }, 3000)
      return;
    }
    let obj = {
      id: allItemLists[index].id,
      name: allItemLists[index].name
    }
    itemLists.push(obj)
    this.props.updateState({itemLists: itemLists, selectedItemList: obj})
    this.props.selectItemList(name)
  }

  render(){

    let {itemLists, allItemLists} = this.props;
    let {selectedIndex, name, deleteOverlay, ailsSearch, ilsSearch, message} = this.state;
    let buttonStyle={
      display:'block', margin:"0% 1% 0% 1%",width:'1.5vw', height:'1.5vw'
    }

    let filteredILS = [], filteredAILS = [];
    if(ilsSearch.length > 0){
      filteredILS = itemLists.filter(ele => ele.name.toLowerCase().includes(ilsSearch.toLowerCase()))
    }
    else{
      filteredILS = itemLists.slice(0);
    }
    if(ailsSearch.length > 0){
      filteredAILS = allItemLists.filter(ele => ele.name.toLowerCase().includes(ailsSearch.toLowerCase()))
    }
    else{
      filteredAILS = allItemLists.slice(0);
    }

    let ils = filteredILS.map((item, index) => {

      let selected = (selectedIndex === index);

      return(
        <div style={{display:'flex'}} key={index}>
          {!selected && <div style={{margin:"0% 1% 0% 1%", width: '80%'}}>{item.name}</div>}
          {selected &&
            <form style={{width: '80%', margin:"0% 1% 0% 1%"}} onSubmit={() => (this.confirm(item.name))}>
            <input style={{width: '100%'}} onChange={this.editName} value={name}/>
            </form>
          }
          {!selected && <img className='imgButton' style={buttonStyle}
           onClick={() => (this.edit(index, item.name))}
           alt="edit" src={edit}
           />}
          {!selected && <img className='imgButton' style={buttonStyle}
           onClick={() => (this.deleteList('one', item.id))}
           alt="delete" src={deleteX}
           />}
          {!selected && <img className='imgButton' style={buttonStyle}
            onClick={() => (this.props.duplicateList(item.id))}
            alt="duplicate" src={duplicate}
           />}
           {selected && <img className='imgButton' style={buttonStyle}
            onClick={() => (this.confirm(item.id))}
            alt="check" src={check}
            />}
           {selected && <img className='imgButton' style={buttonStyle}
            onClick={() => (this.cancel())}
            alt="cancel" src={cancel}
            />}
        </div>
      )
    })

    let ails = filteredAILS.map((item, index) => {
      return(
        <div style={{display:'flex'}} key={item.name}>
          <div style={{width: '80%'}}>{item.name}</div>
          <img className='imgButton' style={buttonStyle}
           onClick={() => (this.addToList(item.name))}
           alt="add" src={add}
           />
         <img className='imgButton' style={buttonStyle}
             onClick={() => (this.openConfirmation(item.name, item.id))}
             alt="delete" src={deleteX}
             />
        </div>
      )
    })

    let style={
      position:'absolute',
      zIndex:5,
      left:'25%',
      top:'15%',
      backgroundColor: '#EEE',
      boxShadow: '0 5px 10px rgb(0, 0, 0)',
      border: '1px solid #CCC',
      borderRadius: 3,
      padding: 10,
      height: '50vh',
      width: '40vw'
    }

    return(
      <div style={{position:'fixed', top:0, left:0, height:'100vh',
        zIndex: 4, backgroundColor:'rgba(62, 64, 66, 0.5)', width:'100vw'}}>
        <div style={style}>
          <div style={{display:'flex'}}>
            <div style={{width:'19vw', height: '40vh', overflowY: 'scroll'}}>
              <div>Loaded Item Lists</div>
              <input type='text' value={ilsSearch} onChange={this.updateIlsSearch}
                style={{width:'95%', padding:'1%'}}/>
              <div style={{paddingTop: '5%'}}>{ils}</div>
            </div>
            <div style={{width:'19vw', height: '40vh', overflowY: 'scroll'}}>
              <div>All Item Lists</div>
              <input type='text' value={ailsSearch} onChange={this.updateAilsSearch}
                style={{width:'95%', padding:'1%'}}/>
              <div style={{paddingTop: '5%'}}>{ails}</div>
            </div>
          </div>
          {message.length > 0 && <div style={{color: 'red', fontSize:"calc(7.5px + 0.35vw)"}}>{message}</div>}
          <div>
            <button onClick={this.props.close} style={{float:'right'}}>Close</button>
            <button onClick={this.newItemList} style={{float:'left'}}>New</button>
          </div>
        </div>
        {deleteOverlay &&
          <div style={{position:'fixed', top:0, left:0, height:'100vh', width:'100vw',
             zIndex: 9, backgroundColor:'rgba(62, 64, 66, 0.5)'}}>
             <DeleteConfirmation confirm={() => (this.deleteList('all'))}
               cancel={this.cancel} name={name}  />
        </div>}
      </div>
    )
  }
}
