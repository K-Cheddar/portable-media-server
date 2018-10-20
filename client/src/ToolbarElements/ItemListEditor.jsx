import React, {Component} from 'react'
import deleteX from '../assets/deleteX.png';
import edit from '../assets/edit.png';
import add from '../assets/addItem.png';
import check from '../assets/check.png';
import cancel from '../assets/cancel-icon.png';
import bookmark from '../assets/bookmark.png';
import closeIcon from '../assets/closeIcon.png'
import DeleteConfirmation from '../DeleteConfirmation'
import * as DateFunctions from '../HelperFunctions/DateFunctions'
import MakeUnique from '../HelperFunctions/MakeUnique';


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
      message: {msg: '', index: -1},
    }

    this.messageDisplay = null;
  }

  addToList = (id) => {
    let {itemLists, allItemLists, needsUpdate} = this.props;
    let index = allItemLists.findIndex(e => e.id === id);
    let name = allItemLists[index].name;
    let val = itemLists.find(e => e.id === allItemLists[index].id);
    if(val){
      let mes = {msg: val.name + ' has already been added', index: index}
      this.setState({message: mes});
      let that = this;
      clearTimeout(this.messageDisplay)
      this.messageDisplay = setTimeout(function(){
        let rmes = {msg: '', index: -1}
        that.setState({message: rmes})
      }, 3000)
      return;
    }
    let obj = {
      id: id,
      name: name
    }
    itemLists.push(obj)
    needsUpdate.updateItemLists = true;
    this.props.updateState({itemLists: itemLists, selectedItemList: obj})
    this.props.selectItemList(name)
  }

  cancel = () => {
    this.setState({
      selectedIndex: -1,
      name: '',
      deleteOverlay: false,
      deleteIndex: -1
    })
  }

  confirm = (id, e) => {
    if(e)
      e.preventDefault()
    let {name} = this.state;
    let {itemLists, allItemLists, needsUpdate} = this.props;
    let index = itemLists.findIndex(e => e.id === id)
    let indexAll = allItemLists.findIndex(e => e.id === id)
    name = MakeUnique({name: name, property: 'name', list: allItemLists});
    itemLists[index].name = name;
    allItemLists[indexAll].name = name;
    needsUpdate.updateItemLists = true;
    needsUpdate.updateAllItemLists = true;
    this.props.updateState({ itemLists: itemLists, allItemLists: allItemLists, needsUpdate: needsUpdate})
    this.setState({selectedIndex: -1, name: ''})
  }

  deleteList = (type, id) => {
    let {itemLists, allItemLists, needsUpdate} = this.props;
    let {deleteIndex} = this.state;
    if(type==='one'){
      let index = itemLists.findIndex(e => e.id === id)
      itemLists.splice(index, 1);
      if(itemLists.length > 0)
        this.props.selectItemList(itemLists[0].name)
      needsUpdate.updateItemLists = true;
      this.props.updateState({itemLists: itemLists, needsUpdate: needsUpdate})
    }
    if(type==='all'){
      let id = allItemLists[deleteIndex].id
      let index = itemLists.findIndex(e => e.id === id)
      this.props.deleteItemList(id)
      allItemLists.splice(deleteIndex, 1);
      if(index !== -1){
        itemLists.splice(index, 1);
      }
      needsUpdate.updateItemLists = true;
      needsUpdate.updateAllItemLists = true;
      this.props.updateState({itemLists: itemLists, allItemLists: allItemLists, needsUpdate: needsUpdate})
      this.setState({deleteOverlay: false})
    }

  }

  duplicateOutline = () => {
    let {allItemLists} = this.props;
    let index = allItemLists.findIndex(e => e.outline === true)
    console.log(index);
    if(index !== -1){
      this.props.duplicateList(allItemLists[index].id)
      console.log(allItemLists[index]);
    }
    else
      this.newItemList();
  }

  edit = (index, name) => {
    this.setState({
      selectedIndex: index,
      name: name
    })
  }

  editName = (event) => {
    this.setState({name: event.target.value})
  }

  newItemList = () => {
    let {itemLists, allItemLists, needsUpdate} = this.props;
    let id = allItemLists[allItemLists.length-1].id;
    let newNumber = parseInt(id.slice(-1), 10) + 1;
    let newId = "Item List " + newNumber;
    let name = DateFunctions.getDateofNextDay('Saturday');
    name = MakeUnique({name: name, property: 'name', list: allItemLists});
    let newList = {id: newId, name: name}
    itemLists.push(newList);
    allItemLists.push(newList);
    needsUpdate.updateItemLists = true;
    needsUpdate.updateAllItemLists = true;
    this.props.updateState({itemLists: itemLists, allItemLists: allItemLists, needsUpdate: needsUpdate})
    this.props.newItemList(newList);
  }

  openConfirmation = (name, id) => {
    let index = this.props.allItemLists.findIndex(e => e.id === id)
    this.setState({
      deleteOverlay: true,
      name: name,
      deleteIndex: index
    })
  }

  setAsOutline = (id) => {
    let {itemLists, allItemLists, needsUpdate} = this.props;
    for(let i = 0; i < itemLists.length; ++i){
        if(itemLists[i].id === id)
          itemLists[i].outline = true;
        else
          itemLists[i].outline = false;
    }
    for(let i = 0; i < allItemLists.length; ++i){
        if(allItemLists[i].id === id)
          allItemLists[i].outline = true;
        else
          allItemLists[i].outline = false;
    }
    needsUpdate.updateItemLists = true;
    needsUpdate.updateAllItemLists = true;
    this.props.updateState({itemLists: itemLists, allItemLists: allItemLists, needsUpdate: needsUpdate})
  }

  updateAilsSearch = (event) => {
    this.setState({ailsSearch: event.target.value})
  }

  updateIlsSearch = (event) => {
    this.setState({ilsSearch: event.target.value})
  }

  render(){

    let {itemLists, allItemLists} = this.props;
    let {selectedIndex, name, deleteOverlay, ailsSearch, ilsSearch, message} = this.state;

    let outlineName = 'Service Outline'
    let index = allItemLists.findIndex(e => e.outline === true)
    if(index !== -1)
      outlineName = allItemLists[index].name;
    if(outlineName.length > 18){
      outlineName = outlineName.substring(0, 19);
      outlineName+="...";
    }

    let imageButtonStyle={
      display:'block', margin:"0% 1% 0% 1%",width:'1.5vw', height:'1.5vw'
    }

    let itemStyle = {display:'flex', marginBottom: '0.15vh', border:'0.075vw', borderColor: '#383838',
    borderStyle: 'solid', borderRadius: '0.25vw', padding: '0.35vmax'};
    let outlineStyle = Object.assign({}, itemStyle);
    outlineStyle.borderColor = 'yellow';

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
        <div style={item.outline ? outlineStyle: itemStyle} key={index}>
          {!selected && <div style={{width: '70%'}}>{item.name}</div>}
          {selected &&
            <form style={{width: '70%', margin:"0% 1% 0% 1%"}} onSubmit={(e) => (this.confirm(item.id, e))}>
            <input style={{width: '100%'}} onChange={this.editName} value={name}/>
            </form>
          }
          {(!selected && !item.outline) && <img className='imgButton' style={imageButtonStyle}
             onClick={() => this.setAsOutline(item.id)}
             alt="bookmark" src={bookmark}
             />}
          {!selected && <img className='imgButton' style={imageButtonStyle}
           onClick={() => this.edit(index, item.name)}
           alt="edit" src={edit}
           />}
           {!selected && <img className='imgButton' style={imageButtonStyle}
            onClick={() => this.deleteList('one', item.id)}
            alt="delete" src={deleteX}
            />}
           {selected && <img className='imgButton' style={imageButtonStyle}
            onClick={() => this.confirm(item.id)}
            alt="check" src={check}
            />}
           {selected && <img className='imgButton' style={imageButtonStyle}
            onClick={() => this.cancel()}
            alt="cancel" src={cancel}
            />}
        </div>
      )
    })

    let ails = filteredAILS.map((item, index) => {
      return(
        <div key={item.name}>
          <div style={item.outline ? outlineStyle: itemStyle}>
            <div style={{width: '70%'}}>{item.name}</div>
            {!item.outline &&<img className='imgButton' style={imageButtonStyle}
              onClick={() => this.setAsOutline(item.id)}
              alt="bookmark" src={bookmark}
              />}
            <img className='imgButton' style={imageButtonStyle}
             onClick={() => this.addToList(item.id)}
             alt="add" src={add}
             />
           <img className='imgButton' style={imageButtonStyle}
               onClick={() => this.openConfirmation(item.name, item.id)}
               alt="delete" src={deleteX}
               />
          </div>
          {(message.msg.length > 0 && message.index === index) &&
            <div style={{color: '#f98b66', fontSize:"calc(7.5px + 0.35vw)"}}>{message.msg}</div>}
        </div>
      )
    })

    let style={
      position:'absolute',    zIndex:6,     left:'25%',     top:'15%',
      backgroundColor: '#383838',           boxShadow: '0 5px 10px rgb(0, 0, 0)',
      border: '0.1vw solid white',          borderRadius: '1vw',
      padding: 10,            height: '45vh',               width: '45vw',
      color: 'white'
    }

    let buttonStyle = {fontSize: "calc(7px + 0.4vw)", margin:"1vh 0.25vw", backgroundColor:'#383838',
       border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white', padding:'0.25vw',
       width: '9vw', display: 'flex', justifyContent: 'center', alignItems: 'center'}

    let windowBackground = {position: 'fixed',top: 0, left:0, height: '100vh', width: '100vw',
       zIndex: 5, backgroundColor: 'rgba(62, 64, 66, 0.5)'}

    return(
      <div style={windowBackground}>
        <div style={style}>
          <div style={{display:'flex'}}>
            <div style={{width:'21vw', height: '40vh'}}>
              <div style={{fontSize:'1.5vw'}}>Loaded Item Lists</div>
              <input type='text' value={ilsSearch} onChange={this.updateIlsSearch}
                style={{width:'95%', padding:'1%'}}/>
              <div style={{paddingTop: '5%', fontSize:'1.15vw', height: '75%', overflowX: 'hidden'}}>{ils}</div>
            </div>
            <div style={{width:'21vw', height: '40vh', marginLeft:'1vw'}}>
              <div style={{fontSize:'1.5vw'}}>All Item Lists</div>
              <input type='text' value={ailsSearch} onChange={this.updateAilsSearch}
                style={{width:'95%', padding:'1%'}}/>
              <div style={{paddingTop: '5%', fontSize:'1.15vw', height: '75%', overflowX: 'hidden'}}>{ails}</div>
            </div>
            <img className='imgButton' style={{display:'block', width:'1.25vw', height:'1.25vw',
              padding: '0.25vh 0.25vw', position: 'absolute', right: '1vw'}}
               alt="closeIcon" src={closeIcon}
              onClick={this.props.close}
              />
          </div>
          <div>
            <div>
            <button style={{...buttonStyle, float:'left'}} onClick={this.duplicateOutline}>
              <div>New</div>
              <div style={{fontSize: 'calc(5px + 0.3vw)', marginLeft: '0.15vw'}}>
                ({outlineName})</div>
            </button>
            <button style={{...buttonStyle, float:'left'}} onClick={this.newItemList}>
              <div>New</div>
              <div style={{fontSize: 'calc(5px + 0.3vw)', marginLeft: '0.15vw'}}>
                (Blank)</div>
            </button>
             </div>
          </div>
        </div>
        {deleteOverlay &&
          <div style={{position:'fixed', top:0, left:0, height:'100vh', width:'100vw',
             zIndex: 9, backgroundColor:'rgba(62, 64, 66, 0.5)'}}>
             <DeleteConfirmation confirm={() => this.deleteList('all')}
               cancel={this.cancel} name={name}  />
        </div>}
      </div>
    )
  }
}
